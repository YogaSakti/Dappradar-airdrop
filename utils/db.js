const low = require('lowdb')
const path = require('path')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(path.join(__dirname, `../db/airdrop.json`))
const db = low(adapter)

db.defaults({ data: [] }).write();

const get = () => db.get('data').value()

const find = (obj) => db.get('data').find(obj).value()

const isExist = (obj) => db.get('data').some(obj).value()

const add = (obj) => new Promise((resolve, reject) => {
    const find = isExist({id: obj.id})
    if (find) return reject('Already Exist')
    const insert = db.get('data').push(obj).write()
    if (!insert) return reject(insert)
    resolve(insert)
});

const update = (obj) => new Promise((resolve, reject) => {
    const find = isExist({id: obj.id})
    if (!find) return reject('Data Not Found')
    const update = db.get('data').find({id: obj.id}).assign(obj).write()
    if (!update) return reject(update)
    resolve(update)
});

const remove = (obj) => new Promise((resolve, reject) => {
    const find = isExist({id: obj.id})
    if (!find) return reject('Data Not Found')
    const remove = db.get('data').remove(obj).write()
    if (!remove) return reject(remove)
    return resolve(remove)
});

module.exports = {
    get,
    find,
    add,
    update,
    remove,
    isExist,
};

// (async () => {
//     try {
//         const adds = await find({
//         "id": 32,
//         "msg_id": 12345
//     })
//     console.log(adds)
//     } catch (error) {
//         console.error(error);
//     }
// })()