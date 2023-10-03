const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://srnagwur:Yp9F6511DTXnjOChCA1Cm0SwUG9G7C8R@armadillo.rmq.cloudamqp.com/srnagwur';

const receiveNoti = async () => {
    try {
        //1. Create connect
        const conn = await amqplib.connect(amqp_url_cloud);
        //2. Create channel
        const channel = await conn.createChannel();

        //3. Create exchange
        const nameExchange = 'video';
        await channel.assertExchange(nameExchange, 'fanout', {
            durable: false,
        })
        //4. create queue cùng với tên exchange mà postVideo sử dụng
        const { 
            queue  // name queue
        } = await channel.assertQueue('', {  // để '' thì hệ thống sẽ tự tạo tên queue cho mình
            exclusive: true  //tự động xóa queue khi không sử dụng nữa (tắt server)
        });

        console.log('queue created', queue);

        //5. Bind queue to exchange
        await channel.bindQueue(queue, nameExchange, '');

        await channel.consume(queue, (msg) => {
            console.log(msg.content.toString());
        }, {
            noAck: true
        })
    } catch (error) {
        console.error(error.message);
    }
}

receiveNoti();