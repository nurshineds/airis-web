import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import About from "../../components/About/About";
import Indicators from "../../components/Indicators/Indicators";
import AIRecommendation from "../../components/AIRecommendation/AIRecommendation";
import Guidelines from "../../components/Guidelines/Guidelines";
import Footer from "../../components/Footer/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <About />
            <Indicators />
            <AIRecommendation />
            <Guidelines />
            <Footer />
        </>
    );
}