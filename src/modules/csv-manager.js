/**
 * CSV Manager Module
 *
 * Handles CSV export and import for data backup/restore
 */

export class CSVManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
  }

  /**
   * Export all data to CSV format
   * @returns {Object} { vehiclesCSV, fuelLogsCSV }
   */
  exportToCSV() {
    const data = this.storageManager.getData();
    if (!data) {
      return { vehiclesCSV: null, fuelLogsCSV: null };
    }

    // Export vehicles
    const vehiclesCSV = this.arrayToCSV(data.vehicles, [
      "id",
      "name",
      "type",
      "year",
      "plateNumber",
      "color",
      "createdAt",
    ]);

    // Export fuel logs
    const fuelLogsCSV = this.arrayToCSV(data.fuelLogs, [
      "id",
      "vehicleId",
      "date",
      "liter",
      "pricePerLiter",
      "totalPrice",
      "odometer",
      "previousOdometer",
      "kmPerLiter",
      "notes",
      "createdAt",
    ]);

    return { vehiclesCSV, fuelLogsCSV };
  }

  /**
   * Convert array of objects to CSV string
   */
  arrayToCSV(data, columns) {
    if (!data || data.length === 0) {
      return columns.join(",") + "\n";
    }

    const header = columns.join(",");
    const rows = data.map((item) => {
      return columns
        .map((col) => {
          const value = item[col];
          if (value === null || value === undefined) {
            return "";
          }
          // Escape quotes and wrap in quotes if contains comma
          const stringValue = String(value);
          if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",");
    });

    return header + "\n" + rows.join("\n");
  }

  /**
   * Download combined CSV file
   */
  downloadCSV() {
    const { vehiclesCSV, fuelLogsCSV } = this.exportToCSV();

    // Combine into single file with sections
    const combinedCSV = [
      "# VEHICLES",
      vehiclesCSV,
      "",
      "# FUEL_LOGS",
      fuelLogsCSV,
    ].join("\n");

    // Create blob and download
    const blob = new Blob([combinedCSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `konsumsi-bbm-backup-${timestamp}.csv`;
    link.click();

    URL.revokeObjectURL(url);

    return link.download;
  }

  /**
   * Parse CSV file content
   * @param {string} content - CSV file content
   * @returns {Object} { vehicles, fuelLogs }
   */
  parseCSV(content) {
    const lines = content.split("\n");
    let currentSection = null;
    const vehicles = [];
    const fuelLogs = [];
    let currentHeaders = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) continue;

      // Check for section markers
      if (trimmedLine === "# VEHICLES") {
        currentSection = "vehicles";
        currentHeaders = [];
        continue;
      }
      if (trimmedLine === "# FUEL_LOGS") {
        currentSection = "fuelLogs";
        currentHeaders = [];
        continue;
      }

      // Skip comment lines
      if (trimmedLine.startsWith("#")) continue;

      // Parse header or data row
      const values = this.parseCSVLine(trimmedLine);

      if (currentHeaders.length === 0) {
        // This is the header row
        currentHeaders = values;
        continue;
      }

      // Create object from values
      const obj = {};
      currentHeaders.forEach((header, index) => {
        let value = values[index] || "";

        // Type conversion
        if (
          header === "year" ||
          header === "odometer" ||
          header === "previousOdometer"
        ) {
          value = value ? parseInt(value, 10) : null;
        } else if (
          header === "liter" ||
          header === "pricePerLiter" ||
          header === "totalPrice" ||
          header === "kmPerLiter"
        ) {
          value = value ? parseFloat(value) : null;
        }

        obj[header] = value;
      });

      // Add to appropriate array
      if (currentSection === "vehicles" && obj.id) {
        vehicles.push(obj);
      } else if (currentSection === "fuelLogs" && obj.id) {
        fuelLogs.push(obj);
      }
    }

    return { vehicles, fuelLogs };
  }

  /**
   * Parse a single CSV line (handles quoted values)
   */
  parseCSVLine(line) {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    values.push(current);
    return values;
  }

  /**
   * Import data from parsed CSV
   * @param {Object} parsedData - { vehicles, fuelLogs }
   * @returns {Object} { vehiclesAdded, logsAdded, duplicatesSkipped }
   */
  importData(parsedData) {
    const currentData = this.storageManager.getData() || {
      version: "1.0.0",
      vehicles: [],
      fuelLogs: [],
      settings: {},
    };

    let vehiclesAdded = 0;
    let logsAdded = 0;
    let duplicatesSkipped = 0;

    // Import vehicles (skip duplicates by ID)
    const existingVehicleIds = new Set(currentData.vehicles.map((v) => v.id));
    for (const vehicle of parsedData.vehicles) {
      if (!existingVehicleIds.has(vehicle.id)) {
        currentData.vehicles.push(vehicle);
        vehiclesAdded++;
      } else {
        duplicatesSkipped++;
      }
    }

    // Import fuel logs (skip duplicates by ID)
    const existingLogIds = new Set(currentData.fuelLogs.map((l) => l.id));
    for (const log of parsedData.fuelLogs) {
      if (!existingLogIds.has(log.id)) {
        currentData.fuelLogs.push(log);
        logsAdded++;
      } else {
        duplicatesSkipped++;
      }
    }

    // Save merged data
    this.storageManager.setData(currentData);

    return { vehiclesAdded, logsAdded, duplicatesSkipped };
  }
}
