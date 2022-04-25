require('dotenv').config()
const api = require('./module/api');
const auth = require('./module/auth');
const db = require('./module/database');
const { isStarted, isEnded, isWinnerPicked } = require('./utils/string').airdrop
const delay = require('delay');
const loginKey = process.env.mainPrivateKey;

(async () => {
    console.log('[>] Login...')
    const { token } = await auth.login(loginKey)
    console.log('[>] Get Airdrop data...')
    let dropList = await api.getAirdrop(token)
    if (!Array.isArray(dropList)) return console.log('failed fetch airdrop list!')
    dropList = dropList.sort((a, b) => a.id - b.id)
    console.log('[>] Processing data...')
    for (let i = 0; i < dropList.length; i++) {
        const drop = dropList[i];
        // await db.Status.findByIdAndDelete(drop.id);
        let statusExist = await db.Status.exists({ _id: drop.id })
        if (!statusExist) {
            console.log(`Add Status: ${drop._id}`)
            await db.Status.create({
                _id: drop.id,
                id: drop.id,
                started: isStarted(drop.startDate),
                ended: isEnded(drop.endDate),
                winnerPicked: isWinnerPicked(drop.winnersListingDate),
                posted: false,
                msgId: 0,
                noUpdateStatus: Boolean(isEnded(drop.endDate) && isWinnerPicked(drop.winnersListingDate)),
                noUpdateTelegram: Boolean(isEnded(drop.endDate) && isWinnerPicked(drop.winnersListingDate))
            })
        } else {
            let dropStatus = await db.Status.findById(drop.id)
            if (dropStatus.noUpdateStatus == false) {
                console.log(`[UPDATE - ${drop.id}] ${drop.title} | Started: ${isStarted(drop.startDate)} | Ended: ${isEnded(drop.endDate)} | WinnerPicked: ${isWinnerPicked(drop.winnersListingDate)}`)
                await db.Status.findByIdAndUpdate(drop.id, {
                    started: isStarted(drop.startDate),
                    ended: isEnded(drop.endDate),
                    winnerPicked: isWinnerPicked(drop.winnersListingDate)
                }, { new: true })

                if (dropStatus.started && dropStatus.ended) {
                    console.log(`[ENDED - ${drop.id}] ${drop.title}`)
                    await db.Status.findByIdAndUpdate(drop.id, { noUpdateStatus: true }, { new: true })
                }
            } 
            
        }
    } 
    await delay(2000)
    db.disc()
})()