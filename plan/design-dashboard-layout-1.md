---
goal: Implementation plan for Dashboard page UI layout
version: 1.0
date_created: 2025-12-31
last_updated: 2025-12-31
owner: Front-end Team
status: 'Planned'
tags: [design, layout, ui, dashboard, implementation]
---

# Dashboard Page Implementation Plan

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Dokumen ini adalah **implementation plan** untuk membangun halaman Dashboard (`index.html`) berdasarkan spesifikasi di `spec/spec-ui-layout-dashboard.md`.

---

## 1. Requirements & Constraints

### From Specification

- **REQ-LAY-001**: Dashboard HARUS menampilkan 4 kartu statistik utama
- **REQ-LAY-002**: Dashboard HARUS menampilkan 1 chart utama (Line Chart)
- **REQ-LAY-003**: Dashboard HARUS menampilkan preview timeline 5 pengisian terakhir
- **REQ-LAY-004**: Dashboard HARUS menyediakan navigasi ke semua halaman lain
- **REQ-LAY-005**: Dashboard HARUS menampilkan empty state jika belum ada data
- **REQ-LAY-006**: Dashboard HARUS menampilkan onboarding jika belum ada kendaraan

### Technical Constraints

- **CON-001**: Menggunakan Bootstrap 5.3.x grid system
- **CON-002**: Menggunakan Chart.js 4.x untuk chart
- **CON-003**: Mobile-first responsive design
- **CON-004**: Warna sesuai `spec-design-visual-style.md`

### Guidelines

- **GUD-001**: Navbar fixed top, 56px mobile / 64px desktop
- **GUD-002**: Stats cards: 4-col desktop, 2-col tablet, 1-col mobile
- **GUD-003**: Chart height: 250px mobile, 300px tablet, 350px desktop
- **GUD-004**: FAB fixed bottom-right, 56px diameter

---

## 2. Implementation Steps

### Phase 1: Page Structure & Navbar

- **GOAL-001**: Create basic HTML structure with responsive navbar

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `index.html` with HTML5 boilerplate, meta tags, Bootstrap/Chart.js CDN links | | |
| TASK-002 | Create navbar component with brand logo, navigation links, active state for Dashboard | | |
| TASK-003 | Implement responsive navbar: hamburger menu for mobile (<992px), full links for desktop | | |
| TASK-004 | Add navbar CSS: fixed position, height, background color `--navbar-bg` | | |

### Phase 2: Stats Cards Section

- **GOAL-002**: Implement 4 statistics cards with responsive grid

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Create stats card HTML structure: icon, title, value, trend indicator | | |
| TASK-006 | Implement Bootstrap grid: `col-12 col-md-6 col-lg-3` for responsive layout | | |
| TASK-007 | Style cards: padding, border-radius, shadow, icon accent colors | | |
| TASK-008 | Connect cards to `DashboardStats` data: totalExpense, avgConsumption, totalDistance, bestConsumption | | |

### Phase 3: Main Chart Section

- **GOAL-003**: Implement Line Chart with time filter

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-009 | Create chart container card with title "Tren Konsumsi BBM" | | |
| TASK-010 | Add filter button group: 3M, 6M, 1Y, All (Bootstrap btn-group) | | |
| TASK-011 | Initialize Chart.js Line Chart with responsive config | | |
| TASK-012 | Connect chart to `Calculator.getConsumptionTrend()` data | | |
| TASK-013 | Implement filter click handler to update chart data and animate | | |

### Phase 4: Timeline Preview Section

- **GOAL-004**: Display last 5 fuel logs with link to Riwayat

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-014 | Create section header: "Pengisian Terakhir" with "Lihat Semua" link | | |
| TASK-015 | Create timeline item HTML: marker, date, vehicle, details, efficiency badge | | |
| TASK-016 | Style timeline: vertical line, colored markers based on efficiency | | |
| TASK-017 | Connect to `FuelLogManager.getAll()` with limit 5 | | |

### Phase 5: FAB & States

- **GOAL-005**: Implement FAB and empty/loading states

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-018 | Create FAB HTML: fixed position, circular, plus icon | | |
| TASK-019 | Style FAB: accent color, shadow, hover scale effect | | |
| TASK-020 | Create empty state HTML: illustration, message, CTA button | | |
| TASK-021 | Create skeleton loaders for cards and chart | | |
| TASK-022 | Implement conditional rendering: loading → empty/data states | | |

### Phase 6: Integration & Polish

- **GOAL-006**: Connect all components and final testing

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-023 | Create `src/pages/dashboard.js` entry point | | |
| TASK-024 | Import and initialize all data modules (StorageManager, Calculator, etc) | | |
| TASK-025 | Test responsive behavior across breakpoints | | |
| TASK-026 | Test empty state, loading state, data state transitions | | |
| TASK-027 | Validate accessibility: touch targets 44px, color contrast | | |

---

## 3. Alternatives

- **ALT-001**: Menggunakan CSS Grid sebagai pengganti Bootstrap grid - tidak dipilih karena Bootstrap sudah menjadi dependency utama
- **ALT-002**: Server-side rendering untuk SEO - tidak relevan karena ini adalah SPA dengan localStorage

---

## 4. Dependencies

- **DEP-001**: Bootstrap CSS 5.3.x - Grid system, utilities, components
- **DEP-002**: Bootstrap Icons 1.11.x - UI icons (speedometer2, wallet2, trophy, etc)
- **DEP-003**: Chart.js 4.x - Line chart rendering
- **DEP-004**: `spec-design-visual-style.md` - CSS variables, color palette
- **DEP-005**: `spec-architecture-technical.md` - Data modules (StorageManager, Calculator)

---

## 5. Files

| File | Type | Description |
|------|------|-------------|
| `index.html` | NEW | Dashboard page markup |
| `src/styles/main.css` | MODIFY | Add dashboard-specific styles |
| `src/pages/dashboard.js` | NEW | Dashboard page logic |
| `src/components/navbar.js` | NEW | Shared navbar component |
| `src/components/stats-card.js` | NEW | Stats card component |
| `src/components/timeline.js` | NEW | Timeline preview component |
| `src/main.js` | MODIFY | Import and init dashboard |

---

## 6. Testing

| Test ID | Description | Type |
|---------|-------------|------|
| TEST-001 | Verify 4 stats cards render with correct data | Manual |
| TEST-002 | Verify chart renders and responds to filter clicks | Manual |
| TEST-003 | Verify timeline shows max 5 items sorted by date desc | Manual |
| TEST-004 | Verify FAB navigates to tambah.html on click | Manual |
| TEST-005 | Verify empty state shows when no vehicles/fuel logs | Manual |
| TEST-006 | Verify navbar hamburger works on mobile viewport | Manual |
| TEST-007 | Verify all touch targets ≥ 44px on mobile | Manual |
| TEST-008 | Cross-browser test: Chrome, Firefox, Safari, Edge | Compatibility |

---

## 7. Risks & Assumptions

### Risks

- **RISK-001**: Chart.js rendering mungkin lambat di device low-end dengan banyak data points
  - Mitigasi: Agregasi data per bulan jika > 100 points
- **RISK-002**: Bootstrap CSS mungkin conflict dengan custom styles
  - Mitigasi: Gunakan CSS specificity dan custom properties

### Assumptions

- **ASSUMPTION-001**: User sudah memiliki data di localStorage (untuk non-empty state testing)
- **ASSUMPTION-002**: Browser target mendukung ES6+ dan CSS Grid/Flexbox
- **ASSUMPTION-003**: Design system CSS variables sudah tersedia

---

## 8. Related Specifications

- [spec-ui-layout-dashboard.md](../spec/spec-ui-layout-dashboard.md) - Layout specification
- [spec-design-visual-style.md](../spec/spec-design-visual-style.md) - Visual design system
- [spec-architecture-technical.md](../spec/spec-architecture-technical.md) - Technical architecture
