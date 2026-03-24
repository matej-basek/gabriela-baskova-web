"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import api from "@/lib/api";
import {
  Building,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Folder,
  Loader2,
  Save,
  Plus,
  ChevronDown,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Lesson {
  _id: string;
  name: string;
  day: string;
  time: string;
  pricePerLesson: string;
  courseInfo: string;
  coursePrice: string;
  dateRange: string;
  additionalInfo: string;
  registrationUrl: string;
}

interface Studio {
  _id: string;
  name: string;
  photoUrl: string;
  lessons: Lesson[];
  order: number;
}

const emptyLesson = {
  name: "",
  day: "",
  time: "",
  pricePerLesson: "",
  courseInfo: "",
  coursePrice: "",
  dateRange: "",
  additionalInfo: "",
  registrationUrl: "",
};

const LabeledInput = ({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label
      style={{
        display: "block",
        fontSize: "12px",
        color: "rgba(255,255,255,0.5)",
        marginBottom: "6px",
      }}
    >
      {label}
    </label>
    <input
      className="glass-input"
      style={{ fontSize: "14px", padding: "10px 14px" }}
      {...props}
    />
  </div>
);

export default function AdminStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [expandedStudio, setExpandedStudio] = useState<string | null>(null);
  const [showStudioForm, setShowStudioForm] = useState(false);
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [studioForm, setStudioForm] = useState({ name: "", order: 0 });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [studioFormError, setStudioFormError] = useState("");
  const [lessonModal, setLessonModal] = useState<{
    studioId: string;
    lesson?: Lesson;
  } | null>(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);

  // UI state for split inputs
  const [timeRange, setTimeRange] = useState({ start: "", end: "" });
  const [dateRangeUI, setDateRangeUI] = useState({ start: "", end: "" });

  const fileRef = useRef<HTMLInputElement>(null);

  const load = () =>
    api
      .get("/api/studios")
      .then((r) => setStudios(r.data))
      .catch(() => { });
  useEffect(() => {
    load();
  }, []);

  const openAddStudio = () => {
    setEditingStudio(null);
    setStudioForm({ name: "", order: 0 });
    setPhotoFile(null);
    setPhotoPreview("");
    setStudioFormError("");
    setShowStudioForm(true);
  };

  const openEditStudio = (s: Studio) => {
    setEditingStudio(s);
    setStudioForm({ name: s.name, order: s.order });
    setPhotoFile(null);
    setPhotoPreview(s.photoUrl);
    setStudioFormError("");
    setShowStudioForm(true);
  };

  const handleStudioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setStudioFormError("");
    try {
      const fd = new FormData();
      fd.append("name", studioForm.name);
      fd.append("order", String(studioForm.order));

      if (photoFile) {
        fd.append("photo", photoFile);
      } else if (editingStudio) {
        fd.append("existingPhotoUrl", editingStudio.photoUrl);
      }

      if (editingStudio) {
        await api.put(`/api/studios/${editingStudio._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("success: Studio aktualizováno");
      } else {
        await api.post("/api/studios", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("success: Studio přidáno");
      }
      load();
      setShowStudioForm(false);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Chyba při ukládání";
      setStudioFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudio = async (id: string) => {
    if (!confirm("Smazat celé studio včetně všech lekcí?")) return;
    await api.delete(`/api/studios/${id}`);
    load();
  };

  const openAddLesson = (studioId: string) => {
    setLessonForm(emptyLesson);
    setTimeRange({ start: "", end: "" });
    setDateRangeUI({ start: "", end: "" });
    setLessonModal({ studioId });
  };

  const openEditLesson = (studioId: string, lesson: Lesson) => {
    setLessonForm({
      name: lesson.name,
      day: lesson.day,
      time: lesson.time,
      pricePerLesson: lesson.pricePerLesson,
      courseInfo: lesson.courseInfo,
      coursePrice: lesson.coursePrice,
      dateRange: lesson.dateRange,
      additionalInfo: lesson.additionalInfo,
      registrationUrl: lesson.registrationUrl || "",
    });

    // Parse time: "16:00 – 17:00" -> start: 16:00, end: 17:00
    const timeParts = (lesson.time || "").split(/[-–—]/).map((s) => s.trim());
    setTimeRange({ start: timeParts[0] || "", end: timeParts[1] || "" });

    // Parse date: "7.4. – 9.6." -> start: 7.4., end: 9.6.
    const dateParts = (lesson.dateRange || "")
      .split(/[-–—]/)
      .map((s) => s.trim());
    setDateRangeUI({ start: dateParts[0] || "", end: dateParts[1] || "" });

    setLessonModal({ studioId, lesson });
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonModal) return;
    setLoading(true);

    // Combine ranges back into strings before saving
    const finalTime =
      timeRange.start && timeRange.end
        ? `${timeRange.start} – ${timeRange.end}`
        : timeRange.start || timeRange.end;
    const finalDate =
      dateRangeUI.start && dateRangeUI.end
        ? `${dateRangeUI.start} – ${dateRangeUI.end}`
        : dateRangeUI.start || dateRangeUI.end;

    const finalPayload = {
      ...lessonForm,
      time: finalTime,
      dateRange: finalDate,
    };

    try {
      if (lessonModal.lesson) {
        await api.put(
          `/api/studios/${lessonModal.studioId}/lessons/${lessonModal.lesson._id}`,
          finalPayload,
        );
      } else {
        await api.post(
          `/api/studios/${lessonModal.studioId}/lessons`,
          finalPayload,
        );
      }
      load();
      setLessonModal(null);
    } catch {
      alert("Chyba při ukládání lekce");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (studioId: string, lessonId: string) => {
    if (!confirm("Smazat tuto lekci?")) return;
    await api.delete(`/api/studios/${studioId}/lessons/${lessonId}`);
    load();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
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
            <Building size={28} /> Studia & Rozvrhy
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            Správa studií a jejich rozpisů kurzů
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={openAddStudio}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <Plus size={18} /> Přidat studio
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

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {studios.map((studio) => (
          <motion.div
            key={studio._id}
            layout
            className="glass"
            style={{ borderRadius: "20px", overflow: "hidden" }}
          >
            {/* Studio header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                cursor: "pointer",
              }}
              onClick={() =>
                setExpandedStudio(
                  expandedStudio === studio._id ? null : studio._id,
                )
              }
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                {studio.photoUrl && (
                  <div
                    style={{
                      position: "relative",
                      width: 52,
                      height: 52,
                      borderRadius: "12px",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={studio.photoUrl}
                      alt={studio.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: "16px", color: "#fff" }}
                  >
                    {studio.name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {studio.lessons.length} lekcí
                  </div>
                </div>
              </div>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditStudio(studio);
                  }}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "10px",
                    background: "rgba(155,81,224,0.2)",
                    border: "1px solid rgba(155,81,224,0.4)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: "Outfit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStudio(studio._id);
                  }}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "10px",
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#fca5a5",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: "Outfit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 size={14} />
                </button>
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    transform:
                      expandedStudio === studio._id ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  <ChevronDown size={20} />
                </span>
              </div>
            </div>

            {/* Lessons */}
            <AnimatePresence>
              {expandedStudio === studio._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    overflow: "hidden",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div style={{ padding: "20px 24px 24px" }}>
                    <button
                      onClick={() => openAddLesson(studio._id)}
                      style={{
                        marginBottom: "16px",
                        padding: "8px 18px",
                        borderRadius: "50px",
                        background: "rgba(247,141,167,0.2)",
                        border: "1px solid rgba(247,141,167,0.4)",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontFamily: "Outfit",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Plus size={14} /> Přidat lekci
                    </button>
                    {studio.lessons.length === 0 && (
                      <div
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          fontSize: "14px",
                          textAlign: "center",
                          padding: "20px",
                        }}
                      >
                        Žádné lekce – přidejte první!
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {studio.lessons.map((lesson) => (
                        <div
                          key={lesson._id}
                          className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 md:gap-4 items-start"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.09)",
                            borderRadius: "14px",
                            padding: "14px 18px",
                            // display: "flex", // Removed due to grid
                            // justifyContent: "space-between", // Removed due to grid
                            // alignItems: "flex-start", // Removed due to grid
                            // gap: "12px", // Removed due to grid
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                color: "#f78da7",
                                fontSize: "14px",
                                marginBottom: "6px",
                              }}
                            >
                              {lesson.name}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "rgba(255,255,255,0.6)",
                                lineHeight: "1.7",
                              }}
                            >
                              {[
                                lesson.day && `${lesson.day}`,
                                lesson.time && `${lesson.time}`,
                                lesson.pricePerLesson &&
                                `${lesson.pricePerLesson}`,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                              {lesson.courseInfo && (
                                <>
                                  <br />
                                  <span style={{ color: "#aaa" }}>
                                    {lesson.courseInfo}
                                  </span>
                                  {lesson.dateRange && ` (${lesson.dateRange})`}
                                  {lesson.coursePrice &&
                                    ` | ${lesson.coursePrice}`}
                                </>
                              )}
                              {lesson.additionalInfo && (
                                <>
                                  <br />
                                  <span style={{ color: "#aaa" }}>
                                    {lesson.additionalInfo}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              flexShrink: 0,
                            }}
                          >
                            <button
                              onClick={() => openEditLesson(studio._id, lesson)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                background: "rgba(155,81,224,0.2)",
                                border: "1px solid rgba(155,81,224,0.4)",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontFamily: "Outfit",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteLesson(studio._id, lesson._id)
                              }
                              style={{
                                padding: "6px 12px",
                                borderRadius: "8px",
                                background: "rgba(239,68,68,0.15)",
                                border: "1px solid rgba(239,68,68,0.3)",
                                color: "#fca5a5",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontFamily: "Outfit",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {studios.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "rgba(255,255,255,0.3)",
            fontSize: "16px",
          }}
        >
          Žádná studia – přidejte první!
        </div>
      )}

      {/* Studio form modal */}
      <AnimatePresence>
        {showStudioForm && (
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
              style={{
                borderRadius: "28px",
                padding: "36px",
                maxWidth: "480px",
                width: "100%",
              }}
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
                  {editingStudio ? "Upravit studio" : "Nové studio"}
                </h2>
                <button
                  onClick={() => setShowStudioForm(false)}
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
                onSubmit={handleStudioSubmit}
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
                    Název studia *
                  </label>
                  <input
                    className="glass-input"
                    placeholder="Název"
                    value={studioForm.name}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, name: e.target.value })
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
                    Pořadí
                  </label>
                  <input
                    className="glass-input"
                    type="number"
                    value={studioForm.order}
                    onChange={(e) =>
                      setStudioForm({
                        ...studioForm,
                        order: Number(e.target.value),
                      })
                    }
                    min={0}
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
                    Fotografie studia
                  </label>
                  {photoPreview && (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "160px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        marginBottom: "10px",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <Image
                        src={photoPreview}
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
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setPhotoFile(f);
                        setPhotoPreview(URL.createObjectURL(f));
                      }
                    }}
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
                    {photoFile ? photoFile.name : "Vybrat fotku"}
                  </button>
                </div>
                {studioFormError && (
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
                    <XCircle size={14} /> {studioFormError}
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
                  ) : editingStudio ? (
                    <>
                      <Save size={16} /> Uložit
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Přidat studio
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson form modal */}
      <AnimatePresence>
        {lessonModal && (
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
              className="glass"
              style={{
                borderRadius: "28px",
                padding: "36px",
                maxWidth: "520px",
                width: "100%",
                maxHeight: "90vh",
                overflow: "auto",
              }}
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
                  {lessonModal.lesson ? "Upravit lekci" : "Nová lekce"}
                </h2>
                <button
                  onClick={() => setLessonModal(null)}
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
                onSubmit={handleLessonSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <LabeledInput
                  label="Název kurzu *"
                  placeholder="např. Fyzio-jóga"
                  value={lessonForm.name}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      name: e.currentTarget.value,
                    })
                  }
                  required
                />
                <LabeledInput
                  label="Den v týdnu"
                  placeholder="Např. Úterý"
                  value={lessonForm.day}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, day: e.currentTarget.value })
                  }
                />

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "8px",
                    }}
                  >
                    Časové rozmezí lekce
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <input
                      className="glass-input"
                      style={{ fontSize: "14px", padding: "10px 14px" }}
                      placeholder="Od (16:00)"
                      value={timeRange.start}
                      onChange={(e) =>
                        setTimeRange({ ...timeRange, start: e.target.value })
                      }
                    />
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: "bold",
                      }}
                    >
                      —
                    </span>
                    <input
                      className="glass-input"
                      style={{ fontSize: "14px", padding: "10px 14px" }}
                      placeholder="Do (17:00)"
                      value={timeRange.end}
                      onChange={(e) =>
                        setTimeRange({ ...timeRange, end: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.08)",
                    margin: "4px 0",
                  }}
                />

                <LabeledInput
                  label="Cena za 1 lekci"
                  placeholder="např. 250,-"
                  value={lessonForm.pricePerLesson}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      pricePerLesson: e.currentTarget.value,
                    })
                  }
                />
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "6px",
                    }}
                  >
                    Info o kurzu (počet lekcí apod.)
                  </label>
                  <input
                    className="glass-input"
                    style={{ fontSize: "14px", padding: "10px 14px" }}
                    placeholder="např. kurz 10 lekcí"
                    value={lessonForm.courseInfo}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        courseInfo: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "8px",
                    }}
                  >
                    Datumové rozmezí kurzu
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <input
                      className="glass-input"
                      style={{ fontSize: "14px", padding: "10px 14px" }}
                      placeholder="Od (7.4.)"
                      value={dateRangeUI.start}
                      onChange={(e) =>
                        setDateRangeUI({
                          ...dateRangeUI,
                          start: e.target.value,
                        })
                      }
                    />
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: "bold",
                      }}
                    >
                      —
                    </span>
                    <input
                      className="glass-input"
                      style={{ fontSize: "14px", padding: "10px 14px" }}
                      placeholder="Do (9.6.)"
                      value={dateRangeUI.end}
                      onChange={(e) =>
                        setDateRangeUI({ ...dateRangeUI, end: e.target.value })
                      }
                    />
                  </div>
                </div>

                <LabeledInput
                  label="Cena celého kurzu"
                  placeholder="např. 2300,-"
                  value={lessonForm.coursePrice}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      coursePrice: e.currentTarget.value,
                    })
                  }
                />
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "6px",
                    }}
                  >
                    Doplňující informace
                  </label>
                  <input
                    className="glass-input"
                    style={{ fontSize: "14px", padding: "10px 14px" }}
                    placeholder="Vhodné pro začátečníky…"
                    value={lessonForm.additionalInfo}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        additionalInfo: e.target.value,
                      })
                    }
                  />
                </div>
                <LabeledInput
                  label="Odkaz na přihlášení"
                  placeholder="https://..."
                  value={lessonForm.registrationUrl}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      registrationUrl: e.currentTarget.value,
                    })
                  }
                />
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
                  ) : lessonModal.lesson ? (
                    <>
                      <Save size={16} /> Uložit lekci
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Přidat lekci
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
