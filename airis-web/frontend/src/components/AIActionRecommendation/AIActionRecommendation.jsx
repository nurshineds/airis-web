import "./AIActionRecommendation.css";

export default function AIActionRecommendation() {
    return (
        <section className="ai-action-recommendation">
            <div className="container">

                <div className="ai-action-header">
                    <div>
                        <h2>Rekomendasi Tindakan AI</h2>
                        <p>
                            Hasilkan analisis otomatis berdasarkan data sensor udara
                            saat ini untuk menentukan tindakan preventif yang tepat.
                        </p>
                    </div>

                    <button className="generate-ai-button">
                        <span className="ai-button-icon">✦</span>
                        Generate Rekomendasi AI
                    </button>
                </div>

                <div className="ai-response-card">
                    <div className="ai-response-header">
                        <span className="ai-response-icon">✦</span>

                        <span>
                            Respons AI (04/08/2026):
                        </span>
                    </div>

                    <p>
                        Berdasarkan pantauan saat ini, nilai ISPU berada di angka 45
                        (kategori Baik). Seluruh parameter gas polutan (CO, NO₂, SO₂,
                        O₃, HC) berada dalam batas aman.
                    </p>

                    <p className="ai-recommendation-text">
                        <strong>Rekomendasi:</strong> Kualitas udara sangat mendukung
                        seluruh kegiatan belajar mengajar maupun aktivitas luar
                        ruangan di lingkungan madrasah.
                    </p>
                </div>

            </div>
        </section>
    );
}