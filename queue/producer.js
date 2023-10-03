const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://srnagwur:Yp9F6511DTXnjOChCA1Cm0SwUG9G7C8R@armadillo.rmq.cloudamqp.com/srnagwur';

const sendQueue = async ({ msg }) => {
    try {
        //1. Create connect
        const conn = await amqplib.connect(amqp_url_cloud);
        //2. Create channel
        const channel = await conn.createChannel();
        //3. Create name queue
        const nameQueue = 'q1';
        //4. create queue
        await channel.assertQueue(nameQueue, {
            durable: false, // If set to true, message will be stored in queue if turn off server or restart
        });
        //5. send message to queue
        await channel.sendToQueue(nameQueue, Buffer.from(msg), {
            expiration: '10000',  //TTL time to live (message will be expired after 10 seconds)
            persistent: true  // lưu queue vào ổ đĩa or cache
        });
        //6. close connection and channel

    } catch (error) {
        console.log(error);
    }
    
}

sendQueue({ msg: 'Hello RabbitMQ' });