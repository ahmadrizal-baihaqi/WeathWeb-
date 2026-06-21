# Rencana Kerja: Penyederhanaan Animasi Loading (loading-animation.md)

Rencana ini dibuat untuk menyederhanakan tampilan splash screen saat aplikasi pertama kali dimuat. Tampilan yang kompleks akan digantikan dengan indikator loading sederhana dan teks minimalis.

## Tipe Proyek
WEB (Next.js 16 + Tailwind CSS + Framer Motion)

## Kriteria Keberhasilan
- [ ] Animasi loading yang minimalis (hanya logo animasi loading / spinner sederhana).
- [ ] Teks pemuatan yang ringkas dan kecil (contoh: "menghubungkan ke satelit").
- [ ] Hilangnya progress bar persentase yang mengganggu estetika minimalis.
- [ ] Transisi keluar (exit transition) yang mulus saat masuk ke halaman dashboard utama.

## Stack Teknologi
- **Next.js 16 / React 19**
- **Tailwind CSS** (untuk penataan layout minimalis)
- **Framer Motion** (untuk animasi rotasi spinner dan transisi fade-out)
- **Lucide React** (untuk ikon `Loader2` atau spinner alternatif)

## Struktur File Terkait
- [src/components/ui/SplashScreen.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/components/ui/SplashScreen.tsx) - File komponen utama splash screen yang akan dimodifikasi.
- [src/app/page.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/app/page.tsx) - Tempat pemanggilan splash screen dan manajemen state loading.

---

## Keputusan Desain (Disetujui)
1. **Gaya Logo Animasi Loading**: Menggunakan spinner minimalis modern (ikon `Loader2` dari Lucide React yang diputar dengan Framer Motion atau Tailwind `animate-spin` agar mulus).
2. **Detail Teks**: Menggunakan teks kecil statis `"menghubungkan ke satelit..."` dengan font bergaya monospace, berukuran kecil, berwarna abu-abu (slate-400), tanpa persentase angka dan tanpa progress bar.
3. **Perilaku Durasi**: Diubah agar dinamis. Splash screen akan memiliki durasi minimum 1.5 detik agar transisi tidak terlalu cepat/jarring, dan akan tertutup secara otomatis begitu data cuaca selesai diunduh (`loading === false`).

---

## Rincian Tugas

### Fase 1: Analisis & Persiapan (P0)
- **Tugas 1.1**: Buat branch Git baru untuk perubahan ini.
  - **Agen**: `project-planner`
  - **Skill**: `clean-code`
  - **INPUT**: Workspace di branch utama.
  - **OUTPUT**: Branch baru `feature/loading-animation` aktif.
  - **VERIFIKASI**: Jalankan `git branch` untuk memastikan branch baru aktif.

### Fase 2: Implementasi (P1)
- **Tugas 2.1**: Modifikasi komponen `SplashScreen.tsx`.
  - **Agen**: `frontend-specialist`
  - **Skill**: `frontend-design`
  - **INPUT**: File [SplashScreen.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/components/ui/SplashScreen.tsx).
  - **OUTPUT**: Splash screen disederhanakan dengan spinner minimalis dan teks kecil "menghubungkan ke satelit". Menghapus judul besar "SkyCastExtreme", subtitle, dan progress bar.
  - **VERIFIKASI**: Inspeksi kode untuk memastikan elemen yang tidak perlu telah dihapus.
- **Tugas 2.2**: Sesuaikan timing atau state penutupan di `page.tsx` (jika diperlukan berdasarkan feedback).
  - **Agen**: `frontend-specialist`
  - **Skill**: `nextjs-react-expert`
  - **INPUT**: File [page.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/app/page.tsx).
  - **OUTPUT**: Logika durasi loading terintegrasi dengan baik.
  - **VERIFIKASI**: Verifikasi transisi keluar splash screen bekerja dengan lancar.

### Fase 3: Verifikasi & Audit (P2)
- **Tugas 3.1**: Jalankan skrip validasi dan uji coba visual.
  - **Agen**: `test-engineer`
  - **Skill**: `verify-changes`
  - **INPUT**: Kode aplikasi yang telah dimodifikasi.
  - **OUTPUT**: Aplikasi berjalan tanpa error lint, build sukses.
  - **VERIFIKASI**: Jalankan `npm run build` dan `python .agents/scripts/checklist.py .`.

---

## Verifikasi Akhir (Phase X)
- [ ] Tidak ada penggunaan kode warna ungu/violet (Purple Ban).
- [ ] Transisi Framer Motion berjalan lancar tanpa lag (60fps).
- [ ] `npm run build` berhasil tanpa error.
- [ ] Skrip validasi `checklist.py` berhasil dijalankan.

## ✅ PHASE X COMPLETE
- Lint: [ ]
- Security: [ ]
- Build: [ ]
- Date: [Belum selesai]
