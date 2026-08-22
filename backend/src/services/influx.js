"use strict";

require("dotenv").config();

const {
    InfluxDB,
    Point,
} = require("@influxdata/influxdb-client");

const url =
    process.env.INFLUX_URL ||
    "http://localhost:8086";

const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

if (!token || !org || !bucket) {
    throw new Error(
        "INFLUX_TOKEN, INFLUX_ORG, dan INFLUX_BUCKET wajib diisi di file .env"
    );
}

const client = new InfluxDB({
    url,
    token,
});

const writeApi = client.getWriteApi(
    org,
    bucket,
    "ms"
);

const MEASUREMENT = "sensor_data";
const DAILY_ISPU_MEASUREMENT =
    "ispu_daily_avg";

async function writeSensorData(
    data,
    timestamp
) {
    if (!data) {
        throw new Error(
            "Data sensor wajib diisi"
        );
    }

    const {
        suhu,
        kelembaban,
        co2,
        asap,
        co,
        debuHalus,
        ispu,
        kategori_ispu,
    } = data;

    const point = new Point(MEASUREMENT);

    if (
        kategori_ispu !== undefined &&
        kategori_ispu !== null &&
        kategori_ispu !== ""
    ) {
        point.tag(
            "kategori_ispu",
            String(kategori_ispu)
        );
    }

    const numericFields = {
        suhu,
        kelembaban,
        co2,
        asap,
        co,
        debuHalus,
        ispu,
    };

    let hasField = false;

    for (const [
        key,
        value,
    ] of Object.entries(numericFields)) {
        if (
            value !== undefined &&
            value !== null &&
            !Number.isNaN(Number(value))
        ) {
            point.floatField(
                key,
                Number(value)
            );

            hasField = true;
        }
    }

    if (!hasField) {
        throw new Error(
            "Minimal satu field numerik harus diisi"
        );
    }

    if (timestamp) {
        point.timestamp(timestamp);
    }

    writeApi.writePoint(point);

    try {
        await writeApi.flush();
    } catch (error) {
        console.error(
            "Gagal menulis ke InfluxDB:",
            error.message
        );

        throw error;
    }
}

async function writeDailyIspuAverage({
    nilai_rata_rata,
    kategori_rata_rata,
    tanggal,
}) {
    if (
        nilai_rata_rata === undefined ||
        nilai_rata_rata === null ||
        Number.isNaN(
            Number(nilai_rata_rata)
        )
    ) {
        throw new Error(
            "nilai_rata_rata wajib berupa angka"
        );
    }

    if (!tanggal) {
        throw new Error(
            "tanggal wajib diisi"
        );
    }

    const point = new Point(
        DAILY_ISPU_MEASUREMENT
    )
        .floatField(
            "nilai_rata_rata",
            Number(nilai_rata_rata)
        )
        .stringField(
            "kategori_rata_rata",
            String(
                kategori_rata_rata ?? ""
            )
        )
        .stringField(
            "tanggal",
            String(tanggal)
        );

    const timestamp = new Date(
        `${tanggal}T00:00:00.000Z`
    );

    if (!Number.isNaN(timestamp.getTime())) {
        point.timestamp(timestamp);
    }

    writeApi.writePoint(point);

    try {
        await writeApi.flush();
    } catch (error) {
        console.error(
            "Gagal menulis rata-rata ISPU harian:",
            error.message
        );

        throw error;
    }
}

async function closeInflux() {
    try {
        await writeApi.close();

        console.log(
            "Koneksi InfluxDB ditutup dengan aman."
        );
    } catch (error) {
        console.error(
            "Gagal menutup koneksi InfluxDB:",
            error.message
        );
    }
}

process.on("SIGINT", async () => {
    await closeInflux();
    process.exit(0);
});

module.exports = {
    writeSensorData,
    writeDailyIspuAverage,
    closeInflux,
    client,
    MEASUREMENT,
    DAILY_ISPU_MEASUREMENT,
};