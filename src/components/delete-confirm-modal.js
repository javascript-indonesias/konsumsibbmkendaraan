/**
 * DeleteConfirmModal Component - Reusable confirmation modal
 *
 * Clean Architecture: Presentational Component
 * - No business logic dependencies
 * - Emits events for user actions
 * - Receives data via public methods
 *
 * TASK-019: Delete confirmation modal with log count warning
 */

export class DeleteConfirmModal {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.modalElement - Modal container element
   * @param {Function} options.onConfirm - Callback when confirmed
   * @param {Function} options.onCancel - Callback when cancelled
   */
  constructor(options) {
    this.modalElement = options.modalElement;
    this.onConfirm = options.onConfirm || (() => {});
    this.onCancel = options.onCancel || (() => {});

    this.currentVehicle = null;
    this.logCount = 0;

    this._cacheElements();
    this._attachEventListeners();
  }

  /**
   * Cache DOM elements
   * @private
   */
  _cacheElements() {
    this.backdrop = this.modalElement.querySelector(".modal-backdrop");
    this.closeBtn = this.modalElement.querySelector("#closeDeleteModalBtn");
    this.cancelBtn = this.modalElement.querySelector("#cancelDeleteBtn");
    this.confirmBtn = this.modalElement.querySelector("#confirmDeleteBtn");
    this.vehicleNameElement =
      this.modalElement.querySelector("#deleteVehicleName");
    this.warningMessageElement = this.modalElement.querySelector(
      "#deleteWarningMessage"
    );
  }

  /**
   * Attach event listeners
   * @private
   */
  _attachEventListeners() {
    // Cancel button
    this.cancelBtn.addEventListener("click", () => this.close());

    // Close button (X)
    this.closeBtn.addEventListener("click", () => this.close());

    // Backdrop click
    this.backdrop.addEventListener("click", () => this.close());

    // Confirm button
    this.confirmBtn.addEventListener("click", () => this._handleConfirm());

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this._isOpen()) {
        this.close();
      }
    });
  }

  /**
   * Open modal with vehicle data
   * @param {Object} vehicle - Vehicle to delete
   * @param {number} logCount - Number of fuel logs for this vehicle
   */
  open(vehicle, logCount = 0) {
    this.currentVehicle = vehicle;
    this.logCount = logCount;

    // Update modal content
    this._updateContent();

    // Show modal
    this._show();
  }

  /**
   * Close modal
   */
  close() {
    this._hide();
    this.currentVehicle = null;
    this.logCount = 0;
    this.onCancel();
  }

  /**
   * Update modal content with vehicle data
   * @private
   */
  _updateContent() {
    if (!this.currentVehicle) return;

    // Update vehicle name
    this.vehicleNameElement.textContent = this.currentVehicle.name;

    // Update warning message based on log count
    if (this.logCount > 0) {
      this.warningMessageElement.innerHTML = `
        <div class="delete-warning delete-warning--danger">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <p class="delete-warning__text">
            Kendaraan ini memiliki <strong>${this.logCount} catatan pengisian</strong> 
            yang akan <strong>ikut terhapus</strong>.
          </p>
        </div>
        <p class="delete-warning__footer">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      `;
    } else {
      this.warningMessageElement.innerHTML = `
        <p class="delete-warning__footer">
          Tindakan ini tidak dapat dibatalkan.
        </p>
      `;
    }
  }

  /**
   * Handle confirm action
   * @private
   */
  _handleConfirm() {
    if (!this.currentVehicle) return;

    const vehicleId = this.currentVehicle.id;
    this._hide();
    this.onConfirm(vehicleId);

    // Reset state
    this.currentVehicle = null;
    this.logCount = 0;
  }

  /**
   * Show modal
   * @private
   */
  _show() {
    this.modalElement.classList.remove("hidden");
    this.modalElement.classList.add("modal--open");
    document.body.classList.add("modal-open");

    // Focus confirm button for keyboard accessibility
    setTimeout(() => this.confirmBtn.focus(), 100);
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
