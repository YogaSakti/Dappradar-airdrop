require('dotenv').config()
const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://broker.emqx.io:1883', {
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000
})

const topic = process.env.MQTT_TOPIC;

client.on('connect', () => {
    console.log('MQTT Connected')
    client.subscribe([topic], () => {
        console.log('Subscribed to $$$$$$$')
    })
})


module.exports = {
    client,
    topic
}