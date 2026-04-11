"use client";

import { useState } from "react";
import DevNote from "@/components/shared/DevNote";
import { mockGoals, PatientGoal } from "@/data/mockData";

// ── Default new view — simple narrative per goal ──
function DefaultNewView() {
  const speechGoals = mockGoals.filter(
    (g) => g.discipline === "Speech" && g.goal_type !== "short_term" && (g.current_status === "active" || g.current_status === "met")
  );

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Report details */}
        <div className="px-5 py-4 border-b border-gray-200 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Reporting Period Start</label>
              <input type="date" defaultValue="2026-03-01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Reporting Period End</label>
              <input type="date" defaultValue="2026-04-08" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Discipline</label>
              <select defaultValue="Speech" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Speech</option><option>OT</option><option>PT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Plan of Care</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Speech POC - Mar 2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall summary */}
        <div className="px-5 py-4 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Overall Summary</label>
          <textarea rows={3} placeholder="Provide an overall summary of patient's progress during this reporting period..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        </div>

        {/* Goals with narratives */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Goal Progress</h3>
          <div className="space-y-3">
            {speechGoals.map((goal) => (
              <GoalNarrativeNew key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Recommendations + Prognosis */}
        <div className="px-5 py-4 border-b border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Recommendations</label>
            <textarea rows={3} placeholder="Recommendations for the next reporting period..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Prognosis</label>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select prognosis...</option>
              <option>Excellent</option><option>Good</option><option>Fair</option><option>Guarded</option><option>Poor</option>
            </select>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end px-5 py-4">
          <button disabled className="px-4 py-2 text-sm font-medium text-white bg-gray-300 rounded-lg cursor-not-allowed">Save Progress Report</button>
        </div>
      </div>
    </div>
  );
}

// ── Charts new view — with data visualization ──
function ChartsNewView() {
  const speechGoals = mockGoals.filter(
    (g) => g.discipline === "Speech" && g.goal_type !== "short_term" && (g.current_status === "active" || g.current_status === "met")
  );

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Report details */}
        <div className="px-5 py-4 border-b border-gray-200 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Reporting Period Start</label>
              <input type="date" defaultValue="2026-03-01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Reporting Period End</label>
              <input type="date" defaultValue="2026-04-08" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Discipline</label>
              <select defaultValue="Speech" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Speech</option><option>OT</option><option>PT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Plan of Care</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Speech POC - Mar 2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall summary */}
        <div className="px-5 py-4 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Overall Summary</label>
          <textarea rows={3} placeholder="Provide an overall summary of patient's progress during this reporting period..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        </div>

        {/* Goals with charts + narratives */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Goal Progress</h3>
          <p className="text-xs text-gray-400 italic mb-4">Charts auto-generated from goal_data_points within the reporting period. Narratives are editable.</p>
          <div className="space-y-4">
            {speechGoals.map((goal) => (
              <GoalChartNew key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Recommendations + Prognosis */}
        <div className="px-5 py-4 border-b border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Recommendations</label>
            <textarea rows={3} placeholder="Recommendations for the next reporting period..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Prognosis</label>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select prognosis...</option>
              <option>Excellent</option><option>Good</option><option>Fair</option><option>Guarded</option><option>Poor</option>
            </select>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end px-5 py-4">
          <button disabled className="px-4 py-2 text-sm font-medium text-white bg-gray-300 rounded-lg cursor-not-allowed">Save Progress Report</button>
        </div>
      </div>
    </div>
  );
}

// ── Goal card for default (simple narrative) ──
function GoalNarrativeNew({ goal, depth = 0 }: { goal: PatientGoal; depth?: number }) {
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  const latestDataPoint = goal.data_points.length > 0 ? goal.data_points[goal.data_points.length - 1] : null;

  return (
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-indigo-100 pl-4 mt-2" : ""}`}>
      <div className="border border-gray-200 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${goal.current_status === "active" ? "text-green-600 bg-green-50" : goal.current_status === "met" ? "text-blue-600 bg-blue-50" : "text-gray-600 bg-gray-100"}`}>{goal.current_status}</span>
          {latestDataPoint ? (
            <span className="text-xs text-gray-400">Current: {latestDataPoint.value.replace(/_/g, " ")}{goal.measurement_type === "percentage" ? "%" : ""}</span>
          ) : null}
        </div>
        <p className="text-sm text-gray-700 mt-1.5">{goal.goal_text}</p>
        <div className="mt-2">
          <textarea rows={2} placeholder="Progress narrative for this goal..." className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        </div>
      </div>
      {goal.children.filter((c) => c.current_status === "active" || c.current_status === "met").map((child) => (
        <GoalNarrativeNew key={child.id} goal={child} depth={depth + 1} />
      ))}
    </div>
  );
}

// ── Goal card for charts view (with auto-summary + chart placeholder + narrative) ──
function GoalChartNew({ goal, depth = 0 }: { goal: PatientGoal; depth?: number }) {
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  const latestDataPoint = goal.data_points.length > 0 ? goal.data_points[goal.data_points.length - 1] : null;

  let progressPct = 0;
  if (goal.measurement_type === "percentage" && goal.baseline_value && goal.target_value && latestDataPoint) {
    progressPct = Math.round(((parseFloat(latestDataPoint.value) - parseFloat(goal.baseline_value)) / (parseFloat(goal.target_value) - parseFloat(goal.baseline_value))) * 100);
  }

  return (
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-indigo-100 pl-4 mt-3" : ""}`}>
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${goal.current_status === "active" ? "text-green-600 bg-green-50" : goal.current_status === "met" ? "text-blue-600 bg-blue-50" : "text-gray-600 bg-gray-100"}`}>{goal.current_status}</span>
            <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
          </div>
          <p className="text-sm text-gray-700 mt-1.5">{goal.goal_text}</p>
        </div>

        <div className="px-4 py-3 space-y-2">
          {/* Auto-calculated summary */}
          {goal.baseline_value && goal.target_value && latestDataPoint ? (
            <div className="text-xs text-gray-600">
              Baseline: {goal.baseline_value.replace(/_/g, " ")}{goal.measurement_type === "percentage" ? "%" : ""} → Current: {latestDataPoint.value.replace(/_/g, " ")}{goal.measurement_type === "percentage" ? "%" : ""} → Target: {goal.target_value.replace(/_/g, " ")}{goal.measurement_type === "percentage" ? "%" : ""}
              {progressPct > 0 ? <span className="text-indigo-600 ml-1">({Math.min(progressPct, 100)}% to target)</span> : null}
            </div>
          ) : null}

          {/* Progress bar */}
          {goal.measurement_type === "percentage" && progressPct > 0 ? (
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(100, progressPct)}%` }} />
            </div>
          ) : null}

          {/* Chart placeholder */}
          {goal.data_points.length >= 2 ? (
            <div className="bg-gray-50 rounded-lg px-4 py-6 text-center text-xs text-gray-400 border border-dashed border-gray-200">
              📊 Auto-generated chart from {goal.data_points.length} data points ({goal.data_points[0].recorded_at} — {goal.data_points[goal.data_points.length - 1].recorded_at})
            </div>
          ) : null}

          {/* Narrative */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Progress Narrative</label>
            <textarea rows={2} placeholder="Describe patient's progress toward this goal..." className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
        </div>
      </div>
      {goal.children.filter((c) => c.current_status === "active" || c.current_status === "met").map((child) => (
        <GoalChartNew key={child.id} goal={child} depth={depth + 1} />
      ))}
    </div>
  );
}

// ── Switcher formats ──
const NEW_FORMATS = [
  { value: "default", label: "Default" },
  { value: "charts", label: "w/ Progress Charts" },
];

export default function ProgressReportNewView() {
  const [format, setFormat] = useState("default");

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews progress report creation. 'Default' is a simple form with narrative text fields per goal. 'Progress Charts' includes auto-generated summaries and chart placeholders from goal_data_points."
        todos={[]}
      />

      {/* Format selector */}
      <div className="flex items-center gap-1.5 mb-6">
        <span className="text-xs text-gray-400 mr-1">Showing:</span>
        {NEW_FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFormat(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              format === f.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {format === "default" && <DefaultNewView />}
      {format === "charts" && <ChartsNewView />}

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; Progress Report New Preview
        </span>
      </div>
    </div>
  );
}
