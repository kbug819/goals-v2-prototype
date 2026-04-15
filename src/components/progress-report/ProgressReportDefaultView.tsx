"use client";

import { mockGoals, mockPatient, PatientGoal } from "@/data/mockData";
import { formatDate } from "@/utils/formatDate";

function GoalNarrative({ goal, depth = 0 }: { goal: PatientGoal; depth?: number }) {
  const goalLabel = goal.goal_type === "short_term" ? "Short Term Goal" : "Long Term Goal";
  const isChild = goal.goal_type === "short_term";
  const latestEvent = goal.events.length > 0 ? goal.events[goal.events.length - 1] : null;

  // Mock narrative for show view
  const narratives: Record<string, string> = {
    "pg-1": "Patient has demonstrated steady improvement in /r/ production across word positions. Currently at 72% accuracy, up from 45% baseline.",
    "pg-3": "Patient progressing toward target. Currently at 68% accuracy for final /r/, up from 40% baseline.",
    "pg-4": "Patient has moved from maximal assist to moderate assist level for expressive language.",
    "pg-5": "MLU has increased from 2.5 to 3.1 words. Patient using more descriptors and conjunctions.",
  };

  return (
    <div className={`${isChild && depth > 0 ? "ml-8 mt-2" : ""}`}>
      {isChild && depth > 0 && <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-indigo-100/70">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-indigo-900">{goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}</span>
            <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
            {goal.met_on ? <span className="text-xs text-gray-500">Met {formatDate(goal.met_on)}</span> : null}
          </div>
          <span className="text-sm font-medium text-gray-700">{goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}</span>
        </div>
        <div className="bg-gray-50/60 px-4 py-3 space-y-2">
          <p className="text-sm text-gray-700 leading-relaxed">{goal.goal_text}</p>

          {/* Functional level + status (read-only on signed doc) */}
          {latestEvent?.current_functional_level && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                <span className="text-[11px] font-semibold text-gray-500 block">Current Functional Level</span>
                <span className="text-sm text-gray-600">{latestEvent.current_functional_level}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                <span className="text-[11px] font-semibold text-gray-500 block">Status Decision</span>
                <span className="text-sm text-gray-600">Continue</span>
              </div>
            </div>
          )}

          {/* Narrative (read-only) */}
          <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-gray-500 block">Progress Narrative</span>
            <span className="text-sm text-gray-600 italic">{narratives[goal.id] || "No narrative provided."}</span>
          </div>
        </div>
      </div>

      {/* Children */}
      {goal.children.filter((c) => c.current_status === "active" || c.current_status === "met").map((child) => (
        <GoalNarrative key={child.id} goal={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function ProgressReportDefaultView() {
  const speechGoals = mockGoals.filter(
    (g) => g.discipline === "Speech" && g.goal_type !== "short_term" && (g.current_status === "active" || g.current_status === "met")
  );

  return (
    <div>
      {/* Report header */}
      <div className="bg-slate-700 text-white rounded-t-lg px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium">Progress Report - {mockPatient.name}: Reporting Period 03/01/2026 - 04/08/2026</span>
        </div>
        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">Draft</span>
      </div>

      {/* Report body */}
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg">
        {/* Patient info */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Speech Therapy Progress Report</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-gray-500">Patient</span>
              <p className="text-gray-700">{mockPatient.name}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500">DOB</span>
              <p className="text-gray-700">06/15/2019 (6 years old)</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500">Therapist</span>
              <p className="text-gray-700">Sam Therapist</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500">Discipline</span>
              <p className="text-gray-700">Speech-Language Pathology</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500">Reporting Period</span>
              <p className="text-gray-700">03/01/2026 - 04/08/2026</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500">Diagnosis</span>
              <p className="text-gray-700">F80.2, R48.8</p>
            </div>
          </div>
        </div>

        {/* Overall summary */}
        <div className="px-5 py-4 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Overall Summary</label>
          <textarea
            rows={3}
            placeholder="Provide an overall summary of patient's progress during this reporting period..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Goal narratives */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Goal Progress</h3>
          <div className="space-y-4">
            {speechGoals.map((goal) => (
              <GoalNarrative key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="px-5 py-4 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Recommendations</label>
          <textarea
            rows={3}
            placeholder="Recommendations for the next reporting period..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Prognosis */}
        <div className="px-5 py-4 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Prognosis</label>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select prognosis...</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="guarded">Guarded</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        {/* Sign button */}
        <div className="flex justify-end px-5 py-4">
          <button disabled className="px-4 py-2 text-sm font-medium text-white bg-gray-300 rounded-lg cursor-not-allowed">
            Sign Progress Report
          </button>
        </div>
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; Progress Report Default Preview
        </span>
      </div>
    </div>
  );
}
