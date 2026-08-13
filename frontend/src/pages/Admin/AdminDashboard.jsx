import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
    FiAlertTriangle,
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
    FiEdit2,
    FiFileText,
    FiGrid,
    FiLogOut,
    FiMenu,
    FiPlus,
    FiSearch,
    FiSliders,
    FiTrash2,
    FiX,
} from "react-icons/fi";
import "./Admin.css";

const initialContents = [
    {
        idContent: "CNT001",
        type: "hero",
        title: "Pantau Kualitas Udara",
        content: "Informasi kualitas udara secara real-time untuk membantu memahami kondisi lingkungan.",
        symbol: "AQ",
        icon: "wind",
        order: 1,
    },
    {
        idContent: "CNT002",
        type: "information",
        title: "Apa Itu ISPU?",
        content: "Indeks Standar Pencemar Udara digunakan untuk mengetahui kondisi kualitas udara.",
        symbol: "ISPU",
        icon: "info",
        order: 2,
    },
    {
        idContent: "CNT003",
        type: "guide",
        title: "Panduan Kesehatan",
        content: "Rekomendasi tindakan berdasarkan kondisi kualitas udara.",
        symbol: "HEALTH",
        icon: "heart",
        order: 3,
    },
];

const initialThresholds = [
    {
        indicatorName: "PM2.5",
        indicatorUnit: "µg/m³",
        maxTresholdValue: 55,
        minTresholdValue: 0,
        description: "Partikel halus yang dapat masuk jauh ke dalam saluran pernapasan.",
    },
    {
        indicatorName: "PM10",
        indicatorUnit: "µg/m³",
        maxTresholdValue: 150,
        minTresholdValue: 55,
        description: "Partikel udara dengan diameter aerodinamis hingga 10 mikrometer.",
    },
    {
        indicatorName: "CO",
        indicatorUnit: "µg/m³",
        maxTresholdValue: 10000,
        minTresholdValue: 0,
        description: "Karbon monoksida yang dapat berasal dari proses pembakaran.",
    },
];

const CONTENT_PAGE_SIZE = 6;
const THRESHOLD_PAGE_SIZE = 6;

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const authenticated = sessionStorage.getItem("airis_admin_auth") === "true";

    const [section, setSection] = useState("content");
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [topbarMenuOpen, setTopbarMenuOpen] = useState(false);

    const [contents, setContents] = useState(() =>
        readStorage("airis_admin_contents", initialContents)
    );
    const [thresholds, setThresholds] = useState(() =>
        readStorage("airis_admin_thresholds", initialThresholds)
    );

    const [contentSearch, setContentSearch] = useState("");
    const [thresholdSearch, setThresholdSearch] = useState("");
    const [contentPage, setContentPage] = useState(1);
    const [thresholdPage, setThresholdPage] = useState(1);

    const [contentModal, setContentModal] = useState(null);
    const [thresholdModal, setThresholdModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);

    useEffect(() => {
        localStorage.setItem("airis_admin_contents", JSON.stringify(contents));
    }, [contents]);

    useEffect(() => {
        localStorage.setItem("airis_admin_thresholds", JSON.stringify(thresholds));
    }, [thresholds]);

    useEffect(() => {
        setContentPage(1);
    }, [contentSearch]);

    useEffect(() => {
        setThresholdPage(1);
    }, [thresholdSearch]);

    if (!authenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const filteredContents = useMemo(() => {
        const keyword = contentSearch.toLowerCase().trim();
        if (!keyword) return contents;

        return contents.filter((item) =>
            [
                item.idContent,
                item.type,
                item.title,
                item.content,
                item.symbol,
                item.icon,
                String(item.order),
            ]
                .join(" ")
                .toLowerCase()
                .includes(keyword)
        );
    }, [contents, contentSearch]);

    const filteredThresholds = useMemo(() => {
        const keyword = thresholdSearch.toLowerCase().trim();
        if (!keyword) return thresholds;

        return thresholds.filter((item) =>
            [
                item.indicatorName,
                item.indicatorUnit,
                String(item.maxTresholdValue),
                String(item.minTresholdValue),
                item.description,
            ]
                .join(" ")
                .toLowerCase()
                .includes(keyword)
        );
    }, [thresholds, thresholdSearch]);

    const contentTotalPages = Math.max(
        1,
        Math.ceil(filteredContents.length / CONTENT_PAGE_SIZE)
    );
    const thresholdTotalPages = Math.max(
        1,
        Math.ceil(filteredThresholds.length / THRESHOLD_PAGE_SIZE)
    );

    const visibleContents = filteredContents.slice(
        (contentPage - 1) * CONTENT_PAGE_SIZE,
        contentPage * CONTENT_PAGE_SIZE
    );
    const visibleThresholds = filteredThresholds.slice(
        (thresholdPage - 1) * THRESHOLD_PAGE_SIZE,
        thresholdPage * THRESHOLD_PAGE_SIZE
    );

    const handleLogout = () => {
        sessionStorage.removeItem("airis_admin_auth");
        navigate("/admin/login", { replace: true });
    };

    const saveContent = (form) => {
        setContents((current) => {
            const exists = current.some((item) => item.idContent === form.idContent);

            if (exists) {
                return current.map((item) =>
                    item.idContent === form.idContent ? form : item
                );
            }

            return [...current, form].sort((a, b) => Number(a.order) - Number(b.order));
        });

        setContentModal(null);
    };

    const saveThreshold = (form) => {
        setThresholds((current) => {
            const exists = current.some(
                (item) => item.indicatorName === form.indicatorName
            );

            if (exists) {
                return current.map((item) =>
                    item.indicatorName === form.indicatorName ? form : item
                );
            }

            return [...current, form];
        });

        setThresholdModal(null);
    };

    const confirmDelete = () => {
        if (deleteModal?.type === "content") {
            setContents((current) =>
                current.filter((item) => item.idContent !== deleteModal.id)
            );
        }

        if (deleteModal?.type === "threshold") {
            setThresholds((current) =>
                current.filter((item) => item.indicatorName !== deleteModal.id)
            );
        }

        setDeleteModal(null);
    };

    const selectSection = (value) => {
        setSection(value);
        setMobileSidebar(false);
    };

    return (
        <div className="admin-shell">
            <button
                className={`admin-mobile-backdrop ${mobileSidebar ? "is-open" : ""}`}
                onClick={() => setMobileSidebar(false)}
                aria-label="Tutup menu"
            />

            <aside className={`admin-sidebar ${mobileSidebar ? "is-open" : ""}`}>
                <div className="admin-sidebar-top">
                    <div className="admin-sidebar-brand admin-sidebar-brand-no-logo">
                        <div>
                            <strong>AIRIS</strong>
                            <span>Administrator</span>
                        </div>
                    </div>

                    <button
                        className="admin-mobile-close"
                        onClick={() => setMobileSidebar(false)}
                        aria-label="Tutup sidebar"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="admin-sidebar-menu">
                    <span className="admin-menu-title">MENU</span>

                    <button
                        className={`admin-nav-item ${section === "content" ? "active" : ""}`}
                        onClick={() => selectSection("content")}
                    >
                        <FiFileText />
                        <span>Konten Web</span>
                    </button>

                    <button
                        className={`admin-nav-item ${section === "threshold" ? "active" : ""}`}
                        onClick={() => selectSection("threshold")}
                    >
                        <FiSliders />
                        <span>Threshold Indikator</span>
                    </button>
                </div>

                <div className="admin-sidebar-bottom">
                    <div className="admin-account">
                        <div className="admin-avatar">A</div>
                        <div>
                            <strong>Administrator</strong>
                            <span>admin</span>
                        </div>
                    </div>

                    <button className="admin-logout" onClick={handleLogout}>
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button
                            className="admin-menu-toggle"
                            onClick={() => setMobileSidebar(true)}
                            aria-label="Buka menu"
                        >
                            <FiMenu />
                        </button>

                        <div>
                            <p className="admin-breadcrumb">
                                Admin <span>/</span>{" "}
                                {section === "content"
                                    ? "Konten Web"
                                    : "Threshold Indikator"}
                            </p>
                            <h1>
                                {section === "content"
                                    ? "Konten Web"
                                    : "Threshold Indikator"}
                            </h1>
                        </div>
                    </div>

                    <div className={`admin-topbar-account ${topbarMenuOpen ? "is-open" : ""}`}>
                        <div className="admin-avatar">A</div>
                        <div className="admin-topbar-account-info">
                            <strong>Administrator</strong>
                            <span>Admin</span>
                        </div>
                        <button
                            className="admin-account-toggle"
                            type="button"
                            onClick={() => setTopbarMenuOpen((open) => !open)}
                            aria-label="Buka menu administrator"
                            aria-expanded={topbarMenuOpen}
                        >
                            <FiChevronDown />
                        </button>
                        {topbarMenuOpen && (
                            <div className="admin-account-menu">
                                <button type="button" onClick={handleLogout}>
                                    <FiLogOut />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="admin-page">
                    {section === "content" ? (
                        <ContentSection
                            contents={contents}
                            visibleContents={visibleContents}
                            search={contentSearch}
                            setSearch={setContentSearch}
                            page={contentPage}
                            setPage={setContentPage}
                            totalPages={contentTotalPages}
                            onAdd={() => setContentModal({ mode: "add", data: null })}
                            onEdit={(data) => setContentModal({ mode: "edit", data })}
                            onDelete={(id) =>
                                setDeleteModal({
                                    type: "content",
                                    id,
                                    title: "Konten",
                                })
                            }
                        />
                    ) : (
                        <ThresholdSection
                            thresholds={thresholds}
                            visibleThresholds={visibleThresholds}
                            search={thresholdSearch}
                            setSearch={setThresholdSearch}
                            page={thresholdPage}
                            setPage={setThresholdPage}
                            totalPages={thresholdTotalPages}
                            onAdd={() => setThresholdModal({ mode: "add", data: null })}
                            onEdit={(data) =>
                                setThresholdModal({ mode: "edit", data })
                            }
                            onDelete={(id) =>
                                setDeleteModal({
                                    type: "threshold",
                                    id,
                                    title: "Threshold indikator",
                                })
                            }
                        />
                    )}
                </main>
            </div>

            {contentModal && (
                <ContentModal
                    mode={contentModal.mode}
                    initialData={contentModal.data}
                    onClose={() => setContentModal(null)}
                    onSave={saveContent}
                    existingIds={contents.map((item) => item.idContent)}
                />
            )}

            {thresholdModal && (
                <ThresholdModal
                    mode={thresholdModal.mode}
                    initialData={thresholdModal.data}
                    onClose={() => setThresholdModal(null)}
                    onSave={saveThreshold}
                    existingNames={thresholds.map((item) => item.indicatorName)}
                />
            )}

            {deleteModal && (
                <DeleteModal
                    title={deleteModal.title}
                    onCancel={() => setDeleteModal(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}

function ContentSection({
    contents,
    visibleContents,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    onAdd,
    onEdit,
    onDelete,
}) {
    const start = contents.length === 0 ? 0 : (page - 1) * CONTENT_PAGE_SIZE + 1;
    const end = Math.min(page * CONTENT_PAGE_SIZE, contents.length);

    return (
        <section>
            <div className="admin-page-heading">
                <div>
                    <p className="admin-eyebrow">CONTENT MANAGEMENT</p>
                    <h2>Konten Web</h2>
                    <p>Kelola konten statis yang ditampilkan pada website AIRIS.</p>
                </div>

                <button className="admin-primary-button" onClick={onAdd}>
                    <FiPlus />
                    Tambah Konten
                </button>
            </div>

            <div className="admin-stat-row">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon green"><FiFileText /></div>
                    <div>
                        <span>Total Konten</span>
                        <strong>{contents.length}</strong>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon blue"><FiGrid /></div>
                    <div>
                        <span>Jenis Konten</span>
                        <strong>{new Set(contents.map((item) => item.type)).size}</strong>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon orange"><FiSliders /></div>
                    <div>
                        <span>Status</span>
                        <strong>Aktif</strong>
                    </div>
                </div>
            </div>

            <div className="admin-table-card">
                <div className="admin-table-toolbar">
                    <div>
                        <h3>Daftar Konten</h3>
                        <span>{contents.length} data tersimpan secara lokal</span>
                    </div>

                    <div className="admin-search">
                        <FiSearch />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari konten..."
                        />
                    </div>
                </div>

                <div className="admin-table-scroll">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID CONTENT</th>
                                <th>TYPE</th>
                                <th>TITLE</th>
                                <th>SYMBOL</th>
                                <th>ICON</th>
                                <th>ORDER</th>
                                <th>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleContents.map((item) => (
                                <tr key={item.idContent}>
                                    <td>
                                        <code className="admin-id">{item.idContent}</code>
                                    </td>
                                    <td>
                                        <span className="admin-tag">{item.type}</span>
                                    </td>
                                    <td>
                                        <strong className="admin-cell-title">{item.title}</strong>
                                        <span className="admin-cell-subtitle">{item.content}</span>
                                    </td>
                                    <td>{item.symbol || "-"}</td>
                                    <td>
                                        <span className="admin-icon-chip">{item.icon || "-"}</span>
                                    </td>
                                    <td>
                                        <span className="admin-order">{item.order}</span>
                                    </td>
                                    <td>
                                        <ActionButtons
                                            onEdit={() => onEdit(item)}
                                            onDelete={() => onDelete(item.idContent)}
                                        />
                                    </td>
                                </tr>
                            ))}

                            {visibleContents.length === 0 && (
                                <EmptyRow colSpan={7} text="Konten tidak ditemukan." />
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    start={start}
                    end={end}
                    total={contents.length}
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />
            </div>
        </section>
    );
}

function ThresholdSection({
    thresholds,
    visibleThresholds,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    onAdd,
    onEdit,
    onDelete,
}) {
    const start =
        thresholds.length === 0 ? 0 : (page - 1) * THRESHOLD_PAGE_SIZE + 1;
    const end = Math.min(page * THRESHOLD_PAGE_SIZE, thresholds.length);

    return (
        <section>
            <div className="admin-page-heading">
                <div>
                    <p className="admin-eyebrow">MEASUREMENT MANAGEMENT</p>
                    <h2>Threshold Indikator</h2>
                    <p>Kelola batas nilai indikator pengukuran kualitas udara.</p>
                </div>

                <button className="admin-primary-button" onClick={onAdd}>
                    <FiPlus />
                    Tambah Threshold
                </button>
            </div>

            <div className="admin-stat-row">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon green"><FiSliders /></div>
                    <div>
                        <span>Total Indikator</span>
                        <strong>{thresholds.length}</strong>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon blue"><FiGrid /></div>
                    <div>
                        <span>Unit Pengukuran</span>
                        <strong>{new Set(thresholds.map((item) => item.indicatorUnit)).size}</strong>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon orange"><FiAlertTriangle /></div>
                    <div>
                        <span>Mode</span>
                        <strong>Statis</strong>
                    </div>
                </div>
            </div>

            <div className="admin-table-card">
                <div className="admin-table-toolbar">
                    <div>
                        <h3>Daftar Threshold</h3>
                        <span>{thresholds.length} data tersimpan secara lokal</span>
                    </div>

                    <div className="admin-search">
                        <FiSearch />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari indikator..."
                        />
                    </div>
                </div>

                <div className="admin-table-scroll">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>INDICATOR NAME</th>
                                <th>UNIT</th>
                                <th>MIN VALUE</th>
                                <th>MAX VALUE</th>
                                <th>DESCRIPTION</th>
                                <th>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleThresholds.map((item) => (
                                <tr key={item.indicatorName}>
                                    <td>
                                        <strong className="admin-indicator-name">
                                            {item.indicatorName}
                                        </strong>
                                    </td>
                                    <td>
                                        <span className="admin-unit">{item.indicatorUnit}</span>
                                    </td>
                                    <td>{item.minTresholdValue}</td>
                                    <td>{item.maxTresholdValue}</td>
                                    <td>
                                        <span className="admin-cell-subtitle threshold-description">
                                            {item.description}
                                        </span>
                                    </td>
                                    <td>
                                        <ActionButtons
                                            onEdit={() => onEdit(item)}
                                            onDelete={() => onDelete(item.indicatorName)}
                                        />
                                    </td>
                                </tr>
                            ))}

                            {visibleThresholds.length === 0 && (
                                <EmptyRow colSpan={6} text="Threshold tidak ditemukan." />
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    start={start}
                    end={end}
                    total={thresholds.length}
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                />
            </div>
        </section>
    );
}

function ActionButtons({ onEdit, onDelete }) {
    return (
        <div className="admin-actions">
            <button className="admin-action edit" onClick={onEdit} title="Edit">
                <FiEdit2 />
                <span>Edit</span>
            </button>
            <button className="admin-action delete" onClick={onDelete} title="Hapus">
                <FiTrash2 />
                <span>Hapus</span>
            </button>
        </div>
    );
}

function Pagination({ start, end, total, page, totalPages, setPage }) {
    return (
        <div className="admin-pagination">
            <span>
                Menampilkan <strong>{start}-{end}</strong> dari <strong>{total}</strong> data
            </span>

            <div className="admin-pagination-buttons">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    aria-label="Halaman sebelumnya"
                >
                    <FiChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                    <button
                        key={number}
                        className={page === number ? "active" : ""}
                        onClick={() => setPage(number)}
                    >
                        {number}
                    </button>
                ))}

                <button
                    disabled={page >= totalPages}
                    onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                    }
                    aria-label="Halaman berikutnya"
                >
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
}

function EmptyRow({ colSpan, text }) {
    return (
        <tr>
            <td colSpan={colSpan}>
                <div className="admin-empty">{text}</div>
            </td>
        </tr>
    );
}

function ContentModal({ mode, initialData, onClose, onSave, existingIds }) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState(
        initialData || {
            idContent: "",
            type: "",
            title: "",
            content: "",
            symbol: "",
            icon: "",
            order: 1,
        }
    );

    const [error, setError] = useState("");

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setError("");
    };

    const submit = (event) => {
        event.preventDefault();

        if (!form.idContent.trim() || !form.type.trim() || !form.title.trim() || !form.content.trim()) {
            setError("ID Content, Type, Title, dan Content wajib diisi.");
            return;
        }

        const duplicate = existingIds.some(
            (id) =>
                id.toLowerCase() === form.idContent.trim().toLowerCase() &&
                (!isEdit || id !== initialData.idContent)
        );

        if (duplicate) {
            setError("ID Content sudah digunakan.");
            return;
        }

        onSave({
            ...form,
            idContent: form.idContent.trim(),
            type: form.type.trim(),
            title: form.title.trim(),
            content: form.content.trim(),
            symbol: form.symbol.trim(),
            icon: form.icon.trim(),
            order: Number(form.order) || 1,
        });
    };

    return (
        <Modal title={isEdit ? "Edit Konten" : "Tambah Konten"} subtitle="Isi data konten website." onClose={onClose}>
            <form onSubmit={submit}>
                <div className="admin-form-grid">
                    <Field label="idContent" required>
                        <input
                            value={form.idContent}
                            onChange={(e) => update("idContent", e.target.value)}
                            placeholder="Contoh: CNT001"
                            disabled={isEdit}
                        />
                    </Field>

                    <Field label="type" required>
                        <input
                            value={form.type}
                            onChange={(e) => update("type", e.target.value)}
                            placeholder="Contoh: hero"
                        />
                    </Field>
                </div>

                <Field label="title" required>
                    <input
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                        placeholder="Judul konten"
                    />
                </Field>

                <Field label="content" required>
                    <textarea
                        value={form.content}
                        onChange={(e) => update("content", e.target.value)}
                        placeholder="Isi konten"
                        rows={5}
                    />
                </Field>

                <div className="admin-form-grid">
                    <Field label="symbol">
                        <input
                            value={form.symbol}
                            onChange={(e) => update("symbol", e.target.value)}
                            placeholder="Contoh: AQ"
                        />
                    </Field>

                    <Field label="icon">
                        <input
                            value={form.icon}
                            onChange={(e) => update("icon", e.target.value)}
                            placeholder="Contoh: wind"
                        />
                    </Field>
                </div>

                <Field label="order" required>
                    <input
                        type="number"
                        min="1"
                        value={form.order}
                        onChange={(e) => update("order", e.target.value)}
                    />
                </Field>

                {error && <div className="admin-form-error">{error}</div>}

                <ModalActions onClose={onClose} submitLabel={isEdit ? "Simpan Perubahan" : "Tambah Konten"} />
            </form>
        </Modal>
    );
}

function ThresholdModal({ mode, initialData, onClose, onSave, existingNames }) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState(
        initialData || {
            indicatorName: "",
            indicatorUnit: "",
            maxTresholdValue: "",
            minTresholdValue: "",
            description: "",
        }
    );

    const [error, setError] = useState("");

    const update = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setError("");
    };

    const submit = (event) => {
        event.preventDefault();

        if (
            !form.indicatorName.trim() ||
            !form.indicatorUnit.trim() ||
            form.minTresholdValue === "" ||
            form.maxTresholdValue === ""
        ) {
            setError("Indicator Name, Unit, Min Value, dan Max Value wajib diisi.");
            return;
        }

        const min = Number(form.minTresholdValue);
        const max = Number(form.maxTresholdValue);

        if (Number.isNaN(min) || Number.isNaN(max)) {
            setError("Nilai minimum dan maksimum harus berupa angka.");
            return;
        }

        if (min > max) {
            setError("Minimum Threshold Value tidak boleh lebih besar dari maksimum.");
            return;
        }

        const duplicate = existingNames.some(
            (name) =>
                name.toLowerCase() === form.indicatorName.trim().toLowerCase() &&
                (!isEdit || name !== initialData.indicatorName)
        );

        if (duplicate) {
            setError("Indicator Name sudah digunakan.");
            return;
        }

        onSave({
            ...form,
            indicatorName: form.indicatorName.trim(),
            indicatorUnit: form.indicatorUnit.trim(),
            minTresholdValue: min,
            maxTresholdValue: max,
            description: form.description.trim(),
        });
    };

    return (
        <Modal
            title={isEdit ? "Edit Threshold Indikator" : "Tambah Threshold Indikator"}
            subtitle="Atur batas nilai indikator pengukuran."
            onClose={onClose}
        >
            <form onSubmit={submit}>
                <div className="admin-form-grid">
                    <Field label="indicatorName" required>
                        <input
                            value={form.indicatorName}
                            onChange={(e) => update("indicatorName", e.target.value)}
                            placeholder="Contoh: PM2.5"
                            disabled={isEdit}
                        />
                    </Field>

                    <Field label="indicatorUnit" required>
                        <input
                            value={form.indicatorUnit}
                            onChange={(e) => update("indicatorUnit", e.target.value)}
                            placeholder="Contoh: µg/m³"
                        />
                    </Field>
                </div>

                <div className="admin-form-grid">
                    <Field label="minTresholdValue" required>
                        <input
                            type="number"
                            value={form.minTresholdValue}
                            onChange={(e) => update("minTresholdValue", e.target.value)}
                            placeholder="0"
                        />
                    </Field>

                    <Field label="maxTresholdValue" required>
                        <input
                            type="number"
                            value={form.maxTresholdValue}
                            onChange={(e) => update("maxTresholdValue", e.target.value)}
                            placeholder="100"
                        />
                    </Field>
                </div>

                <Field label="description">
                    <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder="Deskripsi indikator..."
                        rows={5}
                    />
                </Field>

                {error && <div className="admin-form-error">{error}</div>}

                <ModalActions
                    onClose={onClose}
                    submitLabel={isEdit ? "Simpan Perubahan" : "Tambah Threshold"}
                />
            </form>
        </Modal>
    );
}

function Field({ label, required, children }) {
    return (
        <label className="admin-field">
            <span>
                {label} {required && <em>*</em>}
            </span>
            {children}
        </label>
    );
}

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div className="admin-modal-backdrop" onMouseDown={onClose}>
            <div
                className="admin-modal"
                role="dialog"
                aria-modal="true"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="admin-modal-header">
                    <div>
                        <p className="admin-eyebrow">DATA MANAGEMENT</p>
                        <h2>{title}</h2>
                        <p>{subtitle}</p>
                    </div>

                    <button className="admin-modal-close" onClick={onClose} aria-label="Tutup">
                        <FiX />
                    </button>
                </div>

                <div className="admin-modal-body">{children}</div>
            </div>
        </div>
    );
}

function ModalActions({ onClose, submitLabel }) {
    return (
        <div className="admin-modal-actions">
            <button type="button" className="admin-secondary-button" onClick={onClose}>
                Batal
            </button>
            <button type="submit" className="admin-primary-button">
                {submitLabel}
            </button>
        </div>
    );
}

function DeleteModal({ title, onCancel, onConfirm }) {
    return (
        <div className="admin-modal-backdrop" onMouseDown={onCancel}>
            <div
                className="admin-confirm-modal"
                role="dialog"
                aria-modal="true"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="admin-confirm-icon">
                    <FiAlertTriangle />
                </div>
                <h2>Hapus {title}?</h2>
                <p>
                    Data yang dihapus dari UI ini tidak dapat dikembalikan melalui dashboard.
                </p>

                <div className="admin-modal-actions">
                    <button className="admin-secondary-button" onClick={onCancel}>
                        Batal
                    </button>
                    <button className="admin-danger-button" onClick={onConfirm}>
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
