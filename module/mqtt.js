require('dotenv').config()
const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://broker.hivemq.com', {
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    clean: true,
    port: 1883,
    connectTimeout: 4000,
    reconnectPeriod: 1000
})

const topic = process.env.MQTT_TOPIC;

client.on('connect', () => {
    client.subscribe([topic], () => {
        console.log('MQTT Subscribed to $$$$$$$')
        client.publish(topic, 'GH Action: Hello!')
    })
})


module.exports = {
    client,
    topic
}