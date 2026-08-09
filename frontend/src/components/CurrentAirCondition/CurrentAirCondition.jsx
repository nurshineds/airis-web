import "./CurrentAirCondition.css";

export default function CurrentAirCondition() {
    return (
        <section className="current-air-condition">
            <div className="container">

                <div className="air-condition-header">
                    <h1>Halo, Matsandatama!</h1>
                    <p>Pembaruan data terkini pada tanggal 04/08/2026</p>
                </div>

                <div className="air-condition-grid">

                    {/* ISPU CARD */}
                    <div className="ispu-card">
                        <p className="ispu-label">
                            Indeks Standar Pencemar Udara (ISPU)
                        </p>

                        <div className="ispu-value">
                            45
                        </div>

                        <p className="ispu-status">
                            Status: Baik
                        </p>
                    </div>

                    {/* GAS PARAMETERS CARD */}
                    <div className="gas-card">
                        <p className="gas-card-title">
                            PARAMETER GAS LINGKUNGAN
                        </p>

                        <div className="gas-grid">

                            <div className="gas-item">
                                <span>CO</span>
                                <strong>1.2 ppm</strong>
                            </div>

                            <div className="gas-item">
                                <span>NO₂</span>
                                <strong>24 ppb</strong>
                            </div>

                            <div className="gas-item">
                                <span>SO₂</span>
                                <strong>12 ppb</strong>
                            </div>

                            <div className="gas-item">
                                <span>O₃</span>
                                <strong>35 ppb</strong>
                            </div>

                            <div className="gas-item">
                                <span>HC</span>
                                <strong>0.4 ppm</strong>
                            </div>

                            <div className="gas-item">
                                <span>Suhu</span>
                                <strong>28°C</strong>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}