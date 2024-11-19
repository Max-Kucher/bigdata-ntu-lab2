const amqp = require('amqplib');
const fs = require('fs');
const path = require('path');

const RABBITMQ_URL = 'amqp://rabbitmq';
const QUEUE = 'products';

async function consumeMessages() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);

    console.log('Waiting for messages...');
    channel.consume(QUEUE, (msg) => {
        if (msg !== null) {
            const product = JSON.parse(msg.content.toString());
            console.log('Received message:', product);

            const filePath = path.join(__dirname, 'data', `${product.id}.json`);
            fs.writeFileSync(filePath, JSON.stringify(product, null, 2));
            console.log(`Product saved to ${filePath}`);

            channel.ack(msg);
        }
    });
}

consumeMessages().catch(console.error);
