import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Footer.css";

function LocationIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>; }
function PhoneIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2.1Z"/></svg>; }
function MailIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 8.1 5.2a1.7 1.7 0 0 0 1.8 0L21 7"/></svg>; }
function ArrowIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M13 7l5 5-5 5"/></svg>; }

export default function Footer() {
    const location = useLocation();
    const navigate = useNavigate();

    const goHomeSection = (sectionId) => {
        if (location.pathname === "/") {
            window.setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 0);
            window.history.replaceState(null, "", `/#${sectionId}`);
            return;
        }

        navigate(`/#${sectionId}`);
    };

    const handleSectionClick = (event, sectionId) => {
        event.preventDefault();
        goHomeSection(sectionId);
    };

    const backToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="site-footer">
            <div className="footer-noise" aria-hidden="true" />
            <div className="footer-orb footer-orb-one" aria-hidden="true" />
            <div className="footer-orb footer-orb-two" aria-hidden="true" />

            <div className="footer-inner">
                <div className="footer-topline">
                    <span className="footer-live"><i /> SISTEM AKTIF</span>
                    <span>Air Quality Intelligence System</span>
                </div>

                <div className="footer-main">
                    <div className="footer-brand">
                        <div className="footer-brand-heading">
                            <div className="footer-logo-mark">MTsN</div>
                            <div>
                                <span className="footer-eyebrow">Dikembangkan untuk</span>
                                <h2>MTsN 2 Kota Malang</h2>
                            </div>
                        </div>
                        <p className="footer-description">AIRIS membantu memantau kualitas udara dengan data terukur, visualisasi yang mudah dipahami, dan informasi yang dapat digunakan untuk menjaga lingkungan tetap sehat.</p>
                        <p className="footer-program"><strong>PROGRAM MADRASAH</strong><span>Madrasah Maju, Bermutu, Mendunia.</span></p>
                    </div>

                    <div className="footer-column">
                        <h3>Jelajahi</h3>
                        <nav className="footer-links" aria-label="Navigasi footer">
                            <Link to="/">Beranda <ArrowIcon /></Link>
                            <Link to="/KondisiUdara">Kondisi Udara <ArrowIcon /></Link>
                            <Link to="/IndikatorPengukuran">Indikator Pengukuran <ArrowIcon /></Link>
                            <a href="/#rekomendasi-kesehatan" onClick={(event) => handleSectionClick(event, "rekomendasi-kesehatan")}>Rekomendasi Kesehatan <ArrowIcon /></a>
                            <a href="/#pedoman-kesehatan" onClick={(event) => handleSectionClick(event, "pedoman-kesehatan")}>Pedoman Kesehatan <ArrowIcon /></a>
                        </nav>
                    </div>

                    <div className="footer-contact">
                        <h3>Informasi Kontak</h3>
                        <ul>
                            <li><LocationIcon /><span>Jl. Raya Cemorokandang No. 77 Kota Malang,<br/>Jawa Timur</span></li>
                            <li><PhoneIcon /><span>(0341) 711500</span></li>
                            <li><MailIcon /><span>mtsnmalang2adm@gmail.com</span></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Sistem Pemantauan Udara Berbasis IoT &amp; AI (AIRIS). All Rights Reserved.</p>
                    <button className="back-top" type="button" onClick={backToTop} aria-label="Kembali ke atas">
                        <span>Kembali ke atas</span><ArrowIcon />
                    </button>
                </div>
            </div>
        </footer>
    );
}
