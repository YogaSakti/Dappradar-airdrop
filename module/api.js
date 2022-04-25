/* eslint-disable max-params */
const rfetch = require('node-fetch-retry');
const fetch = require('node-fetch');

let defaultOptions = (method, auth = null, data = null) => ({
    method,
    headers: {
        accept: 'application/json, */*',
        authority: 'auth.dappradar.com',
        authorization: auth,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.37',
        origin: 'https://auth.dappradar.com',
        referer: 'https://auth.dappradar.com/'
    },
    body: data,
    redirect: 'follow'
})

const getAirdrop = (authorization) => fetch('https://backoffice.dappradar.com/airdrops?page=1&itemsPerPage=100', defaultOptions('GET', `Bearer ${authorization}`))
    .then((response) => response.json())
    .then((result) => result['hydra:member'])
    .catch((err) => err)

const getTotalAirdropParticipants = (authorization, id) => fetch(`https://backoffice.dappradar.com/airdrops/${id}/participants?page=1&itemsPerPage=1`, defaultOptions('GET', `Bearer ${authorization}`))
    .then((response) => response.json())
    .then((result) => result['hydra:totalItems'])
    .catch((err) => err)

const getAirdropParticipants = (authorization, id, page = 1, itemsPerPage = 10000) => fetch(`https://backoffice.dappradar.com/airdrops/${id}/participants?page=${page}&itemsPerPage=${itemsPerPage}`, defaultOptions('GET', `Bearer ${authorization}`))
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => err);

const getIdentity = (authorization) => fetch('https://auth.dappradar.com/apiv4/users/identify', defaultOptions('GET', `Bearer ${authorization}`))
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => err)

const getNonce = (address, token = null) => fetch(`https://auth.dappradar.com/apiv4/users/nonce/${address}`, defaultOptions('GET', token ? `Bearer ${token}` : token))
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => err)

const signAddress = (address, sign, nonce, token = null) => fetch(`https://auth.dappradar.com/apiv4/users/sign_metamask/${address}`, defaultOptions('POST', token ? `Bearer ${token}` : token, JSON.stringify({ 'signature': sign, 'message': `I am signing my one-time nonce: ${nonce}` })))
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => err)

module.exports = {
    getAirdrop,
    getAirdropParticipants,
    getTotalAirdropParticipants,
    getIdentity,
    getNonce,
    signAddress
};