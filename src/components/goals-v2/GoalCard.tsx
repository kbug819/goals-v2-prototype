"use client";

import { useState } from "react";
import { PatientGoal } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";

import ScaleProgress from "@/components/shared/ScaleProgress";
import { formatDate, formatDateShort } from "@/utils/formatDate";


function MeasurementDisplay({ goal }: { goal: PatientGoal }) {
  if (!goal.baseline_value || !goal.target_value) return null;
  const dp = goal.data_points;
  const currentDp = dp.length > 0 ? dp[dp.length - 1] : null;
  const prevIdx = Math.max(0, Math.floor(dp.length / 2) - 1);
  const previousDp = dp.length > 2 ? dp[prevIdx] : null;

  const fmtVal = (v: string) => {
    const d = v.replace(/_/g, " ");
    if (goal.measurement_type === "percentage") return `${d}%`;
    if (goal.measurement_type === "duration") return `${d} ${(goal.measurement_config.unit as string) || "sec"}`;
    if (goal.measurement_type === "count") return `${d} ${(goal.measurement_config.unit as string) || ""}`;
    if (goal.measurement_type === "binary") return d === "true" ? "Met" : "Not met";
    if (goal.measurement_type === "custom") return `${d} ${(goal.measurement_config.unit as string) || ""}`;
    return d;
  };

  // Scale gets its own visual
  if (goal.measurement_type === "scale" && goal.measurement_config.levels) {
    const levels = goal.measurement_config.levels as string[];
    const current = currentDp ? currentDp.value : (goal.baseline_value || levels[0]);
    return (
      <div>
        <ScaleProgress
          levels={levels}
          baseline={goal.baseline_value || levels[0]}
          current={current}
          target={goal.target_value || levels[levels.length - 1]}
        />
        {previousDp && (
          <div className="text-[11px] text-gray-400 mt-1">Previous: {previousDp.value.replace(/_/g, " ")} <span className="text-gray-300">({formatDate(previousDp.recorded_at)})</span></div>
        )}
      </div>
    );
  }

  // Binary gets a simple display
  if (goal.measurement_type === "binary") {
    const current = currentDp ? currentDp.value : (goal.baseline_value || "false");
    const achieved = current === "true";
    return (
      <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${achieved ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
        {achieved ? (
          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        )}
        <span className={`text-xs font-semibold ${achieved ? "text-green-700" : "text-amber-700"}`}>{achieved ? "Met" : "Not met"}</span>
        <span className="text-xs text-gray-400">{achieved ? "— goal achieved" : "— in progress"}</span>
      </div>
    );
  }

  // Numeric types get inline text + progress bar with Previous marker
  const currentVal = currentDp ? currentDp.value : goal.baseline_value;
  const baseNum = parseFloat(goal.baseline_value);
  const targetNum = parseFloat(goal.target_value);
  const curNum = parseFloat(currentVal);
  const range = targetNum - baseNum;
  const pct = range !== 0 ? Math.min(100, Math.max(0, Math.round(((curNum - baseNum) / range) * 100))) : 0;
  const prevPct = previousDp && range !== 0 ? Math.min(100, Math.max(0, Math.round(((parseFloat(previousDp.value) - baseNum) / range) * 100))) : null;

  const unit = goal.measurement_type === "percentage" ? "%" :
    goal.measurement_type === "duration" ? ` ${(goal.measurement_config.unit as string) || "sec"}` :
    goal.measurement_type === "count" ? ` ${(goal.measurement_config.unit as string) || ""}` :
    goal.measurement_type === "custom" ? ` ${(goal.measurement_config.unit as string) || ""}` : "";
  const label = goal.measurement_type === "custom" ? ((goal.measurement_config.label as string) || "Value") :
    goal.measurement_type.charAt(0).toUpperCase() + goal.measurement_type.slice(1);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Baseline: {goal.baseline_value}{unit}</span>
        <span className="font-semibold text-indigo-600">Current: {fmtVal(currentVal)}</span>
        <span>Target: {goal.target_value}{unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-indigo-500 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DataPointsPanel({ goal }: { goal: PatientGoal }) {
  const points = goal.data_points;
  if (points.length === 0) return null;

  // For numeric types, render a line chart
  const isNumeric = ["percentage", "count", "duration", "custom"].includes(goal.measurement_type);
  const numericValues = isNumeric ? points.map((p) => parseFloat(p.value)).filter((v) => !isNaN(v)) : [];
  const canChart = isNumeric && numericValues.length >= 2;

  const chartW = 400;
  const chartH = 140;
  const padX = 40;
  const padY = 20;

  let polyline = "";
  let dotPositions: { x: number; y: number; value: number; label: string }[] = [];
  let targetY: number | null = null;
  let baselineY: number | null = null;

  if (canChart) {
    const allValues = [...numericValues];
    if (goal.baseline_value) allValues.push(parseFloat(goal.baseline_value));
    if (goal.target_value) allValues.push(parseFloat(goal.target_value));
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;

    const toX = (i: number) => padX + (i / (numericValues.length - 1)) * (chartW - padX * 2);
    const toY = (v: number) => padY + (1 - (v - minVal) / range) * (chartH - padY * 2);

    dotPositions = numericValues.map((v, i) => ({
      x: toX(i),
      y: toY(v),
      value: v,
      label: formatDateShort(points[i].recorded_at),
    }));
    polyline = dotPositions.map((d) => `${d.x},${d.y}`).join(" ");

    if (goal.target_value) targetY = toY(parseFloat(goal.target_value));
    if (goal.baseline_value) baselineY = toY(parseFloat(goal.baseline_value));
  }

  return (
    <div className="mt-3 space-y-3">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Goal Progress</h4>

      {/* Line chart */}
      {canChart && (
        <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-md" preserveAspectRatio="xMidYMid meet">
            {/* Target line */}
            {targetY !== null && (
              <>
                <line x1={padX} y1={targetY} x2={chartW - padX} y2={targetY} stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" />
                <text x={chartW - padX + 4} y={targetY + 3} fontSize="9" fill="#10b981">target</text>
              </>
            )}
            {/* Baseline line */}
            {baselineY !== null && (
              <>
                <line x1={padX} y1={baselineY} x2={chartW - padX} y2={baselineY} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4 3" />
                <text x={chartW - padX + 4} y={baselineY + 3} fontSize="9" fill="#9ca3af">baseline</text>
              </>
            )}
            {/* Line */}
            <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
            {/* Dots + labels */}
            {dotPositions.map((d, i) => (
              <g key={i}>
                <circle cx={d.x} cy={d.y} r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
                <text x={d.x} y={d.y - 10} textAnchor="middle" fontSize="9" fill="#4b5563" fontWeight="600">{d.value}</text>
                <text x={d.x} y={chartH - 2} textAnchor="middle" fontSize="8" fill="#9ca3af">{d.label}</text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Scale progression visual */}
      {(() => {
        if (goal.measurement_type !== "scale" || !goal.measurement_config.levels || points.length < 1) return null;
        const levels = goal.measurement_config.levels as string[];
        return (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1">
              {points.map((p, i) => (
                <div key={i} className="flex items-center gap-1">
                  {i > 0 && <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                    i === points.length - 1 ? "bg-indigo-100 text-indigo-700 font-medium" : "bg-gray-100 text-gray-500"
                  }`}>
                    {p.value.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Data table */}
      <div className="space-y-1">
        {points.map((dp, i) => (
          <div key={i} className="flex items-start gap-3 text-xs">
            <span className="text-gray-400 w-20 flex-shrink-0">{formatDate(dp.recorded_at)}</span>
            <span className="font-medium text-gray-700 flex-shrink-0">{goal.measurement_type === "binary" ? (dp.value === "true" ? "Met" : "Not met") : dp.value.replace(/_/g, " ")}</span>
            {dp.note && <span className="text-gray-500 italic truncate">{dp.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function EventTimeline({ goal }: { goal: PatientGoal }) {
  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status History</h4>
      <div className="space-y-2">
        {goal.events.map((event, idx) => {
          const prevLevel = idx > 0 ? goal.events[idx - 1].current_functional_level : null;
          const showFunction = event.current_functional_level && event.current_functional_level !== prevLevel;
          return (
            <div key={event.id} className="space-y-0.5">
              <div className="flex items-start gap-2 text-xs">
                <StatusBadge status={event.status} />
                <span className="text-gray-500">{formatDate(event.occurred_on)}</span>
                <span className="text-gray-400">by {event.user_name}</span>
                {event.comment && (
                  <span className="text-gray-600 italic">&mdash; {event.comment}</span>
                )}
              </div>
              {showFunction && (
                <div className="ml-6 text-xs text-gray-400">
                  <span className="font-medium text-gray-500">Function:</span> {event.current_functional_level}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GoalCard({ goal, depth = 0, activeFilter }: { goal: PatientGoal; depth?: number; activeFilter?: string }) {
  const shouldExpand =
    activeFilter === "met" ? goal.current_status === "met" :
    activeFilter === "discontinued" ? goal.current_status === "discontinued" :
    goal.current_status === "active" || goal.current_status === "pending";
  const [expanded, setExpanded] = useState(shouldExpand);
  const [showHistory, setShowHistory] = useState(false);
  const [showDataPoints, setShowDataPoints] = useState(false);
  const hasChildren = goal.children.length > 0;
  const isChild = depth > 0;

  const goalLabel = goal.goal_type === "short_term" ? "Short Term Goal" : "Long Term Goal";
  const headerBg =
    goal.current_status === "met" ? "bg-blue-100/80" :
    goal.current_status === "discontinued" ? "bg-red-100/80" :
    goal.current_status === "pending" ? "bg-amber-100/80" :
    "bg-indigo-100/70";
  const headerText =
    goal.current_status === "met" ? "text-blue-900" :
    goal.current_status === "discontinued" ? "text-red-900" :
    goal.current_status === "pending" ? "text-amber-900" :
    "text-indigo-900";

  return (
    <div className={`${isChild ? "ml-8 mt-2" : ""}`}>
      {isChild && <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {/* Header bar */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 cursor-pointer border-l-3 border-l-amber-300 ${headerBg}`}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <svg className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className={`text-sm font-bold ${headerText}`}>
              {goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}
            </span>
            <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
            {!isChild && <span className="text-[10px] font-semibold text-white bg-gray-500 rounded px-1.5 py-0.5">{goal.discipline}</span>}
            {goal.met_on && <span className="text-xs text-gray-500">Met {formatDate(goal.met_on)}</span>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasChildren && (
              <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded font-medium">
                {goal.children.length} STG{goal.children.length > 1 ? "s" : ""}
              </span>
            )}
            {goal.linked_document && !goal.linked_document.signed && (
              <span className="text-xs text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Unsigned
              </span>
            )}
            <span className="text-xs font-medium text-gray-600">
              {goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}
            </span>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="bg-gray-50/60 px-4 py-4 space-y-3">
            {/* Unsigned document banner */}
            {goal.linked_document && !goal.linked_document.signed && (
              <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-amber-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>
                  On <span className="font-medium">{goal.linked_document.document_label}</span>
                  {" "}&mdash; pending until document is signed
                </span>
              </div>
            )}

            {/* Goal text */}
            <p className={`text-sm leading-relaxed ${
              goal.current_status === "discontinued" ? "text-gray-400" : "text-gray-700"
            }`}>
              {goal.goal_text}
            </p>

            {/* Measurement progress */}
            <MeasurementDisplay goal={goal} />


            {/* Meta info + current comment */}
            <div className="flex items-start gap-3 text-xs text-gray-500">
              <span className="flex-shrink-0">Start: {formatDate(goal.start_date)}</span>
              {goal.target_date && <span className="flex-shrink-0">Target: {formatDate(goal.target_date)}</span>}
              {goal.events.length > 0 && goal.events[goal.events.length - 1].comment && (
                <span className="text-gray-400 italic truncate" title={goal.events[goal.events.length - 1].comment!}>
                  <svg className="w-3 h-3 text-gray-300 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {goal.events[goal.events.length - 1].comment}
                </span>
              )}
            </div>

            {/* Toggle buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 ring-1 ring-amber-200 ${
                  showHistory ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
                }`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status history
              </button>
              {goal.data_points.length > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDataPoints(!showDataPoints); }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 ring-1 ring-amber-200 ${
                    showDataPoints ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Goal progress ({goal.data_points.length})
                </button>
              )}
            </div>
            {showHistory && <EventTimeline goal={goal} />}
            {showDataPoints && <DataPointsPanel goal={goal} />}
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="space-y-2">
          {goal.children.map((child) => (
            <GoalCard key={child.id} goal={child} depth={depth + 1} activeFilter={activeFilter} />
          ))}
        </div>
      )}
    </div>
  );
}
