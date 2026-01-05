---
goal: Define complete UI layout specification for Riwayat (History) page
version: 1.0
date_created: 2025-12-30
last_updated: 2025-12-30
owner: Front-end Team
status: 'Planned'
tags: [design, layout, ui, history, timeline, riwayat]
---

# Riwayat Page Layout Specification

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Dokumen ini mendefinisikan layout untuk halaman **Riwayat Pengisian BBM (riwayat.html)** - menampilkan timeline lengkap semua catatan pengisian.

---

## 1. Requirements & Constraints

### Functional Requirements

- **REQ-RIW-001**: Halaman HARUS menampilkan semua riwayat pengisian dalam format timeline
- **REQ-RIW-002**: Timeline HARUS diurutkan dari terbaru ke terlama (descending)
- **REQ-RIW-003**: Setiap item HARUS menampilkan: tanggal, kendaraan, liter, harga, km/L, efisiensi
- **REQ-RIW-004**: HARUS ada filter berdasarkan kendaraan
- **REQ-RIW-005**: HARUS ada filter berdasarkan rentang waktu
- **REQ-RIW-006**: Setiap item HARUS memiliki quick action: Edit, Hapus
- **REQ-RIW-007**: HARUS mendukung infinite scroll atau pagination

### Display Constraints

- **CON-RIW-001**: Maximum 20 items per load (infinite scroll)
- **CON-RIW-002**: Loading indicator saat fetch data berikutnya
- **CON-RIW-003**: "End of list" indicator saat semua data sudah ditampilkan

### Design Guidelines

- **GUD-RIW-001**: Gunakan timeline visual dengan marker warna efisiensi
- **GUD-RIW-002**: Swipe gesture untuk quick actions di mobile
- **GUD-RIW-003**: Konfirmasi dialog sebelum hapus data

---

## 2. Page Structure Overview

```
┌──────────────────────────────────────────────────────────┐
│                    NAVBAR (Fixed Top)                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              PAGE HEADER                          │   │
│  │  Riwayat Pengisian                               │   │
│  │  "123 catatan pengisian"                         │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              FILTER BAR (Sticky)                  │   │
│  │  [Semua Kendaraan ▼]    [3 Bulan Terakhir ▼]     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              TIMELINE LIST                        │   │
│  │                                                   │   │
│  │  ●───┬────────────────────────────────────────   │   │
│  │  │   │  28 Des 2025 • Honda Beat                 │   │
│  │  │   │  4.5 L • Rp 52.000 • 48.5 km/L [Efisien] │   │
│  │  │   │                          [Edit] [Hapus]   │   │
│  │  ●───┼────────────────────────────────────────   │   │
│  │  │   │  25 Des 2025 • Honda Beat                 │   │
│  │  │   │  4.2 L • Rp 48.000 • 45.2 km/L [Normal]  │   │
│  │  │   │                          [Edit] [Hapus]   │   │
│  │  ●───┼────────────────────────────────────────   │   │
│  │  │   │  ... (more items)                         │   │
│  │  │   │                                           │   │
│  │  ●───┴────────────────────────────────────────   │   │
│  │                                                   │   │
│  │         [Loading more...]                        │   │
│  │                 OR                               │   │
│  │      "Anda sudah melihat semua data"            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │               FLOATING ACTION BUTTON              │   │
│  │                      [+]                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Component Specifications

### 3.1 Page Header

**Position**: Below navbar, static
**Content**: Title + summary count

```
┌──────────────────────────────────────────────────────────┐
│  Riwayat Pengisian                                       │
│  ─────────────────                                       │
│  123 catatan pengisian                                   │
│       ↑ Muted text, updates based on filter             │
└──────────────────────────────────────────────────────────┘
```

---

### 3.2 Filter Bar

**Position**: Below header, sticky on scroll
**Background**: White with bottom shadow when sticky

```
Desktop (≥768px):
┌──────────────────────────────────────────────────────────┐
│  [Semua Kendaraan    ▼]      [3 Bulan Terakhir    ▼]    │
│         ↑ Dropdown                  ↑ Dropdown           │
└──────────────────────────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────────────────────────────────────────┐
│  [Kendaraan ▼]         [Waktu ▼]                        │
│   Compact labels                                         │
└──────────────────────────────────────────────────────────┘
```

**Vehicle Filter Options**:
- Semua Kendaraan (default)
- [Dynamic list from data]

**Time Filter Options**:

| Value | Label |
|-------|-------|
| `1m` | 1 Bulan Terakhir |
| `3m` | 3 Bulan Terakhir (default) |
| `6m` | 6 Bulan Terakhir |
| `1y` | 1 Tahun Terakhir |
| `all` | Semua Data |

---

### 3.3 Timeline List

**Container**: Full width, scrollable
**Initial Load**: 20 items
**Infinite Scroll**: Load 20 more when near bottom

**Timeline Item Structure**:

```
┌──────────────────────────────────────────────────────────┐
│  ●  │  Header Row                                        │
│  │  │  ┌────────────────────────────────────────────┐   │
│  │  │  │ 28 Des 2025          Honda Beat            │   │
│  │  │  │  ↑ Date               ↑ Vehicle badge      │   │
│  │  │  └────────────────────────────────────────────┘   │
│  │  │                                                    │
│  │  │  Details Row                                       │
│  │  │  ┌────────────────────────────────────────────┐   │
│  │  │  │ 4.5 L • Rp 52.000 • 48.5 km/L              │   │
│  │  │  │   ↑       ↑           ↑                    │   │
│  │  │  │ Liters  Price    Consumption               │   │
│  │  │  └────────────────────────────────────────────┘   │
│  │  │                                                    │
│  │  │  Footer Row                                        │
│  │  │  ┌────────────────────────────────────────────┐   │
│  │  │  │ [Efisien ✓]                 [Edit] [Hapus] │   │
│  │  │  │     ↑ Badge                     ↑ Actions  │   │
│  │  │  └────────────────────────────────────────────┘   │
│  │  │                                                    │
└──────────────────────────────────────────────────────────┘
```

**Timeline Marker Colors**:

| Efficiency | Color | CSS Variable |
|------------|-------|--------------|
| Good (≥45 km/L motor, ≥15 km/L mobil) | Green | `--color-efficiency-good` |
| Normal | Yellow | `--color-efficiency-normal` |
| Poor | Red | `--color-efficiency-poor` |

**Action Buttons**:

| Action | Icon | Behavior |
|--------|------|----------|
| Edit | `bi-pencil` | Navigate to `tambah.html?edit={id}` |
| Hapus | `bi-trash` | Show confirmation dialog |

---

### 3.4 Infinite Scroll States

**Loading More**:
```
┌──────────────────────────────────────────────────────────┐
│                    [Spinner]                             │
│               Memuat data...                             │
└──────────────────────────────────────────────────────────┘
```

**End of Data**:
```
┌──────────────────────────────────────────────────────────┐
│              ─────── ● ───────                           │
│        Anda sudah melihat semua data                     │
└──────────────────────────────────────────────────────────┘
```

---

### 3.5 Empty State

**Trigger**: No fuel logs exist OR filter returns empty

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                   ┌──────────────┐                       │
│                   │   [Image]    │                       │
│                   │  Empty List  │                       │
│                   └──────────────┘                       │
│                                                          │
│              Belum Ada Riwayat Pengisian                 │
│                                                          │
│     Mulai catat pengisian BBM pertama Anda              │
│                                                          │
│               [+ Tambah Pengisian]                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### 3.6 Delete Confirmation Dialog

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │                 Hapus Catatan?                      │ │
│  │                                                     │ │
│  │  Catatan pengisian pada 28 Des 2025 akan dihapus   │ │
│  │  permanen. Tindakan ini tidak dapat dibatalkan.    │ │
│  │                                                     │ │
│  │            [Batal]         [Hapus]                  │ │
│  │              ↑               ↑                      │ │
│  │          Secondary       Danger button              │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Responsive Behavior

| Element | Mobile (<768px) | Desktop (≥768px) |
|---------|-----------------|-------------------|
| Filter Bar | Stacked or compact labels | Inline dropdowns |
| Timeline Item | Full width, stacked | Full width, inline |
| Action Buttons | Icon only OR swipe | Text + icon |
| Vehicle Badge | Small badge | Normal badge |

---

## 5. Implementation Steps

### Phase 1: Structure

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `riwayat.html` with basic structure | | |
| TASK-002 | Add page header with count | | |
| TASK-003 | Add filter bar with dropdowns | | |
| TASK-004 | Create timeline container | | |

### Phase 2: Functionality

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Implement timeline item component | | |
| TASK-006 | Connect to FuelLogManager data | | |
| TASK-007 | Implement vehicle filter logic | | |
| TASK-008 | Implement time range filter logic | | |
| TASK-009 | Implement infinite scroll with IntersectionObserver | | |

### Phase 3: Actions & States

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-010 | Add edit navigation | | |
| TASK-011 | Add delete confirmation dialog | | |
| TASK-012 | Implement empty state | | |
| TASK-013 | Add loading/end states | | |

---

## 6. Files Affected

- **FILE-001**: `riwayat.html` - Page markup
- **FILE-002**: `src/components/timeline.js` - Timeline rendering
- **FILE-003**: `src/pages/riwayat.js` - Page logic
- **FILE-004**: `src/styles/main.css` - Timeline styles

---

## 7. Related Specifications

- [spec-design-visual-style.md](./spec-design-visual-style.md) - Efficiency colors, badges
- [spec-architecture-technical.md](./spec-architecture-technical.md) - FuelLogManager, QueryOptions
- [spec-ui-layout-dashboard.md](./spec-ui-layout-dashboard.md) - Shared Navbar, FAB
