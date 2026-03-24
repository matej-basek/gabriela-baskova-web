import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Gabriela Bašková – Jóga & Fitness",
  description: "Profesionální lektorka jógy, fyzio-jógy a pilates. Kurzy, akce a rozvrhy studií na jednom místě.",
  keywords: "jóga, fitness, pilates, fyzio-jóga, Gabriela Bašková, kurzy jógy, Hradec Králové",
  openGraph: {
    title: "Gabriela Bašková – Jóga & Fitness",
    description: "Profesionální lektorka jógy, fyzio-jógy a pilates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <link rel="icon" href="/images/Logo GB.avif" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="animated-bg" />
        <div className="mandala-bg">
          <Image
            src="/images/mandala-real.avif"
            alt=""
            width={1400}
            height={1400}
            quality={60}
            style={{
              width: 'min(1400px, 140vmax)',
              height: 'min(1400px, 140vmax)',
              objectFit: 'contain',
              opacity: 0.12,
              filter: 'invert(1)',
              animation: 'mandalaRotate 80s linear infinite',
            }}
          />
        </div>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
