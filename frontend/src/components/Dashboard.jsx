import { Clock, Factory, Zap, Leaf, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import SummaryCard from "./SummaryCard";
import ProductionCard from "./ProductionCard";

function Dashboard({ productionLines, loading, lastUpdated }) {

  const totalEnergy = productionLines.reduce(
    (total, line) => total + line.energy,
    0
  );

  const GRID_EMISSION_FACTOR = 0.716;

  const totalCarbonEmissions = (
    totalEnergy * GRID_EMISSION_FACTOR
  ).toFixed(2);

  const activeLines = productionLines.filter(line => line.status === "Running").length;

  return (
    <div className="space-y-8 p-5 md:p-8">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Factory Performance</h3>
          <p className="mt-1 text-sm text-slate-500">
            Real-time industrial monitoring overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock size={16} />
          Last updated: {lastUpdated || "waiting for data"}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Production"
          value={productionLines.reduce(
            (total, line) => total + line.production,
            0
          ).toLocaleString()}
          unit="Units"
          description="Total good production"
          icon={Factory}
          color="blue"
          trend="Live"
        />
        <SummaryCard
          title="Energy Consumption"
          value={productionLines
            .reduce((total, line) => total + line.energy, 0)
            .toFixed(2)}
          unit="kWh"
          description="Total energy consumed"
          icon={Zap}
          color="amber"
          trend="Live"
        />
        <SummaryCard
          title="Carbon Emissions"
          value={totalCarbonEmissions}
          unit="kg CO₂e"
          description="Estimated electricity emissions"
          icon={Leaf}
          color="emerald"
          trend="Live"
        />
        <SummaryCard
          title="Active Production Lines"
          value={`${activeLines}/6`}
          unit="Lines"
          description="Currently operational"
          icon={Activity}
          color="purple"
          trend={`${Math.round((activeLines/6)*100)}%`}
        />
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">Production Line Monitoring</h3>
            <p className="mt-1 text-sm text-slate-500">
              Live status of all six production lines
            </p>
          </div>
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
            View All Lines
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-slate-500">Loading production data...</p>
          ) : productionLines.length === 0 ? (
            <p className="text-red-500">No production readings available.</p>
          ) : (
            productionLines.map((line) => <ProductionCard key={line.id} line={line} />)
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle size={22} />
            </div>
            <div>
              <h3 className="font-semibold">System Monitoring</h3>
              <p className="text-sm text-slate-500">
                All monitoring services are configured
              </p>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-slate-100">
            <div className="h-2 w-full rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-xs text-slate-500">Illustrative system status</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-3 text-amber-600">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">Attention Required</h3>
              <p className="text-sm text-amber-700">
                One production line requires inspection.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-amber-800">
            Line L5 is showing higher-than-usual power consumption in this illustrative dashboard.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 pt-5 text-center text-xs text-slate-500">
        AirSense360 © 2026 | Smart Energy and Production Monitoring
      </footer>
    </div>
  );
}

export default Dashboard;
