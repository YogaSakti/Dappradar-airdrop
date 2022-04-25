const api = require('./api');
const Web3 = require('web3');
const web3 = new Web3('https://polygon-mainnet.infura.io/v3/827b88f0a48a4db993cabd8651c061f3');


const login = async (privKey) => {
    try {
        // init wallet
        const wallet = web3.eth.accounts.privateKeyToAccount(privKey)
        const { address } = wallet
    
    // get nonce
        const getNonce = await api.getNonce(address)
        if (getNonce.status != 'success') return { error: 'Failed fetching nonce!' }
        let { nonce } = getNonce

    // sign nonce
        const sign = await wallet.sign(`I am signing my one-time nonce: ${nonce}`, address)
        const { signature } = sign

    // send signature
        const sendSign = await api.signAddress(address, signature, nonce)
        if (sendSign.status != 'success') return { error: 'Failed send signature!' }

        return sendSign
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    login
}