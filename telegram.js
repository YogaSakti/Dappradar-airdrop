require('dotenv').config()
const api = require('./module/api');
const auth = require('./module/auth');
const db = require('./module/database');
const telegram = require('./module/telegram');
const { caption } = require('./utils/string')
const delay = require('delay');
const loginKey = process.env.LOGIN_KEY;

(async () => {
    console.log('[>] Login...')
    const { token } = await auth.login(loginKey)
    const dropStatus = await db.Status.find()
    const filteredDrops = dropStatus.filter((f) => f.noUpdateTelegram == false)
    if (filteredDrops.length == 0) return console.log('There is No Update!');
    for (let i = 0; i < filteredDrops.length; i++) {
        const drop = filteredDrops[i];
        const dropData = await db.Airdrop.findById(drop.id)
        // get unposted drop and post it
        if (!drop.posted && drop.started) {
            // wait till start before post
            const generatedCaption = caption(dropData)
            let dropParticipants = await api.getTotalAirdropParticipants(token, dropData.id)
            let eventStatus = drop.started ? drop.ended ? drop.winnerPicked ? 'Event has ended, check winners list' : 'Event has ended, picking winner...' : 'Join now!' : 'Be patient, event not yet started!'
            const inlineData = {
                id: drop.id,
                status: eventStatus,
                totalParticipants: dropParticipants
            }
                    
            await telegram.sendPost(dropData.featuredImgUrl, generatedCaption, inlineData)
                    .then((result) => {
                        result.ok ? console.log(`[POST] ${dropData.id}. ${dropData.title} | $${dropData.tokenAmount} ${dropData.tokenName} For ${dropData.winnersCount} Winner | ${eventStatus} | Participants: ${dropParticipants}`) : console.log(result.description);
                        
                        // update post status and msgid here
                        return db.Status.findByIdAndUpdate(drop.id, { posted: true, msgId: result.result.message_id }, { new: true })
                    })
                    .then((data) => console.log(`Sucess Update DB: ${data.id} Posted`))
                    .catch((err) => console.error(err));
        }   
            
        // get posted drop and update it
        if (drop.posted && drop.started) {
            if (!drop.ended) {
                // update total partisipan
                let dropParticipants = await api.getTotalAirdropParticipants(token, dropData.id)
                let eventStatus = drop.started ? drop.ended ? drop.winnerPicked ? 'Event has ended, check winners list' : 'Event has ended, picking winner...' : 'Join now!' : 'Be patient, event not yet started!'
                const inlineData = {
                    id: drop.id,
                    status: eventStatus,
                    totalParticipants: dropParticipants
                }
                await telegram.updatePost(drop.msgId, inlineData)
                                .then((result) => result.ok ? console.log(`[UPDATE] ${drop.id}. ${dropData.title} | $${dropData.tokenAmount} ${dropData.tokenName} For ${dropData.winnersCount} Winner | ${eventStatus} | Participants: ${dropParticipants}`) : console.log(result.description))
                                .catch((err) => console.error(err));
            } else {
                if (drop.noUpdateStatus) { // if No further update
                    let eventStatus = drop.started ? drop.ended ? drop.winnerPicked ? 'Event has ended, check winners list' : 'Event has ended, picking winner...' : 'Join now!' : 'Be patient, event not yet started!'
                    const inlineData = {
                        id: drop.id,
                        status: eventStatus
                    }
                                
                    await telegram.updatePost(drop.msgId, inlineData)
                                    .then((result) => result.ok ? console.log(`[Last] ${drop.id}. ${dropData.title} | $${dropData.tokenAmount} ${dropData.tokenName} For ${drop.winnersCount} Winner | ${eventStatus}`) : console.log(result.description))
                                    .catch((err) => console.error(err));
            
                    await db.Status.findByIdAndUpdate(drop.id, {
                        noUpdateTelegram: true 
                    }, { new: true })
                }

            }
        }
        
    }
    await delay(1000)
    db.disc()
})()