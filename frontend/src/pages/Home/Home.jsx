import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import Indicators from "../../components/Indicators/Indicators";
import AIRecommendation from "../../components/AIRecommendation/AIRecommendation";
import GuideLines from "../../components/GuideLines/GuideLines";
import Footer from "../../components/Footer/Footer";

export default function Home() {
    const [homeData, setHomeData] = useState({
        about: null,
        indicators: [],
        guides: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomepageContent = async () => {
            try {
                // Call your backend API
                const response = await fetch("http://localhost:5000/api/content/get-home-content");
                const result = await response.json();
                
                if (result.success) {
                    setHomeData({
                        about: result.data.about,
                        indicators: result.data.indicators,
                        guides: result.data.guides
                    });
                }
            } catch (error) {
                console.error("Gagal memuat konten homepage:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomepageContent();
    }, []);

    return (
        <>
            <Navbar />
            <Hero />
            
            {/* Pass data and loading state as props */}
            <About about={homeData.about} loading={loading} />
            <Indicators indicators={homeData.indicators} loading={loading} />
            <AIRecommendation />
            <GuideLines guides={homeData.guides} loading={loading} />

            <Footer />
        </>
    );
}