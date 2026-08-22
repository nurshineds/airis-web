const TIMEZONE_OFFSET_HOURS = Number(process.env.APP_TZ_OFFSET) || 7;
const TIMEZONE_OFFSET_MS = TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;

function pad2(value) {
    return String(value).padStart(2, "0");
}

function formatHHmm(date) {
    return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
}

function getLocalNow() {
    return new Date(Date.now() + TIMEZONE_OFFSET_MS);
}

function localToUTC(
    year,
    month,
    day,
    hour = 0,
    minute = 0
) {
    const localTime = Date.UTC(
        year,
        month,
        day,
        hour,
        minute,
        0,
        0
    );

    return new Date(localTime - TIMEZONE_OFFSET_MS);
}

function parseDateOnly(value, fieldName) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
        throw new Error(
            `${fieldName} harus berformat YYYY-MM-DD.`
        );
    }

    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        throw new Error(
            `${fieldName} bukan tanggal yang valid.`
        );
    }

    return date;
}

module.exports = {
    TIMEZONE_OFFSET_MS,
    pad2,
    formatHHmm,
    getLocalNow,
    localToUTC,
    parseDateOnly,
};