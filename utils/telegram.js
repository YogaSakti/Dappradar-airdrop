const fetch = require('node-fetch')
const FormData = require('form-data');
const env = require('../config')

const sendPost = (bannerUrl, caption, data) => new Promise((resolve, reject) => {
    const body = new FormData()
    body.append("photo", bannerUrl);
    body.append("caption", caption);
    body.append("reply_markup", JSON.stringify({
        "inline_keyboard": [
            [{
                "text": data.status,
                "url": "https://dappradar.com/hub/airdrops/" + data.id
            }],
            [{
                "text": "Total Participant: "+ data.totalParticipants,
                "url": "https://dappradar.com/hub/airdrops/" + data.id
            }]
        ]
    }));
    fetch(`https://api.telegram.org/bot${env.botToken}/sendPhoto?chat_id=${env.channelId}&parse_mode=html&disable_web_page_preview=true`, {
            method: 'POST',
            body: body,
        }).then((response) => response.json())
        .then((result) => resolve(result))
        .catch((err) => reject(err))
})

const updatePost = (msgId, data) => new Promise((resolve, reject) => {
    const body = new FormData()
    body.append("reply_markup", JSON.stringify({
        "inline_keyboard": [
            [{
                "text": data.status,
                "url": "https://dappradar.com/hub/airdrops/" + data.id
            }],
            [{
                "text": "Total Participant: "+ data.totalParticipants,
                "url": "https://dappradar.com/hub/airdrops/" + data.id
            }]
        ]
    }));
    fetch(`https://api.telegram.org/bot${env.botToken}/editMessageReplyMarkup?chat_id=${env.channelId}&message_id=${msgId}`, {
        method: 'POST',
        body: body,
    }).then((response) => response.json())
    .then((result) => resolve(result))
    .catch((err) => reject(err))
})

module.exports = {
    sendPost,
    updatePost
}