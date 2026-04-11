"use client";

import { mockGoals, mockPatient, PatientGoal } from "@/data/mockData";

function GoalNarrative({ goal, depth = 0 }: { goal: PatientGoal; depth?: number }) {
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  const isChild = depth > 0;
  const latestEvent = goal.events.length > 0 ? goal.events[goal.events.length - 1] : null;
  const latestDataPoint = goal.data_points.length > 0 ? goal.data_points[goal.data_points.length - 1] : null;

  let currentValue = "";
  if (latestDataPoint) {
    currentValue = latestDataPoint.value.replace(/_/g, " ");
    if (goal.measurement_type === "percentage") currentValue += "%";
  }

  return (
    <div className={`${isChild ? "ml-6 border-l-2 border-indigo-100 pl-4 mt-3" : ""}`}>
      <div className="border border-gray-200 rounded-lg bg-white px-4 py-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            goal.current_status === "active" ? "text-green-600 bg-green-50" :
            goal.current_status === "met" ? "text-blue-600 bg-blue-50" :
            "text-gray-600 bg-gray-100"
          }`}>
            {goal.current_status}
          </span>
          {goal.met_on ? <span className="text-xs text-gray-400">Met {goal.met_on}</span> : null}
          {goal.baseline_value && goal.target_value ? (
            <span className="text-xs text-gray-400">
              Baseline: {goal.baseline_value.replace(/_/g, " ")}{goal.measurement_type === "percentage" ? "%" : ""} → Target: {goal.target_value.replace(/_/g, " ")}{goal.measurement_type === "percentage" ? "%" : ""}
            </span>
          ) : null}
          {currentValue ? (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-medium text-indigo-600">Current: {currentValue}</span>
            </>
          ) : null}
        </div>

        {/* Goal text */}
        <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{goal.goal_text}</p>

        {/* Current function */}
        {latestEvent?.current_functional_level ? (
          <div className="text-xs text-gray-500 mt-1.5">
            <span className="font-medium text-gray-600">Current function:</span> {latestEvent.current_functional_level}
          </div>
        ) : null}

        {/* Narrative text area */}
        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Progress Narrative</label>
          <textarea
            rows={3}
            placeholder="Describe patient's progress toward this goal during the reporting period..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
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
