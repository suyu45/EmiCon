import { Activity } from "lucide-react";
import navigation from "./navigation";

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="hidden w-64 shrink-0 bg-slate-950 text-white md:flex md:flex-col">
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500 p-2">
            <Activity size={25} />
          </div>
          <div>
            <h1 className="text-xl font-bold">EmiCon</h1>
            <p className="text-xs text-slate-400">Smart Factory Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                activePage === item.name
                  ? "bg-emerald-500 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-5">
        <p className="text-xs text-slate-500">System Status</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm text-emerald-400">Monitoring Active</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
