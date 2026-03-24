"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronDown, ChevronUp, Check, Shield } from "lucide-react";

type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_KEY = "gb_cookie_consent";

function loadConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(c: CookieConsent) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(c));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = loadConsent();
    if (!existing) {
      // Slight delay so the page renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const saveCustom = () => {
    saveConsent({ necessary: true, analytics, marketing });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 22, stiffness: 180 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "center",
          }}
          aria-live="polite"
          role="dialog"
          aria-label="Souhlas s cookies"
        >
          <div
            style={{
            borderRadius: "24px 24px 0 0",
            padding: "28px 32px",
            maxWidth: 700,
            width: "100%",
            borderBottom: "none",
            background: "rgba(20, 8, 45, 0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(155, 81, 224, 0.3)",
            boxShadow: "0 -12px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #9b51e0, #f78da7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Cookie size={18} color="#fff" />
              </div>
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Souhlas s&nbsp;cookies
              </h2>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "13.5px",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.65,
                marginBottom: 20,
              }}
            >
              Tento web používá <strong style={{ color: "#f78da7" }}>nezbytné cookies</strong>{" "}
              pro správnou funkci. S vaším souhlasem také analytické cookies pro{" "}
              zlepšení vašeho zážitku. Marketingové cookies neumožníme bez
              výslovného souhlasu. Souhlas můžete kdykoliv odvolat.
            </p>

            {/* Detail toggle */}
            <button
              onClick={() => setDetail((d) => !d)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: "12.5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: detail ? 16 : 0,
                padding: 0,
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {detail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {detail ? "Skrýt podrobnosti" : "Upravit nastavení"}
            </button>

            {/* Detail panel */}
            <AnimatePresence>
              {detail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden", marginBottom: 20 }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      paddingTop: 4,
                    }}
                  >
                    {/* Necessary – always on */}
                    <CookieRow
                      icon={<Shield size={14} />}
                      title="Nezbytné cookies"
                      description="Zajišťují základní funkce webu (přihlášení, zabezpečení). Nelze vypnout."
                      checked
                      disabled
                    />
                    {/* Analytics */}
                    <CookieRow
                      icon={<Check size={14} />}
                      title="Analytické cookies"
                      description="Pomáhají nám porozumět, jak návštěvníci web používají, aby se mohl zlepšovat."
                      checked={analytics}
                      onChange={setAnalytics}
                    />
                    {/* Marketing */}
                    <CookieRow
                      icon={<Cookie size={14} />}
                      title="Marketingové cookies"
                      description="Umožňují personalizovanou reklamu. Aktivní až po vašem souhlasu."
                      checked={marketing}
                      onChange={setMarketing}
                    />
                  </div>

                  <button
                    onClick={saveCustom}
                    style={{
                      marginTop: 16,
                      background: "rgba(155,81,224,0.15)",
                      border: "1px solid rgba(155,81,224,0.35)",
                      borderRadius: 50,
                      color: "#c97ae8",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "10px 22px",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(155,81,224,0.25)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(155,81,224,0.15)")
                    }
                  >
                    Uložit vlastní nastavení
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary buttons */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: detail ? 0 : 4,
              }}
            >
              <button
                onClick={rejectAll}
                style={{
                  flex: "1 1 140px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 50,
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "12px 20px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }}
              >
                Pouze nezbytné
              </button>

              <button
                onClick={acceptAll}
                className="btn-primary"
                style={{
                  flex: "1 1 140px",
                  fontSize: "14px",
                  padding: "12px 24px",
                }}
              >
                Přijmout vše
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---- helper row ---- */
function CookieRow({
  icon,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        padding: "12px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: disabled ? "default" : "pointer",
      }}
      onClick={() => !disabled && onChange && onChange(!checked)}
    >
      {/* Toggle */}
      <div
        style={{
          flexShrink: 0,
          marginTop: 2,
          width: 38,
          height: 22,
          borderRadius: 50,
          background: checked
            ? "linear-gradient(135deg,#9b51e0,#f78da7)"
            : "rgba(255,255,255,0.12)",
          border: checked
            ? "none"
            : "1px solid rgba(255,255,255,0.2)",
          position: "relative",
          transition: "background 0.25s ease",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 19 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.2s ease",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 3,
          }}
        >
          <span style={{ color: "#f78da7" }}>{icon}</span>
          <span
            style={{ fontWeight: 700, fontSize: "13.5px", color: "#fff" }}
          >
            {title}
          </span>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
