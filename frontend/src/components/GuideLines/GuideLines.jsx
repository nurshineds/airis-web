import "./GuideLines.css";

const guidelines = [
    {
        icon: "☀",
        title: "Udara yang Baik",
        description:
            "Manfaatkan udara yang baik dengan melakukan aktivitas di luar ruangan secara nyaman."
    },
    {
        icon: "♟",
        title: "Aktivitas di Luar",
        description:
            "Kurangi aktivitas di luar ruangan ketika kualitas udara sedang tidak sehat."
    },
    {
        icon: "⌂",
        title: "Di Dalam Ruangan",
        description:
            "Pastikan sirkulasi udara di dalam ruangan tetap baik dan lingkungan tetap bersih."
    },
    {
        icon: "♥",
        title: "Lindungi Diri",
        description:
            "Gunakan perlindungan yang sesuai ketika kualitas udara berada pada kondisi kurang baik."
    },
    {
        icon: "✓",
        title: "Jaga Kesehatan",
        description:
            "Jaga kondisi tubuh dengan menerapkan pola hidup sehat dan memantau kualitas udara."
    }
];

export default function GuideLines() {
    return (
        <section className="guidelines">
            <div className="container">

                <div className="guidelines-header">
                    <p className="section-label">
                        Panduan Kesehatan
                    </p>

                    <h2>
                        Panduan Menjaga Kesehatan Udara
                    </h2>

                    <p>
                        Terapkan beberapa panduan berikut untuk membantu
                        menjaga kesehatan ketika menghadapi kondisi kualitas udara.
                    </p>
                </div>

                <div className="guidelines-grid">
                    {guidelines.map((item) => (
                        <article
                            className="guideline-card"
                            key={item.title}
                        >
                            <div className="guideline-icon">
                                {item.icon}
                            </div>

                            <h3>{item.title}</h3>

                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}