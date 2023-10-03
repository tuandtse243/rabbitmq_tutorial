const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://srnagwur:Yp9F6511DTXnjOChCA1Cm0SwUG9G7C8R@armadillo.rmq.cloudamqp.com/srnagwur';

const sendEmail = async () => {
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
        const args = process.argv.slice(2);   // truyền động value tên topic từ terminal
        const msg = args[1] || 'Fixed!'
        const topic = args[0]

        console.log(msg, topic);

        //4. publish email
        await channel.publish(nameExchange, topic, Buffer.from(msg));

        console.log('mail published', msg);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 2000)
    } catch (error) {
        console.error(error.message);
    }
}

sendEmail();