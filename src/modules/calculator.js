/**
 * Calculator Module
 *
 * Provides calculation logic for dashboard statistics and consumption trends
 */

export class Calculator {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.fuelLogs = [];
    this.vehicles = [];
  }

  /**
   * Load data from storage
   */
  loadData() {
    this.fuelLogs = this.storageManager.getItem("fuelLogs") || [];
    this.vehicles = this.storageManager.getItem("vehicles") || [];
  }

  /**
   * Get dashboard statistics
   * @returns {Object} Dashboard stats: totalExpense, avgConsumption, totalDistance, bestConsumption, bestVehicle
   */
  getDashboardStats() {
    this.loadData();

    if (this.fuelLogs.length === 0) {
      return {
        totalExpense: 0,
        avgConsumption: 0,
        totalDistance: 0,
        bestConsumption: 0,
        bestVehicle: null,
      };
    }

    // Total expense
    const totalExpense = this.fuelLogs.reduce(
      (sum, log) => sum + (log.totalPrice || 0),
      0
    );

    // Average consumption
    const logsWithConsumption = this.fuelLogs.filter(
      (log) => log.kmPerLiter && log.kmPerLiter > 0
    );
    const avgConsumption =
      logsWithConsumption.length > 0
        ? logsWithConsumption.reduce((sum, log) => sum + log.kmPerLiter, 0) /
          logsWithConsumption.length
        : 0;

    // Total distance
    const totalDistance = this.fuelLogs.reduce((sum, log) => {
      const distance = log.kmPerLiter ? log.kmPerLiter * log.liter : 0;
      return sum + distance;
    }, 0);

    // Best consumption
    let bestConsumption = 0;
    let bestVehicle = null;

    if (logsWithConsumption.length > 0) {
      const sortedByConsumption = [...logsWithConsumption].sort(
        (a, b) => b.kmPerLiter - a.kmPerLiter
      );
      bestConsumption = sortedByConsumption[0].kmPerLiter;

      const vehicle = this.vehicles.find(
        (v) => v.id === sortedByConsumption[0].vehicleId
      );
      bestVehicle = vehicle ? vehicle.name : null;
    }

    return {
      totalExpense,
      avgConsumption,
      totalDistance,
      bestConsumption,
      bestVehicle,
    };
  }

  /**
   * Get consumption trend data for chart
   * @param {string} filter - Time filter: '3m', '6m', '1y', 'all'
   * @returns {Object} Chart data: {labels[], values[]}
   */
  getConsumptionTrend(filter = "all") {
    this.loadData();

    if (this.fuelLogs.length === 0) {
      return { labels: [], values: [] };
    }

    // Filter logs by date
    const filteredLogs = this.filterLogsByDate(this.fuelLogs, filter);

    // Sort by date ascending
    const sortedLogs = filteredLogs
      .filter((log) => log.kmPerLiter && log.kmPerLiter > 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (sortedLogs.length === 0) {
      return { labels: [], values: [] };
    }

    // Group by month for better visualization
    const groupedByMonth = this.groupLogsByMonth(sortedLogs);

    return {
      labels: groupedByMonth.labels,
      values: groupedByMonth.values,
    };
  }

  /**
   * Filter logs by date range
   */
  filterLogsByDate(logs, filter) {
    if (filter === "all") return logs;

    const now = new Date();
    const filterDate = new Date();

    switch (filter) {
      case "3m":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return logs;
    }

    return logs.filter((log) => new Date(log.date) >= filterDate);
  }

  /**
   * Group logs by month and calculate average consumption
   */
  groupLogsByMonth(logs) {
    const monthGroups = {};

    logs.forEach((log) => {
      const date = new Date(log.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = {
          count: 0,
          totalConsumption: 0,
        };
      }

      monthGroups[monthKey].count++;
      monthGroups[monthKey].totalConsumption += log.kmPerLiter;
    });

    // Convert to arrays for chart
    const sortedMonths = Object.keys(monthGroups).sort();
    const labels = sortedMonths.map((key) => {
      const [year, month] = key.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });

    const values = sortedMonths.map((key) => {
      const group = monthGroups[key];
      return group.totalConsumption / group.count; // Average consumption for the month
    });

    return { labels, values };
  }
}
