const amqp = require('amqplib');
// nanti require fungsi save data dari controller

async function startConsumer(){
    try{
        const connection = await amqp.connect(
            process.env.RABBITMQ_URL
        );
        const channel = await connection.createChannel();

        const queue = 'sensor_data';
        const exchange = 'amq.topic';

        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, 'device.#');

        console.log('[MQTT Consumer] Menunggu pesan dari RabbitMQ');

        channel.consume(queue, async (msg) => {
            if(msg !== null){
                try{
                    const data = JSON.parse(msg.content.toString());
                    console.log('[MQTT Consumer] Data diterima: ', data);

                    if(!data.deviceId){
                        console.warn('[MQTT Consumer] Pesan ditolak: Tidak ada ID Device yang dikirimkan.');
                        channel.nack(msg, false, false);
                        return;
                    }

                    // await panggil fungsi dr controller buat save data

                    channel.ack(msg);
                } catch(error){
                    console.error('[MQTT Consumer] Error: ', error);

                    channel.nack(msg, false, false);
                } 
            }
        });

        connection.on('error', (err) => {
            console.error('[RabbitMQ] Koneksi error: ', err.message);
        });

        connection.on('close', () => {
            console.log('[RabbitMQ] Koneksi terputus. Reconnecting. . .');
            setTimeout(startConsumer, 5000);
        });
    } catch(error){
        console.error('[MQTT Consumer] Gagal memulai consumer: ', error);
        console.log('[MQTT Consumer] Mencoba menghubungkan kembali. . .');
        setTimeout(startConsumer, 5000);
    }
}

module.exports = { startConsumer };