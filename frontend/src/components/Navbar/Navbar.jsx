import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                AIRIS
            </Link>

            <ul>
                <li>
                    <Link to="/">Beranda</Link>
                </li>

                <li>
                    <Link to="/KondisiUdara">Kondisi Udara</Link>
                </li>

                <li>
                    <Link to="/IndikatorPengukuran">
                        Indikator Pengukuran
                    </Link>
                </li>

                <li>
                    <Link to="/PedomanKesehatan">
                        Pedoman Kesehatan
                    </Link>
                </li>
            </ul>

        </nav>
    );
}