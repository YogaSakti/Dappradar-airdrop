/* eslint-disable max-params */
/* eslint-disable new-cap */
/*
*
*  ██████╗██╗      ██████╗ ██╗   ██╗██████╗ ███████╗██╗      █████╗ ██████╗ ███████╗██████╗     ██╗      ██████╗ ██╗         
* ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗██╔════╝██║     ██╔══██╗██╔══██╗██╔════╝╚════██╗    ██║     ██╔═══██╗██║         
* ██║     ██║     ██║   ██║██║   ██║██║  ██║█████╗  ██║     ███████║██████╔╝█████╗    ▄███╔╝    ██║     ██║   ██║██║         
* ██║     ██║     ██║   ██║██║   ██║██║  ██║██╔══╝  ██║     ██╔══██║██╔══██╗██╔══╝    ▀▀══╝     ██║     ██║   ██║██║         
* ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝██║     ███████╗██║  ██║██║  ██║███████╗  ██╗       ███████╗╚██████╔╝███████╗    
*  ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝  ╚═╝       ╚══════╝ ╚═════╝ ╚══════╝    
*
*/
const { isJsonString } = require('../utils/string');
const { CurlGenerator } = require('curl-generator')
const shell = require('shelljs');
const baseProgram = '/home/garuda/dappradar/curl_impersonate -sS'

const createCurlCommand = (url, method, authorization, body) => {
    const params = {
        url,
        method,
        headers: {
            authority: Buffer.from('YmFja29mZmljZS5kYXBwcmFkYXIuY29t', 'base64').toString('ascii'),
            pragma: 'no-cache',
            'cache-control': 'no-cache',
            authorization,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.58 Safari/537.36 Edg/89.0.774.34',
            dnt: '1',
            accept: '*/*',
            origin: Buffer.from('aHR0cHM6Ly9kYXBwcmFkYXIuY29t', 'base64').toString('ascii'),
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            referer: Buffer.from('aHR0cHM6Ly9kYXBwcmFkYXIuY29tLw', 'base64').toString('ascii'),
            'accept-language': 'en,id;q=0.9,en-US;q=0.8'
        },
        body,
        redirect: 'follow'
    }
    
    return CurlGenerator(params, { silent: true, compressed: true })
}

const urls = {
    base: 'aHR0cHM6Ly9iYWNrb2ZmaWNlLmRhcHByYWRhci5jb20v',
    baseNew: 'aHR0cHM6Ly9iYWNrb2ZmaWNlLW5ldy5kYXBwcmFkYXIuY29tLw',
    auth: 'aHR0cHM6Ly9hdXRoLmRhcHByYWRhci5jb20v'
}

let getUrl = (data) => Buffer.from(data, 'base64').toString('ascii')

const getAirdrop = (authorization) => {
    const command = createCurlCommand(`${getUrl(urls.baseNew)}airdrops?page=1&itemsPerPage=100`, 'GET', `Bearer ${authorization}`, null);
    const request = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
    
    let response = request
    if (isJsonString(request)) {
        response = JSON.parse(request)
    } 
    console.log(response.results);

    return response.results
}

const getTotalAirdropParticipants = (authorization, id) => {
    const command = createCurlCommand(`${getUrl(urls.baseNew)}airdrops/${id}/participants?page=1&itemsPerPage=1`, 'GET', `Bearer ${authorization}`)
    const request = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
    let response = request
    if (isJsonString(request)) {
        response = JSON.parse(request)
    } 

    return response['hydra:totalItems']
}

const getAirdropParticipants = (authorization, id, page = 1, itemsPerPage = 10000) => {
    const command = createCurlCommand(`${getUrl(urls.base)}airdrops/${id}/participants?page=${page}&itemsPerPage=${itemsPerPage}`, 'GET', `Bearer ${authorization}`)
    const request = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
    let response = request
    if (isJsonString(request)) {
        response = JSON.parse(request)
    } 

    return response
}

const getIdentity = (authorization) => {
    const command = createCurlCommand(`${getUrl(urls.auth)}apiv4/users/identify`, 'GET', `Bearer ${authorization}`)
    const request = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
    let response = request
    if (isJsonString(request)) {
        response = JSON.parse(request)
    } 

    return response
}

const getNonce = (address, token = '') => {
    const command = createCurlCommand(`${getUrl(urls.auth)}apiv4/users/nonce/${address}`, 'GET', token ? `Bearer ${token}` : token)
    const request = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
    let response = request
    if (isJsonString(request)) {
        response = JSON.parse(request)
    } 

    return response
}

const signAddress = (address, sign, nonce, token = '') => {
    const command = createCurlCommand(`${getUrl(urls.auth)}apiv4/users/sign_metamask/${address}`, 'POST', token ? `Bearer ${token}` : token, { 'signature': sign, 'message': `I am signing my one-time nonce: ${nonce}` })
    const request = shell.exec(`${baseProgram} ${command}`, { async: false, silent: true }).stdout;
    let response = request
    if (isJsonString(request)) {
        response = JSON.parse(request)
    } 

    return response
}

module.exports = {
    getAirdrop,
    getAirdropParticipants,
    getTotalAirdropParticipants,
    getIdentity,
    getNonce,
    signAddress
};