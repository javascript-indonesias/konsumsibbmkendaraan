---
goal: Implementation plan for Pengaturan (Settings) page UI layout
version: 1.0
date_created: 2025-12-31
last_updated: 2025-12-31
owner: Front-end Team
status: 'Planned'
tags: [design, layout, ui, pengaturan, settings, data-management, implementation]
---

# Pengaturan Page Implementation Plan

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

Dokumen ini adalah **implementation plan** untuk membangun halaman Pengaturan (`pengaturan.html`) berdasarkan spesifikasi di `spec/spec-ui-layout-pengaturan.md`.

---

## 1. Requirements & Constraints

### From Specification

- **REQ-SET-001**: Halaman HARUS menampilkan link ke Manajemen Kendaraan
- **REQ-SET-002**: HARUS ada opsi Export data ke CSV
- **REQ-SET-003**: HARUS ada opsi Import data dari CSV
- **REQ-SET-004**: HARUS ada opsi Reset/Hapus semua data
- **REQ-SET-005**: HARUS ada informasi versi aplikasi
- **REQ-SET-006**: Import HARUS menampilkan preview sebelum konfirmasi

### Safety Requirements

- **SAF-001**: Reset data HARUS memerlukan double confirmation
- **SAF-002**: Import HARUS warning tentang data yang akan ditimpa
- **SAF-003**: Export HARUS feedback sukses/gagal

---

## 2. Implementation Steps

### Phase 1: Page Structure

- **GOAL-001**: Create settings page with grouped menu items

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `pengaturan.html` with shared navbar | | |
| TASK-002 | Create page header: "Pengaturan" | | |
| TASK-003 | Create "Kendaraan" section with link to kendaraan.html | | |
| TASK-004 | Style menu item: icon, title, subtitle, chevron | | |

### Phase 2: Data Section (Export/Import)

- **GOAL-002**: Implement export and import functionality

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Create "Data" section with Export and Import items | | |
| TASK-006 | Implement Export: call CSVManager.export(), trigger download | | |
| TASK-007 | Show toast on export success with filename | | |
| TASK-008 | Create import file picker (drag & drop area) | | |
| TASK-009 | Implement file validation (CSV only) | | |
| TASK-010 | Create import preview modal: show vehicle/log counts | | |
| TASK-011 | Implement import merge logic with duplicate handling | | |
| TASK-012 | Show import success modal with counts | | |

### Phase 3: Danger Zone

- **GOAL-003**: Implement double-confirmation reset

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-013 | Create "Danger Zone" section with red styling | | |
| TASK-014 | Create "Hapus Semua Data" menu item | | |
| TASK-015 | Create first warning modal: list counts, ask confirm | | |
| TASK-016 | Create second confirmation: type "HAPUS" to confirm | | |
| TASK-017 | Implement delete: StorageManager.clearAll() | | |
| TASK-018 | Show success and redirect to index.html | | |

### Phase 4: About & Polish

- **GOAL-004**: Add about section and polish

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-019 | Create "Tentang" section with app info | | |
| TASK-020 | Display version number, copyright, description | | |
| TASK-021 | Style all sections with proper spacing | | |
| TASK-022 | Test all flows: export, import, delete | | |

---

## 3. Alternatives

- **ALT-001**: JSON export instead of CSV - CSV dipilih karena user-friendly, bisa buka di Excel
- **ALT-002**: Single confirm for delete - tidak dipilih karena destructive action

---

## 4. Dependencies

- **DEP-001**: Bootstrap CSS - Cards, modals, forms
- **DEP-002**: Bootstrap Icons - download, upload, trash icons
- **DEP-003**: `CSVManager` module - Export/import operations
- **DEP-004**: `StorageManager` module - Clear all data
- **DEP-005**: File API - File input handling

---

## 5. Files

| File | Type | Description |
|------|------|-------------|
| `pengaturan.html` | NEW | Settings page markup |
| `src/pages/pengaturan.js` | NEW | Page logic |
| `src/modules/csv-manager.js` | NEW | CSV export/import |
| `src/components/modal.js` | MODIFY | Confirmation modals |
| `src/styles/main.css` | MODIFY | Settings menu styles |

---

## 6. Testing

| Test ID | Description | Type |
|---------|-------------|------|
| TEST-001 | Verify Export downloads CSV file | Manual |
| TEST-002 | Verify Import shows preview correct counts | Manual |
| TEST-003 | Verify Import merges without duplicates | Manual |
| TEST-004 | Verify Delete requires double confirmation | Manual |
| TEST-005 | Verify Delete clears all localStorage data | Manual |
| TEST-006 | Verify navigation to kendaraan.html works | Manual |

---

## 7. Risks & Assumptions

- **RISK-001**: Large CSV file might be slow to parse
  - Mitigasi: Show loading indicator
- **ASSUMPTION-001**: CSV format matches spec format

---

## 8. Related Specifications

- [spec-ui-layout-pengaturan.md](../spec/spec-ui-layout-pengaturan.md) - Layout specification
- [spec-architecture-technical.md](../spec/spec-architecture-technical.md) - CSVManager, StorageManager
