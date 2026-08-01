# 🎓 Belajarsama.ai

> **Meja belajar digital cerdas bertenaga AI untuk menandai, merangkum, dan menguasai materi secara efisien.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)

---

## 🎯 The Problem & Our Solution

### 🚩 The Problem
Dalam era informasi yang serba cepat, pelajar dan profesional sering kali dihadapkan pada tumpukan dokumen PDF, buku digital, dan materi teks yang sangat panjang. Membaca, memahami, dan membuat catatan dari ratusan halaman memakan waktu berjam-jam. Selain itu, mengevaluasi pemahaman secara mandiri sulit dilakukan tanpa adanya pihak ketiga yang memberikan ujian atau kuis.

### 💡 The Solution
**Belajarsama.ai** hadir sebagai "Meja Belajar Digital" yang memecahkan masalah tersebut dengan memanfaatkan kecerdasan buatan (AI). Platform ini memungkinkan pengguna untuk:
1. **Meringkas dalam Detik:** Mengunggah dokumen PDF dan mendapatkan ringkasan komprehensif dalam hitungan detik.
2. **Evaluasi Otomatis:** Menghasilkan kuis interaktif secara otomatis berdasarkan materi yang diunggah untuk menguji pemahaman.
3. **Fokus & Nyaman:** Menggunakan desain responsif dan *dark mode* yang nyaman di mata, baik diakses melalui Desktop maupun Mobile.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📄 **Smart PDF Extraction** | Unggah file PDF dan sistem akan mengekstrak teks secara otomatis dengan akurasi tinggi. |
| 🤖 **AI Summarization** | Ringkasan instan bertenaga Google Gemini API (Real-time Streaming). |
| 📝 **Adaptive Quiz** | Kuis pilihan ganda yang di-generate oleh AI untuk menguji pemahaman materi. |
| 📅 **Interactive Schedule** | Kalender belajar untuk manajemen waktu dan kedisiplinan (Tracking). |
| 📊 **Analytics Dashboard** | Visualisasi performa kuis dan progres belajar menggunakan grafik (Recharts). |
| 📱 **Mobile Responsive** | Tampilan khusus perangkat mobile dengan navigasi bawah yang sangat nyaman (Bottom Nav). |

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Storage, Authentication)
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Data Visualization:** Recharts
- **Markdown & Code:** React Markdown

---

## 🚀 Memulai (Getting Started)

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Akun [Supabase](https://supabase.com/)
- [Google AI Studio API Key](https://aistudio.google.com/apikey)

### 1. Clone Repository

```bash
git clone https://github.com/heykhaje/Belajarsama.ai.git
cd Belajarsama.ai
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root folder dan masukkan kredensial Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Setup Database (Supabase)

1. Buka **SQL Editor** di dashboard Supabase.
2. _Copy & paste_ seluruh isi file `supabase/schema.sql`, lalu jalankan (**Run**).
3. Buat **Storage Bucket** dengan nama `materials` dan `profiles` melalui menu Storage agar pengguna dapat mengunggah PDF dan foto profil.

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi berjalan.

---

## 📂 Struktur Proyek Utama

```
src/
├── app/
│   ├── page.tsx              # Landing & Auth
│   ├── actions.ts            # Server Actions 
│   ├── layout.tsx            # Global Layout & Sidebar
│   ├── my-learning/          # Manajemen PDF & AI Summary
│   ├── schedule/             # Kalender Belajar
│   ├── analytics/            # Grafik Progres
│   └── quiz/[materialId]/    # Interactive AI Quiz
├── components/               # Reusable UI Components
├── lib/
│   ├── ai/gemini.ts          # Gemini API Integration
│   └── supabase/client.ts    # Supabase Client
supabase/
└── schema.sql                # Database Schema
```

---

## 📜 License

Didistribusikan di bawah lisensi MIT. Dibangun dengan ❤️ untuk kemajuan pendidikan.
