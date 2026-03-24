"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import api from "@/lib/api";
import { Calendar, Clock, CreditCard, BookOpen, Info } from "lucide-react";

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
  registrationUrl?: string;
}

interface Studio {
  _id: string;
  name: string;
  photoUrl: string;
  lessons: Lesson[];
}

export default function ScheduleSection() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selected, setSelected] = useState<Studio | null>(null);

  useEffect(() => {
    api
      .get("/api/studios")
      .then((r) => setStudios(r.data))
      .catch(() => { });
  }, []);

  return (
    <section id="kurzy" className="section">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#f78da7",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Kde cvičíme
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Rozvrh</span> stálých kurzů
          </h2>
          <div className="gradient-line" style={{ margin: "16px auto 0" }} />
        </motion.div>

        {studios.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              padding: "40px",
            }}
          >
            Žádná studia momentálně nejsou k dispozici.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {studios.map((studio, i) => (
              <motion.div
                key={studio._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                onClick={() => setSelected(studio)}
                className="glass glass-hover"
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                }}
              >
                {/* Studio photo */}
                {studio.photoUrl && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/9",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={studio.photoUrl}
                      alt={studio.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(20,5,45,0.8) 0%, transparent 60%)",
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: "20px 24px 24px" }}>
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #f78da7, #9b51e0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: "8px",
                    }}
                  >
                    {studio.name}
                  </h3>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: "13px",
                    }}
                  >
                    {studio.lessons.length}{" "}
                    {studio.lessons.length === 1
                      ? "kurz"
                      : studio.lessons.length < 5
                        ? "kurzy"
                        : "kurzů"}
                  </div>
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#f78da7",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Zobrazit rozvrh →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Studio Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="glass"
              style={{
                borderRadius: "28px",
                maxWidth: "680px",
                width: "100%",
                maxHeight: "90vh",
                overflow: "hidden auto",
                display: "flex",
                flexDirection: "column",
                padding: 0,
                position: "relative",
              }}
            >
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 50,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                ×
              </button>
              {/* Studio photo */}
              {selected.photoUrl && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <img
                    src={selected.photoUrl}
                    alt={selected.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "45vh",
                      width: "auto",
                      height: "auto",
                      display: "block",
                      objectFit: "contain",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(20,5,45,0.95) 0%, transparent 40%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              )}

              <div style={{ padding: "28px 32px 32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #f78da7, #9b51e0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {selected.name}
                  </h3>
                </div>

                {selected.lessons.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.5)" }}>
                    Žádné kurzy nejsou zatím přidány.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {selected.lessons.map((lesson) => (
                      <div
                        key={lesson._id}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "16px",
                          padding: "18px 22px",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#f78da7",
                            marginBottom: "10px",
                          }}
                        >
                          {lesson.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {lesson.day && (
                            <LessonTag
                              icon={<Calendar size={14} />}
                              text={lesson.day}
                            />
                          )}
                          {lesson.time && (
                            <LessonTag
                              icon={<Clock size={14} />}
                              text={lesson.time}
                            />
                          )}
                          {lesson.pricePerLesson && (
                            <LessonTag
                              icon={<CreditCard size={14} />}
                              text={`1 lekce ${lesson.pricePerLesson}`}
                            />
                          )}
                        </div>
                        {(lesson.courseInfo || lesson.dateRange || lesson.coursePrice) && (
                          <div
                            style={{
                              marginTop: "10px",
                              color: "rgba(255,255,255,0.7)",
                              fontSize: "13.5px",
                              lineHeight: "1.6",
                              display: "flex",
                              gap: "6px",
                              alignItems: "flex-start",
                            }}
                          >
                            <BookOpen
                              size={16}
                              style={{ flexShrink: 0, marginTop: "2px" }}
                            />
                            <div>
                              {[
                                lesson.courseInfo,
                                lesson.dateRange ? `(${lesson.dateRange})` : null,
                                lesson.coursePrice ? `Cena: ${lesson.coursePrice}` : null
                              ].filter(Boolean).join(" | ")}
                            </div>
                          </div>
                        )}
                        {lesson.additionalInfo && (
                          <div
                            style={{
                              marginTop: "8px",
                              color: "rgba(255,255,255,0.55)",
                              fontSize: "13px",
                              fontStyle: "italic",
                              display: "flex",
                              gap: "6px",
                              alignItems: "flex-start",
                            }}
                          >
                            <Info
                              size={16}
                              style={{ flexShrink: 0, marginTop: "2px" }}
                            />
                            <span>{lesson.additionalInfo}</span>
                          </div>
                        )}
                        {lesson.registrationUrl && (
                          <div style={{ marginTop: "14px" }}>
                            <a
                              href={lesson.registrationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                textDecoration: "none",
                                fontSize: "14px",
                                padding: "8px 16px",
                              }}
                            >
                              Přihlásit se →
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function LessonTag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: "rgba(155, 81, 224, 0.2)",
        border: "1px solid rgba(155, 81, 224, 0.3)",
        borderRadius: "50px",
        padding: "4px 12px",
        fontSize: "13px",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      {icon} {text}
    </span>
  );
}
