import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">AIRIS</div>

            <ul className="nav-links">
                <li><a href="#">Beranda</a></li>
                <li><a href="#">Kondisi Udara</a></li>
                <li><a href="#">Indikator Pengukuran</a></li>
                <li><a href="#">Pedoman Kesehatan</a></li>
            </ul>
        </nav>
    );
}