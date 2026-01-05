---
goal: Implementation plan for Kendaraan (Vehicle Management) page UI layout
version: 1.0
date_created: 2025-12-31
last_updated: 2026-01-05
owner: Front-end Team
status: 'Phase 4 Complete - ALL TASKS DONE'
tags: [design, layout, ui, kendaraan, vehicle, crud, implementation]
---

# Kendaraan Page Implementation Plan

![Status: Phase 4 Complete](https://img.shields.io/badge/status-Phase%204%20Complete-brightgreen)

Dokumen ini adalah **implementation plan** untuk membangun halaman Kelola Kendaraan (`kendaraan.html`) berdasarkan spesifikasi di `spec/spec-ui-layout-kendaraan.md`.

---

## 1. Requirements & Constraints

### From Specification

- **REQ-VEH-001**: Halaman HARUS menampilkan daftar semua kendaraan
- **REQ-VEH-002**: HARUS ada tombol untuk menambah kendaraan baru
- **REQ-VEH-003**: Setiap kendaraan HARUS punya action: Edit, Hapus
- **REQ-VEH-004**: Form HARUS di modal (tidak navigate)
- **REQ-VEH-005**: HARUS menampilkan jumlah pengisian per kendaraan
- **REQ-VEH-006**: Warna kendaraan HARUS bisa dipilih dari palette
- **REQ-VEH-007**: HARUS konfirmasi sebelum hapus

### Validation Rules

- **VAL-001**: Nama: 1-50 karakter (required)
- **VAL-002**: Jenis: "motor" atau "mobil" (required)
- **VAL-003**: Tahun: 1900-current+1 (optional)
- **VAL-004**: Plat: max 15 karakter (optional)

---

## 2. Implementation Steps

### Phase 1: Page Structure & List

- **GOAL-001**: Create vehicle list page

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Create `kendaraan.html` with back-arrow navbar | ✅ | 2026-01-02 |
| TASK-002 | Create page header: "Kendaraan Saya" + count + add button | ✅ | 2026-01-02 |
| TASK-003 | Create vehicle card template with color indicator | ✅ | 2026-01-02 |
| TASK-004 | Display vehicle info: name, type icon, plate, year | ✅ | 2026-01-02 |
| TASK-005 | Display fuel log count per vehicle | ✅ | 2026-01-02 |
| TASK-006 | Add Edit and Delete action buttons to card | ✅ | 2026-01-02 |
| TASK-007 | Render vehicle list from VehicleManager | ✅ | 2026-01-02 |

### Phase 2: Add/Edit Modal

- **GOAL-002**: Implement vehicle form in modal

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-008 | Create modal structure: header, body, footer | ✅ | 2026-01-02 |
| TASK-009 | Create name input field | ✅ | 2026-01-02 |
| TASK-010 | Create vehicle type toggle (Motor/Mobil) with icons | ✅ | 2026-01-02 |
| TASK-011 | Create year input (optional) | ✅ | 2026-01-02 |
| TASK-012 | Create plate number input (optional) | ✅ | 2026-01-02 |
| TASK-013 | Create color picker: 10 color swatches in grid | ✅ | 2026-01-02 |
| TASK-014 | Implement color selection: border + checkmark on selected | ✅ | 2026-01-02 |
| TASK-015 | Set default color: first unused or first in palette | ✅ | 2026-01-02 |

### Phase 3: CRUD Operations

- **GOAL-003**: Connect form to VehicleManager

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-016 | Implement Add: validate → VehicleManager.create() → close & refresh | ✅ | 2026-01-02 |
| TASK-017 | Implement Edit: pre-fill modal with existing data | ✅ | 2026-01-02 |
| TASK-018 | Implement Update: VehicleManager.update() | ✅ | 2026-01-02 |
| TASK-019 | Create delete confirmation modal with log count warning | ✅ | 2026-01-04 |
| TASK-020 | Implement Delete: VehicleManager.delete() → refresh list | ✅ | 2026-01-02 |

### Phase 4: States & Polish

- **GOAL-004**: Empty state and responsive behavior

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-021 | Create empty state: illustration, message, CTA | ✅ | 2026-01-02 |
| TASK-022 | Style modal: full screen on mobile, centered on desktop | ✅ | 2026-01-02 |
| TASK-023 | Test responsive card layout | ✅ | 2026-01-05 |
| TASK-024 | Add success toasts for add/edit/delete | ✅ | 2026-01-05 |

---

## 2.5. Implementation Notes - Phase 1 Completion

### Additional Foundation Files Created

Beyond the files listed in section 5, the following foundation files were created as prerequisites for Phase 1:

- **`package.json`** - NPM configuration with Vite, Bootstrap, Bootstrap Icons, Chart.js
- **`vite.config.js`** - Multi-page app configuration with path aliases (@, @modules, @components)
- **`.gitignore`** - Standard Node.js ignore patterns

### Key Implementation Decisions

1. **StorageManager with Seed Data**: Implemented `init(useSeedData = true)` to auto-populate 2 sample vehicles for immediate testing without Phase 2 modal
2. **VehicleManager Color Assignment**: Implemented `_getNextAvailableColor()` algorithm that finds first unused color from palette, cycles if all 10 colors used
3. **Full CRUD in Phase 1**: While planning deferred modal to Phase 2, VehicleManager includes complete CRUD operations for future use
4. **Validation Implementation**: All validation rules (VAL-001 to VAL-004) implemented in `validateVehicleData()` with detailed error messages
5. **Cascade Delete**: Delete operation removes associated fuel logs to maintain referential integrity
6. **XSS Prevention**: All user-generated content escaped via `escapeHtml()` before rendering
7. **Error Handling**: All localStorage operations wrapped in try-catch with QuotaExceededError handling

### Clean Architecture Compliance

- **Separation of Concerns**: StorageManager (data access) → VehicleManager (business logic) → kendaraan.js (UI/presentation)
- **Dependency Rule**: Higher-level policies (VehicleManager) depend on abstractions (StorageManager interface), not implementation details
- **Single Responsibility**: Each module has one clear purpose
- **Pure Functions**: utils.js contains only pure functions with no side effects
- **Immutability**: `getAllVehicles()` returns copy of array to prevent external mutation

### Testing Status

**Phase 1 Tests Completed**:
- ✅ **TEST-001**: Vehicle list renders with 2 seed vehicles
- ✅ **TEST-006**: Fuel log count displays (0 for seed data, correct)
- ✅ **TEST-007**: Empty state shows when localStorage cleared

**Deferred to Later Phases**:
- ⏭️ **TEST-002**: Add modal (Phase 2)
- ⏭️ **TEST-003**: Edit modal (Phase 2)  
- ⏭️ **TEST-004**: Color picker (Phase 2)
- ⏭️ **TEST-005**: Delete confirmation modal (Phase 3)

### Temporary Implementations (To Be Replaced)

1. ~~**Add Vehicle Button**: Shows alert "Phase 2" instead of opening modal~~ → **DONE in Phase 2**
2. **Delete Confirmation**: Uses browser `confirm()` instead of custom modal (Phase 3 - TASK-019)
3. **Success Feedback**: Logs to console instead of toast notifications (Phase 4 - TASK-024)

---

## 2.6. Implementation Notes - Phase 2 Completion

### Files Created in Phase 2

- **`src/components/color-picker.js`** (163 lines) - Reusable color grid with selection visual
- **`src/components/vehicle-form.js`** (291 lines) - Modal form controller with validation

### Key Features Implemented

1. **ColorPicker Component**
   - 10-color grid (5x2 layout)
   - Auto-select first unused color (TASK-015)
   - Selection visual: border + checkmark (TASK-014)
   - "Used" color indication with strikethrough

2. **VehicleForm Component**
   - Modal structure: header, body, footer (TASK-008)
   - Name input with max 50 chars (TASK-009)
   - Type toggle: Motor/Mobil with icons (TASK-010)
   - Year input: 1900-2027 range (TASK-011)
   - Plate input: max 15 chars (TASK-012)
   - Error display container

3. **Add/Edit Integration (Ahead of Schedule)**
   - Add flow: form → validate → create → refresh (TASK-016)
   - Edit flow: pre-fill → modify → update → refresh (TASK-017, TASK-018)
   - Delete flow: confirm → delete → refresh (TASK-020)

### CSS Added (307 lines)

- Modal: backdrop, dialog, responsive sizing, slide-up animation
- Form: input styles, focus states, error states
- Type Toggle: icon buttons with selected state
- Color Picker: grid layout, swatch hover/selected states

---

## 3. Alternatives

- **ALT-001**: Separate add/edit pages - tidak dipilih, modal lebih smooth UX
- **ALT-002**: Inline edit - tidak dipilih untuk consistency

---

## 4. Dependencies

- **DEP-001**: Bootstrap CSS - Cards, modals, forms, button groups
- **DEP-002**: Bootstrap Icons - motorcycle, car, pencil, trash
- **DEP-003**: `VehicleManager` module - CRUD operations
- **DEP-004**: `FuelLogManager` - Get count per vehicle
- **DEP-005**: Color palette from spec-design-visual-style.md

---

## 5. Files

| File | Type | Description | Status |
|------|------|-------------|--------|
| `kendaraan.html` | NEW | Vehicle management page | ✅ Created |
| `src/pages/kendaraan.js` | NEW | Page logic + form integration | ✅ Created + Updated |
| `src/components/vehicle-form.js` | NEW | Form component with validation | ✅ Created |
| `src/components/color-picker.js` | NEW | Color picker widget | ✅ Created |
| `src/styles/main.css` | NEW | Design system + all components | ✅ Created (815 lines) |
| `src/modules/storage.js` | NEW | StorageManager (foundation) | ✅ Created |
| `src/modules/vehicle.js` | NEW | VehicleManager (foundation) | ✅ Created |
| `src/modules/utils.js` | NEW | Utility functions (foundation) | ✅ Created |

---

## 6. Testing

| Test ID | Description | Type |
|---------|-------------|------|
| TEST-001 | Verify vehicle list renders all vehicles | Manual |
| TEST-002 | Verify Add opens empty modal | Manual |
| TEST-003 | Verify Edit pre-fills modal with data | Manual |
| TEST-004 | Verify color picker selects and shows checkmark | Manual |
| TEST-005 | Verify Delete shows warning with log count | Manual |
| TEST-006 | Verify fuel log count per vehicle correct | Manual |
| TEST-007 | Verify empty state when no vehicles | Manual |

---

## 7. Risks & Assumptions

- **RISK-001**: Deleting vehicle with many logs might be slow
  - Mitigasi: Show loading indicator
- **ASSUMPTION-001**: 10 colors in palette are sufficient for max 10 vehicles

---

## 8. Related Specifications

- [spec-ui-layout-kendaraan.md](../spec/spec-ui-layout-kendaraan.md) - Layout specification
- [spec-design-visual-style.md](../spec/spec-design-visual-style.md) - Color palette
- [spec-architecture-technical.md](../spec/spec-architecture-technical.md) - VehicleManager
