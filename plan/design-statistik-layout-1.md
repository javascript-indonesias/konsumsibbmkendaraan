---
goal: Implementation plan for Statistik (Charts) page UI layout
version: 1.1
date_created: 2025-12-31
last_updated: 2026-01-08
owner: Front-end Team
status: 'Complete'
tags: [design, layout, ui, statistik, charts, analytics, implementation]
---

# Statistik Page Implementation Plan

![Status: Complete](https://img.shields.io/badge/status-Complete-brightgreen) ![Progress: 100%](https://img.shields.io/badge/progress-100%25-brightgreen)

Dokumen ini adalah **implementation plan** untuk membangun halaman Statistik (`statistik.html`) berdasarkan spesifikasi di `spec/spec-ui-layout-statistik.md`.

---

## 1. Requirements & Constraints

### From Specification

- **REQ-STA-001**: Halaman HARUS menampilkan 3 jenis grafik: Line, Bar, Horizontal Bar
- **REQ-STA-002**: Setiap grafik HARUS memiliki filter rentang waktu
- **REQ-STA-003**: Line dan Bar HARUS mendukung multi-vehicle comparison
- **REQ-STA-004**: Legend click HARUS toggle visibility dataset
- **REQ-STA-005**: HARUS ada opsi custom date range picker
- **REQ-STA-006**: Horizontal Bar HARUS ranking kendaraan by efficiency

### Technical Constraints

- **CON-001**: Chart height: min 250px, max 400px
- **CON-002**: Legend position: bottom (mobile), top (desktop)
- **CON-003**: Tooltip format: Rupiah & km/L with 2 decimals
- **CON-004**: Animation on filter change

---

## 2. Implementation Steps

### Phase 1: Page Structure & Global Filter

- **GOAL-001**: Create page with global filter bar applying to all charts

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `statistik.html` with shared navbar | | |
| TASK-002 | Create global filter bar: Time Range dropdown, Vehicle dropdown | | |
| TASK-003 | Style filter bar: sticky on scroll | | |
| TASK-004 | Populate vehicle dropdown from VehicleManager | | |
| TASK-005 | Implement filter state management (selected time, selected vehicles) | | |

### Phase 2: Line Chart (Tren Konsumsi)

- **GOAL-002**: Implement multi-line consumption trend chart

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-006 | Create chart 1 container card with title | | |
| TASK-007 | Initialize Chart.js Line Chart with responsive config | | |
| TASK-008 | Implement multi-dataset: one line per vehicle with assigned colors | | |
| TASK-009 | Add clickable legend to toggle dataset visibility | | |
| TASK-010 | Connect to Calculator.getConsumptionTrend() data | | |
| TASK-011 | Implement tooltip with "km/L" format | | |

### Phase 3: Bar Chart (Pengeluaran Bulanan)

- **GOAL-003**: Implement grouped bar chart for monthly expenses

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-012 | Create chart 2 container card with title | | |
| TASK-013 | Initialize Chart.js Bar Chart (grouped) | | |
| TASK-014 | Implement multi-dataset grouped by month | | |
| TASK-015 | Add tooltip with Rupiah currency format | | |
| TASK-016 | Connect to Calculator.getMonthlyExpenses() | | |

### Phase 4: Horizontal Bar Chart (Perbandingan)

- **GOAL-004**: Implement vehicle comparison ranking chart

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-017 | Create chart 3 container card with title | | |
| TASK-018 | Initialize Chart.js Horizontal Bar | | |
| TASK-019 | Sort data by avg km/L descending (best at top) | | |
| TASK-020 | Highlight best vehicle with accent color | | |
| TASK-021 | Connect to Calculator.getVehicleStats() | | |

### Phase 5: Custom Date Picker & Summary

- **GOAL-005**: Implement custom date range and summary cards

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-022 | Add "Custom" option to time range dropdown | | |
| TASK-023 | Create date picker modal with start/end date inputs | | |
| TASK-024 | Implement apply/cancel for custom date range | | |
| TASK-025 | Create 3 summary cards: Total Expense, Best Vehicle, Worst Vehicle | | |
| TASK-026 | Style summary cards: responsive 3-col grid | | |

### Phase 6: States & Polish

- **GOAL-006**: Implement loading/empty states and polish

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-027 | Create skeleton loaders for each chart | | |
| TASK-028 | Create empty state when no data matches filter | | |
| TASK-029 | Implement chart animation on filter change | | |
| TASK-030 | Test responsive chart heights across breakpoints | | |

---

## 3. Alternatives

- **ALT-001**: Separate filter per chart - tidak dipilih, global filter lebih user-friendly
- **ALT-002**: Stacked bar chart - reserved untuk toggle option future

---

## 4. Dependencies

- **DEP-001**: Chart.js 4.x - All chart types
- **DEP-002**: Bootstrap CSS - Dropdowns, cards, grid
- **DEP-003**: Bootstrap Icons - Chart icons
- **DEP-004**: `Calculator` module - Data aggregation
- **DEP-005**: `VehicleManager` - Vehicle colors

---

## 5. Files

| File | Type | Description |
|------|------|-------------|
| `statistik.html` | NEW | Charts page markup |
| `src/pages/statistik.js` | NEW | Page logic, filter management |
| `src/modules/chart-config.js` | NEW | Chart.js configurations |
| `src/components/date-picker.js` | NEW | Custom date range picker |
| `src/styles/main.css` | MODIFY | Chart container styles |

---

## 6. Testing

| Test ID | Description | Type |
|---------|-------------|------|
| TEST-001 | Verify all 3 charts render with correct data | Manual |
| TEST-002 | Verify global filter applies to all charts | Manual |
| TEST-003 | Verify legend click toggles line visibility | Manual |
| TEST-004 | Verify custom date picker works | Manual |
| TEST-005 | Verify horizontal bar sorted by efficiency | Manual |
| TEST-006 | Verify summary cards show correct values | Manual |
| TEST-007 | Verify responsive chart heights | Manual |
| TEST-008 | Verify empty state when no data | Manual |

---

## 7. Risks & Assumptions

- **RISK-001**: Chart.js performance dengan dataset besar
  - Mitigasi: Data aggregation di Calculator
- **ASSUMPTION-001**: Vehicle colors sudah assigned di VehicleManager

---

## 8. Related Specifications

- [spec-ui-layout-statistik.md](../spec/spec-ui-layout-statistik.md) - Layout specification
- [spec-design-visual-style.md](../spec/spec-design-visual-style.md) - Chart colors
- [spec-architecture-technical.md](../spec/spec-architecture-technical.md) - Calculator module
