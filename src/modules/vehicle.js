/**
 * VehicleManager - Business logic for vehicle CRUD operations
 *
 * Clean Architecture: Use Case Layer
 * - Depends on StorageManager (Data Access Layer)
 * - Contains business rules and validation
 * - Single Responsibility: Vehicle management only
 */

import { generateUUID } from "./utils.js";

/**
 * Vehicle color palette (from spec-design-visual-style.md)
 */
const VEHICLE_COLORS = [
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
];

export class VehicleManager {
  /**
   * @param {StorageManager} storageManager
   */
  constructor(storageManager) {
    if (!storageManager) {
      throw new Error("VehicleManager requires StorageManager instance");
    }
    this.storageManager = storageManager;
  }

  /**
   * Create a new vehicle
   * @param {Object} vehicleData
   * @param {string} vehicleData.name - Vehicle name (required)
   * @param {'motor'|'mobil'} vehicleData.type - Vehicle type (required)
   * @param {number} [vehicleData.year] - Manufacturing year (optional)
   * @param {string} [vehicleData.plateNumber] - Plate number (optional)
   * @param {string} [vehicleData.color] - Hex color (optional, auto-assigned if not provided)
   * @returns {Object|null} Created vehicle or null on error
   */
  createVehicle(vehicleData) {
    try {
      // Validate input
      const validation = this.validateVehicleData(vehicleData);
      if (!validation.isValid) {
        console.error("Vehicle validation failed:", validation.errors);
        return null;
      }

      const data = this.storageManager.getData();
      if (!data) {
        console.error("Failed to get data from storage");
        return null;
      }

      // Create vehicle object
      const vehicle = {
        id: generateUUID(),
        name: vehicleData.name.trim(),
        type: vehicleData.type,
        year: vehicleData.year || null,
        plateNumber: vehicleData.plateNumber
          ? vehicleData.plateNumber.trim()
          : "",
        color: vehicleData.color || this._getNextAvailableColor(data.vehicles),
        createdAt: new Date().toISOString(),
      };

      // Add to vehicles array
      data.vehicles.push(vehicle);

      // Save to storage
      const saved = this.storageManager.setData(data);
      if (!saved) {
        console.error("Failed to save vehicle to storage");
        return null;
      }

      return vehicle;
    } catch (error) {
      console.error("VehicleManager createVehicle error:", error);
      return null;
    }
  }

  /**
   * Get vehicle by ID
   * @param {string} id
   * @returns {Object|null}
   */
  getVehicleById(id) {
    try {
      const data = this.storageManager.getData();
      if (!data) return null;

      return data.vehicles.find((v) => v.id === id) || null;
    } catch (error) {
      console.error("VehicleManager getVehicleById error:", error);
      return null;
    }
  }

  /**
   * Get all vehicles
   * @returns {Array} Array of vehicles (empty array on error)
   */
  getAllVehicles() {
    try {
      const data = this.storageManager.getData();
      if (!data) return [];

      // Return copy to prevent external mutation
      return [...data.vehicles];
    } catch (error) {
      console.error("VehicleManager getAllVehicles error:", error);
      return [];
    }
  }

  /**
   * Update vehicle
   * @param {string} id
   * @param {Object} updates - Partial vehicle data to update
   * @returns {boolean} Success status
   */
  updateVehicle(id, updates) {
    try {
      // Validate updates
      const validation = this.validateVehicleData(updates, false);
      if (!validation.isValid) {
        console.error("Vehicle update validation failed:", validation.errors);
        return false;
      }

      const data = this.storageManager.getData();
      if (!data) return false;

      const vehicleIndex = data.vehicles.findIndex((v) => v.id === id);
      if (vehicleIndex === -1) {
        console.error("Vehicle not found:", id);
        return false;
      }

      // Apply updates (only allowed fields)
      const allowedFields = ["name", "type", "year", "plateNumber", "color"];
      const vehicle = data.vehicles[vehicleIndex];

      allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
          vehicle[field] = updates[field];
        }
      });

      vehicle.updatedAt = new Date().toISOString();

      // Save to storage
      return this.storageManager.setData(data);
    } catch (error) {
      console.error("VehicleManager updateVehicle error:", error);
      return false;
    }
  }

  /**
   * Delete vehicle (cascade delete fuel logs)
   * @param {string} id
   * @returns {boolean} Success status
   */
  deleteVehicle(id) {
    try {
      const data = this.storageManager.getData();
      if (!data) return false;

      const vehicleIndex = data.vehicles.findIndex((v) => v.id === id);
      if (vehicleIndex === -1) {
        console.error("Vehicle not found:", id);
        return false;
      }

      // Remove vehicle
      data.vehicles.splice(vehicleIndex, 1);

      // Cascade delete fuel logs
      data.fuelLogs = data.fuelLogs.filter((log) => log.vehicleId !== id);

      // Save to storage
      return this.storageManager.setData(data);
    } catch (error) {
      console.error("VehicleManager deleteVehicle error:", error);
      return false;
    }
  }

  /**
   * Get fuel log count for a vehicle
   * @param {string} vehicleId
   * @returns {number}
   */
  getFuelLogCount(vehicleId) {
    try {
      const data = this.storageManager.getData();
      if (!data) return 0;

      return data.fuelLogs.filter((log) => log.vehicleId === vehicleId).length;
    } catch (error) {
      console.error("VehicleManager getFuelLogCount error:", error);
      return 0;
    }
  }

  /**
   * Validate vehicle data
   * @param {Object} vehicleData
   * @param {boolean} requireAll - Whether all required fields must be present
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validateVehicleData(vehicleData, requireAll = true) {
    const errors = [];

    if (!vehicleData || typeof vehicleData !== "object") {
      return { isValid: false, errors: ["Vehicle data must be an object"] };
    }

    // VAL-001: Nama kendaraan: 1-50 karakter (required)
    if (requireAll || vehicleData.name !== undefined) {
      if (!vehicleData.name || typeof vehicleData.name !== "string") {
        errors.push("Nama kendaraan harus diisi");
      } else if (vehicleData.name.trim().length === 0) {
        errors.push("Nama kendaraan tidak boleh kosong");
      } else if (vehicleData.name.length > 50) {
        errors.push("Nama kendaraan maksimal 50 karakter");
      }
    }

    // VAL-002: Jenis: "motor" atau "mobil" (required)
    if (requireAll || vehicleData.type !== undefined) {
      if (!vehicleData.type) {
        errors.push("Jenis kendaraan harus dipilih");
      } else if (!["motor", "mobil"].includes(vehicleData.type)) {
        errors.push('Jenis kendaraan harus "motor" atau "mobil"');
      }
    }

    // VAL-003: Tahun: 1900-current year+1 (opsional)
    if (vehicleData.year !== undefined && vehicleData.year !== null) {
      const year = parseInt(vehicleData.year);
      const currentYear = new Date().getFullYear();

      if (isNaN(year)) {
        errors.push("Tahun harus berupa angka");
      } else if (year < 1900 || year > currentYear + 1) {
        errors.push(`Tahun harus antara 1900 dan ${currentYear + 1}`);
      }
    }

    // VAL-004: Plat nomor: max 15 karakter (opsional)
    if (
      vehicleData.plateNumber !== undefined &&
      vehicleData.plateNumber !== null
    ) {
      if (typeof vehicleData.plateNumber !== "string") {
        errors.push("Plat nomor harus berupa teks");
      } else if (vehicleData.plateNumber.length > 15) {
        errors.push("Plat nomor maksimal 15 karakter");
      }
    }

    // Color validation (opsional)
    if (vehicleData.color !== undefined && vehicleData.color !== null) {
      const hexPattern = /^#[0-9A-Fa-f]{6}$/;
      if (!hexPattern.test(vehicleData.color)) {
        errors.push("Warna harus dalam format hex (#RRGGBB)");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get next available color from palette
   * @private
   * @param {Array} existingVehicles
   * @returns {string} Hex color
   */
  _getNextAvailableColor(existingVehicles) {
    const usedColors = new Set(existingVehicles.map((v) => v.color));

    // Find first unused color
    const availableColor = VEHICLE_COLORS.find(
      (color) => !usedColors.has(color)
    );

    // If all colors used, cycle back to first color
    return (
      availableColor ||
      VEHICLE_COLORS[existingVehicles.length % VEHICLE_COLORS.length]
    );
  }
}
