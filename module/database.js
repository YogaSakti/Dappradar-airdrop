require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose');
const { Schema, model } = mongoose
const databaseUrl = process.env.DATABASE_URL;
mongoose.connect(`${databaseUrl}`, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) return console.error(`Error! ${error}`)
    console.log('DB: Connected!');
});

const AirdropSchema = new Schema({
    _id: { type: Number },
    id: { type: Number },
    title: { type: String },
    amountTitle: { type: String },
    shortDescription: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    featuredImgUrl: { type: String },
    tokenAmount: { type: Number },
    tokenName: { type: String },
    aboutTitle: { type: String },
    aboutText: { type: String },
    winnersListingDate: { type: String },
    status: { type: String },
    enabled: { type: Boolean },
    winnersCount: { type: Number },
    protocol: { type: String },
    requirements: [{ name: String, type: String }]
}, {
    versionKey: false
})

const StatusSchema = new Schema({
    _id: { type: Number },
    id: { type: Number },
    started: { type: Boolean },
    ended: { type: Boolean },
    winnerPicked: { type: Boolean },
    posted: { type: Boolean },
    msgId: { type: Number },
    noUpdateStatus: { type: Boolean },
    noUpdateTelegram: { type: Boolean } 
})

const Airdrop = model('airdrop', AirdropSchema, 'airdrop')
const Status = model('status', StatusSchema, 'status')

const disc = () => mongoose.disconnect()

module.exports.Airdrop = Airdrop
module.exports.Status = Status
module.exports.disc = disc