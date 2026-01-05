/**
 * StorageManager - Abstraction layer for localStorage
 *
 * Clean Architecture: Data Access Layer
 * - Handles all localStorage interactions
 * - Provides error handling and validation
 * - Single Responsibility: Storage operations only
 */

const STORAGE_KEY = "bbm_app_data";
const APP_VERSION = "1.0.0";

/**
 * Default application data structure
 */
const DEFAULT_DATA = {
  version: APP_VERSION,
  vehicles: [],
  fuelLogs: [],
  settings: {
    colorPalette: [
      "#FF6384", // Rose Pink
      "#36A2EB", // Sky Blue
      "#FFCE56", // Sunny Yellow
      "#4BC0C0", // Teal
      "#9966FF", // Purple
      "#FF9F40", // Orange
      "#47D147", // Green
      "#C9CBCF", // Silver Grey
      "#FF6699", // Hot Pink
      "#33CCCC", // Cyan
    ],
    currency: "IDR",
  },
};

/**
 * Sample seed data for development/testing
 */
const SEED_DATA = {
  version: APP_VERSION,
  vehicles: [
    {
      id: "seed-vehicle-1",
      name: "Honda Beat",
      type: "motor",
      year: 2020,
      plateNumber: "B 1234 ABC",
      color: "#FF6384",
      createdAt: new Date().toISOString(),
    },
    {
      id: "seed-vehicle-2",
      name: "Toyota Avanza",
      type: "mobil",
      year: 2018,
      plateNumber: "D 5678 XYZ",
      color: "#36A2EB",
      createdAt: new Date().toISOString(),
    },
  ],
  fuelLogs: [],
  settings: DEFAULT_DATA.settings,
};

export class StorageManager {
  constructor(storageKey = STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  /**
   * Initialize storage with default or seed data
   * @param {boolean} useSeedData - Whether to use seed data for testing
   * @returns {boolean} Success status
   */
  init(useSeedData = true) {
    try {
      if (!this.isStorageAvailable()) {
        console.error("localStorage is not available");
        return false;
      }

      const existing = this.getData();
      if (!existing) {
        const initialData = useSeedData ? SEED_DATA : DEFAULT_DATA;
        return this.setData(initialData);
      }

      return true;
    } catch (error) {
      console.error("StorageManager init error:", error);
      return false;
    }
  }

  /**
   * Get all application data
   * @returns {Object|null} Application data or null if error
   */
  getData() {
    try {
      const rawData = localStorage.getItem(this.storageKey);
      if (!rawData) return null;

      const data = JSON.parse(rawData);

      // Basic validation
      if (
        !data.version ||
        !Array.isArray(data.vehicles) ||
        !Array.isArray(data.fuelLogs)
      ) {
        console.warn("Invalid data structure, initializing with defaults");
        return null;
      }

      return data;
    } catch (error) {
      console.error("StorageManager getData error:", error);
      return null;
    }
  }

  /**
   * Save all application data
   * @param {Object} data - Complete application data
   * @returns {boolean} Success status
   */
  setData(data) {
    try {
      if (!this.isStorageAvailable()) {
        throw new Error("localStorage not available");
      }

      // Validate data structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data: must be an object");
      }

      if (!Array.isArray(data.vehicles)) {
        throw new Error("Invalid data: vehicles must be an array");
      }

      if (!Array.isArray(data.fuelLogs)) {
        throw new Error("Invalid data: fuelLogs must be an array");
      }

      const jsonString = JSON.stringify(data);
      localStorage.setItem(this.storageKey, jsonString);
      return true;
    } catch (error) {
      console.error("StorageManager setData error:", error);

      // Handle quota exceeded
      if (error.name === "QuotaExceededError") {
        console.error("Storage quota exceeded. Consider clearing old data.");
      }

      return false;
    }
  }

  /**
   * Clear all application data
   * @returns {boolean} Success status
   */
  clearAllData() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error("StorageManager clearAllData error:", error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  isStorageAvailable() {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage usage in bytes
   * @returns {number} Bytes used
   */
  getStorageUsage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return 0;

      // Approximate size in bytes (UTF-16 encoding)
      return new Blob([data]).size;
    } catch (error) {
      console.error("StorageManager getStorageUsage error:", error);
      return 0;
    }
  }

  /**
   * Export data as JSON string
   * @returns {string} JSON string
   */
  exportToJSON() {
    try {
      const data = this.getData();
      if (!data) return null;

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error("StorageManager exportToJSON error:", error);
      return null;
    }
  }

  /**
   * Import data from JSON string with validation
   * @param {string} jsonString
   * @returns {boolean} Success status
   */
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      // Validate structure
      if (!data.vehicles || !data.fuelLogs) {
        throw new Error("Invalid import data structure");
      }

      return this.setData(data);
    } catch (error) {
      console.error("StorageManager importFromJSON error:", error);
      return false;
    }
  }
}
