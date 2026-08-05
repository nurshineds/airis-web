import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {

    return (

        <nav className="navbar">

            <div className="logo">
                AIRIS
            </div>

            <ul className="nav-links">

                <li>
                    <Link to="/">Beranda</Link>
                </li>

                <li>
                    <Link to="/kondisi-udara">
                        Kondisi Udara
                    </Link>
                </li>

                <li>
                    <Link to="/indikator">
                        Indikator Pengukuran
                    </Link>
                </li>

                <li>
                    <Link to="/pedoman">
                        Pedoman Kesehatan
                    </Link>
                </li>

            </ul>

        </nav>

    );

}