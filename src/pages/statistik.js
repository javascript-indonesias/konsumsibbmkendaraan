/**
 * Statistik Page Controller
 *
 * Requirements:
 * - Display 3 chart types: Line, Bar, Horizontal Bar
 * - Global filter for time range and vehicle
 * - Summary cards with key metrics
 * - Custom date range picker
 */

import { StorageManager } from "@modules/storage.js";
import { VehicleManager } from "@modules/vehicle.js";
import { FuelLogManager } from "@modules/fuel-log.js";
import { Calculator } from "@modules/calculator.js";
import { formatCurrency } from "@modules/utils.js";

// Initialize managers
const storageManager = new StorageManager();
const vehicleManager = new VehicleManager(storageManager);
const fuelLogManager = new FuelLogManager(storageManager);
const calculator = new Calculator(storageManager);

// DOM Elements
const filterBar = document.getElementById("filterBar");
const timeFilter = document.getElementById("timeFilter");
const vehicleFilter = document.getElementById("vehicleFilter");
const emptyState = document.getElementById("emptyState");

// Summary elements
const totalExpenseEl = document.getElementById("totalExpense");
const bestVehicleEl = document.getElementById("bestVehicle");
const bestVehicleValueEl = document.getElementById("bestVehicleValue");
const worstVehicleEl = document.getElementById("worstVehicle");
const worstVehicleValueEl = document.getElementById("worstVehicleValue");

// Chart canvases
const consumptionTrendCanvas = document.getElementById("consumptionTrendChart");
const monthlyExpenseCanvas = document.getElementById("monthlyExpenseChart");
const vehicleComparisonCanvas = document.getElementById(
  "vehicleComparisonChart"
);

// Date picker elements
const datePickerModal = document.getElementById("datePickerModal");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const closeDatePicker = document.getElementById("closeDatePicker");
const cancelDatePicker = document.getElementById("cancelDatePicker");
const applyDatePicker = document.getElementById("applyDatePicker");

// Chart instances
let lineChart = null;
let barChart = null;
let hBarChart = null;

// Filter state
let currentTimeFilter = "all";
let currentVehicleFilter = "";
let customStartDate = null;
let customEndDate = null;

/**
 * Initialize page
 */
function initPage() {
  storageManager.init(true);

  // Check for data
  const fuelLogs = fuelLogManager.getAll();

  if (fuelLogs.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();

  // Populate vehicle filter
  populateVehicleFilter();

  // Setup event listeners
  setupEventListeners();

  // Render all components
  renderAll();
}

/**
 * Populate vehicle filter dropdown (TASK-004)
 */
function populateVehicleFilter() {
  const vehicles = vehicleManager.getAllVehicles();

  vehicleFilter.innerHTML = '<option value="">Semua Kendaraan</option>';

  vehicles.forEach((vehicle) => {
    const option = document.createElement("option");
    option.value = vehicle.id;
    option.textContent = `${vehicle.name} (${vehicle.type})`;
    vehicleFilter.appendChild(option);
  });
}

/**
 * Setup event listeners (TASK-005)
 */
function setupEventListeners() {
  // Time filter change
  timeFilter.addEventListener("change", handleTimeFilterChange);

  // Vehicle filter change
  vehicleFilter.addEventListener("change", handleVehicleFilterChange);

  // Date picker events
  closeDatePicker?.addEventListener("click", closeDatePickerModal);
  cancelDatePicker?.addEventListener("click", closeDatePickerModal);
  applyDatePicker?.addEventListener("click", applyCustomDateRange);

  // Sticky filter bar
  setupStickyFilterBar();
}

/**
 * Handle time filter change
 */
function handleTimeFilterChange() {
  const value = timeFilter.value;

  if (value === "custom") {
    openDatePickerModal();
    return;
  }

  currentTimeFilter = value;
  customStartDate = null;
  customEndDate = null;
  renderAll();
}

/**
 * Handle vehicle filter change
 */
function handleVehicleFilterChange() {
  currentVehicleFilter = vehicleFilter.value;
  renderAll();
}

/**
 * Setup sticky filter bar
 */
function setupStickyFilterBar() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      filterBar.classList.add("filter-bar--sticky");
    } else {
      filterBar.classList.remove("filter-bar--sticky");
    }
  });
}

/**
 * Open date picker modal
 */
function openDatePickerModal() {
  datePickerModal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  // Set default dates
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  startDateInput.value = threeMonthsAgo.toISOString().split("T")[0];
  endDateInput.value = today.toISOString().split("T")[0];
}

/**
 * Close date picker modal
 */
function closeDatePickerModal() {
  datePickerModal.classList.add("hidden");
  document.body.classList.remove("modal-open");

  // Reset to previous filter if cancelled
  if (!customStartDate) {
    timeFilter.value = currentTimeFilter;
  }
}

/**
 * Apply custom date range
 */
function applyCustomDateRange() {
  customStartDate = new Date(startDateInput.value);
  customEndDate = new Date(endDateInput.value);
  currentTimeFilter = "custom";

  closeDatePickerModal();
  renderAll();
}

/**
 * Render all components
 */
function renderAll() {
  renderSummaryCards();
  renderLineChart();
  renderBarChart();
  renderHorizontalBarChart();
}

/**
 * Get filtered fuel logs based on current filters
 */
function getFilteredLogs() {
  let logs = fuelLogManager.getAll();

  // Filter by vehicle
  if (currentVehicleFilter) {
    logs = logs.filter((log) => log.vehicleId === currentVehicleFilter);
  }

  // Filter by time
  if (currentTimeFilter === "custom" && customStartDate && customEndDate) {
    logs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= customStartDate && logDate <= customEndDate;
    });
  } else if (currentTimeFilter !== "all") {
    const now = new Date();
    const filterDate = new Date();

    switch (currentTimeFilter) {
      case "3m":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    logs = logs.filter((log) => new Date(log.date) >= filterDate);
  }

  return logs;
}

/**
 * Render summary cards (TASK-025)
 */
function renderSummaryCards() {
  const logs = getFilteredLogs();
  const vehicles = vehicleManager.getAllVehicles();

  // Total expense
  const totalExpense = logs.reduce(
    (sum, log) => sum + (log.totalPrice || 0),
    0
  );
  totalExpenseEl.textContent = formatCurrency(totalExpense);

  // Calculate vehicle stats
  const vehicleStats = {};

  logs.forEach((log) => {
    if (!log.kmPerLiter || log.kmPerLiter <= 0) return;

    if (!vehicleStats[log.vehicleId]) {
      vehicleStats[log.vehicleId] = { total: 0, count: 0 };
    }

    vehicleStats[log.vehicleId].total += log.kmPerLiter;
    vehicleStats[log.vehicleId].count++;
  });

  // Find best and worst vehicles
  let bestVehicle = null;
  let worstVehicle = null;
  let bestAvg = 0;
  let worstAvg = Infinity;

  Object.entries(vehicleStats).forEach(([vehicleId, stats]) => {
    const avg = stats.total / stats.count;
    const vehicle = vehicles.find((v) => v.id === vehicleId);

    if (avg > bestAvg) {
      bestAvg = avg;
      bestVehicle = vehicle;
    }

    if (avg < worstAvg) {
      worstAvg = avg;
      worstVehicle = vehicle;
    }
  });

  // Update UI
  if (bestVehicle) {
    bestVehicleEl.textContent = bestVehicle.name;
    bestVehicleValueEl.textContent = `${bestAvg.toFixed(2)} km/L`;
  } else {
    bestVehicleEl.textContent = "-";
    bestVehicleValueEl.textContent = "- km/L";
  }

  if (worstVehicle && worstAvg !== Infinity) {
    worstVehicleEl.textContent = worstVehicle.name;
    worstVehicleValueEl.textContent = `${worstAvg.toFixed(2)} km/L`;
  } else {
    worstVehicleEl.textContent = "-";
    worstVehicleValueEl.textContent = "- km/L";
  }
}

/**
 * Render Line Chart - Tren Konsumsi (TASK-006 to TASK-011)
 */
function renderLineChart() {
  const logs = getFilteredLogs();
  const vehicles = vehicleManager.getAllVehicles();

  // Group by month and vehicle
  const chartData = prepareLineChartData(logs, vehicles);

  const config = {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: chartData.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: window.innerWidth < 768 ? "bottom" : "top",
          onClick: (e, legendItem, legend) => {
            // Toggle visibility (TASK-009)
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden =
              meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${context.parsed.y.toFixed(2)} km/L`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Konsumsi (km/L)",
          },
        },
      },
    },
  };

  if (lineChart) {
    lineChart.destroy();
  }

  lineChart = new Chart(consumptionTrendCanvas, config);
}

/**
 * Prepare data for line chart
 */
function prepareLineChartData(logs, vehicles) {
  // Get months in range
  const monthGroups = {};

  logs.forEach((log) => {
    if (!log.kmPerLiter) return;

    const date = new Date(log.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthGroups[monthKey]) {
      monthGroups[monthKey] = {};
    }

    if (!monthGroups[monthKey][log.vehicleId]) {
      monthGroups[monthKey][log.vehicleId] = { total: 0, count: 0 };
    }

    monthGroups[monthKey][log.vehicleId].total += log.kmPerLiter;
    monthGroups[monthKey][log.vehicleId].count++;
  });

  // Sort months
  const sortedMonths = Object.keys(monthGroups).sort();

  // Create labels
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const labels = sortedMonths.map((key) => {
    const [year, month] = key.split("-");
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  });

  // Create datasets per vehicle
  const vehicleIds = [...new Set(logs.map((log) => log.vehicleId))];
  const datasets = vehicleIds.map((vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    const color = vehicle?.color || getRandomColor();

    const data = sortedMonths.map((monthKey) => {
      const vehicleData = monthGroups[monthKey]?.[vehicleId];
      return vehicleData ? vehicleData.total / vehicleData.count : null;
    });

    return {
      label: vehicle?.name || "Unknown",
      data,
      borderColor: color,
      backgroundColor: `${color}33`,
      tension: 0.3,
      fill: false,
      pointRadius: 4,
    };
  });

  return { labels, datasets };
}

/**
 * Render Bar Chart - Pengeluaran Bulanan (TASK-012 to TASK-016)
 */
function renderBarChart() {
  const logs = getFilteredLogs();
  const vehicles = vehicleManager.getAllVehicles();

  const chartData = prepareBarChartData(logs, vehicles);

  const config = {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: chartData.datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: window.innerWidth < 768 ? "bottom" : "top",
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value),
          },
        },
      },
    },
  };

  if (barChart) {
    barChart.destroy();
  }

  barChart = new Chart(monthlyExpenseCanvas, config);
}

/**
 * Prepare data for bar chart
 */
function prepareBarChartData(logs, vehicles) {
  const monthGroups = {};

  logs.forEach((log) => {
    const date = new Date(log.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthGroups[monthKey]) {
      monthGroups[monthKey] = {};
    }

    if (!monthGroups[monthKey][log.vehicleId]) {
      monthGroups[monthKey][log.vehicleId] = 0;
    }

    monthGroups[monthKey][log.vehicleId] += log.totalPrice || 0;
  });

  const sortedMonths = Object.keys(monthGroups).sort();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const labels = sortedMonths.map((key) => {
    const [year, month] = key.split("-");
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  });

  const vehicleIds = [...new Set(logs.map((log) => log.vehicleId))];
  const datasets = vehicleIds.map((vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    const color = vehicle?.color || getRandomColor();

    const data = sortedMonths.map(
      (monthKey) => monthGroups[monthKey]?.[vehicleId] || 0
    );

    return {
      label: vehicle?.name || "Unknown",
      data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
    };
  });

  return { labels, datasets };
}

/**
 * Render Horizontal Bar Chart - Perbandingan (TASK-017 to TASK-021)
 */
function renderHorizontalBarChart() {
  const logs = getFilteredLogs();
  const vehicles = vehicleManager.getAllVehicles();

  const chartData = prepareHBarChartData(logs, vehicles);

  const config = {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Rata-rata Konsumsi (km/L)",
          data: chartData.values,
          backgroundColor: chartData.colors,
          borderColor: chartData.colors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y", // Horizontal
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.x.toFixed(2)} km/L`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Konsumsi (km/L)",
          },
        },
      },
    },
  };

  if (hBarChart) {
    hBarChart.destroy();
  }

  hBarChart = new Chart(vehicleComparisonCanvas, config);
}

/**
 * Prepare data for horizontal bar chart
 */
function prepareHBarChartData(logs, vehicles) {
  // Calculate average consumption per vehicle
  const vehicleStats = {};

  logs.forEach((log) => {
    if (!log.kmPerLiter || log.kmPerLiter <= 0) return;

    if (!vehicleStats[log.vehicleId]) {
      vehicleStats[log.vehicleId] = { total: 0, count: 0 };
    }

    vehicleStats[log.vehicleId].total += log.kmPerLiter;
    vehicleStats[log.vehicleId].count++;
  });

  // Convert to array and sort by efficiency (descending)
  const sortedVehicles = Object.entries(vehicleStats)
    .map(([vehicleId, stats]) => {
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      return {
        vehicleId,
        name: vehicle?.name || "Unknown",
        color: vehicle?.color || "#999",
        avg: stats.total / stats.count,
      };
    })
    .sort((a, b) => b.avg - a.avg);

  // Highlight best with accent color (TASK-020)
  const colors = sortedVehicles.map((v, i) => (i === 0 ? "#04773b" : v.color));

  return {
    labels: sortedVehicles.map((v) => v.name),
    values: sortedVehicles.map((v) => v.avg),
    colors,
  };
}

/**
 * Show empty state
 */
function showEmptyState() {
  document
    .querySelectorAll(".summary-section, .chart-section")
    .forEach((el) => {
      el.classList.add("hidden");
    });
  emptyState.classList.remove("hidden");
}

/**
 * Hide empty state
 */
function hideEmptyState() {
  document
    .querySelectorAll(".summary-section, .chart-section")
    .forEach((el) => {
      el.classList.remove("hidden");
    });
  emptyState.classList.add("hidden");
}

/**
 * Get random color for vehicles without assigned color
 */
function getRandomColor() {
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}

// Export for testing
export { renderAll, renderLineChart, renderBarChart, renderHorizontalBarChart };
