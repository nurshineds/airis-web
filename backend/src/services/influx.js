'use strict';

require('dotenv').config();
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

if (!token || !org || !bucket) {
  throw new Error(
    'INFLUX_TOKEN, INFLUX_ORG, dan INFLUX_BUCKET wajib diisi di file .env'
  );
}

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket, 'ms');

const MEASUREMENT = 'sensor_data';
const DAILY_ISPU_MEASUREMENT = 'ispu_daily_avg';

/**
 * @param {Object} data
 * @param {string} data.device_id
 * @param {number} [data.temperature]
 * @param {number} [data.humidity]
 * @param {number} [data.pm25]
 * @param {number} [data.mq135]
 * @param {number} [data.mq2]
 * @param {number} [data.mq7]
 * @param {number} [data.ispu]
 * @param {string} [data.kategori_ispu]
 * @param {Date|number} [timestamp]
 * @returns {Promise<void>}
 */
async function writeSensorData(data, timestamp) {
  if (!data || !data.device_id) {
    throw new Error('device_id wajib diisi');
  }

  const {
    device_id,
    temperature,
    humidity,
    pm25,
    mq135,
    mq2,
    mq7,
    ispu,
    kategori_ispu,
  } = data;

  const point = new Point(MEASUREMENT).tag('device_id', String(device_id));

  if (kategori_ispu !== undefined && kategori_ispu !== null && kategori_ispu !== '') {
    point.tag('kategori_ispu', String(kategori_ispu));
  }

  const numericFields = { temperature, humidity, pm25, mq135, mq2, mq7, ispu };
  let hasField = false;

  for (const [key, value] of Object.entries(numericFields)) {
    if (value !== undefined && value !== null && !Number.isNaN(Number(value))) {
      point.floatField(key, Number(value));
      hasField = true;
    }
  }

  if (!hasField) {
    throw new Error('Minimal satu field numerik (temperature/humidity/pm25/mq135/mq2/mq7/ispu) harus diisi');
  }

  if (timestamp) {
    point.timestamp(timestamp);
  }

  writeApi.writePoint(point);
  try {
    await writeApi.flush();
  } catch (err) {
    console.error('Gagal menulis ke InfluxDB:', err.message);
    throw err;
  }
}

/**
 * Simpan rata-rata ISPU harian ke measurement khusus.
 * Fields: nilai_rata_rata, kategori_rata_rata, tanggal.
 * device_id disimpan sebagai tag agar data tetap bisa dibedakan per device.
 */
async function writeDailyIspuAverage({ device_id, nilai_rata_rata, kategori_rata_rata, tanggal }) {
  if (nilai_rata_rata === undefined || nilai_rata_rata === null || Number.isNaN(Number(nilai_rata_rata))) {
    throw new Error('nilai_rata_rata wajib berupa angka');
  }
  if (!tanggal) {
    throw new Error('tanggal wajib diisi');
  }

  const point = new Point(DAILY_ISPU_MEASUREMENT)
    .floatField('nilai_rata_rata', Number(nilai_rata_rata))
    .stringField('kategori_rata_rata', String(kategori_rata_rata ?? ''))
    .stringField('tanggal', String(tanggal));

  if (device_id !== undefined && device_id !== null && device_id !== '') {
    point.tag('device_id', String(device_id));
  }

  // Timestamp diset ke awal hari agar satu hari punya titik deterministik.
  const timestamp = new Date(`${tanggal}T00:00:00.000Z`);
  if (!Number.isNaN(timestamp.getTime())) {
    point.timestamp(timestamp);
  }

  writeApi.writePoint(point);
  try {
    await writeApi.flush();
  } catch (err) {
    console.error('Gagal menulis rata-rata ISPU harian ke InfluxDB:', err.message);
    throw err;
  }
}

async function closeInflux() {
  try {
    await writeApi.close();
    console.log('Koneksi InfluxDB ditutup dengan aman.');
  } catch (err) {
    console.error('Gagal menutup koneksi InfluxDB:', err.message);
  }
}

process.on('SIGINT', async () => {
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
