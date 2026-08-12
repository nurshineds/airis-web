import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const links = [
    { to: "/", label: "Beranda", end: true, icon: "home" },
    { to: "/KondisiUdara", label: "Kondisi Udara", icon: "air" },
    { to: "/IndikatorPengukuran", label: "Indikator Pengukuran", icon: "chart" },
];

function Icon({ name }) {
    if (name === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-6h6v6" /></svg>;
    if (name === "air") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h11.5a3.5 3.5 0 1 0-3.2-5" /><path d="M3 12h15a3 3 0 1 1-2.7 4.3" /><path d="M3 16h8" /></svg>;
    if (name === "guide") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2H20v17H8.5A2.5 2.5 0 0 0 6 21.5Z" /><path d="M6 4.5v17" /><path d="M10 6h6M10 10h6M10 14h4" /></svg>;
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5" /><path d="M4 19h17" /><path d="m7 15 4-5 3 3 6-7" /><circle cx="7" cy="15" r="1" /><circle cx="11" cy="10" r="1" /><circle cx="14" cy="13" r="1" /><circle cx="20" cy="6" r="1" /></svg>;
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hovered, setHovered] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const closeMenu = () => setIsMenuOpen(false);
    const isKondisiUdara = location.pathname === "/KondisiUdara";
    const goHomeSection = (sectionId) => {
        closeMenu();
        if (location.pathname === "/") {
            window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
            window.history.replaceState(null, "", `/#${sectionId}`);
            return;
        }
        navigate(`/#${sectionId}`);
    };

    const isPanduan = false;

    const handleSectionClick = (event, sectionId) => {
        event.preventDefault();
        goHomeSection(sectionId);
    };

    return (
        <nav className="navbar" onMouseLeave={() => setHovered(null)}>
            <div className="container navbar-container">
                <NavLink to="/" className="navbar-logo" onClick={closeMenu} aria-label="AIRIS Beranda">
                    <span>AIRIS</span>
                </NavLink>

                <button
                    className={`hamburger ${isMenuOpen ? "active" : ""}`}
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-label="Buka menu"
                    aria-expanded={isMenuOpen}
                >
                    <span className="bar"></span><span className="bar"></span><span className="bar"></span>
                </button>

                <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
                    {links.map(({ to, label, end, icon }) => (
                        <li key={to} onMouseEnter={() => setHovered(to)}>
                            <NavLink
                                to={to}
                                end={end}
                                onClick={closeMenu}
                                className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
                            >
                                <span className="nav-tab-icon"><Icon name={icon} /></span>
                                <span className="nav-tab-label">{label}</span>
                                <span className="nav-tab-shine" />
                            </NavLink>
                        </li>
                    ))}

                    <li onMouseEnter={() => setHovered("rekomendasi")}>
                        <a
                            href="/#rekomendasi-kesehatan"
                            className="nav-tab"
                            onClick={(event) => handleSectionClick(event, "rekomendasi-kesehatan")}
                        >
                            <span className="nav-tab-icon"><Icon name="guide" /></span>
                            <span className="nav-tab-label">Rekomendasi Kesehatan</span>
                            <span className="nav-tab-shine" />
                        </a>
                    </li>

                    <li onMouseEnter={() => setHovered("pedoman")}>
                        <a
                            href="/#pedoman-kesehatan"
                            className="nav-tab"
                            onClick={(event) => handleSectionClick(event, "pedoman-kesehatan")}
                        >
                            <span className="nav-tab-icon"><Icon name="guide" /></span>
                            <span className="nav-tab-label">Pedoman Kesehatan</span>
                            <span className="nav-tab-shine" />
                        </a>
                    </li>

                </ul>
                <span className={`nav-hover-line ${hovered ? "visible" : ""}`} aria-hidden="true" />
            </div>
        </nav>
    );
}
