import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                
                <div className="navbar-logo">
                    <a href="/">AIRIS</a>
                </div>

                {/* Hamburger Icon (Visible only on Mobile) */}
                <div 
                    className={`hamburger ${isMenuOpen ? "active" : ""}`} 
                    onClick={toggleMenu}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                {/* Navigation Links */}
                <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
                    <li><a href="/">Beranda</a></li>
                    <li><a href="/KondisiUdara">Kondisi Udara</a></li>
                    <li><a href="/IndikatorPengukuran">Indikator Pengukuran</a></li>
                    <li><a href="/PedomanKesehatan">Pedoman Kesehatan</a></li>
                </ul>

            </div>
        </nav>
    );
}