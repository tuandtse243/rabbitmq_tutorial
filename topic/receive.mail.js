const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://srnagwur:Yp9F6511DTXnjOChCA1Cm0SwUG9G7C8R@armadillo.rmq.cloudamqp.com/srnagwur';

const receiveEmail = async () => {
    try {
        //1. Create connect
        const conn = await amqplib.connect(amqp_url_cloud);
        //2. Create channel
        const channel = await conn.createChannel();

        //3. Create exchange
        const nameExchange = 'send_email';
        await channel.assertExchange(nameExchange, 'topic', {
            durable: false,
        })
        //4. Create queue to receive email
        const {
            queue
        } = await channel.assertQueue('', {
            exclusive: true
        })

        //5. Bind queue to exchange
        const args = process.argv.slice(2);  // đăng ký topic mà send.email đã tạo từ terminal (có thể dùng * or # để gán lên tên topic)
        if(!args.length){
            process.exit(0);
        }

        /*
            * có nghĩa là phù hợp với bất kì từ nào
            # khớp với 1 hoặc nhiều từ bất kì
            (dùng topic ăn nhau chỗ này)
        */

        console.log(`waiting for messages in ${queue} topic ${args}`);
        
        args.forEach( async key => {
            await channel.bindQueue(queue, nameExchange, key);
        })

        //6. consume email
        await channel.consume(queue, (msg) => {
            console.log(msg.fields.routingKey, msg.content.toString());
        });
    } catch (error) {
        console.error(error.message);
    }
}

receiveEmail();