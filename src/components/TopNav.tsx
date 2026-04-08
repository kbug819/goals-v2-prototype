"use client";

const tabs = [
  { name: "Overview", active: false },
  { name: "Goals", active: true },
  { name: "Documents", active: false },
  { name: "Notes", active: false },
];

export default function TopNav({ patientName }: { patientName: string }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 pt-4 pb-0">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">{patientName}</h1>
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
