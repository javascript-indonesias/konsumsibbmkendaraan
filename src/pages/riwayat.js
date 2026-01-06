/**
 * Riwayat (History) Page Controller
 *
 * Requirements:
 * - Display fuel log timeline sorted by date (descending)
 * - Filter by vehicle and time range
 * - Infinite scroll with 20 items per load
 * - Edit and Delete actions
 * - Empty state handling
 */

import { StorageManager } from "@modules/storage.js";
import { VehicleManager } from "@modules/vehicle.js";
import { FuelLogManager } from "@modules/fuel-log.js";
import { ToastManager } from "@components/toast.js";
import { formatCurrency, formatDate } from "@modules/utils.js";

// Initialize managers
const storageManager = new StorageManager();
const vehicleManager = new VehicleManager(storageManager);
const fuelLogManager = new FuelLogManager(storageManager);

// Toast manager instance
let toastManager = null;

// State
let currentPage = 0;
const PAGE_SIZE = 20;
let allLogs = [];
let filteredLogs = [];
let hasMoreData = true;
let isLoading = false;
let infiniteScrollObserver = null;

// DOM Elements
const totalCountElement = document.getElementById("totalCount");
const vehicleFilterElement = document.getElementById("vehicleFilter");
const timeFilterElement = document.getElementById("timeFilter");
const filterBarElement = document.getElementById("filterBar");
const timelineContainerElement = document.getElementById("timelineContainer");
const emptyStateElement = document.getElementById("emptyState");
const loadMoreIndicatorElement = document.getElementById("loadMoreIndicator");
const endOfListElement = document.getElementById("endOfList");
const backBtnElement = document.getElementById("backBtn");
const deleteModalElement = document.getElementById("deleteModal");
const closeDeleteModalElement = document.getElementById("closeDeleteModal");
const cancelDeleteElement = document.getElementById("cancelDelete");
const confirmDeleteElement = document.getElementById("confirmDelete");

// Delete state
let deletingLogId = null;

/**
 * Initialize page
 */
function initPage() {
  // Initialize storage
  storageManager.init(true);

  // Initialize ToastManager
  initToastManager();

  // Load all fuel logs
  loadAllLogs();

  // Populate filters
  populateVehicleFilter();

  // Initial render
  applyFilters();

  // Setup event listeners
  setupEventListeners();

  // Setup sticky filter bar behavior
  setupStickyFilterBar();

  // Setup infinite scroll (TASK-011)
  setupInfiniteScroll();
}

/**
 * Initialize ToastManager
 */
function initToastManager() {
  const toastContainer = document.createElement("div");
  toastContainer.id = "toastContainer";
  toastContainer.className = "toast-container";
  document.body.appendChild(toastContainer);

  toastManager = new ToastManager({
    container: toastContainer,
    defaultDuration: 3000,
  });
}

/**
 * Load all fuel logs from storage
 */
function loadAllLogs() {
  try {
    allLogs = fuelLogManager.getAll();
    // Sort by date descending (newest first)
    allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(`Loaded ${allLogs.length} fuel logs`);
  } catch (error) {
    console.error("Error loading fuel logs:", error);
    toastManager.error("Gagal memuat data riwayat");
  }
}

/**
 * Populate vehicle filter dropdown (TASK-015)
 */
function populateVehicleFilter() {
  const vehicles = vehicleManager.getAllVehicles();

  // Clear existing options (keep "Semua Kendaraan")
  vehicleFilterElement.innerHTML = '<option value="">Semua Kendaraan</option>';

  // Add vehicle options
  vehicles.forEach((vehicle) => {
    const option = document.createElement("option");
    option.value = vehicle.id;
    option.textContent = `${vehicle.name} (${vehicle.type})`;
    vehicleFilterElement.appendChild(option);
  });
}

/**
 * Apply filters and update display (TASK-016, TASK-017)
 */
function applyFilters() {
  const vehicleId = vehicleFilterElement.value;
  const timeFilter = timeFilterElement.value;

  // Start with all logs
  filteredLogs = [...allLogs];

  // Apply vehicle filter
  if (vehicleId) {
    filteredLogs = filteredLogs.filter((log) => log.vehicleId === vehicleId);
  }

  // Apply time filter
  if (timeFilter !== "all") {
    const now = new Date();
    const filterDate = new Date();

    switch (timeFilter) {
      case "1m":
        filterDate.setMonth(now.getMonth() - 1);
        break;
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

    filteredLogs = filteredLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= filterDate;
    });
  }

  // Update total count badge
  totalCountElement.textContent = filteredLogs.length;

  // Reset pagination
  currentPage = 0;
  hasMoreData = filteredLogs.length > PAGE_SIZE;

  // Render first page
  renderTimeline(true);
}

/**
 * Render timeline items (Phase 2 will implement full rendering)
 */
function renderTimeline(clearFirst = false) {
  if (clearFirst) {
    timelineContainerElement.innerHTML = "";
  }

  // Check empty state
  if (filteredLogs.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();

  // Calculate items for current page
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredLogs.length);
  const pageItems = filteredLogs.slice(startIndex, endIndex);

  // Render each item (placeholder for now - will be implemented in Phase 2)
  pageItems.forEach((log) => {
    const itemElement = createTimelineItem(log);
    timelineContainerElement.appendChild(itemElement);
  });

  // Update load more state
  hasMoreData = endIndex < filteredLogs.length;
  updateLoadMoreIndicator();
}

/**
 * Create timeline item with full details (TASK-006, TASK-007, TASK-008, TASK-009)
 */
function createTimelineItem(log) {
  // Get vehicle details
  const vehicle = vehicleManager.getVehicleById(log.vehicleId);
  const vehicleName = vehicle ? vehicle.name : "Kendaraan Tidak Diketahui";
  const vehicleType = vehicle ? vehicle.type : "motor";

  // Calculate efficiency level
  const efficiencyLevel = getEfficiencyLevel(log.kmPerLiter, vehicleType);

  // Format date
  const date = formatDate(log.date);

  // Create item element
  const item = document.createElement("div");
  item.className = "timeline-item";
  item.dataset.logId = log.id;

  // Build HTML structure
  item.innerHTML = `
    <div class="timeline-marker timeline-marker--${efficiencyLevel}"></div>
    <div class="timeline-content">
      <div class="timeline-header">
        <div class="timeline-vehicle">${vehicleName}</div>
        <div class="timeline-date">${date}</div>
      </div>
      <div class="timeline-details">
        <div class="detail-row">
          <span class="detail-label">Liter:</span>
          <span class="detail-value">${log.liter} L</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Harga:</span>
          <span class="detail-value">${formatCurrency(log.totalPrice)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Harga/Liter:</span>
          <span class="detail-value">${formatCurrency(log.pricePerLiter)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Odometer:</span>
          <span class="detail-value">${log.odometer.toLocaleString(
            "id-ID"
          )} km</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Konsumsi:</span>
          <span class="detail-value">
            ${log.kmPerLiter ? log.kmPerLiter.toFixed(2) + " km/L" : "-"}
            ${
              log.kmPerLiter
                ? `<span class="efficiency-badge efficiency-badge--${efficiencyLevel}">${getEfficiencyLabel(
                    efficiencyLevel
                  )}</span>`
                : ""
            }
          </span>
        </div>
        ${
          log.fuelType
            ? `
        <div class="detail-row">
          <span class="detail-label">Jenis BBM:</span>
          <span class="detail-value">${log.fuelType}</span>
        </div>
        `
            : ""
        }
        ${
          log.notes
            ? `
        <div class="detail-row">
          <span class="detail-label">Catatan:</span>
          <span class="detail-value">${log.notes}</span>
        </div>
        `
            : ""
        }
      </div>
      <div class="timeline-actions">
        <button class="btn btn-sm btn-outline-secondary edit-btn" data-log-id="${
          log.id
        }">
          <i class="bi bi-pencil"></i> Edit
        </button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-log-id="${
          log.id
        }">
          <i class="bi bi-trash"></i> Hapus
        </button>
      </div>
    </div>
  `;

  // Attach event listeners to buttons
  const editBtn = item.querySelector(".edit-btn");
  const deleteBtn = item.querySelector(".delete-btn");

  editBtn.addEventListener("click", () => handleEdit(log.id));
  deleteBtn.addEventListener("click", () => handleDeleteClick(log.id));

  return item;
}

/**
 * Calculate efficiency level based on km/L and vehicle type
 * Motor: Good ≥20, Normal 15-19.99, Poor <15
 * Mobil: Good ≥12, Normal 8-11.99, Poor <8
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
 * Get efficiency label in Indonesian
 */
function getEfficiencyLabel(level) {
  const labels = {
    good: "Baik",
    normal: "Normal",
    poor: "Buruk",
  };
  return labels[level] || "Normal";
}

/**
 * Handle edit action (TASK-018)
 */
function handleEdit(logId) {
  window.location.href = `/tambah.html?edit=${logId}`;
}

/**
 * Handle delete button click
 */
function handleDeleteClick(logId) {
  openDeleteModal(logId);
}

/**
 * Show empty state
 */
function showEmptyState() {
  timelineContainerElement.classList.add("hidden");
  emptyStateElement.classList.remove("hidden");
  loadMoreIndicatorElement.classList.add("hidden");
  endOfListElement.classList.add("hidden");
}

/**
 * Hide empty state
 */
function hideEmptyState() {
  timelineContainerElement.classList.remove("hidden");
  emptyStateElement.classList.add("hidden");
}

/**
 * Update load more indicator visibility (TASK-013, TASK-014)
 */
function updateLoadMoreIndicator() {
  if (hasMoreData) {
    loadMoreIndicatorElement.classList.remove("hidden");
    endOfListElement.classList.add("hidden");
  } else {
    loadMoreIndicatorElement.classList.add("hidden");
    if (filteredLogs.length > 0 && filteredLogs.length > PAGE_SIZE) {
      // Only show "end of list" if there was more than 1 page
      endOfListElement.classList.remove("hidden");
    } else {
      endOfListElement.classList.add("hidden");
    }
  }
}

/**
 * Setup IntersectionObserver for infinite scroll (TASK-011)
 */
function setupInfiniteScroll() {
  // Create observer options
  const options = {
    root: null, // viewport
    rootMargin: "100px", // trigger 100px before element is visible
    threshold: 0.1,
  };

  // Create observer
  infiniteScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMoreData && !isLoading) {
        loadMore();
      }
    });
  }, options);

  // Start observing the load more indicator
  if (loadMoreIndicatorElement) {
    infiniteScrollObserver.observe(loadMoreIndicatorElement);
  }
}

/**
 * Load more items (TASK-012)
 */
function loadMore() {
  if (isLoading || !hasMoreData) return;

  // Set loading state (TASK-013)
  isLoading = true;
  showLoadingSpinner();

  // Simulate small delay for better UX (prevents jarring instant load)
  setTimeout(() => {
    // Increment page
    currentPage++;

    // Render next page of items
    renderTimeline(false); // Don't clear, append

    // Reset loading state
    isLoading = false;
    hideLoadingSpinner();

    console.log(
      `Loaded page ${currentPage + 1}, total items: ${Math.min(
        (currentPage + 1) * PAGE_SIZE,
        filteredLogs.length
      )}/${filteredLogs.length}`
    );
  }, 300); // 300ms delay for smooth UX
}

/**
 * Show loading spinner in load more indicator
 */
function showLoadingSpinner() {
  const spinner = loadMoreIndicatorElement.querySelector(".spinner-border");
  if (spinner) {
    spinner.style.display = "inline-block";
  }
}

/**
 * Hide loading spinner
 */
function hideLoadingSpinner() {
  // Spinner visibility is controlled by CSS through hidden class
  // This function can be extended for additional loading states
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Back button
  backBtnElement.addEventListener("click", handleBack);

  // Filter changes
  vehicleFilterElement.addEventListener("change", handleFilterChange);
  timeFilterElement.addEventListener("change", handleFilterChange);

  // Delete modal
  closeDeleteModalElement.addEventListener("click", closeDeleteModal);
  cancelDeleteElement.addEventListener("click", closeDeleteModal);
  confirmDeleteElement.addEventListener("click", handleDeleteConfirm);
}

/**
 * Handle filter change
 */
function handleFilterChange() {
  applyFilters();
}

/**
 * Setup sticky filter bar behavior (TASK-004)
 */
function setupStickyFilterBar() {
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      filterBarElement.classList.add("filter-bar--sticky");
    } else {
      filterBarElement.classList.remove("filter-bar--sticky");
    }

    lastScrollY = scrollY;
  });
}

/**
 * Handle back button
 */
function handleBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "/index.html";
  }
}

/**
 * Open delete confirmation modal
 */
function openDeleteModal(logId) {
  deletingLogId = logId;
  deleteModalElement.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

/**
 * Close delete confirmation modal
 */
function closeDeleteModal() {
  deletingLogId = null;
  deleteModalElement.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

/**
 * Handle delete confirmation (TASK-020)
 */
function handleDeleteConfirm() {
  if (!deletingLogId) return;

  try {
    // Delete from manager
    fuelLogManager.deleteFuelLog(deletingLogId);

    // Reload data
    loadAllLogs();
    applyFilters();

    // Show success message
    toastManager.success("Pengisian berhasil dihapus");

    // Close modal
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting fuel log:", error);
    toastManager.error("Gagal menghapus pengisian");
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}

// Export for testing
export { applyFilters, renderTimeline, openDeleteModal, closeDeleteModal };
