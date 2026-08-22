const amqp = require("amqplib");

const {
    monitorIndicator,
} = require("./airThreshold");

const {
    saveSensorData,
} = require("../controllers/sensorController");

const sensorIndicatorMap = {
    co2: "CO2",
    asap: "asap",
    co: "CO",
    debuHalus: "debu halus",
    suhu: "suhu",
    kelembaban: "kelembaban",
    ispu: "ISPU",
};

async function startConsumer() {
    try {
        const connection =
            await amqp.connect(
                process.env.RABBITMQ_URL
            );

        const channel =
            await connection.createChannel();

        const queue = "sensor_data";
        const exchange = "amq.topic";

        await channel.assertQueue(
            queue,
            {
                durable: true,
            }
        );

        await channel.bindQueue(
            queue,
            exchange,
            "device.#"
        );

        console.log(
            "[MQTT Consumer] Menunggu pesan dari RabbitMQ"
        );

        channel.consume(
            queue,
            async (msg) => {
                if (msg === null) {
                    return;
                }

                try {
                    const data =
                        JSON.parse(
                            msg.content.toString()
                        );

                    console.log(
                        "[MQTT Consumer] Data diterima:",
                        data
                    );

                    const savedData =
                        await saveSensorData(
                            data
                        );

                    console.log(
                        "[MQTT Consumer] Data berhasil disimpan:",
                        savedData
                    );

                    for (const [
                        sensorKey,
                        indicatorName,
                    ] of Object.entries(
                        sensorIndicatorMap
                    )) {
                        const value =
                            data[
                                sensorKey
                            ];

                        if (
                            value ===
                                undefined ||
                            value === null
                        ) {
                            continue;
                        }

                        await monitorIndicator(
                            indicatorName,
                            value
                        );
                    }

                    channel.ack(msg);
                } catch (error) {
                    console.error(
                        "[MQTT Consumer] Error:",
                        error
                    );

                    channel.nack(
                        msg,
                        false,
                        false
                    );
                }
            }
        );

        connection.on(
            "error",
            (error) => {
                console.error(
                    "[RabbitMQ] Koneksi error:",
                    error.message
                );
            }
        );

        connection.on(
            "close",
            () => {
                console.log(
                    "[RabbitMQ] Koneksi terputus. Reconnecting..."
                );

                setTimeout(
                    startConsumer,
                    5000
                );
            }
        );
    } catch (error) {
        console.error(
            "[MQTT Consumer] Gagal memulai consumer:",
            error
        );

        console.log(
            "[MQTT Consumer] Mencoba menghubungkan kembali..."
        );

        setTimeout(
            startConsumer,
            5000
        );
    }
}

module.exports = {
    startConsumer,
};