/**
 * VehicleForm Component - Add/Edit vehicle form with validation
 *
 * Clean Architecture: Presentational/Controller Component
 * - Handles form rendering and validation UI
 * - Delegates business validation to VehicleManager
 * - Emits events for form submission
 *
 * TASK-008: Modal structure
 * TASK-009: Name input field
 * TASK-010: Vehicle type toggle
 * TASK-011: Year input
 * TASK-012: Plate number input
 */

import { ColorPicker } from "./color-picker.js";

export class VehicleForm {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.modalElement - Modal container element
   * @param {Function} options.onSubmit - Callback when form is submitted (data) => void
   * @param {Function} options.onCancel - Callback when form is cancelled
   * @param {Function} options.getUsedColors - Function to get used colors () => string[]
   * @param {Function} options.validateData - Function to validate data (data) => {isValid, errors}
   */
  constructor(options) {
    this.modalElement = options.modalElement;
    this.onSubmit = options.onSubmit || (() => {});
    this.onCancel = options.onCancel || (() => {});
    this.getUsedColors = options.getUsedColors || (() => []);
    this.validateData =
      options.validateData || (() => ({ isValid: true, errors: [] }));

    this.mode = "add"; // 'add' or 'edit'
    this.editingVehicleId = null;
    this.colorPicker = null;

    this._cacheElements();
    this._attachEventListeners();
  }

  /**
   * Cache DOM elements
   * @private
   */
  _cacheElements() {
    this.form = this.modalElement.querySelector("#vehicleForm");
    this.titleElement = this.modalElement.querySelector("#modalTitle");
    this.submitBtn = this.modalElement.querySelector("#submitBtn");
    this.cancelBtn = this.modalElement.querySelector("#cancelBtn");
    this.closeBtn = this.modalElement.querySelector("#closeModalBtn");
    this.backdrop = this.modalElement.querySelector(".modal-backdrop");

    // Form fields
    this.nameInput = this.modalElement.querySelector("#vehicleName");
    this.typeMotorBtn = this.modalElement.querySelector("#typeMotor");
    this.typeMobilBtn = this.modalElement.querySelector("#typeMobil");
    this.yearInput = this.modalElement.querySelector("#vehicleYear");
    this.plateInput = this.modalElement.querySelector("#vehiclePlate");
    this.colorPickerContainer = this.modalElement.querySelector(
      "#colorPickerContainer"
    );
    this.errorContainer = this.modalElement.querySelector("#formErrors");
  }

  /**
   * Attach event listeners
   * @private
   */
  _attachEventListeners() {
    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleSubmit();
    });

    // Cancel button
    this.cancelBtn.addEventListener("click", () => this.close());

    // Close button (X)
    this.closeBtn.addEventListener("click", () => this.close());

    // Backdrop click
    this.backdrop.addEventListener("click", () => this.close());

    // Type toggle buttons
    this.typeMotorBtn.addEventListener("click", () =>
      this._selectType("motor")
    );
    this.typeMobilBtn.addEventListener("click", () =>
      this._selectType("mobil")
    );

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this._isOpen()) {
        this.close();
      }
    });

    // Real-time validation for name
    this.nameInput.addEventListener("input", () =>
      this._clearFieldError("name")
    );
  }

  /**
   * Open modal for adding new vehicle
   * TASK-015: Default color selection
   */
  openForAdd() {
    this.mode = "add";
    this.editingVehicleId = null;

    // Reset form
    this.form.reset();
    this._selectType("motor"); // Default type

    // Initialize color picker with first available color
    const usedColors = this.getUsedColors();
    const defaultColor = ColorPicker.getFirstAvailableColor(usedColors);
    this._initColorPicker(usedColors, defaultColor);

    // Update UI
    this.titleElement.textContent = "Tambah Kendaraan";
    this.submitBtn.textContent = "Simpan Kendaraan";

    this._clearErrors();
    this._show();
  }

  /**
   * Open modal for editing existing vehicle
   * @param {Object} vehicle - Vehicle data to edit
   */
  openForEdit(vehicle) {
    this.mode = "edit";
    this.editingVehicleId = vehicle.id;

    // Pre-fill form with existing data
    this.nameInput.value = vehicle.name || "";
    this._selectType(vehicle.type || "motor");
    this.yearInput.value = vehicle.year || "";
    this.plateInput.value = vehicle.plateNumber || "";

    // Initialize color picker with current color selected
    // Exclude current vehicle's color from "used" list for edit mode
    const usedColors = this.getUsedColors().filter(
      (c) => c.toUpperCase() !== (vehicle.color || "").toUpperCase()
    );
    this._initColorPicker(usedColors, vehicle.color);

    // Update UI
    this.titleElement.textContent = "Edit Kendaraan";
    this.submitBtn.textContent = "Simpan Perubahan";

    this._clearErrors();
    this._show();
  }

  /**
   * Close modal
   */
  close() {
    this._hide();
    this.onCancel();
  }

  /**
   * Initialize color picker
   * @private
   * @param {string[]} usedColors
   * @param {string} selectedColor
   */
  _initColorPicker(usedColors, selectedColor) {
    if (this.colorPicker) {
      this.colorPicker.setUsedColors(usedColors);
      this.colorPicker.setSelected(selectedColor);
    } else {
      this.colorPicker = new ColorPicker({
        container: this.colorPickerContainer,
        usedColors: usedColors,
        selectedColor: selectedColor,
        onChange: (color) => {
          console.log("Color selected:", color);
        },
      });
    }
  }

  /**
   * Handle type selection
   * TASK-010: Vehicle type toggle
   * @private
   * @param {'motor'|'mobil'} type
   */
  _selectType(type) {
    this.typeMotorBtn.classList.toggle(
      "type-toggle--selected",
      type === "motor"
    );
    this.typeMobilBtn.classList.toggle(
      "type-toggle--selected",
      type === "mobil"
    );
  }

  /**
   * Get currently selected type
   * @private
   * @returns {'motor'|'mobil'}
   */
  _getSelectedType() {
    return this.typeMotorBtn.classList.contains("type-toggle--selected")
      ? "motor"
      : "mobil";
  }

  /**
   * Handle form submission
   * @private
   */
  _handleSubmit() {
    const formData = this._getFormData();

    // Validate using external validator
    const validation = this.validateData(formData);

    if (!validation.isValid) {
      this._showErrors(validation.errors);
      return;
    }

    // Submit data
    this.onSubmit({
      ...formData,
      id: this.editingVehicleId, // null for add, id for edit
      mode: this.mode,
    });

    this._hide();
  }

  /**
   * Get form data
   * @private
   * @returns {Object}
   */
  _getFormData() {
    const yearValue = this.yearInput.value.trim();

    return {
      name: this.nameInput.value.trim(),
      type: this._getSelectedType(),
      year: yearValue ? parseInt(yearValue, 10) : null,
      plateNumber: this.plateInput.value.trim(),
      color: this.colorPicker ? this.colorPicker.getSelected() : null,
    };
  }

  /**
   * Show validation errors
   * @private
   * @param {string[]} errors
   */
  _showErrors(errors) {
    this.errorContainer.innerHTML = `
      <div class="alert alert-danger">
        <ul class="mb-0">
          ${errors.map((err) => `<li>${err}</li>`).join("")}
        </ul>
      </div>
    `;
    this.errorContainer.classList.remove("hidden");

    // Scroll to errors
    this.errorContainer.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  /**
   * Clear all errors
   * @private
   */
  _clearErrors() {
    this.errorContainer.innerHTML = "";
    this.errorContainer.classList.add("hidden");
  }

  /**
   * Clear specific field error
   * @private
   * @param {string} fieldName
   */
  _clearFieldError(fieldName) {
    // For future per-field validation UI
  }

  /**
   * Show modal
   * @private
   */
  _show() {
    this.modalElement.classList.remove("hidden");
    this.modalElement.classList.add("modal--open");
    document.body.classList.add("modal-open");

    // Focus first input
    setTimeout(() => this.nameInput.focus(), 100);
  }

  /**
   * Hide modal
   * @private
   */
  _hide() {
    this.modalElement.classList.add("hidden");
    this.modalElement.classList.remove("modal--open");
    document.body.classList.remove("modal-open");
  }

  /**
   * Check if modal is open
   * @private
   * @returns {boolean}
   */
  _isOpen() {
    return this.modalElement.classList.contains("modal--open");
  }
}
