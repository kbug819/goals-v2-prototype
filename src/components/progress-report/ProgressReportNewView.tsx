"use client";

import { useState } from "react";
import DevNote from "@/components/shared/DevNote";
import { mockGoals, PatientGoal, GoalStatus } from "@/data/mockData";

import { formatDate } from "@/utils/formatDate";

// ── Shared report form (Simple + Full use same layout, showChart toggles) ──
function ReportFormView({ showChart, mode = "date_range", goals, changedOnForm, onStatusChange, onRevert, onModeChange }: {
  showChart: boolean;
  mode?: "date_range" | "last_visits" | "comparative";
  goals: PatientGoal[];
  changedOnForm: Set<string>;
  onStatusChange: (id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) => void;
  onRevert: (id: string) => void;
  onModeChange?: (mode: "date_range" | "last_visits" | "comparative") => void;
}) {
  const speechGoals = goals.filter((g) => g.discipline === "Speech");
  const visibleTopLevel = speechGoals.filter((g) => g.goal_type !== "short_term" && (g.current_status === "active" || changedOnForm.has(g.id)));

  function getChildren(parentId: string) {
    return speechGoals.filter((g) => g.parent_id === parentId && (g.current_status === "active" || g.current_status === "pending" || changedOnForm.has(g.id)));
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Report details — changes based on collection mode */}
        <div className="px-5 py-4 border-b border-gray-200 space-y-3">
          {mode === "date_range" && (
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
          )}

          {mode === "last_visits" && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Number of Visits</label>
                <input type="number" defaultValue={10} min={1} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Computed Start</label>
                <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50">3/5/2026</div>
                <span className="text-[11px] text-gray-400">Auto-calculated from oldest visit</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Computed End</label>
                <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-50">4/2/2026</div>
                <span className="text-[11px] text-gray-400">Auto-calculated from newest visit</span>
              </div>
            </div>
          )}

          {mode === "comparative" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <span className="text-xs font-semibold text-gray-600 block mb-2">Previous Period</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Start</label>
                      <input type="date" defaultValue="2025-12-01" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">End</label>
                      <input type="date" defaultValue="2026-02-28" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <span className="text-xs font-semibold text-indigo-700 block mb-2">Current Period</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Start</label>
                      <input type="date" defaultValue="2026-03-01" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">End</label>
                      <input type="date" defaultValue="2026-04-08" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collection type switcher + Generate */}
          <div className="flex items-center justify-between">
            {onModeChange ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Collection type:</span>
                {([["date_range", "Date Range"], ["last_visits", "Last N Visits"], ["comparative", "Comparative"]] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => onModeChange(val)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                      mode === val
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">Collection type: {mode === "date_range" ? "Date Range" : mode === "last_visits" ? "Last N Visits" : "Comparative"}</span>
            )}
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Generate Goals
            </button>
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

        {/* Goals */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Goal Progress</h3>
          <div className="space-y-3">
            {visibleTopLevel.map((goal) => (
              <PRGoalCard
                key={goal.id}
                goal={goal}
                childGoals={getChildren(goal.id)}
                showChart={showChart}
                onStatusChange={onStatusChange}
                onRevert={onRevert}
              />
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

// ── Status action row (same pattern as POC/Eval) ──
function PRStatusActionRow({ goal, activeChildCount = 0, onStatusChange }: {
  goal: PatientGoal;
  activeChildCount?: number;
  onStatusChange: (id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) => void;
}) {
  const [action, setAction] = useState<"continued" | "met" | "discontinued" | null>(null);
  const [comment, setComment] = useState("");
  const [functionalLevel, setFunctionalLevel] = useState("");

  if (goal.current_status !== "active") return null;

  function handleSubmit() {
    if (!action || !comment.trim()) return;
    const statusMap: Record<string, GoalStatus> = { continued: "active", met: "met", discontinued: "discontinued" };
    onStatusChange(goal.id, statusMap[action], comment, functionalLevel || null);
    setAction(null);
    setComment("");
    setFunctionalLevel("");
  }

  const showChildWarning = activeChildCount > 0 && (action === "met" || action === "discontinued");

  if (!action) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={() => setAction("continued")} className="px-2.5 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">Continue</button>
        <button onClick={() => setAction("met")} className="px-2.5 py-1 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">Mark Met</button>
        <button onClick={() => setAction("discontinued")} className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Discontinue</button>
      </div>
    );
  }

  const cfg = {
    continued: { label: "Continuing Goal", placeholder: "Reason for continuing (e.g. progressing well, continuing current approach)...", btnLabel: "Save Update", btnClass: "bg-indigo-600 hover:bg-indigo-700", borderColor: "border-indigo-200" },
    met: { label: "Marking as Met", placeholder: "How was this goal met?", btnLabel: "Confirm Met", btnClass: "bg-green-600 hover:bg-green-700", borderColor: "border-green-200" },
    discontinued: { label: "Discontinuing Goal", placeholder: "Reason for discontinuing...", btnLabel: "Confirm Discontinue", btnClass: "bg-red-600 hover:bg-red-700", borderColor: "border-red-200" },
  }[action];

  return (
    <div className={`border ${cfg.borderColor} rounded-lg p-3 bg-white space-y-2`}>
      <span className="text-xs font-medium text-gray-600">{cfg.label}</span>
      {showChildWarning && (
        <div className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${action === "met" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <span>{action === "met" ? `This will also mark ${activeChildCount} active short-term goal${activeChildCount > 1 ? "s" : ""} as met.` : `This will also discontinue ${activeChildCount} active short-term goal${activeChildCount > 1 ? "s" : ""}.`}</span>
        </div>
      )}
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} placeholder={cfg.placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      <div>
        <label className="block text-xs text-gray-500 mb-1">Current Functional Level</label>
        <input value={functionalLevel} onChange={(e) => setFunctionalLevel(e.target.value)} placeholder="Update functional status..." className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => { setAction(null); setComment(""); }} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
        <button onClick={handleSubmit} disabled={!comment.trim()} className={`px-3 py-1 text-xs font-medium text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${cfg.btnClass}`}>{cfg.btnLabel}</button>
      </div>
    </div>
  );
}

// ── Goal card (active or closed-on-form) ──
function PRGoalCard({ goal, childGoals, showChart = false, onStatusChange, onRevert }: {
  goal: PatientGoal;
  childGoals: PatientGoal[];
  showChart?: boolean;
  onStatusChange: (id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) => void;
  onRevert?: (id: string) => void;
}) {
  const goalLabel = goal.goal_type === "short_term" ? "Short Term Goal" : "Long Term Goal";
  const latestEvent = goal.events.length > 0 ? goal.events[goal.events.length - 1] : null;
  const isChild = goal.goal_type === "short_term";
  const isClosedOnForm = goal.current_status === "met" || goal.current_status === "discontinued";

  const fmtVal = (v: string) => {
    const d = v.replace(/_/g, " ");
    if (goal.measurement_type === "percentage") return `${d}%`;
    if (goal.measurement_type === "duration") return `${d} ${(goal.measurement_config.unit as string) || "sec"}`;
    if (goal.measurement_type === "count") return `${d} ${(goal.measurement_config.unit as string) || ""}`;
    return d;
  };

  // Met/Discontinued on form — compact card with revert
  if (isClosedOnForm && onRevert) {
    const closedHeaderBg = goal.current_status === "met" ? "bg-blue-200/80" : "bg-red-200/80";
    const closedBg = goal.current_status === "met" ? "bg-blue-100/60" : "bg-red-100/60";
    return (
      <div className={`${isChild ? "ml-8 mt-2" : ""}`}>
        {isChild && <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>}
        <div className={`rounded-lg overflow-hidden border border-gray-200 ${closedBg}`}>
          <div className={`flex items-center justify-between px-4 py-2.5 ${closedHeaderBg}`}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-800">{goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}</span>
              <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Current status: {goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}</span>
              <button onClick={() => onRevert(goal.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                Revert
              </button>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm text-gray-500 leading-relaxed">{goal.goal_text}</p>
            {latestEvent?.comment && <p className="text-sm text-gray-400 italic mt-2">{latestEvent.comment}</p>}
          </div>
        </div>
        {childGoals.map((child) => (
          <PRGoalCard key={child.id} goal={child} childGoals={[]} showChart={showChart} onStatusChange={onStatusChange} />
        ))}
      </div>
    );
  }

  // Active goal — full card
  return (
    <div className={`${isChild ? "ml-8 mt-2" : ""}`}>
      {isChild && <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-100/70">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-indigo-900">{goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}</span>
            <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Current status: {goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}</span>
        </div>
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

          {/* Status actions */}
          <PRStatusActionRow goal={goal} activeChildCount={childGoals.filter((c) => c.current_status === "active").length} onStatusChange={onStatusChange} />

          {/* Narrative (per-report, payer-facing) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Progress Narrative <span className="font-normal text-gray-400">Appears on signed report</span></label>
            <textarea rows={2} placeholder="Summarize patient's progress toward this goal during this reporting period..." className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
        </div>
      </div>
      {childGoals.map((child) => (
        <PRGoalCard key={child.id} goal={child} childGoals={[]} showChart={showChart} onStatusChange={onStatusChange} />
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
  const [collectionMode, setCollectionMode] = useState<"date_range" | "last_visits" | "comparative">("date_range");

  // Goal state management (same pattern as POC/Eval CustomFormView)
  const [goals, setGoals] = useState<PatientGoal[]>(() => {
    const flat: PatientGoal[] = [];
    for (const g of mockGoals) {
      flat.push(g);
      for (const c of g.children) flat.push(c);
    }
    return flat;
  });
  const [changedOnForm, setChangedOnForm] = useState<Set<string>>(new Set());

  function handleStatusChange(id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) {
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    const cascadeIds = new Set<string>([id]);
    if (status === "met" || status === "discontinued") {
      goals.forEach((g) => {
        if (g.parent_id === id && g.current_status === "active") cascadeIds.add(g.id);
      });
      setChangedOnForm((prev) => { const next = new Set(prev); cascadeIds.forEach((cid) => next.add(cid)); return next; });
    }
    setGoals(goals.map((g) => {
      if (!cascadeIds.has(g.id)) return g;
      const isParent = g.id === id;
      return {
        ...g,
        current_status: status,
        met_on: status === "met" ? today : g.met_on,
        events: [...g.events, {
          id: `ev-pr-${Date.now()}-${g.id}`,
          status,
          occurred_on: today,
          comment: isParent ? comment : `${status === "met" ? "Met" : "Discontinued"} with parent LTG`,
          current_functional_level: currentFunctionalLevel,
          user_name: "Sam Therapist",
          created_at: now,
        }],
      };
    }));
  }

  function handleRevertStatus(id: string) {
    const revertIds = new Set<string>([id]);
    goals.forEach((g) => { if (g.parent_id === id && changedOnForm.has(g.id)) revertIds.add(g.id); });
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    setChangedOnForm((prev) => { const next = new Set(prev); revertIds.forEach((rid) => next.delete(rid)); return next; });
    setGoals(goals.map((g) => {
      if (!revertIds.has(g.id)) return g;
      const priorEvents = g.events.filter((e) => !e.id.startsWith("ev-pr-"));
      const priorLevel = [...priorEvents].reverse().find((e) => e.current_functional_level)?.current_functional_level || null;
      return {
        ...g,
        current_status: "active" as GoalStatus,
        met_on: null,
        events: [...g.events, {
          id: `ev-revert-${Date.now()}-${g.id}`,
          status: "active" as GoalStatus,
          occurred_on: today,
          comment: "Reverted to active (unsigned draft)",
          current_functional_level: priorLevel,
          user_name: "Sam Therapist",
          created_at: now,
        }],
      };
    }));
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews progress report creation. 'Simple' shows the POC/Eval-style goal card. 'Full' adds charts. The collection type switcher (Date Range / Last N Visits / Comparative) controls how session data is gathered. The collection type option is only available to therapists if enabled in the Custom Form Setup settings. Otherwise, the default collection type set by the admin is used."
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

      <ReportFormView
        showChart={format === "charts"}
        mode={collectionMode}
        goals={goals}
        changedOnForm={changedOnForm}
        onStatusChange={handleStatusChange}
        onRevert={handleRevertStatus}
        onModeChange={setCollectionMode}
      />

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
