import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import KondisiUdara from "./pages/KondisiUdara/KondisiUdara";
import IndikatorPengukuran from "./pages/IndikatorPengukuran/IndikatorPengukuran";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function PageLoader() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Admin pages use their own lightweight shell and should not show
        // the public website loader.
        if (location.pathname.startsWith("/admin")) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = window.setTimeout(() => setLoading(false), 700);
        const hash = window.location.hash.replace(/^#/, "");

        if (hash) {
            window.setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 80);
        } else {
            window.scrollTo(0, 0);
        }

        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname.startsWith("/admin")) return;

        const finish = () => setLoading(false);

        if (document.readyState === "complete") {
            const timer = window.setTimeout(finish, 450);
            return () => window.clearTimeout(timer);
        }

        window.addEventListener("load", finish, { once: true });
        return () => window.removeEventListener("load", finish);
    }, [location.pathname]);

    if (location.pathname.startsWith("/admin")) return null;

    return (
        <div
            className={`page-loader ${loading ? "is-visible" : "is-hidden"}`}
            aria-hidden={!loading}
        >
            <div className="loader-orbit">
                <span></span>
                <span></span>
                <span></span>
                <div className="loader-core">A</div>
            </div>
            <div className="loader-brand">AIRIS</div>
            <div className="loader-line"><span /></div>
        </div>
    );
}

function ScrollEffects() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith("/admin")) return;

        document.documentElement.classList.add("js-ready");

        const revealTargets = document.querySelectorAll(
            "main > section, .hero, .section-label, .indicator-card, .guideline-card, " +
            ".overview-card, .ispu-card, .gas-card, .recommendation-result, .history-card, " +
            ".classification-card, .gas-parameter-item"
        );

        revealTargets.forEach((element, index) => {
            element.classList.add("reveal-on-scroll");
            element.style.setProperty(
                "--reveal-delay",
                `${Math.min(index % 6, 5) * 55}ms`
            );
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });

        revealTargets.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [location.pathname]);

    return null;
}

function App() {
    return (
        <>
            <PageLoader />
            <ScrollEffects />

            <Routes>
                {/* Public website. No admin button/link is added here. */}
                <Route path="/" element={<Home />} />
                <Route path="/KondisiUdara" element={<KondisiUdara />} />
                <Route
                    path="/IndikatorPengukuran"
                    element={<IndikatorPengukuran />}
                />

                {/* Admin is reachable only through its URL. */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
        </>
    );
}

export default App;
