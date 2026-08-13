import "./ISPUClassification.css";

function Face({ type }) {
    if (type === "baik") return (
        <span className="face-wrap face-baik" role="img" aria-label="baik">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="20" fill="#10b981"/>
                <circle cx="13.5" cy="15.5" r="2.4" fill="#102019"/>
                <circle cx="26.5" cy="15.5" r="2.4" fill="#102019"/>
                <path d="M11.5 23c2.8 4.2 14.2 4.2 17 0" stroke="#102019" strokeWidth="3" strokeLinecap="round"/>
            </svg>
        </span>
    );

    if (type === "sedang") return (
        <span className="face-wrap face-sedang" role="img" aria-label="sedang">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="20" fill="#3b82f6"/>
                <circle cx="13.5" cy="15.5" r="2.4" fill="#101a25"/>
                <circle cx="26.5" cy="15.5" r="2.4" fill="#101a25"/>
                <path d="M12.5 25h15" stroke="#101a25" strokeWidth="3" strokeLinecap="round"/>
            </svg>
        </span>
    );

    if (type === "tidak") return (
        <span className="face-wrap face-tidak" role="img" aria-label="tidak sehat">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="20" fill="#f59e0b"/>
                <circle cx="13.5" cy="15" r="2.2" fill="#201707"/>
                <circle cx="26.5" cy="15" r="2.2" fill="#201707"/>
                <path d="M11 28c3.8-3.5 14.2-3.5 18 0" stroke="#201707" strokeWidth="3" strokeLinecap="round"/>
            </svg>
        </span>
    );

    if (type === "sangat") return (
        <span className="rage-face" role="img" aria-label="marah">😡</span>
    );

    return (
        <span className="danger-face" role="img" aria-label="bahaya">
            <span className="danger-skull">💀</span>
            <span className="danger-smoke">☁</span>
        </span>
    );
}

const items = [
    {
        className: "card-baik",
        range: "0 - 50",
        title: "Baik",
        face: "baik",
        text: "Tingkat kualitas udara yang sangat baik, tidak memberikan efek negatif pada manusia, hewan, maupun tumbuhan."
    },
    {
        className: "card-sedang",
        range: "51 - 100",
        title: "Sedang",
        face: "sedang",
        text: "Kualitas udara masih dapat diterima secara umum dan tidak memberikan dampak buruk pada kesehatan makhluk hidup."
    },
    {
        className: "card-tidak-sehat",
        range: "101 - 200",
        title: "Tidak Sehat",
        face: "tidak",
        text: "Tingkat kualitas udara yang mulai merugikan kesehatan manusia, hewan, dan tumbuhan di sekitar."
    },
    {
        className: "card-sangat-tidak-sehat",
        range: "201 - 300",
        title: "Sangat Tidak Sehat",
        face: "sangat",
        text: "Kualitas udara berada pada tingkat yang dapat merugikan kesehatan pada sejumlah segmen populasi yang terpapar."
    },
    {
        className: "card-berbahaya",
        range: "≥ 301",
        title: "Berbahaya",
        face: "bahaya",
        text: "Tingkat kualitas udara yang sangat serius dan dapat mengakibatkan kerusakan kesehatan yang parah."
    }
];

export default function ISPUClassification() {
    return (
        <section className="ispu-classification">
            <div className="classification-orb orb-one" />
            <div className="classification-orb orb-two" />
            <div className="container">
                <div className="classification-heading">
                    <span className="classification-kicker">INDIKATOR KUALITAS UDARA</span>
                    <h2 className="classification-title">Klasifikasi Berdasarkan Nilai ISPU</h2>
                    <p className="classification-subtitle">Semakin tinggi nilainya, semakin besar dampaknya terhadap kesehatan.</p>
                </div>

                <div className="classification-grid">
                    {items.map((item, index) => (
                        <article className={`classification-card ${item.className}`} key={item.title} style={{ "--card-index": index }}>
                            <div className="classification-shine" />
                            <div className="classification-glow" />
                            <div className="classification-particles" aria-hidden="true"><i /><i /><i /></div>
                            <div className="ispu-badge">ISPU {item.range}</div>
                            <div className="card-header">
                                <h3>{item.title}</h3>
                                <Face type={item.face} />
                            </div>
                            <p>{item.text}</p>
                            <span className="card-bottom-line" />
                            <span className="hover-status" aria-hidden="true">Lihat kondisi</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
