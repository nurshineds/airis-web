import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import Indicators from "../../components/Indicators/Indicators";
import AIRecommendation from "../../components/AIRecommendation/AIRecommendation";
import GuideLines from "../../components/GuideLines/GuideLines";

export default function Home() {
    return (
        <>
            <Navbar />

            <Hero />

            <About />

            <Indicators />

            <AIRecommendation />

            <GuideLines />
        </>
    );
}