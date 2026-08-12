// influx.js
// Modul koneksi + penulisan data sensor ke InfluxDB.
// Kompatibel dengan InfluxDB OSS v2.x, InfluxDB Cloud, dan InfluxDB 3 Core
// (lewat v2 compatibility API), karena pakai client resmi @influxdata/influxdb-client.

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

// Presisi 'ms' sudah cukup untuk data sensor (suhu, kelembapan, gas, dst).
const writeApi = client.getWriteApi(org, bucket, 'ms');

const MEASUREMENT = 'sensor_data';

/**
 * Simpan satu baris data sensor ke InfluxDB.
 *
 * @param {Object} data
 * @param {string} data.device_id      - ID unik perangkat (disimpan sebagai tag, wajib)
 * @param {number} [data.temperature]  - Suhu (°C)
 * @param {number} [data.humidity]     - Kelembapan (%)
 * @param {number} [data.pm25]         - Konsentrasi PM2.5 (µg/m³)
 * @param {number} [data.mq135]        - Nilai sensor MQ135 (kualitas udara umum/CO2, NH3, dll)
 * @param {number} [data.mq2]          - Nilai sensor MQ2 (asap/gas mudah terbakar)
 * @param {number} [data.mq7]          - Nilai sensor MQ7 (karbon monoksida)
 * @param {number} [data.ispu]         - Nilai ISPU hasil perhitungan
 * @param {string} [data.kategori_ispu]- Kategori ISPU (mis. Baik/Sedang/Tidak Sehat/dst)
 * @param {Date|number} [timestamp]    - Waktu pengukuran, default: waktu sekarang
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

  // kategori_ispu disimpan sebagai tag karena kardinalitasnya rendah
  // (Baik/Sedang/Tidak Sehat/Sangat Tidak Sehat/Berbahaya) sehingga enak
  // dipakai untuk filter cepat, mis: WHERE kategori_ispu = 'Tidak Sehat'.
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

  // Flush langsung agar data segera masuk. Cocok untuk trafik sensor
  // rendah-menengah (per detik/beberapa detik). Kalau trafik sangat tinggi,
  // hapus baris flush() ini dan biarkan writeApi auto-flush secara berkala.
  try {
    await writeApi.flush();
  } catch (err) {
    console.error('Gagal menulis ke InfluxDB:', err.message);
    throw err;
  }
}

/**
 * Tutup koneksi write API dengan aman. Panggil saat aplikasi akan shutdown.
 */
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
  closeInflux,
  client,
};