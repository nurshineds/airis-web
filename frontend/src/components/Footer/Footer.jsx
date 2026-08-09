import "./Footer.css";

function LocationIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2.1Z" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 8.1 5.2a1.7 1.7 0 0 0 1.8 0L21 7" />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">

                <div className="footer-main">

                    {/* LEFT SIDE */}
                    <div className="footer-brand">

                        <div className="footer-brand-heading">
                            <div className="footer-logo-mark">
                                MTsN
                            </div>

                            <h2>MTsN 2 Kota Malang</h2>
                        </div>

                        <p>
                            &quot;Madrasah Berkarakter Islami, Unggul dalam Prestasi
                            dan Berbudaya Lingkungan dalam Rangka Mewujudkan
                            Masyarakat yang Rukun, Maslahat dan Cerdas.&quot;
                        </p>

                        <p className="footer-program">
                            <strong>PROGRAM MADRASAH:</strong>{" "}
                            Madrasah Maju, Bermutu, Mendunia.
                        </p>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="footer-contact">

                        <h3>Informasi Kontak</h3>

                        <ul>

                            <li>
                                <LocationIcon />

                                <span>
                                    Jl. Raya Cemorokandang No. 77 Kota Malang,
                                    <br />
                                    Jawa Timur
                                </span>
                            </li>

                            <li>
                                <PhoneIcon />

                                <span>
                                    (0341) 711500
                                </span>
                            </li>

                            <li>
                                <MailIcon />

                                <span>
                                    mtsnmalang2adm@gmail.com
                                </span>
                            </li>

                        </ul>

                    </div>

                </div>

                {/* COPYRIGHT */}
                <div className="footer-bottom">
                    <p>
                        © 2026 Sistem Pemantauan Udara Berbasis IoT &amp; AI
                        (AIRIS). All Rights Reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}