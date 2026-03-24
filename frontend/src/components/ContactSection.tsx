"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  XCircle,
  Send,
} from "lucide-react";

const WEB3FORMS_KEY = "da8a65d7-445e-4329-9b54-9a8945e0f6a7";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `📩 Nová zpráva z webu – ${form.name}`,
          from_name: "Gabriela Bašková Web",
          replyto: form.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="kontakt"
      className="section"
      style={{ paddingBottom: "100px" }}
    >
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
            Napište mi
          </div>
          <h2 className="section-title">
            <span className="gradient-text">Kontakt</span>
          </h2>
          <div className="gradient-line" style={{ margin: "16px auto 0" }} />
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Left – Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="glass"
              style={{ borderRadius: "24px", padding: "36px" }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "28px",
                  color: "#fff",
                }}
              >
                Kontaktní údaje
              </h3>
              {[
                {
                  icon: <User size={20} />,
                  label: "Jméno",
                  value: "Gabriela Bašková",
                },
                {
                  icon: <Phone size={20} />,
                  label: "Telefon",
                  value: "+420 603 730 820",
                  href: "tel:+420603730820",
                },
                {
                  icon: <Mail size={20} />,
                  label: "E-mail",
                  value: "gabriela.baskova@gmail.com",
                  href: "mailto:gabriela.baskova@gmail.com",
                },
                {
                  icon: <Building size={20} />,
                  label: "IČO",
                  value: "67490557",
                },
              ].map(({ icon, label, value, href }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "22px",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, rgba(155,81,224,0.3), rgba(247,141,167,0.2))",
                      border: "1px solid rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.45)",
                        marginBottom: "3px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        style={{
                          color: "#fff",
                          textDecoration: "none",
                          fontSize: "15px",
                          fontWeight: 500,
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#f78da7")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "#fff")
                        }
                      >
                        {value}
                      </a>
                    ) : (
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "15px",
                          fontWeight: 500,
                        }}
                      >
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right – Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div
              className="glass"
              style={{ borderRadius: "24px", padding: "36px" }}
            >
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "28px",
                  color: "#fff",
                }}
              >
                Kontaktní formulář
              </h3>
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
                    Jméno a příjmení *
                  </label>
                  <input
                    className="glass-input"
                    type="text"
                    placeholder="Vaše jméno"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    E-mailová adresa *
                  </label>
                  <input
                    className="glass-input"
                    type="email"
                    placeholder="vas@email.cz"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
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
                    Zpráva *
                  </label>
                  <textarea
                    className="glass-input"
                    placeholder="Napište svou zprávu..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                    style={{ resize: "vertical", minHeight: "120px" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === "loading"}
                  style={{
                    marginTop: "8px",
                    opacity: status === "loading" ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {status === "loading" ? (
                    "⏳ Odesílám..."
                  ) : (
                    <>
                      <Send size={18} /> Odeslat zprávu
                    </>
                  )}
                </button>

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "12px",
                      background: "rgba(34, 197, 94, 0.15)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      color: "#86efac",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CheckCircle2 size={16} /> Zpráva byla úspěšně odeslána!
                    Brzy se vám ozvu.
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "12px",
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#fca5a5",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <XCircle size={16} style={{ flexShrink: 0 }} /> Chyba při
                    odesílání. Prosím zkuste to znovu nebo napište přímo na
                    e-mail.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            textAlign: "center",
            marginTop: "60px",
            color: "rgba(255,255,255,0.3)",
            fontSize: "13px",
          }}
        >
          © {new Date().getFullYear()} Gabriela Bašková · IČO 67490557 ·
          Vytvořeno s ❤️ · Web vytvořil Matěj Bašek
        </motion.div>
      </div>
    </section>
  );
}
