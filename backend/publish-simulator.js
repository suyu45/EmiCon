const mqtt = require("mqtt");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ========================================
// AirSense360 - Continuous AWS Publisher
// ========================================

const AWS_IOT_ENDPOINT =
  "a2jq7izfn1s8g8-ats.iot.ap-south-1.amazonaws.com";

const TOPIC = "emicon/production/readings";

const CSV_FILE = path.join(
  __dirname,
  "..",
  "simulator",
  "data",
  "production_readings.csv"
);

const CERT_DIR = path.join(__dirname, "..", "certs");

const certificatePath = path.join(
  CERT_DIR,
  "device.pem.crt"
);

const privateKeyPath = path.join(
  CERT_DIR,
  "private.pem.key"
);

const rootCAPath = path.join(
  CERT_DIR,
  "AmazonRootCA1.pem"
);

const INTERVAL_MS = 5000;

// Check that required files exist.
for (const file of [
  CSV_FILE,
  certificatePath,
  privateKeyPath,
  rootCAPath,
]) {
  if (!fs.existsSync(file)) {
    console.error(`Required file not found: ${file}`);
    process.exit(1);
  }
}

// Read the latest six-line batch from the CSV.
function readLatestBatch() {
  const content = fs.readFileSync(CSV_FILE, "utf8").trim();

  const lines = content.split(/\r?\n/);

  if (lines.length < 2) {
    throw new Error("Production CSV contains no readings.");
  }

  const headers = lines[0].split(",");

  // The simulator writes six rows per batch.
  const latestRows = lines.slice(-6);


  if (latestRows.length !== 6) {
    throw new Error(
      "Expected six production-line readings in the CSV."
    );
  }

  return latestRows.map((row) => {
    const values = row.split(",");

    const reading = {};

    headers.forEach((header, index) => {
      reading[header] = values[index];
    });

    // Convert numeric and Boolean fields to their correct types.
    reading.availability =
      reading.availability === "true";

    for (const field of [
      "batch_number",
      "line_order",
      "total_produced_qty",
      "good_produced_qty",
      "scrap_produced_qty",
      "production_rate",
      "power_kw",
      "energy_kwh",
    ]) {
      reading[field] = Number(reading[field]);
    }

    return reading;
  });

  readings.sort((a, b) => a.line_order - b.line_order);

  return readings;
}

// Connect securely to AWS IoT Core.
const client = mqtt.connect(
  `mqtts://${AWS_IOT_ENDPOINT}:8883`,
  {
    clientId: "EmiConSimulator",
    cert: fs.readFileSync(certificatePath),
    key: fs.readFileSync(privateKeyPath),
    ca: fs.readFileSync(rootCAPath),
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 5000,
  }
);

let interval;

client.on("connect", () => {
  console.log("Connected to AWS IoT Core.");
  console.log("Publishing six production-line readings.");
  console.log("Interval: 5 seconds.");
  console.log("Press Ctrl+C to stop.\n");

  // Avoid starting multiple timers after reconnection.
  if (interval) {
    return;
  }

  async function publishBatch() {
    try {
      const readings = readLatestBatch();

      for (const reading of readings) {
        await new Promise((resolve, reject) => {
          client.publish(
            TOPIC,
            JSON.stringify(reading),
            { qos: 1 },
            (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });

        console.log(
          `${reading.line_id} | ` +
          `${reading.product_name} | ` +
          `${reading.line_status} | ` +
          `Power: ${reading.power_kw} kW`
        );
      }

      console.log("Six readings published.\n");
    } catch (error) {
      console.error(
        "Could not publish the batch:",
        error.message
      );
    }
  }

  // Publish one batch immediately.
  publishBatch();

  // Publish the next batch every five seconds.
  interval = setInterval(
    publishBatch,
    INTERVAL_MS
  );
});

client.on("error", (error) => {
  console.error("MQTT error:", error.message);
});

client.on("close", () => {
  console.log("MQTT connection closed.");
});

function shutdown() {
  console.log("\nStopping publisher...");

  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }

  client.end(false, {}, () => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);