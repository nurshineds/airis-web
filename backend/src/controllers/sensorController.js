const { writeSensorData } = require("../services/influx");

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
