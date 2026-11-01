const mqtt = require("mqtt");
const fs = require("fs");
const path = require("path");

// ========================================
// AirSense360 - AWS IoT Core Connection Test
// ========================================

// Replace this with your actual AWS IoT endpoint.
const AWS_IOT_ENDPOINT =
  "a2jq7izfn1s8g8-ats.iot.ap-south-1.amazonaws.com";

// MQTT topic configured in our AWS IoT policy.
const TOPIC = "emicon/production/readings";

// Certificate file paths.
const certificatePath = path.join(
  __dirname,
  "..",
  "certs",
  "device.pem.crt"
);

const privateKeyPath = path.join(
  __dirname,
  "..",
  "certs",
  "private.pem.key"
);

const rootCAPath = path.join(
  __dirname,
  "..",
  "certs",
  "AmazonRootCA1.pem"
);

// Check that all certificate files exist.
for (const file of [
  certificatePath,
  privateKeyPath,
  rootCAPath,
]) {
  if (!fs.existsSync(file)) {
    console.error(`Certificate file not found: ${file}`);
    process.exit(1);
  }
}

// Read the certificates.
const certificate = fs.readFileSync(certificatePath);
const privateKey = fs.readFileSync(privateKeyPath);
const rootCA = fs.readFileSync(rootCAPath);

// Create a sample production reading.
const productionReading = {
  timestamp: new Date().toISOString(),
  line_id: "L1",
  line_status: "RUNNING",
  availability: true,
  product_name: "Electric Drill",
  total_produced_qty: 100,
  good_produced_qty: 97,
  scrap_produced_qty: 3,
  production_rate: 20,
  power_kw: 4.2,
  energy_kwh: 12.5,
};

const client = mqtt.connect(
  `mqtts://${AWS_IOT_ENDPOINT}:8883`,
  {
    clientId: "EmiConSimulator",
    cert: certificate,
    key: privateKey,
    ca: rootCA,
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 0,
  }
);

client.on("connect", () => {
  console.log("Connected to AWS IoT Core!");

  const message = JSON.stringify(productionReading);

  client.publish(
    TOPIC,
    message,
    { qos: 1 },
    (error) => {
      if (error) {
        console.error("Publishing failed:", error.message);
      } else {
        console.log("Production reading published successfully!");
        console.log("Topic:", TOPIC);
        console.log("Message:");
        console.log(JSON.stringify(productionReading, null, 2));
      }

      client.end();
    }
  );
});

client.on("error", (error) => {
  console.error("AWS IoT connection error:", error.message);
  client.end(true);
});