/**
 * Pengaturan (Settings) Page Controller
 *
 * Requirements:
 * - Export data to CSV
 * - Import data from CSV with preview
 * - Reset all data with double confirmation
 * - Link to Kendaraan management
 */

import { StorageManager } from "@modules/storage.js";
import { VehicleManager } from "@modules/vehicle.js";
import { FuelLogManager } from "@modules/fuel-log.js";
import { CSVManager } from "@modules/csv-manager.js";
import { ToastManager } from "@components/toast.js";

// Initialize managers
const storageManager = new StorageManager();
const vehicleManager = new VehicleManager(storageManager);
const fuelLogManager = new FuelLogManager(storageManager);
const csvManager = new CSVManager(storageManager);
const toastManager = new ToastManager();

// DOM Elements - Buttons
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const resetBtn = document.getElementById("resetBtn");

// DOM Elements - Import Modal
const importModal = document.getElementById("importModal");
const closeImportModal = document.getElementById("closeImportModal");
const cancelImport = document.getElementById("cancelImport");
const confirmImport = document.getElementById("confirmImport");
const fileDropZone = document.getElementById("fileDropZone");
const fileInput = document.getElementById("fileInput");
const importPreview = document.getElementById("importPreview");
const previewVehicleCount = document.getElementById("previewVehicleCount");
const previewLogCount = document.getElementById("previewLogCount");

// DOM Elements - Delete Warning Modal
const deleteWarningModal = document.getElementById("deleteWarningModal");
const closeDeleteWarning = document.getElementById("closeDeleteWarning");
const cancelDeleteWarning = document.getElementById("cancelDeleteWarning");
const proceedDelete = document.getElementById("proceedDelete");
const deleteVehicleCount = document.getElementById("deleteVehicleCount");
const deleteLogCount = document.getElementById("deleteLogCount");

// DOM Elements - Delete Confirm Modal
const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const closeDeleteConfirm = document.getElementById("closeDeleteConfirm");
const cancelDeleteConfirm = document.getElementById("cancelDeleteConfirm");
const confirmDelete = document.getElementById("confirmDelete");
const deleteConfirmInput = document.getElementById("deleteConfirmInput");

// State
let pendingImportData = null;

/**
 * Initialize page
 */
function initPage() {
  storageManager.init(true);
  setupEventListeners();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Export button
  exportBtn?.addEventListener("click", handleExport);

  // Import button
  importBtn?.addEventListener("click", openImportModal);

  // Reset button
  resetBtn?.addEventListener("click", openDeleteWarningModal);

  // Import modal events
  closeImportModal?.addEventListener("click", closeImportModalHandler);
  cancelImport?.addEventListener("click", closeImportModalHandler);
  confirmImport?.addEventListener("click", handleImport);

  // File drop zone
  setupFileDropZone();

  // File input
  fileInput?.addEventListener("change", handleFileSelect);

  // Delete warning modal events
  closeDeleteWarning?.addEventListener("click", closeDeleteWarningModal);
  cancelDeleteWarning?.addEventListener("click", closeDeleteWarningModal);
  proceedDelete?.addEventListener("click", openDeleteConfirmModal);

  // Delete confirm modal events
  closeDeleteConfirm?.addEventListener("click", closeDeleteConfirmModal);
  cancelDeleteConfirm?.addEventListener("click", closeDeleteConfirmModal);
  confirmDelete?.addEventListener("click", handleDeleteAll);
  deleteConfirmInput?.addEventListener("input", validateDeleteInput);
}

// ==================== EXPORT ====================

/**
 * Handle export button click (TASK-006, TASK-007)
 */
function handleExport() {
  try {
    const filename = csvManager.downloadCSV();
    toastManager.show(`Data berhasil di-export: ${filename}`, "success");
  } catch (error) {
    console.error("Export error:", error);
    toastManager.show("Gagal export data. Silakan coba lagi.", "error");
  }
}

// ==================== IMPORT ====================

/**
 * Open import modal (TASK-008)
 */
function openImportModal() {
  pendingImportData = null;
  resetImportUI();
  importModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

/**
 * Close import modal
 */
function closeImportModalHandler() {
  importModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  pendingImportData = null;
  resetImportUI();
}

/**
 * Reset import UI to initial state
 */
function resetImportUI() {
  fileInput.value = "";
  importPreview.classList.add("hidden");
  fileDropZone.classList.remove("hidden");
  confirmImport.disabled = true;
}

/**
 * Setup file drop zone drag and drop (TASK-008)
 */
function setupFileDropZone() {
  if (!fileDropZone) return;

  fileDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileDropZone.classList.add("file-drop-zone--active");
  });

  fileDropZone.addEventListener("dragleave", () => {
    fileDropZone.classList.remove("file-drop-zone--active");
  });

  fileDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    fileDropZone.classList.remove("file-drop-zone--active");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  });
}

/**
 * Handle file input change
 */
function handleFileSelect() {
  const file = fileInput.files?.[0];
  if (file) {
    processFile(file);
  }
}

/**
 * Process selected file (TASK-009, TASK-010)
 */
function processFile(file) {
  // Validate file type
  if (!file.name.endsWith(".csv")) {
    toastManager.show("Hanya file CSV yang diperbolehkan", "error");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target.result;
      pendingImportData = csvManager.parseCSV(content);

      // Show preview
      showImportPreview(pendingImportData);
    } catch (error) {
      console.error("Parse error:", error);
      toastManager.show("Gagal membaca file CSV", "error");
    }
  };

  reader.onerror = () => {
    toastManager.show("Gagal membaca file", "error");
  };

  reader.readAsText(file);
}

/**
 * Show import preview (TASK-010)
 */
function showImportPreview(data) {
  previewVehicleCount.textContent = data.vehicles.length;
  previewLogCount.textContent = data.fuelLogs.length;

  fileDropZone.classList.add("hidden");
  importPreview.classList.remove("hidden");
  confirmImport.disabled = false;
}

/**
 * Handle import confirmation (TASK-011, TASK-012)
 */
function handleImport() {
  if (!pendingImportData) return;

  try {
    const result = csvManager.importData(pendingImportData);

    closeImportModalHandler();

    toastManager.show(
      `Import berhasil! ${result.vehiclesAdded} kendaraan, ${result.logsAdded} pengisian ditambahkan.`,
      "success"
    );
  } catch (error) {
    console.error("Import error:", error);
    toastManager.show("Gagal import data. Silakan coba lagi.", "error");
  }
}

// ==================== DELETE ====================

/**
 * Open first delete warning modal (TASK-015)
 */
function openDeleteWarningModal() {
  // Get counts
  const vehicles = vehicleManager.getAllVehicles();
  const logs = fuelLogManager.getAll();

  deleteVehicleCount.textContent = vehicles.length;
  deleteLogCount.textContent = logs.length;

  deleteWarningModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

/**
 * Close delete warning modal
 */
function closeDeleteWarningModal() {
  deleteWarningModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

/**
 * Open second delete confirm modal (TASK-016)
 */
function openDeleteConfirmModal() {
  closeDeleteWarningModal();

  deleteConfirmInput.value = "";
  confirmDelete.disabled = true;

  deleteConfirmModal.classList.remove("hidden");
  document.body.classList.add("modal-open");

  deleteConfirmInput.focus();
}

/**
 * Close delete confirm modal
 */
function closeDeleteConfirmModal() {
  deleteConfirmModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  deleteConfirmInput.value = "";
}

/**
 * Validate delete input (TASK-016)
 */
function validateDeleteInput() {
  const value = deleteConfirmInput.value.trim().toUpperCase();
  confirmDelete.disabled = value !== "HAPUS";
}

/**
 * Handle delete all data (TASK-017, TASK-018)
 */
function handleDeleteAll() {
  const value = deleteConfirmInput.value.trim().toUpperCase();

  if (value !== "HAPUS") {
    return;
  }

  try {
    storageManager.clearAllData();

    closeDeleteConfirmModal();

    toastManager.show("Semua data berhasil dihapus", "success");

    // Redirect to dashboard after short delay
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1500);
  } catch (error) {
    console.error("Delete error:", error);
    toastManager.show("Gagal menghapus data. Silakan coba lagi.", "error");
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}

// Export for testing
export { handleExport, handleImport, handleDeleteAll };
