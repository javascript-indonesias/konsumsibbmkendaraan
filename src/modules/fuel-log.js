/**
 * Fuel Log Manager
 *
 * Clean Architecture: Business Logic Layer
 * - Manages CRUD operations for fuel logs
 * - Handles validation rules (VAL-001 to VAL-005)
 * - Calculates consumption (km/liter)
 * - Manages relationships with vehicles
 */

import { generateUUID, formatDate } from "./utils.js";

export class FuelLogManager {
  /**
   * @param {StorageManager} storageManager
   */
  constructor(storageManager) {
    this.storage = storageManager;
  }

  /**
   * Create new fuel log
   * @param {Object} data
   * @returns {Object} Created fuel log
   */
  createFuelLog(data) {
    const validationResult = this.validateFuelLogData(data);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join(", "));
    }

    const fuelLog = {
      id: generateUUID(),
      vehicleId: data.vehicleId,
      date: data.date,
      odometer: data.odometer,
      liter: data.liter,
      totalPrice: data.totalPrice,
      pricePerLiter: data.totalPrice / data.liter,
      fuelType: data.fuelType || null,
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate consumption if previous log exists
    const previousLog = this.getLastLogByVehicle(data.vehicleId);
    if (previousLog) {
      const distance = data.odometer - previousLog.odometer;
      fuelLog.consumption = distance > 0 ? distance / data.liter : null;
    } else {
      fuelLog.consumption = null;
    }

    const logs = this.getAll();
    logs.push(fuelLog);
    this.storage.setItem("fuelLogs", logs);

    return fuelLog;
  }

  /**
   * Update existing fuel log
   * @param {string} id
   * @param {Object} data
   * @returns {Object} Updated fuel log
   */
  updateFuelLog(id, data) {
    const validationResult = this.validateFuelLogData(data);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join(", "));
    }

    const logs = this.getAll();
    const index = logs.findIndex((log) => log.id === id);

    if (index === -1) {
      throw new Error("Fuel log not found");
    }

    const existingLog = logs[index];
    const updatedLog = {
      ...existingLog,
      date: data.date,
      odometer: data.odometer,
      liter: data.liter,
      totalPrice: data.totalPrice,
      pricePerLiter: data.totalPrice / data.liter,
      fuelType: data.fuelType || null,
      notes: data.notes || null,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate consumption
    const previousLog = this.getPreviousLog(id, existingLog.vehicleId);
    if (previousLog) {
      const distance = data.odometer - previousLog.odometer;
      updatedLog.consumption = distance > 0 ? distance / data.liter : null;
    } else {
      updatedLog.consumption = null;
    }

    logs[index] = updatedLog;
    this.storage.setItem("fuelLogs", logs);

    // Recalculate next log's consumption if exists
    this.recalculateNextLogConsumption(id, existingLog.vehicleId);

    return updatedLog;
  }

  /**
   * Delete fuel log
   * @param {string} id
   */
  deleteFuelLog(id) {
    const logs = this.getAll();
    const log = logs.find((l) => l.id === id);

    if (!log) {
      throw new Error("Fuel log not found");
    }

    const filteredLogs = logs.filter((l) => l.id !== id);
    this.storage.setItem("fuelLogs", filteredLogs);

    // Recalculate next log's consumption if exists
    this.recalculateNextLogConsumption(id, log.vehicleId);
  }

  /**
   * Get fuel log by ID
   * @param {string} id
   * @returns {Object|null}
   */
  getFuelLogById(id) {
    const logs = this.getAll();
    return logs.find((log) => log.id === id) || null;
  }

  /**
   * Get all fuel logs
   * @param {Object} options - Filter and sort options
   * @returns {Array}
   */
  getAll(options = {}) {
    let logs = this.storage.getItem("fuelLogs") || [];

    // Filter by vehicle
    if (options.vehicleId) {
      logs = logs.filter((log) => log.vehicleId === options.vehicleId);
    }

    // Filter by date range
    if (options.startDate) {
      logs = logs.filter((log) => log.date >= options.startDate);
    }
    if (options.endDate) {
      logs = logs.filter((log) => log.date <= options.endDate);
    }

    // Sort (default: by date desc, then odometer desc)
    logs.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.odometer - a.odometer;
    });

    return logs;
  }

  /**
   * Get last fuel log for a vehicle
   * @param {string} vehicleId
   * @returns {Object|null}
   */
  getLastLogByVehicle(vehicleId) {
    const logs = this.getAll({ vehicleId });
    return logs.length > 0 ? logs[0] : null;
  }

  /**
   * Get previous log before a specific log
   * @param {string} logId
   * @param {string} vehicleId
   * @returns {Object|null}
   */
  getPreviousLog(logId, vehicleId) {
    const logs = this.getAll({ vehicleId });
    const currentIndex = logs.findIndex((log) => log.id === logId);

    if (currentIndex === -1 || currentIndex === logs.length - 1) {
      return null;
    }

    return logs[currentIndex + 1];
  }

  /**
   * Recalculate consumption for the next log after an update/delete
   * @param {string} logId
   * @param {string} vehicleId
   */
  recalculateNextLogConsumption(logId, vehicleId) {
    const logs = this.getAll({ vehicleId });
    const currentIndex = logs.findIndex((log) => log.id === logId);

    if (currentIndex === -1 || currentIndex === 0) return;

    const nextLog = logs[currentIndex - 1];
    const previousLog =
      currentIndex + 1 < logs.length ? logs[currentIndex + 1] : null;

    if (previousLog) {
      const distance = nextLog.odometer - previousLog.odometer;
      nextLog.consumption = distance > 0 ? distance / nextLog.liter : null;
    } else {
      nextLog.consumption = null;
    }

    const allLogs = this.storage.getItem("fuelLogs") || [];
    const index = allLogs.findIndex((l) => l.id === nextLog.id);
    if (index !== -1) {
      allLogs[index] = nextLog;
      this.storage.setItem("fuelLogs", allLogs);
    }
  }

  /**
   * Validate fuel log data
   * @param {Object} data
   * @returns {Object} {isValid: boolean, errors: string[]}
   */
  validateFuelLogData(data) {
    const errors = [];

    // Vehicle ID required
    if (!data.vehicleId) {
      errors.push("Kendaraan harus dipilih");
    }

    // Date required and not in future (VAL-004)
    if (!data.date) {
      errors.push("Tanggal harus diisi");
    } else {
      const selectedDate = new Date(data.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        errors.push("Tanggal tidak boleh di masa depan");
      }
    }

    // Liter validation (VAL-001)
    if (
      typeof data.liter !== "number" ||
      data.liter < 0.01 ||
      data.liter > 999.99
    ) {
      errors.push("Liter harus antara 0.01 - 999.99");
    }

    // Total price validation (VAL-002)
    if (
      typeof data.totalPrice !== "number" ||
      data.totalPrice < 1 ||
      data.totalPrice > 99999999
    ) {
      errors.push("Total harga harus antara 1 - 99.999.999");
    }

    // Odometer validation (VAL-003)
    if (
      typeof data.odometer !== "number" ||
      data.odometer < 0 ||
      data.odometer > 9999999
    ) {
      errors.push("Odometer harus antara 0 - 9.999.999");
    }

    // Notes validation (VAL-005)
    if (data.notes && data.notes.length > 200) {
      errors.push("Catatan maksimal 200 karakter");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics for a vehicle
   * @param {string} vehicleId
   * @returns {Object}
   */
  getVehicleStats(vehicleId) {
    const logs = this.getAll({ vehicleId });

    if (logs.length === 0) {
      return {
        totalLogs: 0,
        totalLiter: 0,
        totalCost: 0,
        averageConsumption: 0,
        averagePricePerLiter: 0,
      };
    }

    const totalLiter = logs.reduce((sum, log) => sum + log.liter, 0);
    const totalCost = logs.reduce((sum, log) => sum + log.totalPrice, 0);
    const logsWithConsumption = logs.filter((log) => log.consumption !== null);
    const averageConsumption =
      logsWithConsumption.length > 0
        ? logsWithConsumption.reduce((sum, log) => sum + log.consumption, 0) /
          logsWithConsumption.length
        : 0;
    const averagePricePerLiter = totalCost / totalLiter;

    return {
      totalLogs: logs.length,
      totalLiter,
      totalCost,
      averageConsumption,
      averagePricePerLiter,
    };
  }
}
