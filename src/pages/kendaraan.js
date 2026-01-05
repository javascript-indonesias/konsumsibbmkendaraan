/**
 * Kendaraan Page - Vehicle Management UI
 *
 * Phase 1: Page Structure & List
 * - TASK-001 to TASK-007 implementation
 * - Renders vehicle list from VehicleManager
 * - Handles empty state display
 *
 * Phase 2: Add/Edit Modal
 * - TASK-008 to TASK-015 implementation
 * - VehicleForm component integration
 * - Add/Edit vehicle functionality
 */

import { StorageManager } from "@modules/storage.js";
import { VehicleManager } from "@modules/vehicle.js";
import { VehicleForm } from "@components/vehicle-form.js";
import { DeleteConfirmModal } from "@components/delete-confirm-modal.js";
import { ToastManager } from "@components/toast.js";

// Initialize managers
const storageManager = new StorageManager();
const vehicleManager = new VehicleManager(storageManager);

// VehicleForm instance
let vehicleForm = null;

// DeleteConfirmModal instance
let deleteConfirmModal = null;

// ToastManager instance
let toastManager = null;

// DOM Elements
const vehicleCountElement = document.getElementById("vehicleCount");
const vehicleListElement = document.getElementById("vehicleList");
const emptyStateElement = document.getElementById("emptyState");
const addVehicleBtnElement = document.getElementById("addVehicleBtn");
const addFirstVehicleBtnElement = document.getElementById("addFirstVehicleBtn");
const vehicleModalElement = document.getElementById("vehicleModal");
const deleteConfirmModalElement = document.getElementById("deleteConfirmModal");
const toastContainerElement = document.getElementById("toastContainer");

/**
 * Initialize page
 */
function initPage() {
  // Initialize storage with seed data
  storageManager.init(true);

  // Initialize VehicleForm component
  initVehicleForm();

  // Initialize DeleteConfirmModal component
  initDeleteConfirmModal();

  // Initialize ToastManager component (TASK-024)
  initToastManager();

  // Render vehicle list
  renderVehicleList();

  // Attach event listeners
  attachEventListeners();
}

/**
 * Initialize VehicleForm component
 * Phase 2: Modal integration
 */
function initVehicleForm() {
  vehicleForm = new VehicleForm({
    modalElement: vehicleModalElement,
    onSubmit: handleFormSubmit,
    onCancel: handleFormCancel,
    getUsedColors: getUsedVehicleColors,
    validateData: (data) => vehicleManager.validateVehicleData(data),
  });
}

/**
 * Initialize DeleteConfirmModal component
 * Phase 3 (TASK-019): Delete confirmation modal
 */
function initDeleteConfirmModal() {
  deleteConfirmModal = new DeleteConfirmModal({
    modalElement: deleteConfirmModalElement,
    onConfirm: handleConfirmDelete,
    onCancel: handleCancelDelete,
  });
}

/**
 * Get list of colors already used by vehicles
 * @returns {string[]}
 */
function getUsedVehicleColors() {
  const vehicles = vehicleManager.getAllVehicles();
  return vehicles.map((v) => v.color).filter(Boolean);
}

/**
 * Handle form submission (Add or Edit)
 * @param {Object} formData
 */
function handleFormSubmit(formData) {
  const { id, mode, ...vehicleData } = formData;

  if (mode === "add") {
    handleCreateVehicle(vehicleData);
  } else if (mode === "edit") {
    handleUpdateVehicle(id, vehicleData);
  }
}

/**
 * Handle creating new vehicle
 * @param {Object} vehicleData
 */
function handleCreateVehicle(vehicleData) {
  const newVehicle = vehicleManager.createVehicle(vehicleData);

  if (newVehicle) {
    console.log("Vehicle created successfully:", newVehicle);
    renderVehicleList();
    showSuccessMessage(`Kendaraan "${newVehicle.name}" berhasil ditambahkan`);
  } else {
    console.error("Failed to create vehicle");
    alert("Gagal menambahkan kendaraan. Silakan coba lagi.");
  }
}

/**
 * Handle updating existing vehicle
 * @param {string} vehicleId
 * @param {Object} vehicleData
 */
function handleUpdateVehicle(vehicleId, vehicleData) {
  const success = vehicleManager.updateVehicle(vehicleId, vehicleData);

  if (success) {
    console.log("Vehicle updated successfully:", vehicleId);
    renderVehicleList();
    showSuccessMessage(`Kendaraan "${vehicleData.name}" berhasil diperbarui`);
  } else {
    console.error("Failed to update vehicle:", vehicleId);
    alert("Gagal memperbarui kendaraan. Silakan coba lagi.");
  }
}

/**
 * Handle form cancel
 */
function handleFormCancel() {
  console.log("Form cancelled");
}

/**
 * Render vehicle list
 * TASK-003 to TASK-007
 */
function renderVehicleList() {
  const vehicles = vehicleManager.getAllVehicles();

  // TASK-002: Update vehicle count
  updateVehicleCount(vehicles.length);

  // Handle empty state
  if (vehicles.length === 0) {
    showEmptyState();
    return;
  }

  hideEmptyState();

  // Clear existing list
  vehicleListElement.innerHTML = "";

  // Render each vehicle card
  vehicles.forEach((vehicle) => {
    const cardElement = createVehicleCard(vehicle);
    vehicleListElement.appendChild(cardElement);
  });
}

/**
 * Create vehicle card element
 * TASK-003 to TASK-006
 * @param {Object} vehicle
 * @returns {HTMLElement}
 */
function createVehicleCard(vehicle) {
  const card = document.createElement("div");
  card.className = "vehicle-card";
  card.dataset.vehicleId = vehicle.id;

  // Get fuel log count
  const fuelLogCount = vehicleManager.getFuelLogCount(vehicle.id);

  // Get vehicle type icon
  const typeIcon = vehicle.type === "motor" ? "bi-motorcycle" : "bi-car-front";

  // Build meta info (type, plate, year)
  const metaParts = [];
  metaParts.push(`<i class="bi ${typeIcon}"></i>`);
  metaParts.push(vehicle.type === "motor" ? "Motor" : "Mobil");

  if (vehicle.plateNumber) {
    metaParts.push('<span class="vehicle-card__meta-divider">•</span>');
    metaParts.push(vehicle.plateNumber);
  }

  if (vehicle.year) {
    metaParts.push('<span class="vehicle-card__meta-divider">•</span>');
    metaParts.push(vehicle.year);
  }

  card.innerHTML = `
    <div class="vehicle-card-header">
      <div class="vehicle-card__color-indicator" style="background-color: ${
        vehicle.color
      };"></div>
      <h5 class="vehicle-card__name">${escapeHtml(vehicle.name)}</h5>
    </div>
    
    <div class="vehicle-card__meta">
      ${metaParts.join(" ")}
    </div>
    
    <div class="vehicle-card__count">
      <i class="bi bi-fuel-pump"></i>
      <span>${fuelLogCount} pengisian</span>
    </div>
    
    <div class="vehicle-card__actions">
      <button class="btn btn-secondary btn-sm" data-action="edit" data-vehicle-id="${
        vehicle.id
      }">
        <i class="bi bi-pencil"></i>
        <span>Edit</span>
      </button>
      <button class="btn btn-outline-danger btn-sm" data-action="delete" data-vehicle-id="${
        vehicle.id
      }">
        <i class="bi bi-trash"></i>
        <span>Hapus</span>
      </button>
    </div>
  `;

  return card;
}

/**
 * Update vehicle count display
 * TASK-002
 * @param {number} count
 */
function updateVehicleCount(count) {
  const text = count === 1 ? "1 kendaraan" : `${count} kendaraan`;
  vehicleCountElement.textContent = text;
}

/**
 * Show empty state
 */
function showEmptyState() {
  vehicleListElement.classList.add("hidden");
  emptyStateElement.classList.remove("hidden");
}

/**
 * Hide empty state
 */
function hideEmptyState() {
  vehicleListElement.classList.remove("hidden");
  emptyStateElement.classList.add("hidden");
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  // Add vehicle button - opens modal (Phase 2)
  addVehicleBtnElement.addEventListener("click", handleAddVehicle);
  addFirstVehicleBtnElement.addEventListener("click", handleAddVehicle);

  // Vehicle card actions (Edit and Delete)
  vehicleListElement.addEventListener("click", handleCardAction);
}

/**
 * Handle add vehicle click
 * Phase 2: Opens the add modal
 */
function handleAddVehicle() {
  console.log("Opening add vehicle modal");
  vehicleForm.openForAdd();
}

/**
 * Handle vehicle card action clicks (Edit / Delete)
 * @param {Event} event
 */
function handleCardAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const vehicleId = button.dataset.vehicleId;

  if (action === "edit") {
    handleEditVehicle(vehicleId);
  } else if (action === "delete") {
    handleDeleteVehicle(vehicleId);
  }
}

/**
 * Handle edit vehicle
 * Phase 2: Opens modal with vehicle data pre-filled
 * @param {string} vehicleId
 */
function handleEditVehicle(vehicleId) {
  const vehicle = vehicleManager.getVehicleById(vehicleId);
  if (!vehicle) {
    console.error("Vehicle not found:", vehicleId);
    return;
  }

  console.log("Opening edit vehicle modal:", vehicle);
  vehicleForm.openForEdit(vehicle);
}

/**
 * Handle delete vehicle
 * Phase 3 (TASK-019): Uses custom confirmation modal
 * @param {string} vehicleId
 */
function handleDeleteVehicle(vehicleId) {
  const vehicle = vehicleManager.getVehicleById(vehicleId);
  if (!vehicle) {
    console.error("Vehicle not found:", vehicleId);
    return;
  }

  const fuelLogCount = vehicleManager.getFuelLogCount(vehicleId);

  // Open custom delete confirmation modal (TASK-019)
  console.log("Opening delete confirmation modal:", vehicle);
  deleteConfirmModal.open(vehicle, fuelLogCount);
}

/**
 * Handle confirm delete action from modal
 * @param {string} vehicleId
 */
function handleConfirmDelete(vehicleId) {
  const vehicle = vehicleManager.getVehicleById(vehicleId);
  if (!vehicle) {
    console.error("Vehicle not found:", vehicleId);
    return;
  }

  const success = vehicleManager.deleteVehicle(vehicleId);

  if (success) {
    console.log("Vehicle deleted successfully:", vehicleId);

    // Re-render list
    renderVehicleList();

    // Show success feedback (temporary - Phase 4 will use toast)
    showSuccessMessage(`Kendaraan "${vehicle.name}" berhasil dihapus`);
  } else {
    console.error("Failed to delete vehicle:", vehicleId);
    alert("Gagal menghapus kendaraan. Silakan coba lagi.");
  }
}

/**
 * Handle cancel delete action from modal
 */
function handleCancelDelete() {
  console.log("Delete cancelled");
}

/**
 * Initialize ToastManager component
 * Phase 4 (TASK-024): Toast notifications
 */
function initToastManager() {
  toastManager = new ToastManager({
    container: toastContainerElement,
    defaultDuration: 3000, // 3 seconds for success
  });
}

/**
 * Show success message
 * Phase 4 (TASK-024): Using toast notification
 * @param {string} message
 */
function showSuccessMessage(message) {
  console.log("SUCCESS:", message);
  toastManager.success(message);
}

/**
 * Show error message
 * Phase 4 (TASK-024): Using toast notification
 * @param {string} message
 */
function showErrorMessage(message) {
  console.error("ERROR:", message);
  toastManager.error(message);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialize page on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}
