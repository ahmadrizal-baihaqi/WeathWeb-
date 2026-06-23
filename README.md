# WeathWeb - Modern & Premium Weather Dashboard 🌤️

**WeathWeb** adalah aplikasi dashboard cuaca modern yang dibangun menggunakan **Next.js 16 (App Router)**, **Tailwind CSS v4**, dan **Framer Motion**. Aplikasi ini dirancang untuk menyajikan data cuaca dengan antarmuka yang elegan, responsif, dan penuh animasi menarik.

---

## 🎨 Fitur Utama & Panduan Penggunaan (User Manual)

### 1. Pencarian Kota Real-Time
* **Cara Penggunaan**: Gunakan kolom pencarian di pojok kanan atas dashboard. Ketikkan nama kota (misal: "Jakarta", "Tokyo", "London") lalu tekan **Enter**.
* **Fungsi**: Dashboard akan memuat informasi cuaca riil dari kota tersebut secara instan melalui integrasi WeatherAPI.

### 2. Daftar Lokasi Disimpan (Saved Cities)
* **Menyimpan Kota**: Klik tombol ikon bintang (★) di sebelah kanan nama kota utama di dashboard untuk menambahkannya ke daftar favorit.
* **Melihat Daftar**: Klik menu **Lokasi** di navigasi samping (SideNav). Anda akan melihat daftar kota yang telah disimpan dalam bentuk grid 3 kolom yang modern.
* **Menghapus Kota**: Klik ikon tempat sampah (trash) merah di kartu kota untuk menghapusnya dari daftar simpanan.
* **Persistensi**: Daftar kota disimpan secara aman pada browser Anda menggunakan `localStorage`, sehingga tidak akan hilang saat halaman dimuat ulang.

### 3. Jam Lokal Tersinkronisasi Zona Waktu (Timezone Clock)
* Jam digital yang berada di bawah nama kota akan secara otomatis menyesuaikan dengan zona waktu setempat (`tz_id` dari kota yang dicari). 
* Jam berjalan detik demi detik secara real-time. Jika Anda mencari kota Tokyo, jam akan menampilkan waktu lokal Tokyo.

### 4. Ramalan 5 Hari Dinamis (Relative Forecast)
* Menampilkan prakiraan cuaca 5 hari ke depan yang dimulai secara relatif **sejak esok hari** (melewati hari aktif saat ini / "Hari Ini").
* Jika hari ini adalah Selasa, ramalan akan diisi berurutan dari hari Rabu, Kamis, Jumat, Sabtu, hingga Minggu.

### 5. Panel Pengaturan Kustom (7 Fitur Utama)
Dapat diakses melalui menu ikon roda gigi di navigasi samping. Konfigurasi tersusun rapi dalam grid 4 kolom responsif:
* **Satuan Suhu**: Pilih antara Celsius (°C) atau Fahrenheit (°F).
* **Satuan Angin**: Pilih satuan kecepatan angin antara `km/h`, `m/s`, atau `mph`.
* **Format Jam**: Ubah format tampilan jam digital antara 24 Jam atau 12 Jam (AM/PM).
* **Mode Cinematic**: Aktifkan/matikan animasi orbs atmosfer yang bergerak lembut di latar belakang.
* **Refresh Otomatis**: Secara otomatis memvalidasi dan memuat data cuaca baru setiap 5 menit.
* **Tampilkan Terasa Seperti**: Menampilkan baris informasi suhu indeks "Feels Like" di bawah suhu utama.
* **Tampilan Kondisi Ringkas**: Menyederhanakan kartu ringkasan kondisi cuaca dengan menyembunyikan label kecil dan sub-keterangan.
* **Reset ke Default**: Tombol cepat untuk mengembalikan semua konfigurasi pengaturan ke pengaturan awal pabrik.

### 6. Latar Belakang Atmosfer Adaptif (SkyBackground)
* Latar belakang aplikasi akan berubah warna secara dinamis menyesuaikan dengan kondisi cuaca aktif kota terpilih (Cerah, Hujan, Berawan, Salju, dll.).

---

## 🛠️ Stack Teknologi

[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-Latest-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Latest-000000?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Lucide React](https://img.shields.io/badge/Lucide%20React-Icons-FF6B35?style=for-the-badge&logoColor=white)](https://lucide.dev/)
[![WeatherAPI](https://img.shields.io/badge/WeatherAPI-Data-4ECDC4?style=for-the-badge&logoColor=white)](https://www.weatherapi.com/)

### Detail Stack:
* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) (dengan Turbopack untuk loading dev yang instan)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Type-safe development)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS (GPU-accelerated smooth scrolling)
* **Animasi**: [Framer Motion](https://www.framer.com/motion/) (Loader SVG awan, transisi halaman, & efek cinematic orbs)
* **Ikonografi**: [Lucide React Icons](https://lucide.dev/)
* **API Data Cuaca**: [WeatherAPI.com](https://www.weatherapi.com/)
* **Penyimpanan**: Client-side `localStorage`

---

## 📥 Langkah Instalasi & Menjalankan Proyek

Ikuti langkah-langkah di bawah untuk menjalankan WeathWeb di komputer lokal Anda:

### 1. Kloning Repositori
```bash
git clone <url-repositori-github-anda>
cd weather-app
```

### 2. Instalasi Dependensi
Pastikan Anda sudah menginstal Node.js (versi 18 ke atas direkomendasikan). Jalankan perintah berikut untuk mengunduh semua library:
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Buat sebuah file baru bernama `.env.local` di folder root proyek dan tambahkan API Key dari WeatherAPI Anda:
```env
NEXT_PUBLIC_WEATHER_API_KEY=isi_dengan_api_key_weatherapi_anda
```
*(Catatan: Anda dapat mendaftar dan mendapatkan API Key gratis di [WeatherAPI.com](https://www.weatherapi.com/))*

### 4. Jalankan Server Pengembangan (Development)
Jalankan server lokal Next.js dengan perintah:
```bash
npm run dev
```
Buka browser Anda dan kunjungi halaman [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

### 5. Kompilasi untuk Produksi (Production Build)
Untuk melakukan build produksi yang dioptimasi secara penuh:
```bash
npm run build
npm start
```

---

## 🚦 Penjaminan Kualitas (Quality Checks)

Proyek ini dilengkapi dengan modul **Antigravity Kit** untuk menjamin keamanan kode dan kualitas layout UI sebelum dipublikasikan:

* **Linting & Validasi Tipe**: Jalankan `npm run lint` dan `npx tsc --noEmit` untuk memastikan tidak ada kesalahan sintaksis atau error pengetikan TypeScript.
* **Master Checklist Run**: Anda dapat menjalankan skrip audit lengkap menggunakan Python:
  ```bash
  python .agents/scripts/checklist.py .
  ```
  *(Skrip ini memvalidasi pemindaian keamanan, linting, validasi DB, unit testing, audit UX, serta SEO secara berurutan).*
