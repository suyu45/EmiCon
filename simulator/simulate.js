const fs = require("fs");
const path = require("path");

// ========================================
// AirSense360 - Production Data Simulator
// ========================================

// Configuration for all six production lines.
// Values are illustrative simulation assumptions.

const productionLines = [
  {
    line_id: "L1",
    product_name: "Electric Drill",
    production_rate: 20,
    base_power_kw: 4.0,
  },
  {
    line_id: "L2",
    product_name: "Electric Drill",
    production_rate: 30,
    base_power_kw: 5.5,
  },
  {
    line_id: "L3",
    product_name: "Electric Drill",
    production_rate: 25,
    base_power_kw: 3.5,
  },
  {
    line_id: "L4",
    product_name: "Angle Grinder",
    production_rate: 18,
    base_power_kw: 4.5,
  },
  {
    line_id: "L5",
    product_name: "Angle Grinder",
    production_rate: 28,
    base_power_kw: 6.0,
  },
  {
    line_id: "L6",
    product_name: "Angle Grinder",
    production_rate: 22,
    base_power_kw: 3.8,
  },
];

// Store cumulative production quantities for each line.
const lineCounters = {};

productionLines.forEach((line) => {
  lineCounters[line.line_id] = {
    total: 0,
    good: 0,
    scrap: 0,
    cumulativeEnergyKwh: 0,
  };
});

// Output CSV file.
const outputDirectory = path.join(__dirname, "data");

const outputFile = path.join(
  outputDirectory,
  "production_readings.csv"
);

fs.mkdirSync(outputDirectory, { recursive: true });

// Create the CSV header.
const csvHeader = [
  "timestamp",
  "batch_number",
  "line_order",
  "line_id",
  "line_status",
  "availability",
  "product_name",
  "total_produced_qty",
  "good_produced_qty",
  "scrap_produced_qty",
  "production_rate",
  "power_kw",
  "energy_kwh",
].join(",");

fs.writeFileSync(outputFile, csvHeader + "\n");

// Simulation configuration.
const INTERVAL_MS = 5000;

// Five seconds expressed in hours.
const INTERVAL_HOURS = INTERVAL_MS / 3600000;

// Occasionally simulate unusual energy consumption.
const ANOMALY_PROBABILITY = 0.05;

// Convert a value to a CSV-safe string.
function csvValue(value) {
  const text = String(value);

  if (text.includes(",") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

// Generate one reading for a production line.
function generateReading(line, timestamp, batchNumber) {
  const counters = lineCounters[line.line_id];

  // Simulate whether the line is available.
  // Most of the time, the line is available.
  const availability = Math.random() > 0.05;

  let lineStatus;
  let currentProductionRate;
  let powerKw;

  if (!availability) {
    lineStatus = "STOPPED";
    currentProductionRate = 0;

    // A stopped line can still consume some standby power.
    powerKw = line.base_power_kw * 0.05;
  } else {
    // Simulate an occasional idle period.
    const isIdle = Math.random() < 0.10;

    if (isIdle) {
      lineStatus = "IDLE";
      currentProductionRate = 0;
      powerKw = line.base_power_kw * 0.20;
    } else {
      lineStatus = "RUNNING";

      // Vary production around the line's nominal rate.
      currentProductionRate =
        line.production_rate * (0.85 + Math.random() * 0.30);

      // Vary normal power consumption.
      powerKw =
        line.base_power_kw * (0.90 + Math.random() * 0.20);

      // Occasionally simulate unexpectedly high power.
      if (Math.random() < ANOMALY_PROBABILITY) {
        powerKw *= 1.5;
      }
    }
  }

  // Estimate units produced during the five-second interval.
  const producedDuringInterval =
    currentProductionRate * INTERVAL_HOURS;

  // Convert the interval output to whole units.
  // A fractional remainder is carried forward.
  const exactProduction =
    producedDuringInterval + (counters.productionRemainder || 0);

  const intervalTotal = Math.floor(exactProduction);

  counters.productionRemainder =
    exactProduction - intervalTotal;

  // Simulate a small scrap percentage.
  let intervalScrap = 0;

  if (intervalTotal > 0) {
    intervalScrap = Math.random() < 0.03 ? 1 : 0;
  }

  const intervalGood = intervalTotal - intervalScrap;

  counters.total += intervalTotal;
  counters.good += intervalGood;
  counters.scrap += intervalScrap;

  // Energy consumed during this five-second interval.
  const intervalEnergyKwh = powerKw * INTERVAL_HOURS;

  // Accumulate energy across the simulation.
  counters.cumulativeEnergyKwh += intervalEnergyKwh;

  // Use UTC timestamps.
  // const timestamp = new Date().toISOString();

  return {
    timestamp,
    batch_number: batchNumber,
    line_order: Number(line.line_id.substring(1)),
    line_id: line.line_id,
    line_status: lineStatus,
    availability,
    product_name: line.product_name,
    total_produced_qty: counters.total,
    good_produced_qty: counters.good,
    scrap_produced_qty: counters.scrap,
    production_rate: Number(currentProductionRate.toFixed(2)),
    power_kw: Number(powerKw.toFixed(3)),
    energy_kwh: Number(counters.cumulativeEnergyKwh.toFixed(6)),
  };
}

// Generate and save readings for all six lines.
let batchNumber = 0;

function generateBatch() {
  batchNumber++;

  // All six lines share the same batch timestamp.
  const timestamp = new Date().toISOString();

  const readings = productionLines.map((line) =>
    generateReading(line, timestamp, batchNumber)
  );

  const csvRows = readings.map((reading) =>
    Object.values(reading).map(csvValue).join(",")
  );

  fs.appendFileSync(
    outputFile,
    csvRows.join("\n") + "\n"
  );

  console.log(`\nBatch ${batchNumber} generated:`);

  readings.forEach((reading) => {
    console.log(
      `${reading.line_id} | ` +
      `${reading.product_name} | ` +
      `${reading.line_status} | ` +
      `Power: ${reading.power_kw} kW | ` +
      `Energy: ${reading.energy_kwh} kWh`
    );
  });

  console.log(`Saved readings to: ${outputFile}`);
}

// Generate the first batch immediately.
console.log("Starting AirSense360 simulator...");
console.log("Six production lines configured.");
console.log("Generating one batch every five seconds.");
console.log("Press Ctrl+C to stop.\n");

generateBatch();

// Continue generating data every five seconds.
setInterval(generateBatch, INTERVAL_MS);
