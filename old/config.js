require('dotenv').config()
module.exports = {
    botToken: process.env.botToken,
    channelId : process.env.channelId,
    dappradarAuthorization : process.env.dappradarAuthorization,
    airdropLogFile: process.env.logFile || 'lastAirdrop.json'
}