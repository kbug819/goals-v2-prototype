"use client";

type Project = "vncf" | "goals_v2";

const PROJECT_TABS: Record<Project, string[]> = {
  vncf: ["Visit Note - New", "Visit Note - Show"],
  goals_v2: ["Goal Tab", "Custom Form", "Visit Note - New", "Visit Note - Show"],
};

export default function TopNav({
  patientName,
  activeTab,
  onTabChange,
  project,
  onProjectChange,
}: {
  patientName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  project: Project;
  onProjectChange: (project: Project) => void;
}) {
  const tabs = PROJECT_TABS[project];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 pt-4 pb-0">
        <nav className="text-sm text-gray-500 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="hover:text-gray-700 cursor-pointer">Demo org</span>
            <span className="text-gray-300">&gt;</span>
            <span className="hover:text-gray-700 cursor-pointer">Patients</span>
            <span className="text-gray-300">&gt;</span>
            <span className="text-gray-900 font-medium">{patientName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Project:</span>
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => onProjectChange("vncf")}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  project === "vncf"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Visit Note Custom Form
              </button>
              <button
                onClick={() => onProjectChange("goals_v2")}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                  project === "goals_v2"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Goals V2
              </button>
            </div>
          </div>
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
