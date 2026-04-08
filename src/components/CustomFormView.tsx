"use client";

import { useState, useCallback } from "react";
import { PatientGoal, GoalStatus, MeasurementType, mockGoals, mockPatient } from "@/data/mockData";
import GoalEditorInline from "./GoalEditorInline";
import StatusBadge from "./StatusBadge";

// ── Mock AI for STG generation ──
interface StgAiSuggestion {
  goalText: string;
  measurementType: MeasurementType;
  baselineValue: string;
  targetValue: string;
}

function getMockStgSuggestion(roughText: string, parentGoal: PatientGoal): StgAiSuggestion {
  const lower = roughText.toLowerCase();
  const parentText = parentGoal.goal_text.toLowerCase();

  // Match based on parent context + rough input
  if (parentText.includes("/r/") || parentText.includes("articulation")) {
    if (lower.includes("initial") || lower.includes("beginning")) {
      return { goalText: "Patient will produce /r/ in initial position of words with 90% accuracy given minimal verbal cues across 3 consecutive sessions.", measurementType: "percentage", baselineValue: "35", targetValue: "90" };
    }
    if (lower.includes("final") || lower.includes("end")) {
      return { goalText: "Patient will produce /r/ in final position of words with 90% accuracy given minimal verbal cues across 3 consecutive sessions.", measurementType: "percentage", baselineValue: "30", targetValue: "90" };
    }
    if (lower.includes("blend") || lower.includes("cluster")) {
      return { goalText: "Patient will produce /r/ blends (e.g., br, cr, dr, fr, gr) at the word level with 80% accuracy given visual cues across 3 consecutive sessions.", measurementType: "percentage", baselineValue: "25", targetValue: "80" };
    }
    if (lower.includes("sentence") || lower.includes("conversation")) {
      return { goalText: "Patient will use correct /r/ production in structured sentences with 80% accuracy given minimal cueing across 3 consecutive sessions.", measurementType: "percentage", baselineValue: "20", targetValue: "80" };
    }
  }

  if (parentText.includes("expressive") || parentText.includes("language")) {
    if (lower.includes("question") || lower.includes("ask")) {
      return { goalText: "Patient will formulate grammatically correct wh-questions with 80% accuracy given visual supports across 3 consecutive sessions.", measurementType: "percentage", baselineValue: "25", targetValue: "80" };
    }
    if (lower.includes("verb") || lower.includes("tense")) {
      return { goalText: "Patient will use correct past tense verb forms in structured sentences with 80% accuracy given minimal cueing across 3 consecutive sessions.", measurementType: "percentage", baselineValue: "30", targetValue: "80" };
    }
  }

  if (parentText.includes("balance") || parentText.includes("mobility")) {
    if (lower.includes("beam") || lower.includes("walk")) {
      return { goalText: "Patient will walk across a 4-inch balance beam for 6 feet with minimal assist in 3 out of 4 trials.", measurementType: "percentage", baselineValue: "25", targetValue: "75" };
    }
    if (lower.includes("hop") || lower.includes("jump")) {
      return { goalText: "Patient will perform 5 consecutive single-leg hops bilaterally maintaining balance without upper extremity support.", measurementType: "count", baselineValue: "1", targetValue: "5" };
    }
  }

  if (parentText.includes("coordination") || parentText.includes("self-care") || parentText.includes("dressing")) {
    if (lower.includes("button")) {
      return { goalText: "Patient will button and unbutton 4 buttons on a shirt within 2 minutes given verbal cues only across 3 consecutive sessions.", measurementType: "duration", baselineValue: "300", targetValue: "120" };
    }
    if (lower.includes("zip") || lower.includes("zipper")) {
      return { goalText: "Patient will independently zip and unzip a jacket zipper with minimal verbal cueing across 3 consecutive sessions.", measurementType: "scale", baselineValue: "maximal_assist", targetValue: "minimal_assist" };
    }
  }

  // Generic fallback based on parent measurement type
  return {
    goalText: `Patient will ${roughText.toLowerCase().replace(/^patient will\s*/i, "")} with 80% accuracy given minimal cueing across 3 consecutive sessions.`,
    measurementType: parentGoal.measurement_type,
    baselineValue: parentGoal.baseline_value || "30",
    targetValue: parentGoal.target_value || "80",
  };
}

// ── STG inline mini-editor ──
function StgEditor({ parentGoal, onSave, onCancel }: { parentGoal: PatientGoal; onSave: (goal: PatientGoal) => void; onCancel: () => void }) {
  const [goalText, setGoalText] = useState("");
  const [measurementType, setMeasurementType] = useState<MeasurementType>(parentGoal.measurement_type);
  const [baselineValue, setBaselineValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [aiState, setAiState] = useState<"idle" | "loading" | "suggestion">("idle");
  const [suggestion, setSuggestion] = useState<StgAiSuggestion | null>(null);

  const handleImprove = useCallback(() => {
    if (!goalText.trim()) return;
    setAiState("loading");
    setTimeout(() => {
      setSuggestion(getMockStgSuggestion(goalText, parentGoal));
      setAiState("suggestion");
    }, 1200);
  }, [goalText, parentGoal]);

  function acceptSuggestion() {
    if (!suggestion) return;
    setGoalText(suggestion.goalText);
    setMeasurementType(suggestion.measurementType);
    setBaselineValue(suggestion.baselineValue);
    setTargetValue(suggestion.targetValue);
    setSuggestion(null);
    setAiState("idle");
  }

  function handleSave() {
    if (!goalText.trim()) return;
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    onSave({
      id: `pg-stg-${Date.now()}`,
      goal_type: "short_term",
      parent_id: parentGoal.id,
      goal_text: goalText,
      measurement_type: measurementType,
      baseline_value: baselineValue || null,
      target_value: targetValue || null,
      measurement_config: parentGoal.measurement_config,
      version_a: parentGoal.version_a,
      version_b: 1,
      version_c: 0,
      start_date: today,
      target_date: null,
      met_on: null,
      discipline: parentGoal.discipline,
      current_status: "pending",
      events: [{ id: `ev-stg-${Date.now()}`, status: "pending", occurred_on: today, comment: "STG created under LTG", user_name: "Sam Therapist", created_at: now }],
      data_points: [],
      children: [],
    });
  }

  return (
    <div className="ml-6 border-l-2 border-indigo-200 pl-4 mt-2">
      <div className="border border-indigo-200 rounded-lg bg-white p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-600">New Short Term Goal</span>
          <div className="flex items-center gap-2">
            {aiState === "idle" && goalText.trim().length > 5 && (
              <button onClick={handleImprove} className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Improve with AI
              </button>
            )}
            {aiState === "loading" && (
              <span className="inline-flex items-center gap-1 text-xs text-violet-500">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                Generating...
              </span>
            )}
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <textarea value={goalText} onChange={(e) => { setGoalText(e.target.value); if (aiState === "suggestion") { setSuggestion(null); setAiState("idle"); } }} rows={2} placeholder="Type rough notes... e.g. 'work on /r/ in initial position' or 'buttoning practice'" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />

        {/* AI suggestion */}
        {aiState === "suggestion" && suggestion && (
          <div className="border border-violet-200 rounded-lg bg-violet-50/50 px-3 py-2.5 space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className="text-xs font-medium text-violet-700">AI Suggestion</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 line-through">{goalText}</p>
              <p className="text-xs text-gray-800">{suggestion.goalText}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">{suggestion.measurementType}</span>
              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">Baseline: {suggestion.baselineValue}</span>
              <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">Target: {suggestion.targetValue}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={acceptSuggestion} className="px-2.5 py-1 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700">Accept</button>
              <button onClick={() => { setGoalText(suggestion.goalText); setSuggestion(null); setAiState("idle"); }} className="px-2.5 py-1 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-100">Use text only</button>
              <button onClick={() => { setSuggestion(null); setAiState("idle"); }} className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700">Dismiss</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Type</label>
            <select value={measurementType} onChange={(e) => setMeasurementType(e.target.value as MeasurementType)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {["percentage", "count", "duration", "scale", "binary", "custom"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Baseline</label>
            <input value={baselineValue} onChange={(e) => setBaselineValue(e.target.value)} placeholder="e.g. 30" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Target</label>
            <input value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="e.g. 90" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={handleSave} disabled={!goalText.trim()} className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Add STG</button>
        </div>
      </div>
    </div>
  );
}

// ── Status action (continue / met / discontinue) ──
function StatusActionRow({ goal, onStatusChange }: { goal: PatientGoal; onStatusChange: (id: string, status: GoalStatus, comment: string) => void }) {
  const [action, setAction] = useState<"continued" | "met" | "discontinued" | null>(null);
  const [comment, setComment] = useState("");

  if (goal.current_status !== "active") return null;

  function handleSubmit() {
    if (!action || !comment.trim()) return;
    const statusMap: Record<string, GoalStatus> = { continued: "active", met: "met", discontinued: "discontinued" };
    onStatusChange(goal.id, statusMap[action], comment);
    setAction(null);
    setComment("");
  }

  const actionConfig = {
    continued: { label: "Continuing Goal", placeholder: "Progress update for this goal...", btnLabel: "Save Update", btnClass: "bg-indigo-600 hover:bg-indigo-700", color: "text-indigo-600", borderColor: "border-indigo-200" },
    met: { label: "Marking as Met", placeholder: "How was this goal met? (e.g. achieved 92% across 3 sessions)", btnLabel: "Confirm Met", btnClass: "bg-green-600 hover:bg-green-700", color: "text-green-600", borderColor: "border-green-200" },
    discontinued: { label: "Discontinuing Goal", placeholder: "Reason for discontinuing (e.g. reassessing approach, patient not responding to current strategy)", btnLabel: "Confirm Discontinue", btnClass: "bg-red-600 hover:bg-red-700", color: "text-red-600", borderColor: "border-red-200" },
  };

  if (!action) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <button onClick={() => setAction("continued")} className="px-2.5 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
          Continue
        </button>
        <button onClick={() => setAction("met")} className="px-2.5 py-1 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
          Mark Met
        </button>
        <button onClick={() => setAction("discontinued")} className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          Discontinue
        </button>
      </div>
    );
  }

  const cfg = actionConfig[action];

  return (
    <div className={`mt-2 border ${cfg.borderColor} rounded-lg p-3 bg-gray-50 space-y-2`}>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder={cfg.placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      <div className="flex justify-end gap-2">
        <button onClick={() => { setAction(null); setComment(""); }} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className={`px-3 py-1 text-xs font-medium text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${cfg.btnClass}`}
        >
          {cfg.btnLabel}
        </button>
      </div>
    </div>
  );
}

// ── Active goal card (locked, with synopsis) ──
function ActiveGoalCard({
  goal,
  childGoals,
  onStatusChange,
  onAddStg,
  onEdit,
  onDelete,
}: {
  goal: PatientGoal;
  childGoals: PatientGoal[];
  onStatusChange: (id: string, status: GoalStatus, comment: string) => void;
  onAddStg: (parentId: string) => void;
  onEdit: (goal: PatientGoal) => void;
  onDelete: (id: string) => void;
}) {
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  const latestEvent = goal.events[goal.events.length - 1];
  const latestDataPoint = goal.data_points[goal.data_points.length - 1];
  const isTopLevel = goal.goal_type !== "short_term";

  // Build synopsis
  let synopsis = "";
  if (goal.measurement_type === "percentage" && goal.baseline_value && goal.target_value) {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    synopsis = `${current}% of ${goal.target_value}% target`;
  } else if (goal.measurement_type === "scale") {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    synopsis = `${(current || "").replace(/_/g, " ")} → ${(goal.target_value || "").replace(/_/g, " ")}`;
  } else if (goal.measurement_type === "count" && goal.baseline_value && goal.target_value) {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    const unit = (goal.measurement_config.unit as string) || "";
    synopsis = `${current}/${goal.target_value} ${unit}`;
  } else if (goal.measurement_type === "duration" && goal.baseline_value && goal.target_value) {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    const unit = (goal.measurement_config.unit as string) || "seconds";
    synopsis = `${current}s of ${goal.target_value} ${unit} target`;
  } else if (goal.measurement_type === "binary") {
    const current = latestDataPoint ? latestDataPoint.value : "false";
    synopsis = current === "true" ? "Achieved" : "Not yet achieved";
  } else if (goal.measurement_type === "custom" && goal.baseline_value && goal.target_value) {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    const unit = (goal.measurement_config.unit as string) || "";
    synopsis = `${current} of ${goal.target_value} ${unit}`;
  }

  return (
    <div className={`${goal.goal_type === "short_term" ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}>
      <div className="border border-gray-200 rounded-lg bg-white px-4 py-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
            </span>
            <StatusBadge status={goal.current_status} />
            <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
            {synopsis && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs font-medium text-gray-600">{synopsis}</span>
              </>
            )}
          </div>
          {goal.current_status === "pending" ? (
            <div className="flex items-center gap-1.5">
              <button onClick={() => onEdit(goal)} className="text-gray-300 hover:text-indigo-500 transition-colors" title="Edit pending goal">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => onDelete(goal.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Delete pending goal">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-gray-300">Locked</span>
            </div>
          )}
        </div>

        {/* Goal text */}
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{goal.goal_text}</p>

        {/* Last comment */}
        {latestEvent?.comment && (
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="text-xs text-gray-400 italic">{latestEvent.comment}</span>
          </div>
        )}

        {/* Status actions */}
        <StatusActionRow goal={goal} onStatusChange={onStatusChange} />

        {/* Add STG button for top-level goals */}
        {isTopLevel && (
          <button
            onClick={() => onAddStg(goal.id)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Short Term Goal
          </button>
        )}
      </div>

      {/* Child STGs */}
      {childGoals.length > 0 && (
        <div className="mt-2 space-y-2">
          {childGoals.map((child) => (
            <ActiveGoalCard key={child.id} goal={child} childGoals={[]} onStatusChange={onStatusChange} onAddStg={onAddStg} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pending goal row (deletable + editable) ──
function PendingGoalRow({ goal, onDelete, onEdit }: { goal: PatientGoal; onDelete: (id: string) => void; onEdit: (goal: PatientGoal) => void }) {
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  return (
    <div className={`${goal.goal_type === "short_term" ? "ml-6 border-l-2 border-amber-200 pl-4" : ""}`}>
      <div className="flex items-center justify-between px-4 py-3 border border-amber-200 bg-amber-50/30 rounded-lg">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0">
            {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
          </span>
          <StatusBadge status="pending" />
          <span className="text-sm text-gray-700 truncate">{goal.goal_text}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
          <button onClick={() => onEdit(goal)} className="text-gray-300 hover:text-indigo-500 transition-colors" title="Edit pending goal">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(goal.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Delete pending goal">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main view ──
export default function CustomFormView() {
  const [goals, setGoals] = useState<PatientGoal[]>(() => {
    const flat: PatientGoal[] = [];
    for (const g of mockGoals) {
      flat.push(g);
      for (const c of g.children) {
        flat.push(c);
      }
    }
    return flat;
  });
  const [showNewLtg, setShowNewLtg] = useState(false);
  const [addingStgFor, setAddingStgFor] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<PatientGoal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const speechGoals = goals.filter((g) => g.discipline === "Speech" && g.current_status !== "met" && g.current_status !== "discontinued");
  const activeTopLevel = speechGoals.filter((g) => g.current_status === "active" && g.goal_type !== "short_term");
  const pendingTopLevel = speechGoals.filter((g) => g.current_status === "pending" && g.goal_type !== "short_term");

  function getChildren(parentId: string) {
    return speechGoals.filter((g) => g.parent_id === parentId);
  }

  function handleAddLtg(goal: PatientGoal) {
    setGoals([...goals, goal]);
    setShowNewLtg(false);
  }

  function handleEditSave(updatedGoal: PatientGoal) {
    setGoals(goals.map((g) => g.id === updatedGoal.id ? updatedGoal : g));
    setEditingGoal(null);
  }

  function handleAddStg(goal: PatientGoal) {
    setGoals([...goals, goal]);
    setAddingStgFor(null);
  }

  function handleStatusChange(id: string, status: GoalStatus, comment: string) {
    setGoals(goals.map((g) => {
      if (g.id !== id) return g;
      const now = new Date().toISOString();
      const today = now.slice(0, 10);
      return {
        ...g,
        current_status: status,
        met_on: status === "met" ? today : g.met_on,
        events: [...g.events, {
          id: `ev-action-${Date.now()}`,
          status,
          occurred_on: today,
          comment: comment || (status === "met" ? "Goal met" : "Goal continued"),
          user_name: "Sam Therapist",
          created_at: now,
        }],
      };
    }));
  }

  function handleDelete(id: string) {
    setDeleteConfirm(id);
  }

  function confirmDelete() {
    if (deleteConfirm) {
      setGoals(goals.filter((g) => g.id !== deleteConfirm));
      setDeleteConfirm(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Goals Editor</h2>
        <p className="text-sm text-gray-400">smart-goals-editor-v2 component preview</p>
      </div>

      {/* Document context banner */}
      <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 text-blue-700">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>
          Editing: <span className="font-medium">Plan of Care — Speech</span>
          <span className="text-blue-400 mx-2">|</span>
          <span className="text-blue-500">Draft — Not yet signed</span>
        </span>
      </div>

      {/* Active goals (locked) */}
      {activeTopLevel.length > 0 && (
        <div className="space-y-3 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Current Goals</h3>
          {activeTopLevel.map((goal) => (
            <div key={goal.id}>
              <ActiveGoalCard
                goal={goal}
                childGoals={getChildren(goal.id)}
                onStatusChange={handleStatusChange}
                onAddStg={(parentId) => setAddingStgFor(parentId)}
                onEdit={setEditingGoal}
                onDelete={handleDelete}
              />
              {addingStgFor === goal.id && (
                <StgEditor parentGoal={goal} onSave={handleAddStg} onCancel={() => setAddingStgFor(null)} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pending goals */}
      {pendingTopLevel.length > 0 && (
        <div className="space-y-2 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pending Goals</h3>
          {pendingTopLevel.map((goal) => (
            <div key={goal.id}>
              {editingGoal?.id === goal.id ? (
                <GoalEditorInline
                  disciplines={mockPatient.disciplines}
                  existingGoals={goals}
                  onSave={handleEditSave}
                  onCancel={() => setEditingGoal(null)}
                  editingGoal={editingGoal}
                />
              ) : (
                <PendingGoalRow goal={goal} onDelete={handleDelete} onEdit={setEditingGoal} />
              )}
              {getChildren(goal.id).map((child) => (
                editingGoal?.id === child.id ? (
                  <GoalEditorInline
                    key={child.id}
                    disciplines={mockPatient.disciplines}
                    existingGoals={goals}
                    onSave={handleEditSave}
                    onCancel={() => setEditingGoal(null)}
                    editingGoal={editingGoal}
                  />
                ) : (
                  <PendingGoalRow key={child.id} goal={child} onDelete={handleDelete} onEdit={setEditingGoal} />
                )
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Add new LTG button / inline editor */}
      <div className="mt-4">
        {!showNewLtg ? (
          <button
            onClick={() => setShowNewLtg(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-indigo-600 border-2 border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Goal
          </button>
        ) : (
          <GoalEditorInline
            disciplines={mockPatient.disciplines}
            existingGoals={goals}
            onSave={handleAddLtg}
            onCancel={() => setShowNewLtg(false)}
          />
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
        <span>{speechGoals.length} goals</span>
        <span>{speechGoals.filter((g) => g.current_status === "pending").length} pending</span>
        <span>{speechGoals.filter((g) => g.current_status === "active").length} active</span>
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; Custom Form Preview
        </span>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Goal</h3>
            <p className="text-sm text-gray-600 mb-1">Are you sure you want to delete this pending goal?</p>
            <p className="text-xs text-gray-400 mb-4">This action cannot be undone. Only pending goals can be deleted.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
