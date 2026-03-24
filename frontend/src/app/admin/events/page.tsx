"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import api from "@/lib/api";
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Edit2,
    Trash2,
    Folder,
    Loader2,
    Save,
    Plus,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Event {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    registrationUrl: string;
    date?: string;
    order: number;
}

const emptyForm = {
    title: "",
    description: "",
    registrationUrl: "",
    date: "",
    order: 0,
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [formError, setFormError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const load = () =>
        api
            .get("/api/events")
            .then((r) => setEvents(r.data))
            .catch(() => { });
    useEffect(() => {
        load();
    }, []);

    const openAdd = () => {
        setEditingEvent(null);
        setForm(emptyForm);
        setImageFile(null);
        setPreviewUrl("");
        setFormError("");
        setShowForm(true);
    };

    const openEdit = (ev: Event) => {
        setEditingEvent(ev);
        setForm({
            title: ev.title,
            description: ev.description,
            registrationUrl: ev.registrationUrl,
            date: ev.date || "",
            order: ev.order,
        });
        setImageFile(null);
        setPreviewUrl(ev.imageUrl);
        setFormError("");
        setShowForm(true);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setImageFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        setFormError("");

        if (!editingEvent && !imageFile) {
            setFormError("Vyberte leták (obrázek)");
            setLoading(false);
            return;
        }

        try {
            const fd = new FormData();
            fd.append("title", form.title);
            fd.append("description", form.description);
            fd.append("registrationUrl", form.registrationUrl);
            fd.append("date", form.date);
            fd.append("order", String(form.order));

            if (imageFile) {
                fd.append("image", imageFile);
            } else if (editingEvent) {
                fd.append("existingImageUrl", editingEvent.imageUrl);
            }

            if (editingEvent) {
                await api.put(`/api/events/${editingEvent._id}`, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setMsg("success: Akce aktualizována");
            } else {
                await api.post("/api/events", fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setMsg("success: Akce přidána");
            }
            load();
            setShowForm(false);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                "Chyba při ukládání";
            setFormError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Opravdu smazat tuto akci?")) return;
        await api.delete(`/api/events/${id}`);
        load();
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1
                        style={{
                            fontSize: "1.8rem",
                            fontWeight: 800,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <Calendar size={28} /> Správa akcí
                    </h1>
                    <p
                        style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "14px",
                            marginTop: "4px",
                        }}
                    >
                        Přidávejte a upravujte propagační letáky
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={openAdd}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                    <Plus size={18} /> Přidat akci
                </button>
            </div>

            {msg && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "12px 18px",
                        borderRadius: "12px",
                        background: msg.startsWith("success")
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)",
                        border: `1px solid ${msg.startsWith("success") ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                        color: msg.startsWith("success") ? "#86efac" : "#fca5a5",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    {msg.startsWith("success") ? (
                        <CheckCircle2 size={16} />
                    ) : (
                        <XCircle size={16} />
                    )}
                    {msg.replace("success: ", "").replace("error: ", "")}
                </div>
            )}

            {/* Events grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "20px",
                }}
            >
                {events.map((ev) => (
                    <motion.div
                        key={ev._id}
                        layout
                        className="glass"
                        style={{ borderRadius: "20px", overflow: "hidden" }}
                    >
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: "2/3",
                            }}
                        >
                            <Image
                                src={ev.imageUrl}
                                alt={ev.title}
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                        <div style={{ padding: "16px 18px" }}>
                            <div
                                style={{
                                    fontWeight: 700,
                                    fontSize: "15px",
                                    color: "#fff",
                                    marginBottom: "6px",
                                }}
                            >
                                {ev.title}
                            </div>
                            {ev.date && (
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "rgba(255,255,255,0.45)",
                                        marginBottom: "12px",
                                    }}
                                >
                                    {ev.date}
                                </div>
                            )}
                            <div
                                className="admin-form-row"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "12px",
                                }}
                            >
                                <button
                                    onClick={() => openEdit(ev)}
                                    style={{
                                        flex: 1,
                                        padding: "8px",
                                        borderRadius: "10px",
                                        background: "rgba(155,81,224,0.2)",
                                        border: "1px solid rgba(155,81,224,0.4)",
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontFamily: "Outfit, sans-serif",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <Edit2 size={14} /> Upravit
                                </button>
                                <button
                                    onClick={() => handleDelete(ev._id)}
                                    style={{
                                        flex: 1,
                                        padding: "8px",
                                        borderRadius: "10px",
                                        background: "rgba(239,68,68,0.15)",
                                        border: "1px solid rgba(239,68,68,0.3)",
                                        color: "#fca5a5",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        fontFamily: "Outfit, sans-serif",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <Trash2 size={14} /> Smazat
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {events.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "16px",
                    }}
                >
                    Žádné akce. Přidejte první!
                </div>
            )}

            {/* Form modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.9 }}
                            className="glass admin-modal-content"
                            style={{ maxWidth: "560px", maxHeight: "90vh", overflow: "auto" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "28px",
                                }}
                            >
                                <h2
                                    style={{ fontWeight: 700, fontSize: "1.3rem", color: "#fff" }}
                                >
                                    {editingEvent ? "Upravit akci" : "Nová akce"}
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 36,
                                        height: 36,
                                        cursor: "pointer",
                                        color: "#fff",
                                        fontSize: "18px",
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            <form
                                onSubmit={handleSubmit}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "13px",
                                            color: "rgba(255,255,255,0.6)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Název akce *
                                    </label>
                                    <input
                                        className="glass-input"
                                        placeholder="Název"
                                        value={form.title}
                                        onChange={(e) =>
                                            setForm({ ...form, title: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "13px",
                                            color: "rgba(255,255,255,0.6)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Popis
                                    </label>
                                    <textarea
                                        className="glass-input"
                                        placeholder="Detailní popis akce..."
                                        rows={4}
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({ ...form, description: e.target.value })
                                        }
                                        style={{ resize: "vertical" }}
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "13px",
                                            color: "rgba(255,255,255,0.6)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        URL pro přihlášení
                                    </label>
                                    <input
                                        className="glass-input"
                                        type="url"
                                        placeholder="https://forms.google.com/..."
                                        value={form.registrationUrl}
                                        onChange={(e) =>
                                            setForm({ ...form, registrationUrl: e.target.value })
                                        }
                                    />
                                </div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "12px",
                                    }}
                                >
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "13px",
                                                color: "rgba(255,255,255,0.6)",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            Datum / Termín akce
                                        </label>
                                        <input
                                            className="glass-input"
                                            type="text"
                                            placeholder="např. 15.-22. 6. 2026"
                                            value={form.date}
                                            onChange={(e) =>
                                                setForm({ ...form, date: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "13px",
                                                color: "rgba(255,255,255,0.6)",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            Pořadí
                                        </label>
                                        <input
                                            className="glass-input"
                                            type="number"
                                            value={form.order}
                                            onChange={(e) =>
                                                setForm({ ...form, order: Number(e.target.value) })
                                            }
                                            min={0}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "13px",
                                            color: "rgba(255,255,255,0.6)",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        Leták (obrázek){!editingEvent && " *"}
                                    </label>
                                    {previewUrl && (
                                        <div
                                            style={{
                                                position: "relative",
                                                width: "120px",
                                                height: "180px",
                                                borderRadius: "12px",
                                                overflow: "hidden",
                                                marginBottom: "10px",
                                                border: "1px solid rgba(255,255,255,0.2)",
                                            }}
                                        >
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                style={{ objectFit: "contain", background: "rgba(0,0,0,0.2)" }}
                                            />
                                        </div>
                                    )}
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFile}
                                        style={{ display: "none" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        style={{
                                            padding: "10px 18px",
                                            borderRadius: "10px",
                                            background: "rgba(255,255,255,0.08)",
                                            border: "1px dashed rgba(255,255,255,0.3)",
                                            color: "rgba(255,255,255,0.7)",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontFamily: "Outfit",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <Folder size={16} />{" "}
                                        {imageFile ? imageFile.name : "Vybrat soubor"}
                                    </button>
                                </div>
                                {formError && (
                                    <div
                                        style={{
                                            padding: "10px 14px",
                                            borderRadius: "10px",
                                            background: "rgba(239,68,68,0.15)",
                                            border: "1px solid rgba(239,68,68,0.3)",
                                            color: "#fca5a5",
                                            fontSize: "13px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <XCircle size={14} /> {formError}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                    style={{
                                        marginTop: "8px",
                                        opacity: loading ? 0.7 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Ukládám...
                                        </>
                                    ) : editingEvent ? (
                                        <>
                                            <Save size={16} /> Uložit změny
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} /> Přidat akci
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
