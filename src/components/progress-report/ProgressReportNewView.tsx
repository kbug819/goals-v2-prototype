"use client";

import { useState } from "react";
import DevNote from "@/components/shared/DevNote";
import { mockGoals, PatientGoal } from "@/data/mockData";
import { formatDate } from "@/utils/formatDate";

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
              <GoalCardNew key={goal.id} goal={goal} />
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
              <GoalCardNew key={goal.id} goal={goal} showChart />
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

// ── Shared goal card body (reuses POC/Eval layout) ──
function GoalCardBody({ goal, showChart = false }: { goal: PatientGoal; showChart?: boolean }) {
  const latestEvent = goal.events.length > 0 ? goal.events[goal.events.length - 1] : null;

  const fmtVal = (v: string) => {
    const d = v.replace(/_/g, " ");
    if (goal.measurement_type === "percentage") return `${d}%`;
    if (goal.measurement_type === "duration") return `${d} ${(goal.measurement_config.unit as string) || "sec"}`;
    if (goal.measurement_type === "count") return `${d} ${(goal.measurement_config.unit as string) || ""}`;
    return d;
  };

  return (
    <div className="bg-gray-50/60 px-4 py-4 space-y-3">
      <p className="text-sm text-gray-700 leading-relaxed">{goal.goal_text}</p>

      {/* Measurement trajectory */}
      {goal.baseline_value && goal.target_value && goal.data_points.length > 0 && (() => {
        const dp = goal.data_points;
        const currentDp = dp[dp.length - 1];
        const prevIdx = Math.max(0, Math.floor(dp.length / 2) - 1);
        const previousDp = dp.length > 2 ? dp[prevIdx] : null;

        return (
          <div className={`grid gap-3 ${previousDp ? "grid-cols-4" : "grid-cols-3"}`}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Baseline <span className="font-normal text-gray-400">{formatDate(goal.start_date)}</span></label>
              <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 text-sm text-gray-700">{fmtVal(goal.baseline_value!)}</div>
            </div>
            {previousDp && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Previous <span className="font-normal text-gray-400">{formatDate(previousDp.recorded_at)}</span></label>
                <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 text-sm text-gray-700">{fmtVal(previousDp.value)}</div>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-indigo-700 mb-1">Current <span className="font-normal text-indigo-400">{formatDate(currentDp.recorded_at)}</span></label>
              <div className="border border-indigo-200 rounded px-2.5 py-1.5 bg-indigo-50 text-sm font-semibold text-indigo-700">{fmtVal(currentDp.value)}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target <span className="font-normal text-gray-400">{goal.target_date ? formatDate(goal.target_date) : ""}</span></label>
              <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 text-sm text-gray-700">{fmtVal(goal.target_value!)}</div>
            </div>
          </div>
        );
      })()}

      {/* Chart placeholder (Full only) */}
      {showChart && goal.data_points.length >= 2 && (
        <div className="bg-white rounded-lg px-4 py-6 text-center text-xs text-gray-400 border border-dashed border-gray-200">
          Auto-generated chart from {goal.data_points.length} data points ({formatDate(goal.data_points[0].recorded_at)} — {formatDate(goal.data_points[goal.data_points.length - 1].recorded_at)})
        </div>
      )}

      {/* Current functional level + Previous comment */}
      {(latestEvent?.current_functional_level || latestEvent?.comment) && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Current Functional Level {latestEvent?.occurred_on ? <span className="font-normal text-gray-400">{formatDate(latestEvent.occurred_on)}</span> : null}</label>
            <div className="text-sm text-gray-600 bg-gray-50 rounded px-2.5 py-1.5 border border-gray-200 min-h-[2.25rem]">{latestEvent?.current_functional_level || "—"}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Previous Comment {latestEvent?.occurred_on ? <span className="font-normal text-gray-400">{formatDate(latestEvent.occurred_on)}</span> : null}</label>
            <div className="text-sm text-gray-600 italic bg-gray-50 rounded px-2.5 py-1.5 border border-gray-200 min-h-[2.25rem]">{latestEvent?.comment || "—"}</div>
          </div>
        </div>
      )}

      {/* Status action buttons */}
      <div className="flex items-center gap-2">
        <button className="px-2.5 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">Continue</button>
        <button className="px-2.5 py-1 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">Mark Met</button>
        <button className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Discontinue</button>
      </div>

      {/* Narrative (progress report addition) */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Progress Narrative</label>
        <textarea rows={2} placeholder="Describe patient's progress toward this goal..." className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
    </div>
  );
}

// ── Goal card wrapper (Simple + Full share the same layout) ──
function GoalCardNew({ goal, depth = 0, showChart = false }: { goal: PatientGoal; depth?: number; showChart?: boolean }) {
  const goalLabel = goal.goal_type === "short_term" ? "Short Term Goal" : "Long Term Goal";
  const isChild = goal.goal_type === "short_term";

  return (
    <div className={`${isChild && depth > 0 ? "ml-8 mt-2" : ""}`}>
      {isChild && depth > 0 && <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-100/70">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-indigo-900">{goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}</span>
            <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Current status: {goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}</span>
        </div>
        <GoalCardBody goal={goal} showChart={showChart} />
      </div>
      {goal.children.filter((c) => c.current_status === "active" || c.current_status === "met").map((child) => (
        <GoalCardNew key={child.id} goal={child} depth={depth + 1} showChart={showChart} />
      ))}
    </div>
  );
}



// ── Switcher formats ──
const NEW_FORMATS = [
  { value: "default", label: "Simple" },
  { value: "charts", label: "Full" },
];

export default function ProgressReportNewView() {
  const [format, setFormat] = useState("default");

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews progress report creation. 'Simple' shows narrative text fields per goal (all data visualization options off). 'Full' shows everything turned on — measurement trajectory, progress charts, session data, status updates, and narratives."
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
