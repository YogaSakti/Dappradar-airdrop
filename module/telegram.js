/* eslint-disable no-prototype-builtins */
require('dotenv').config()
const fetch = require('node-fetch')
const FormData = require('form-data');

const token = process.env.botToken;
const channelID = process.env.channelId;

const sendPost = (bannerUrl, caption, data) => new Promise((resolve, reject) => {
    const body = new FormData()
    const inline = [[{ 'text': data.status, 'url': `https://dappradar.com/hub/airdrops/${data.id}` }]]
    if (data.hasOwnProperty('totalParticipants')) {
        inline.push([{ 'text': `Total Participant: ${data.totalParticipants}`, 'url': `https://dappradar.com/hub/airdrops/${data.id}` }])
    }
    body.append('photo', bannerUrl);
    body.append('caption', caption);
    body.append('reply_markup', JSON.stringify({
        'inline_keyboard': inline
    }));
    
    fetch(`https://api.telegram.org/bot${token}/sendPhoto?chat_id=${channelID}&parse_mode=html&disable_web_page_preview=true`, { method: 'POST', body })
    .then((response) => response.json())
    .then((result) => resolve(result))
    .catch((err) => reject(err))
})

const updatePost = (msgId, data) => new Promise((resolve, reject) => {
    const body = new FormData()
    const inline = [[{ 'text': data.status, 'url': `https://dappradar.com/hub/airdrops/${data.id}` }]]
    if (data.hasOwnProperty('totalParticipants')) {
        inline.push([{ 'text': `Total Participant: ${data.totalParticipants}`, 'url': `https://dappradar.com/hub/airdrops/${data.id}` }])
    }
    body.append('reply_markup', JSON.stringify({
        'inline_keyboard': inline
    }));

    fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup?chat_id=${channelID}&message_id=${msgId}`, { method: 'POST', body })
    .then((response) => response.json())
    .then((result) => resolve(result))
    .catch((err) => reject(err))
})

module.exports = {
    sendPost,
    updatePost
}