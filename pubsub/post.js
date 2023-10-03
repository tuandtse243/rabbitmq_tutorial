const amqplib = require('amqplib');

const amqp_url_cloud = 'amqps://srnagwur:Yp9F6511DTXnjOChCA1Cm0SwUG9G7C8R@armadillo.rmq.cloudamqp.com/srnagwur';

const postVideo = async ({ msg }) => {
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
        //4. publish video
        await channel.publish(nameExchange, '', Buffer.from(msg));

        console.log('video published', msg);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 2000)
    } catch (error) {
        console.error(error.message);
    }
}

postVideo({ msg: 'Notify by fanout architechture' });