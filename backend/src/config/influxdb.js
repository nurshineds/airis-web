const { InfluxDB } = require("@influxdata/influxdb-client");

const influx = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
});

const queryApi = influx.getQueryApi(
    process.env.INFLUX_ORG
);

const writeApi = influx.getWriteApi(
    process.env.INFLUX_ORG,
    process.env.INFLUX_BUCKET
);

module.exports = {
    influx,
    queryApi,
    writeApi,
};