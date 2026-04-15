"use client";

import React, { useState } from "react";
import DevNote from "@/components/shared/DevNote";
import ProgressReportDefaultView from "./ProgressReportDefaultView";
import { mockGoals, mockPatient, PatientGoal } from "@/data/mockData";
import { formatDate, formatDateShort } from "@/utils/formatDate";

function formatValue(value: string, goal: PatientGoal): string {
  const display = value.replace(/_/g, " ");
  switch (goal.measurement_type) {
    case "percentage": return `${display}%`;
    case "duration": return `${display} ${(goal.measurement_config.unit as string) || "seconds"}`;
    case "count": return `${display} ${(goal.measurement_config.unit as string) || ""}`;
    case "binary": return display === "true" ? "Achieved" : "Not achieved";
    default: return display;
  }
}

function ProgressChart({ goal }: { goal: PatientGoal }) {
  const points = goal.data_points;
  if (points.length < 2) return null;

  const isNumeric = ["percentage", "count", "duration", "custom"].includes(goal.measurement_type);
  if (!isNumeric) return null;

  const values = points.map((p) => parseFloat(p.value)).filter((v) => !isNaN(v));
  if (values.length < 2) return null;

  const chartW = 450;
  const chartH = 120;
  const padX = 40;
  const padRight = 70;
  const padY = 18;

  const allValues = [...values];
  if (goal.baseline_value) allValues.push(parseFloat(goal.baseline_value));
  if (goal.target_value) allValues.push(parseFloat(goal.target_value));
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;

  const toX = (i: number) => padX + (i / (values.length - 1)) * (chartW - padX - padRight);
  const toY = (v: number) => padY + (1 - (v - minVal) / range) * (chartH - padY * 2);

  const dotPositions = values.map((v, i) => ({ x: toX(i), y: toY(v), value: v, label: formatDateShort(points[i].recorded_at) }));
  const polyline = dotPositions.map((d) => `${d.x},${d.y}`).join(" ");
  const targetY = goal.target_value ? toY(parseFloat(goal.target_value)) : null;
  const baselineY = goal.baseline_value ? toY(parseFloat(goal.baseline_value)) : null;

  return (
    <div className="bg-gray-50 rounded-lg p-2 mt-2">
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-h-36" preserveAspectRatio="xMidYMid meet">
        {targetY !== null && (
          <>
            <line x1={padX} y1={targetY} x2={chartW - padRight} y2={targetY} stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" />
            <text x={chartW - padRight + 4} y={targetY + 3} fontSize="8" fill="#10b981">target</text>
          </>
        )}
        {baselineY !== null && (
          <>
            <line x1={padX} y1={baselineY} x2={chartW - padRight} y2={baselineY} stroke="#9ca3af" strokeWidth="1" strokeDasharray="4 3" />
            <text x={chartW - padRight + 4} y={baselineY + 3} fontSize="8" fill="#9ca3af">baseline</text>
          </>
        )}
        <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
        {dotPositions.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r="3" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
            <text x={d.x} y={d.y - 8} textAnchor="middle" fontSize="8" fill="#4b5563" fontWeight="600">{d.value}</text>
            <text x={d.x} y={chartH - 2} textAnchor="middle" fontSize="7" fill="#9ca3af">{d.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function GoalProgressSection({ goal, depth = 0 }: { goal: PatientGoal; depth?: number }) {
  const latestEvent = goal.events.length > 0 ? goal.events[goal.events.length - 1] : null;
  const functionalLevel = latestEvent?.current_functional_level || null;
  const latestDataPoint = goal.data_points[goal.data_points.length - 1];
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  const isChild = depth > 0;

  // Build progress summary
  let progressSummary: string = "";
  if (goal.baseline_value && goal.target_value && latestDataPoint) {
    progressSummary = `Baseline: ${formatValue(goal.baseline_value, goal)} → Current: ${formatValue(latestDataPoint.value, goal)} → Target: ${formatValue(goal.target_value, goal)}`;
  }

  // Progress percentage for bar
  let progressPct = 0;
  if (goal.measurement_type === "percentage" && goal.baseline_value && goal.target_value && latestDataPoint) {
    const base = parseFloat(goal.baseline_value);
    const target = parseFloat(goal.target_value);
    const current = parseFloat(latestDataPoint.value);
    progressPct = Math.round(((current - base) / (target - base)) * 100);
  }

  // Mock narrative based on goal
  const narratives: Record<string, string> = {
    "pg-1": "Patient has demonstrated steady improvement in /r/ production across word positions. Currently at 72% accuracy, up from 45% baseline. Responds well to visual cues and minimal verbal prompting. /r/ blends showing particular improvement. Recommend continuing current approach with increased focus on conversational carryover.",
    "pg-2": "Goal met on 04/01/2026. Patient achieved 92% accuracy for /r/ in initial position across 3 consecutive sessions with minimal verbal cues. Strong self-monitoring skills developed. Goal addressed through structured articulation drills and sentence-level practice.",
    "pg-3": "Patient progressing toward target. Currently at 68% accuracy for final /r/, up from 40% baseline. -er endings remain the most challenging context. Visual modeling strategies have been beneficial. Recommend continued targeted practice with emphasis on self-correction strategies.",
    "pg-4": "Patient has moved from maximal assist to moderate assist level for expressive language. Beginning to use sentence starters independently and formulating 3-4 word utterances with moderate cueing. Responds well to structured play-based activities. Recommend continuing with graduated reduction of supports.",
    "pg-5": "MLU has increased from 2.5 to 3.1 words. Patient using more descriptors and conjunctions in spontaneous speech. Progress is steady but gradual. Targeting 4.0 words per utterance. Recommend story retell activities and descriptive language tasks to support continued growth.",
  };

  return (
    <div className={`${isChild ? "ml-6 border-l-2 border-indigo-100 pl-4 mt-3" : ""}`}>
      <div className="border border-gray-200 rounded-lg bg-white">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
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
            {goal.met_on ? <span className="text-xs text-gray-400">Met {formatDate(goal.met_on)}</span> : null}
            <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
          </div>
          <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{goal.goal_text}</p>
        </div>

        <div className="px-4 py-3 space-y-3">
          {/* Functional level */}
          {functionalLevel ? (
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-600">Current function:</span> {functionalLevel}
            </div>
          ) : null}

          {/* Progress summary */}
          {progressSummary !== "" ? (
            <div className="text-xs text-gray-600">
              <span>{progressSummary}</span>
              {progressPct > 0 && goal.current_status === "active" ? (
                <span className="text-indigo-600 ml-1">({Math.min(progressPct, 100)}% to target)</span>
              ) : null}
            </div>
          ) : null}

          {/* Progress bar for percentage goals */}
          {goal.measurement_type === "percentage" && progressPct > 0 ? (
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, progressPct)}%` }} />
            </div>
          ) : null}

          {/* Scale progress */}
          {goal.measurement_type === "scale" && goal.measurement_config.levels && latestDataPoint ? (
            <div className="flex gap-1">
              {(goal.measurement_config.levels as string[]).map((level) => {
                const isCurrent = latestDataPoint.value === level;
                return (
                  <div key={level} className="flex-1 text-center">
                    <div className={`h-2.5 rounded ${isCurrent ? "bg-indigo-600" : "bg-gray-200"}`} />
                    <div className={`text-[9px] mt-0.5 ${isCurrent ? "font-bold text-indigo-700" : "text-gray-400"}`}>
                      {level.replace(/_/g, " ")}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Chart */}
          <ProgressChart goal={goal} />

          {/* Data points table */}
          {goal.data_points.length > 0 ? (
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-1">Session Data ({goal.data_points.length} sessions)</h4>
              <div className="space-y-0.5">
                {goal.data_points.map((dp, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs">
                    <span className="text-gray-400 w-24 flex-shrink-0">{formatDate(dp.recorded_at)}</span>
                    <span className="font-medium text-gray-700 w-28 flex-shrink-0">{dp.value.replace(/_/g, " ")}</span>
                    {dp.activity_name ? <span className="text-gray-400">{dp.activity_name}</span> : null}
                    {dp.note ? <span className="text-gray-400 italic">{dp.note}</span> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Narrative */}
          <div className="border-t border-gray-100 pt-3">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Progress Narrative</h4>
            <p className="text-sm text-gray-700 leading-relaxed italic">
              {(narratives as Record<string, string>)[goal.id] || "No narrative provided for this reporting period."}
            </p>
          </div>
        </div>
      </div>

      {/* Children */}
      {goal.children.filter((c) => c.current_status === "active" || c.current_status === "met").map((child) => (
        <GoalProgressSection key={child.id} goal={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function ProgressReportChartsView() {
  // Get Speech goals for the report
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
        <div className="flex items-center gap-2">
          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Signed 04/08/2026</span>
        </div>
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
              <span className="text-xs font-semibold text-gray-500">Sessions in Period</span>
              <p className="text-gray-700">10 sessions</p>
            </div>
          </div>
        </div>

        {/* Overall summary */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Summary</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Patient has made good overall progress during this reporting period across articulation and language goals. Articulation of /r/ in initial position has been met. Final position /r/ and expressive language goals continue to show steady improvement. MLU is increasing gradually with structured support. Recommend continuing current treatment plan with modifications noted per goal below.
          </p>
        </div>

        {/* Diagnosis */}
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-1.5">Diagnosis Codes</h3>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">F80.2 - Mixed receptive-expressive language disorder</span>
            <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">R48.8 - Other symbolic dysfunctions</span>
          </div>
        </div>

        {/* Goal Progress - the main section */}
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base font-semibold text-gray-900">Goal Progress</h3>
            <span className="text-xs text-gray-400">{speechGoals.length} goals in this report</span>
          </div>

          <div className="space-y-4">
            {speechGoals.map((goal) => (
              <GoalProgressSection key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Recommendations</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Continue current plan of care with the following modifications: increase focus on final position /r/ with emphasis on -er endings using visual modeling. Begin carryover activities for initial /r/ into conversational contexts. Continue expressive language work with graduated reduction of supports. Therapy frequency: 2x per week for 30-minute sessions.
          </p>
        </div>

        {/* Prognosis */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Prognosis</h3>
          <p className="text-sm text-gray-600">Good — Patient demonstrates consistent progress and strong motivation.</p>
        </div>

        {/* Signature */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Sam Therapist, CCC-SLP</p>
              <p className="text-xs text-gray-400">Signed electronically on 04/08/2026 at 4:30 PM CDT</p>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">Signed</span>
          </div>
        </div>
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; Progress Report Show Preview
        </span>
      </div>
    </div>
  );
}

const SHOW_FORMATS = [
  { value: "default", label: "Simple" },
  { value: "charts", label: "Full" },
  { value: "comparative", label: "Comparative" },
];

export default function ProgressReportShowView() {
  const [showFormat, setShowFormat] = useState("default");

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews progress report show views. 'Simple' shows narrative-per-goal layout (all data visualization options off). 'Full' shows everything turned on — measurement trajectory, charts, session data tables, and measurement-type-aware progress displays."
        todos={[]}
      />

      {/* Format selector */}
      <div className="flex items-center gap-1.5 mb-6">
        <span className="text-xs text-gray-400 mr-1">Showing:</span>
        {SHOW_FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => setShowFormat(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showFormat === f.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {showFormat === "default" && <ProgressReportDefaultView />}
      {showFormat === "charts" && <ProgressReportChartsView />}
      {showFormat === "comparative" && <ProgressReportComparativeView />}
    </div>
  );
}

// ── Comparative view — Previous vs Current period side-by-side ──
function ProgressReportComparativeView() {
  const speechGoals = mockGoals.filter(
    (g) => g.discipline === "Speech" && g.goal_type !== "short_term" && (g.current_status === "active" || g.current_status === "met")
  );

  // Mock previous period data (12/1/2025 - 2/28/2026)
  // Current period data comes from goal.data_points (3/1/2026 - 4/8/2026)
  const previousData: Record<string, { value: string; sessions: number }> = {
    "pg-1": { value: "52", sessions: 8 },   // percentage: was 52%, now 72% → +20%
    "pg-2": { value: "75", sessions: 6 },   // percentage (met STG): was 75%, ended at 92%
    "pg-3": { value: "48", sessions: 7 },   // percentage: was 48%, now 68% → +20%
    "pg-4": { value: "maximal_assist", sessions: 6 }, // scale: was maximal_assist, now moderate_assist → improved 2 levels
    "pg-5": { value: "2.8", sessions: 5 },  // custom (MLU): was 2.8, now 3.1 → +0.3
  };

  return (
    <div>
      {/* Report header */}
      <div className="bg-slate-700 text-white rounded-t-lg px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium">Comparative Progress Report - {mockPatient.name}</span>
        </div>
        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Signed 4/8/2026</span>
      </div>

      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg">
        {/* Patient info */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Comparative Speech Therapy Progress Report</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-xs font-semibold text-gray-500">Patient</span><p className="text-gray-700">{mockPatient.name}</p></div>
            <div><span className="text-xs font-semibold text-gray-500">DOB</span><p className="text-gray-700">6/15/2019</p></div>
            <div><span className="text-xs font-semibold text-gray-500">Therapist</span><p className="text-gray-700">Sam Therapist</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <span className="text-xs font-semibold text-gray-500">Previous Period</span>
              <p className="text-sm text-gray-700">12/1/2025 - 2/28/2026</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
              <span className="text-xs font-semibold text-indigo-600">Current Period</span>
              <p className="text-sm text-gray-700">3/1/2026 - 4/8/2026</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Summary</h3>
          <p className="text-sm text-gray-600 leading-relaxed">Patient has made good overall progress compared to the previous reporting period. Articulation accuracy improved from 52% to 72%. Expressive language moved from maximal to moderate assist. MLU increased from 2.8 to 3.1.</p>
        </div>

        {/* Comparative goal cards */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Goal Progress — Comparative</h3>
          <div className="space-y-4">
            {speechGoals.map((goal) => {
              const goalLabel = goal.goal_type === "short_term" ? "Short Term Goal" : "Long Term Goal";
              const latestDp = goal.data_points[goal.data_points.length - 1];
              const prev = previousData[goal.id];
              const currentVal = latestDp ? latestDp.value : null;

              const fmtVal = (v: string) => {
                const d = v.replace(/_/g, " ");
                if (goal.measurement_type === "percentage") return `${d}%`;
                if (goal.measurement_type === "duration") return `${d} ${(goal.measurement_config.unit as string) || "sec"}`;
                if (goal.measurement_type === "count") return `${d} ${(goal.measurement_config.unit as string) || ""}`;
                return d;
              };

              // Calculate change based on measurement type
              let changeText = "";
              let changeColor = "text-gray-500";
              if (prev && currentVal) {
                if (goal.measurement_type === "percentage" || goal.measurement_type === "count" || goal.measurement_type === "duration") {
                  const diff = parseFloat(currentVal) - parseFloat(prev.value);
                  const unit = goal.measurement_type === "percentage" ? "%" : goal.measurement_type === "count" ? ` ${(goal.measurement_config.unit as string) || ""}` : "s";
                  changeText = diff > 0 ? `+${diff}${unit}` : `${diff}${unit}`;
                  changeColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500";
                } else if (goal.measurement_type === "custom") {
                  const diff = parseFloat(currentVal) - parseFloat(prev.value);
                  const unit = (goal.measurement_config.unit as string) || "";
                  changeText = diff > 0 ? `+${diff.toFixed(1)} ${unit}` : `${diff.toFixed(1)} ${unit}`;
                  changeColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500";
                } else if (goal.measurement_type === "scale" && goal.measurement_config.levels) {
                  const levels = goal.measurement_config.levels as string[];
                  const prevIdx = levels.indexOf(prev.value);
                  const curIdx = levels.indexOf(currentVal);
                  if (prevIdx >= 0 && curIdx >= 0) {
                    const diff = curIdx - prevIdx;
                    changeText = diff > 0 ? `+${diff} level${diff > 1 ? "s" : ""}` : diff < 0 ? `${diff} level${diff < -1 ? "s" : ""}` : "No change";
                    changeColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500";
                  }
                } else if (goal.measurement_type === "binary") {
                  if (prev.value === "false" && currentVal === "true") { changeText = "Achieved"; changeColor = "text-green-600"; }
                  else if (prev.value === "true" && currentVal === "false") { changeText = "Regressed"; changeColor = "text-red-600"; }
                  else { changeText = "No change"; }
                }
              }

              return (
                <div key={goal.id}>
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-100/70">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-indigo-900">{goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}</span>
                        <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {changeText && <span className={`text-sm font-bold ${changeColor}`}>{changeText}</span>}
                        <span className="text-sm font-medium text-gray-700">{goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50/60 px-4 py-3 space-y-3">
                      <p className="text-sm text-gray-700">{goal.goal_text}</p>

                      {/* Comparative columns */}
                      {goal.baseline_value && goal.target_value && (
                        <div className="grid grid-cols-5 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Baseline</label>
                            <div className="border border-gray-200 rounded px-2 py-1.5 bg-white text-sm text-gray-600">{fmtVal(goal.baseline_value)}</div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Previous</label>
                            <div className="border border-gray-300 rounded px-2 py-1.5 bg-gray-100 text-sm text-gray-500">{prev ? fmtVal(prev.value) : "—"}</div>
                            {prev && <span className="text-[10px] text-gray-400">{prev.sessions} sessions</span>}
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-indigo-600 mb-0.5">Current</label>
                            <div className="border border-indigo-200 rounded px-2 py-1.5 bg-indigo-50 text-sm font-semibold text-indigo-700">{currentVal ? fmtVal(currentVal) : "—"}</div>
                            {latestDp && <span className="text-[10px] text-gray-400">{goal.data_points.length} sessions</span>}
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Change</label>
                            <div className={`border rounded px-2 py-1.5 text-sm font-bold ${
                              changeColor === "text-green-600" ? "border-green-200 bg-green-50 text-green-700" :
                              changeColor === "text-red-600" ? "border-red-200 bg-red-50 text-red-700" :
                              "border-gray-200 bg-white text-gray-500"
                            }`}>{changeText || "—"}</div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-0.5">Target</label>
                            <div className="border border-gray-200 rounded px-2 py-1.5 bg-white text-sm text-gray-600">{fmtVal(goal.target_value)}</div>
                          </div>
                        </div>
                      )}

                      {/* Comparative chart */}
                      {(() => {
                        if (!prev || !currentVal || !["percentage", "custom", "count", "duration"].includes(goal.measurement_type)) return null;
                        // Build mock data points for both periods
                        const baseVal = parseFloat(goal.baseline_value || "0");
                        const prevVal = parseFloat(prev.value);
                        const curVal = parseFloat(currentVal);
                        const targetVal = parseFloat(goal.target_value || "100");

                        // Previous period points (simulated progression)
                        const prevPoints = [
                          { label: "12/1", value: baseVal + (prevVal - baseVal) * 0.2 },
                          { label: "12/15", value: baseVal + (prevVal - baseVal) * 0.4 },
                          { label: "1/5", value: baseVal + (prevVal - baseVal) * 0.6 },
                          { label: "1/20", value: baseVal + (prevVal - baseVal) * 0.8 },
                          { label: "2/10", value: prevVal },
                        ];
                        // Current period points (from mock data or simulated)
                        const curPoints = goal.data_points.length >= 2
                          ? goal.data_points.map((dp) => ({ label: formatDateShort(dp.recorded_at), value: parseFloat(dp.value) }))
                          : [
                              { label: "3/5", value: prevVal + (curVal - prevVal) * 0.3 },
                              { label: "3/19", value: prevVal + (curVal - prevVal) * 0.6 },
                              { label: "4/2", value: curVal },
                            ];
                        const allPoints = [...prevPoints, ...curPoints];
                        const allVals = [...allPoints.map((p) => p.value), baseVal, targetVal];
                        const minV = Math.min(...allVals);
                        const maxV = Math.max(...allVals);
                        const range = maxV - minV || 1;

                        const chartW = 500;
                        const chartH = 100;
                        const padX = 35;
                        const padY = 15;
                        const toX = (i: number) => padX + (i / (allPoints.length - 1)) * (chartW - padX * 2);
                        const toY = (v: number) => padY + (1 - (v - minV) / range) * (chartH - padY * 2);

                        const prevDots = prevPoints.map((p, i) => ({ x: toX(i), y: toY(p.value), ...p }));
                        const curDots = curPoints.map((p, i) => ({ x: toX(prevPoints.length + i), y: toY(p.value), ...p }));
                        const dividerX = (prevDots[prevDots.length - 1].x + curDots[0].x) / 2;
                        const targetY = toY(targetVal);
                        const baselineY = toY(baseVal);

                        return (
                          <div className="bg-white rounded-lg p-2 border border-gray-200">
                            <div className="flex items-center gap-4 mb-1 px-2">
                              <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-gray-400 rounded" /><span className="text-[10px] text-gray-400">Previous period</span></div>
                              <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-indigo-500 rounded" /><span className="text-[10px] text-indigo-500">Current period</span></div>
                            </div>
                            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                              {/* Period background shading */}
                              <rect x={padX} y={padY} width={dividerX - padX} height={chartH - padY * 2} fill="#f9fafb" />
                              <rect x={dividerX} y={padY} width={chartW - padX - dividerX} height={chartH - padY * 2} fill="#eef2ff" opacity="0.5" />
                              {/* Divider */}
                              <line x1={dividerX} y1={padY} x2={dividerX} y2={chartH - padY} stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                              {/* Target line */}
                              <line x1={padX} y1={targetY} x2={chartW - padX} y2={targetY} stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" />
                              <text x={chartW - padX + 3} y={targetY + 3} fontSize="8" fill="#10b981">target</text>
                              {/* Baseline line */}
                              <line x1={padX} y1={baselineY} x2={chartW - padX} y2={baselineY} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 3" />
                              <text x={chartW - padX + 3} y={baselineY + 3} fontSize="8" fill="#9ca3af">baseline</text>
                              {/* Previous period line */}
                              <polyline points={prevDots.map((d) => `${d.x},${d.y}`).join(" ")} fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round" />
                              {/* Current period line */}
                              <polyline points={curDots.map((d) => `${d.x},${d.y}`).join(" ")} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
                              {/* Connecting line between periods */}
                              <line x1={prevDots[prevDots.length - 1].x} y1={prevDots[prevDots.length - 1].y} x2={curDots[0].x} y2={curDots[0].y} stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="3 3" />
                              {/* Previous dots */}
                              {prevDots.map((d, i) => (
                                <g key={`p${i}`}>
                                  <circle cx={d.x} cy={d.y} r="3" fill="#9ca3af" stroke="#fff" strokeWidth="1.5" />
                                  <text x={d.x} y={chartH - 3} textAnchor="middle" fontSize="7" fill="#9ca3af">{d.label}</text>
                                </g>
                              ))}
                              {/* Current dots */}
                              {curDots.map((d, i) => (
                                <g key={`c${i}`}>
                                  <circle cx={d.x} cy={d.y} r="3.5" fill="#6366f1" stroke="#fff" strokeWidth="1.5" />
                                  <text x={d.x} y={d.y - 8} textAnchor="middle" fontSize="8" fill="#4b5563" fontWeight="600">{Math.round(d.value)}</text>
                                  <text x={d.x} y={chartH - 3} textAnchor="middle" fontSize="7" fill="#6366f1">{d.label}</text>
                                </g>
                              ))}
                            </svg>
                          </div>
                        );
                      })()}

                      {/* Scale comparison (for scale measurement types) */}
                      {(() => {
                        if (!prev || !currentVal || goal.measurement_type !== "scale" || !goal.measurement_config.levels) return null;
                        const levels = goal.measurement_config.levels as string[];
                        const prevIdx = levels.indexOf(prev.value);
                        const curIdx = levels.indexOf(currentVal);
                        return (
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border-2 border-gray-400 bg-gray-100" /><span className="text-[10px] text-gray-400">Previous</span></div>
                              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border-2 border-indigo-500 bg-indigo-100" /><span className="text-[10px] text-indigo-500">Current</span></div>
                            </div>
                            <div className="flex gap-1">
                              {levels.map((level, i) => {
                                const isPrev = i === prevIdx;
                                const isCur = i === curIdx;
                                const isBetween = i > prevIdx && i <= curIdx;
                                return (
                                  <div key={level} className="flex-1 text-center">
                                    <div className={`h-3 rounded ${
                                      isCur ? "bg-indigo-600" :
                                      isPrev ? "bg-gray-400" :
                                      isBetween ? "bg-indigo-200" :
                                      "bg-gray-200"
                                    }`} />
                                    <div className={`text-[9px] mt-1 leading-tight ${
                                      isCur ? "font-bold text-indigo-700" :
                                      isPrev ? "font-bold text-gray-600" :
                                      "text-gray-400"
                                    }`}>
                                      {level.replace(/_/g, " ")}
                                    </div>
                                    {isPrev && <div className="text-[8px] text-gray-400 mt-0.5">prev</div>}
                                    {isCur && <div className="text-[8px] text-indigo-500 mt-0.5">current</div>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Data points table */}
                      {goal.data_points.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded px-2.5 py-2">
                          <span className="text-[11px] font-semibold text-gray-500 block mb-1">Session Data ({goal.data_points.length} sessions in current period)</span>
                          <div className="space-y-0.5">
                            {goal.data_points.map((dp, i) => (
                              <div key={i} className="flex items-center gap-3 text-xs">
                                <span className="text-gray-400 w-20 flex-shrink-0">{formatDate(dp.recorded_at)}</span>
                                <span className="font-medium text-gray-700 w-24 flex-shrink-0">{formatValue(dp.value, goal)}</span>
                                {dp.activity_name && <span className="text-gray-400">{dp.activity_name}</span>}
                                {dp.note && <span className="text-gray-400 italic">{dp.note}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Narrative */}
                      <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                        <span className="text-[11px] font-semibold text-gray-500 block">Progress Narrative</span>
                        <span className="text-sm text-gray-600 italic">
                          {goal.id === "pg-1" ? "Improved from 52% to 72% — strong response to visual cues and self-monitoring strategies." :
                           goal.id === "pg-4" ? "Moved from maximal to moderate assist. Beginning to use sentence starters independently." :
                           goal.id === "pg-5" ? "MLU increased from 2.8 to 3.1. Using more descriptors in spontaneous speech." :
                           "Progressing steadily toward target."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Children */}
                  {goal.children.filter((c) => c.current_status === "active" || c.current_status === "met").map((child) => {
                    const childPrev = previousData[child.id];
                    const childDp = child.data_points[child.data_points.length - 1];
                    let childChange = "";
                    let childChangeColor = "text-gray-500";
                    if (childPrev && childDp && child.measurement_type === "percentage") {
                      const diff = parseInt(childDp.value) - parseInt(childPrev.value);
                      childChange = diff > 0 ? `+${diff}%` : `${diff}%`;
                      childChangeColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500";
                    }
                    return (
                      <div key={child.id} className="ml-8 mt-2">
                        <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>
                        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between px-4 py-2 bg-indigo-100/70">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-indigo-900">{child.version_a}.{child.version_b}.{child.version_c} Short Term Goal</span>
                              <span className="text-xs font-medium text-gray-500 capitalize">{child.measurement_type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {childChange && <span className={`text-sm font-bold ${childChangeColor}`}>{childChange}</span>}
                              <span className="text-xs font-medium text-gray-600">{child.current_status.charAt(0).toUpperCase() + child.current_status.slice(1)}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50/60 px-4 py-3">
                            <p className="text-sm text-gray-600">{child.goal_text}</p>
                            {child.baseline_value && child.target_value && (
                              <div className="grid grid-cols-5 gap-2 mt-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Baseline</label>
                                  <div className="border border-gray-200 rounded px-1.5 py-1 bg-white text-xs text-gray-600">{formatValue(child.baseline_value, child)}</div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Previous</label>
                                  <div className="border border-gray-300 rounded px-1.5 py-1 bg-gray-100 text-xs text-gray-500">{childPrev ? formatValue(childPrev.value, child) : "—"}</div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-indigo-600 mb-0.5">Current</label>
                                  <div className="border border-indigo-200 rounded px-1.5 py-1 bg-indigo-50 text-xs font-semibold text-indigo-700">{childDp ? formatValue(childDp.value, child) : "—"}</div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Change</label>
                                  <div className={`border rounded px-1.5 py-1 text-xs font-bold ${
                                    childChangeColor === "text-green-600" ? "border-green-200 bg-green-50 text-green-700" :
                                    childChangeColor === "text-red-600" ? "border-red-200 bg-red-50 text-red-700" :
                                    "border-gray-200 bg-white text-gray-500"
                                  }`}>{childChange || "—"}</div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-500 mb-0.5">Target</label>
                                  <div className="border border-gray-200 rounded px-1.5 py-1 bg-white text-xs text-gray-600">{formatValue(child.target_value, child)}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Signature */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Sam Therapist, CCC-SLP</p>
              <p className="text-xs text-gray-400">Signed electronically on 4/8/2026 at 4:30 PM CDT</p>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">Signed</span>
          </div>
        </div>
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype — Progress Report Comparative Show
        </span>
      </div>
    </div>
  );
}
