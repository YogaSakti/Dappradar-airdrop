const api = require('./api');
const { load } = require('./wallet');


const login = async (privKey) => {
    try {
        // init wallet
        const wallet = load(privKey)
        const { address } = wallet

        // get nonce
        const getNonce = await api.getNonce(address)
        if (getNonce.status != 'success') return { error: 'Failed fetching nonce!' }
        let { nonce } = getNonce

        // sign nonce
        const sign = wallet.sign(`I am signing my one-time nonce: ${nonce}`)
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