import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import KondisiUdara from "./pages/KondisiUdara/KondisiUdara";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/KondisiUdara" element={<KondisiUdara />} />
        </Routes>
    );
}

export default App;