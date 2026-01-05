# Implementation Plans

This folder contains **implementation plan** documents for the Konsumsi BBM Kendaraan project, created following the [Planner Architect](../.agent/rules/planner-architect.md) template.

## 📋 Plan Index

### UI Layout Implementation Plans

| Plan | Spec Reference | Tasks | Phases | Status |
|------|---------------|-------|--------|--------|
| [design-dashboard-layout-1.md](./design-dashboard-layout-1.md) | [spec-ui-layout-dashboard.md](../spec/spec-ui-layout-dashboard.md) | 27 | 6 | Planned |
| [design-riwayat-layout-1.md](./design-riwayat-layout-1.md) | [spec-ui-layout-riwayat.md](../spec/spec-ui-layout-riwayat.md) | 24 | 5 | Planned |
| [design-tambah-layout-1.md](./design-tambah-layout-1.md) | [spec-ui-layout-tambah.md](../spec/spec-ui-layout-tambah.md) | 27 | 4 | Planned |
| [design-statistik-layout-1.md](./design-statistik-layout-1.md) | [spec-ui-layout-statistik.md](../spec/spec-ui-layout-statistik.md) | 30 | 6 | Planned |
| [design-pengaturan-layout-1.md](./design-pengaturan-layout-1.md) | [spec-ui-layout-pengaturan.md](../spec/spec-ui-layout-pengaturan.md) | 22 | 4 | Planned |
| [design-kendaraan-layout-1.md](./design-kendaraan-layout-1.md) | [spec-ui-layout-kendaraan.md](../spec/spec-ui-layout-kendaraan.md) | 24 | 4 | Planned |

### Summary

| Metric | Value |
|--------|-------|
| Total Plans | 6 |
| Total Tasks | **154** |
| Total Phases | 29 |

---

## 🎯 Implementation Priority

Urutan implementasi berdasarkan **dependencies** antar halaman:

| Priority | Plan | Halaman | Alasan |
|:--------:|------|---------|--------|
| 1️⃣ | [design-kendaraan-layout-1.md](./design-kendaraan-layout-1.md) | Kendaraan | Foundation - harus ada kendaraan dulu |
| 2️⃣ | [design-tambah-layout-1.md](./design-tambah-layout-1.md) | Tambah | Core input - tanpa ini tidak ada data |
| 3️⃣ | [design-riwayat-layout-1.md](./design-riwayat-layout-1.md) | Riwayat | Display data + Edit/Delete |
| 4️⃣ | [design-dashboard-layout-1.md](./design-dashboard-layout-1.md) | Dashboard | Overview - butuh data dari #1-3 |
| 5️⃣ | [design-statistik-layout-1.md](./design-statistik-layout-1.md) | Statistik | Charts - butuh akumulasi data |
| 6️⃣ | [design-pengaturan-layout-1.md](./design-pengaturan-layout-1.md) | Pengaturan | Export/Import - enhancement |

---

## 🔀 User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FIRST TIME USER                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │    Dashboard    │ ◄─── index.html (entry point)
                    │  (Empty State)  │
                    └────────┬────────┘
                             │ "Tambah Kendaraan Pertama"
                             ▼
                    ┌─────────────────┐
                    │   Kendaraan     │ ◄─── Modal Form
                    │  (Add Vehicle)  │
                    └────────┬────────┘
                             │ Save → Prompt
                             ▼
                    ┌─────────────────┐
                    │     Tambah      │ ◄─── Form Pengisian BBM
                    │  (Add Fuel Log) │
                    └────────┬────────┘
                             │ Save
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       RETURNING USER                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Dashboard                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Stats Card│  │Stats Card│  │Stats Card│  │Stats Card│        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              Line Chart (Tren Konsumsi)             │        │
│  └─────────────────────────────────────────────────────┘        │
│  ┌─────────────────────────────────────────────────────┐        │
│  │              Timeline Preview (5 items)              │        │
│  └─────────────────────────────────────────────────────┘        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│     Riwayat     │   │    Statistik    │   │   Pengaturan    │
│  (Full History) │   │  (All Charts)   │   │   (Settings)    │
│  - Filter       │   │  - Line Chart   │   │  - Kendaraan →  │
│  - Edit/Delete  │   │  - Bar Chart    │   │  - Export CSV   │
│  - Inf. Scroll  │   │  - HBar Chart   │   │  - Import CSV   │
└────────┬────────┘   └─────────────────┘   │  - Reset Data   │
         │                                   └────────┬────────┘
         │ Edit                                       │
         ▼                                            ▼
┌─────────────────┐                         ┌─────────────────┐
│     Tambah      │                         │   Kendaraan     │
│  (Edit Mode)    │                         │  (CRUD Modal)   │
└─────────────────┘                         └─────────────────┘
```

---

## 🔗 Dependency Graph

```
                    ┌─────────────┐
                    │  Kendaraan  │ ◄─── No dependencies (START HERE)
                    └──────┬──────┘
                           │ requires vehicle
                           ▼
                    ┌─────────────┐
                    │   Tambah    │ ◄─── Requires: Kendaraan
                    └──────┬──────┘
                           │ creates fuel logs
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐
       │  Riwayat  │ │ Dashboard │ │ Statistik │
       │(Edit/Del) │ │(Overview) │ │ (Charts)  │
       └───────────┘ └───────────┘ └───────────┘
              │            │
              │            │ Requires: Kendaraan, Tambah, Riwayat data
              │            │
              └────────────┼────────────┐
                           │            │
                           ▼            │
                    ┌─────────────┐     │
                    │ Pengaturan  │ ◄───┘
                    │(Export/Imp) │     Requires: All data modules
                    └─────────────┘
```

---

## 🔗 Related Documents

- **Specifications**: [/spec/](../spec/README.md) - Layout specs, design system, technical architecture
- **PRD**: [prd.md](../prd.md) - Product requirements

## 📁 Naming Convention

Files follow the pattern: `[purpose]-[component]-[version].md`

- `design` - UI/UX implementation plans
- `feature` - Feature implementation plans
- `refactor` - Code refactoring plans
- `upgrade` - Dependency/system upgrade plans

## ✅ Document Standards

Each plan includes:

1. **Requirements & Constraints** - From spec + technical constraints
2. **Implementation Steps** - Phased tasks with checkboxes
3. **Alternatives** - Considered alternatives and why not chosen
4. **Dependencies** - Libraries, modules, specs
5. **Files** - Affected files (NEW/MODIFY)
6. **Testing** - Manual and automated tests
7. **Risks & Assumptions** - Potential issues and mitigations
8. **Related Specifications** - Links to source specs
