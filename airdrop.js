require('dotenv').config()
const api = require('./module/api');
const auth = require('./module/auth');
const db = require('./module/database');
const delay = require('delay');
const { client: mqttClient, topic } = require('./module/mqtt');

const loginKey = process.env.LOGIN_KEY;

(async () => {
    console.log('[>] Login...')
    const { token } = await auth.login(loginKey)
    console.log('[>] Get Airdrop data...')
    let dropList = await api.getAirdrop(token)
    if (!Array.isArray(dropList)) return console.log('failed fetch airdrop list!')
    dropList = dropList.sort((a, b) => a.id - b.id)
    const airdrops = await db.Airdrop.find({})

    let mqttData

    console.log('[>] Processing New data...')
    const dropNotExists = [...dropList.filter((y) => !airdrops.some((x) => x.id == y.id))]
    if (dropNotExists.length >= 1) {
        for (let i = 0; i < dropNotExists.length; i++) {
            const drop = dropNotExists[i];
            drop._id = drop.id
            console.log(`[NEW - ${drop.id}] ${drop.title} | $${drop.tokenAmount} ${drop.tokenName} For ${drop.winnersCount} Winner`)
            await db.Airdrop.create(drop).then((data) => console.log(`Sucess Add: ${data._id}`)).catch((err) => console.error(err));
        
            // create mqtt data
            mqttData = drop
            mqttData.command = '#airdrop'
        }
    }

    console.log('[>] Processing Old data...')
    const dropExists = [...dropList.filter((y) => airdrops.some((x) => x.id == y.id))]
    if (dropExists.length >= 1) {
        for (let i = 0; i < dropExists.length; i++) {
            const drop = dropExists[i];
            console.log(`[EXIST - ${drop.id}] ${drop.title} | $${drop.tokenAmount} ${drop.tokenName} For ${drop.winnersCount} Winner`)
            // db.Airdrop.findByIdAndDelete(drop.id, (_err, data) => console.log(`Sucess Delete: ${data}`));
        }
    }

    // for (let i = 0; i < dropList.length; i++) {
    //     const drop = dropList[i];
    //     drop._id = drop.id
    //     // drop.multidelete('id', '@id', '@type', 'airdropItemImgUrl', 'featuredImg', 'airdropItemImg', 'participants')

    //     let exist = await db.Airdrop.exists({ _id: drop._id })
    //     if (!exist) {
    //         console.log(`[NEW - ${drop.id}] ${drop.title} | $${drop.tokenAmount} ${drop.tokenName} For ${drop.winnersCount} Winner`)
    //         await db.Airdrop.create(drop).then((data) => console.log(`Sucess Add: ${data._id}`)).catch((err) => console.error(err));
    //     } else {
    //         console.log(`[EXIST - ${drop.id}] ${drop.title} | $${drop.tokenAmount} ${drop.tokenName} For ${drop.winnersCount} Winner`)
    //         // db.Airdrop.findByIdAndDelete(drop.id, (_err, data) => console.log(`Sucess Delete: ${data}`));
    //     } 
    // } 
    
    if (mqttData && mqttClient.connected) {
        console.log('[>] Sending MQTT data...')
        mqttClient.publish(topic, JSON.stringify(mqttData))
    }
    
    console.log('[>] Disconnecting...')
    await delay(1000)
    mqttClient.end({ force: true })
    db.disc()
})()