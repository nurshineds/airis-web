import "./GuideLines.css";

export default function GuideLines({ guides, loading }) {
    if (loading) {
        return (
            <section className="guidelines" id="pedoman-kesehatan">
                <div className="container"><p>Memuat panduan...</p></div>
            </section>
        );
    }

    return (
        <section className="guidelines" id="pedoman-kesehatan">
            <div className="container">
                <div className="guidelines-header">
                    <p className="section-label">Panduan Kesehatan</p>
                    <h2>Panduan Menjaga Kesehatan Udara</h2>
                    <p>
                        Terapkan beberapa panduan berikut untuk membantu menjaga kesehatan ketika menghadapi kondisi kualitas udara.
                    </p>
                </div>

                <div className="guidelines-grid">
                    {guides.map((guide) => (
                        <article className="guideline-card" key={guide.idContent}>
                            <div className="guideline-icon">{guide.icon}</div>
                            <h3>{guide.title}</h3>
                            {/* Changed from description to content to match API */}
                            <p>{guide.content}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}