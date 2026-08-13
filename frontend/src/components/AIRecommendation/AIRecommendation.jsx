import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "./AIRecommendation.css";

// Ganti dengan link grup WhatsApp UKS yang sebenarnya
const GRUP_WA_UKS = "https://chat.whatsapp.com/ECrcqyxmO153zBCR9XZMrZ?s=cl&p=a&ilr=1";

const symptoms = [
    "Batuk",
    "Pilek",
    "Sesak napas",
    "Pusing",
    "Mual",
    "Nyeri tenggorokan",
    "Mata iritasi",
    "Tidak ada gejala",
    "Lainnya",
];

const ageGroups = [
    { value: "0-4", label: "0–4 tahun (balita)" },
    { value: "5-17", label: "5–17 tahun (anak/remaja)" },
    { value: "18-59", label: "18–59 tahun (dewasa)" },
    { value: "60+", label: "60 tahun ke atas (lansia)" },
];

export default function AIRecommendation() {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [otherSymptom, setOtherSymptom] = useState("");
    const [ageGroup, setAgeGroup] = useState("");
    const [showRecommendation, setShowRecommendation] = useState(false);
    const [showUksForm, setShowUksForm] = useState(false);
    const [studentName, setStudentName] = useState("");
    const [studentClass, setStudentClass] = useState("");
    const [chatFormat, setChatFormat] = useState("");
    const [copied, setCopied] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [clipboardBlocked, setClipboardBlocked] = useState(false);

    const toggleSymptom = (symptom) => {
        setShowRecommendation(false);

        if (symptom === "Tidak ada gejala") {
            setSelectedSymptoms((current) => current.includes(symptom) ? [] : [symptom]);
            setOtherSymptom("");
            return;
        }

        setSelectedSymptoms((current) => {
            const withoutNone = current.filter((item) => item !== "Tidak ada gejala");
            return withoutNone.includes(symptom)
                ? withoutNone.filter((item) => item !== symptom)
                : [...withoutNone, symptom];
        });
    };

    const effectiveSymptoms = useMemo(() => {
        const list = selectedSymptoms.filter((item) => item !== "Lainnya");
        if (selectedSymptoms.includes("Lainnya") && otherSymptom.trim()) {
            list.push(otherSymptom.trim());
        }
        return list;
    }, [selectedSymptoms, otherSymptom]);

    const canRecommend = selectedSymptoms.length > 0 && ageGroup !== "" &&
        (!selectedSymptoms.includes("Lainnya") || otherSymptom.trim() !== "");

    const handleRecommendation = () => {
        if (!canRecommend) return;
        setShowRecommendation(true);
    };

    return (
        <>
        <section className="ai-recommendation" id="rekomendasi-kesehatan">
            <div className="container">
                <div className="ai-header">
                    <p className="ai-label">AIRIS AI</p>
                    <h2>Rekomendasi Kesehatan</h2>
                    <p>
                        Pilih satu atau beberapa gejala, lalu tentukan kelompok umur
                        untuk mendapatkan rekomendasi kesehatan yang lebih sesuai.
                    </p>
                </div>

                <div className="ai-form">
                    <div className="form-field-group">
                        <p className="form-label">Gejala yang dirasakan</p>
                        <p className="form-help">Anda dapat memilih lebih dari satu gejala.</p>

                        <div className="condition-list" role="group" aria-label="Pilih gejala">
                            {symptoms.map((symptom) => (
                                <button
                                    key={symptom}
                                    className={`condition-button ${selectedSymptoms.includes(symptom) ? "selected" : ""}`}
                                    type="button"
                                    aria-pressed={selectedSymptoms.includes(symptom)}
                                    onClick={() => toggleSymptom(symptom)}
                                >
                                    <span className="condition-check" aria-hidden="true">
                                        {selectedSymptoms.includes(symptom) ? "✓" : ""}
                                    </span>
                                    <span>{symptom}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedSymptoms.includes("Lainnya") && (
                        <div className="other-symptom-field">
                            <label htmlFor="other-symptom" className="select-label">
                                Gejala lainnya
                            </label>
                            <input
                                id="other-symptom"
                                className="condition-input"
                                type="text"
                                value={otherSymptom}
                                onChange={(event) => {
                                    setOtherSymptom(event.target.value);
                                    setShowRecommendation(false);
                                }}
                                placeholder="Tuliskan gejala lainnya"
                                maxLength={100}
                            />
                        </div>
                    )}

                    <div className="age-field">
                        <label htmlFor="age-group" className="select-label">
                            Kelompok umur
                        </label>
                        <select
                            id="age-group"
                            className="condition-select"
                            value={ageGroup}
                            onChange={(event) => {
                                setAgeGroup(event.target.value);
                                setShowRecommendation(false);
                                setChatFormat("");
                                setCopied(false);
                            }}
                        >
                            <option value="" disabled>
                                Pilih kelompok umur
                            </option>
                            {ageGroups.map((age) => (
                                <option key={age.value} value={age.value}>{age.label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="recommendation-button"
                        type="button"
                        disabled={!canRecommend}
                        onClick={handleRecommendation}
                    >
                        Dapatkan Rekomendasi
                    </button>
                </div>

                {showRecommendation && (
                    <div className="recommendation-result" aria-live="polite">
                        <div className="result-header">
                            <span className="result-icon">✓</span>
                            <div>
                                <h3>Data berhasil dipilih</h3>
                                <p className="result-summary">
                                    Umur: <strong>{ageGroups.find((age) => age.value === ageGroup)?.label}</strong>
                                    <br />
                                    Gejala: <strong>{effectiveSymptoms.join(", ")}</strong>
                                </p>
                            </div>
                        </div>

                        <p>
                            Berdasarkan data yang dipilih, tetap pantau kualitas udara dan
                            kurangi aktivitas di luar ruangan apabila kondisi udara memburuk.
                        </p>

                        <div className="result-action">
                            <strong>Tindakan yang Disarankan</strong>
                            <p>
                                Perhatikan perubahan gejala dan kualitas udara. Gunakan
                                perlindungan yang sesuai ketika kondisi udara kurang baik.
                            </p>
                        </div>

                        <button
                            className="uks-button"
                            type="button"
                            onClick={() => setShowUksForm((current) => !current)}
                        >
                            Hubungi UKS
                        </button>

                        {showUksForm && (
                            <div className="uks-form" aria-label="Form Hubungi UKS">
                                <div className="uks-form-header">
                                    <h4>Hubungi UKS</h4>
                                    <p>
                                        Isi data berikut agar petugas UKS mengetahui
                                        identitas dan gejala yang Anda pilih.
                                    </p>
                                </div>

                                <div className="uks-form-grid">
                                    <div className="uks-field">
                                        <label htmlFor="uks-name">Nama</label>
                                        <input
                                            id="uks-name"
                                            type="text"
                                            value={studentName}
                                            onChange={(event) => setStudentName(event.target.value)}
                                            placeholder="Masukkan nama"
                                            maxLength={100}
                                        />
                                    </div>

                                    <div className="uks-field">
                                        <label htmlFor="uks-class">Kelas</label>
                                        <input
                                            id="uks-class"
                                            type="text"
                                            value={studentClass}
                                            onChange={(event) => setStudentClass(event.target.value)}
                                            placeholder="Contoh: XI IPA 1"
                                            maxLength={30}
                                        />
                                    </div>
                                </div>

                                <div className="uks-symptoms">
                                    <span>Gejala yang dipilih</span>
                                    <div className="uks-symptom-list">
                                        {effectiveSymptoms.length > 0 ? (
                                            effectiveSymptoms.map((symptom) => (
                                                <span className="uks-symptom" key={symptom}>
                                                    {symptom}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="uks-no-symptom">Tidak ada gejala</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="uks-submit-button"
                                    type="button"
                                    disabled={!studentName.trim() || !studentClass.trim()}
                                    onClick={() => {
                                        const ageLabel = ageGroups.find((age) => age.value === ageGroup)?.label || ageGroup;
                                        const symptomsText = effectiveSymptoms.length
                                            ? effectiveSymptoms.join(", ")
                                            : "Tidak ada gejala";

                                        const message = [
                                            "Halo UKS, saya ingin mendapatkan bantuan.",
                                            "",
                                            `Nama: ${studentName.trim()}`,
                                            `Kelas: ${studentClass.trim()}`,
                                            `Umur: ${ageLabel}`,
                                            `Gejala: ${symptomsText}`,
                                            "",
                                            "Mohon bantuan dan tindak lanjut dari UKS. Terima kasih."
                                        ].join("\n");

                                        setChatFormat(message);
                                        setCopied(false);
                                    }}
                                >
                                    Hasilkan format chat
                                </button>

                                {chatFormat && (
                                    <div className="uks-chat-result">
                                        <label htmlFor="uks-chat-format">Format chat untuk UKS</label>
                                        <textarea
                                            id="uks-chat-format"
                                            value={chatFormat}
                                            readOnly
                                            rows={9}
                                        />

                                        <div className="uks-chat-actions">
                                            <button
                                                className="uks-copy-button"
                                                type="button"
                                                onClick={async () => {
                                                    try {
                                                        await navigator.clipboard.writeText(chatFormat);
                                                        setCopied(true);
                                                    } catch {
                                                        const textarea = document.getElementById("uks-chat-format");
                                                        textarea?.select();
                                                        document.execCommand("copy");
                                                        setCopied(true);
                                                    }
                                                }}
                                            >
                                                {copied ? "Tersalin" : "Salin ke clipboard"}
                                            </button>

                                            <button
                                                className="uks-send-button"
                                                type="button"
                                                onClick={() => {
                                                    setClipboardBlocked(false);
                                                    if (navigator.clipboard && window.isSecureContext) {
                                                        navigator.clipboard.writeText(chatFormat)
                                                            .then(() => {
                                                                setCopied(true);
                                                                setShowPopup(true);
                                                            })
                                                            .catch(() => {
                                                                setClipboardBlocked(true);
                                                            });
                                                    } else {
                                                        // Fallback execCommand
                                                        try {
                                                            const textarea = document.getElementById("uks-chat-format");
                                                            textarea?.select();
                                                            const ok = document.execCommand("copy");
                                                            if (ok) {
                                                                setCopied(true);
                                                                setShowPopup(true);
                                                            } else {
                                                                setClipboardBlocked(true);
                                                            }
                                                        } catch {
                                                            setClipboardBlocked(true);
                                                        }
                                                    }
                                                }}
                                            >
                                                Kirim ke Grup UKS
                                            </button>
                                            <p className="uks-send-hint">
                                                Pesan akan otomatis tersalin — tinggal paste di grup UKS.
                                            </p>
                                            {clipboardBlocked && (
                                                <div className="uks-clipboard-warning" role="alert">
                                                    <span className="uks-clipboard-warning-icon">⚠️</span>
                                                    <div>
                                                        <strong>Akses clipboard diblokir</strong>
                                                        <p>
                                                            Aktifkan izin clipboard di browser kamu agar pesan bisa tersalin otomatis.
                                                            Atau salin manual teks di atas, lalu paste ke grup UKS.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>

        {showPopup && createPortal(
            <div className="uks-popup-overlay" role="dialog" aria-modal="true" aria-label="Instruksi kirim ke UKS">
                <div className="uks-popup">
                    <div className="uks-popup-icon">📋</div>
                    <h3>Pesan Siap Dikirim!</h3>
                    <p>
                        Pesan laporan gejalamu sudah <strong>tersalin otomatis</strong>.
                        Setelah grup WhatsApp UKS terbuka, cukup <strong>tekan area chat lalu paste</strong> — pesanmu langsung terisi.
                    </p>
                    <ol className="uks-popup-steps">
                        <li>Klik <strong>"Buka Grup UKS"</strong> di bawah</li>
                        <li>Grup WhatsApp UKS akan terbuka</li>
                        <li>Tekan area ketik, lalu <strong>paste</strong> (Ctrl+V / tahan lalu Tempel)</li>
                        <li>Kirim pesan ✓</li>
                    </ol>
                    <div className="uks-popup-actions">
                        <button
                            className="uks-popup-cancel"
                            type="button"
                            onClick={() => setShowPopup(false)}
                        >
                            Batal
                        </button>
                        <button
                            className="uks-popup-confirm"
                            type="button"
                            onClick={() => {
                                setShowPopup(false);
                                window.open(GRUP_WA_UKS, "_blank", "noopener,noreferrer");
                            }}
                        >
                            Buka Grup UKS →
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )}
        </>
    );
}
