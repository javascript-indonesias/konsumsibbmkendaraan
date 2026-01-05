# 🚗 Konsumsi BBM Kendaraan

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)

**Aplikasi web sederhana untuk mencatat, memantau, dan menganalisis konsumsi bahan bakar kendaraan Anda.**

[Demo](#demo) • [Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [Kontribusi](#-kontribusi) • [Lisensi](#-lisensi)

</div>

---

## 📖 Tentang Proyek

**Konsumsi BBM Kendaraan** adalah aplikasi pelacak konsumsi bahan bakar yang berjalan sepenuhnya di browser. Dirancang untuk pemilik kendaraan pribadi yang ingin:

- 📊 **Memantau efisiensi** konsumsi BBM (km/liter)
- 💰 **Mengontrol pengeluaran** bahan bakar bulanan
- 📈 **Menganalisis tren** penggunaan kendaraan melalui grafik visual
- 🔒 **Menjaga privasi** — semua data tersimpan lokal di browser

### ⚡ Mengapa Menggunakan Aplikasi Ini?

| Masalah | Solusi |
|---------|--------|
| Tidak tahu berapa km/liter kendaraan | Kalkulasi otomatis setiap pengisian |
| Sulit melacak pengeluaran BBM | Dashboard dengan statistik lengkap |
| Butuh aplikasi yang simpel | Tanpa registrasi, langsung pakai! |
| Khawatir data dikirim ke server | 100% offline, data di localStorage |

---

## ✨ Fitur Utama

### 🏍️ Manajemen Kendaraan
- Dukung **multi-kendaraan** (motor & mobil)
- Tambah, edit, dan hapus kendaraan
- Pilih warna identitas untuk setiap kendaraan

### ⛽ Pencatatan Pengisian BBM
- Input cepat: **tanggal, liter, harga, odometer**
- Hitung otomatis harga per liter
- Pilihan jenis BBM (Pertalite, Pertamax, dll.)
- Catatan tambahan per transaksi

### 📊 Dashboard & Statistik
- **Ringkasan numerik**: total pengeluaran, rata-rata konsumsi, total jarak
- **Grafik tren** konsumsi dengan Chart.js
- **Perbandingan** efisiensi antar kendaraan
- Filter rentang waktu (3 bulan, 6 bulan, 1 tahun, custom)

### 📜 Riwayat Timeline
- Tampilan kronologis semua pengisian
- Indikator warna efisiensi (hijau/kuning/merah)
- Quick action untuk edit dan hapus

### 📥 Export & Import
- Export data ke format **CSV**
- Import dari CSV untuk backup/restore
- Reset seluruh data dengan konfirmasi

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Structure** | HTML5 Semantic |
| **Styling** | Bootstrap 5.3, CSS Variables |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Charts** | Chart.js 4.x |
| **Storage** | localStorage API |
| **Build Tool** | Vite 5.x |
| **Icons** | Bootstrap Icons |

---

## 🚀 Instalasi

### Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- npm (sudah termasuk dengan Node.js)

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/konsumsi-bbm-kendaraan.git

# 2. Masuk ke direktori proyek
cd konsumsi-bbm-kendaraan

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev
```

Buka browser dan akses `http://localhost:5173`

### Build untuk Produksi

```bash
# Build aplikasi
npm run build

# Preview hasil build
npm run preview
```

---

## 📁 Struktur Proyek

```
konsumsi-bbm-kendaraan/
├── src/
│   ├── components/          # Komponen UI reusable
│   │   ├── color-picker.js  # Pemilih warna kendaraan
│   │   ├── delete-confirm-modal.js
│   │   ├── toast.js         # Notifikasi toast
│   │   └── vehicle-form.js  # Form kendaraan
│   ├── modules/             # Modul logika bisnis
│   │   ├── fuel-log.js      # Manajemen log BBM
│   │   ├── storage.js       # localStorage wrapper
│   │   ├── utils.js         # Fungsi utility
│   │   └── vehicle.js       # Manajemen kendaraan
│   ├── pages/               # Script per halaman
│   │   ├── kendaraan.js
│   │   └── tambah.js
│   └── styles/
│       └── main.css         # Custom styles
├── spec/                    # Spesifikasi UI/UX & arsitektur
├── plan/                    # Dokumen implementasi
├── kendaraan.html           # Halaman daftar kendaraan
├── tambah.html              # Form tambah pengisian
├── package.json
├── vite.config.js
└── README.md
```

---

## 💾 Penyimpanan Data

Data disimpan dalam `localStorage` browser dengan struktur:

```javascript
{
  "vehicles": [
    {
      "id": "uuid",
      "name": "Honda Beat",
      "type": "motor",
      "year": 2020,
      "plateNumber": "B 1234 XYZ",
      "color": "#FF6384"
    }
  ],
  "fuelLogs": [
    {
      "id": "uuid",
      "vehicleId": "uuid",
      "date": "2024-01-15",
      "liters": 4.5,
      "totalPrice": 50000,
      "odometer": 15000,
      "fuelType": "Pertalite"
    }
  ]
}
```

> ⚠️ **Penting**: Data tersimpan di browser. Gunakan fitur Export untuk backup!

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

### Langkah Kontribusi

1. **Fork** repository ini
2. **Clone** fork Anda ke lokal
3. **Buat branch** baru untuk fitur/bug fix:
   ```bash
   git checkout -b fitur/nama-fitur
   ```
4. **Commit** perubahan dengan pesan yang jelas:
   ```bash
   git commit -m "feat: menambahkan fitur X"
   ```
5. **Push** ke branch Anda:
   ```bash
   git push origin fitur/nama-fitur
   ```
6. Buat **Pull Request**

### Panduan Commit Message

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Penggunaan |
|--------|------------|
| `feat:` | Fitur baru |
| `fix:` | Bug fix |
| `docs:` | Perubahan dokumentasi |
| `style:` | Formatting, tidak mengubah logika |
| `refactor:` | Refactoring kode |
| `test:` | Menambah/memperbaiki test |

### Area yang Butuh Kontribusi

- [ ] 🎨 Implementasi tema gelap (dark mode)
- [ ] 📊 Halaman statistik dengan grafik lengkap
- [ ] 🌐 Progressive Web App (PWA) support
- [ ] 🧪 Unit testing dengan Vitest
- [ ] 📱 Optimasi tampilan mobile
- [ ] 🌍 Dukungan multi-bahasa (i18n)

---

## 📋 Roadmap

### v1.0 (Current)
- [x] CRUD Kendaraan
- [x] CRUD Pengisian BBM
- [x] Kalkulasi km/liter
- [x] Penyimpanan localStorage

### v1.1 (Planned)
- [ ] Dashboard dengan ringkasan statistik
- [ ] Riwayat timeline visual
- [ ] Export/Import CSV

### v1.2 (Future)
- [ ] Grafik Chart.js lengkap
- [ ] Perbandingan multi-kendaraan
- [ ] PWA offline support

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 🙏 Acknowledgements

- [Bootstrap](https://getbootstrap.com/) - CSS Framework
- [Chart.js](https://www.chartjs.org/) - Charting Library
- [Vite](https://vitejs.dev/) - Build Tool
- [Bootstrap Icons](https://icons.getbootstrap.com/) - Icon Library

---

<div align="center">

**Dibuat dengan ❤️ untuk komunitas Indonesia**

⭐ Jangan lupa beri bintang jika proyek ini membantu!

</div>
