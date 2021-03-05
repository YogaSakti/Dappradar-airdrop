const moment = require('moment-timezone')
const fetch = require('node-fetch')
const FormData = require('form-data');
const config = require('./config');
const fs = require('fs');
moment.locale('id')
moment.tz("Asia/Jakarta")

const airdropLog = JSON.parse(fs.readFileSync(config.airdropLogFile, 'utf8'))

function updateAirdropLog(id, totalParticipant, msgId) {
    try {
        let content = JSON.parse(fs.readFileSync(config.airdropLogFile, 'utf8'));
        content.id = id;
        content.totalParticipant = totalParticipant;
        if (msgId) content.msgId = msgId;
        fs.writeFileSync(config.airdropLogFile, JSON.stringify(content));
    } catch (error) {
        throw new Error(err)
    }
}

async function getAirdrop() {
    try {
        const request = await fetch("https://backoffice.dappradar.com/airdrops?page=1&itemsPerPage=100", {
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

async function getAirdropParticipants(id) {
    try {
        const request = await fetch(`https://backoffice.dappradar.com/airdrops/${id}/participants`, {
            headers: {
                accept: "application/json, */*",
                authorization: `${config.dappradarAuthorization}`,
                "cache-control": "no-cache"
            },
            mode: "cors",
            referrer: "https://dappradar.com/"
        })
        const response = await request.json()
        if (response && response["hydra:totalItems"]) return response["hydra:totalItems"]
    } catch (error) {
        throw new Error(error)
    }
}

async function sendNews(bannerUrl, caption, totalParticipant) {
    try {
        const formData = new FormData()
        formData.append("photo", bannerUrl);
        formData.append("caption", caption);
        formData.append("reply_markup", `{\"inline_keyboard\": [[{\"text\": \"Join Now!\",\"url\": \"https://dappradar.com/hub/airdrops\"}],[{\"text\": \"Total Participant: ${totalParticipant}\",\"url\":\"https://dappradar.com/hub/airdrops\"}]]}`);
        const request = await fetch(`https://api.telegram.org/bot${config.botToken}/sendPhoto?chat_id=${config.channelId}&parse_mode=html&disable_web_page_preview=true`, {
            method: 'POST',
            body: formData,
        })
        const response = await request.json()
        if (response) return response
    } catch (error) {
        throw new Error(error)
    }
}

async function updateParticipants(msgId, totalParticipant) {
    try {
        const formData = new FormData()
        formData.append("reply_markup", `{\"inline_keyboard\": [[{\"text\": \"Join Now!\",\"url\": \"https://dappradar.com/hub/airdrops\"}],[{\"text\": \"Total Participant: ${totalParticipant}\",\"url\":\"https://dappradar.com/hub/airdrops\"}]]}`);
        const request = await fetch(`https://api.telegram.org/bot${config.botToken}/editMessageReplyMarkup?chat_id=${config.channelId}&message_id=${msgId}`, {
            method: 'POST',
            body: formData,
        })
        const response = await request.json()
        if (response) return response
    } catch (error) {
        throw new Error(error)
    }
}

(async () => {
    try {
        const getAirdropList = await getAirdrop()
        const airdropList = getAirdropList["hydra:member"]
        const totalParticipants = await getAirdropParticipants(airdropList[0].id)
        
        if ((airdropLog.id < airdropList[0].id) && airdropList[0]?.enabled ) {
            console.log(`[NEW] ${airdropList[0].title} | ${airdropList[0].tokenAmount / airdropList[0].winnersCount} ${airdropList[0].tokenName} For ${airdropList[0].winnersCount} Winner`)
            let airdropData = airdropList[0]
            let airdropBanner = airdropList[0].featuredImgUrl
            let airdropText = `📢 <b>${airdropData.title}, ${airdropData.shortDescription}</b>\n🎉 Reward: <b>${airdropData.tokenAmount / airdropData.winnersCount} ${airdropData.tokenName}</b> <i>Per Winner</i>\n⭐️ Total Winner: ${airdropData.winnersCount}\n\n${airdropData.aboutTitle}\n${airdropData.aboutText}\n\nStart Date: ${moment(airdropData.startDate).format('LLL')}\nEnd Date: ${moment(airdropData.endDate).format('LLL')}\nListing Date: ${moment(airdropData.winnersListingDate).format('LLL')}`
            const sendMsg = await sendNews(airdropBanner, airdropText, totalParticipants)
            updateAirdropLog(airdropData.id, totalParticipants, sendMsg.result.message_id)
            if (sendMsg.ok) return console.log('[SUCCESS] Send Notification to ' + config.channelId)
        } else {
            console.log(`Nothing new...`)
            if (airdropLog.totalParticipant < totalParticipants) {
                updateAirdropLog(airdropList[0].id, totalParticipants)
                const requestUpdateParticipants = await updateParticipants(airdropLog.msgId, totalParticipants)
                if (requestUpdateParticipants) return console.log('[UPDATE] Participants Updated...')
            }
        }
    } catch (error) {
        console.error(error)
    }

})();