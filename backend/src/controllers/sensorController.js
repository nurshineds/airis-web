const { writeSensorData, MEASUREMENT } = require("../services/influx");
const { queryApi } = require("../config/influxdb");

// Offset timezone lokal (WIB / Asia-Jakarta = UTC+7) dipakai buat hitung batas
// "hari ini" & "jam ke-N". Bisa dioverride lewat env APP_TZ_OFFSET kalau perlu.
const TIMEZONE_OFFSET_HOURS = Number(process.env.APP_TZ_OFFSET) || 7;
const TIMEZONE_OFFSET_MS = TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;

function pad2(n) {
    return String(n).padStart(2, "0");
}

// Format Date -> "HH:mm", dengan asumsi field UTC dari Date tsb sudah
// merepresentasikan waktu lokal (lihat getLocalNow/localToUTC di bawah).
function formatHHmm(date) {
    return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
}

// "Sekarang" dalam waktu lokal, dibungkus jadi Date yang getUTC*()-nya
// langsung mewakili jam lokal (trik supaya gak kebawa timezone server).
function getLocalNow() {
    return new Date(Date.now() + TIMEZONE_OFFSET_MS);
}

// Ubah (tahun, bulan, tanggal, jam, menit) waktu LOKAL jadi Date UTC asli,
// buat dipakai sebagai batas range() di query InfluxDB.
function localToUTC(year, month, day, hour = 0, minute = 0) {
    const localAsUTC = Date.UTC(year, month, day, hour, minute, 0, 0);
    return new Date(localAsUTC - TIMEZONE_OFFSET_MS);
}

// Validasi sederhana buat cegah Flux injection kalau deviceId dipakai
// sebagai filter (deviceId disisipkan langsung ke string query Flux).
function isValidDeviceId(deviceId) {
    return /^[a-zA-Z0-9_.-]+$/.test(deviceId);
}

const REQUIRED_FIELDS = [
    "deviceId",
    "temperature",
    "humidity",
    "mq135",
    "mq2",
    "mq7",
    "pm25",
    "ispu",
    "kategoriIspu",
];

function validateSensorData(data = {}) {
    const missing = REQUIRED_FIELDS.filter(
        (field) => data[field] === undefined || data[field] === null || data[field] === ""
    );

    if (missing.length > 0) {
        throw new Error(`Field berikut wajib diisi: ${missing.join(", ")}.`);
    }
}

/**
 * Simpan satu data pembacaan sensor ke InfluxDB.
 * Sengaja dipisah dari handler HTTP di bawah supaya fungsi ini bisa
 * dipanggil langsung dari tempat lain (mis. services/consumer.js saat
 * menerima pesan dari RabbitMQ), tanpa perlu req/res.
 *
 * @param {Object} data
 * @param {string|number} data.deviceId     ID Device
 * @param {number} data.temperature         Suhu (°C)
 * @param {number} data.humidity            Kelembaban (%)
 * @param {number} data.mq135                Nilai sensor MQ135
 * @param {number} data.mq2                  Nilai sensor MQ2
 * @param {number} data.mq7                  Nilai sensor MQ7
 * @param {number} data.pm25                 Nilai PM2.5
 * @param {number} data.ispu                 Nilai ISPU
 * @param {string} data.kategoriIspu         Kategori ISPU
 * @returns {Promise<Object>} data yang berhasil disimpan
 */
exports.saveSensorData = async (data = {}) => {
    validateSensorData(data);

    const {
        deviceId,
        temperature,
        humidity,
        mq135,
        mq2,
        mq7,
        pm25,
        ispu,
        kategoriIspu,
    } = data;

    await writeSensorData({
        device_id: deviceId,
        temperature,
        humidity,
        pm25,
        mq135,
        mq2,
        mq7,
        ispu,
        kategori_ispu: kategoriIspu,
    });

    return {
        deviceId,
        temperature,
        humidity,
        mq135,
        mq2,
        mq7,
        pm25,
        ispu,
        kategoriIspu,
    };
};

/**
 * @desc    Simpan data sensor lewat HTTP (mis. untuk testing manual / device yang POST langsung)
 * @route   POST /api/sensor/add-sensor-data
 * @access  Public (tambahkan verifikasi device/API key di sini kalau diperlukan nanti)
 */
exports.createSensorData = async (req, res) => {
    try {
        const savedData = await exports.saveSensorData(req.body);

        console.log("Data sensor berhasil disimpan:", savedData);

        return res.status(201).json({
            success: true,
            message: "Data sensor berhasil disimpan.",
            data: savedData,
        });
    } catch (error) {
        console.error("Simpan data sensor error:", error);

        const isValidationError = error.message.startsWith("Field berikut wajib diisi");

        return res.status(isValidationError ? 400 : 500).json({
            success: false,
            message: isValidationError ? error.message : "Gagal menyimpan data sensor.",
            error: isValidationError ? undefined : error.message,
        });
    }
};

/**
 * @desc    Ambil data sensor paling baru (real-time / terkini)
 * @route   GET /api/sensor/get-current-data
 * @access  Public
 * @query   deviceId (opsional) - filter ke device tertentu, kalau tidak diisi
 *          maka diambil data terbaru dari semua device
 */
exports.getCurrentSensorData = async (req, res) => {
    try {
        const { deviceId } = req.query;

        if (deviceId && !isValidDeviceId(deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Format deviceId tidak valid.",
            });
        }

        const deviceFilter = deviceId
            ? `\n  |> filter(fn: (r) => r.device_id == "${deviceId}")`
            : "";

        // Catatan: kategori_ispu disimpan sebagai tag (bukan field), jadi tiap
        // kombinasi nilainya bisa jadi "series" terpisah di InfluxDB. group()
        // di sini WAJIB ada supaya sort+limit(1) benar-benar ambil 1 baris
        // paling baru secara global, bukan 1 baris per kombinasi tag.
        const fluxQuery = `
from(bucket: "${process.env.INFLUX_BUCKET}")
  |> range(start: -30d)
  |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")${deviceFilter}
  |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> group()
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: 1)`;

        const rows = await queryApi.collectRows(fluxQuery);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Belum ada data sensor yang tersimpan.",
            });
        }

        const latest = rows[0];

        return res.status(200).json({
            success: true,
            message: "Data sensor terkini berhasil diambil.",
            data: {
                deviceId: latest.device_id,
                time: latest._time,
                temperature: latest.temperature,
                humidity: latest.humidity,
                mq135: latest.mq135,
                mq2: latest.mq2,
                mq7: latest.mq7,
                pm25: latest.pm25,
                ispu: latest.ispu,
                kategoriIspu: latest.kategori_ispu,
            },
        });
    } catch (error) {
        console.error("Ambil data sensor terkini error:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data sensor terkini.",
            error: error.message,
        });
    }
};

/**
 * @desc    Ambil data ISPU hari ini per jam: 00:00, 01:00, ... sampai jam
 *          sekarang, ditambah 1 titik data terakhir yang benar-benar ada
 *          (waktu akses). Contoh: diakses jam 11.38 -> hasilnya 00:00,
 *          01:00, ..., 11:00, lalu 11:38 (data aktual terakhir).
 * @route   GET /api/sensor/get-today-data
 * @access  Public
 * @query   deviceId (opsional)
 */
exports.getTodaySensorData = async (req, res) => {
    try {
        const { deviceId } = req.query;

        if (deviceId && !isValidDeviceId(deviceId)) {
            return res.status(400).json({
                success: false,
                message: "Format deviceId tidak valid.",
            });
        }

        const nowLocal = getLocalNow();
        const year = nowLocal.getUTCFullYear();
        const month = nowLocal.getUTCMonth();
        const day = nowLocal.getUTCDate();
        const currentHour = nowLocal.getUTCHours();

        const todayStartUTC = localToUTC(year, month, day, 0, 0);
        const nowUTC = new Date();

        const deviceFilter = deviceId
            ? `\n  |> filter(fn: (r) => r.device_id == "${deviceId}")`
            : "";

        // Cuma butuh field "ispu" (kategori_ispu ikut kebawa otomatis sebagai
        // tag/kolom). group() dipakai supaya sort() urut waktu secara global,
        // gak kepecah per kombinasi tag device_id/kategori_ispu.
        const fluxQuery = `
from(bucket: "${process.env.INFLUX_BUCKET}")
  |> range(start: ${todayStartUTC.toISOString()}, stop: ${nowUTC.toISOString()})
  |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
  |> filter(fn: (r) => r._field == "ispu")${deviceFilter}
  |> group()
  |> sort(columns: ["_time"])
  |> keep(columns: ["_time", "_value", "device_id", "kategori_ispu"])`;

        const rows = await queryApi.collectRows(fluxQuery);

        const hourlyData = [];
        let rowIndex = 0;
        let lastAtOrBefore = null;

        // rows sudah urut ascending -> cukup 1x jalan maju (as-of lookup)
        for (let hour = 0; hour <= currentHour; hour++) {
            const boundaryUTC = localToUTC(year, month, day, hour, 0);

            while (
                rowIndex < rows.length &&
                new Date(rows[rowIndex]._time).getTime() <= boundaryUTC.getTime()
            ) {
                lastAtOrBefore = rows[rowIndex];
                rowIndex++;
            }

            hourlyData.push({
                time: `${pad2(hour)}:00`,
                ispu: lastAtOrBefore ? lastAtOrBefore._value : null,
                kategoriIspu: lastAtOrBefore ? lastAtOrBefore.kategori_ispu : null,
            });
        }

        // Titik terakhir: data aktual paling baru hari ini (waktu akses)
        if (rows.length > 0) {
            const latestRow = rows[rows.length - 1];
            const latestLocalTime = new Date(
                new Date(latestRow._time).getTime() + TIMEZONE_OFFSET_MS
            );

            hourlyData.push({
                time: formatHHmm(latestLocalTime),
                ispu: latestRow._value,
                kategoriIspu: latestRow.kategori_ispu,
                current: true,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Data ISPU hari ini berhasil diambil.",
            data: hourlyData,
        });
    } catch (error) {
        console.error("Ambil data sensor hari ini error:", error);

        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data sensor hari ini.",
            error: error.message,
        });
    }
};  