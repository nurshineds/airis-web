import "./Indicators.css";

const indicators = [
    {
        symbol: "CO",
        title: "Karbon Monoksida",
        description:
            "Polutan yang dapat mengganggu kemampuan darah dalam membawa oksigen ke seluruh tubuh.",
    },
    {
        symbol: "NO₂",
        title: "Nitrogen Dioksida",
        description:
            "Gas yang dapat menyebabkan iritasi saluran pernapasan dan terbentuk dari proses pembakaran.",
    },
    {
        symbol: "SO₂",
        title: "Sulfur Dioksida",
        description:
            "Gas yang dapat mengiritasi sistem pernapasan dan berasal dari pembakaran bahan bakar tertentu.",
    },
    {
        symbol: "O₃",
        title: "Ozon Permukaan",
        description:
            "Polutan yang dapat menyebabkan gangguan pernapasan ketika berada pada konsentrasi tinggi.",
    },
    {
        symbol: "HC",
        title: "Hidrokarbon",
        description:
            "Senyawa yang dapat berasal dari pembakaran bahan bakar dan berkontribusi terhadap pencemaran udara.",
    },
];

export default function Indicators() {
    return (
        <section className="indicators" id="indikator">
            <div className="container">

                <div className="indicators-header">
                    <p className="section-label">
                        Indikator Pengukuran Kualitas Udara
                    </p>

                    <h2>
                        Parameter yang Dipantau
                    </h2>

                    <p className="section-description">
                        AIRIS memantau beberapa parameter utama untuk
                        mengetahui kondisi kualitas udara di lingkungan
                        madrasah.
                    </p>
                </div>

                <div className="indicator-grid">
                    {indicators.map((indicator) => (
                        <div
                            className="indicator-card"
                            key={indicator.symbol}
                        >
                            <div className="indicator-icon">
                                {indicator.symbol}
                            </div>

                            <div>
                                <h3>{indicator.title}</h3>

                                <p>
                                    {indicator.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}