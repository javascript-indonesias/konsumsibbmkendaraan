---
title: Technical Architecture & Implementation Specification
version: 1.0.0
date_created: 2025-12-24
last_updated: 2025-12-28
owner: Development Team
tags: [architecture, implementation, technical, javascript, vite]
---

# Technical Architecture & Implementation

## Document Information

- **Document Type**: Technical Specification
- **Version**: 1.0.0
- **Last Updated**: 28 Desember 2025 (JavaScript Consistency Review)
- **Related PRD**: [../prd.md](../prd.md)
- **Related Design Spec**: [spec-design-visual-style.md](./spec-design-visual-style.md)
- **Status**: Draft - Ready for Development

---

## 1. Architecture Overview

### 1.1 System Architecture

Aplikasi ini menggunakan **Client-Side Architecture** dengan pattern **MVC-like** sederhana:

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                  │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │     View     │  │  Controller  │  │   Model   │ │
│  │  (HTML/CSS)  │◄─┤(JS Business  │◄─┤(localStorage││
│  │              │  │    Logic)    │  │  Manager)  │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│         │                  │                │       │
│         └──────────────────┼────────────────┘       │
│                            │                        │
│                   ┌────────▼────────┐               │
│                   │   Chart.js      │               │
│                   │   (Rendering)   │               │
│                   └─────────────────┘               │
└─────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Markup** | HTML5 | - | Semantic structure |
| **Styling** | Bootstrap CSS | 5.3.x | Responsive UI framework |
| **Styling** | Custom CSS | - | Brand-specific styles |
| **Logic** | Vanilla JavaScript | ES6+ | Business logic & DOM manipulation |
| **Storage** | localStorage API | - | Client-side data persistence |
| **Charts** | Chart.js | 4.x | Data visualization |
| **Icons** | Bootstrap Icons | 1.11.x | UI icons |
| **Build Tool** | Vite.js | 5.x | Module bundler, dev server, HMR |

### 1.3 Design Principles

- **Mobile-First**: Base styles untuk mobile, progressive enhancement untuk desktop
- **Offline-First**: Semua fitur berfungsi tanpa internet
- **Progressive Enhancement**: Core functionality tanpa JavaScript (fallback)
- **Separation of Concerns**: HTML (structure), CSS (presentation), JS (behavior)
- **Zero Dependencies on Backend**: Pure client-side application

---

## 2. File Structure

### 2.1 Project Organization (Vite.js)

```
konsumsi-bbm-kendaraan/
│
├── index.html                 # Entry point (Dashboard)
├── riwayat.html              # Riwayat pengisian
├── tambah.html               # Form tambah pengisian BBM
├── statistik.html            # Halaman grafik & statistik
├── pengaturan.html           # Settings & data management
├── kendaraan.html            # Manajemen kendaraan
│
├── src/
│   ├── main.js               # Main entry point (imported by index.html)
│   ├── styles/
│   │   └── main.css          # Main CSS (imports Bootstrap + custom)
│   │
│   ├── modules/
│   │   ├── storage.js        # localStorage abstraction layer
│   │   ├── vehicle.js        # Vehicle CRUD operations
│   │   ├── fuelLog.js        # Fuel log CRUD operations
│   │   ├── calculator.js     # Consumption calculation logic
│   │   ├── chart-config.js   # Chart.js configurations
│   │   ├── csv.js            # CSV export/import
│   │   └── utils.js          # Utility functions (date, currency)
│   │
│   ├── components/
│   │   ├── dashboard.js      # Dashboard logic
│   │   ├── timeline.js       # Timeline rendering
│   │   ├── statistics.js     # Statistics page logic
│   │   ├── onboarding.js     # First-time user flow
│   │   └── form-validation.js# Form validation
│   │
│   └── pages/                # Page-specific entry scripts
│       ├── riwayat.js
│       ├── tambah.js
│       ├── statistik.js
│       ├── pengaturan.js
│       └── kendaraan.js
│
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── empty-states/     # Illustrations untuk empty state
│   └── data/
│       └── sample-data.json  # Sample data untuk demo
│
├── docs/
│   ├── prd.md                # Product Requirements Document
│   ├── technical-spec.md     # This document
│   └── api-reference.md      # Internal module API documentation
│
├── vite.config.js            # Vite configuration
├── package.json              # NPM dependencies & scripts
├── .gitignore
└── README.md

```

### 2.1.1 Vite Configuration

**`vite.config.js`**:
```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Multi-Page Application setup
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        riwayat: resolve(__dirname, 'riwayat.html'),
        tambah: resolve(__dirname, 'tambah.html'),
        statistik: resolve(__dirname, 'statistik.html'),
        pengaturan: resolve(__dirname, 'pengaturan.html'),
        kendaraan: resolve(__dirname, 'kendaraan.html'),
      },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,  // true for development
  },
  
  // Development server
  server: {
    port: 3000,
    open: true,
    host: true,  // Allow network access
  },
  
  // Preview server (for testing production build)
  preview: {
    port: 4173,
  },
  
  // Resolve aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@modules': resolve(__dirname, 'src/modules'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
});
```

**`package.json`**:
```json
{
  "name": "konsumsi-bbm-kendaraan",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.4.0"
  },
  "dependencies": {
    "bootstrap": "^5.3.2",
    "bootstrap-icons": "^1.11.0",
    "chart.js": "^4.4.0"
  }
}
```

### 2.1.2 HTML Entry Point Structure

**`index.html`** (Example):
```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Konsumsi BBM Kendaraan - Dashboard</title>
  <!-- Vite will inject CSS here -->
</head>
<body>
  <div id="app">
    <!-- Page content -->
  </div>
  
  <!-- Vite entry point -->
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**`src/main.js`** (Main Entry):
```javascript
// Import styles
import './styles/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import modules
import { StorageManager } from '@modules/storage.js';
import { VehicleManager } from '@modules/vehicle.js';
import { OnboardingManager } from '@components/onboarding.js';

// Initialize app
const storageManager = new StorageManager();
const vehicleManager = new VehicleManager(storageManager);

// Check for onboarding
if (shouldShowOnboarding()) {
  const onboarding = new OnboardingManager();
  onboarding.start();
} else {
  initDashboard();
}
```

### 2.2 Naming Conventions

- **Files**: `kebab-case.html`, `kebab-case.js`
- **CSS Classes**: `kebab-case` (Bootstrap convention)
- **JavaScript Variables**: `camelCase`
- **JavaScript Constants**: `UPPER_SNAKE_CASE`
- **JavaScript Functions**: `camelCase` (verbs: `calculateConsumption()`)
- **JavaScript Classes**: `PascalCase` (nouns: `VehicleManager`)

---

## 3. Data Models

### 3.1 localStorage Schema

**Key**: `bbm_app_data`

```javascript
/**
 * @typedef {Object} AppData
 * @property {string} version - Schema version untuk migration
 * @property {Vehicle[]} vehicles - Array of vehicles
 * @property {FuelLog[]} fuelLogs - Array of fuel logs
 * @property {Settings} settings - Application settings
 */

/**
 * @typedef {Object} Vehicle
 * @property {string} id - UUID v4
 * @property {string} name - "Honda Beat", max 50 chars
 * @property {'motor'|'mobil'} type - Vehicle type
 * @property {number} year - 1900-9999
 * @property {string} plateNumber - "B 1234 XYZ", max 15 chars
 * @property {string} color - Hex color "#FF6384"
 * @property {string} createdAt - ISO 8601 timestamp
 * @property {string} [updatedAt] - ISO 8601 timestamp (optional)
 */

/**
 * @typedef {Object} FuelLog
 * @property {string} id - UUID v4
 * @property {string} vehicleId - FK to Vehicle.id
 * @property {string} date - YYYY-MM-DD
 * @property {number} liters - Decimal, max 2 places (999.99)
 * @property {number} totalPrice - Integer, Rupiah
 * @property {number} odometer - Integer, kilometers
 * @property {string} [fuelType] - "Pertalite", "Pertamax", etc. (optional)
 * @property {string} [notes] - Max 200 chars (optional)
 * @property {string} createdAt - ISO 8601 timestamp
 * @property {string} [updatedAt] - ISO 8601 timestamp (optional)
 */

/**
 * @typedef {Object} Settings
 * @property {string[]} colorPalette - 10 hex colors
 * @property {'light'|'dark'} [theme] - Future enhancement (optional)
 * @property {string} currency - Default: "IDR"
 * @property {string} [defaultVehicleId] - Last selected vehicle (optional)
 */
```

### 3.2 Computed Data Structures

Data yang dihitung runtime (tidak disimpan):

```javascript
/**
 * @typedef {Object} ConsumptionData
 * @property {string} fuelLogId
 * @property {number|null} kmPerLiter - null jika tidak bisa dihitung
 * @property {number} pricePerLiter
 * @property {number|null} distanceTraveled
 * @property {'good'|'normal'|'poor'|null} efficiency
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalExpenseThisMonth
 * @property {number} totalExpenseAllTime
 * @property {number} averageConsumption
 * @property {number} totalDistance
 * @property {number} totalFuelLogs
 * @property {number} averagePricePerFill
 * @property {number} bestConsumption
 * @property {number} worstConsumption
 */

/**
 * @typedef {Object} ChartDataset
 * @property {string} vehicleId
 * @property {string} vehicleName
 * @property {string} color
 * @property {ChartDataPoint[]} data
 */

/**
 * @typedef {Object} ChartDataPoint
 * @property {string|Date} x - Time axis
 * @property {number} y - Value (consumption or expense)
 */
```

---

## 4. Module Specifications

### 4.1 Storage Module (`storage.js`)

**Purpose**: Abstraction layer untuk localStorage dengan error handling dan versioning.

```javascript
class StorageManager {
  constructor(storageKey = 'bbm_app_data') {
    this.storageKey = storageKey;
  }
  
  /**
   * Initialize storage dengan default data
   */
  init() {}
  
  /**
   * Get all data
   * @returns {AppData|null}
   */
  getData() {}
  
  /**
   * Save all data, returns success
   * @param {AppData} data
   * @returns {boolean}
   */
  setData(data) {}
  
  /**
   * Migration
   * @param {string} oldVersion
   * @param {string} newVersion
   * @returns {boolean}
   */
  migrateSchema(oldVersion, newVersion) {}
  
  /**
   * Export untuk CSV/JSON download
   * @returns {string}
   */
  exportToJSON() {}
  
  /**
   * Import dengan validation
   * @param {string} jsonString
   * @returns {boolean}
   */
  importFromJSON(jsonString) {}
  
  /**
   * Reset aplikasi
   * @returns {boolean}
   */
  clearAllData() {}
  
  /**
   * Check localStorage support
   * @returns {boolean}
   */
  isStorageAvailable() {}
  
  /**
   * Bytes used
   * @returns {number}
   */
  getStorageUsage() {}
}
```

**Implementation Notes**:
- Wrap semua `localStorage` calls dalam `try-catch`
- Handle `QuotaExceededError` gracefully
- Validate data structure sebelum `setItem`
- Auto-backup ke temporer sebelum overwrite

### 4.1.1 CSV Module (`csv.js`)

**Purpose**: Handle export dan import data dalam format CSV untuk backup dan migration.

```javascript
class CSVManager {
  /**
   * Generate CSV string
   * @param {AppData} data
   * @returns {string}
   */
  exportToCSV(data) {}
  
  /**
   * Trigger file download
   * @param {string} filename
   */
  downloadCSV(filename) {}
  
  /**
   * Parse CSV to objects
   * @param {string} csvString
   * @returns {Object} ParsedData
   */
  parseCSV(csvString) {}
  
  /**
   * Validate CSV format
   * @param {Object} parsed
   * @returns {Object} ValidationResult
   */
  validateCSVFormat(parsed) {}
  
  /**
   * Preview import data
   * @param {Object} parsed
   * @returns {Object} PreviewData
   */
  previewImport(parsed) {}
  
  /**
   * Merge with existing data
   * @param {Object} parsed
   * @returns {Object} ImportResult
   */
  importMerge(parsed) {}
  
  /**
   * Replace all data
   * @param {Object} parsed
   * @returns {Object} ImportResult
   */
  importReplace(parsed) {}
}
```

**CSV Export Format**:

| Column | Type | Format | Example | Required |
|--------|------|--------|---------|----------|
| vehicle_name | string | - | Honda Beat | Yes |
| vehicle_type | string | motor/mobil | motor | Yes |
| vehicle_plate | string | - | B 1234 XYZ | No |
| date | string | YYYY-MM-DD | 2024-01-15 | Yes |
| liters | decimal | dot separator | 4.50 | Yes |
| total_price | integer | no separator | 50000 | Yes |
| odometer | integer | no separator | 15000 | Yes |
| fuel_type | string | - | Pertalite | No |
| notes | string | quoted if comma | "catatan, ini" | No |
| km_per_liter | decimal | dot separator | 45.50 | Calculated |

**Export Configuration**:
```javascript
const CSV_CONFIG = {
  delimiter: ',',
  encoding: 'UTF-8',
  bomPrefix: '\uFEFF',  // UTF-8 BOM for Excel compatibility
  lineEnding: '\r\n',
  dateFormat: 'YYYY-MM-DD',
  decimalSeparator: '.',
  quoteFields: ['notes', 'vehicle_name']  // Fields that may contain commas
};
```

**Import Validation Rules**:
```javascript
const CSV_IMPORT_VALIDATION = {
  requiredColumns: ['vehicle_name', 'date', 'liters', 'total_price', 'odometer'],
  optionalColumns: ['vehicle_type', 'vehicle_plate', 'fuel_type', 'notes'],
  dateFormat: /^\d{4}-\d{2}-\d{2}$/,
  maxRows: 10000,  // Prevent memory issues
  
  rowValidation: (row, index) => {
    const errors = [];
    if (!row.vehicle_name) errors.push(`Row ${index}: vehicle_name required`);
    if (!CSV_IMPORT_VALIDATION.dateFormat.test(row.date)) {
      errors.push(`Row ${index}: invalid date format`);
    }
    if (isNaN(parseFloat(row.liters)) || parseFloat(row.liters) <= 0) {
      errors.push(`Row ${index}: invalid liters value`);
    }
    return errors;
  }
};
```

**Import Preview UI**:
```html
<div id="importPreview" class="modal">
  <div class="modal-header">
    <h5>Preview Import Data</h5>
  </div>
  <div class="modal-body">
    <p>Ditemukan <strong id="rowCount">0</strong> catatan pengisian.</p>
    <table id="previewTable" class="table table-sm">
      <!-- First 10 rows preview -->
    </table>
    <div id="importErrors" class="alert alert-danger d-none"></div>
  </div>
  <div class="modal-footer">
    <div class="form-check form-check-inline">
      <input type="radio" id="importMerge" name="importMode" value="merge" checked>
      <label for="importMerge">Gabungkan dengan data existing</label>
    </div>
    <div class="form-check form-check-inline">
      <input type="radio" id="importReplace" name="importMode" value="replace">
      <label for="importReplace">Ganti semua data</label>
    </div>
    <button id="confirmImport" class="btn btn-primary">Import</button>
  </div>
</div>
```

**Merge vs Replace Logic**:
```javascript
function importMerge(parsedData) {
  const existing = storageManager.getData();
  
  parsedData.rows.forEach(row => {
    // Find or create vehicle
    let vehicle = existing.vehicles.find(v => v.name === row.vehicle_name);
    if (!vehicle) {
      vehicle = vehicleManager.createVehicle({
        name: row.vehicle_name,
        type: row.vehicle_type || 'motor',
        plateNumber: row.vehicle_plate || ''
      });
      existing.vehicles.push(vehicle);
    }
    
    // Check for duplicate (same vehicle, date, odometer)
    const isDuplicate = existing.fuelLogs.some(log => 
      log.vehicleId === vehicle.id && 
      log.date === row.date && 
      log.odometer === row.odometer
    );
    
    if (!isDuplicate) {
      existing.fuelLogs.push({
        id: generateUUID(),
        vehicleId: vehicle.id,
        date: row.date,
        liters: parseFloat(row.liters),
        totalPrice: parseInt(row.total_price),
        odometer: parseInt(row.odometer),
        fuelType: row.fuel_type || '',
        notes: row.notes || '',
        createdAt: new Date().toISOString()
      });
    }
  });
  
  return storageManager.setData(existing);
}

function importReplace(parsedData) {
  // Confirm dengan user sebelum replace
  const newData = {
    version: APP_VERSION,
    vehicles: [],
    fuelLogs: [],
    settings: storageManager.getData()?.settings || defaultSettings
  };
  
  // Group by vehicle, create vehicles first
  const vehicleMap = new Map();
  parsedData.rows.forEach(row => {
    if (!vehicleMap.has(row.vehicle_name)) {
      const vehicle = {
        id: generateUUID(),
        name: row.vehicle_name,
        type: row.vehicle_type || 'motor',
        plateNumber: row.vehicle_plate || '',
        color: getNextColor(vehicleMap.size),
        createdAt: new Date().toISOString()
      };
      vehicleMap.set(row.vehicle_name, vehicle);
      newData.vehicles.push(vehicle);
    }
  });
  
  // Create fuel logs
  parsedData.rows.forEach(row => {
    const vehicle = vehicleMap.get(row.vehicle_name);
    newData.fuelLogs.push({
      id: generateUUID(),
      vehicleId: vehicle.id,
      date: row.date,
      liters: parseFloat(row.liters),
      totalPrice: parseInt(row.total_price),
      odometer: parseInt(row.odometer),
      fuelType: row.fuel_type || '',
      notes: row.notes || '',
      createdAt: new Date().toISOString()
    });
  });
  
  return storageManager.setData(newData);
}
```

### 4.2 Vehicle Module (`vehicle.js`)

```javascript
/**
 * @typedef {Object} VehicleStats
 * @property {number} totalExpense
 * @property {number} averageConsumption
 * @property {number} totalFuelLogs
 * @property {string|null} lastFillDate
 */

class VehicleManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
  }
  
  /**
   * Create vehicle
   * @param {Partial<Vehicle>} vehicleData
   * @returns {Vehicle|null}
   */
  createVehicle(vehicleData) {}
  
  /**
   * @param {string} id
   * @returns {Vehicle|null}
   */
  getVehicleById(id) {}
  
  /**
   * @returns {Vehicle[]}
   */
  getAllVehicles() {}
  
  /**
   * @param {string} id
   * @param {Partial<Vehicle>} updates
   * @returns {boolean}
   */
  updateVehicle(id, updates) {}
  
  /**
   * Cascade delete fuel logs
   * @param {string} id
   * @returns {boolean}
   */
  deleteVehicle(id) {}
  
  /**
   * Auto-assign dari color palette
   * @param {Vehicle} vehicle
   * @returns {string}
   */
  assignColor(vehicle) {}
  
  /**
   * @param {string} vehicleId
   * @returns {VehicleStats}
   */
  getVehicleStats(vehicleId) {}
  
  /**
   * @param {Partial<Vehicle>} data
   * @returns {Object} ValidationResult
   */
  validateVehicleData(data) {}
}
```

### 4.3 Fuel Log Module (`fuelLog.js`)

```javascript
/**
 * @typedef {Object} QueryOptions
 * @property {'date'|'odometer'} [sortBy]
 * @property {'asc'|'desc'} [sortOrder]
 * @property {number} [limit]
 * @property {{start: string, end: string}} [dateRange]
 */

class FuelLogManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
  }
  
  /**
   * @param {Partial<FuelLog>} logData
   * @returns {FuelLog|null}
   */
  createFuelLog(logData) {}
  
  /**
   * @param {string} id
   * @returns {FuelLog|null}
   */
  getFuelLogById(id) {}
  
  /**
   * @param {string} vehicleId
   * @param {QueryOptions} [options]
   * @returns {FuelLog[]}
   */
  getFuelLogsByVehicle(vehicleId, options) {}
  
  /**
   * @param {string} id
   * @param {Partial<FuelLog>} updates
   * @returns {boolean}
   */
  updateFuelLog(id, updates) {}
  
  /**
   * @param {string} id
   * @returns {boolean}
   */
  deleteFuelLog(id) {}
  
  /**
   * @param {FuelLog} currentLog
   * @param {FuelLog} previousLog
   * @returns {number|null}
   */
  calculateConsumption(currentLog, previousLog) {}
  
  /**
   * @param {FuelLog} log
   * @returns {number}
   */
  calculatePricePerLiter(log) {}
  
  /**
   * @param {number} kmPerLiter
   * @param {string} vehicleType
   * @returns {'good'|'normal'|'poor'}
   */
  getConsumptionEfficiency(kmPerLiter, vehicleType) {}
}
```

### 4.4 Calculator Module (`calculator.js`)

**Pure functions** untuk perhitungan:

```javascript
/**
 * Consumption calculation
 * @param {number} distanceKm
 * @param {number} liters
 * @returns {number}
 */
function calculateKmPerLiter(distanceKm, liters) {
  return distanceKm / liters;
}

/**
 * Calculate average consumption
 * @param {FuelLog[]} fuelLogs
 * @returns {number}
 */
function calculateAverageConsumption(fuelLogs) {}

/**
 * Calculate total expense
 * @param {FuelLog[]} fuelLogs
 * @param {{start: string, end: string}} [dateRange]
 * @returns {number}
 */
function calculateTotalExpense(fuelLogs, dateRange) {}

/**
 * Calculate monthly trend
 * @param {FuelLog[]} fuelLogs
 * @returns {Array<{month: string, value: number}>}
 */
function calculateMonthlyTrend(fuelLogs) {}

// Efficiency thresholds (based on vehicle type)
const EFFICIENCY_THRESHOLDS = {
  motor: { good: 45, normal: 35 },  // km/liter
  mobil: { good: 15, normal: 10 }
};

/**
 * Determine efficiency level
 * @param {number} kmPerLiter
 * @param {string} vehicleType
 * @returns {string}
 */
function determineEfficiency(kmPerLiter, vehicleType) {
  const thresholds = EFFICIENCY_THRESHOLDS[vehicleType];
  if (kmPerLiter >= thresholds.good) return 'good';
  if (kmPerLiter >= thresholds.normal) return 'normal';
  return 'poor';
}
```

### 4.5 Chart Configuration Module (`chart-config.js`)

```javascript
class ChartConfigManager {
  /**
   * Get line chart configuration
   * @param {ChartDataset[]} datasets
   * @param {Object} options - ChartOptions
   * @returns {Object}
   */
  getLineChartConfig(datasets, options) {}
  
  /**
   * Get bar chart configuration
   * @param {ChartDataset[]} datasets
   * @param {Object} options - ChartOptions
   * @returns {Object}
   */
  getBarChartConfig(datasets, options) {}
  
  /**
   * Get horizontal bar configuration
   * @param {Array<Object>} data - ComparisonData
   * @returns {Object}
   */
  getHorizontalBarConfig(data) {}
  
  /**
   * Format currency tooltip
   * @param {number} value
   * @returns {string} - "Rp 50.000"
   */
  formatCurrencyTooltip(value) {}
  
  /**
   * Format consumption tooltip
   * @param {number} value
   * @returns {string} - "45.5 km/L"
   */
  formatConsumptionTooltip(value) {}
  
  /**
   * Get responsive options
   * @param {boolean} isMobile
   * @returns {Object}
   */
  getResponsiveOptions(isMobile) {}
  
  /**
   * Get vehicle color
   * @param {string} vehicleId
   * @returns {string}
   */
  getVehicleColor(vehicleId) {}
}

// Default Chart.js options
const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top',
      onClick: handleLegendClick  // Toggle series visibility
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
};
```

---

## 5. UI Components Specification

### 5.1 Dashboard Cards

**HTML Structure**:
```html
<div class="stat-card">
  <div class="stat-icon">
    <i class="bi bi-fuel-pump"></i>
  </div>
  <div class="stat-content">
    <h6 class="stat-label">Total Pengeluaran Bulan Ini</h6>
    <p class="stat-value">Rp 500.000</p>
    <span class="stat-change positive">+15% dari bulan lalu</span>
  </div>
</div>
```

**CSS Variables** (`styles.css`):
```css
:root {
  /* Brand Colors */
  --primary-color: #4A90E2;
  --secondary-color: #50C878;
  --accent-color: #FF6B6B;
  
  /* Status Colors */
  --good-color: #4CAF50;
  --normal-color: #FFC107;
  --poor-color: #F44336;
  
  /* Neutral */
  --bg-light: #F8F9FA;
  --text-dark: #212529;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Borders */
  --border-radius: 8px;
  --border-radius-lg: 12px;
}
```

### 5.2 Timeline Component

**Structure**:
```html
<div class="timeline">
  <div class="timeline-item" data-efficiency="good">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <div class="timeline-header">
        <span class="date">15 Jan 2025</span>
        <span class="consumption good">45.5 km/L</span>
      </div>
      <div class="timeline-body">
        <p><strong>4.5 L</strong> • Rp 50.000 • 15.000 km</p>
        <span class="fuel-type badge">Pertalite</span>
      </div>
      <div class="timeline-actions">
        <button class="btn-edit"><i class="bi bi-pencil"></i></button>
        <button class="btn-delete"><i class="bi bi-trash"></i></button>
      </div>
    </div>
  </div>
</div>
```

**Efficiency-based Styling**:
```css
.timeline-item[data-efficiency="good"] .timeline-marker {
  background-color: var(--good-color);
}
.timeline-item[data-efficiency="normal"] .timeline-marker {
  background-color: var(--normal-color);
}
.timeline-item[data-efficiency="poor"] .timeline-marker {
  background-color: var(--poor-color);
}
```

**Scroll/Pagination for Long History** (PRD Section 4.4):
```javascript
const TIMELINE_CONFIG = {
  initialLoadCount: 20,      // First render
  loadMoreCount: 10,         // Per scroll batch
  scrollThreshold: 0.8       // Trigger at 80% scroll
};

class TimelineManager {
  constructor() {
    this.currentPage = 1;
    this.isLoading = false;
    this.hasMore = true;
  }
  
  // Initial load
  initialize(vehicleId = null) {
    const logs = this.fetchLogs(1, TIMELINE_CONFIG.initialLoadCount, vehicleId);
    this.renderTimeline(logs);
    this.setupInfiniteScroll();
  }
  
  fetchLogs(page, limit, vehicleId = null) {
    const allLogs = fuelLogManager.getFuelLogsByVehicle(vehicleId, {
      sortBy: 'date',
      sortOrder: 'desc'
    });
    
    const start = (page - 1) * limit;
    const end = start + limit;
    this.hasMore = end < allLogs.length;
    
    return allLogs.slice(start, end);
  }
  
  // Infinite scroll with IntersectionObserver
  setupInfiniteScroll() {
    const sentinel = document.getElementById('timelineSentinel');
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
        this.loadMore();
      }
    }, { threshold: TIMELINE_CONFIG.scrollThreshold });
    
    if (sentinel) observer.observe(sentinel);
  }
  
  loadMore() {
    this.isLoading = true;
    this.showLoadingIndicator();
    
    this.currentPage++;
    const moreLogs = this.fetchLogs(this.currentPage, TIMELINE_CONFIG.loadMoreCount);
    this.appendToTimeline(moreLogs);
    
    this.isLoading = false;
    this.hideLoadingIndicator();
    
    if (!this.hasMore) {
      this.showEndMessage();
    }
  }
  
  showLoadingIndicator() {
    document.getElementById('timelineLoading').classList.remove('d-none');
  }
  
  hideLoadingIndicator() {
    document.getElementById('timelineLoading').classList.add('d-none');
  }
  
  showEndMessage() {
    document.getElementById('timelineEnd').classList.remove('d-none');
  }
}
```

**Timeline Loading & End State UI**:
```html
<div class="timeline" id="timelineContainer">
  <!-- Timeline items rendered here -->
</div>

<!-- Sentinel for infinite scroll -->
<div id="timelineSentinel"></div>

<!-- Loading indicator -->
<div id="timelineLoading" class="text-center py-3 d-none">
  <div class="spinner-border spinner-border-sm" role="status">
    <span class="visually-hidden">Memuat...</span>
  </div>
  <span class="ms-2">Memuat data...</span>
</div>

<!-- End of timeline message -->
<div id="timelineEnd" class="text-center py-3 text-muted d-none">
  <i class="bi bi-check-circle"></i> Semua data sudah ditampilkan
</div>
```

### 5.3 Filter Controls

**Vehicle Filter**:
```html
<div class="filter-group" id="vehicleFilterGroup">
  <label>Kendaraan</label>
  <select id="vehicleFilter" class="form-select">
    <option value="all">Tampilkan Semua</option>
    <option value="uuid-1">Honda Beat</option>
    <option value="uuid-2">Toyota Avanza</option>
  </select>
</div>
```

**Vehicle Filter Visibility Logic** (PRD BBM-010):
```javascript
// Hide filter jika hanya ada 1 kendaraan
function updateVehicleFilterVisibility() {
  const vehicles = vehicleManager.getAllVehicles();
  const filterGroup = document.getElementById('vehicleFilterGroup');
  
  if (vehicles.length <= 1) {
    filterGroup.classList.add('d-none');
  } else {
    filterGroup.classList.remove('d-none');
    populateVehicleFilter(vehicles);
  }
}

function populateVehicleFilter(vehicles) {
  const select = document.getElementById('vehicleFilter');
  select.innerHTML = '<option value="all">Tampilkan Semua</option>';
  
  vehicles.forEach(vehicle => {
    const option = document.createElement('option');
    option.value = vehicle.id;
    option.textContent = vehicle.name;
    option.style.color = vehicle.color;  // Optional: color indicator
    select.appendChild(option);
  });
}

// Call on page load and after vehicle CRUD
updateVehicleFilterVisibility();
```

**Time Range Filter**:
```html
<div class="btn-group btn-group-time-range" role="group">
  <input type="radio" class="btn-check" name="timeRange" id="range3m" value="3m" checked>
  <label class="btn btn-outline-primary" for="range3m">3 Bulan</label>
  
  <input type="radio" class="btn-check" name="timeRange" id="range6m" value="6m">
  <label class="btn btn-outline-primary" for="range6m">6 Bulan</label>
  
  <input type="radio" class="btn-check" name="timeRange" id="range1y" value="1y">
  <label class="btn btn-outline-primary" for="range1y">1 Tahun</label>
  
  <input type="radio" class="btn-check" name="timeRange" id="rangeAll" value="all">
  <label class="btn btn-outline-primary" for="rangeAll">Semua</label>
  
  <input type="radio" class="btn-check" name="timeRange" id="rangeCustom" value="custom">
  <label class="btn btn-outline-primary" for="rangeCustom">Custom</label>
</div>

<!-- Custom Date Range Picker (shown when "Custom" is selected) -->
<div id="customDateRangeContainer" class="mt-2 d-none">
  <div class="row g-2">
    <div class="col-auto">
      <label for="dateStart" class="form-label">Dari</label>
      <input type="date" class="form-control" id="dateStart">
    </div>
    <div class="col-auto">
      <label for="dateEnd" class="form-label">Sampai</label>
      <input type="date" class="form-control" id="dateEnd">
    </div>
    <div class="col-auto align-self-end">
      <button id="applyDateRange" class="btn btn-primary">Terapkan</button>
    </div>
  </div>
</div>
```

**Custom Date Range Logic**:
```javascript
// Toggle custom date picker visibility
document.querySelectorAll('input[name="timeRange"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const container = document.getElementById('customDateRangeContainer');
    if (e.target.value === 'custom') {
      container.classList.remove('d-none');
    } else {
      container.classList.add('d-none');
      applyTimeRangeFilter(e.target.value);
    }
  });
});

// Apply custom date range
document.getElementById('applyDateRange').addEventListener('click', () => {
  const start = document.getElementById('dateStart').value;
  const end = document.getElementById('dateEnd').value;
  
  if (start && end && new Date(start) <= new Date(end)) {
    applyTimeRangeFilter('custom', { start, end });
  } else {
    showError('Rentang tanggal tidak valid');
  }
});
```

---

### 5.4 Onboarding Component

**Purpose**: Guide first-time users through initial setup (PRD Section 5.1).

**Trigger Condition**:
```javascript
function shouldShowOnboarding() {
  const data = storageManager.getData();
  return !data || !data.vehicles || data.vehicles.length === 0;
}

// On app initialization
if (shouldShowOnboarding()) {
  showOnboardingFlow();
} else {
  showDashboard();
}
```

**Onboarding Flow States**:

```
┌─────────────────┐
│  Welcome Screen │
│  "Selamat Datang"│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Add First Vehicle│
│  (Simplified Form)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Success Screen │
│ "Kendaraan Ditambahkan"│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Prompt: Add First│
│  Fuel Log?      │
│ [Ya] [Nanti]    │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌─────────┐
│Fuel Log││Dashboard │
│ Form  ││(Empty State)│
└───────┘ └─────────┘
```

**Welcome Screen UI**:
```html
<div id="onboardingWelcome" class="onboarding-screen text-center">
  <img src="assets/images/welcome-illustration.svg" alt="Welcome" class="mb-4">
  <h2>Selamat Datang di Konsumsi BBM</h2>
  <p class="text-muted">Catat dan pantau konsumsi bahan bakar kendaraan Anda dengan mudah.</p>
  <button id="startOnboarding" class="btn btn-primary btn-lg mt-3">
    Mulai <i class="bi bi-arrow-right"></i>
  </button>
</div>
```

**Simplified Vehicle Form (Onboarding)**:
```html
<div id="onboardingVehicle" class="onboarding-screen d-none">
  <h4>Tambah Kendaraan Pertama</h4>
  <form id="firstVehicleForm">
    <div class="mb-3">
      <label class="form-label">Nama Kendaraan *</label>
      <input type="text" class="form-control" id="vehicleName" required 
             placeholder="contoh: Honda Beat">
    </div>
    <div class="mb-3">
      <label class="form-label">Jenis *</label>
      <div class="btn-group w-100" role="group">
        <input type="radio" class="btn-check" name="vehicleType" id="typeMotor" value="motor" checked>
        <label class="btn btn-outline-primary" for="typeMotor">
          <i class="bi bi-bicycle"></i> Motor
        </label>
        <input type="radio" class="btn-check" name="vehicleType" id="typeMobil" value="mobil">
        <label class="btn btn-outline-primary" for="typeMobil">
          <i class="bi bi-car-front"></i> Mobil
        </label>
      </div>
    </div>
    <button type="submit" class="btn btn-primary w-100">Simpan Kendaraan</button>
  </form>
</div>
```

**Success & Prompt Screen**:
```html
<div id="onboardingSuccess" class="onboarding-screen d-none text-center">
  <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
  <h4 class="mt-3">Kendaraan Berhasil Ditambahkan!</h4>
  <p class="text-muted">Apakah Anda ingin mencatat pengisian BBM pertama?</p>
  <div class="d-flex justify-content-center gap-2 mt-3">
    <button id="skipTooDashboard" class="btn btn-outline-secondary">Nanti Saja</button>
    <button id="goToFuelLog" class="btn btn-primary">Ya, Catat Sekarang</button>
  </div>
</div>
```

**Onboarding Logic**:
```javascript
class OnboardingManager {
  constructor() {
    this.currentStep = 0;
    this.steps = ['welcome', 'vehicle', 'success'];
  }
  
  start() {
    this.showStep('welcome');
    this.bindEvents();
  }
  
  showStep(stepName) {
    // Hide all screens
    document.querySelectorAll('.onboarding-screen').forEach(el => {
      el.classList.add('d-none');
    });
    // Show current step
    const stepEl = document.getElementById(`onboarding${this.capitalize(stepName)}`);
    stepEl?.classList.remove('d-none');
  }
  
  bindEvents() {
    document.getElementById('startOnboarding')?.addEventListener('click', () => {
      this.showStep('vehicle');
    });
    
    document.getElementById('firstVehicleForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveFirstVehicle();
    });
    
    document.getElementById('skipTooDashboard')?.addEventListener('click', () => {
      this.complete(false);
    });
    
    document.getElementById('goToFuelLog')?.addEventListener('click', () => {
      this.complete(true);
    });
  }
  
  saveFirstVehicle() {
    const name = document.getElementById('vehicleName').value;
    const type = document.querySelector('input[name="vehicleType"]:checked').value;
    
    const vehicle = vehicleManager.createVehicle({ name, type });
    if (vehicle) {
      this.showStep('success');
    }
  }
  
  complete(goToFuelLog) {
    if (goToFuelLog) {
      window.location.href = 'tambah.html';
    } else {
      window.location.href = 'index.html';  // Dashboard with empty state
    }
  }
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
```

**Empty State for Dashboard**:
```html
<div id="dashboardEmpty" class="text-center py-5">
  <img src="assets/images/empty-states/no-data.svg" alt="Belum ada data" class="mb-4" style="max-width: 200px;">
  <h5>Belum ada data pengisian</h5>
  <p class="text-muted">Mulai catat pengisian BBM untuk melihat statistik konsumsi.</p>
  <a href="tambah.html" class="btn btn-primary">
    <i class="bi bi-plus-circle"></i> Tambah Pengisian Pertama
  </a>
</div>
```

---

## 6. Chart.js Implementation

### 6.1 Line Chart (Tren Konsumsi)

**Canvas Setup**:
```html
<div class="chart-container" style="position: relative; height:400px;">
  <canvas id="consumptionTrendChart"></canvas>
</div>
```

**Configuration**:
```javascript
const consumptionChartConfig = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Honda Beat',
        data: [45, 47, 44, 46, 48, 45],
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,  // Smooth curve
        fill: true
      },
      {
        label: 'Toyota Avanza',
        data: [12, 13, 11, 12, 14, 13],
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Tren Konsumsi BBM (km/Liter)',
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        position: 'top',
        onClick: (e, legendItem, legend) => {
          // Toggle dataset visibility
          const index = legendItem.datasetIndex;
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(index);
          meta.hidden = !meta.hidden;
          chart.update();
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} km/L`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Konsumsi (km/Liter)'
        }
      }
    }
  }
};
```

### 6.2 Bar Chart (Pengeluaran)

```javascript
const expenseChartConfig = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Honda Beat',
        data: [200000, 250000, 220000, 240000, 260000, 230000],
        backgroundColor: '#FF6384'
      },
      {
        label: 'Toyota Avanza',
        data: [600000, 650000, 620000, 640000, 680000, 650000],
        backgroundColor: '#36A2EB'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Pengeluaran BBM per Bulan'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: Rp ${context.parsed.y.toLocaleString('id-ID')}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: false  // Set true untuk stacked bar
      },
      y: {
        stacked: false,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Pengeluaran (Rupiah)'
        },
        ticks: {
          callback: function(value) {
            return 'Rp ' + (value / 1000) + 'K';
          }
        }
      }
    }
  }
};
```

### 6.3 Horizontal Bar Chart (Comparison)

```javascript
const comparisonChartConfig = {
  type: 'bar',
  data: {
    labels: ['Honda Beat', 'Toyota Avanza', 'Yamaha Mio'],
    datasets: [{
      label: 'Rata-rata Konsumsi',
      data: [46, 12.5, 48],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  },
  options: {
    indexAxis: 'y',  // Horizontal bars
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Perbandingan Efisiensi Kendaraan'
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'km/Liter'
        }
      }
    }
  }
};
```

### 6.4 Responsive Behavior

```javascript
function updateChartResponsiveness() {
  const isMobile = window.innerWidth < 768;
  
  // Update all chart instances
  Chart.instances.forEach(chart => {
    if (isMobile) {
      chart.options.plugins.legend.position = 'bottom';
      chart.options.scales.x.ticks.maxRotation = 45;
      chart.options.scales.x.ticks.minRotation = 45;
    } else {
      chart.options.plugins.legend.position = 'top';
      chart.options.scales.x.ticks.maxRotation = 0;
    }
    chart.update();
  });
}

// Listen to resize
window.addEventListener('resize', debounce(updateChartResponsiveness, 300));
```

---

## 7. Form Validation

### 7.1 Fuel Log Form Validation

**Required Fields**:
- Date: Valid date, not future
- Liters: Positive number, max 2 decimals, range: 0.1 - 999.99
- Total Price: Positive integer, max 9 digits
- Odometer: Positive integer, greater than previous odometer

**Validation Rules**:
```javascript
const FUEL_LOG_VALIDATION = {
  date: {
    required: true,
    maxDate: new Date(),  // Tidak boleh masa depan
    message: 'Tanggal tidak valid'
  },
  liters: {
    required: true,
    type: 'number',
    min: 0.1,
    max: 999.99,
    decimals: 2,
    message: 'Liter harus antara 0.1 - 999.99'
  },
  totalPrice: {
    required: true,
    type: 'integer',
    min: 100,
    max: 999999999,
    message: 'Harga total tidak valid'
  },
  odometer: {
    required: true,
    type: 'integer',
    min: 0,
    custom: (value, context) => {
      // Check against previous odometer
      const previousLog = getPreviousFuelLog(context.vehicleId);
      if (previousLog && value <= previousLog.odometer) {
        return 'Odometer harus lebih besar dari pengisian sebelumnya';
      }
      return null;
    }
  },
  fuelType: {
    required: false,
    maxLength: 30
  },
  notes: {
    required: false,
    maxLength: 200
  }
};
```

**Real-time Validation**:
```javascript
function validateField(field, value, context) {
  const rules = FUEL_LOG_VALIDATION[field];
  const errors = [];
  
  if (rules.required && !value) {
    errors.push(`${field} wajib diisi`);
  }
  
  if (rules.type === 'number' && isNaN(parseFloat(value))) {
    errors.push(rules.message);
  }
  
  if (rules.min && value < rules.min) {
    errors.push(rules.message);
  }
  
  if (rules.custom) {
    const customError = rules.custom(value, context);
    if (customError) errors.push(customError);
  }
  
  return errors;
}
```

---

## 8. Responsive Design

### 8.1 Breakpoints

```css
/* Mobile First Approach */

/* Extra Small (Default - Mobile) */
/* 0px - 575px */

/* Small tablets */
@media (min-width: 576px) { }

/* Tablets */
@media (min-width: 768px) {
  /* Chart legend top position */
  /* 2-column card layout */
}

/* Desktop */
@media (min-width: 992px) {
  /* 3-column card layout */
  /* Sidebar navigation visible */
}

/* Large Desktop */
@media (min-width: 1200px) {
  /* 4-column card layout */
  /* Chart max-width constraints */
}
```

### 8.2 Mobile-Specific Considerations

**Touch Targets**:
- Minimum 44px x 44px untuk semua interactive elements
- Spacing minimal 8px antar touch targets

**Typography**:
```css
/* Mobile */
--font-size-base: 16px;
--font-size-h1: 1.75rem;

/* Desktop */
@media (min-width: 992px) {
  --font-size-h1: 2.5rem;
}
```

**Chart Containers**:
```css
/* Mobile: Full width, fixed height */
.chart-container {
  height: 300px;
  margin-bottom: 2rem;
}

/* Desktop: Constrained width */
@media (min-width: 992px) {
  .chart-container {
    height: 400px;
  }
}
```

---

## 9. Performance Optimization

### 9.1 localStorage Best Practices

```javascript
// Debounced save to prevent excessive writes
const debouncedSave = debounce((data) => {
  storageManager.setData(data);
}, 500);

// Batch operations
function batchUpdateFuelLogs(updates) {
  const data = storageManager.getData();
  updates.forEach(update => {
    const index = data.fuelLogs.findIndex(log => log.id === update.id);
    if (index !== -1) {
      data.fuelLogs[index] = { ...data.fuelLogs[index], ...update };
    }
  });
  storageManager.setData(data);  // Single write
}
```

### 9.2 Chart Performance

```javascript
// Lazy load Chart.js
function loadChartJS() {
  return new Promise((resolve, reject) => {
    if (window.Chart) {
      resolve(window.Chart);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.x/dist/chart.umd.min.js';
    script.onload = () => resolve(window.Chart);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Data aggregation untuk large datasets
function aggregateDataByMonth(fuelLogs) {
  const grouped = {};
  fuelLogs.forEach(log => {
    const month = log.date.substring(0, 7);  // YYYY-MM
    if (!grouped[month]) {
      grouped[month] = { totalLiters: 0, totalPrice: 0, count: 0 };
    }
    grouped[month].totalLiters += log.liters;
    grouped[month].totalPrice += log.totalPrice;
    grouped[month].count++;
  });
  
  return Object.entries(grouped).map(([month, data]) => ({
    month,
    averageConsumption: /* calculate */,
    totalExpense: data.totalPrice
  }));
}
```

### 9.3 DOM Manipulation

```javascript
// Use DocumentFragment untuk bulk inserts
function renderTimeline(fuelLogs) {
  const fragment = document.createDocumentFragment();
  
  fuelLogs.forEach(log => {
    const item = createTimelineItem(log);
    fragment.appendChild(item);
  });
  
  const container = document.getElementById('timelineContainer');
  container.innerHTML = '';  // Clear once
  container.appendChild(fragment);  // Append once
}

// Virtual scrolling untuk timeline panjang (optional enhancement)
```

---

## 10. Testing Strategy

### 10.1 Manual Testing Checklist

**Unit-level Functions**:
- [ ] `calculateKmPerLiter()` dengan berbagai input
- [ ] `determineEfficiency()` untuk motor vs mobil
- [ ] `validateField()` semua field types
- [ ] UUID generation uniqueness

**Integration Tests**:
- [ ] Full CRUD flow: Create vehicle → Add fuel log → Calculate consumption
- [ ] localStorage persistence: Save → Reload page → Data masih ada
- [ ] Multi-vehicle scenario: 3 kendaraan, 10 logs each
- [ ] Filter interaction: Time range changes update charts correctly

**UI/UX Tests**:
- [ ] Responsive behavior di 3 breakpoints (mobile/tablet/desktop)
- [ ] Form validation messages appear & clear correctly
- [ ] Chart tooltips display formatted values
- [ ] Empty states show appropriate messaging

**Edge Cases**:
- [ ] First fuel log (no previous odometer for comparison)
- [ ] Odometer rollover (edge case validation)
- [ ] localStorage full (QuotaExceededError handling)
- [ ] Invalid JSON import (error handling)
- [ ] No data scenarios (empty states)

### 10.2 Browser Compatibility Testing

**Target Browsers**:
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Fallbacks**:
- localStorage not available → Show warning, disable save
- Chart.js load failure → Show static table alternative

### 10.3 Performance Benchmarks

**Target Metrics**:
- Page load (initial): < 2 seconds
- Fuel log creation: < 100ms
- Chart rendering (100 data points): < 500ms
- Chart update on filter: < 200ms
- localStorage read/write: < 50ms

**Testing Tools**:
- Chrome DevTools Performance tab
- Lighthouse audit (target score: 90+)
- Manual stopwatch testing

---

## 11. Deployment & Build (Vite.js)

### 11.1 Development Workflow

**Start Development Server**:
```bash
# Install dependencies (first time only)
npm install

# Start dev server with HMR
npm run dev
```
- Dev server akan berjalan di `http://localhost:3000`
- HMR (Hot Module Replacement) enabled untuk instant refresh
- Browser auto-opens

**Development Server Features**:
- ⚡ Fast HMR untuk CSS dan JS changes
- 📦 ES modules support secara native
- 🔄 Auto-reload saat file berubah
- 🗺️ Source maps untuk debugging

### 11.2 Build for Production

**Build Command**:
```bash
npm run build
```

**Output**:
- `dist/` folder berisi production-ready files
- HTML files di-minify
- JS files bundled dan di-tree-shake
- CSS extracted dan di-minify
- Assets di-optimize dengan hashed filenames

**Preview Production Build**:
```bash
npm run preview
```
- Preview di `http://localhost:4173`
- Test production build sebelum deploy

### 11.3 Deployment Options

**Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo untuk auto-deploy
```

**Option 2: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Option 3: GitHub Pages**

Buat file `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Update `vite.config.js` untuk GitHub Pages:
```javascript
export default defineConfig({
  // Add base path for GitHub Pages
  base: '/konsumsi-bbm-kendaraan/',
  
  // ... rest of config
});
```

### 11.4 Environment Variables (Optional)

**`.env` file** (not committed):
```env
VITE_APP_TITLE=Konsumsi BBM Kendaraan
VITE_APP_VERSION=1.0.0
```

**Usage in code**:
```javascript
const appTitle = import.meta.env.VITE_APP_TITLE;
const appVersion = import.meta.env.VITE_APP_VERSION;
```

---

## 12. Security Considerations

### 12.1 Data Privacy

- ✅ **No Server**: Data tidak pernah meninggalkan browser user
- ✅ **localStorage adalah domain-scoped**: Tidak accessible dari domain lain
- ✅ **No Analytics/Tracking**: Privacy-first approach

### 12.2 Input Sanitization

```javascript
// Sanitize user input (especially notes field)
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;  // Escapes HTML entities
}

// Validate before save
function createFuelLog(rawData) {
  const sanitized = {
    ...rawData,
    notes: sanitizeInput(rawData.notes || ''),
    fuelType: sanitizeInput(rawData.fuelType || '')
  };
  // ... save
}
```

### 12.3 XSS Prevention

- ✅ Never use `innerHTML` dengan user input
- ✅ Use `textContent` atau `createElement`
- ✅ Sanitize sebelum render

---

## 13. Future Enhancements (Out of Scope v1.0)

**Potential Phase 2 Features**:
- PWA dengan Service Worker (offline caching)
- Export ke PDF report
- Dark mode theme
- Multi-language support (i18n)
- Backup ke Google Drive/Dropbox
- Reminder notifications untuk service kendaraan
- Cost prediction based on historical data

---

## 14. API Reference (Internal Modules)

Lihat file terpisah: `api-reference.md` untuk detail lengkap semua function signatures, parameters, dan return values.

**Quick Reference**:
- Storage API: 10 methods
- Vehicle API: 8 methods
- FuelLog API: 12 methods
- Calculator API: 6 pure functions
- Chart Config API: 5 methods
- Utils API: 8 utility functions

---

## Appendix

### A. Visual Style & Design System

> **📎 See separate specification**: [spec/spec-design-visual-style.md](./spec/spec-design-visual-style.md)
> 
> Design specification mencakup:
> - Color Palette (10 vehicle colors + efficiency colors)
> - CSS Variables contract
> - Typography system
> - Spacing dan layout tokens
> - Component styling patterns
> - Chart.js styling defaults

### B. Utility Functions

```javascript
// Date formatting
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Currency formatting
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// UUID v4 generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

---

**Document Status**: Ready for Implementation
**Next Steps**: 
1. Review technical spec dengan team
2. Setup project structure
3. Begin Phase 1 implementation
4. Reference design research dari PRD section 8.5.2

