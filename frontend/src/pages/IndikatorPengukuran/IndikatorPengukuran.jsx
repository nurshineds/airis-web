import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ISPUInfo from "../../components/ISPUInfo/ISPUInfo";
import ISPUClassification from "../../components/ISPUClassification/ISPUClassification";

export default function IndikatorPengukuran() {
    return (
        <>
            <Navbar />
            <main>
                <ISPUInfo />
                <ISPUClassification />
            </main>
            <Footer />
        </>
    );
}