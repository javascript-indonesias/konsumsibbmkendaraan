/**
 * Toast Notification Component
 *
 * Clean Architecture: Presentational Component
 * - Self-contained notification system
 * - Auto-dismiss with configurable timing
 * - Multiple toast support with queue
 *
 * TASK-024: Success toasts for add/edit/delete
 */

export class ToastManager {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.container - Container for toast elements
   * @param {number} [options.defaultDuration] - Default auto-dismiss duration (ms)
   */
  constructor(options) {
    this.container = options.container;
    this.defaultDuration = options.defaultDuration || 3000;
    this.toasts = new Map(); // Map<id, timeoutId>
  }

  /**
   * Show success toast
   * @param {string} message
   * @param {number} [duration] - Optional custom duration
   */
  success(message, duration = this.defaultDuration) {
    this._show(message, "success", duration);
  }

  /**
   * Show error toast
   * @param {string} message
   * @param {number} [duration] - Optional custom duration (default 5000ms)
   */
  error(message, duration = 5000) {
    this._show(message, "error", duration);
  }

  /**
   * Show info toast
   * @param {string} message
   * @param {number} [duration] - Optional custom duration
   */
  info(message, duration = this.defaultDuration) {
    this._show(message, "info", duration);
  }

  /**
   * Show toast notification
   * @private
   * @param {string} message
   * @param {'success'|'error'|'info'} type
   * @param {number} duration
   */
  _show(message, type, duration) {
    const id = this._generateId();
    const toastElement = this._createToastElement(id, message, type);

    // Add to container
    this.container.appendChild(toastElement);

    // Trigger animation (slight delay for CSS transition)
    setTimeout(() => {
      toastElement.classList.add("toast--show");
    }, 10);

    // Auto-dismiss
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        this._dismiss(id);
      }, duration);

      this.toasts.set(id, timeoutId);
    }
  }

  /**
   * Dismiss a specific toast
   * @private
   * @param {string} id
   */
  _dismiss(id) {
    const toastElement = this.container.querySelector(
      `[data-toast-id="${id}"]`
    );
    if (!toastElement) return;

    // Clear timeout if exists
    const timeoutId = this.toasts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.toasts.delete(id);
    }

    // Fade out animation
    toastElement.classList.remove("toast--show");
    toastElement.classList.add("toast--hide");

    // Remove from DOM after animation
    setTimeout(() => {
      if (toastElement.parentNode) {
        this.container.removeChild(toastElement);
      }
    }, 300);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    const toastElements = this.container.querySelectorAll(".toast");
    toastElements.forEach((el) => {
      const id = el.dataset.toastId;
      this._dismiss(id);
    });
  }

  /**
   * Create toast element
   * @private
   * @param {string} id
   * @param {string} message
   * @param {string} type
   * @returns {HTMLElement}
   */
  _createToastElement(id, message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.dataset.toastId = id;

    // Icon based on type
    const iconMap = {
      success: "bi-check-circle-fill",
      error: "bi-exclamation-circle-fill",
      info: "bi-info-circle-fill",
    };

    toast.innerHTML = `
      <div class="toast__icon">
        <i class="bi ${iconMap[type]}"></i>
      </div>
      <div class="toast__message">${this._escapeHtml(message)}</div>
      <button class="toast__close" aria-label="Tutup">
        <i class="bi bi-x"></i>
      </button>
    `;

    // Close button event
    const closeBtn = toast.querySelector(".toast__close");
    closeBtn.addEventListener("click", () => {
      this._dismiss(id);
    });

    return toast;
  }

  /**
   * Generate unique ID
   * @private
   * @returns {string}
   */
  _generateId() {
    return `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Escape HTML to prevent XSS
   * @private
   * @param {string} text
   * @returns {string}
   */
  _escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
