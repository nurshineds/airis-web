import "./Hero.css";
import heroImage from "../../assets/images/hero.png";

export default function Hero() {
    return (
        <section
            className="hero"
            style={{
                backgroundImage: `linear-gradient(
                    rgba(20,83,45,.72),
                    rgba(20,83,45,.82)
                ), url(${heroImage})`,
            }}
        >
            <div className="hero-content">

                <h1>
                    Pemantauan Kualitas Udara
                    <br />
                    Pintar Madrasah
                </h1>

                <div className="update">
                    Update Terakhir
                    <span>19/08/2026 09:30 WIB</span>
                </div>

                <div className="overview-card">

                    <p>Indeks Standar Pencemar Udara</p>

                    <h2>45</h2>

                    <span className="status">
                        Baik
                    </span>

                </div>

                <button className="hero-button">
                    Cek Detail Rekomendasi Tindakan
                </button>

            </div>
        </section>
    );
}