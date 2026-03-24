"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
export default function AboutSection() {
  return (
    <section id="o-mne" style={{ position: "relative", overflow: "hidden" }}>
      <style>{`
                /* 
                 * =========================================
                 * 💡 NASTAVENÍ POZICE PROFILOVÉ FOTOGRAFIE 
                 * =========================================
                 * Zde můžete měnit hodnoty pro posunutí fotky. 
                 * Kladné hodnoty (např. 20px) = doprava / dolů
                 * Záporné hodnoty (např. -20px) = doleva / nahoru
                 */
                :root {
                  --photo-offset-x-desktop: 0px; /* Posun do stran na PC */
                  --photo-offset-y-desktop: 0px; /* Posun nahoru/dolů na PC */
                  --photo-scale-desktop: 1.0;    /* Zvětšení fotky na PC (změňte např. na 1.2, 1.3 pro zvětšení) */
                  --photo-max-width-desktop: 600px; /* Maximální šířka fotky na PC */
                  
                  --photo-offset-x-mobile: 0px;  /* Posun do stran na mobilu */
                  --photo-offset-y-mobile: 0px;  /* Posun nahoru/dolů na mobilu */
                  --photo-scale-mobile: 1.0;    /* Zvětšení fotky na mobilu (změňte např. na 1.2 pro zvětšení) */
                  --photo-max-width-mobile: 100%; /* Maximální šířka fotky na mobilu */
                }

                .about-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 100px 48px 20px;
                    gap: 64px;
                }
                .about-photo-wrap {
                    position: relative;
                    width: 100%;
                    display: block;
                }
                .about-photo-wrap .profile-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    transform: scale(var(--photo-scale-desktop)) translate(var(--photo-offset-x-desktop), var(--photo-offset-y-desktop));
                    margin: 0 auto;
                }
                @media (max-width: 900px) {
                    .about-grid {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding: 100px 24px 40px;
                        gap: 40px;
                    }
                    .about-grid > div:nth-child(2) {
                        order: -1;
                        width: 100%;
                        padding: 0 10%;
                    }
                    .about-photo-wrap .profile-img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        transform: scale(var(--photo-scale-mobile)) translate(var(--photo-offset-x-mobile), var(--photo-offset-y-mobile));
                        transform-origin: center center;
                    }
                    .about-text {
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .about-text .btn-row {
                        justify-content: center !important;
                    }
                    .about-text .social-row {
                        justify-content: center !important;
                    }
                }
                @media (max-width: 480px) {
                    .about-photo-wrap {
                        /* removed fixed height constraint */
                    }
                    .about-grid {
                        padding: 90px 16px 30px;
                    }
                }
            `}</style>

      <div className="about-grid">
        {/* LEFT – Text */}
        <motion.div
          className="about-text"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#f78da7",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            O mně
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            Ahoj, jsem{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #f78da7, #9b51e0, #CF2ABA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Gabriela
            </span>
          </h1>

          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              marginBottom: "20px",
            }}
          >
            Lektorka jógy, pilates & fitness
          </div>

          <div
            style={{
              width: 64,
              height: 3,
              background: "linear-gradient(90deg, #f78da7, #9b51e0)",
              borderRadius: 10,
              marginBottom: "20px",
              margin: "0 auto 20px",
            }}
          />

          <p
            style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: "15px",
              lineHeight: "1.85",
              marginBottom: "32px",
            }}
          >
            Jsem lektorka jógy, pilates, fitness forem cvičení, trenérka lekcí pro děti, zakladatelka sportovního klubu Gabriely Baškové, podnikatelka, lektorka workshopů se sportovní tématikou, organizátorka sportovních akcí a ráda šířím úsměv do svého okolí.
          </p>

          {/* CTA buttons */}
          <div
            className="btn-row"
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            <button
              className="btn-primary"
              onClick={() =>
                document
                  .querySelector("#kontakt")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Kontaktujte mě
            </button>
            <button
              onClick={() =>
                document
                  .querySelector("#kurzy")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                padding: "14px 28px",
                borderRadius: "50px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "Outfit, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
            >
              Rozvrh kurzů
            </button>
          </div>

          {/* Social links */}
          <div className="social-row" style={{ display: "flex", gap: "12px" }}>
            <a
              href="https://www.facebook.com/gym4youhradeckralove/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(155,81,224,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.instagram.com/gym4youhk/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(247,141,167,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
            >
              <Instagram size={18} />
            </a>
          </div>
        </motion.div>

        {/* RIGHT – Photo */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="about-photo-wrap"
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "125%",
              maxWidth: "var(--photo-max-width-desktop)",
              margin: "0 auto",
            }}
          >
            <Image
              src="/images/nova_profilova.png"
              alt="Gabriela Bašková"
              fill
              style={{ objectFit: "contain" }}
              className="profile-img"
              priority
              unoptimized
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
