/* eslint-disable no-multi-assign */
/* eslint-disable no-implicit-globals */
/* eslint-disable no-undef */
/* eslint-disable no-extend-native */
/* eslint-disable prefer-spread */
/* eslint-disable require-unicode-regexp */

const moment = require('moment-timezone');

const caption = (data) => {
    let startDate = moment(data.startDate).tz('Etc/UTC');
    let endDate = moment(data.endDate).tz('Etc/UTC');
    let listingDate = moment(data.winnersListingDate).tz('Etc/UTC');

    return `📢 <b>${data.title}, ${data.shortDescription}</b>
    
🎉 Reward: <b>$${data.tokenAmount} ${data.tokenName}</b> <i>Per Winner</i>
⭐️ Total Winner: ${data.winnersCount}
💰 Wallet: ${data.requirements[0]} (${data.protocol.toUpperCase()})

${data.aboutTitle}
${data.aboutText}

Save the Date: 
📆 Start: ${startDate.format('LLL')} UTC
📆 End  : ${endDate.format('LLL')} UTC
` 
};

const airdrop = {
    isStarted: (startDate) => moment(startDate) < moment(),
    isEnded: (endDate) => moment(endDate) < moment(),
    isWinnerPicked: (winnersListingDate) => moment(winnersListingDate) < moment()
}

Object.defineProperty(Object.prototype, 'multidelete', {
    value () {
        for (let i = 0; i < arguments.length; i++) {
            // eslint-disable-next-line prefer-rest-params
            delete this[arguments[i]];
        }
    }
});

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    
    return true;
}

module.exports = {
    caption,
    airdrop,
    isJsonString
}
