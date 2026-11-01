import { Bell, Menu } from "lucide-react";

function Header({ activePage }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5 md:px-8">
      <div className="flex items-center gap-3">
        <button className="text-slate-600 md:hidden">
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-xl font-bold md:text-2xl">
            {activePage === "Overview" ? "Dashboard Overview" : activePage}
          </h2>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            Monitor production, energy and carbon emissions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm text-emerald-700 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live Monitoring
        </div>

        <button className="relative rounded-lg border border-slate-200 p-2">
          <Bell size={20} />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}

export default Header;
