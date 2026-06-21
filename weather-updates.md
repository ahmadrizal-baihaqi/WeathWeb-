# Rencana Kerja: Pembaruan Fitur Cuaca (weather-updates.md)

Rencana kerja ini mencakup implementasi fitur pembaruan pada Weather App:
1. Animasi loading awan dengan efek garis berjalan (animated cloud outline).
2. Optimalisasi performa scroll (mengurangi lag frame akibat backdrop filter).
3. Penyesuaian waktu (jam lokal) berdasarkan kota yang dicari (timezone sync).
4. Fitur CRUD untuk daftar lokasi yang disimpan (menggunakan localStorage).
5. Penghapusan fitur alerts (cuaca darurat) sepenuhnya dari menu navigasi dan tampilan.

## Tipe Proyek
WEB (Next.js 16 + Tailwind CSS + Framer Motion)

## Kriteria Keberhasilan
- [x] Splash screen loading menampilkan animasi SVG garis awan berjalan (animated path) dan teks kecil "menghubungkan ke satelit...".
- [x] Scroll berjalan mulus (60fps) dengan penerapan GPU acceleration (`will-change`, `transform-gpu`) dan optimasi filter blur.
- [x] Jam di dashboard utama otomatis menyesuaikan waktu lokal kota hasil pencarian (menggunakan zona waktu `tz_id` dari API).
- [x] Pengguna bisa menyimpan (menambahkan) kota aktif ke dalam "Lokasi Disimpan" melalui tombol bintang di Header, serta menghapusnya melalui tombol hapus (trash/silang) di menu lokasi.
- [x] Menu Alerts (Peringatan) dihapus sepenuhnya dari navigasi samping (`SideNav.tsx`) dan routing.

## Stack Teknologi
- **Next.js 16 (App Router)**
- **Tailwind CSS v4** (optimasi rendering)
- **Framer Motion** (animasi garis berjalan untuk SVG awan dan transisi UI)
- **Lucide React** (Ikon bintang `Star`, ikon hapus `Trash2`, dll.)
- **WeatherAPI** (menambahkan `tz_id` pada payload data cuaca)

---

## Pertanyaan Terbuka (Socratic Gate)
> [!IMPORTANT]
> Mohon konfirmasi atau berikan tanggapan untuk poin berikut sebelum kami mulai memodifikasi kode:
> 1. **Pemicu Simpan Kota**: Apakah tombol Simpan/Favorit di Header berupa tombol bintang (`Star`) di sebelah nama kota?
> 2. **Desain Garis Awan**: Apakah animasi garis awan yang berputar/berjalan (stroke-dasharray animation) sudah sesuai dengan bayangan Anda?
> 3. **Penghapusan Alerts**: Apakah ikon lonceng peringatan di navigasi samping langsung dihapus tanpa pengganti menu baru?

---

## Rincian Tugas

### Fase 1: Persiapan & Modifikasi Tipe Data (P0)
- **Tugas 1.1**: Sesuaikan tipe data `WeatherData` di `src/types/weather.ts` untuk mendukung properti `tzId` (zona waktu) dan `region`.
  - **Agen**: `project-planner`
  - **Skill**: `clean-code`
  - **INPUT**: File [weather.ts](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/types/weather.ts).
  - **OUTPUT**: Penambahan properti `tzId` dan `region`.
  - **VERIFIKASI**: Periksa tipe data di editor.
- **Tugas 1.2**: Update API Client di `src/lib/weather.ts` untuk memetakan `tz_id` dan `region` dari respons WeatherAPI.
  - **Agen**: `backend-specialist`
  - **Skill**: `api-patterns`
  - **INPUT**: File [weather.ts](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/lib/weather.ts).
  - **OUTPUT**: Objek data cuaca terisi dengan data riil `tzId` dan `region`.
  - **VERIFIKASI**: Pastikan build sukses.

### Fase 2: Implementasi Animasi & Performa (P1)
- **Tugas 2.1**: Buat animasi garis awan SVG di `src/components/ui/SplashScreen.tsx`.
  - **Agen**: `frontend-specialist`
  - **Skill**: `frontend-design`
  - **INPUT**: File [SplashScreen.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/components/ui/SplashScreen.tsx).
  - **OUTPUT**: Tampilan loader minimalis dengan SVG awan garis berjalan (dash array stroke animation).
  - **VERIFIKASI**: Jalankan visual check.
- **Tugas 2.2**: Optimalkan performa scroll di `SkyBackground.tsx` dan `globals.css` dengan menerapkan hardware acceleration.
  - **Agen**: `frontend-specialist`
  - **Skill**: `performance-profiling`
  - **INPUT**: [SkyBackground.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/components/effects/SkyBackground.tsx) dan [globals.css](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/app/globals.css).
  - **OUTPUT**: Penambahan `will-change` pada orbs animasi dan optimalisasi filter blur.
  - **VERIFIKASI**: Scroll halaman tanpa lag.

### Fase 3: Logika Jam Dinamis & Favorit CRUD (P2)
- **Tugas 3.1**: Implementasi Jam Lokal Dinamis berdasarkan zona waktu kota di `src/app/page.tsx`.
  - **Agen**: `frontend-specialist`
  - **Skill**: `nextjs-react-expert`
  - **INPUT**: File [page.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/app/page.tsx).
  - **OUTPUT**: Jam berjalan terus detik demi detik menyesuaikan dengan zona waktu kota aktif (`tzId`).
  - **VERIFIKASI**: Cari kota Tokyo/New York dan pastikan jam berganti sesuai zona waktu setempat.
- **Tugas 3.2**: Buat state & localStorage untuk simpan/hapus kota favorit.
  - **Agen**: `frontend-specialist`
  - **Skill**: `nextjs-react-expert`
  - **INPUT**: File [page.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/app/page.tsx) dan [SideNav.tsx](file:///c:/Users/USER/Project%20Coding/Weather%20App/src/components/ui/SideNav.tsx).
  - **OUTPUT**: Pengguna bisa menyimpan kota saat ini, melihat daftar tersimpan di menu Lokasi, dan menghapusnya.
  - **VERIFIKASI**: Tambahkan kota, reload halaman, pastikan data tersimpan tetap ada di menu Lokasi.

### Fase 4: Pembersihan Fitur Alerts & Clean Up (P3)
- **Tugas 4.1**: Hapus fitur Alerts dari `SideNav.tsx` dan `page.tsx`.
  - **Agen**: `frontend-specialist`
  - **Skill**: `clean-code`
  - **INPUT**: Komponen navigasi dan view terkait.
  - **OUTPUT**: Tombol alerts di SideNav dan tampilan alerts dihapus sepenuhnya.
  - **VERIFIKASI**: Navigasi lancar tanpa referensi menu alerts.

---

## Verifikasi Akhir (Phase X)
- [x] Jam bekerja realtime sinkron dengan zona waktu kota yang dicari.
- [x] Fitur simpan/hapus kota favorit berjalan di localStorage.
- [x] Scroll lancar tanpa frame drop.
- [x] `npm run build` sukses.
- [x] Skrip validasi `checklist.py` berhasil dijalankan.

## ✅ PHASE X COMPLETE
- Lint: [x] Passed
- Security: [x] Passed
- Build: [x] Passed
- Date: [2026-06-21]
