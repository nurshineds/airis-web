import "./About.css";

export default function About({ about, loading }) {
    if (loading) {
        return (
            <section className="about">
                <div className="container"><p>Memuat tentang AIRIS...</p></div>
            </section>
        );
    }

    if (!about) return null;

    return (
        <section className="about">
            <div className="container">
                {/* Loaded dynamically from DB */}
                <h2>{about.title}</h2>
                <p>{about.content}</p>
            </div>
        </section>
    );
}