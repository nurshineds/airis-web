const {
    writeSensorData,
    writeDailyIspuAverage,
    MEASUREMENT,
    DAILY_ISPU_MEASUREMENT,
} = require("../services/influx");

const {
    queryApi,
} = require("../config/influxdb");

const {
    TIMEZONE_OFFSET_MS,
    pad2,
    formatHHmm,
    getLocalNow,
    localToUTC,
    parseDateOnly,
} = require("../utils/dateHelper");

const {
    getIspuCategory,
} = require("../utils/ispuHelper");

const REQUIRED_FIELDS = [
    "suhu",
    "kelembaban",
    "co2",
    "asap",
    "co",
    "debuHalus",
    "ispu",
    "kategoriIspu",
];

function validateSensorData(data = {}) {
    const missing =
        REQUIRED_FIELDS.filter(
            (field) =>
                data[field] === undefined ||
                data[field] === null ||
                data[field] === ""
        );

    if (missing.length > 0) {
        throw new Error(
            `Field berikut wajib diisi: ${missing.join(
                ", "
            )}.`
        );
    }
}

exports.saveSensorData = async (
    data = {}
) => {
    validateSensorData(data);

    const {
        suhu,
        kelembaban,
        co2,
        asap,
        co,
        debuHalus,
        ispu,
        kategoriIspu,
    } = data;

    await writeSensorData({
        suhu,
        kelembaban,
        co2,
        asap,
        co,
        debuHalus,
        ispu,
        kategori_ispu:
            kategoriIspu,
    });

    return {
        suhu,
        kelembaban,
        co2,
        asap,
        co,
        debuHalus,
        ispu,
        kategoriIspu,
    };
};

exports.createSensorData = async (
    req,
    res
) => {
    try {
        const savedData =
            await exports.saveSensorData(
                req.body
            );

        console.log(
            "[Sensor] Data berhasil disimpan:",
            savedData
        );

        return res.status(201).json({
            success: true,
            message:
                "Data sensor berhasil disimpan.",
            data: savedData,
        });
    } catch (error) {
        console.error(
            "[Sensor] Gagal menyimpan data:",
            error
        );

        const isValidationError =
            error.message.startsWith(
                "Field berikut wajib diisi"
            );

        return res
            .status(
                isValidationError
                    ? 400
                    : 500
            )
            .json({
                success: false,
                message:
                    isValidationError
                        ? error.message
                        : "Gagal menyimpan data sensor.",
                ...(isValidationError
                    ? {}
                    : {
                          error:
                              error.message,
                      }),
            });
    }
};

exports.getCurrentSensorData =
    async (req, res) => {
        try {
            const fluxQuery = `
from(bucket: "${process.env.INFLUX_BUCKET}")
  |> range(start: -30d)
  |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
  |> pivot(
      rowKey: ["_time"],
      columnKey: ["_field"],
      valueColumn: "_value"
  )
  |> group()
  |> sort(columns: ["_time"], desc: true)
  |> limit(n: 1)
`;

            const rows =
                await queryApi.collectRows(
                    fluxQuery
                );

            if (
                !rows ||
                rows.length === 0
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Belum ada data sensor yang tersimpan.",
                });
            }

            const latest = rows[0];

            return res.status(200).json({
                success: true,
                message:
                    "Data sensor terkini berhasil diambil.",
                data: {
                    time: latest._time,
                    suhu: latest.suhu,
                    kelembaban:
                        latest.kelembaban,
                    co2: latest.co2,
                    asap: latest.asap,
                    co: latest.co,
                    debuHalus:
                        latest.debuHalus,
                    ispu: latest.ispu,
                    kategoriIspu:
                        latest.kategori_ispu,
                },
            });
        } catch (error) {
            console.error(
                "[Sensor] Gagal mengambil data terkini:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Gagal mengambil data sensor terkini.",
                error: error.message,
            });
        }
    };

exports.getTodaySensorData =
    async (req, res) => {
        try {
            const nowLocal =
                getLocalNow();

            const year =
                nowLocal.getUTCFullYear();

            const month =
                nowLocal.getUTCMonth();

            const day =
                nowLocal.getUTCDate();

            const currentHour =
                nowLocal.getUTCHours();

            const todayStartUTC =
                localToUTC(
                    year,
                    month,
                    day,
                    0,
                    0
                );

            const nowUTC = new Date();

            const fluxQuery = `
from(bucket: "${process.env.INFLUX_BUCKET}")
  |> range(
      start: ${todayStartUTC.toISOString()},
      stop: ${nowUTC.toISOString()}
  )
  |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
  |> filter(fn: (r) => r._field == "ispu")
  |> group()
  |> sort(columns: ["_time"])
  |> keep(
      columns: [
          "_time",
          "_value",
          "kategori_ispu"
      ]
  )
`;

            const rows =
                await queryApi.collectRows(
                    fluxQuery
                );

            const hourlyData = [];

            let rowIndex = 0;
            let lastAtOrBefore =
                null;

            for (
                let hour = 0;
                hour <= currentHour;
                hour++
            ) {
                const boundaryUTC =
                    localToUTC(
                        year,
                        month,
                        day,
                        hour,
                        0
                    );

                while (
                    rowIndex <
                        rows.length &&
                    new Date(
                        rows[rowIndex]._time
                    ).getTime() <=
                        boundaryUTC.getTime()
                ) {
                    lastAtOrBefore =
                        rows[rowIndex];

                    rowIndex++;
                }

                hourlyData.push({
                    time: `${pad2(
                        hour
                    )}:00`,
                    ispu:
                        lastAtOrBefore
                            ? lastAtOrBefore._value
                            : null,
                    kategoriIspu:
                        lastAtOrBefore
                            ? lastAtOrBefore.kategori_ispu
                            : null,
                });
            }

            if (rows.length > 0) {
                const latestRow =
                    rows[
                        rows.length - 1
                    ];

                const latestLocalTime =
                    new Date(
                        new Date(
                            latestRow._time
                        ).getTime() +
                            TIMEZONE_OFFSET_MS
                    );

                hourlyData.push({
                    time: formatHHmm(
                        latestLocalTime
                    ),
                    ispu:
                        latestRow._value,
                    kategoriIspu:
                        latestRow.kategori_ispu,
                    current: true,
                });
            }

            return res.status(200).json({
                success: true,
                message:
                    "Data ISPU hari ini berhasil diambil.",
                data: hourlyData,
            });
        } catch (error) {
            console.error(
                "[Sensor] Gagal mengambil data hari ini:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Gagal mengambil data sensor hari ini.",
                error: error.message,
            });
        }
    };

exports.calculateDailyIspuAverage =
    async (req, res) => {
        try {
            const { tanggal } =
                req.body;

            const localDate =
                parseDateOnly(
                    tanggal,
                    "tanggal"
                );

            const nextDate =
                new Date(localDate);

            nextDate.setUTCDate(
                nextDate.getUTCDate() + 1
            );

            const fluxQuery = `
from(bucket: "${process.env.INFLUX_BUCKET}")
  |> range(
      start: ${localDate.toISOString()},
      stop: ${nextDate.toISOString()}
  )
  |> filter(fn: (r) => r._measurement == "${MEASUREMENT}")
  |> filter(fn: (r) => r._field == "ispu")
  |> group()
  |> mean()
`;

            const rows =
                await queryApi.collectRows(
                    fluxQuery
                );

            if (
                !rows.length ||
                rows[0]._value ===
                    undefined ||
                rows[0]._value === null
            ) {
                return res.status(404).json({
                    success: false,
                    message:
                        `Tidak ada data ISPU untuk tanggal ${tanggal}.`,
                });
            }

            const average =
                Number(rows[0]._value);

            const kategori =
                getIspuCategory(
                    average
                );

            await writeDailyIspuAverage({
                nilai_rata_rata:
                    average,
                kategori_rata_rata:
                    kategori,
                tanggal,
            });

            return res.status(201).json({
                success: true,
                message:
                    "Rata-rata ISPU harian berhasil dihitung dan disimpan.",
                data: {
                    tanggal,
                    nilaiRataRata:
                        average,
                    kategoriRataRata:
                        kategori,
                },
            });
        } catch (error) {
            console.error(
                "[Sensor] Gagal menghitung rata-rata ISPU:",
                error
            );

            const isValidationError =
                /^(tanggal|tanggal bukan)/.test(
                    error.message
                );

            return res
                .status(
                    isValidationError
                        ? 400
                        : 500
                )
                .json({
                    success: false,
                    message:
                        isValidationError
                            ? error.message
                            : "Gagal menghitung rata-rata ISPU harian.",
                    ...(isValidationError
                        ? {}
                        : {
                              error:
                                  error.message,
                          }),
                });
        }
    };

exports.getDailyIspuAverage =
    async (req, res) => {
        try {
            const {
                startDate,
                endDate,
            } = req.query;

            const start =
                parseDateOnly(
                    startDate,
                    "startDate"
                );

            const end =
                parseDateOnly(
                    endDate,
                    "endDate"
                );

            if (start > end) {
                return res.status(400).json({
                    success: false,
                    message:
                        "startDate tidak boleh lebih besar dari endDate.",
                });
            }

            const stop =
                new Date(end);

            stop.setUTCDate(
                stop.getUTCDate() + 1
            );

            const fluxQuery = `
from(bucket: "${process.env.INFLUX_BUCKET}")
  |> range(
      start: ${start.toISOString()},
      stop: ${stop.toISOString()}
  )
  |> filter(fn: (r) => r._measurement == "${DAILY_ISPU_MEASUREMENT}")
  |> group()
  |> pivot(
      rowKey: ["_time"],
      columnKey: ["_field"],
      valueColumn: "_value"
  )
  |> sort(columns: ["_time"])
`;

            const rows =
                await queryApi.collectRows(
                    fluxQuery
                );

            return res.status(200).json({
                success: true,
                message:
                    "Data rata-rata ISPU harian berhasil diambil.",
                data: rows.map(
                    (row) => ({
                        tanggal:
                            row.tanggal ||
                            new Date(
                                row._time
                            )
                                .toISOString()
                                .slice(
                                    0,
                                    10
                                ),

                        nilaiRataRata:
                            row.nilai_rata_rata,

                        kategoriRataRata:
                            row.kategori_rata_rata ||
                            getIspuCategory(
                                row.nilai_rata_rata
                            ),
                    })
                ),
            });
        } catch (error) {
            console.error(
                "[Sensor] Gagal mengambil rata-rata ISPU:",
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    };