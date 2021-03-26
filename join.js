const fetch = require('node-fetch');
const fs = require('fs');
const config = require('./config');
const moment = require('moment-timezone')
moment.locale('id')

const airdropLog = JSON.parse(fs.readFileSync(config.airdropLogFile, 'utf8'));

async function getIdentity() {
    try {
        const request = await fetch("https://auth.dappradar.com/apiv4/users/identify", {
            method: "GET",
            headers: {
                accept: "application/json, */*",
                authorization: `${config.dappradarAuthorization}`,
                "cache-control": "no-cache"
            },
            mode: "cors",
            referrer: "https://dappradar.com/"
        })
        const response = await request.json()
        if (response) return response
    } catch (error) {
        throw new Error(error)
    }
};

async function getAirdrop() {
    try {
        const request = await fetch("https://backoffice.dappradar.com/airdrops?page=1&itemsPerPage=10", {
            headers: {
                accept: "application/json, */*",
                authorization: `${config.dappradarAuthorization || null}`,
                "cache-control": "no-cache"
            },
            mode: "cors",
            referrer: "https://dappradar.com/"
        })
        const response = await request.json()
        if (response) return response
    } catch (error) {
        throw new Error(error)
    }
}

async function getAirdropParticipants() {
    try {
        const request = await fetch(`https://backoffice.dappradar.com/airdrops/${airdropLog.id}/participants?page=1&itemsPerPage=50000`, {
            headers: {
                accept: "application/json, */*",
                authorization: `${config.dappradarAuthorization}`,
                "cache-control": "no-cache"
            },
            mode: "cors",
            referrer: "https://dappradar.com/"
        })
        const response = await request.json()
        if (response && response["hydra:member"]) return response["hydra:member"]
    } catch (error) {
        throw new Error(error)
    }
};

async function joinAirdrop(id, wallet, email) {
    try {const request = await fetch('https://backoffice.dappradar.com/participants', {
            method: 'POST',
            headers: {
                accept: "application/json, */*",
                authorization: `${config.dappradarAuthorization}`,
                "Content-Type": "application/json",
                "cache-control": "no-cache"
            },
            body: JSON.stringify({
                "airdrop": `/airdrops/${id}`,
                "wallet": wallet,
                "email": email
            }),
            referrer: "https://dappradar.com/"
        })
        const response = await request.json()
        if (response) return response
    } catch (error) {
        throw new Error(error)
    }
};

(async () => {
    const getAirdropList = await getAirdrop()
    const airdropList = getAirdropList["hydra:member"]
    const airdropData = airdropList[0]
    console.log("[+] Check Identity...")
    const { status, user: { email, wallet } } = await getIdentity()
    if (status !== "success") return console.error('[x] Check your Dappradar Auth!')
    console.log("[+] Check if it is listed on Airdrop "+airdropLog.id)
    const partisipan = await getAirdropParticipants()
    const isRegistered = partisipan.filter((x) => x.email == email).length >= 1
    const airdropStartDate = moment(airdropData.startDate).tz("Asia/Jakarta")
    const now = moment().tz("Asia/Jakarta")
    if(isRegistered) return console.error(`[x] Already registered on Airdrop ${airdropLog.id}`)
    if(now < airdropStartDate) return console.error(`[x] Airdrop ${airdropLog.id} registration time has not yet started!`)
    console.log("[+] Joining Airdrop "+airdropLog.id)
    const register = await joinAirdrop(airdropLog.id, wallet, email)
    if (!register.email && register.email !== email) return console.error("[x] Register Failed...")
    console.log(`[+] Successfully joined airdrop ${airdropLog.id}`)
})();