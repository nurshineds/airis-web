function getIspuCategory(ispu) {
    const value = Number(ispu);

    if (!Number.isFinite(value)) {
        return null;
    }

    if (value <= 50) {
        return "Baik";
    }

    if (value <= 100) {
        return "Sedang";
    }

    if (value <= 200) {
        return "Tidak Sehat";
    }

    if (value <= 300) {
        return "Sangat Tidak Sehat";
    }

    return "Berbahaya";
}

module.exports = { getIspuCategory };