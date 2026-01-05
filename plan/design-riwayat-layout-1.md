---
goal: Implementation plan for Riwayat (History) page UI layout
version: 1.0
date_created: 2025-12-31
last_updated: 2025-12-31
owner: Front-end Team
status: 'Planned'
tags: [design, layout, ui, riwayat, history, timeline, implementation]
---

# Riwayat Page Implementation Plan

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Dokumen ini adalah **implementation plan** untuk membangun halaman Riwayat (`riwayat.html`) berdasarkan spesifikasi di `spec/spec-ui-layout-riwayat.md`.

---

## 1. Requirements & Constraints

### From Specification

- **REQ-RIW-001**: Halaman HARUS menampilkan semua riwayat pengisian dalam format timeline
- **REQ-RIW-002**: Timeline HARUS diurutkan dari terbaru ke terlama (descending)
- **REQ-RIW-003**: Setiap item HARUS menampilkan: tanggal, kendaraan, liter, harga, km/L, efisiensi
- **REQ-RIW-004**: HARUS ada filter berdasarkan kendaraan
- **REQ-RIW-005**: HARUS ada filter berdasarkan rentang waktu
- **REQ-RIW-006**: Setiap item HARUS memiliki quick action: Edit, Hapus
- **REQ-RIW-007**: HARUS mendukung infinite scroll atau pagination

### Technical Constraints

- **CON-001**: Maximum 20 items per load (infinite scroll)
- **CON-002**: Loading indicator saat fetch data berikutnya
- **CON-003**: "End of list" indicator saat semua data sudah ditampilkan
- **CON-004**: Gunakan IntersectionObserver untuk infinite scroll

---

## 2. Implementation Steps

### Phase 1: Page Structure

- **GOAL-001**: Create basic HTML structure with header and filter bar

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `riwayat.html` with HTML5 boilerplate, include shared navbar | | |
| TASK-002 | Create page header: title "Riwayat Pengisian" + total count badge | | |
| TASK-003 | Create filter bar with 2 dropdowns: Vehicle filter, Time filter | | |
| TASK-004 | Style filter bar: sticky on scroll, white bg with shadow when sticky | | |

### Phase 2: Timeline Component

- **GOAL-002**: Implement timeline list with item structure

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Create timeline container HTML with vertical line styling | | |
| TASK-006 | Create timeline item template: marker, header (date/vehicle), details, actions | | |
| TASK-007 | Implement efficiency badge with color coding (good/normal/poor) | | |
| TASK-008 | Style action buttons: Edit (secondary), Hapus (danger outline) | | |
| TASK-009 | Add timeline marker color based on efficiency level | | |

### Phase 3: Infinite Scroll

- **GOAL-003**: Implement progressive data loading

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-010 | Create `loadMoreIndicator` element at bottom of list | | |
| TASK-011 | Initialize IntersectionObserver to watch `loadMoreIndicator` | | |
| TASK-012 | Implement `loadMore()` function: fetch next 20 items, append to list | | |
| TASK-013 | Add loading spinner state while fetching | | |
| TASK-014 | Show "Anda sudah melihat semua data" when no more items | | |

### Phase 4: Filters & Actions

- **GOAL-004**: Connect filters and implement CRUD actions

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Populate vehicle dropdown from `VehicleManager.getAll()` | | |
| TASK-016 | Implement vehicle filter: re-render list on change | | |
| TASK-017 | Implement time filter (1m, 3m, 6m, 1y, all) | | |
| TASK-018 | Implement Edit action: navigate to `tambah.html?edit={id}` | | |
| TASK-019 | Create delete confirmation modal with warning message | | |
| TASK-020 | Implement delete: call `FuelLogManager.delete()`, remove item from DOM | | |

### Phase 5: States & Polish

- **GOAL-005**: Implement empty state and responsive behavior

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-021 | Create empty state: illustration, message, CTA to tambah.html | | |
| TASK-022 | Ensure filter bar is compact on mobile (shorter labels) | | |
| TASK-023 | Test responsive timeline item layout | | |
| TASK-024 | Validate touch targets and swipe gestures on mobile | | |

---

## 3. Alternatives

- **ALT-001**: Pagination dengan tombol "Load More" - tidak dipilih karena infinite scroll lebih smooth UX
- **ALT-002**: Virtual scrolling untuk list sangat panjang - reserved untuk v2 jika performance issue

---

## 4. Dependencies

- **DEP-001**: Bootstrap CSS 5.3.x - Dropdowns, cards, buttons
- **DEP-002**: Bootstrap Icons - pencil, trash, clock icons
- **DEP-003**: IntersectionObserver API - Browser native
- **DEP-004**: `FuelLogManager` module - Data operations
- **DEP-005**: Shared navbar component from dashboard

---

## 5. Files

| File | Type | Description |
|------|------|-------------|
| `riwayat.html` | NEW | History page markup |
| `src/pages/riwayat.js` | NEW | Page logic, infinite scroll |
| `src/components/timeline.js` | NEW/MODIFY | Timeline rendering component |
| `src/components/modal.js` | NEW | Delete confirmation modal |
| `src/styles/main.css` | MODIFY | Timeline, filter bar styles |

---

## 6. Testing

| Test ID | Description | Type |
|---------|-------------|------|
| TEST-001 | Verify timeline renders sorted by date desc | Manual |
| TEST-002 | Verify infinite scroll loads 20 more items | Manual |
| TEST-003 | Verify vehicle filter correctly filters list | Manual |
| TEST-004 | Verify time filter correctly filters by date range | Manual |
| TEST-005 | Verify Edit button navigates to correct edit URL | Manual |
| TEST-006 | Verify Delete shows confirmation and removes item | Manual |
| TEST-007 | Verify empty state when no data matches filter | Manual |
| TEST-008 | Verify sticky filter bar on scroll | Manual |

---

## 7. Risks & Assumptions

- **RISK-001**: IntersectionObserver mungkin tidak support di browser lama
  - Mitigasi: Polyfill atau fallback ke scroll event
- **ASSUMPTION-001**: FuelLogManager sudah return data sorted by date desc

---

## 8. Related Specifications

- [spec-ui-layout-riwayat.md](../spec/spec-ui-layout-riwayat.md) - Layout specification
- [spec-ui-layout-dashboard.md](../spec/spec-ui-layout-dashboard.md) - Shared navbar
- [spec-architecture-technical.md](../spec/spec-architecture-technical.md) - FuelLogManager
