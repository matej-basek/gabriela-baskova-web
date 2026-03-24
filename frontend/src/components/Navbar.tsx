"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "O mně", href: "#o-mne" },
  { label: "Akce", href: "#akce" },
  { label: "Kurzy", href: "#kurzy" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          padding: "0 24px",
          height: "72px",
          width: "100%",
          display: "flex",
          background: scrolled
            ? "rgba(20, 5, 45, 0.85)"
            : "rgba(20, 5, 45, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          transition: "background 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                position: "relative",
                flexShrink: 0,
                marginTop: "-4px",
                filter: "drop-shadow(0 4px 15px rgba(155, 81, 224, 0.5))",
              }}
            >
              <Image
                src="/images/Logo GB.avif"
                alt="GB Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  background: "linear-gradient(135deg, #f78da7, #9b51e0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                }}
              >
                Gabriela Bašková
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 2,
                }}
              >
                Jóga & Fitness
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <div
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  padding: "8px 16px",
                  borderRadius: "50px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.1)";
                  (e.target as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = "none";
                  (e.target as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.8)";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              cursor: "pointer",
              padding: "8px",
              display: "none",
              flexDirection: "column",
              gap: "5px",
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  background: "#fff",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  transform: menuOpen
                    ? i === 0
                      ? "translateY(7px) rotate(45deg)"
                      : i === 1
                        ? "scaleX(0)"
                        : "translateY(-7px) rotate(-45deg)"
                    : "none",
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              zIndex: 899,
              background: "rgba(20, 5, 45, 0.95)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              padding: "16px 24px 24px",
            }}
            className="mobile-menu"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <button
                  onClick={() => scrollTo(link.href)}
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    padding: "14px 16px",
                    textAlign: "left",
                    borderRadius: "12px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  {link.label}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
