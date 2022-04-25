/* eslint-disable no-multi-assign */
/* eslint-disable no-implicit-globals */
/* eslint-disable no-undef */
/* eslint-disable no-extend-native */
/* eslint-disable prefer-spread */
/* eslint-disable require-unicode-regexp */

const moment = require('moment-timezone');

const caption = (airdropData) => {
    let startDate = moment(airdropData.startDate).tz('Etc/UTC');
    let endDate = moment(airdropData.endDate).tz('Etc/UTC');
    let listingDate = moment(airdropData.winnersListingDate).tz('Etc/UTC');

    return `📢 <b>${airdropData.title}, ${airdropData.shortDescription}</b>
    
🎉 Reward: <b>$${airdropData.tokenAmount} ${airdropData.tokenName}</b> <i>Per Winner</i>
⭐️ Total Winner: ${airdropData.winnersCount}
💰 Wallet: ${airdropData.requirements[0]} (${airdropData.protocol.toUpperCase()})

${airdropData.aboutTitle}
${airdropData.aboutText}

Save the Date: 
📆 Start: ${startDate.format('LLL')} UTC
📆 End: ${endDate.format('LLL')} UTC
📄 Listing: ${listingDate.format('LLL')} UTC
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


module.exports = {
    caption,
    airdrop
}