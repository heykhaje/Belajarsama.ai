# Contributing to Belajarsama.ai

Terima kasih telah tertarik untuk berkontribusi! 🎉

## 🛠️ Development Setup

1. Fork repository ini
2. Clone fork Anda: `git clone https://github.com/<username>/Belajarsama.ai.git`
3. Install dependencies: `npm install`
4. Copy environment: `cp .env.example .env.local`
5. Jalankan dev server: `npm run dev`

## 📋 Branching Strategy

| Branch Pattern | Kegunaan |
|----------------|----------|
| `main` | Production-ready code |
| `feat/<nama-fitur>` | Fitur baru |
| `fix/<deskripsi-bug>` | Perbaikan bug |
| `docs/<topik>` | Dokumentasi |
| `refactor/<area>` | Refactoring kode |

## 💬 Commit Convention

Kami mengikuti [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): deskripsi singkat
fix(scope): deskripsi perbaikan
docs: update dokumentasi
chore: tugas maintenance
refactor(scope): perbaikan struktur kode
```

## 🔄 Pull Request Process

1. Buat branch dari `main`
2. Pastikan kode berjalan tanpa error (`npm run dev`)
3. Tulis deskripsi PR yang jelas dengan konteks perubahan
4. Tunggu review sebelum merge

## 📐 Code Style

- **TypeScript** strict mode
- **Tailwind CSS** untuk styling
- Gunakan **Server Components** sebagai default, `'use client'` hanya jika diperlukan
- Semua Server Actions ada di `src/app/actions.ts`
