---
goal: Define complete UI layout specification for Dashboard page
version: 1.0
date_created: 2025-12-30
last_updated: 2025-12-30
owner: Front-end Team
status: 'Planned'
tags: [design, layout, ui, dashboard, wireframe]
---

# Dashboard Page Layout Specification

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Dokumen ini mendefinisikan layout, struktur, dan penempatan komponen untuk halaman **Dashboard (index.html)** - halaman utama aplikasi Konsumsi BBM Kendaraan.

---

## 1. Requirements & Constraints

### Functional Requirements

- **REQ-LAY-001**: Dashboard HARUS menampilkan 4 kartu statistik utama di bagian atas
- **REQ-LAY-002**: Dashboard HARUS menampilkan 1 chart utama (Line Chart tren konsumsi)
- **REQ-LAY-003**: Dashboard HARUS menampilkan preview timeline 5 pengisian terakhir
- **REQ-LAY-004**: Dashboard HARUS menyediakan navigasi ke semua halaman lain
- **REQ-LAY-005**: Dashboard HARUS menampilkan empty state jika belum ada data
- **REQ-LAY-006**: Dashboard HARUS menampilkan onboarding jika belum ada kendaraan

### Display Constraints

- **CON-LAY-001**: Layout HARUS responsive (mobile-first)
- **CON-LAY-002**: Navbar HARUS fixed di top saat scroll
- **CON-LAY-003**: Konten utama HARUS memiliki padding dari navbar (min 70px top)
- **CON-LAY-004**: Maximum width container: 1140px (centered)
- **CON-LAY-005**: Minimum touch target: 44px x 44px

### Design Guidelines

- **GUD-LAY-001**: Gunakan 12-column Bootstrap grid system
- **GUD-LAY-002**: Card spacing: 16px (mobile), 24px (desktop)
- **GUD-LAY-003**: Section spacing: 24px (mobile), 32px (desktop)
- **GUD-LAY-004**: Warna mengacu pada `spec-design-visual-style.md`

---

## 2. Page Structure Overview

```
┌──────────────────────────────────────────────────────────┐
│                    NAVBAR (Fixed Top)                     │
│  [Logo/Brand]              [Dashboard][Riwayat][+][Stats] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              SECTION: Stats Cards                 │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │   │
│  │  │ Card 1 │ │ Card 2 │ │ Card 3 │ │ Card 4 │    │   │
│  │  │  Total │ │  Avg   │ │ Jarak  │ │ Best   │    │   │
│  │  │Expense │ │km/liter│ │Tempuh  │ │Consumpt│    │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              SECTION: Main Chart                  │   │
│  │  [Chart Title: Tren Konsumsi]    [Filter: 3M ▼]  │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │                                            │  │   │
│  │  │         LINE CHART (Chart.js)              │  │   │
│  │  │         km/liter over time                 │  │   │
│  │  │                                            │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              SECTION: Recent Activity             │   │
│  │  [Section Title: Pengisian Terakhir] [Lihat Semua→]│   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │  Timeline Item 1 (Latest)                  │  │   │
│  │  │  Timeline Item 2                           │  │   │
│  │  │  Timeline Item 3                           │  │   │
│  │  │  Timeline Item 4                           │  │   │
│  │  │  Timeline Item 5                           │  │   │
│  │  └────────────────────────────────────────────┘  │   │
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

### 3.1 Navbar Component

**Position**: Fixed top, full width
**Height**: 56px (mobile), 64px (desktop)
**Background**: `var(--navbar-bg)` (#024520)

```
┌──────────────────────────────────────────────────────────┐
│ [≡]  BBM Tracker          [Home][History][+][Stats][⚙]  │
└──────────────────────────────────────────────────────────┘
     ↑                       ↑
     │                       └── Navigation items (desktop)
     └── Hamburger menu (mobile only)
```

**Structure (Desktop - ≥992px)**:
```
| Left Zone (Brand)      | Right Zone (Navigation)              |
|------------------------|--------------------------------------|
| Logo + "BBM Tracker"   | Dashboard | Riwayat | + | Statistik | ⚙ |
```

**Structure (Mobile - <992px)**:
```
| Left Zone      | Center Zone    | Right Zone     |
|----------------|----------------|----------------|
| [≡] Hamburger  | "BBM Tracker"  | [+] Quick Add  |
```

**Navigation Items**:

| Icon | Label | Link | Active State |
|------|-------|------|--------------|
| `bi-speedometer2` | Dashboard | `index.html` | Current page |
| `bi-clock-history` | Riwayat | `riwayat.html` | - |
| `bi-plus-circle-fill` | Tambah | `tambah.html` | Accent color |
| `bi-bar-chart-line` | Statistik | `statistik.html` | - |
| `bi-gear` | Pengaturan | `pengaturan.html` | - |

---

### 3.2 Stats Cards Section

**Container**: Full width, max-width 1140px, centered
**Grid**: 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
**Card Gap**: 16px (mobile), 24px (desktop)

```
Desktop (≥992px):
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Card 1 │ │ Card 2 │ │ Card 3 │ │ Card 4 │
│  25%   │ │  25%   │ │  25%   │ │  25%   │
└────────┘ └────────┘ └────────┘ └────────┘

Tablet (768px - 991px):
┌────────────────┐ ┌────────────────┐
│    Card 1      │ │    Card 2      │
│      50%       │ │      50%       │
└────────────────┘ └────────────────┘
┌────────────────┐ ┌────────────────┐
│    Card 3      │ │    Card 4      │
│      50%       │ │      50%       │
└────────────────┘ └────────────────┘

Mobile (<768px):
┌────────────────────────────────┐
│           Card 1               │
│            100%                │
└────────────────────────────────┘
┌────────────────────────────────┐
│           Card 2               │
└────────────────────────────────┘
┌────────────────────────────────┐
│           Card 3               │
└────────────────────────────────┘
┌────────────────────────────────┐
│           Card 4               │
└────────────────────────────────┘
```

**Card Content Structure**:

```
┌─────────────────────────────────┐
│ [Icon]  Card Title              │  ← Muted text, 12px
│                                 │
│         Rp 450.000              │  ← Primary text, 24px, bold
│                                 │
│         ↑ 12% dari bulan lalu   │  ← Trend indicator, 12px
└─────────────────────────────────┘
```

**Card Data (4 Cards)**:

| Order | Title | Value Source | Icon | Accent |
|-------|-------|--------------|------|--------|
| 1 | Total Pengeluaran | `totalExpenseThisMonth` | `bi-wallet2` | Primary |
| 2 | Rata-rata Konsumsi | `averageConsumption` | `bi-speedometer` | Secondary |
| 3 | Total Jarak | `totalDistance` | `bi-signpost-2` | Secondary |
| 4 | Konsumsi Terbaik | `bestConsumption` | `bi-trophy` | Accent |

---

### 3.3 Main Chart Section

**Container**: Full width card with padding
**Chart Height**: 250px (mobile), 300px (tablet), 350px (desktop)
**Chart Type**: Line Chart (Chart.js)

```
┌──────────────────────────────────────────────────────────┐
│  Tren Konsumsi BBM                     [3M][6M][1Y][All] │
│  ─────────────────────                  ↑ Time filters   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 60 ─┬─────────────────────────────────────────     │ │
│  │     │              ●                               │ │
│  │ 50 ─┼─────────●───────●───────────●───────         │ │
│  │     │     ●                   ●       ●           │ │
│  │ 40 ─┼─●───────────────────────────────────         │ │
│  │     │                                              │ │
│  │ 30 ─┼──────────────────────────────────────────    │ │
│  │     └──┬──────┬──────┬──────┬──────┬──────┬──     │ │
│  │       Jan   Feb   Mar   Apr   May   Jun           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ● Honda Beat  ● Toyota Avanza  (Legend - clickable)    │
└──────────────────────────────────────────────────────────┘
```

**Filter Controls**:

| Position | Type | Options |
|----------|------|---------|
| Top-right of section | Button group | 3M, 6M, 1Y, All |

**Chart Configuration**:

- X-Axis: Time (months)
- Y-Axis: km/liter
- Multi-line: One line per vehicle
- Legend: Bottom (mobile), Top (desktop)
- Tooltip: Show date, vehicle name, value

---

### 3.4 Recent Activity Section

**Container**: Full width card
**Items**: Maximum 5 items (preview)
**Link**: "Lihat Semua" → `riwayat.html`

```
┌──────────────────────────────────────────────────────────┐
│  Pengisian Terakhir                      [Lihat Semua →] │
│  ─────────────────────                                   │
│                                                          │
│  ●───┬─────────────────────────────────────────────────  │
│  │   │  28 Des 2025 • Honda Beat                        │
│  │   │  4.5 L • Rp 52.000 • 48.5 km/L  [Efisien ✓]     │
│  │   │                                                  │
│  ●───┼──────────────────────────────────────────────────  │
│  │   │  25 Des 2025 • Honda Beat                        │
│  │   │  4.2 L • Rp 48.000 • 45.2 km/L  [Normal ─]      │
│  │   │                                                  │
│  ●───┼──────────────────────────────────────────────────  │
│  │   │  ...                                             │
│  ●───┴──────────────────────────────────────────────────  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Timeline Item Structure**:

```
┌─────────────────────────────────────────────────────────┐
│  ● │  [Date] • [Vehicle Name]                           │
│    │  [Liters] L • Rp [Price] • [km/L] km/L  [Badge]   │
└─────────────────────────────────────────────────────────┘
     ↑
     Timeline marker (color = efficiency)
     - Green (#04773B) = Good
     - Yellow (#FFCE56) = Normal  
     - Red (#FF6384) = Poor
```

---

### 3.5 Floating Action Button (FAB)

**Position**: Fixed, bottom-right
**Offset**: 24px from right, 24px from bottom
**Size**: 56px diameter
**Visibility**: Always visible (except on `tambah.html`)

```
                                    ┌────────┐
                                    │   +    │
                                    │ 56x56  │
                                    └────────┘
                                         ↑
                                    Circular button
                                    bg: var(--color-accent)
                                    icon: bi-plus-lg (white)
                                    shadow: var(--shadow-lg)
```

**Behavior**:
- Click → Navigate to `tambah.html`
- Hover → Scale up 1.05, darker shadow
- Mobile → Same position and size

---

## 4. Responsive Breakpoints

### Breakpoint Definitions

| Name | Range | Grid Columns |
|------|-------|--------------|
| Mobile | < 576px | 1-2 columns |
| Mobile Landscape | 576px - 767px | 2 columns |
| Tablet | 768px - 991px | 2 columns |
| Desktop | 992px - 1199px | 4 columns |
| Large Desktop | ≥ 1200px | 4 columns |

### Layout Changes per Breakpoint

| Element | Mobile (<768px) | Tablet (768-991px) | Desktop (≥992px) |
|---------|-----------------|--------------------|--------------------|
| Navbar | Hamburger menu | Hamburger menu | Full nav links |
| Stats Cards | 1 column | 2 columns | 4 columns |
| Chart Height | 250px | 300px | 350px |
| Timeline Items | Compact | Normal | Normal |
| FAB Position | Bottom-right | Bottom-right | Bottom-right |
| Section Padding | 16px | 20px | 24px |

---

## 5. Empty & Loading States

### 5.1 Empty State (No Data)

**Trigger**: `vehicles.length === 0` OR `fuelLogs.length === 0`

```
┌──────────────────────────────────────────────────────────┐
│                      NAVBAR                              │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                                                          │
│                    ┌──────────────┐                      │
│                    │   [Image]    │                      │
│                    │   Empty      │                      │
│                    │   Fuel Can   │                      │
│                    └──────────────┘                      │
│                                                          │
│              Belum Ada Data Pengisian                    │
│                                                          │
│     Mulai catat konsumsi BBM kendaraan Anda untuk       │
│     melihat statistik dan tren pengeluaran.             │
│                                                          │
│              [Tambah Kendaraan Pertama]                  │
│                    ↑ Primary button                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Loading State

**Skeleton Loaders**:

```
┌──────────────────────────────────────────────────────────┐
│  Stats Cards:                                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ ████   │ │ ████   │ │ ████   │ │ ████   │            │
│  │ ██████ │ │ ██████ │ │ ██████ │ │ ██████ │            │
│  │ ████   │ │ ████   │ │ ████   │ │ ████   │            │
│  └────────┘ └────────┘ └────────┘ └────────┘            │
│                    ↑ Animated pulse                     │
│                                                          │
│  Chart Area:                                             │
│  ┌────────────────────────────────────────────────┐     │
│  │ ████████████████████████████████████████████   │     │
│  │ ████████████████████████████████████████████   │     │
│  │ ████████████████████████████████████████████   │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Steps

### Phase 1: Page Structure

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `index.html` with basic HTML5 structure | | |
| TASK-002 | Add navbar component with responsive behavior | | |
| TASK-003 | Create stats cards grid container | | |
| TASK-004 | Add chart section container with canvas | | |
| TASK-005 | Create timeline preview section | | |
| TASK-006 | Add floating action button | | |

### Phase 2: Responsive Implementation

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Implement mobile navbar (hamburger) | | |
| TASK-008 | Add responsive grid for stats cards | | |
| TASK-009 | Configure chart responsive options | | |
| TASK-010 | Adjust timeline for mobile | | |

### Phase 3: States & Polish

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-011 | Implement empty state UI | | |
| TASK-012 | Add skeleton loaders for loading state | | |
| TASK-013 | Connect to data layer (dashboard.js) | | |
| TASK-014 | Final responsive testing | | |

---

## 7. Dependencies

- **DEP-001**: Bootstrap CSS 5.3.x - Grid system, utilities
- **DEP-002**: Bootstrap Icons 1.11.x - UI icons  
- **DEP-003**: Chart.js 4.x - Line chart rendering
- **DEP-004**: `spec-design-visual-style.md` - Color palette, CSS variables
- **DEP-005**: `spec-architecture-technical.md` - Data schema, modules

---

## 8. Files Affected

- **FILE-001**: `index.html` - Main dashboard page markup
- **FILE-002**: `src/styles/main.css` - Dashboard-specific styles
- **FILE-003**: `src/components/dashboard.js` - Dashboard logic
- **FILE-004**: `src/components/navbar.js` - Navigation component
- **FILE-005**: `src/main.js` - Entry point initialization

---

## 9. Testing Checklist

- **TEST-001**: Verify 4 stats cards display correctly on all breakpoints
- **TEST-002**: Verify chart renders and is responsive
- **TEST-003**: Verify timeline shows max 5 items with correct styling
- **TEST-004**: Verify FAB navigates to tambah.html
- **TEST-005**: Verify empty state shows when no data
- **TEST-006**: Verify loading skeleton displays during data fetch
- **TEST-007**: Verify navbar hamburger menu works on mobile
- **TEST-008**: Verify all touch targets are minimum 44px

---

## 10. Related Specifications

- [spec-design-visual-style.md](./spec-design-visual-style.md) - Color palette, typography, component styles
- [spec-architecture-technical.md](./spec-architecture-technical.md) - Technical architecture, data models
- [../prd.md](../prd.md) - Product requirements (Section 4.5, 5.1, 5.4)
