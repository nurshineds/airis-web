import "./MonitoringHistory.css";

export default function MonitoringHistory() {
    return (
        <section className="monitoring-history">
            <div className="container">
                
                <div className="history-header">
                    <h2>Riwayat Pemantauan (7 Hari Terakhir)</h2>
                    
                    <button className="export-csv-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export CSV
                    </button>
                </div>

                <div className="history-card">
                    <h3 className="history-card-title">Tren Indeks Standar Pencemar Udara (ISPU)</h3>
                    
                    <div className="chart-container">
                        {/* Minimalist SVG Line Chart */}
                        <svg viewBox="0 0 800 120" className="trend-chart" preserveAspectRatio="none">
                            <path 
                                d="M 10,90 L 140,70 L 270,85 L 400,40 L 530,55 L 660,20 L 790,25" 
                                fill="none" 
                                stroke="#5b9b61" 
                                strokeWidth="4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                            />
                            
                            {/* Data Points */}
                            <circle cx="10" cy="90" r="5" fill="#5b9b61" />
                            <circle cx="140" cy="70" r="5" fill="#5b9b61" />
                            <circle cx="270" cy="85" r="5" fill="#5b9b61" />
                            <circle cx="400" cy="40" r="5" fill="#5b9b61" />
                            <circle cx="530" cy="55" r="5" fill="#5b9b61" />
                            <circle cx="660" cy="20" r="5" fill="#5b9b61" />
                            <circle cx="790" cy="25" r="5" fill="#5b9b61" />
                        </svg>
                        
                        <div className="chart-labels">
                            <span>Senin</span>
                            <span>Selasa</span>
                            <span>Rabu</span>
                            <span>Kamis</span>
                            <span>Jumat</span>
                            <span>Sabtu</span>
                            <span>Minggu</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}