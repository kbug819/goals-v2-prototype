"use client";

import { useState } from "react";
import { PatientGoal } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import ScaleProgress from "./ScaleProgress";

function VersionLabel({ goal }: { goal: PatientGoal }) {
  const prefix =
    goal.goal_type === "short_term" ? "STG" : "LTG";
  return (
    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
      {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
    </span>
  );
}

function MeasurementDisplay({ goal }: { goal: PatientGoal }) {
  const latest = goal.data_points[goal.data_points.length - 1];

  if (goal.measurement_type === "percentage" && goal.baseline_value && goal.target_value) {
    const current = latest ? parseInt(latest.value) : parseInt(goal.baseline_value);
    return (
      <ProgressBar
        baseline={parseInt(goal.baseline_value)}
        current={current}
        target={parseInt(goal.target_value)}
      />
    );
  }

  if (goal.measurement_type === "scale" && goal.measurement_config.levels) {
    const levels = goal.measurement_config.levels as string[];
    const current = latest ? latest.value : (goal.baseline_value || levels[0]);
    return (
      <ScaleProgress
        levels={levels}
        baseline={goal.baseline_value || levels[0]}
        current={current}
        target={goal.target_value || levels[levels.length - 1]}
      />
    );
  }

  if (goal.measurement_type === "count" && goal.baseline_value && goal.target_value) {
    const config = goal.measurement_config;
    const unit = (config.unit as string) || "";
    const per = (config.per as string) || "";
    const current = latest ? latest.value : goal.baseline_value;
    const baseNum = parseInt(goal.baseline_value);
    const curNum = parseInt(current);
    const targetNum = parseInt(goal.target_value);
    const pct = Math.round(((curNum - baseNum) / (targetNum - baseNum)) * 100);
    return (
      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">Count:</span>
          <span>{goal.baseline_value} {unit}</span>
          <span className="text-gray-400">&rarr;</span>
          <span className="font-semibold text-indigo-600">{current} {unit}</span>
          <span className="text-gray-400">&rarr;</span>
          <span>{goal.target_value} {unit}{per ? ` per ${per}` : ""}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
        </div>
      </div>
    );
  }

  if (goal.measurement_type === "duration" && goal.baseline_value && goal.target_value) {
    const unit = (goal.measurement_config.unit as string) || "seconds";
    const current = latest ? latest.value : goal.baseline_value;
    const baseNum = parseInt(goal.baseline_value);
    const curNum = parseInt(current);
    const targetNum = parseInt(goal.target_value);
    const pct = Math.round(((curNum - baseNum) / (targetNum - baseNum)) * 100);
    return (
      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">Duration:</span>
          <span>{goal.baseline_value}s</span>
          <span className="text-gray-400">&rarr;</span>
          <span className="font-semibold text-indigo-600">{current}s</span>
          <span className="text-gray-400">&rarr;</span>
          <span>{goal.target_value} {unit}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
        </div>
      </div>
    );
  }

  if (goal.measurement_type === "binary") {
    const current = latest ? latest.value : (goal.baseline_value || "false");
    const achieved = current === "true";
    return (
      <div className="text-sm text-gray-600 flex items-center gap-2">
        <span className="font-medium">Status:</span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
          achieved ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
        }`}>
          {achieved ? "Achieved" : "Not yet achieved"}
        </span>
      </div>
    );
  }

  if (goal.measurement_type === "custom" && goal.baseline_value && goal.target_value) {
    const label = (goal.measurement_config.label as string) || "Value";
    const unit = (goal.measurement_config.unit as string) || "";
    const current = latest ? latest.value : goal.baseline_value;
    return (
      <div className="text-sm text-gray-600">
        <span className="font-medium">{label}:</span>{" "}
        <span>{goal.baseline_value} {unit}</span>
        <span className="mx-2 text-gray-400">&rarr;</span>
        <span className="font-semibold text-indigo-600">{current} {unit}</span>
        <span className="mx-2 text-gray-400">&rarr;</span>
        <span>{goal.target_value} {unit}</span>
      </div>
    );
  }

  return null;
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
      label: points[i].recorded_at.slice(5), // MM-DD
    }));
    polyline = dotPositions.map((d) => `${d.x},${d.y}`).join(" ");

    if (goal.target_value) targetY = toY(parseFloat(goal.target_value));
    if (goal.baseline_value) baselineY = toY(parseFloat(goal.baseline_value));
  }

  return (
    <div className="mt-3 space-y-3">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Goal Data Points</h4>

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

      {/* Data table */}
      <div className="space-y-1">
        {points.map((dp, i) => (
          <div key={i} className="flex items-start gap-3 text-xs">
            <span className="text-gray-400 w-20 flex-shrink-0">{dp.recorded_at}</span>
            <span className="font-medium text-gray-700 w-20 flex-shrink-0">{dp.value}</span>
            {dp.note && <span className="text-gray-500 italic">{dp.note}</span>}
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
      <div className="space-y-1">
        {goal.events.map((event) => (
          <div key={event.id} className="flex items-start gap-2 text-xs">
            <StatusBadge status={event.status} />
            <span className="text-gray-500">{event.occurred_on}</span>
            <span className="text-gray-400">by {event.user_name}</span>
            {event.comment && (
              <span className="text-gray-600 italic">&mdash; {event.comment}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GoalCard({ goal, depth = 0 }: { goal: PatientGoal; depth?: number }) {
  const [expanded, setExpanded] = useState(goal.current_status === "active" || goal.current_status === "pending");
  const [showHistory, setShowHistory] = useState(false);
  const [showDataPoints, setShowDataPoints] = useState(false);
  const hasChildren = goal.children.length > 0;
  const isChild = depth > 0;

  return (
    <div className={`${isChild ? "ml-6 border-l-2 border-indigo-100 pl-4" : ""}`}>
      <div
        className={`bg-white rounded-lg border transition-shadow ${
          goal.current_status === "met" ? "border-blue-200 bg-blue-50/30" :
          goal.current_status === "discontinued" ? "border-red-200 bg-red-50/30" :
          goal.current_status === "pending" ? "border-amber-200 bg-amber-50/30" :
          "border-gray-200 hover:shadow-md"
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <VersionLabel goal={goal} />
            <StatusBadge status={goal.current_status} />
            {goal.met_on && <span className="text-xs text-gray-400">Met {goal.met_on}</span>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasChildren && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                {goal.children.length} STG{goal.children.length > 1 ? "s" : ""}
              </span>
            )}
            {goal.linked_document && !goal.linked_document.signed && (
              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Unsigned
              </span>
            )}
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 space-y-3">
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
              goal.current_status === "discontinued" ? "text-gray-400 line-through" : "text-gray-700"
            }`}>
              {goal.goal_text}
            </p>

            {/* Measurement progress */}
            <MeasurementDisplay goal={goal} />

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <span>Start: {goal.start_date}</span>
              {goal.target_date && <span>Target: {goal.target_date}</span>}
              <span className="capitalize">Type: {goal.measurement_type}</span>
              <span className="capitalize">{goal.goal_type.replace("_", " ")}</span>
            </div>

            {/* Toggle buttons + current comment */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
                  className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex-shrink-0"
                >
                  {showHistory ? "Hide history" : "Show status history"}
                </button>
                {goal.data_points.length > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDataPoints(!showDataPoints); }}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex-shrink-0"
                  >
                    {showDataPoints ? "Hide data points" : `Goal data points (${goal.data_points.length})`}
                  </button>
                )}
              </div>
              {goal.events.length > 0 && goal.events[goal.events.length - 1].comment && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 italic bg-gray-100 rounded-full px-2.5 py-1 truncate max-w-xs">
                  <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {goal.events[goal.events.length - 1].comment}
                </span>
              )}
            </div>
            {showHistory && <EventTimeline goal={goal} />}
            {showDataPoints && <DataPointsPanel goal={goal} />}
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="mt-2 space-y-2">
          {goal.children.map((child) => (
            <GoalCard key={child.id} goal={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
