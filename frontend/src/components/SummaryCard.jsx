import { TrendingUp } from "lucide-react";

function SummaryCard({ title, value, unit, description, icon: Icon, color, trend }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-lg p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">{description}</p>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <TrendingUp size={14} />
          {trend}
        </span>
      </div>
    </div>
  );
}

export default SummaryCard;
