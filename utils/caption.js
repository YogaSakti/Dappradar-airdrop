const moment = require('moment-timezone')
module.exports = caption = (airdropData) => {
    let startDate = moment(airdropData.startDate).tz("Asia/Jakarta");
    let endDate = moment(airdropData.endDate).tz("Asia/Jakarta");
    let listingDate = moment(airdropData.winnersListingDate).tz("Asia/Jakarta");

    return `📢 <b>${airdropData.title}, ${airdropData.shortDescription}</b>
    
🎉 Reward           : <b>${airdropData.tokenAmount / airdropData.winnersCount} ${airdropData.tokenName}</b> <i>Per Winner</i>
⭐️ Total Winner : ${airdropData.winnersCount}
💰 Wallet              : ${airdropData.requirements[0]} (${airdropData.protocol.toUpperCase()})

${airdropData.aboutTitle}
${airdropData.aboutText}

📆 Start Date   : ${startDate.format('LLL')} (GMT+7)
📆 End Date     : ${endDate.format('LLL')} (GMT+7)
📄 Listing Date : ${listingDate.format('LLL')} (GMT+7)
`}