const { generateText } = require("../services/gemini");
const { loadPrompt } = require("../utils/loadPrompt");

exports.generateAirQuality = async (req, res) => {
    try{
        const {
            deviceId,
            temperature,
            humidity,
            mq135,
            mq2,
            mq7,
            pm25
        } = req.body;

        if(
            temperature === undefined ||
            humidity === undefined ||
            mq135 === undefined ||
            mq2 === undefined ||
            mq7 === undefined ||
            pm25 === undefined
        ){
            return res.status(400).json({
                success: false,
                message: "Data sensor tidak lengkap."
            });
        }

        const prompt = loadPrompt("qualityPrompt.txt", {
            deviceId: deviceId || "-",
            temperature: temperature,
            humidity: humidity,
            mq135: mq135,
            mq2: mq2,
            mq7: mq7,
            pm25: pm25
        });

        const analysis = await generateText(prompt, {
            maxOutputTokens: 4096,
            temperature: 0.3
        });

        return res.status(200).json({
            success: true,
            message: "Analisis udara berhasil.",
            data: {
                type: "air quality",
                sensor: {deviceId, temperature, humidity, mq135, mq2, mq7, pm25},
                result: analysis
            }
        });
    } catch(error){
        console.error("Analisa kualitas udara error: ", error);
        return res.status(500).json({
            succes: false,
            message: "Gagal menganalisis kualitas udara.",
            error: error.message
        });
    }
}

exports.generateHealthRecom = async (req, res) => {
    try{
        const { symptoms, age } = req.body;

        if(!symptoms || (Array.isArray(symptoms) && symptoms.length === 0)){
            return res.status(400).json({
                success: false,
                message: "Gejala harus diisi."
            });
        }

        const symptomText = Array.isArray(symptoms) ? symptoms.join(", ") : String(symptoms);

        const prompt = loadPrompt("healthPrompt.txt", {
            symptoms: symptomText,
            age: age || "-"
        });

        const recommendation = await generateText(prompt, {
            maxOutputTokens: 4096,
            temperature: 0.4
        });

        return res.status(200).json({
            success: true,
            message: "Rekomendasi kesehatan berhasil.",
            data: {
                type: "health recommendation",
                input: { symptoms: symptomText, age },
                result: recommendation
            }
        });
    } catch(error){
        console.error("Rekomendasi kesehatan error: ", error);
        return res.status(500).json({
            success: false,
            message: "Gagal membuat rekomendasi kesehatan.",
            error: error.message
        });
    }
}