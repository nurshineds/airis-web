import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {

    const [open, setOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("beranda");

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        setOpen(false);
    };

    return (
        <header className="navbar">

            <div className="navbar-container">

                <div className="logo">
                    AIRIS
                </div>

                <div
                    className="hamburger"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </div>

                <ul className={`nav-menu ${open ? "active" : ""}`}>

                    <li>
                        <a
                            href="#beranda"
                            className={activeMenu === "beranda" ? "active" : ""}
                            onClick={() => handleMenuClick("beranda")}
                        >
                            Beranda
                        </a>
                    </li>

                    <li>
                        <a
                            href="#kondisi"
                            className={activeMenu === "kondisi" ? "active" : ""}
                            onClick={() => handleMenuClick("kondisi")}
                        >
                            Kondisi Udara
                        </a>
                    </li>

                    <li>
                        <a
                            href="#indikator"
                            className={activeMenu === "indikator" ? "active" : ""}
                            onClick={() => handleMenuClick("indikator")}
                        >
                            Indikator Pengukuran
                        </a>
                    </li>

                    <li>
                        <a
                            href="#rekomendasi"
                            className={activeMenu === "rekomendasi" ? "active" : ""}
                            onClick={() => handleMenuClick("rekomendasi")}
                        >
                            Rekomendasi Kesehatan
                        </a>
                    </li>

                    <li>
                        <a
                            href="#panduan"
                            className={activeMenu === "panduan" ? "active" : ""}
                            onClick={() => handleMenuClick("panduan")}
                        >
                            Panduan Kesehatan
                        </a>
                    </li>

                </ul>

            </div>

        </header>
    );
}