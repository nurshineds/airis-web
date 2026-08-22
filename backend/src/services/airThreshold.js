const prisma = require("../lib/prisma");

const { sendTelegramMessage } = require("./telegram");
const { getAlertMessage, getRecoveryMessage } = require("../utils/alertMessages");

const alertState = {};

async function getThreshold(indicator) {
    const threshold = await prisma.thresholdValue.findFirst({
        where: { indicatorName: indicator }
    });

    return threshold;
}

async function monitorIndicator(indicator, value) {
    if (
        value === null ||
        value === undefined ||
        Number.isNaN(Number(value))
    ) {
        return;
    }

    value = Number(value);

    const threshold = await getThreshold(indicator);

    if (!threshold) {
        console.warn(
            `[Sensor Threshold] Threshold untuk ${indicator} tidak ditemukan.`
        );
        return;
    }

    const previousState = alertState[indicator] || {
        abnormal: false,
        type: null
    };

    const hysteresis = threshold.hysteresis;

    const isTooLow = value < threshold.minTresholdValue;

    const isTooHigh =
        value > threshold.maxTresholdValue;

    if (!previousState.abnormal) {
        if (isTooLow || isTooHigh) {
            const type = isTooLow ? "low" : "high";

            alertState[indicator] = {
                abnormal: true,
                type
            };

            const message = getAlertMessage({
                indicator,
                value,
                unit: threshold.indicatorUnit,
                min: threshold.minTresholdValue,
                max: threshold.maxTresholdValue,
                isTooLow,
                isTooHigh
            });

            try {
                await sendTelegramMessage(message);
            } catch (error) {
                console.error(
                    "[Threshold] Gagal mengirim alert Telegram:",
                    error.message
                );
            }
        }

        return;
    }

    if (previousState.type === "high") {
        if (value > threshold.maxTresholdValue) {
            return;
        }

        if (value >= threshold.maxTresholdValue - hysteresis) {
            return;
        }

        alertState[indicator] = {
            abnormal: false,
            type: null
        };

        const message = getRecoveryMessage({
            indicator,
            value,
            unit: threshold.indicatorUnit,
            min: threshold.minTresholdValue,
            max: threshold.maxTresholdValue
        });

        try {
            await sendTelegramMessage(message);
        } catch (error) {
            console.error(
                "[Threshold] Gagal mengirim recovery Telegram:",
                error.message
            );
        }

        return;
    }

    if (previousState.type === "low") {
        if (value < threshold.minTresholdValue) {
            return;
        }

        if (value <= threshold.minTresholdValue + hysteresis) {
            return;
        }

        alertState[indicator] = {
            abnormal: false,
            type: null
        };

        const message = getRecoveryMessage({
            indicator,
            value,
            unit: threshold.indicatorUnit,
            min: threshold.minTresholdValue,
            max: threshold.maxTresholdValue
        });

        try {
            await sendTelegramMessage(message);
        } catch (error) {
            console.error(
                "[Threshold] Gagal mengirim recovery Telegram:",
                error.message
            );
        }
    }
}

module.exports = { monitorIndicator };