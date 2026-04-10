"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import GoalCard from "@/components/GoalCard";
import GoalsFilter from "@/components/GoalsFilter";
import CustomFormView from "@/components/CustomFormView";
import VisitNoteView from "@/components/VisitNoteView";
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
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Goals</h2>
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
          filteredGoals.map((goal) => <GoalCard key={goal.id} goal={goal} activeFilter={filter} />)
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
  const [activeTab, setActiveTab] = useState("Goal Tab");

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav patientName={mockPatient.name} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Goal Tab" && <GoalsView />}
      {activeTab === "Custom Form" && <CustomFormView />}
      {activeTab === "Visit Note" && <VisitNoteView />}
    </div>
  );
}
