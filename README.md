# Aplikasi Catatan (React + Vite)

SPA catatan pribadi dengan autentikasi, terhubung ke RESTful API Dicoding (`https://notes-api.dicoding.dev/v1`).

## Menjalankan
```
npm install
npm run dev
```
Build produksi: `npm run build`.

## Route
| Path | Halaman | Akses |
|---|---|---|
| `/login` | Login | Publik |
| `/register` | Registrasi | Publik |
| `/` | Daftar catatan aktif (+ pencarian `?keyword=`) | Login |
| `/archives` | Daftar catatan arsip | Login |
| `/notes/new` | Tambah catatan | Login |
| `/notes/:id` | Detail, arsip / batal arsip, hapus | Login |
| `*` | 404 | - |

## Struktur
- `src/contexts/` — `AuthContext`, `ThemeContext`, `LanguageContext`
- `src/hooks/` — `useInput`, `useAsyncData`
- `src/utils/network-data.js` — fungsi API dari Dicoding (diubah minimal: tanpa `alert`, `register`/`login` mengembalikan `message`, ditambah `removeAccessToken`)
- `src/utils/translations.js` — teks Indonesia & Inggris

Catatan: API Dicoding tidak menyediakan endpoint ubah catatan, sehingga fitur Edit dari submission awal dihapus.
