/**
 * ColorPicker Component - Reusable color selection widget
 *
 * Clean Architecture: Presentational Component
 * - No direct storage/business logic dependencies
 * - Emits events for color selection
 * - Receives configuration via constructor
 *
 * TASK-013: Create color picker grid
 * TASK-014: Implement color selection visual (border + checkmark)
 * TASK-015: Set default color logic
 */

/**
 * Vehicle color palette (from spec-design-visual-style.md)
 */
export const VEHICLE_COLORS = [
  { hex: "#FF6384", name: "Rose Pink" },
  { hex: "#36A2EB", name: "Sky Blue" },
  { hex: "#FFCE56", name: "Sunny Yellow" },
  { hex: "#4BC0C0", name: "Teal" },
  { hex: "#9966FF", name: "Purple" },
  { hex: "#FF9F40", name: "Orange" },
  { hex: "#47D147", name: "Green" },
  { hex: "#C9CBCF", name: "Silver Grey" },
  { hex: "#FF6699", name: "Hot Pink" },
  { hex: "#33CCCC", name: "Cyan" },
];

export class ColorPicker {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.container - Container element to render into
   * @param {string[]} [options.usedColors] - Colors already in use (to show as "used")
   * @param {string} [options.selectedColor] - Initially selected color hex
   * @param {Function} [options.onChange] - Callback when color is selected
   */
  constructor(options) {
    this.container = options.container;
    this.usedColors = options.usedColors || [];
    this.selectedColor = options.selectedColor || null;
    this.onChange = options.onChange || (() => {});

    this._render();
    this._attachEventListeners();
  }

  /**
   * Get first available (unused) color
   * TASK-015: Default color logic
   * @param {string[]} usedColors
   * @returns {string} Hex color
   */
  static getFirstAvailableColor(usedColors = []) {
    const usedSet = new Set(usedColors.map((c) => c.toUpperCase()));
    const available = VEHICLE_COLORS.find(
      (c) => !usedSet.has(c.hex.toUpperCase())
    );
    return available ? available.hex : VEHICLE_COLORS[0].hex;
  }

  /**
   * Set selected color programmatically
   * @param {string} color - Hex color
   */
  setSelected(color) {
    this.selectedColor = color;
    this._updateSelection();
  }

  /**
   * Get currently selected color
   * @returns {string|null}
   */
  getSelected() {
    return this.selectedColor;
  }

  /**
   * Update used colors list
   * @param {string[]} usedColors
   */
  setUsedColors(usedColors) {
    this.usedColors = usedColors;
    this._render();
    this._attachEventListeners();
  }

  /**
   * Render color picker grid
   * TASK-013: 10 color swatches in grid
   * @private
   */
  _render() {
    const usedSet = new Set(this.usedColors.map((c) => c.toUpperCase()));

    const swatchesHtml = VEHICLE_COLORS.map((color) => {
      const isSelected =
        this.selectedColor &&
        this.selectedColor.toUpperCase() === color.hex.toUpperCase();
      const isUsed = usedSet.has(color.hex.toUpperCase());

      return `
        <button 
          type="button"
          class="color-swatch ${isSelected ? "color-swatch--selected" : ""} ${
        isUsed ? "color-swatch--used" : ""
      }"
          data-color="${color.hex}"
          title="${color.name}${isUsed ? " (sudah digunakan)" : ""}"
          aria-label="Pilih warna ${color.name}"
        >
          <span class="color-swatch__circle" style="background-color: ${
            color.hex
          };"></span>
          <span class="color-swatch__checkmark">
            <i class="bi bi-check"></i>
          </span>
        </button>
      `;
    }).join("");

    this.container.innerHTML = `
      <div class="color-picker">
        <div class="color-picker__grid">
          ${swatchesHtml}
        </div>
      </div>
    `;
  }

  /**
   * Attach click event listeners to swatches
   * @private
   */
  _attachEventListeners() {
    const swatches = this.container.querySelectorAll(".color-swatch");

    swatches.forEach((swatch) => {
      swatch.addEventListener("click", (e) => {
        e.preventDefault();
        const color = swatch.dataset.color;
        this._selectColor(color);
      });
    });
  }

  /**
   * Handle color selection
   * TASK-014: Border + checkmark on selected
   * @private
   * @param {string} color
   */
  _selectColor(color) {
    this.selectedColor = color;
    this._updateSelection();
    this.onChange(color);
  }

  /**
   * Update visual selection state
   * @private
   */
  _updateSelection() {
    const swatches = this.container.querySelectorAll(".color-swatch");

    swatches.forEach((swatch) => {
      const swatchColor = swatch.dataset.color.toUpperCase();
      const isSelected =
        this.selectedColor && this.selectedColor.toUpperCase() === swatchColor;

      swatch.classList.toggle("color-swatch--selected", isSelected);
    });
  }
}
