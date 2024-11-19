const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

const RABBITMQ_URL = 'amqp://rabbitmq';
const QUEUE = 'products';

async function sendMessage(message) {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)));
    console.log('Sent message to queue:', message);
    await channel.close();
    await connection.close();
}

app.post('/product', async (req, res) => {
    const product = req.body;

    if (!product.id || !product.name) {
        return res.status(400).json({ error: 'Product must have id and name' });
    }

    res.status(200).json({ message: 'Product sent to queue', product });
    await sendMessage(product);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Producer app listening on port ${PORT}`);
});
