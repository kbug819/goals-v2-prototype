"use client";

const tabs = [
  { name: "Overview", active: false },
  { name: "Payments", active: false },
  { name: "Goals", active: true },
];

export default function TopNav({ patientName }: { patientName: string }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 pt-4 pb-0">
        <nav className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
          <span className="hover:text-gray-700 cursor-pointer">Demo org</span>
          <span className="text-gray-300">&gt;</span>
          <span className="hover:text-gray-700 cursor-pointer">Patients</span>
          <span className="text-gray-300">&gt;</span>
          <span className="text-gray-900 font-medium">{patientName}</span>
        </nav>
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab.active
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-400 cursor-default"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
