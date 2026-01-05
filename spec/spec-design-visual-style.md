---
title: Visual Style & Design System Specification
version: 1.1.0
date_created: 2025-12-28
last_updated: 2025-12-28
owner: Front-end Team
tags: [design, ui, styling, colors, css, eco-friendly]
---

# Visual Style & Design System

## 1. Purpose & Scope

Dokumen ini mendefinisikan sistem visual dan design tokens untuk aplikasi **Konsumsi BBM Kendaraan**. Spesifikasi ini menjadi sumber kebenaran tunggal (single source of truth) untuk:

- Color palette dan penggunaannya
- Typography system
- Spacing dan layout tokens
- Component styling standards
- Responsive design breakpoints
- Chart visualization colors

**Tujuan**: Memastikan konsistensi visual di seluruh aplikasi dan mempermudah implementasi oleh developer.

---

## 2. Definitions

| Term | Definition |
|------|------------|
| Design Token | Nilai atomic yang menyimpan keputusan design (warna, spacing, dll) |
| CSS Variables | Custom properties CSS untuk menyimpan design tokens |
| Semantic Color | Warna yang diberi nama berdasarkan fungsi (success, danger) |
| Efficiency Color | Warna yang merepresentasikan tingkat efisiensi konsumsi BBM |

---

## 3. Requirements, Constraints & Guidelines

### Color Requirements

- **REQ-CLR-001**: Aplikasi HARUS menggunakan 10 warna unik untuk diferensiasi multi-kendaraan
- **REQ-CLR-002**: Warna efisiensi (good/normal/poor) HARUS konsisten di semua komponen
- **REQ-CLR-003**: Kontras warna teks HARUS memenuhi WCAG AA (min 4.5:1)

### Styling Constraints

- **CON-STY-001**: Semua styling HARUS menggunakan CSS Variables untuk maintainability
- **CON-STY-002**: Tidak boleh ada hardcoded color values di component CSS
- **CON-STY-003**: Bootstrap 5.3.x sebagai base framework

### Design Guidelines

- **GUD-DES-001**: Mobile-first approach - base styles untuk layar kecil
- **GUD-DES-002**: Touch targets minimum 44px x 44px
- **GUD-DES-003**: Konsistensi spacing menggunakan 8px grid system

---

## 4. Interfaces & Data Contracts

### 4.1 CSS Variables Contract

Semua design tokens HARUS didefinisikan di `:root` selector:

```css
:root {
  /* ===== BRAND COLORS (Eco-Friendly Theme) ===== */
  
  /* Primary - Forest Green (Main Brand) */
  --color-primary: #04773B;        /* Dark forest green - eco theme PRIMARY */
  --color-primary-dark: #035A2C;   /* Darker green untuk hover */
  --color-primary-light: #06A34F;  /* Lighter green */
  
  /* Secondary - Teal */
  --color-secondary: #4BC0C0;      /* Teal - secondary/supporting color */
  --color-secondary-dark: #2A7F7F; /* Dark teal untuk hover */
  --color-secondary-light: #7DD4D4;/* Light teal untuk backgrounds */
  
  /* Accent - Burnt Orange */
  --color-accent: #E76F51;         /* Coral/burnt orange - warm contrast */
  --color-accent-dark: #D95839;    /* Darker untuk hover */
  --color-accent-light: #F09479;   /* Lighter untuk backgrounds */
  
  /* ===== SEMANTIC COLORS ===== */
  
  /* Success (menggunakan forest green) */
  --color-success: #04773B;
  --color-success-bg: rgba(4, 119, 59, 0.1);
  --color-success-border: #06A34F;
  
  /* Warning */
  --color-warning: #FFCE56;
  --color-warning-bg: rgba(255, 206, 86, 0.1);
  --color-warning-border: #F4B942;
  
  /* Danger */
  --color-danger: #FF6384;
  --color-danger-bg: rgba(255, 99, 132, 0.1);
  --color-danger-border: #FF4567;
  
  /* Info (menggunakan teal) */
  --color-info: #4BC0C0;
  --color-info-bg: rgba(75, 192, 192, 0.1);
  --color-info-border: #7DD4D4;
  
  /* ===== EFFICIENCY COLORS ===== */
  --color-efficiency-good: #04773B;    /* Forest green */
  --color-efficiency-normal: #FFCE56;  /* Yellow */
  --color-efficiency-poor: #FF6384;    /* Red */
  
  /* ===== NAVBAR COLORS ===== */
  --navbar-bg: #024520;               /* Very dark green - sophisticated */
  --navbar-text: #FFFFFF;
  --navbar-text-hover: #06A34F;       /* Light green */
  --navbar-active: #E76F51;           /* Accent color */
  --navbar-border: rgba(255, 255, 255, 0.1);
  
  /* ===== BUTTON COLORS ===== */
  
  /* Primary Button (Forest Green) */
  --btn-primary-bg: var(--color-primary);
  --btn-primary-text: #FFFFFF;
  --btn-primary-hover-bg: var(--color-primary-dark);
  --btn-primary-active-bg: #024520;
  --btn-primary-focus-shadow: rgba(4, 119, 59, 0.25);
  
  /* Secondary Button (Teal) */
  --btn-secondary-bg: var(--color-secondary);
  --btn-secondary-text: #FFFFFF;
  --btn-secondary-hover-bg: var(--color-secondary-dark);
  --btn-secondary-active-bg: #1E6666;
  --btn-secondary-focus-shadow: rgba(75, 192, 192, 0.25);
  
  /* Accent Button */
  --btn-accent-bg: var(--color-accent);
  --btn-accent-text: #FFFFFF;
  --btn-accent-hover-bg: var(--color-accent-dark);
  --btn-accent-active-bg: #C74528;
  --btn-accent-focus-shadow: rgba(231, 111, 81, 0.25);
  
  /* Outline Button */
  --btn-outline-border: var(--color-primary);
  --btn-outline-text: var(--color-primary);
  --btn-outline-hover-bg: var(--color-primary);
  --btn-outline-hover-text: #FFFFFF;
  
  /* Disabled Button */
  --btn-disabled-bg: #E9ECEF;
  --btn-disabled-text: #ADB5BD;
  --btn-disabled-cursor: not-allowed;
  
  /* ===== LINK COLORS ===== */
  --link-color: var(--color-primary);
  --link-hover-color: var(--color-primary-dark);
  --link-active-color: var(--color-accent);
  --link-visited-color: #6B4C9A;  /* Purple tint */
  --link-decoration: none;
  --link-hover-decoration: underline;
  
  /* ===== FORM COLORS ===== */
  --input-bg: #FFFFFF;
  --input-border: #DEE2E6;
  --input-text: #212529;
  --input-placeholder: #ADB5BD;
  --input-focus-border: var(--color-primary);
  --input-focus-shadow: rgba(4, 119, 59, 0.25);
  --input-disabled-bg: #E9ECEF;
  --input-disabled-text: #6C757D;
  --input-error-border: var(--color-danger);
  --input-success-border: var(--color-success);
  
  /* ===== NEUTRAL COLORS ===== */
  --color-bg-page: #F8F9FA;          /* Page background */
  --color-bg-card: #FFFFFF;          /* Card background */
  --color-bg-light: #F8F9FA;         /* Light grey bg */
  --color-bg-muted: #E9ECEF;         /* Muted bg */
  
  --color-text-primary: #212529;     /* Main text */
  --color-text-secondary: #495057;   /* Secondary text */
  --color-text-muted: #6C757D;       /* Muted text */
  --color-text-disabled: #ADB5BD;    /* Disabled text */
  
  --color-border: #DEE2E6;           /* Default border */
  --color-border-light: #E9ECEF;     /* Light border */
  --color-border-dark: #CED4DA;      /* Dark border */
  
  --color-divider: rgba(0, 0, 0, 0.1);  /* Divider line */
  
  /* ===== VEHICLE CHART COLORS ===== */
  /* (Tetap sama untuk multi-vehicle differentiation) */
  --vehicle-color-1: #FF6384;  /* Rose Pink */
  --vehicle-color-2: #36A2EB;  /* Sky Blue */
  --vehicle-color-3: #FFCE56;  /* Sunny Yellow */
  --vehicle-color-4: #4BC0C0;  /* Teal */
  --vehicle-color-5: #9966FF;  /* Purple */
  --vehicle-color-6: #FF9F40;  /* Orange */
  --vehicle-color-7: #47D147;  /* Green */
  --vehicle-color-8: #C9CBCF;  /* Silver Grey */
  --vehicle-color-9: #FF6699;  /* Hot Pink */
  --vehicle-color-10: #33CCCC; /* Cyan */
  
  /* ===== TYPOGRAPHY ===== */
  --font-family-base: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.125rem;
  --font-size-h1: 1.75rem;
  --font-size-h2: 1.5rem;
  --font-size-h3: 1.25rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --line-height-base: 1.5;
  
  /* ===== SPACING (8px Grid) ===== */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  --spacing-2xl: 3rem;    /* 48px */
  
  /* ===== BORDERS ===== */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-pill: 50rem;
  --border-width: 1px;
  
  /* ===== SHADOWS ===== */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-focus: 0 0 0 3px rgba(4, 119, 59, 0.25);  /* Focus ring - green */
  
  /* ===== TRANSITIONS ===== */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}
```

### 4.2 Vehicle Colors Array (JavaScript)

```javascript
/**
 * Color palette untuk multi-vehicle charts
 * 10 warna unik dengan kontras tinggi
 */
const VEHICLE_COLORS = [
  '#FF6384', // Rose Pink
  '#36A2EB', // Sky Blue
  '#FFCE56', // Sunny Yellow
  '#4BC0C0', // Teal
  '#9966FF', // Purple
  '#FF9F40', // Orange
  '#47D147', // Green
  '#C9CBCF', // Silver Grey
  '#FF6699', // Hot Pink
  '#33CCCC'  // Cyan
];

/**
 * Get color by index (wraps around if > 10 vehicles)
 * @param {number} index
 * @returns {string} Hex color
 */
function getVehicleColor(index) {
  return VEHICLE_COLORS[index % VEHICLE_COLORS.length];
}
```

### 4.3 Efficiency Colors Mapping

```javascript
/**
 * Efficiency color mapping (Eco-Friendly Theme)
 */
const EFFICIENCY_COLORS = {
  good: '#04773B',   // Forest green - efisien (eco theme)
  normal: '#FFCE56', // Yellow - rata-rata
  poor: '#FF6384'    // Red - boros
};

/**
 * Get CSS class for efficiency badge
 * @param {'good'|'normal'|'poor'} efficiency
 * @returns {string} CSS class name
 */
function getEfficiencyClass(efficiency) {
  const classMap = {
    good: 'badge-success',
    normal: 'badge-warning',
    poor: 'badge-danger'
  };
  return classMap[efficiency] || 'badge-secondary';
}
```

---

## 5. Acceptance Criteria

- **AC-CLR-001**: Given aplikasi di-load, When melihat chart multi-kendaraan, Then setiap kendaraan memiliki warna berbeda dari 10 palette colors
- **AC-CLR-002**: Given fuel log ditampilkan, When efisiensi "good", Then badge berwarna hijau (#47D147)
- **AC-CLR-003**: Given CSS Variables didefinisikan, When component menggunakan warna, Then HARUS via CSS variable bukan hardcoded
- **AC-TYP-001**: Given tampilan mobile, When font-size-base, Then minimal 16px untuk readability
- **AC-SPC-001**: Given touch element, When diukur, Then minimal 44px x 44px

---

## 6. Responsive Breakpoints

```css
/* Mobile First Breakpoints */

/* Extra small devices (phones) */
/* Default styles - no media query needed */

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  :root {
    --font-size-h1: 2rem;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  :root {
    --font-size-h1: 2.25rem;
    --spacing-xl: 2.5rem;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  :root {
    --font-size-h1: 2.5rem;
    --chart-height: 400px;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  :root {
    --container-max-width: 1140px;
  }
}
```

---

## 7. Component Styling Patterns

### 7.1 Navbar

```css
.navbar {
  background-color: var(--navbar-bg);
  border-bottom: 1px solid var(--navbar-border);
  padding: var(--spacing-md) 0;
}

.navbar-brand {
  color: var(--navbar-text);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  text-decoration: none;
}

.navbar-brand:hover {
  color: var(--navbar-text-hover);
}

.navbar-nav .nav-link {
  color: var(--navbar-text);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: color var(--transition-fast);
  text-decoration: none;
}

.navbar-nav .nav-link:hover {
  color: var(--navbar-text-hover);
}

.navbar-nav .nav-link.active {
  color: var(--navbar-active);
  font-weight: var(--font-weight-medium);
  border-bottom: 2px solid var(--navbar-active);
}

/* Mobile hamburger menu */
.navbar-toggler {
  border-color: var(--navbar-text-hover);
  color: var(--navbar-text);
}
```

### 7.2 Buttons

```css
/* Primary Button (Forest Green - Main Brand) */
.btn-primary {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
  cursor: pointer;
}

.btn-primary:hover {
  background-color: var(--btn-primary-hover-bg);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  background-color: var(--btn-primary-active-bg);
  transform: translateY(0);
}

.btn-primary:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}

/* Secondary Button (Teal) */
.btn-secondary {
  background-color: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
}

.btn-secondary:hover {
  background-color: var(--btn-secondary-hover-bg);
}

.btn-secondary:active {
  background-color: var(--btn-secondary-active-bg);
}

.btn-secondary:focus {
  outline: none;
  box-shadow: var(--btn-secondary-focus-shadow);
}

/* Accent Button (Burnt Orange) */
.btn-accent {
  background-color: var(--btn-accent-bg);
  color: var(--btn-accent-text);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
}

.btn-accent:hover {
  background-color: var(--btn-accent-hover-bg);
}

.btn-accent:active {
  background-color: var(--btn-accent-active-bg);
}

.btn-accent:focus {
  outline: none;
  box-shadow: var(--btn-accent-focus-shadow);
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: var(--btn-outline-text);
  border: var(--border-width) solid var(--btn-outline-border);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.btn-outline:hover {
  background-color: var(--btn-outline-hover-bg);
  color: var(--btn-outline-hover-text);
}

/* Disabled Button */
.btn:disabled,
.btn.disabled {
  background-color: var(--btn-disabled-bg);
  color: var(--btn-disabled-text);
  cursor: var(--btn-disabled-cursor);
  opacity: 0.6;
  pointer-events: none;
}
```

### 7.3 Links

```css
a {
  color: var(--link-color);
  text-decoration: var(--link-decoration);
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--link-hover-color);
  text-decoration: var(--link-hover-decoration);
}

a:active {
  color: var(--link-active-color);
}

a:visited {
  color: var(--link-visited-color);
}

a:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 7.4 Form Elements

```css
/* Input Fields */
.form-control {
  background-color: var(--input-bg);
  border: var(--border-width) solid var(--input-border);
  color: var(--input-text);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-control::placeholder {
  color: var(--input-placeholder);
}

.form-control:focus {
  border-color: var(--input-focus-border);
  box-shadow: var(--input-focus-shadow);
  outline: none;
}

.form-control:disabled {
  background-color: var(--input-disabled-bg);
  color: var(--input-disabled-text);
  cursor: not-allowed;
}

/* Error State */
.form-control.is-invalid {
  border-color: var(--input-error-border);
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(255, 99, 132, 0.25);
}

/* Success State */
.form-control.is-valid {
  border-color: var(--input-success-border);
}

.form-control.is-valid:focus {
  box-shadow: 0 0 0 3px rgba(4, 119, 59, 0.25);
}

/* Form Labels */
.form-label {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
}
```

### 7.5 Dashboard Card

```css
.dashboard-card {
  background: var(--color-bg-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-base);
  border: 1px solid var(--color-border-light);
}

.dashboard-card:hover {
  box-shadow: var(--shadow-lg);
}

.dashboard-card__title {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dashboard-card__value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: var(--spacing-sm) 0;
}

.dashboard-card__trend {
  font-size: var(--font-size-sm);
}

.dashboard-card__trend--up {
  color: var(--color-efficiency-good);
}

.dashboard-card__trend--down {
  color: var(--color-efficiency-poor);
}

/* Card with accent border */
.dashboard-card--accent {
  border-left: 4px solid var(--color-accent);
}

.dashboard-card--primary {
  border-left: 4px solid var(--color-primary);
}

.dashboard-card--secondary {
  border-left: 4px solid var(--color-secondary);
}
```

### 7.6 Efficiency Badge

```css
.efficiency-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-pill);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.efficiency-badge--good {
  background-color: var(--color-success-bg);
  color: var(--color-efficiency-good);
  border: 1px solid var(--color-success-border);
}

.efficiency-badge--normal {
  background-color: var(--color-warning-bg);
  color: #B8860B; /* Darker for contrast */
  border: 1px solid var(--color-warning-border);
}

.efficiency-badge--poor {
  background-color: var(--color-danger-bg);
  color: var(--color-efficiency-poor);
  border: 1px solid var(--color-danger-border);
}
```

### 7.7 Timeline Item

```css
.timeline-item {
  position: relative;
  padding-left: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-left: 2px solid var(--color-border);
}

.timeline-marker {
  position: absolute;
  left: -6px;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-bg-card);
}

.timeline-item[data-efficiency="good"] .timeline-marker {
  background-color: var(--color-efficiency-good);
}

.timeline-item[data-efficiency="normal"] .timeline-marker {
  background-color: var(--color-efficiency-normal);
}

.timeline-item[data-efficiency="poor"] .timeline-marker {
  background-color: var(--color-efficiency-poor);
}
```

---

## 8. Chart.js Styling

### 8.1 Default Chart Options

```javascript
const CHART_STYLE_DEFAULTS = {
  // Font
  font: {
    family: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    size: 12,
    weight: 400
  },
  
  // Colors
  colors: {
    grid: '#E9ECEF',
    gridBorder: '#DEE2E6',
    tickText: '#6C757D',
    titleText: '#212529'
  },
  
  // Tooltip
  tooltip: {
    backgroundColor: 'rgba(33, 37, 41, 0.95)',
    titleColor: '#FFFFFF',
    bodyColor: '#FFFFFF',
    borderColor: '#495057',
    borderWidth: 1,
    cornerRadius: 8,
    padding: 12
  }
};
```

### 8.2 Dataset Styling

```javascript
/**
 * Generate dataset style for vehicle
 * @param {string} color - Hex color
 * @param {boolean} filled - Fill area under line
 */
function getDatasetStyle(color, filled = false) {
  return {
    borderColor: color,
    backgroundColor: filled ? `${color}33` : color, // 33 = 20% opacity
    borderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: '#FFFFFF',
    pointBorderColor: color,
    pointBorderWidth: 2,
    tension: 0.3 // Smooth curves
  };
}
```

---

## 9. Dependencies

### External Dependencies

- **DEP-001**: Bootstrap CSS 5.3.x - Base framework
- **DEP-002**: Bootstrap Icons 1.11.x - Icon font
- **DEP-003**: Chart.js 4.x - Charting library

### Internal Dependencies

- **DEP-INT-001**: [spec-architecture-technical.md](./spec-architecture-technical.md) - Technical architecture
- **DEP-INT-002**: [../prd.md](../prd.md) - Product requirements

---

## 10. Validation Criteria

| Criteria | Method | Pass Condition |
|----------|--------|----------------|
| Color Contrast | Chrome DevTools / axe | WCAG AA (4.5:1) |
| Touch Target Size | Manual measurement | >= 44px x 44px |
| CSS Variables Usage | Code review | No hardcoded colors |
| Responsive Breakpoints | Browser resize test | Layout adapts correctly |
| Vehicle Colors Uniqueness | Visual check | 10 distinct colors |

---

## 11. Related Specifications

- [spec-architecture-technical.md](./spec-architecture-technical.md) - Technical implementation details
- [../prd.md](../prd.md) - Product requirements and user stories
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/) - Base framework
- [Chart.js Styling](https://www.chartjs.org/docs/latest/general/options.html) - Chart customization

---

**Document Status**: Ready for Implementation
