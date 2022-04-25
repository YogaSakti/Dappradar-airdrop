const AlchemyWeb3 = require('@alch/alchemy-web3');
const web3 = AlchemyWeb3.createAlchemyWeb3('https://apis.ankr.com/c1613f5c0d4949f1a65a18a3131fd04d/e1d970fa3f738d79b2ceabc31d5a3c49/eth/fast/main');

module.exports = {
    create: () => web3.eth.accounts.create(),
    load: (privKey) => web3.eth.accounts.privateKeyToAccount(privKey)
}