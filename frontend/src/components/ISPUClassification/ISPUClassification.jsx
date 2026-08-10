import "./ISPUClassification.css";

export default function ISPUClassification() {
    return (
        <section className="ispu-classification">
            <div className="container">
                
                <h2 className="classification-title">Klasifikasi Berdasarkan Nilai ISPU</h2>
                
                <div className="classification-grid">
                    
                    {/* CARD 1: BAIK */}
                    <div className="classification-card card-baik">
                        <div className="ispu-badge badge-baik">0 - 50</div>
                        <div className="card-header">
                            <h3>Baik</h3>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <circle cx="18" cy="18" r="18" fill="#10b981"/>
                                <circle cx="12" cy="14" r="2.5" fill="#1a202c"/>
                                <circle cx="24" cy="14" r="2.5" fill="#1a202c"/>
                                <path d="M10 21C12.5 24.5 23.5 24.5 26 21" stroke="#1a202c" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <p>Tingkat kualitas udara yang sangat baik, tidak memberikan efek negatif pada manusia, hewan, maupun tumbuhan.</p>
                    </div>

                    {/* CARD 2: SEDANG */}
                    <div className="classification-card card-sedang">
                        <div className="ispu-badge badge-sedang">51 - 100</div>
                        <div className="card-header">
                            <h3>Sedang</h3>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <circle cx="18" cy="18" r="18" fill="#3b82f6"/>
                                <circle cx="12" cy="14" r="2.5" fill="#1a202c"/>
                                <circle cx="24" cy="14" r="2.5" fill="#1a202c"/>
                                <line x1="11" y1="22" x2="25" y2="22" stroke="#1a202c" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <p>Kualitas udara masih dapat diterima secara umum dan tidak memberikan dampak buruk pada kesehatan makhluk hidup.</p>
                    </div>

                    {/* CARD 3: TIDAK SEHAT */}
                    <div className="classification-card card-tidak-sehat">
                        <div className="ispu-badge badge-tidak-sehat">101 - 200</div>
                        <div className="card-header">
                            <h3>Tidak Sehat</h3>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <circle cx="18" cy="18" r="18" fill="#f59e0b"/>
                                <circle cx="12" cy="13" r="2" fill="#1a202c"/>
                                <circle cx="24" cy="13" r="2" fill="#1a202c"/>
                                <rect x="9" y="19" width="18" height="9" rx="2" fill="white"/>
                                <line x1="12" y1="23.5" x2="24" y2="23.5" stroke="#cbd5e1" strokeWidth="1.5"/>
                            </svg>
                        </div>
                        <p>Tingkat kualitas udara yang mulai merugikan kesehatan manusia, hewan, dan tumbuhan di sekitar.</p>
                    </div>

                    {/* CARD 4: SANGAT TIDAK SEHAT */}
                    <div className="classification-card card-sangat-tidak-sehat">
                        <div className="ispu-badge badge-sangat-tidak-sehat">201 - 300</div>
                        <div className="card-header">
                            <h3>Sangat Tidak Sehat</h3>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <circle cx="18" cy="18" r="18" fill="#ef4444"/>
                                <path d="M9 11L14 13M27 11L22 13" stroke="#1a202c" strokeWidth="2.5" strokeLinecap="round"/>
                                <circle cx="13" cy="15" r="2" fill="#1a202c"/>
                                <circle cx="23" cy="15" r="2" fill="#1a202c"/>
                                <rect x="10" y="21" width="16" height="8" rx="2" fill="white"/>
                            </svg>
                        </div>
                        <p>Kualitas udara berada pada tingkat yang dapat merugikan kesehatan pada sejumlah segmen populasi yang terpapar.</p>
                    </div>

                    {/* CARD 5: BERBAHAYA */}
                    <div className="classification-card card-berbahaya">
                        <div className="ispu-badge badge-berbahaya">≥ 301</div>
                        <div className="card-header">
                            <h3>Berbahaya</h3>
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <circle cx="18" cy="18" r="18" fill="#64748b"/>
                                <path d="M11 11L15 15M15 11L11 15M25 11L21 15M21 11L25 15" stroke="#1a202c" strokeWidth="2.5" strokeLinecap="round"/>
                                <rect x="11" y="20" width="14" height="8" rx="2" fill="#1a202c"/>
                                <circle cx="14" cy="24" r="2" fill="#64748b"/>
                                <circle cx="22" cy="24" r="2" fill="#64748b"/>
                            </svg>
                        </div>
                        <p>Tingkat kualitas udara yang sangat serius dan dapat mengakibatkan kerusakan kesehatan yang parah.</p>
                    </div>

                </div>
            </div>
        </section>
    );
}