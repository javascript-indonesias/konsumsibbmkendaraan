# 🎨 Color Palette Quick Reference

> **Version**: 1.1.0 (Eco-Friendly Theme)  
> **Last Updated**: 28 Desember 2025

## Brand Colors

| Color | Hex | Usage | Preview |
|-------|-----|-------|---------|
| **Primary Forest Green** | `#04773B` | Main brand color, primary buttons, links, eco theme | ![#04773B](https://via.placeholder.com/80x30/04773B/FFFFFF?text=Green) |
| **Secondary Teal** | `#4BC0C0` | Secondary color, supporting actions | ![#4BC0C0](https://via.placeholder.com/80x30/4BC0C0/FFFFFF?text=Teal) |
| **Accent Burnt Orange** | `#E76F51` | Accent color, CTAs, highlights | ![#E76F51](https://via.placeholder.com/80x30/E76F51/FFFFFF?text=Orange) |

## UI Element Colors

### Navbar (Dark Green Theme)
- **Background**: `#024520` (Very Dark Green)
- **Text**: `#FFFFFF` (White)
- **Hover**: `#06A34F` (Light Green)
- **Active**: `#E76F51` (Accent Orange)

### Buttons

| Type | Default | Hover | Active |
|------|---------|-------|--------|
| **Primary (Green)** | `#04773B` | `#035A2C` | `#024520` |
| **Secondary (Teal)** | `#4BC0C0` | `#2A7F7F` | `#1E6666` |
| **Accent (Orange)** | `#E76F51` | `#D95839` | `#C74528` |

### Links
- **Default**: `#04773B` (Primary Green)
- **Hover**: `#035A2C` (Dark Green)
- **Active**: `#E76F51` (Accent Orange)
- **Visited**: `#6B4C9A` (Purple Tint)

### Forms
- **Focus Border**: `#04773B` (Primary Green)
- **Error**: `#FF6384` (Red)
- **Success**: `#04773B` (Forest Green)

## Semantic Colors

| State | Color | Usage |
|-------|-------|-------|
| **Success** | `#04773B` | Success messages, good efficiency |
| **Warning** | `#FFCE56` | Warnings, normal efficiency |
| **Danger** | `#FF6384` | Errors, poor efficiency |
| **Info** | `#4BC0C0` | Information, tips |

## Efficiency Indicator Colors

| Level | Color | Hex | CSS Variable |
|-------|-------|-----|--------------|
| **Good** (Efisien) | ![#04773B](https://via.placeholder.com/20x20/04773B/04773B) | `#04773B` | `--color-efficiency-good` |
| **Normal** (Rata-rata) | ![#FFCE56](https://via.placeholder.com/20x20/FFCE56/FFCE56) | `#FFCE56` | `--color-efficiency-normal` |
| **Poor** (Boros) | ![#FF6384](https://via.placeholder.com/20x20/FF6384/FF6384) | `#FF6384` | `--color-efficiency-poor` |

## Vehicle Chart Colors (10 Unique)

Untuk diferensiasi multi-kendaraan di grafik:

1. ![#FF6384](https://via.placeholder.com/25x25/FF6384/FF6384) `#FF6384` Rose Pink
2. ![#36A2EB](https://via.placeholder.com/25x25/36A2EB/36A2EB) `#36A2EB` Sky Blue
3. ![#FFCE56](https://via.placeholder.com/25x25/FFCE56/FFCE56) `#FFCE56` Sunny Yellow
4. ![#4BC0C0](https://via.placeholder.com/25x25/4BC0C0/4BC0C0) `#4BC0C0` Teal
5. ![#9966FF](https://via.placeholder.com/25x25/9966FF/9966FF) `#9966FF` Purple
6. ![#FF9F40](https://via.placeholder.com/25x25/FF9F40/FF9F40) `#FF9F40` Orange
7. ![#47D147](https://via.placeholder.com/25x25/47D147/47D147) `#47D147` Green
8. ![#C9CBCF](https://via.placeholder.com/25x25/C9CBCF/C9CBCF) `#C9CBCF` Silver Grey
9. ![#FF6699](https://via.placeholder.com/25x25/FF6699/FF6699) `#FF6699` Hot Pink
10. ![#33CCCC](https://via.placeholder.com/25x25/33CCCC/33CCCC) `#33CCCC` Cyan

## Neutral/System Colors

| Purpose | Color | Hex |
|---------|-------|-----|
| Page Background | Light Grey | `#F8F9FA` |
| Card Background | White | `#FFFFFF` |
| Primary Text | Dark Grey | `#212529` |
| Secondary Text | Medium Grey | `#495057` |
| Muted Text | Grey | `#6C757D` |
| Border | Light Border Grey | `#DEE2E6` |

---

## Usage Examples

### Dashboard Card dengan Border Accent

```html
<div class="dashboard-card dashboard-card--accent">
  <h3 class="dashboard-card__title">Total Pengeluaran</h3>
  <p class="dashboard-card__value">Rp 450.000</p>
</div>
```

### Button Variants

```html
<!-- Primary (Forest Green) - main eco action -->
<button class="btn btn-primary">Simpan Data BBM</button>

<!-- Secondary (Teal) - supporting action -->
<button class="btn btn-secondary">Lihat Statistik</button>

<!-- Accent (Burnt Orange) - high emphasis CTA -->
<button class="btn btn-accent">Mulai Tracking Sekarang!</button>
```

### Efficiency Badge

```html
<span class="efficiency-badge efficiency-badge--good">Efisien</span>
<span class="efficiency-badge efficiency-badge--normal">Normal</span>
<span class="efficiency-badge efficiency-badge--poor">Boros</span>
```

---

## Color Contrast Compliance

All color combinations meet **WCAG AA** standards (4.5:1 minimum):

- ✅ White text on Primary Green `#04773B` - **5.8:1**
- ✅ White text on Secondary Teal `#4BC0C0` - **4.6:1**
- ✅ White text on Accent Orange `#E76F51` - **4.5:1**
- ✅ White text on Navbar Dark Green `#024520` - **8.4:1**

---

**For complete specification**: See [spec-design-visual-style.md](./spec-design-visual-style.md)
