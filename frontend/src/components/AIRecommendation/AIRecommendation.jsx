import "./AIRecommendation.css";

const healthConditions = [
    "Baik / Tidak ada gejala",
    "Gejala ringan",
    "Batuk / Pilek",
    "Pusing / Mual",
];

export default function AIRecommendation() {
    return (
        <section className="ai-recommendation">
            <div className="container">

                {/* Header */}
                <div className="ai-header">

                    <p className="ai-label">
                        AIRIS AI
                    </p>

                    <h2>
                        Rekomendasi Kesehatan
                    </h2>

                    <p>
                        Pilih kondisi yang sesuai untuk mendapatkan
                        rekomendasi kesehatan berdasarkan kualitas udara.
                    </p>

                </div>


                {/* Form */}
                <div className="ai-form">

                    <p className="form-label">
                        Kondisi kesehatan Anda
                    </p>

                    <div className="condition-list">

                        {healthConditions.map((condition) => (
                            <button
                                key={condition}
                                className="condition-button"
                                type="button"
                            >
                                {condition}
                            </button>
                        ))}

                    </div>


                    <label
                        htmlFor="health-condition"
                        className="select-label"
                    >
                        Kondisi kesehatan (pilih satu)
                    </label>

                    <select
                        id="health-condition"
                        className="condition-select"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Pilih kondisi kesehatan
                        </option>

                        {healthConditions.map((condition) => (
                            <option
                                key={condition}
                                value={condition}
                            >
                                {condition}
                            </option>
                        ))}
                    </select>


                    <button
                        className="recommendation-button"
                        type="button"
                    >
                        Dapatkan Rekomendasi
                    </button>

                </div>


                {/* Recommendation Result */}
                <div className="recommendation-result">

                    <div className="result-header">
                        <span className="result-icon">
                            ✓
                        </span>

                        <h3>
                            Rekomendasi untuk Anda
                        </h3>
                    </div>

                    <p>
                        Berdasarkan kondisi kualitas udara saat ini
                        dan kondisi kesehatan yang dipilih, tetap
                        perhatikan kualitas udara dan kurangi aktivitas
                        di luar ruangan apabila diperlukan.
                    </p>

                    <div className="result-action">
                        <strong>
                            Tindakan yang Disarankan
                        </strong>

                        <p>
                            Pastikan Anda mendapatkan udara yang bersih
                            dan gunakan perlindungan yang sesuai ketika
                            kualitas udara menurun.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}