/**
 * Dashboard Page Controller
 *
 * Requirements:
 * - Display 4 stat cards
 * - Display consumption trend chart with filters
 * - Display last 5 fuel logs
 * - FAB to add new fuel log
 * - Empty state handling
 */

import { StorageManager } from "@modules/storage.js";
import { VehicleManager } from "@modules/vehicle.js";
import { FuelLogManager } from "@modules/fuel-log.js";
import { Calculator } from "@modules/calculator.js";
import { formatCurrency, formatDate } from "@modules/utils.js";

// Initialize managers (TASK-024)
const storageManager = new StorageManager();
const vehicleManager = new VehicleManager(storageManager);
const fuelLogManager = new FuelLogManager(storageManager);
const calculator = new Calculator(storageManager);

// DOM Elements
const statsCardsContainer = document.getElementById("statsCards");
const consumptionChart = document.getElementById("consumptionChart");
const timelinePreview = document.getElementById("timelinePreview");
const emptyState = document.getElementById("emptyState");
const skeletonLoaders = document.getElementById("skeletonLoaders");
const navbarToggler = document.getElementById("navbarToggler");
const navbarMobileMenu = document.getElementById("navbarMobileMenu");

// Chart instance
let chartInstance = null;
let currentFilter = "all";

/**
 * Initialize page
 */
function initPage() {
  // Initialize storage
  storageManager.init(true);

  // Setup navbar toggle
  setupNavbarToggle();

  // Show loading state
  showLoading();

  // Check if we have data
  const hasData = checkHasData();

  if (hasData) {
    // Render dashboard with data
    renderDashboard();
  } else {
    // Show empty state
    showEmptyState();
  }
}

/**
 * Setup navbar toggle for mobile
 */
function setupNavbarToggle() {
  if (!navbarToggler) return;

  navbarToggler.addEventListener("click", () => {
    const isExpanded = navbarToggler.getAttribute("aria-expanded") === "true";
    navbarToggler.setAttribute("aria-expanded", !isExpanded);
    navbarMobileMenu.classList.toggle("hidden");
  });

  // Close mobile menu when clicking a link
  const mobileLinks = navbarMobileMenu.querySelectorAll(".nav-link");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbarMobileMenu.classList.add("hidden");
      navbarToggler.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * Check if we have any data
 */
function checkHasData() {
  const vehicles = vehicleManager.getAllVehicles();
  const fuelLogs = fuelLogManager.getAll();
  return vehicles.length > 0 && fuelLogs.length > 0;
}

/**
 * Show loading state (TASK-021)
 */
function showLoading() {
  skeletonLoaders.classList.remove("hidden");
  statsCardsContainer.parentElement.classList.add("hidden");
  document.querySelector(".chart-section").classList.add("hidden");
  document.querySelector(".timeline-preview-section").classList.add("hidden");
  emptyState.classList.add("hidden");
}

/**
 * Hide loading state
 */
function hideLoading() {
  skeletonLoaders.classList.add("hidden");
  statsCardsContainer.parentElement.classList.remove("hidden");
  document.querySelector(".chart-section").classList.remove("hidden");
  document
    .querySelector(".timeline-preview-section")
    .classList.remove("hidden");
}

/**
 * Show empty state (TASK-020, TASK-022)
 */
function showEmptyState() {
  hideLoading();
  statsCardsContainer.parentElement.classList.add("hidden");
  document.querySelector(".chart-section").classList.add("hidden");
  document.querySelector(".timeline-preview-section").classList.add("hidden");
  emptyState.classList.remove("hidden");
}

/**
 * Render dashboard with data
 */
function renderDashboard() {
  // Small delay for better UX (simulate loading)
  setTimeout(() => {
    renderStatsCards(); // Phase 2
    renderChart(); // Phase 3
    renderTimelinePreview(); // Phase 4
    hideLoading();
  }, 500);
}

/**
 * Render stats cards (TASK-005, TASK-006, TASK-007, TASK-008)
 */
function renderStatsCards() {
  // Get stats data
  const stats = calculator.getDashboardStats();

  // Define cards configuration
  const cards = [
    {
      icon: "bi-wallet2",
      iconClass: "stats-card__icon--primary",
      title: "Total Pengeluaran",
      value: formatCurrency(stats.totalExpense || 0),
      subtitle: "  Bulan ini",
    },
    {
      icon: "bi-speedometer2",
      iconClass: "stats-card__icon--secondary",
      title: "Rata-rata Konsumsi",
      value: stats.avgConsumption
        ? `${stats.avgConsumption.toFixed(2)} km/L`
        : "-",
      subtitle: "Semua kendaraan",
    },
    {
      icon: "bi-signpost-2",
      iconClass: "stats-card__icon--accent",
      title: "Total Jarak",
      value: stats.totalDistance
        ? `${stats.totalDistance.toLocaleString("id-ID")} km`
        : "-",
      subtitle: "Total tempuh",
    },
    {
      icon: "bi-trophy",
      iconClass: "stats-card__icon--warning",
      title: "Konsumsi Terbaik",
      value: stats.bestConsumption
        ? `${stats.bestConsumption.toFixed(2)} km/L`
        : "-",
      subtitle: stats.bestVehicle || "Belum ada data",
    },
  ];

  // Render cards
  statsCardsContainer.innerHTML = cards
    .map(
      (card) => `
    <div class="col-12 col-md-6 col-lg-3">
      <div class="stats-card">
        <div class="stats-card__header">
          <div class="stats-card__icon ${card.iconClass}">
            <i class="${card.icon}"></i>
          </div>
        </div>
        <h3 class="stats-card__title">${card.title}</h3>
        <p class="stats-card__value">${card.value}</p>
        ${
          card.subtitle
            ? `<p class="stats-card__subtitle">${card.subtitle}</p>`
            : ""
        }
      </div>
    </div>
  `
    )
    .join("");
}

/**
 * Render chart (TASK-009, TASK-010, TASK-011, TASK-012)
 */
function renderChart() {
  if (!consumptionChart) return;

  // Get chart data
  const chartData = calculator.getConsumptionTrend(currentFilter);

  // Chart configuration
  const config = {
    type: "line",
    data: {
      labels: chartData.labels || [],
      datasets: [
        {
          label: "Konsumsi (km/L)",
          data: chartData.values || [],
          borderColor: "rgb(4, 119, 59)",
          backgroundColor: "rgba(4, 119, 59, 0.1)",
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              return `${context.parsed.y.toFixed(2)} km/L`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toFixed(1) + " km/L";
            },
          },
        },
      },
    },
  };

  // Destroy existing chart if any
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create new chart
  chartInstance = new Chart(consumptionChart, config);

  // Setup filter buttons (TASK-013)
  setupChartFilters();
}

/**
 * Setup chart filter buttons (TASK-013)
 */
function setupChartFilters() {
  const filterButtons = document.querySelectorAll(".chart-filter .btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Get filter value
      currentFilter = btn.dataset.filter;

      // Update chart
      const chartData = calculator.getConsumptionTrend(currentFilter);
      chartInstance.data.labels = chartData.labels || [];
      chartInstance.data.datasets[0].data = chartData.values || [];
      chartInstance.update("active");
    });
  });
}

/**
 * Render timeline preview (TASK-014, TASK-015, TASK-016, TASK-017)
 */
function renderTimelinePreview() {
  // Get last 5 fuel logs
  const allLogs = fuelLogManager.getAll();
  const recentLogs = allLogs
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (recentLogs.length === 0) {
    timelinePreview.innerHTML = `
      <div class="text-center py-4 text-secondary">
        <i class="bi bi-inbox" style="font-size: 2rem;"></i>
        <p class="mt-2 mb-0">Belum ada pengisian</p>
      </div>
    `;
    return;
  }

  // Render timeline items
  timelinePreview.innerHTML = recentLogs
    .map((log) => {
      const vehicle = vehicleManager.getVehicleById(log.vehicleId);
      const vehicleName = vehicle ? vehicle.name : "Kendaraan Tidak Diketahui";
      const vehicleType = vehicle ? vehicle.type : "motor";

      // Calculate efficiency
      const efficiencyLevel = getEfficiencyLevel(log.kmPerLiter, vehicleType);
      const efficiencyLabel = getEfficiencyLabel(efficiencyLevel);

      return `
        <div class="timeline-item">
          <div class="timeline-marker timeline-marker--${efficiencyLevel}"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <div class="timeline-vehicle">${vehicleName}</div>
              <div class="timeline-date">${formatDate(log.date)}</div>
            </div>
            <div class="timeline-details">
              <div class="detail-row">
                <span class="detail-label">Liter:</span>
                <span class="detail-value">${log.liter} L</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total:</span>
                <span class="detail-value">${formatCurrency(
                  log.totalPrice
                )}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Konsumsi:</span>
                <span class="detail-value">
                  ${log.kmPerLiter ? log.kmPerLiter.toFixed(2) + " km/L" : "-"}
                  ${
                    log.kmPerLiter
                      ? `<span class="efficiency-badge efficiency-badge--${efficiencyLevel}">${efficiencyLabel}</span>`
                      : ""
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Calculate efficiency level
 */
function getEfficiencyLevel(kmPerLiter, vehicleType) {
  if (!kmPerLiter) return "normal";

  if (vehicleType === "motor") {
    if (kmPerLiter >= 20) return "good";
    if (kmPerLiter >= 15) return "normal";
    return "poor";
  } else {
    // mobil
    if (kmPerLiter >= 12) return "good";
    if (kmPerLiter >= 8) return "normal";
    return "poor";
  }
}

/**
 * Get efficiency label
 */
function getEfficiencyLabel(level) {
  const labels = {
    good: "Baik",
    normal: "Normal",
    poor: "Buruk",
  };
  return labels[level] || "Normal";
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}

// Export for testing
export { renderStatsCards, renderChart, renderTimelinePreview };
