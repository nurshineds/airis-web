import { useMemo, useState } from "react";
import "./CurrentAirCondition.css";

const chartData = [
    { time: "14:00", value: 18 }, { time: "15:00", value: 21 }, { time: "16:00", value: 24 },
    { time: "17:00", value: 35 }, { time: "18:00", value: 38 }, { time: "19:00", value: 31 },
    { time: "20:00", value: 29 }, { time: "21:00", value: 25 }, { time: "22:00", value: 26 },
    { time: "23:00", value: 36 }, { time: "00:00", value: 40 }, { time: "01:00", value: 34 },
    { time: "02:00", value: 37 }, { time: "03:00", value: 39 }, { time: "04:00", value: 41 },
    { time: "05:00", value: 45 }, { time: "06:00", value: 43 }, { time: "07:00", value: 40 },
    { time: "08:00", value: 42 }, { time: "09:00", value: 39 }, { time: "10:00", value: 38 },
    { time: "11:00", value: 41 }, { time: "12:00", value: 39 }, { time: "13:00", value: 40 },
    { time: "14:00", value: 35 },
];

const gases = [
    ["CO", "1.2", "ppm"], ["NO₂", "24", "ppb"], ["SO₂", "12", "ppb"],
    ["O₃", "35", "ppb"], ["HC", "0.4", "ppm"], ["Suhu", "28", "°C"],
];

function AirChart() {
    const [hover, setHover] = useState(null);
    const [range, setRange] = useState("24 Jam");
    const width = 900;
    const height = 300;
    const pad = { left: 18, right: 18, top: 24, bottom: 42 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const max = 100;

    const points = useMemo(() => chartData.map((item, index) => ({
        ...item,
        x: pad.left + (index / (chartData.length - 1)) * innerW,
        y: pad.top + innerH - (item.value / max) * innerH,
    })), []);

    const line = points.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
    const area = `${line} L ${points.at(-1).x} ${pad.top + innerH} L ${points[0].x} ${pad.top + innerH} Z`;
    const active = hover === null ? points[18] : points[hover];

    const handlePointer = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * width;
        const index = Math.max(0, Math.min(points.length - 1, Math.round(((x - pad.left) / innerW) * (points.length - 1))));
        setHover(index);
    };

    return (
        <div className="air-chart-card">
            <div className="chart-heading">
                <div>
                    <span className="chart-kicker">REAL-TIME MONITORING</span>
                    <h2>Grafik ISPU <span>(24 Jam Terakhir)</span></h2>
                </div>
                <div className="chart-range" role="group" aria-label="Rentang grafik">
                    {["1 Jam", "24 Jam", "7 Hari", "30 Hari"].map((item) => (
                        <button key={item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>{item}</button>
                    ))}
                </div>
            </div>

            <div className="chart-wrap" onPointerMove={handlePointer} onPointerLeave={() => setHover(null)}>
                <svg className="air-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Grafik perubahan ISPU">
                    <defs>
                        <linearGradient id="ispuArea" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#16a34a" stopOpacity=".26" />
                            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                        </linearGradient>
                        <filter id="chartGlow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    </defs>
                    {[0, 25, 50, 75, 100].map((value) => {
                        const y = pad.top + innerH - (value / max) * innerH;
                        return <g key={value}><line x1={pad.left} x2={width - pad.right} y1={y} y2={y} className="chart-grid-line" /><text x="0" y={y + 4} className="chart-axis-label">{value}</text></g>;
                    })}
                    <line x1={pad.left} x2={width - pad.right} y1={pad.top + innerH / 2} y2={pad.top + innerH / 2} className="chart-limit" />
                    <path d={area} className="chart-area" />
                    <path d={line} className="chart-line" filter="url(#chartGlow)" />
                    {points.map((p, index) => <circle key={index} cx={p.x} cy={p.y} r={hover === index ? 6 : 3.5} className={hover === index ? "chart-point active" : "chart-point"} />)}
                    {hover !== null && <line x1={active.x} x2={active.x} y1={pad.top} y2={pad.top + innerH} className="chart-crosshair" />}
                </svg>

                {hover !== null && (
                    <div className="chart-tooltip" style={{ left: `${(active.x / width) * 100}%`, top: `${(active.y / height) * 100}%` }}>
                        <span>{active.time}</span>
                        <strong>{active.value}</strong>
                        <em>ISPU · Baik</em>
                    </div>
                )}
            </div>

            <div className="chart-footer">
                <div><span className="legend-dot" /> ISPU <span className="legend-limit" /> Ambang Batas Baik (50)</div>
                <span className="chart-hint">Gerakkan mouse di atas grafik untuk melihat detail</span>
            </div>
        </div>
    );
}

export default function CurrentAirCondition() {
    return (
        <section className="current-air-condition">
            <div className="container">
                <div className="air-condition-header">
                    <div>
                        <span className="condition-eyebrow"><span /> LIVE AIR QUALITY</span>
                        <h1>Kondisi <span>Udara</span></h1>
                        <p>Pantau kualitas udara secara real-time dan riwayat perubahannya dengan data terukur dari sensor AIRIS.</p>
                    </div>
                    <div className="condition-meta">
                        <div><span>Lokasi</span><strong>Kota Malang</strong></div>
                        <div><span>Waktu</span><strong>11 Agustus 2026, 12:54</strong></div>
                        <div><span>Status Data</span><strong className="live-status"><i /> Live</strong></div>
                    </div>
                </div>

                <div className="condition-dashboard">
                    <article className="ispu-card">
                        <div className="ispu-top"><span>INDEKS ISPU</span><span className="ispu-live"><i /> LIVE</span></div>
                        <div className="ispu-value">28</div>
                        <div className="ispu-status"><span>●</span> Baik</div>
                        <div className="ispu-meter"><i /><span /><span /><span /><span /><b /></div>
                        <div className="meter-labels"><span>0</span><span>50</span><span>100</span><span>200</span><span>300</span><span>500</span></div>
                        <p>Kualitas udara baik dan tidak memberikan dampak bagi kesehatan sebagian besar masyarakat.</p>
                    </article>
                    <AirChart />
                </div>

                <div className="gas-section">
                    <div className="section-heading"><div><span>DATA SENSOR</span><h2>Gas dan Parameter yang Diukur</h2></div><p>Nilai terkini dari sensor AIRIS</p></div>
                    <div className="gas-grid">
                        {gases.map(([name, value, unit], index) => <article className={`gas-card gas-${index}`} key={name}><div className="gas-symbol">{name}</div><div><strong>{value}<small>{unit}</small></strong><span>{name === "CO" ? "Karbon Monoksida" : name === "NO₂" ? "Nitrogen Dioksida" : name === "SO₂" ? "Sulfur Dioksida" : name === "O₃" ? "Ozon Permukaan" : name === "HC" ? "Hidrokarbon" : "Suhu Lingkungan"}</span></div><b className="gas-status"><i /> Baik</b><div className="gas-spark"><span /></div></article>)}
                    </div>
                </div>
            </div>
        </section>
    );
}
