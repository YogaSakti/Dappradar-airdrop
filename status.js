require('dotenv').config()
const api = require('./module/api');
const auth = require('./module/auth');
const db = require('./module/database');
const { isStarted, isEnded, isWinnerPicked } = require('./utils/string').airdrop
const delay = require('delay');
const loginKey = process.env.LOGIN_KEY;

(async () => {
    console.log('[>] Login...')
    const { token } = await auth.login(loginKey)
    console.log('[>] Get Airdrop data...')
    let dropList = await api.getAirdrop(token)
    if (!Array.isArray(dropList)) return console.log('failed fetch airdrop list!')
    dropList = dropList.sort((a, b) => a.id - b.id)
    const status = await db.Status.find()

    console.log('[>] Processing New data...')
    const statusNotExist = [...dropList.filter((y) => !status.some((x) => y.id == x.id))]
    if (statusNotExist.length >= 1) {
        for (let i = 0; i < statusNotExist.length; i++) {
            const drop = statusNotExist[i];
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
        }
    } 

    console.log('[>] Processing Old data...')
    const statusExist = [...status.filter((y) => dropList.some((x) => x.id == y.id))]
    if (statusExist.length >= 1) {
        const filteredStatus = statusExist.filter((f) => !f.noUpdateStatus)
        for (let i = 0; i < filteredStatus.length; i++) {
            const dropStatus = filteredStatus[i];
            const drop = dropList.find((d) => d.id == dropStatus.id);
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
    
    // for (let i = 0; i < dropList.length; i++) {
    //     const drop = dropList[i];
    //     // await db.Status.findByIdAndDelete(drop.id);
        
    //     const statusExist = await db.Status.exists({ _id: drop.id })
    //     if (!statusExist) {
    //         console.log(`Add Status: ${drop._id}`)
    //         await db.Status.create({
    //             _id: drop.id,
    //             id: drop.id,
    //             started: isStarted(drop.startDate),
    //             ended: isEnded(drop.endDate),
    //             winnerPicked: isWinnerPicked(drop.winnersListingDate),
    //             posted: false,
    //             msgId: 0,
    //             noUpdateStatus: Boolean(isEnded(drop.endDate) && isWinnerPicked(drop.winnersListingDate)),
    //             noUpdateTelegram: Boolean(isEnded(drop.endDate) && isWinnerPicked(drop.winnersListingDate))
    //         })
    //     } else {
    //         let dropStatus = await db.Status.findById(drop.id)
    //         if (dropStatus.noUpdateStatus == false) {
    //             console.log(`[UPDATE - ${drop.id}] ${drop.title} | Started: ${isStarted(drop.startDate)} | Ended: ${isEnded(drop.endDate)} | WinnerPicked: ${isWinnerPicked(drop.winnersListingDate)}`)
    //             await db.Status.findByIdAndUpdate(drop.id, {
    //                 started: isStarted(drop.startDate),
    //                 ended: isEnded(drop.endDate),
    //                 winnerPicked: isWinnerPicked(drop.winnersListingDate)
    //             }, { new: true })

    //             if (dropStatus.started && dropStatus.ended) {
    //                 console.log(`[ENDED - ${drop.id}] ${drop.title}`)
    //                 await db.Status.findByIdAndUpdate(drop.id, { noUpdateStatus: true }, { new: true })
    //             }
    //         } 
            
    //     }
    // } 
    await delay(500)
    db.disc()
})()