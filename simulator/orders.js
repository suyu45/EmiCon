const fs = require("fs");
const path = require("path");

// AirSense360 - Customer Orders Simulator

// Generate dummy customer orders.
const orders = [
  {
    timestamp: new Date().toISOString(),
    order_id: "ORD001",
    product_name: "Electric Drill",
    quantity: 500,
    deadline: "2026-11-02",
    priority: "HIGH",
  },
  {
    timestamp: new Date().toISOString(),
    order_id: "ORD002",
    product_name: "Angle Grinder",
    quantity: 300,
    deadline: "2026-11-03",
    priority: "MEDIUM",
  },
  {
    timestamp: new Date().toISOString(),
    order_id: "ORD003",
    product_name: "Electric Drill",
    quantity: 200,
    deadline: "2026-11-01",
    priority: "HIGH",
  },
  {
    timestamp: new Date().toISOString(),
    order_id: "ORD004",
    product_name: "Angle Grinder",
    quantity: 600,
    deadline: "2026-11-05",
    priority: "LOW",
  },
  {
    timestamp: new Date().toISOString(),
    order_id: "ORD005",
    product_name: "Electric Drill",
    quantity: 400,
    deadline: "2026-11-04",
    priority: "MEDIUM",
  },
  {
    timestamp: new Date().toISOString(),
    order_id: "ORD006",
    product_name: "Angle Grinder",
    quantity: 450,
    deadline: "2026-11-02",
    priority: "HIGH",
  },
  {
    timestamp: new Date().toISOString(),
    order_id: "ORD007",
    product_name: "Electric Drill",
    quantity: 350,
    deadline: "2026-11-06",
    priority: "LOW",
  },
  {
    timestamp: new Date().toISOString(),
    order_id: "ORD008",
    product_name: "Angle Grinder",
    quantity: 250,
    deadline: "2026-11-04",
    priority: "MEDIUM",
  },
];

// CSV file location.
const outputFile = path.join(
  __dirname,
  "data",
  "customer_orders.csv"
);

// Create the data folder if it doesn't exist.
fs.mkdirSync(path.dirname(outputFile), {
  recursive: true,
});

// CSV columns.
const headers = [
  "timestamp",
  "order_id",
  "product_name",
  "quantity",
  "deadline",
  "priority",
];

// Convert a value to a CSV-safe string.
function csvValue(value) {
  const text = String(value);

  if (text.includes(",") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

// Convert orders into CSV rows.
const csvRows = orders.map((order) =>
  headers.map((header) => csvValue(order[header])).join(",")
);

// Save the orders to a CSV file.
const csvContent = [
  headers.join(","),
  ...csvRows,
].join("\n");

fs.writeFileSync(outputFile, csvContent + "\n");

// Display the generated orders.
console.log("AirSense360 Customer Orders Simulator");
console.log("-------------------------------------");

orders.forEach((order) => {
  console.log(
    `${order.order_id} | ` +
    `${order.product_name} | ` +
    `Quantity: ${order.quantity} | ` +
    `Deadline: ${order.deadline} | ` +
    `Priority: ${order.priority}`
  );
});

console.log(`\nTotal orders generated: ${orders.length}`);
console.log(`Saved to: ${outputFile}`);