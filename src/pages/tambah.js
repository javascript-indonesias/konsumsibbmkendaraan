/**
 * Tambah/Edit Pengisian BBM Page Controller
 *
 * Requirements (REQ-FRM-001 to REQ-FRM-007):
 * - Support Add and Edit mode via ?edit={id}
 * - Required fields: vehicle, date, liter, totalPrice, odometer
 * - Optional fields: fuelType, notes
 * - Auto-calculate price per liter
 * - Validation before submit
 * - Default date = today
 * - Warning if odometer < last odometer
 */

import { StorageManager } from "@modules/storage.js";
import { VehicleManager } from "@modules/vehicle.js";
import { FuelLogManager } from "@modules/fuel-log.js";
import { formatCurrency, formatDate } from "@modules/utils.js";
import { ToastManager } from "@components/toast.js";
import { VehicleForm } from "@components/vehicle-form.js";
import { ColorPicker } from "@components/color-picker.js";

// Initialize managers
const storageManager = new StorageManager();
const vehicleManager = new VehicleManager(storageManager);
const fuelLogManager = new FuelLogManager(storageManager);

// Toast manager instance
let toastManager = null;

// VehicleForm instance
let vehicleForm = null;

// Mode state
let isEditMode = false;
let editingLogId = null;
let selectedVehicleId = null;

// DOM Elements
const formElement = document.getElementById("fuelLogForm");
const formErrorsElement = document.getElementById("formErrors");
const navbarTitleElement = document.getElementById("navbarTitle");
const backBtnElement = document.getElementById("backBtn");
const cancelBtnElement = document.getElementById("cancelBtn");
const vehicleSelectElement = document.getElementById("vehicleSelect");
const dateInputElement = document.getElementById("dateInput");
const odometerInputElement = document.getElementById("odometerInput");
const odometerHelperElement = document.getElementById("odometerHelper");
const odometerWarningElement = document.getElementById("odometerWarning");
const literInputElement = document.getElementById("literInput");
const totalPriceInputElement = document.getElementById("totalPriceInput");
const pricePerLiterElement = document.getElementById("pricePerLiter");
const fuelTypeSelectElement = document.getElementById("fuelTypeSelect");
const notesInputElement = document.getElementById("notesInput");
const charCounterElement = document.getElementById("charCounter");
const submitBtnElement = document.getElementById("submitBtn");
const submitBtnTextElement = document.getElementById("submitBtnText");
const vehicleModalElement = document.getElementById("vehicleModal");
const colorPickerContainerElement = document.getElementById(
  "colorPickerContainer"
);

/**
 * Initialize page
 */
function initPage() {
  // Initialize storage
  storageManager.init(true);

  // Initialize ToastManager
  initToastManager();

  // Initialize VehicleForm
  initVehicleForm();

  // Check for edit mode (TASK-021)
  checkEditMode();

  // Populate vehicle dropdown (TASK-002)
  populateVehicleDropdown();

  // Set default date to today (TASK-003)
  setDefaultDate();

  // Setup event listeners
  setupEventListeners();

  // If edit mode, load existing data (TASK-022, TASK-023)
  if (isEditMode) {
    loadExistingData();
  }
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
 * Initialize VehicleForm component for quick add
 */
function initVehicleForm() {
  vehicleForm = new VehicleForm({
    modalElement: vehicleModalElement,
    onSubmit: handleVehicleFormSubmit,
    onCancel: handleVehicleFormCancel,
    getUsedColors: getUsedVehicleColors,
    validateData: (data) => vehicleManager.validateVehicleData(data),
  });
}

/**
 * Get used vehicle colors for color picker
 */
function getUsedVehicleColors() {
  const vehicles = vehicleManager.getAllVehicles();
  return vehicles.map((v) => v.color);
}

/**
 * Handle vehicle form submission
 */
function handleVehicleFormSubmit(data) {
  try {
    const newVehicle = vehicleManager.createVehicle(data);
    toastManager.success(`Kendaraan "${newVehicle.name}" berhasil ditambahkan`);

    // Refresh dropdown
    populateVehicleDropdown();

    // Auto-select the new vehicle
    vehicleSelectElement.value = newVehicle.id;
    selectedVehicleId = newVehicle.id;
    updateOdometerHelper();
  } catch (error) {
    console.error("Error creating vehicle:", error);
    toastManager.error("Gagal menambahkan kendaraan");
  }
}

/**
 * Handle vehicle form cancel
 */
function handleVehicleFormCancel() {
  console.log("Vehicle form cancelled");
}

/**
 * Check if in edit mode from URL params (TASK-021)
 */
function checkEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("edit");

  if (editId) {
    isEditMode = true;
    editingLogId = editId;
    navbarTitleElement.textContent = "Edit Pengisian"; // TASK-026
    submitBtnTextElement.textContent = "Simpan Perubahan"; // TASK-025
  }
}

/**
 * Populate vehicle dropdown (TASK-002)
 */
function populateVehicleDropdown() {
  const vehicles = vehicleManager.getAllVehicles();

  // Clear existing options (keep placeholder)
  vehicleSelectElement.innerHTML =
    '<option value="">Pilih kendaraan...</option>';

  if (vehicles.length === 0) {
    // No vehicles available - show add option
    vehicleSelectElement.innerHTML = `
      <option value="">Belum ada kendaraan</option>
      <option value="__ADD_NEW__" style="border-top: 1px solid #ddd; margin-top: 4px;">+ Tambah Kendaraan Baru...</option>
    `;
  } else {
    // Add vehicle options
    vehicles.forEach((vehicle) => {
      const option = document.createElement("option");
      option.value = vehicle.id;
      option.textContent = `${vehicle.name} (${vehicle.type})`;
      option.dataset.color = vehicle.color;
      vehicleSelectElement.appendChild(option);
    });

    // Add separator and "Add New" option
    const separatorOption = document.createElement("option");
    separatorOption.disabled = true;
    separatorOption.textContent = "─────────────────────";
    vehicleSelectElement.appendChild(separatorOption);

    const addOption = document.createElement("option");
    addOption.value = "__ADD_NEW__";
    addOption.textContent = "+ Tambah Kendaraan Baru...";
    vehicleSelectElement.appendChild(addOption);

    // If only one vehicle, select it automatically
    if (vehicles.length === 1) {
      vehicleSelectElement.value = vehicles[0].id;
      selectedVehicleId = vehicles[0].id;
      updateOdometerHelper();
    }
  }
}

/**
 * Set default date to today (TASK-003)
 */
function setDefaultDate() {
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];
  dateInputElement.value = dateString;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Form submission (TASK-017)
  formElement.addEventListener("submit", handleFormSubmit);

  // Back button
  backBtnElement.addEventListener("click", handleBack);

  // Cancel button (TASK-020)
  cancelBtnElement.addEventListener("click", handleCancel);

  // Vehicle selection change
  vehicleSelectElement.addEventListener("change", handleVehicleChange);

  // Price calculation (TASK-010)
  literInputElement.addEventListener("input", calculatePricePerLiter);
  totalPriceInputElement.addEventListener("input", calculatePricePerLiter);

  // Odometer validation (TASK-012)
  odometerInputElement.addEventListener("input", validateOdometer);

  // Notes character counter (TASK-009)
  notesInputElement.addEventListener("input", updateCharCounter);
}

/**
 * Handle vehicle selection change
 */
function handleVehicleChange() {
  const selectedValue = vehicleSelectElement.value;

  // Check if "Add New" option was selected
  if (selectedValue === "__ADD_NEW__") {
    // Open vehicle modal
    vehicleForm.openForAdd();
    // Reset dropdown to placeholder
    vehicleSelectElement.value = "";
    return;
  }

  selectedVehicleId = selectedValue;
  if (selectedVehicleId) {
    updateOdometerHelper();
    validateOdometer();
  }
}

/**
 * Update odometer helper text (TASK-011)
 */
function updateOdometerHelper() {
  if (!selectedVehicleId) {
    odometerHelperElement.classList.add("hidden");
    return;
  }

  const lastLog = fuelLogManager.getLastLogByVehicle(selectedVehicleId);
  if (lastLog) {
    odometerHelperElement.textContent = `Odometer terakhir: ${lastLog.odometer.toLocaleString(
      "id-ID"
    )} km`;
    odometerHelperElement.classList.remove("hidden");
  } else {
    odometerHelperElement.classList.add("hidden");
  }
}

/**
 * Validate odometer against last log (TASK-012)
 */
function validateOdometer() {
  if (!selectedVehicleId) return;

  const currentOdometer = parseInt(odometerInputElement.value) || 0;
  const lastLog = fuelLogManager.getLastLogByVehicle(selectedVehicleId);

  if (lastLog && currentOdometer < lastLog.odometer) {
    odometerWarningElement.classList.remove("hidden");
  } else {
    odometerWarningElement.classList.add("hidden");
  }
}

/**
 * Calculate price per liter (TASK-010)
 */
function calculatePricePerLiter() {
  const liter = parseFloat(literInputElement.value) || 0;
  const totalPrice = parseFloat(totalPriceInputElement.value) || 0;

  if (liter > 0 && totalPrice > 0) {
    const pricePerLiter = totalPrice / liter;
    pricePerLiterElement.textContent = formatCurrency(pricePerLiter);
  } else {
    pricePerLiterElement.textContent = "Rp 0";
  }
}

/**
 * Update character counter (TASK-009)
 */
function updateCharCounter() {
  const length = notesInputElement.value.length;
  charCounterElement.textContent = `${length}/200`;
}

/**
 * Handle form submission (TASK-017)
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  // Clear previous errors
  formErrorsElement.innerHTML = "";
  formErrorsElement.classList.add("hidden");

  // Validate form (TASK-015)
  const validationResult = validateForm();
  if (!validationResult.isValid) {
    displayValidationErrors(validationResult.errors);
    return;
  }

  // Get form data
  const formData = getFormData();

  // Show loading state (TASK-018)
  setLoadingState(true);

  try {
    if (isEditMode) {
      // Update existing log (TASK-027)
      await fuelLogManager.updateFuelLog(editingLogId, formData);
      toastManager.success(`Pengisian berhasil diperbarui`);
    } else {
      // Create new log
      await fuelLogManager.createFuelLog(formData);
      toastManager.success(`Pengisian berhasil ditambahkan`);
    }

    // Navigate back after short delay
    setTimeout(() => {
      navigateToRiwayat();
    }, 1000);
  } catch (error) {
    console.error("Error saving fuel log:", error);
    toastManager.error("Gagal menyimpan data. Silakan coba lagi.");
    setLoadingState(false);
  }
}

/**
 * Validate form (TASK-015)
 */
function validateForm() {
  const errors = [];

  // Validate vehicle
  if (!vehicleSelectElement.value) {
    errors.push("Pilih kendaraan");
  }

  // Validate date (VAL-004)
  const dateValue = dateInputElement.value;
  if (!dateValue) {
    errors.push("Tanggal harus diisi");
  } else {
    const selectedDate = new Date(dateValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      errors.push("Tanggal tidak boleh di masa depan");
    }
  }

  // Validate odometer (VAL-003)
  const odometer = parseInt(odometerInputElement.value);
  if (isNaN(odometer) || odometer < 0 || odometer > 9999999) {
    errors.push("Odometer harus 0 - 9.999.999 km");
  }

  // Validate liter (VAL-001)
  const liter = parseFloat(literInputElement.value);
  if (isNaN(liter) || liter < 0.01 || liter > 999.99) {
    errors.push("Liter harus 0.01 - 999.99");
  }

  // Validate total price (VAL-002)
  const totalPrice = parseFloat(totalPriceInputElement.value);
  if (isNaN(totalPrice) || totalPrice < 1 || totalPrice > 99999999) {
    errors.push("Total harga harus 1 - 99.999.999");
  }

  // Validate notes (VAL-005)
  const notes = notesInputElement.value;
  if (notes && notes.length > 200) {
    errors.push("Catatan maksimal 200 karakter");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Display validation errors (TASK-014)
 */
function displayValidationErrors(errors) {
  const errorList = document.createElement("ul");
  errors.forEach((error) => {
    const li = document.createElement("li");
    li.textContent = error;
    errorList.appendChild(li);
  });

  formErrorsElement.innerHTML = "";
  formErrorsElement.appendChild(errorList);
  formErrorsElement.classList.remove("hidden");

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Get form data
 */
function getFormData() {
  return {
    vehicleId: vehicleSelectElement.value,
    date: dateInputElement.value,
    odometer: parseInt(odometerInputElement.value),
    liter: parseFloat(literInputElement.value),
    totalPrice: parseFloat(totalPriceInputElement.value),
    fuelType: fuelTypeSelectElement.value || null,
    notes: notesInputElement.value || null,
  };
}

/**
 * Set loading state (TASK-018)
 */
function setLoadingState(isLoading) {
  submitBtnElement.disabled = isLoading;
  if (isLoading) {
    submitBtnTextElement.textContent = "Menyimpan...";
  } else {
    submitBtnTextElement.textContent = isEditMode
      ? "Simpan Perubahan"
      : "Simpan Pengisian";
  }
}

/**
 * Load existing data for edit mode (TASK-022, TASK-023)
 */
function loadExistingData() {
  try {
    const fuelLog = fuelLogManager.getFuelLogById(editingLogId);
    if (!fuelLog) {
      toastManager.error("Data tidak ditemukan");
      setTimeout(() => navigateToRiwayat(), 1500);
      return;
    }

    // Pre-fill form fields (TASK-023)
    vehicleSelectElement.value = fuelLog.vehicleId;
    vehicleSelectElement.disabled = true; // TASK-024
    dateInputElement.value = fuelLog.date;
    odometerInputElement.value = fuelLog.odometer;
    literInputElement.value = fuelLog.liter;
    totalPriceInputElement.value = fuelLog.totalPrice;
    fuelTypeSelectElement.value = fuelLog.fuelType || "";
    notesInputElement.value = fuelLog.notes || "";

    // Update calculated fields
    selectedVehicleId = fuelLog.vehicleId;
    calculatePricePerLiter();
    updateCharCounter();
    updateOdometerHelper();
  } catch (error) {
    console.error("Error loading fuel log:", error);
    toastManager.error("Gagal memuat data");
  }
}

/**
 * Handle back button (TASK-019)
 */
function handleBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "/index.html";
  }
}

/**
 * Handle cancel button (TASK-020)
 */
function handleCancel() {
  // Check if form is dirty
  const isDirty = checkFormDirty();

  if (isDirty) {
    const confirmed = confirm(
      "Anda memiliki perubahan yang belum disimpan. Yakin ingin membatalkan?"
    );
    if (!confirmed) return;
  }

  navigateToRiwayat();
}

/**
 * Check if form has unsaved changes
 */
function checkFormDirty() {
  // Simple check: if any input has value
  return (
    vehicleSelectElement.value ||
    literInputElement.value ||
    totalPriceInputElement.value ||
    odometerInputElement.value ||
    fuelTypeSelectElement.value ||
    notesInputElement.value
  );
}

/**
 * Navigate to Riwayat page
 */
function navigateToRiwayat() {
  window.location.href = "/riwayat.html";
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}
