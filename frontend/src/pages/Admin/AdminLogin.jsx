import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import "./Admin.css";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    if (sessionStorage.getItem("airis_admin_auth") === "true") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");

        // UI-only authentication. No backend/API call is made.
        if (username.trim().toLowerCase() === "admin" && password === "admin123") {
            sessionStorage.setItem("airis_admin_auth", "true");
            navigate("/admin/dashboard", { replace: true });
            return;
        }

        setError("Username atau password tidak sesuai.");
    };

    return (
        <main className="admin-login-page">
            <section className="admin-login-card" aria-label="Login administrator">
                <div className="admin-login-brand">
                    <div>
                        <strong>AIRIS</strong>
                        <span>Administrator</span>
                    </div>
                </div>

                <div className="admin-login-heading">
                    <p className="admin-eyebrow">ADMIN PANEL</p>
                    <h1>Masuk ke Dashboard</h1>
                    <p>Kelola konten website dan threshold indikator.</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <label className="admin-field">
                        <span>Username</span>
                        <div className="admin-input-wrap">
                            <FiUser aria-hidden="true" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan username"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </label>

                    <label className="admin-field">
                        <span>Password</span>
                        <div className="admin-input-wrap">
                            <FiLock aria-hidden="true" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="admin-password-toggle"
                                onClick={() => setShowPassword((value) => !value)}
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </label>

                    {error && (
                        <div className="admin-login-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button className="admin-login-submit" type="submit">
                        Masuk
                    </button>
                </form>

                <p className="admin-login-note">
                    Halaman administrator hanya dapat diakses melalui endpoint admin.
                </p>
            </section>
        </main>
    );
}
