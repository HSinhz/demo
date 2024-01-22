const amqplib = require('amqplib');

const {MESSAGE_BROKER_URL, EXCHANGE_NAME, AUTHOR_BINDING_KEY, ORDER_BIDNG_KEY, QUEUE_NAME, SEND_MAIL_KEY} = require('../config/db/rabbitMQ');
const receivedOTP = async () => {
    try {
        const data = {};
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, "direct", {durable: false});

        const { queue } = await  channel.assertQueue('', { exclusive: true});
        console.log( 'Queue: ', queue);

        channel.bindQueue( queue.queue, EXCHANGE_NAME, AUTHOR_BINDING_KEY);

        channel.consume( queue.queue, msg => {
           console.log('Received: ', msg.content.toString()); 
        }, {
            noAck: true
        })

        
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {
    receivedOTP: receivedOTP
}