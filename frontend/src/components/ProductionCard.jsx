function ProductionCard({ line }) {
  const statusStyles = {
    Running: "bg-emerald-100 text-emerald-700",
    Idle: "bg-slate-100 text-slate-600",
    Warning: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Production Line
          </p>
          <h3 className="mt-1 text-xl font-bold">{line.id}</h3>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[line.status] || statusStyles.Idle}`}>
          {line.status}
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">Product</p>
        <p className="mt-1 font-semibold">{line.product}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500">Production</p>
          <p className="mt-1 text-lg font-bold">
            {line.production}
            <span className="ml-1 text-xs font-normal text-slate-500">units</span>
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Power Consumption</p>
          <p className="mt-1 text-lg font-bold">
            {line.power}
            <span className="ml-1 text-xs font-normal text-slate-500">kW</span>
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-slate-500">Efficiency</span>
          <span className="font-semibold">{line.efficiency}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: `${line.efficiency}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductionCard;
