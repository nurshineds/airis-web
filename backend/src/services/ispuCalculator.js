const PM25_BREAKPOINTS = [
    { cLow: 0, cHigh: 15.5, iLow: 0, iHigh: 50 },
    { cLow: 15.5, cHigh: 55.4, iLow: 51, iHigh: 100 },
    { cLow: 55.4, cHigh: 150.4, iLow: 101, iHigh: 200 },
    { cLow: 150.4, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.4, cHigh: 500.0, iLow: 301, iHigh: 500 },
];

const CO_BREAKPOINTS = [
    { cLow: 0, cHigh: 4000, iLow: 0, iHigh: 50 },
    { cLow: 4000, cHigh: 8000, iLow: 51, iHigh: 100 },
    { cLow: 8000, cHigh: 15000, iLow: 101, iHigh: 200 },
    { cLow: 15000, cHigh: 30000, iLow: 201, iHigh: 300 },
    { cLow: 30000, cHigh: 45000, iLow: 301, iHigh: 500 },
];

function coPpmToUgM3(ppm, temperature) {
    const value = Number(ppm);
    const temp = Number(temperature);

    if (!Number.isFinite(value) || !Number.isFinite(temp) || value < 0) {
        return null;
    }

    const MW = 28.01; 
    const P = 101325; 
    const R = 8.314;  
    const T = temp + 273.15;

    if (T <= 0) return null;

    return (value * P * MW) / (R * T);
}

function calculateISPUFromBreakpoint(concentration, breakpoints) {
    const value = Number(concentration);

    if (!Number.isFinite(value) || value < 0) {
        return null;
    }

    const lastIdx = breakpoints.length - 1;

    for (let i = 0; i < breakpoints.length; i++) {
        const bp = breakpoints[i];
        
        const isMatch = (i === lastIdx) 
            ? (value >= bp.cLow && value <= bp.cHigh)
            : (value >= bp.cLow && value < bp.cHigh);

        if (isMatch) {
            const ispu =
                ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
                    (value - bp.cLow) +
                bp.iLow;

            return Math.round(ispu);
        }
    }

    if (value > breakpoints[lastIdx].cHigh) {
        return 500;
    }

    return null;
}

function calculateISPU(pm25, coPpm, temperature) {
    const ispuPM25 = calculateISPUFromBreakpoint(pm25, PM25_BREAKPOINTS);
    const coUgM3 = coPpmToUgM3(coPpm, temperature);
    const ispuCO = calculateISPUFromBreakpoint(coUgM3, CO_BREAKPOINTS);

    const validValues = [ispuPM25, ispuCO].filter((val) => val !== null);

    if (validValues.length === 0) {
        return { ispu: null, coUgM3: null, criticalParameter: null };
    }

    const ispu = Math.max(...validValues);
    
    let criticalParameter = null;
    if (ispu === ispuPM25) criticalParameter = 'PM2.5';
    else if (ispu === ispuCO) criticalParameter = 'CO';

    return {
        ispu,
        coUgM3,
        criticalParameter,
    };
}

module.exports = {
    calculateISPU,
    coPpmToUgM3,
};