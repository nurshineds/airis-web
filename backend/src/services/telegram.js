const axios = require("axios");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const THREAD_ID = Number(process.env.TELEGRAM_THREAD_ID);

async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const response = await axios.post(url, {
            chat_id: CHAT_ID,
            message_thread_id: THREAD_ID,
            text: message
        });
        console.log("[Telegram] Pesan terkirim.");
        return response.data;

    } catch (error) {
        console.error("[Telegram] Gagal mengirim pesan:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = {sendTelegramMessage};