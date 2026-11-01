const express = require("express");
const cors = require("cors");

const {
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const app = express();

app.use(cors());
app.use(express.json());

// AWS DynamoDB configuration
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "EmiConProductionReadingsV2";

// API: Get latest production readings
app.get("/api/readings", async (req, res) => {
  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,

      KeyConditionExpression: "feed_id = :feed",

      ExpressionAttributeValues: {
        ":feed": "ALL_READINGS",
      },

      // Ascending order gives newest batch first
      // because we created a reverse timestamp sort key.
      ScanIndexForward: true,

      Limit: 36,
    });

    const result = await dynamodb.send(command);

    res.status(200).json({
      success: true,
      count: result.Items.length,
      readings: result.Items,
    });

  } catch (error) {
    console.error("DynamoDB error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch production readings.",
    });
  }
});

// Health-check API
app.get("/", (req, res) => {
  res.send("EmiCon Backend API is running!");
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`EmiCon API running at http://localhost:${PORT}`);
});