# Specification Documents

This folder contains all specification documents for the **Konsumsi BBM Kendaraan** project, following the Specification Architect standards.

## 📋 Document Index

### Core Specifications

| Document | Purpose | Last Updated |
|----------|---------|--------------|
| [spec-architecture-technical.md](./spec-architecture-technical.md) | Technical architecture, modules, data models | 2025-12-28 |
| [spec-design-visual-style.md](./spec-design-visual-style.md) | Visual style, colors, typography, components | 2025-12-28 |
| [COLOR-PALETTE.md](./COLOR-PALETTE.md) | Quick reference color palette | 2025-12-28 |

### UI Layout Specifications

| Page | Document | Key Components |
|------|----------|----------------|
| **Dashboard** | [spec-ui-layout-dashboard.md](./spec-ui-layout-dashboard.md) | Stats cards, chart, timeline preview, FAB |
| **Riwayat** | [spec-ui-layout-riwayat.md](./spec-ui-layout-riwayat.md) | Timeline list, filters, infinite scroll |
| **Tambah** | [spec-ui-layout-tambah.md](./spec-ui-layout-tambah.md) | Form, validation, edit mode |
| **Statistik** | [spec-ui-layout-statistik.md](./spec-ui-layout-statistik.md) | Line/Bar/HBar charts, filters |
| **Pengaturan** | [spec-ui-layout-pengaturan.md](./spec-ui-layout-pengaturan.md) | Export/import, danger zone |
| **Kendaraan** | [spec-ui-layout-kendaraan.md](./spec-ui-layout-kendaraan.md) | Vehicle CRUD, color picker |

## 🔗 Related Documents

- [../prd.md](../prd.md) - Product Requirements Document

## 📝 Document Structure

All specification documents follow the **Specification Architect Template**:

```
---
title: [Document Title]
version: [Semantic Version]
date_created: [YYYY-MM-DD]
last_updated: [YYYY-MM-DD]
owner: [Team/Individual]
tags: [relevant, tags]
---

1. Purpose & Scope
2. Definitions
3. Requirements, Constraints & Guidelines
4. Interfaces & Data Contracts
5. Acceptance Criteria
...
```

## 🎯 Quick Reference

### For Developers

- **Architecture & Code Structure**: See [spec-architecture-technical.md](./spec-architecture-technical.md)
  - File structure (Section 2)
  - Data models with JSDoc (Section 3)
  - Module specifications (Section 4)
  - Form validation (Section 7)

### For Designers

- **Visual Design System**: See [spec-design-visual-style.md](./spec-design-visual-style.md)
  - CSS Variables contract (Section 4.1)
  - Color palette (Section 4.2-4.3)
  - Component styling patterns (Section 7)
  - Responsive breakpoints (Section 6)

### For QA/Testing

- **Testing Requirements**:
  - Technical spec Section 10: Testing Strategy
  - Design spec Section 5: Acceptance Criteria
  - Design spec Section 10: Validation Criteria

## 🔄 Document Lifecycle

1. **Draft**: Initial creation
2. **Review**: Team review and feedback
3. **Approved**: Ready for implementation
4. **Maintained**: Updated as implementation evolves

Current status: All documents in **Draft - Ready for Development**

---

For questions about specification standards, refer to `.agent/rules/specification-architect.md`.
