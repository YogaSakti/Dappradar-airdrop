const fetch = require('node-fetch');

let defaultOptions = (authorization = null) => ({
    headers: {
        accept: "application/json, */*",
        authorization: `Bearer ${authorization}`,
        "cache-control": "no-cache"
    },
    mode: "cors",
    referrer: "https://dappradar.com/"
})

const getAirdrop = (authorization) => new Promise((resolve, reject) =>
    fetch("https://backoffice.dappradar.com/airdrops?page=1&itemsPerPage=100", defaultOptions(authorization))
    .then((response) => response.json())
    .then((result) => resolve(result["hydra:member"]))
    .catch((err) => reject(err)))


const getAirdropParticipants = (authorization, id) => new Promise((resolve, reject) =>
    fetch(`https://backoffice.dappradar.com/airdrops/${id}/participants`, defaultOptions(authorization))
    .then((response) => response.json())
    .then((result) => resolve(result["hydra:totalItems"]))
    .catch((err) => reject(err))
)

 module.exports = {
    getAirdrop,
    getAirdropParticipants
 };
 