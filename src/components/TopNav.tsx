"use client";

const tabs = ["Goal Tab", "Custom Form", "Visit Note"];

export default function TopNav({
  patientName,
  activeTab,
  onTabChange,
}: {
  patientName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
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
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
