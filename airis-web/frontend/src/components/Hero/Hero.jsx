import { FiArrowRight, FiActivity, FiShield, FiWind } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Hero.css";
import heroImage from "../../assets/images/hero.png";

export default function Hero() {
    return (
        <section
            className="hero"
            style={{ backgroundImage: `url(${heroImage})` }}
        >
            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />
            <div className="hero-grid" aria-hidden="true" />

            <div className="container hero-inner">
                <div className="hero-content">
                    <div className="hero-eyebrow">
                        <span className="live-dot" />
                        <span>Pemantauan kualitas udara real-time</span>
                    </div>

                    <h1>
                        Udara sehat,
                        <br />
                        <span>madrasah hebat.</span>
                    </h1>

                    <p className="hero-description">
                        AIRIS membantu memantau kualitas udara di lingkungan madrasah
                        dengan data yang mudah dipahami dan rekomendasi tindakan yang tepat.
                    </p>

                    <div className="hero-actions">
                        <Link to="/KondisiUdara" className="hero-button">
                            Pantau Kondisi Udara
                            <FiArrowRight />
                        </Link>
                        <a href="#indikator" className="hero-secondary">
                            Lihat indikator
                        </a>
                    </div>

                    <div className="hero-trust">
                        <div><FiActivity /><span>Data terukur</span></div>
                        <div><FiWind /><span>Lingkungan sehat</span></div>
                        <div><FiShield /><span>Berbasis AI</span></div>
                    </div>
                </div>

                <div className="hero-dashboard">
                    <div className="dashboard-topline">
                        <div>
                            <span className="dashboard-kicker">AIR QUALITY INDEX</span>
                            <strong>Indeks Kualitas Udara</strong>
                        </div>
                        <span className="dashboard-live"><i /> LIVE</span>
                    </div>

                    <div className="aqi-main">
                        <div className="aqi-number">45</div>
                        <div className="aqi-status">
                            <span className="status-pill">Baik</span>
                            <small>Kondisi udara saat ini</small>
                        </div>
                    </div>

                    <div className="aqi-meter">
                        <span />
                    </div>

                    <div className="dashboard-footer">
                        <span>Update terakhir</span>
                        <strong>19/08/2026 · 09:30 WIB</strong>
                    </div>
                </div>
            </div>

            <div className="hero-scroll-hint">
                <span />
                Scroll untuk menjelajah
            </div>
        </section>
    );
}
