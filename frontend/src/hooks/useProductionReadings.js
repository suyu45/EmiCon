import { useEffect, useState } from "react";

function useProductionReadings() {
  const [productionLines, setProductionLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/readings");

        if (!response.ok) {
          throw new Error("Failed to fetch production readings");
        }

        const data = await response.json();
        const latestReadings = new Map();

        // The API returns newest readings first, so keep the first reading per line.
        data.readings.forEach((reading) => {
          if (!latestReadings.has(reading.line_id)) {
            latestReadings.set(reading.line_id, reading);
          }
        });

        const lines = Array.from(latestReadings.values())
          .sort((a, b) => a.line_id.localeCompare(b.line_id))
          .map((reading) => {
            const total = Number(reading.total_produced_qty || 0);
            const good = Number(reading.good_produced_qty || 0);

            return {
              id: reading.line_id,
              product: reading.product_name,
              status:
                reading.line_status === "RUNNING"
                  ? "Running"
                  : reading.line_status === "WARNING"
                  ? "Warning"
                  : "Idle",
              production: good,
              power: Number(reading.power_kw || 0),
              energy: Number(reading.energy_kwh || 0),
              efficiency: total > 0 ? Math.round((good / total) * 100) : 0,
            };
          });

        setProductionLines(lines);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching readings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
    const intervalId = setInterval(fetchReadings, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return { productionLines, loading, lastUpdated };
}

export default useProductionReadings;
