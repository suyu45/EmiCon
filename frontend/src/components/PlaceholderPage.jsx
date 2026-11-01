function PlaceholderPage({ activePage }) {
  return (
    <div className="p-5 md:p-8">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800">{activePage}</h3>
        <p className="mt-2 text-sm text-slate-500">
          Welcome to the {activePage} section of AirSense360.
        </p>
        <div className="mt-6 rounded-lg bg-slate-50 p-6">
          <p className="font-medium text-slate-700">{activePage} page</p>
          <p className="mt-2 text-sm text-slate-500">
            This section will display its relevant monitoring information and features.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlaceholderPage;
