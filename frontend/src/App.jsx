import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import PlaceholderPage from "./components/PlaceholderPage";
import useProductionReadings from "./hooks/useProductionReadings";


function App() {
  const [activePage, setActivePage] = useState("Overview");
  const { productionLines, loading, lastUpdated } = useProductionReadings();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <main className="min-w-0 flex-1">
          <Header activePage={activePage} />

          {activePage === "Overview" ? (
            <Dashboard
              productionLines={productionLines}
              loading={loading}
              lastUpdated={lastUpdated}
            />
          ) : (
            <PlaceholderPage activePage={activePage} />
          )}
        </main>
      </div>


    </div>
  );
}

export default App;