"use client";

import { useState } from "react";
import TopNav from "@/components/shared/TopNav";
import GoalCard from "@/components/goals-v2/GoalCard";
import GoalsFilter from "@/components/goals-v2/GoalsFilter";
import CustomFormView from "@/components/goals-v2/CustomFormView";
import CustomFormShowView from "@/components/goals-v2/CustomFormShowView";
import ComponentSetupView from "@/components/goals-v2/ComponentSetupView";
import CustomFormCreationView from "@/components/visit-note/CustomFormCreationView";
import VisitNoteNewView from "@/components/visit-note/VisitNoteNewView";
import VisitNoteView from "@/components/visit-note/VisitNoteView";
import DevNote from "@/components/shared/DevNote";
import ProgressReportNewView from "@/components/progress-report/ProgressReportNewView";
import ProgressReportShowView from "@/components/progress-report/ProgressReportShowView";
import PRComponentSetupView from "@/components/progress-report/ComponentSetupView";
import { mockPatient, mockGoals, GoalStatus, PatientGoal } from "@/data/mockData";

function countGoalsByStatus(goals: PatientGoal[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const goal of goals) {
    counts[goal.current_status] = (counts[goal.current_status] || 0) + 1;
    for (const child of goal.children) {
      counts[child.current_status] = (counts[child.current_status] || 0) + 1;
    }
  }
  return counts;
}

function filterGoals(goals: PatientGoal[], filter: GoalStatus | "all", discipline: string | "all"): PatientGoal[] {
  let filtered = goals;
  if (discipline !== "all") {
    filtered = filtered.filter((g) => g.discipline === discipline);
  }
  if (filter !== "all") {
    filtered = filtered.filter(
      (g) => g.current_status === filter || g.children.some((c) => c.current_status === filter)
    );
  }
  return filtered;
}

function GoalsView() {
  const [filter, setFilter] = useState<GoalStatus | "all">("active");
  const [discipline, setDiscipline] = useState<string | "all">("all");
  const disciplineFiltered = discipline === "all" ? mockGoals : mockGoals.filter((g) => g.discipline === discipline);
  const counts = countGoalsByStatus(disciplineFiltered);
  const filteredGoals = filterGoals(mockGoals, filter, discipline);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews the patient-level Goals tab — a standalone view of all goals outside of documents. Filter by status and discipline, view data points and status history."
        todos={[]}
      />

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <GoalsFilter
          activeFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
          disciplines={mockPatient.disciplines}
          activeDiscipline={discipline}
          onDisciplineChange={setDiscipline}
        />
      </div>

      {/* Goal cards */}
      <div className="space-y-3">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => <GoalCard key={`${goal.id}-${filter}`} goal={goal} activeFilter={filter} />)
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No goals match this filter</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-2 text-sm text-indigo-500 hover:text-indigo-700"
            >
              Show all goals
            </button>
          </div>
        )}
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; Mock Data
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [project, setProject] = useState<"vncf" | "goals_v2" | "progress_reports">("goals_v2");
  const [activeTab, setActiveTab] = useState("Overview");

  function handleProjectChange(newProject: "vncf" | "goals_v2" | "progress_reports") {
    setProject(newProject);
    if (newProject === "vncf") setActiveTab("Custom Form Creation");
    else if (newProject === "goals_v2") setActiveTab("Overview");
    else setActiveTab("Progress Report - New");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        project={project}
        onProjectChange={handleProjectChange}
      />

      {activeTab === "Overview" && (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Goals V2 Prototype</h1>
          <p className="text-sm text-gray-500 mb-8">Interactive prototype for the Goals V2 project. Use the tabs above to explore each view. This is not a working app — it uses mock data to demonstrate proposed UI/UX.</p>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm font-bold text-indigo-700 mb-1">Custom Form Setup</h2>
              <p className="text-sm text-gray-600">Preview how the Custom Form Editor would look when configuring goal components. Toggle between POC/Eval and Visit Note setups.</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-300 rounded ring-1 ring-amber-200">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  Interactive
                </span>
                <span className="text-xs text-gray-400">Elements with amber borders and glow are clickable and update the preview in real time.</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm font-bold text-indigo-700 mb-1">POC / Eval - New</h2>
              <p className="text-sm text-gray-600">Preview the goal editor component on a Plan of Care. Create new goals, continue/meet/discontinue active goals, and see how the form handles pending states before signing.</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-300 rounded ring-1 ring-amber-200">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  Interactive
                </span>
                <span className="text-xs text-gray-400">Status buttons, goal creation, and cascade/revert all work.</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm font-bold text-indigo-700 mb-1">POC / Eval - Preview</h2>
              <p className="text-sm text-gray-600">Preview what a saved (draft) and signed POC looks like with Goals V2. Switch between &quot;Saved (Draft)&quot; and &quot;Signed&quot; to see how goal statuses transition on signing.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm font-bold text-indigo-700 mb-1">Goals Tab</h2>
              <p className="text-sm text-gray-600">Preview the patient-level Goals tab on the patient profile. Filter by status (active, met, discontinued) and discipline. Expand goals to see data points and status history.</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-300 rounded ring-1 ring-amber-200">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  Interactive
                </span>
                <span className="text-xs text-gray-400">Filter buttons, goal cards, and goal progress toggles are all clickable.</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-sm font-bold text-indigo-700 mb-1">Visit Note - New &amp; Preview</h2>
              <p className="text-sm text-gray-600">See the visit note goal components in action. The components configured in the Custom Form Setup (Visit Note tab) are previewed here — switch between Goal Checklist, Goal Progress, Goal Admin, and Goal Custom using the &apos;Showing&apos; buttons.</p>
              <p className="text-sm text-gray-500 mt-1"><strong>New</strong> shows what the therapist sees when filling out the visit note. <strong>Preview</strong> shows what the saved visit note looks like after submission.</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Goals V2 Prototype — Mock Data Only
            </span>
          </div>
        </div>
      )}
      {activeTab === "Custom Form Creation" && <CustomFormCreationView />}
      {activeTab === "Goals Tab" && <GoalsView />}
      {activeTab === "POC / Eval - New" && <CustomFormView />}
      {activeTab === "POC / Eval - Preview" && <CustomFormShowView />}
      {activeTab === "Visit Note - New" && <VisitNoteNewView project={project} />}
      {activeTab === "Visit Note - Preview" && <VisitNoteView project={project} />}
      {activeTab === "Custom Form Setup" && project === "goals_v2" && <ComponentSetupView />}
      {activeTab === "Custom Form Setup" && project === "progress_reports" && <PRComponentSetupView />}
      {activeTab === "Progress Report - New" && <ProgressReportNewView />}
      {activeTab === "Progress Report - Show" && <ProgressReportShowView />}
    </div>
  );
}
