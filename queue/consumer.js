const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://srnagwur:Yp9F6511DTXnjOChCA1Cm0SwUG9G7C8R@armadillo.rmq.cloudamqp.com/srnagwur';

const receiveQueue = async () => {
    try {
        //1. Create connect
        const conn = await amqplib.connect(amqp_url_cloud);
        //2. Create channel
        const channel = await conn.createChannel();
        //3. Create name queue to receive
        const nameQueue = 'q1';
        //4. create queue
        await channel.assertQueue(nameQueue, {
            durable: true,
        });
        //5. receive message to queue
        await channel.consume(nameQueue, (msg) => {
            console.log(msg.content.toString());
        }, {
            noAck: true,  //trạng thái xác nhận là đã xử lý message trong queue hay chưa, nếu chưa nó vẫn còn trong queue và consumer khác có thể receive (giống như status)
        });
        //6. close connection and channel

    } catch (error) {
        console.log(error);
    }
    
}

receiveQueue();