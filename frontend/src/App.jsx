import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import KondisiUdara from "./pages/KondisiUdara/KondisiUdara";
import IndikatorPengukuran from "./pages/IndikatorPengukuran/IndikatorPengukuran";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/KondisiUdara" element={<KondisiUdara />} />
            <Route path="/IndikatorPengukuran" element={<IndikatorPengukuran />} />
        </Routes>
    );
}

export default App;