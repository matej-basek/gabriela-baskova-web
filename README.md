# Gabriela Bašková – Portfolio + CMS

Moderní full-stack webové portfolio s integrovaným administrátorským systémem (CMS) pro lektorku jógy Gabrielu Baškovou. Aplikace je napsána kompletně v **Next.js (App Router)**.

## 🛠️ Technologický stack

| Část | Technologie |
|------|-------------|
| Framework | Next.js 15 (React), TypeScript |
| UI & Stylování | Tailwind CSS, Framer Motion, lucide-react |
| Databáze | MongoDB Atlas (Cloud) + Mongoose |
| Autentizace | JWT (httpOnly cookies), bcryptjs |
| Formuláře | Web3Forms API (bez odesílacího hesla) |

---

## 🚀 Spuštění projektu lokálně

Aplikace běží jako jeden sjednocený full-stack Next.js projekt (API routy i frontend jsou společně).

### 1. Předpoklady
- [Node.js](https://nodejs.org/) 18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) účet (zdarma) s vytvořeným clusterem.

### 2. Instalace a konfigurace

```bash
# Přejít do složky frontend
cd frontend

# Nainstalovat závislosti
npm install
```

**Nastavení .env.local:**
Zkopírujte soubor `.env.example` do `.env.local` a doplňte své údaje:

```env
# Smažte tuto hodnotu pro výchozí relativní cesty, nebo zadejte URL pro produkci
NEXT_PUBLIC_API_URL=

# MongoDB Connection String (Atlas doporučeno)
MONGO_URI=mongodb+srv://<uživatel>:<heslo>@cluster0.../gabriela_baskova?retryWrites=true&w=majority

# JWT Tajný klíč
JWT_SECRET=libovolny_tajny_klic_pro_hashovani

# Web3Forms API klíč (pro odesílání kontaktního formuláře)
# Získáte zdarma bez registrace na https://web3forms.com
WEB3FORMS_ACCESS_KEY=vas_prideleny_klic
```

### 3. Vytvoření administrátora (Seed)
Pro úvodní naplnění databáze a vytvoření administrátorského účtu otevřete po spuštění serveru v prohlížeči tuto skrytou URL zadáním do adresního řádku:
`http://localhost:3000/api/seed`

### 4. Spuštění vývojového serveru
```bash
npm run dev
```
Aplikace poběží na `http://localhost:3000`.

---

## 🔐 Admin přístup

- **URL:** `http://localhost:3000/admin`
- **Výchozí Login:** `admin` / `admin123`
*(Pozn.: Bezpečnost je zajištěna pomocí Next.js Edge Middleware a JWT cookies.)*

---

## 📁 Struktura sjednoceného projektu (frontend/)

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Hlavní public stránka
│   │   ├── layout.tsx        # Root layout (+ styly, fonty)
│   │   ├── globals.css       # Globální Tailwind CSS & Liquid Glass
│   │   │
│   │   ├── admin/            # CMS Dashboard (Chráněné routy)
│   │   │   ├── login/        # Přihlašovací obrazovka
│   │   │   ├── events/       # CRUD operace Akce
│   │   │   └── studios/      # CRUD operace Studia a lekce
│   │   │
│   │   ├── api/              # Backend Endpoints
│   │       ├── auth/         # Login, logout, me
│   │       ├── events/       # Akce (GET, POST, PUT, DELETE)
│   │       ├── studios/      # Kurzové lokace
│   │       ├── contact/      # Web3Forms odesílání
│   │       └── seed/         # Inicializace admina
│   │
│   ├── components/           # Public UI (O mně, Kontakt, Modaly)
│   ├── lib/                  # Nástroje (MongoDB připojení, api klient)
│   └── models/               # Databázová schémata (Mongoose)
│
├── public/                   # Statické soubory (logo, profilové fotky)
└── middleware.ts             # Ochrana /admin a /api endpointů bez tokenu
```

---

## 🎨 Design System

- **Styl:** Liquid Glass (glassmorphismus)
- **Paleta:** `#f78da7` (růžová) · `#9b51e0` (fialová) · `#7E2A73` (tmavá fialová)
- **Typografie:** Google Fonts (Inter, Outfit)
- **Ikony:** lucide-react

---

## 🌐 Produkční nasazení (Render.com doporučeno)

Web je navržen pro nasazení bez nutnosti instalace lokální databáze.

1. Nasaďte celou složku `frontend` jako **Web Service** na [Render.com](https://render.com) (zdarma úroveň podporuje Next.js).
2. Jako *Build Command* zvolte `npm install && npm run build`.
3. Jako *Start Command* zvolte `npm start`.
4. V nastavení služby Render zkopírujte všechny proměnné z `.env.local` (zejména `MONGO_URI` od Atlasu) do záložky **Environment**. 
