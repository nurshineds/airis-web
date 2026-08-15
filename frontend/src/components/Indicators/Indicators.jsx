import "./Indicators.css";

export default function Indicators({ indicators, loading }) {
    if (loading) {
        return (
            <section className="indicators" id="indikator">
                <div className="container"><p>Memuat indikator...</p></div>
            </section>
        );
    }

    return (
        <section className="indicators" id="indikator">
            <div className="container">
                <div className="indicators-header">
                    <p className="section-label">Indikator Pengukuran Kualitas Udara</p>
                    <h2>Parameter yang Dipantau</h2>
                    <p className="section-description">
                        AIRIS memantau beberapa parameter utama untuk mengetahui kondisi kualitas udara di lingkungan madrasah.
                    </p>
                </div>

                <div className="indicator-grid">
                    {indicators.map((indicator) => (
                        <div className="indicator-card" key={indicator.idContent}>
                            <div className="indicator-icon">{indicator.symbol}</div>
                            <div>
                                <h3>{indicator.title}</h3>
                                {/* Changed from description to content to match API */}
                                <p>{indicator.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}