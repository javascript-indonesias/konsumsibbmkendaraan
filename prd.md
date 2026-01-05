# PRD: Konsumsi BBM Kendaraan

## 1. Product Overview

### 1.1 Document Title and Version

- **PRD**: Konsumsi BBM Kendaraan
- **Version**: 1.0.0
- **Last Updated**: 23 Desember 2025

### 1.2 Product Summary

**Konsumsi BBM Kendaraan** adalah aplikasi web sederhana yang membantu individu pemilik kendaraan untuk mencatat, memantau, dan menganalisis konsumsi bahan bakar kendaraan mereka. Aplikasi ini dirancang untuk memberikan insight tentang efisiensi penggunaan BBM sehingga pengguna dapat mengoptimalkan pengeluaran bahan bakar.

Aplikasi ini dibangun dengan teknologi web standar (HTML, CSS, JavaScript) tanpa framework kompleks, menggunakan Bootstrap CSS untuk tampilan yang responsif. Data disimpan secara lokal di browser (localStorage) sehingga aplikasi dapat berfungsi secara offline tanpa memerlukan koneksi internet.

---

## 2. Goals

### 2.1 Business Goals

- Menyediakan tools gratis dan mudah digunakan untuk tracking konsumsi BBM pribadi
- Membantu pengguna menghemat pengeluaran BBM melalui insight berbasis data
- Membangun aplikasi yang ringan, cepat, dan dapat diakses dari berbagai perangkat

### 2.2 User Goals

- Mencatat setiap pengisian BBM dengan mudah dan cepat
- Mengetahui konsumsi BBM rata-rata kendaraan (km/liter)
- Melihat tren pengeluaran BBM dalam bentuk laporan dan statistik
- Mengakses data kapan saja, termasuk saat offline

### 2.3 Non-goals (Out of Scope)

- Integrasi dengan API harga BBM real-time
- Fitur GPS tracking rute perjalanan
- Sinkronisasi data antar perangkat (cloud sync)
- Fitur reminder service kendaraan
- Multi-user atau fleet management
- Progressive Web App (PWA) dengan service worker

---

## 3. User Personas

### 3.1 Key User Types

- Pemilik kendaraan pribadi (mobil/motor)
- Pengguna yang ingin memantau pengeluaran BBM
- Pengguna yang mencari solusi sederhana tanpa registrasi

### 3.2 Basic Persona Details

- **Andi (Commuter Harian)**: Karyawan yang menggunakan motor untuk berangkat kerja setiap hari. Ingin tahu berapa konsumsi BBM bulanan dan apakah motornya masih efisien.

- **Budi (Pemilik Mobil Keluarga)**: Kepala keluarga yang rutin mengisi bensin setiap minggu. Ingin tracking pengeluaran BBM untuk budgeting bulanan.

- **Citra (Pengguna Praktis)**: Mahasiswi yang baru memiliki motor. Butuh cara sederhana untuk mencatat pengisian BBM tanpa aplikasi yang ribet.

### 3.3 Role-based Access

- **Single User**: Tidak ada pembagian role. Satu pengguna = satu aplikasi di browser mereka. Data bersifat personal dan tersimpan lokal.

---

## 4. Functional Requirements

### 4.1 Manajemen Kendaraan (Priority: HIGH)

- Pengguna dapat menambahkan kendaraan baru (nama, jenis, tahun, plat nomor)
- Pengguna dapat mengedit informasi kendaraan
- Pengguna dapat menghapus kendaraan beserta seluruh riwayat pengisiannya
- Pengguna dapat memilih kendaraan aktif untuk pencatatan

### 4.2 Pencatatan Pengisian BBM (Priority: HIGH)

- Pengguna dapat menambahkan catatan pengisian baru dengan field:
  - Tanggal pengisian (default: hari ini)
  - Jumlah liter BBM
  - Total harga (Rupiah)
  - Odometer saat pengisian (km)
  - Jenis BBM (opsional: Pertalite, Pertamax, dll)
  - Catatan tambahan (opsional)
- Pengguna dapat mengedit catatan pengisian yang sudah ada
- Pengguna dapat menghapus catatan pengisian
- Sistem menghitung otomatis harga per liter

### 4.3 Perhitungan Konsumsi (Priority: HIGH)

- Sistem menghitung konsumsi BBM (km/liter) berdasarkan selisih odometer
- Sistem menampilkan rata-rata konsumsi keseluruhan
- Sistem menampilkan konsumsi terbaik dan terburuk

### 4.4 Timeline View Riwayat (Priority: MEDIUM)

- Tampilan riwayat pengisian dalam format timeline visual
- Setiap entry menampilkan: tanggal, liter, harga, konsumsi km/liter
- Indikator visual untuk konsumsi (hijau = efisien, kuning = normal, merah = boros)
- Scroll infinite atau pagination untuk riwayat panjang
- Quick action: edit dan hapus langsung dari timeline

### 4.5 Laporan dan Statistik (Priority: MEDIUM)

#### 4.5.1 Dashboard Ringkasan Numerik
- Tampilan ringkasan statistik utama dalam bentuk kartu/card:
  - **Total Pengeluaran BBM**: Bulan ini dan keseluruhan (Rupiah)
  - **Rata-rata Konsumsi**: km/liter (overall dan per kendaraan aktif)
  - **Total Jarak Tempuh**: Kilometer yang telah ditempuh
  - **Jumlah Pengisian**: Total transaksi pengisian BBM
  - **Pengeluaran Rata-rata per Pengisian**: Rupiah
  - **Konsumsi Terbaik**: Nilai km/liter tertinggi yang pernah dicapai
  - **Konsumsi Terburuk**: Nilai km/liter terendah (untuk awareness)

#### 4.5.2 Visualisasi Grafis (Chart.js)
- **Grafik Tren Konsumsi** (Line Chart)
  - **X-axis**: Waktu (per bulan atau per minggu, tergantung filter)
  - **Y-axis**: Konsumsi dalam km/liter
  - **Multi-line**: Jika ada multiple kendaraan, tampilkan line untuk setiap kendaraan dengan warna berbeda
  - **Legend**: Nama kendaraan dengan color indicator
  - **Tooltip**: Detail data saat hover (tanggal, km/liter, nama kendaraan)
  
- **Grafik Pengeluaran** (Bar Chart)
  - **X-axis**: Waktu (per bulan)
  - **Y-axis**: Total pengeluaran dalam Rupiah
  - **Stacked/Grouped Bar**: Jika multiple kendaraan, bisa pilih mode stacked atau grouped
  - **Tooltip**: Breakdown pengeluaran per kendaraan dan total
  - **Color coding**: Konsisten dengan color kendaraan di line chart

- **Grafik Perbandingan Kendaraan** (Horizontal Bar Chart / Comparison)
  - Membandingkan rata-rata konsumsi antar kendaraan
  - Membandingkan total pengeluaran per kendaraan
  - Visual ranking untuk "kendaraan paling efisien"

#### 4.5.3 Interaksi & Filter Grafik
- **Filter Rentang Waktu**:
  - 3 bulan terakhir
  - 6 bulan terakhir
  - 1 tahun terakhir
  - Semua data (All time)
  - Custom date range (date picker)
  
- **Filter Kendaraan**:
  - **Tampilkan Semua**: Multi-line chart untuk semua kendaraan dalam satu grafik
  - **Per Kendaraan**: Dropdown selector untuk filter grafik ke satu kendaraan saja
  - Toggle on/off per kendaraan di legend (Chart.js native feature)

- **Responsivitas**:
  - Chart otomatis resize sesuai ukuran layar
  - Pada mobile: grafik tetap interaktif dengan touch gesture
  - Axis label tetap readable di layar kecil

### 4.6 Manajemen Data (Priority: MEDIUM)

- Export data ke format CSV
- Import data dari file CSV
- Reset/hapus semua data

---

## 5. User Experience

### 5.1 Entry Points & First-time User Flow

1. Pengguna membuka aplikasi di browser
2. Jika belum ada data, tampilkan onboarding sederhana
3. Pengguna diminta menambahkan kendaraan pertama
4. Setelah kendaraan ditambahkan, arahkan ke form pengisian BBM pertama
5. Dashboard menampilkan data setelah minimal 2 pengisian

### 5.2 Core Experience

- **Quick Add**: Form pengisian BBM yang sederhana dan cepat, maksimal 4 field wajib
- **Instant Feedback**: Konsumsi km/liter langsung dihitung dan ditampilkan setelah input
- **Clear Overview**: Dashboard yang informatif dengan angka-angka penting terlihat jelas

### 5.3 Advanced Features & Edge Cases

- Handling jika odometer diinput lebih kecil dari sebelumnya (warning)
- Handling jika tidak ada pengisian sebelumnya (tidak bisa hitung konsumsi)
- Validasi input angka (tidak boleh negatif, format yang benar)
- Konfirmasi sebelum menghapus data

### 5.4 UI/UX Highlights

- **Timeline View**: Riwayat pengisian ditampilkan dalam format timeline vertikal yang intuitif
- Responsive design (mobile-first dengan Bootstrap)
- Warna dan ikon yang intuitif untuk status konsumsi (hijau = efisien, merah = boros)
- Loading state yang jelas
- Empty state dengan panduan untuk pengguna baru
- Navigasi sederhana: Dashboard, Riwayat, Tambah, Statistik, Pengaturan

---

## 6. Narrative

Bayangkan Andi, seorang karyawan yang setiap hari mengendarai motornya ke kantor. Selama ini ia tidak pernah mencatat berapa liter bensin yang ia beli atau berapa kilometer yang ia tempuh. Suatu hari ia merasa motornya semakin boros, tapi tidak punya data untuk membuktikannya.

Dengan **Konsumsi BBM Kendaraan**, Andi cukup membuka browser di HP-nya setiap kali mengisi bensin. Ia input jumlah liter, harga, dan angka odometer. Dalam hitungan detik, aplikasi langsung menampilkan bahwa motornya melakukan 45 km/liter — lebih rendah dari rata-rata 52 km/liter bulan lalu. Andi jadi tahu bahwa memang ada yang perlu dicek dari motornya.

Setelah service, Andi kembali mencatat dan melihat konsumsinya naik ke 50 km/liter. Data jujur yang membantunya mengambil keputusan.

---

## 7. Success Metrics

### 7.1 User-centric Metrics

- **Adoption**: Minimal 10 catatan pengisian per pengguna aktif per bulan
- **Retention**: Pengguna kembali menggunakan aplikasi minimal 4x per bulan
- **Completion Rate**: 90% pengguna yang mulai input berhasil menyimpan data

### 7.2 Business Metrics

- **User Satisfaction**: Rating/feedback positif dari pengguna
- **Feature Usage**: 
  - Persentase pengguna yang menggunakan fitur statistik minimal 1x per minggu
  - Persentase pengguna multi-vehicle yang menggunakan fitur comparison
  - Frekuensi interaksi dengan filter grafik (time range, vehicle filter)

### 7.3 Technical Metrics

- **Performance**: Halaman load dalam < 2 detik
- **Offline Reliability**: Aplikasi berfungsi 100% tanpa koneksi internet
- **Data Integrity**: 0% data loss dari localStorage

---

## 8. Technical Considerations

### 8.1 Integration Points

- Tidak ada integrasi eksternal untuk versi 1.0
- Potensi integrasi masa depan: API harga BBM, Google Sheets export

### 8.2 Data Storage & Privacy

- Data disimpan di **localStorage** browser pengguna
- Tidak ada data yang dikirim ke server
- Pengguna memiliki kontrol penuh atas datanya (export/delete)
- Struktur data menggunakan JSON

### 8.3 Scalability & Performance Targets

- Target: Mampu menyimpan hingga 1000 catatan pengisian per kendaraan
- Maksimal 10 kendaraan per aplikasi
- Ukuran total aplikasi < 500KB (tanpa cache)

### 8.4 Potential Technical Challenges

- **localStorage limit**: Browser membatasi ~5-10MB per origin
- **Data migration**: Jika struktur data berubah di versi mendatang
- **Browser compatibility**: Memastikan kompatibilitas dengan browser lama
- **Data backup**: Pengguna bisa kehilangan data jika clear browser data
- **Chart.js Performance**: Rendering grafik dengan dataset besar (>500 data points) bisa lambat di low-end devices
  - Solusi: Implementasi data aggregation (group by month/week)
  - Lazy loading untuk chart components
- **Multi-vehicle Color Management**: Konsistensi warna kendaraan di semua chart
  - Implementasi color palette generator otomatis
  - Persist color mapping di localStorage

### 8.5 UI/UX Design Requirements

#### 8.5.1 Design Reference Needed

Belum ada mockup/wireframe, perlu research dan referensi design untuk:
- Layout dashboard dengan chart positioning optimal
- Mobile-first responsive breakpoints untuk chart sizing
- Color scheme dan palette untuk multi-vehicle comparison
- Filter UI component placement (dropdown, toggle, date picker)

#### 8.5.2 Design References & Inspirations

**Dribbble - Dashboard & Analytics Design**
- Search: "fuel consumption dashboard" → https://dribbble.com/search/fuel-consumption-dashboard
- Search: "vehicle analytics dashboard" → https://dribbble.com/search/vehicle-analytics
- Search: "expense tracker chart" → https://dribbble.com/search/expense-tracker
- Search: "multi-line chart design" → https://dribbble.com/search/multi-line-chart
- Recommended Shots:
  - Car maintenance tracker dashboards (untuk layout inspiration)
  - Finance/expense tracking apps (untuk card design & chart placement)
  - Statistics dashboard dengan multiple charts

**Behance - Full Project Case Studies**
- Search: "vehicle tracking dashboard" → https://www.behance.net/search/projects?search=vehicle+tracking+dashboard
- Search: "fuel management app" → https://www.behance.net/search/projects?search=fuel+management+app
- Search: "analytics dashboard mobile" → https://www.behance.net/search/projects?search=analytics+dashboard+mobile
- Focus: Perhatikan flow dari overview → detail charts → filter interaction

**CodePen - Interactive Chart Examples**
- Chart.js multi-dataset examples: https://codepen.io/search/pens?q=chart.js+multiple+datasets
- Responsive chart layout: https://codepen.io/search/pens?q=responsive+chart+dashboard
- Filter interaction patterns: https://codepen.io/search/pens?q=chart+filter
- Keywords untuk search:
  - "chart.js line chart comparison"
  - "bootstrap dashboard with charts"
  - "responsive chart layout"

**Aplikasi Sejenis (Competitor/Inspiration Analysis)**
- **Fuelio** (Android): Fuel tracking app dengan statistik lengkap
  - URL: https://www.fuelio.net/
  - Perhatikan: Timeline view, chart layout, multi-vehicle color coding
- **Drivvo** (Web/Mobile): Vehicle expense tracker
  - URL: https://www.drivvo.com/
  - Perhatikan: Dashboard card design, filter UI, grafik perbandingan
- **Simply Auto** (Mobile): Car maintenance & fuel tracker
  - Perhatikan: Timeline visual, statistik summary cards
- **Fuelly** (Web): Community-based fuel tracking
  - URL: https://www.fuelly.com/
  - Perhatikan: Chart comparison antar kendaraan, data visualization

**Design Pattern Libraries**
- Bootstrap Dashboard Examples:
  - StartBootstrap "SB Admin 2": https://startbootstrap.com/theme/sb-admin-2 (Free dashboard template)
  - AdminLTE: https://adminlte.io/themes/v3/ (Dashboard dengan chart integration)
- Chart.js Official Samples: https://www.chartjs.org/docs/latest/samples/

**Color Palette References**
- Coolors.co Generator: https://coolors.co/ (Generate palette untuk 10 kendaraan)
- Adobe Color Accessibility: https://color.adobe.com/create/color-accessibility (Check contrast untuk color-blind friendly)
- Chart.js Default Colors: https://www.chartjs.org/docs/latest/general/colors.html
- Rekomendasi Palette:
  - Vibrant but accessible: Tailwind CSS color scale (500-600 range)
  - Material Design Colors: https://materialui.co/colors
  
#### 8.5.3 Chart.js Configuration Standards

- Responsive: `maintainAspectRatio: true`
- Tooltip format: Rupiah currency, km/liter dengan 2 decimal
- Legend position: `top` untuk desktop, `bottom` untuk mobile
- Animation: Smooth transition saat filter berubah

#### 8.5.4 Accessibility Considerations

- High contrast colors untuk color-blind friendly
- Alt text untuk chart (untuk screen readers)
- Keyboard navigation untuk filter controls

---

## 9. Milestones & Sequencing

### 9.1 Project Estimate

- **Size**: Small-Medium
- **Time Estimate**: 2-3 minggu untuk MVP

### 9.2 Team Size & Composition

- **1 Developer**: Full-stack (HTML/CSS/JS)
- **Optional**: 1 Designer untuk UI polish

### 9.3 Suggested Phases

#### **Phase 1: Foundation** (Minggu 1)
- Setup project structure
- Implementasi UI dasar dengan Bootstrap
- Manajemen kendaraan (CRUD)
- Pencatatan pengisian BBM (CRUD)
- Penyimpanan data di localStorage

#### **Phase 2: Core Features** (Minggu 2)
- Perhitungan konsumsi km/liter
- Dashboard dengan ringkasan
- Riwayat pengisian dengan filter

#### **Phase 3: Enhancement** (Minggu 3)
- **Research & Design**:
  - **Riset Visual References** (lihat detail di section 8.5.2):
    - Browse Dribbble untuk fuel consumption & vehicle analytics dashboard
    - Browse Behance untuk full case study (perhatikan user flow)
    - Analisis kompetitor: Fuelio, Drivvo, Fuelly (screenshot key features)
    - Kumpulkan 5-10 inspirasi design terbaik
  - **Design Decision**:
    - Tentukan layout dashboard: card placement, chart sizing, spacing
    - Pilih color palette dari Coolors.co (10 warna distinct, test di Adobe Color Accessibility)
    - Wireframe low-fidelity untuk desktop & mobile view
    - Validate design dengan user persona (section 3.2)
- **Grafik dan Statistik**:
  - Setup Chart.js library (CDN atau npm)
  - Implementasi Line Chart untuk tren konsumsi (reference: Chart.js samples)
  - Implementasi Bar Chart untuk pengeluaran
  - Implementasi Horizontal Bar Chart untuk comparison
  - Multi-vehicle line support dengan legend toggle
  - Filter rentang waktu (3M, 6M, 1Y, All, Custom)
  - Filter per kendaraan (Semua / Individual)
- **Data Management**:
  - Export/Import CSV
- **Polish UI/UX**:
  - Responsive chart behavior (test di Chrome DevTools device mode)
  - Loading states untuk chart rendering (skeleton loader)
  - Empty state untuk chart tanpa data (ilustrasi + CTA)
- **Testing dan Bug Fixing**:
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Mobile device testing (touch interaction, pinch-zoom disabled)
  - Performance testing dengan large dataset (simulate 1000 entries)

---

## 10. User Stories

### 10.1 Menambahkan Kendaraan Baru

- **ID**: BBM-001
- **Description**: Sebagai pengguna, saya ingin menambahkan kendaraan baru agar saya dapat mencatat konsumsi BBM untuk kendaraan tersebut.
- **Acceptance Criteria**:
  - Form input dengan field: nama kendaraan, jenis (motor/mobil), tahun, plat nomor
  - Validasi: nama kendaraan wajib diisi
  - Data tersimpan di localStorage
  - Kendaraan baru muncul di daftar kendaraan

### 10.2 Mencatat Pengisian BBM

- **ID**: BBM-002
- **Description**: Sebagai pengguna, saya ingin mencatat setiap kali mengisi BBM agar saya memiliki riwayat lengkap.
- **Acceptance Criteria**:
  - Form dengan field: tanggal, liter, harga total, odometer
  - Default tanggal adalah hari ini
  - Harga per liter dihitung otomatis
  - Data tersimpan dan muncul di riwayat

### 10.3 Melihat Konsumsi BBM

- **ID**: BBM-003
- **Description**: Sebagai pengguna, saya ingin melihat berapa km/liter konsumsi kendaraan saya agar saya tahu apakah kendaraan masih efisien.
- **Acceptance Criteria**:
  - Konsumsi dihitung dari (selisih odometer / liter BBM)
  - Ditampilkan per pengisian di riwayat
  - Rata-rata keseluruhan ditampilkan di dashboard
  - Handling kasus pertama kali (tidak bisa dihitung)

### 10.4 Melihat Dashboard Ringkasan

- **ID**: BBM-004
- **Description**: Sebagai pengguna, saya ingin melihat ringkasan statistik di dashboard agar saya mendapat gambaran cepat tentang konsumsi BBM.
- **Acceptance Criteria**:
  - Menampilkan: total pengeluaran, rata-rata km/liter, total jarak, jumlah pengisian
  - Data ter-update otomatis setelah input baru
  - Empty state jika belum ada data

### 10.5 Melihat Riwayat Pengisian

- **ID**: BBM-005
- **Description**: Sebagai pengguna, saya ingin melihat daftar semua pengisian BBM yang pernah saya catat.
- **Acceptance Criteria**:
  - List pengisian diurutkan dari terbaru
  - Setiap item menampilkan: tanggal, liter, harga, konsumsi
  - Bisa filter berdasarkan kendaraan
  - Bisa edit dan hapus catatan

### 10.6 Export Data ke CSV

- **ID**: BBM-006
- **Description**: Sebagai pengguna, saya ingin mengexport data saya ke CSV agar saya memiliki backup atau bisa analisis di Excel.
- **Acceptance Criteria**:
  - Tombol export di halaman pengaturan
  - File CSV terdownload dengan format yang benar
  - Semua data kendaraan dan pengisian terinclude

### 10.7 Import Data dari CSV

- **ID**: BBM-007
- **Description**: Sebagai pengguna, saya ingin mengimport data dari CSV agar saya bisa restore data atau migrasi dari perangkat lain.
- **Acceptance Criteria**:
  - Upload file CSV
  - Validasi format file
  - Preview data sebelum import
  - Konfirmasi apakah merge atau replace

### 10.8 Melihat Grafik Statistik

- **ID**: BBM-008
- **Description**: Sebagai pengguna, saya ingin melihat grafik tren konsumsi BBM agar saya bisa memahami pola penggunaan dari waktu ke waktu.
- **Acceptance Criteria**:
  - Grafik garis (line chart) untuk tren konsumsi per bulan menggunakan Chart.js
  - Grafik batang (bar chart) untuk pengeluaran per bulan
  - Grafik perbandingan horizontal (horizontal bar chart) untuk membandingkan rata-rata konsumsi antar kendaraan
  - Bisa pilih rentang waktu: 3 bulan, 6 bulan, 1 tahun, semua, atau custom date range
  - **Filter multi-kendaraan**:
    - Opsi "Tampilkan Semua" untuk menampilkan semua kendaraan dalam satu chart (multi-line)
    - Opsi "Per Kendaraan" dengan dropdown untuk filter satu kendaraan saja
    - Bisa toggle on/off kendaraan tertentu via legend chart
  - Setiap kendaraan memiliki warna konsisten di semua grafik
  - Tooltip interaktif menampilkan detail lengkap saat hover
  - Grafik responsif dan tetap interaktif di mobile (touch-enabled)
  - Chart.js configuration optimal untuk performa (lazy loading jika data banyak)

### 10.9 Melihat Timeline Riwayat Pengisian

- **ID**: BBM-009
- **Description**: Sebagai pengguna, saya ingin melihat riwayat pengisian BBM dalam tampilan timeline visual agar lebih mudah memahami kronologi pengisian.
- **Acceptance Criteria**:
  - Tampilan timeline vertikal dengan node/titik untuk setiap pengisian
  - Setiap node menampilkan: tanggal, liter, harga, km/liter
  - Indikator warna berdasarkan efisiensi (hijau = baik, kuning = normal, merah = boros)
  - Dapat scroll untuk melihat riwayat lebih lama
  - Aksi cepat edit/hapus tersedia di setiap node

### 10.10 Membandingkan Kendaraan (Multi-Vehicle Comparison)

- **ID**: BBM-010
- **Description**: Sebagai pengguna dengan multiple kendaraan, saya ingin membandingkan konsumsi dan pengeluaran antar kendaraan agar saya tahu kendaraan mana yang paling efisien.
- **Acceptance Criteria**:
  - Grafik menampilkan semua kendaraan secara bersamaan dengan multi-line (default view)
  - Setiap kendaraan memiliki warna unik dan konsisten di semua chart
  - Filter "Tampilkan Semua" vs "Per Kendaraan" (dropdown selector)
  - Bisa toggle on/off kendaraan tertentu dengan klik legend
  - Grafik perbandingan horizontal bar menunjukkan ranking efisiensi kendaraan
  - Tooltip menampilkan nama kendaraan saat hover di setiap line
  - Warna otomatis ter-assign saat kendaraan baru ditambahkan dan tersimpan di localStorage
  - Handling edge case: jika hanya 1 kendaraan, filter multi-vehicle tidak ditampilkan

---

## Appendix

### A. Tech Stack

| Layer | Technology |
|-------|------------|
| Structure | HTML5 Semantic |
| Styling | Bootstrap CSS 5.x |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | localStorage |
| Charts | Chart.js (library ringan) |
| Build Tool | Vite.js 5.x |

### B. Data Schema (localStorage)

```json
{
  "vehicles": [
    {
      "id": "uuid",
      "name": "Honda Beat",
      "type": "motor",
      "year": 2020,
      "plateNumber": "B 1234 XYZ",
      "color": "#FF6384",
      "createdAt": "2024-01-01T00:00:00Z"
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
      "fuelType": "Pertalite",
      "notes": "",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "settings": {
    "colorPalette": ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#C9CBCF", "#4BC0C0", "#FF6384"]
  }
}
```

### C. Design Research Quick Links

**Untuk memulai riset visual (Phase 3 - Research & Design), gunakan checklist ini:**

#### 🎨 Visual Inspiration Platforms
- [ ] Dribbble: [Fuel Consumption Dashboard](https://dribbble.com/search/fuel-consumption-dashboard)
- [ ] Dribbble: [Vehicle Analytics](https://dribbble.com/search/vehicle-analytics)
- [ ] Dribbble: [Expense Tracker Chart](https://dribbble.com/search/expense-tracker)
- [ ] Behance: [Vehicle Tracking Dashboard](https://www.behance.net/search/projects?search=vehicle+tracking+dashboard)
- [ ] Behance: [Fuel Management App](https://www.behance.net/search/projects?search=fuel+management+app)

#### 🔍 Competitor Analysis
- [ ] Fuelio: https://www.fuelio.net/ (Timeline, chart layout, color coding)
- [ ] Drivvo: https://www.drivvo.com/ (Dashboard cards, filter UI)
- [ ] Fuelly: https://www.fuelly.com/ (Multi-vehicle comparison)

#### 💻 Code & Implementation
- [ ] Chart.js Samples: https://www.chartjs.org/docs/latest/samples/
- [ ] CodePen: [Chart.js Multiple Datasets](https://codepen.io/search/pens?q=chart.js+multiple+datasets)
- [ ] StartBootstrap SB Admin 2: https://startbootstrap.com/theme/sb-admin-2
- [ ] AdminLTE: https://adminlte.io/themes/v3/

#### 🎨 Color Palette Tools
- [ ] Coolors.co: https://coolors.co/ (Generate 10 distinct colors)
- [ ] Adobe Color Accessibility: https://color.adobe.com/create/color-accessibility (Validate contrast)
- [ ] Material Design Colors: https://materialui.co/colors

#### 📋 Design Decision Checklist
- [ ] Kumpulkan 5-10 design inspirations
- [ ] Screenshot key features dari competitor apps
- [ ] Buat wireframe low-fidelity (desktop + mobile)
- [ ] Tentukan final color palette (10 warna)
- [ ] Validate dengan user persona

---

*Document prepared by: AI Product Manager*
*Status: Draft - Pending Review*
```
