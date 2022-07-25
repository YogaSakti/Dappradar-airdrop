/* eslint-disable max-params */
const fetch = require('node-fetch');

let defaultOptions = (method, auth = null, data = null) => ({
    method,
    headers: {
        accept: 'application/json, */*',
        authorization: auth,
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.37'
    },
    body: data,
    redirect: 'follow'
})

const urls = {
    base: 'aHR0cHM6Ly9iYWNrb2ZmaWNlLmRhcHByYWRhci5jb20v',
    auth: 'aHR0cHM6Ly9hdXRoLmRhcHByYWRhci5jb20v'
}

let getUrl = (data) => Buffer.from(data, 'base64').toString('ascii')

const getAirdrop = (authorization) => fetch(`${getUrl(urls.base)}airdrops?page=1&itemsPerPage=100`, defaultOptions('GET', `Bearer ${authorization}`))
    .then((response) => response.json())
    .then((result) => result['hydra:member'])
    .catch((err) => err)

const getTotalAirdropParticipants = (authorization, id) => fetch(`${getUrl(urls.base)}airdrops/${id}/participants?page=1&itemsPerPage=1`, defaultOptions('GET', `Bearer ${authorization}`))
    .then((response) => response.json())
    .then((result) => result['hydra:totalItems'])
    .catch((err) => err)

const getAirdropParticipants = (authorization, id, page = 1, itemsPerPage = 10000) => fetch(`${getUrl(urls.base)}airdrops/${id}/participants?page=${page}&itemsPerPage=${itemsPerPage}`, defaultOptions('GET', `Bearer ${authorization}`))
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => err);

const getIdentity = (authorization) => fetch(`${getUrl(urls.auth)}apiv4/users/identify`, defaultOptions('GET', `Bearer ${authorization}`))
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => err)

const getNonce = (address, token = null) => fetch(`${getUrl(urls.auth)}apiv4/users/nonce/${address}`, defaultOptions('GET', token ? `Bearer ${token}` : token))
    .then((response) => response.json())
    .then((result) => result)
    .catch((err) => err)

const signAddress = (address, sign, nonce, token = null) => fetch(`${getUrl(urls.auth)}apiv4/users/sign_metamask/${address}`, defaultOptions('POST', token ? `Bearer ${token}` : token, JSON.stringify({ 'signature': sign, 'message': `I am signing my one-time nonce: ${nonce}` })))
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