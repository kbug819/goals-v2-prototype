"use client";

import { useState } from "react";
import { PatientGoal } from "@/data/mockData";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";
import ScaleProgress from "./ScaleProgress";

function VersionLabel({ goal }: { goal: PatientGoal }) {
  const prefix =
    goal.goal_type === "long_term" ? "LTG" :
    goal.goal_type === "short_term" ? "STG" : "Goal";
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
  const hasChildren = goal.children.length > 0;
  const isChild = depth > 0;

  return (
    <div className={`${isChild ? "ml-6 border-l-2 border-indigo-100 pl-4" : ""}`}>
      <div
        className={`bg-white rounded-lg border transition-shadow ${
          goal.current_status === "met" ? "border-blue-200 bg-blue-50/30" :
          goal.current_status === "discontinued" ? "border-red-200 bg-red-50/30" :
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
                {goal.children.length} sub-goal{goal.children.length > 1 ? "s" : ""}
              </span>
            )}
            {goal.data_points.length > 0 && (
              <span className="text-xs text-gray-400">
                {goal.data_points.length} data pts
              </span>
            )}
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 space-y-3">
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

            {/* History toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
            >
              {showHistory ? "Hide history" : "Show status history"}
            </button>
            {showHistory && <EventTimeline goal={goal} />}
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
