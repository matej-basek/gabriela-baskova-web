"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import api from "@/lib/api";
import { Calendar } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  registrationUrl: string;
  date?: string;
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);

  useEffect(() => {
    api
      .get("/api/events")
      .then((r) => setEvents(r.data))
      .catch(() => { });
  }, []);

  return (
    <section id="akce" className="section">
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
            Plánované akce
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Nadcházející</span> akce
          </h2>
          <div className="gradient-line" style={{ margin: "16px auto 0" }} />
        </motion.div>

        {/* Posters grid */}
        {events.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              padding: "40px",
            }}
          >
            Žádné akce momentálně nejsou naplánované.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelected(event)}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  width: "100%",
                  aspectRatio: "2/3",
                  position: "relative",
                  transition: "all 0.35s ease",
                }}
                whileHover={{
                  scale: 1.03,
                  y: -6,
                  boxShadow: "0 20px 50px rgba(155, 81, 224, 0.4)",
                }}
              >
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(20,5,45,0.9) 0%, transparent 60%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "20px",
                    transition: "opacity 0.3s",
                  }}
                >
                  <div
                    style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}
                  >
                    Klikni pro detail →
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
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
              className="glass admin-modal-content"
              style={{
                borderRadius: "28px",
                maxWidth: "min(90vw, 500px)",
                width: "100%",
                maxHeight: "90vh",
                overflow: "hidden auto",
                display: "flex",
                flexDirection: "column",
                padding: 0,
                position: "relative",
              }}
            >
              {/* Floating Close Button overlaying the image */}
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
              {/* Modal image */}
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
                  src={selected.imageUrl}
                  alt={selected.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "45vh",
                    width: "auto",
                    height: "auto",
                    display: "block",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Modal content */}
              <div
                style={{
                  padding: "28px 32px 32px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
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
                    {selected.title}
                  </h3>
                </div>

                {selected.date && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      color: "#f78da7",
                      fontSize: "14px",
                    }}
                  >
                    <Calendar size={16} />
                    <span>{selected.date}</span>
                  </div>
                )}

                <p
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: "1.8",
                    marginBottom: "28px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selected.description}
                </p>

                {selected.registrationUrl && (
                  <a
                    href={selected.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ display: "inline-block", textDecoration: "none" }}
                  >
                    Přihlásit se →
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
