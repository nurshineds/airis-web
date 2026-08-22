function getAlertMessage({
    indicator,
    value,
    unit,
    min,
    max,
    isTooLow,
    isTooHigh
}){
    if(indicator === "kelembaban"){
        if(isTooLow){
            const message = [
                `Kelembaban udara lagi rendah nih! Jangan lupa minum air yang cukup dan pakai lotion ya!`,
                ``,
                `Estimasi ${indicator} saat ini: ${value}${unit}`,
                `Batas normal: ${min}-${max}${unit}`
            ].join("\n");

            return message;
        }
        if(isTooHigh){
            const message = [
                `Udaranya lagi lembab banget! Coba buka jendela jika di dalam ruangan atau cek sirkulasi udaranya ya!`,
                ``,
                `Estimasi ${indicator} saat ini: ${value}${unit}`,
                `Batas normal: ${min}-${max}${unit}`
            ].join("\n");

            return message;
        }
    }
    if(indicator === "suhu"){
        if(isTooLow){
            const message = [
                `Suhunya lagi dingin banget ngga sih? Jangan lupa pakai jaket🩷`,
                ``,
                `Estimasi ${indicator} saat ini: ${value}${unit}`,
                `Batas normal: ${min}-${max}${unit}`
            ].join("\n");

            return message;
        }
        if(isTooHigh){
            const message = [
                `Oh no, lagi panas-panasnya... Jangan lupa minum air putih dan batasi aktivitas fisik di luar ruangan kalau terlalu panas ya!`,
                ``,
                `Estimasi ${indicator} saat ini: ${value}${unit}`,
                `Batas normal: ${min}-${max}${unit}`
            ].join("\n");

            return message;
        }
    }
    if(indicator === "debu halus"){
        if(isTooHigh){
            const message = [
                `Aduh lagi berdebu😓 Gunakan masker di area yang udaranya kurang baik kalau memungkinkan ya..`,
                ``,
                `Estimasi kadar ${indicator} saat ini: ${value}${unit}`,
                `Batas normal: ${min}-${max}${unit}`
            ].join("\n");

            return message;
        }
    }
    if(indicator === "CO2"){
        if(isTooHigh){
            const message = [
                `Waduh, CO2 melebihi batas normal tuh.. Buka jendela dan pintu ya, kalau bisa cari udara segar juga😉`,
                ``,
                `Estimasi kadar ${indicator} saat ini: ${value}${unit}`,
                `Batas normal: ${min}-${max}${unit}`
            ].join("\n");

            return message;
        }
    }
    if(indicator === "CO"){
        if(isTooHigh){
            const message = [
                `Kadar CO melebihi batas normal🤨 Jangan lupa buka jendela dan pintu yaa, kalau terlalu tinggi harus dicari tau tuh asalnya darimana..`,
                ``,
                `Estimasi kadar ${indicator} saat ini: ${value}${unit}`,
                `Batas normal: ${min}-${max}${unit}`
            ].join("\n");
            
            return message;
        }
    }
    if(indicator === "asap"){
        if(isTooHigh){
            const message = [
                `Hmmm... kadar asapnya lagi tinggi. Jangan lupa pakai masker dan cari sumber asapnya darimana ya..🫤`,
                ``,
                `Estimasi kadar ${indicator} saat ini: ${value}${unit}`,
                `Batas normal: ${min}-${max}${unit}`
            ].join("\n");

            return message;
        }
    }
}

function getRecoveryMessage({
    indicator,
    value,
    unit,
    min,
    max
}){
    const message = [
    `Yeay! ${indicator} udah normal lagi😼`,
    ``,
    `Estimasi ${indicator} saat ini: ${value}${unit}`,
    `Batas normal: ${min}-${max}${unit}`
    ].join("\n");

    return message;
}

module.exports = {
    getAlertMessage,
    getRecoveryMessage
}