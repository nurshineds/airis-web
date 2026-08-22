const PM25_BREAKPOINTS = [
    {
        cLow: 0,
        cHigh: 15.5,
        iLow: 0,
        iHigh: 50,
    },
    {
        cLow: 15.5,
        cHigh: 55.4,
        iLow: 51,
        iHigh: 100,
    },
    {
        cLow: 55.4,
        cHigh: 150.4,
        iLow: 101,
        iHigh: 200,
    },
    {
        cLow: 150.4,
        cHigh: 250.4,
        iLow: 201,
        iHigh: 300,
    },
    {
        cLow: 250.4,
        cHigh: 500,
        iLow: 301,
        iHigh: 500,
    },
];

const CO_BREAKPOINTS = [
    {
        cLow: 0,
        cHigh: 4000,
        iLow: 0,
        iHigh: 50,
    },
    {
        cLow: 4000,
        cHigh: 8000,
        iLow: 51,
        iHigh: 100,
    },
    {
        cLow: 8000,
        cHigh: 15000,
        iLow: 101,
        iHigh: 200,
    },
    {
        cLow: 15000,
        cHigh: 30000,
        iLow: 201,
        iHigh: 300,
    },
    {
        cLow: 30000,
        cHigh: 45000,
        iLow: 301,
        iHigh: 500,
    },
];

function coPpmToUgM3(ppm, temperature) {
    const value = Number(ppm);
    const temp = Number(temperature);

    if (
        !Number.isFinite(value) ||
        !Number.isFinite(temp) ||
        value < 0
    ) {
        return null;
    }

    const MW = 28.01;       
    const P = 101325;       
    const R = 8.314;        
    const T = temp + 273.15;

    if (T <= 0) {
        return null;
    }

    const concentration = (value * P * MW) / (R * T);

    return concentration;
}

function calculateISPUFromBreakpoint(
    concentration,
    breakpoints
) {
    const value = Number(concentration);

    if (
        !Number.isFinite(value) ||
        value < 0
    ) {
        return null;
    }

    for (const bp of breakpoints) {
        if (
            value >= bp.cLow &&
            value <= bp.cHigh
        ) {
            const ispu =
                ((bp.iHigh - bp.iLow) /
                    (bp.cHigh - bp.cLow)) *
                    (value - bp.cLow) +
                bp.iLow;

            return Math.round(ispu);
        }
    }

    if (
        value >
        breakpoints[
            breakpoints.length - 1
        ].cHigh
    ) {
        return 500;
    }

    return null;
}

function calculateISPU(
    pm25,
    coPpm,
    temperature
) {
    const ispuPM25 =
        calculateISPUFromBreakpoint(
            pm25,
            PM25_BREAKPOINTS
        );

    const coUgM3 =
        coPpmToUgM3(
            coPpm,
            temperature
        );

    const ispuCO =
        calculateISPUFromBreakpoint(
            coUgM3,
            CO_BREAKPOINTS
        );

    const values = [
        ispuPM25,
        ispuCO,
    ].filter(
        (value) => value !== null
    );

    if (values.length === 0) {
        return {
            ispu: null,
            coUgM3: null,
        };
    }

    const ispu =
        Math.max(...values);

    return {
        ispu,
        coUgM3,
    };
}

module.exports = {
    calculateISPU,
    coPpmToUgM3,
};