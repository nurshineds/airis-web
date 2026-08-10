import "./ISPUInfo.css";

export default function ISPUInfo() {
    return (
        <section className="ispu-info">
            <div className="container">
                <div className="ispu-info-content">
                    
                    <h1 className="ispu-title">Indeks Standar Pencemar Udara (ISPU)</h1>
                    
                    <p className="ispu-description">
                        ISPU adalah angka yang tidak mempunyai satuan yang menggambarkan kondisi kualitas 
                        udara ambien di lokasi dan waktu tertentu, yang didasarkan kepada dampak terhadap 
                        kesehatan manusia, nilai estetika, dan makhluk hidup lainnya.
                    </p>

                    <h2 className="gas-parameter-title">Gas dan parameter yang diukur meliputi:</h2>

                    <div className="gas-parameter-list">
                        
                        <div className="gas-parameter-item">
                            <div className="gas-symbol">CO</div>
                            <div className="gas-name">Karbon Monoksida</div>
                        </div>

                        <div className="gas-parameter-item">
                            <div className="gas-symbol">NO₂</div>
                            <div className="gas-name">Nitrogen Dioksida</div>
                        </div>

                        <div className="gas-parameter-item">
                            <div className="gas-symbol">SO₂</div>
                            <div className="gas-name">Sulfur Dioksida</div>
                        </div>

                        <div className="gas-parameter-item">
                            <div className="gas-symbol">O₃</div>
                            <div className="gas-name">Ozon Permukaan</div>
                        </div>

                        <div className="gas-parameter-item">
                            <div className="gas-symbol">HC</div>
                            <div className="gas-name">Hidrokarbon</div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}