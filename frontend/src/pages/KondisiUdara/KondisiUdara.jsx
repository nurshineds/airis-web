import Navbar from "../../components/Navbar/Navbar";
import CurrentAirCondition from "../../components/CurrentAirCondition/CurrentAirCondition";
import AIActionRecommendation from "../../components/AIActionRecommendation/AIActionRecommendation";
import MonitoringHistory from "../../components/MonitoringHistory/MonitoringHistory";
import Footer from "../../components/Footer/Footer";

export default function KondisiUdara() {
    return (
        <>
            <Navbar />
            <CurrentAirCondition />
            <AIActionRecommendation />
            <MonitoringHistory />
            <Footer />
        </>
    );
}