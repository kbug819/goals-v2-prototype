"use client";

import { useState } from "react";
import { mockGoals, PatientGoal } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import DevNote from "@/components/shared/DevNote";
import { formatDate } from "@/utils/formatDate";

// ── Format value with unit based on measurement type ──
function formatValue(value: string, goal: PatientGoal): string {
  const display = value.replace(/_/g, " ");
  switch (goal.measurement_type) {
    case "percentage": return `${display}%`;
    case "duration": {
      const unit = (goal.measurement_config.unit as string) || "seconds";
      return `${display} ${unit}`;
    }
    case "count": {
      const unit = (goal.measurement_config.unit as string) || "";
      const per = (goal.measurement_config.per as string) || "";
      return `${display} ${unit}${per ? ` per ${per}` : ""}`;
    }
    case "custom": {
      const unit = (goal.measurement_config.unit as string) || "";
      const label = (goal.measurement_config.label as string) || "";
      return `${display} ${unit}${label ? ` (${label})` : ""}`;
    }
    case "binary": return display === "true" ? "Met" : "Not met";
    case "scale": return display;
    default: return display;
  }
}

// ── Goal update modal ──
function GoalUpdateModal({ goal, onSave, onClose, initialComment, initialDataValue, initialActivityName }: {
  goal: PatientGoal;
  onSave: (goalId: string, comment: string, dataValue: string, activityName: string) => void;
  onClose: () => void;
  initialComment?: string;
  initialDataValue?: string;
  initialActivityName?: string;
}) {
  const [comment, setComment] = useState(initialComment || "");
  const [dataValue, setDataValue] = useState(initialDataValue || "");
  const [activityName, setActivityName] = useState(initialActivityName || "");

  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  const latestDataPoint = goal.data_points[goal.data_points.length - 1];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
            </span>
            <span className="text-sm font-medium text-gray-700">Goal Progress</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Goal text */}
          <p className="text-sm text-gray-600 leading-relaxed">{goal.goal_text}</p>

          {/* Current progress */}
          {latestDataPoint && (
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <span>Last recorded:</span>
                <span className="font-medium text-gray-700">{formatValue(latestDataPoint.value, goal)}</span>
                <span>on {formatDate(latestDataPoint.recorded_at)}</span>
              </div>
              {goal.baseline_value && goal.target_value && (
                <div className="flex items-center gap-2">
                  <span>Baseline: {formatValue(goal.baseline_value, goal)}</span>
                  <span className="text-gray-400">&rarr;</span>
                  <span>Target: {formatValue(goal.target_value, goal)}</span>
                </div>
              )}
            </div>
          )}

          {/* Data point value */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Today&apos;s measurement
              <span className="text-gray-400 ml-1 font-normal">({goal.measurement_type})</span>
            </label>
            {goal.measurement_type === "scale" && goal.measurement_config.levels ? (
              <select
                value={dataValue}
                onChange={(e) => setDataValue(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select level...</option>
                {(goal.measurement_config.levels as string[]).map((l) => (
                  <option key={l} value={l}>{l.replace(/_/g, " ")}</option>
                ))}
              </select>
            ) : goal.measurement_type === "binary" ? (
              <div className="flex gap-2">
                {["false", "true"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setDataValue(v)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      dataValue === v
                        ? v === "true" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-300 bg-gray-50 text-gray-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {v === "true" ? "Met" : "Not met"}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={dataValue}
                onChange={(e) => setDataValue(e.target.value)}
                placeholder={
                  goal.measurement_type === "percentage" ? "e.g. 75" :
                  goal.measurement_type === "count" ? "e.g. 8" :
                  goal.measurement_type === "duration" ? "e.g. 120" :
                  "Value"
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Activity name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Activity
              <span className="text-gray-400 ml-1 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="e.g. Articulation drills, Balance beam walk, Story retell"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Session note
              <span className="text-gray-400 ml-1 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="Clinical observations from this session..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          <button
            onClick={() => { onSave(goal.id, comment, dataValue, activityName); onClose(); }}
            disabled={!dataValue.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Info row helper ──
function InfoRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 border-b border-gray-200">{children}</div>;
}

function InfoCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5">
      <div className="text-xs font-semibold text-gray-800 mb-0.5">{label}</div>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );
}

// ── Mock AI analysis of SOAP note ──
interface AiGoalSuggestion {
  goalId: string;
  suggestedValue: string;
  suggestedComment: string;
  suggestedActivity: string;
  confidence: "high" | "medium" | "low";
  reasoning: string;
}

function getMockAiAnalysis(goals: PatientGoal[]): AiGoalSuggestion[] {
  // Simulates AI reading the note and matching observations to goals
  const suggestions: AiGoalSuggestion[] = [];

  for (const g of goals) {
    if (g.id === "sp-1") {
      suggestions.push({
        goalId: g.id,
        suggestedValue: "72",
        suggestedComment: "72% accuracy for /r/ across all positions, up from 68%. Visual modeling and self-monitoring strategies beneficial.",
        suggestedActivity: "Articulation drills",
        confidence: "high",
        reasoning: "Assessment section states '72% accuracy for /r/ across all positions, up from 68% last session'",
      });
    } else if (g.id === "sp-1-2") {
      suggestions.push({
        goalId: g.id,
        suggestedValue: "65",
        suggestedComment: "Final position /r/ still challenging, particularly -er endings. Responds to visual modeling.",
        suggestedActivity: "Word-level drills",
        confidence: "medium",
        reasoning: "Assessment mentions 'Final position remains challenging, particularly with -er endings' — estimated from overall 72% with initial at 85%",
      });
    } else if (g.id === "sp-3") {
      suggestions.push({
        goalId: g.id,
        suggestedValue: "3.2",
        suggestedComment: "Using more descriptors and structured sentences during drills.",
        suggestedActivity: "Structured sentences",
        confidence: "low",
        reasoning: "Objective mentions 'structured sentences' work — MLU not directly measured this session but activity suggests incremental progress",
      });
    }
  }

  return suggestions;
}

// ── Main view ──
type ShowFormat = "soap" | "freetext" | "dap" | "freetext_goallist" | "freetext_goalprogress" | "freetext_goaladmin" | "freetext_goalcustom" | "freetext_v2goaladmin" | "freetext_v2goalcustom";

// ── Goal Progress show card (read-only, with trajectory) ──
function GoalDataShowCard({ goal }: { goal: PatientGoal }) {
  const goalLabel = goal.goal_type === "short_term" ? "Short Term Goal" : "Long Term Goal";
  const latestDp = goal.data_points.length > 0 ? goal.data_points[goal.data_points.length - 1] : null;
  const latestEvent = goal.events.length > 0 ? goal.events[goal.events.length - 1] : null;

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-indigo-100/70">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-indigo-900">{goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}</span>
          <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
        </div>
        <span className="text-xs font-medium text-gray-600">{goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}</span>
      </div>
      <div className="bg-gray-50/60 px-4 py-3 space-y-3">
        <p className="text-sm text-gray-600">{goal.goal_text}</p>

        {/* Today's data */}
        {latestDp && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500 block">Today&apos;s Measurement</span>
              <span className="text-sm font-semibold text-indigo-700">{formatValue(latestDp.value, goal)}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500 block">Activity</span>
              <span className="text-sm text-gray-600">{latestDp.activity_name || "—"}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500 block">Note</span>
              <span className="text-sm text-gray-600">{latestDp.note || "—"}</span>
            </div>
          </div>
        )}

        {/* Current functional level + Previous comment */}
        {(latestEvent?.current_functional_level || latestEvent?.comment) && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500 block">Current Functional Level {latestEvent?.occurred_on ? <span className="font-normal text-gray-400">{formatDate(latestEvent.occurred_on)}</span> : null}</span>
              <span className="text-sm text-gray-600">{latestEvent?.current_functional_level || "—"}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500 block">Previous Comment {latestEvent?.occurred_on ? <span className="font-normal text-gray-400">{formatDate(latestEvent.occurred_on)}</span> : null}</span>
              <span className="text-sm text-gray-600 italic">{latestEvent?.comment || "—"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const VNCF_SHOW_FORMATS: { value: ShowFormat; label: string }[] = [
  { value: "soap", label: "SOAP" },
  { value: "freetext", label: "Free Text" },
  { value: "dap", label: "DAP" },
  { value: "freetext_goallist", label: "w/ Goal List" },
  { value: "freetext_goalprogress", label: "w/ Goal Progress" },
  { value: "freetext_goaladmin", label: "w/ Goal Admin Components" },
  { value: "freetext_goalcustom", label: "w/ Goal Custom Components" },
];

const V2_SHOW_FORMATS: { value: ShowFormat; label: string }[] = [
  { value: "freetext_goalprogress", label: "Goal Progress" },
  { value: "freetext_goallist", label: "Goal Checklist" },
  { value: "freetext_v2goaladmin", label: "Goal Admin" },
  { value: "freetext_v2goalcustom", label: "Goal Custom" },
];

export default function VisitNoteView({ project = "goals_v2" }: { project?: "vncf" | "goals_v2" | "progress_reports" }) {
  const [updatingGoal, setUpdatingGoal] = useState<PatientGoal | null>(null);
  const [savedUpdates, setSavedUpdates] = useState<Record<string, { comment: string; dataValue: string; activityName: string }>>({});
  const [aiState, setAiState] = useState<"idle" | "loading" | "done">("idle");
  const [aiSuggestions, setAiSuggestions] = useState<AiGoalSuggestion[]>([]);
  const [showGoalProgress, setShowGoalProgress] = useState(false);
  const [showFormat, setShowFormat] = useState<ShowFormat>(project === "vncf" ? "soap" : "freetext_goalprogress");

  // Only show active Speech goals for visit note
  const speechGoals: PatientGoal[] = [];
  for (const g of mockGoals) {
    if (g.discipline === "Speech" && g.current_status === "active") {
      speechGoals.push(g);
      for (const c of g.children) {
        if (c.current_status === "active") {
          speechGoals.push(c);
        }
      }
    }
  }

  function handleSaveUpdate(goalId: string, comment: string, dataValue: string, activityName: string) {
    setSavedUpdates({ ...savedUpdates, [goalId]: { comment, dataValue, activityName } });
  }

  function handleAiAnalyze() {
    setAiState("loading");
    setTimeout(() => {
      const suggestions = getMockAiAnalysis(speechGoals);
      setAiSuggestions(suggestions);
      setAiState("done");
    }, 1500);
  }

  function getAiSuggestion(goalId: string) {
    return aiSuggestions.find((s) => s.goalId === goalId);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description='This page previews what a saved visit note looks like. Use the "Showing" buttons to switch between goal components: Goal Progress (measurement data), Goal Checklist (addressed goals with notes), Goal Admin (admin-configured fields), and Goal Custom (therapist-added controls).'
        todos={[]}
      />

      {/* Format selector */}
      <div className="mb-6">
        {(project === "vncf" || project === "goals_v2") && (
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-xs text-gray-400 mr-1">Showing:</span>
            {(project === "vncf" ? VNCF_SHOW_FORMATS : V2_SHOW_FORMATS).map((f) => (
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
        )}
      </div>

      {/* Visit note header bar */}
      <div className="bg-slate-700 text-white rounded-t-lg px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium">Visit note - Jane Demo: 04/08/2026 at 10:30 AM CDT</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs text-slate-300 hover:text-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View progress
          </button>
          <button className="text-xs bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded text-slate-200">Actions</button>
        </div>
      </div>

      {/* Visit note body */}
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg">
        {/* Discipline */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Speech Therapy (ST)</h2>
        </div>

        {/* Patient info table */}
        <InfoRow>
          <InfoCell label="Patient name">Jane Demo</InfoCell>
          <InfoCell label="Date of birth / age">06/15/2019 (6 years old)</InfoCell>
          <InfoCell label="Grade level">Pre-K</InfoCell>
        </InfoRow>
        <InfoRow>
          <InfoCell label="Therapist name">Sam Therapist</InfoCell>
          <InfoCell label="Physicians on file">Demo Provider (0000000000) (Referring provider)</InfoCell>
          <InfoCell label="Sex">Female</InfoCell>
        </InfoRow>
        <InfoRow>
          <InfoCell label="Insurance / Payer type">
            <div>1. Insurance: Demo Insurance</div>
            <div>2. Self: Jane Demo</div>
          </InfoCell>
          <InfoCell label="Insurance ID">
            <div>1. DEMO-12345</div>
            <div>2. N/A</div>
          </InfoCell>
          <InfoCell label="Diagnosis codes">
            <div>1. F80.2 - Mixed receptive-expressive language disorder</div>
            <div>2. R48.8 - Other symbolic dysfunctions</div>
          </InfoCell>
        </InfoRow>

        {/* MSS */}
        <div className="px-5 py-3 border-b border-gray-200">
          <div className="text-xs font-semibold text-gray-800 mb-1.5">MSS</div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            Educational - Multiple - School
          </span>
        </div>

        {/* Duration + Place of service */}
        <div className="px-5 py-3 border-b border-gray-200 space-y-2">
          <div>
            <div className="text-xs font-semibold text-gray-800">Duration</div>
            <div className="text-sm text-gray-600">30 minutes</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-800">Place of service</div>
            <div className="text-sm text-gray-600">School</div>
          </div>
        </div>

        {/* Note content - switches based on format */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Note</h3>

          {(showFormat === "soap" || showFormat === "freetext" || showFormat === "dap" || project === "goals_v2") && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Subjective</h4>
                <p className="text-sm text-gray-600">Patient arrived on time and was cooperative. Parent reports practicing /r/ words at home 3x per week. Patient appeared well-rested and motivated to participate in activities.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Objective</h4>
                <p className="text-sm text-gray-600">Articulation drills targeting /r/ in initial, medial, and final positions. Used visual cue cards and auditory bombardment techniques. Worked on structured sentences with /r/ blends. Patient completed 40 trials across word positions.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Assessment</h4>
                <p className="text-sm text-gray-600">Patient demonstrated 72% accuracy for /r/ across all positions, up from 68% last session. Initial position is strongest at 85%. Final position remains challenging, particularly with -er endings. Patient benefits from visual modeling and self-monitoring strategies.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Plan</h4>
                <p className="text-sm text-gray-600">Continue targeting /r/ in final position with emphasis on -er endings. Introduce self-monitoring checklist. Begin carryover activities for initial /r/ to conversational speech. Next session: 04/15/2026.</p>
              </div>
            </div>
          )}

          {showFormat === "dap" && project === "vncf" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Data</h4>
                <p className="text-sm text-gray-600">Patient arrived cooperative. Parent reports home practice 3x/week. Articulation drills targeting /r/ in all positions — 40 trials completed. Visual cue cards and auditory bombardment used. 72% accuracy across positions (up from 68%). Initial position strongest at 85%.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Assessment</h4>
                <p className="text-sm text-gray-600">Steady improvement in /r/ production. Final position remains challenging, particularly -er endings. Patient benefits from visual modeling and self-monitoring strategies.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">Plan</h4>
                <p className="text-sm text-gray-600">Continue targeting /r/ in final position with emphasis on -er endings. Introduce self-monitoring checklist. Next session: 04/15/2026.</p>
              </div>
            </div>
          )}

          {showFormat === "freetext" && project === "vncf" && (
            <p className="text-sm text-gray-600 leading-relaxed">Patient arrived on time and was cooperative. Parent reports practicing /r/ words at home 3x per week. Session focused on articulation drills targeting /r/ in initial, medial, and final positions using visual cue cards and auditory bombardment. Patient completed 40 trials and demonstrated 72% accuracy across all positions, up from 68% last session. Initial position is strongest at 85%. Final position remains challenging, particularly with -er endings. Patient benefits from visual modeling and self-monitoring strategies. Will continue targeting /r/ in final position with emphasis on -er endings and introduce self-monitoring checklist. Next session: 04/15/2026.</p>
          )}

          {showFormat === "freetext_goalprogress" && project === "vncf" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">Patient arrived on time and was cooperative. Parent reports practicing /r/ words at home 3x per week. Session focused on articulation drills targeting /r/ in initial, medial, and final positions. Patient demonstrated 72% accuracy across all positions, up from 68%. Will continue targeting final position /r/.</p>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Goal Progress</h4>
                <div className="space-y-2">
                  {/* LTG 1.0.0 - saved */}
                  <div className="border border-amber-200 rounded-lg px-4 py-3 bg-amber-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG 1.0.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 45% &rarr; Target: 90%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Patient will improve articulation of /r/ sound across all word positions with 90% accuracy.</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
                      <span><span className="font-medium text-gray-500">Activity:</span> Articulation drills</span>
                      <span><span className="font-medium text-gray-500">Correct trials:</span> 29</span>
                      <span><span className="font-medium text-gray-500">Total trials:</span> 40 (73%)</span>
                      <span><span className="font-medium text-gray-500">Prompting level:</span> Min</span>
                      <span><span className="font-medium text-gray-500">Prompting type:</span> Visual</span>
                    </div>
                  </div>

                  {/* STG 1.2.0 - saved */}
                  <div className="ml-6 border border-amber-200 rounded-lg px-4 py-2.5 bg-amber-50/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">STG 1.2.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 40% &rarr; Target: 90%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Produce /r/ in final position with 90% accuracy given minimal verbal cues.</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
                      <span><span className="font-medium text-gray-500">Activity:</span> Word-level drills</span>
                      <span><span className="font-medium text-gray-500">Correct trials:</span> 14</span>
                      <span><span className="font-medium text-gray-500">Total trials:</span> 20 (70%)</span>
                      <span><span className="font-medium text-gray-500">Prompting level:</span> Mod</span>
                      <span><span className="font-medium text-gray-500">Prompting type:</span> Modeling</span>
                    </div>
                  </div>

                  {/* LTG 2.0.0 - saved */}
                  <div className="border border-amber-200 rounded-lg px-4 py-3 bg-amber-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG 2.0.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 20% &rarr; Target: 80%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Patient will improve expressive language skills to formulate age-appropriate sentences with minimal assistance.</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
                      <span><span className="font-medium text-gray-500">Activity:</span> Sentence building</span>
                      <span><span className="font-medium text-gray-500">Correct trials:</span> 6</span>
                      <span><span className="font-medium text-gray-500">Total trials:</span> 10 (60%)</span>
                      <span><span className="font-medium text-gray-500">Prompting level:</span> Mod</span>
                      <span><span className="font-medium text-gray-500">Prompting type:</span> Verbal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showFormat === "freetext_goallist" && project === "vncf" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">Patient arrived on time and was cooperative. Parent reports practicing /r/ words at home 3x per week. Session focused on articulation drills targeting /r/ in initial, medial, and final positions. Patient demonstrated 72% accuracy across all positions, up from 68%. Will continue targeting final position /r/.</p>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Goals Addressed</h4>
                <div className="space-y-2">
                  <div className="border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG 1.0.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 45% &rarr; Target: 90%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Patient will improve articulation of /r/ sound across all word positions with 90% accuracy.</p>
                    <p className="text-xs text-gray-500 italic mt-1">72% accuracy this session — responding well to visual cues for /r/ blends</p>
                  </div>
                  <div className="ml-6 border border-gray-100 rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">STG 1.2.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 40% &rarr; Target: 90%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Produce /r/ in final position with 90% accuracy given minimal verbal cues.</p>
                    <p className="text-xs text-gray-500 italic mt-1">Still working on -er endings — adding modeling strategies</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showFormat === "freetext_goaladmin" && project === "vncf" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">Patient arrived on time and was cooperative. Parent reports practicing /r/ words at home 3x per week. Session focused on articulation drills targeting /r/ in all positions. Patient demonstrated 72% accuracy across all positions, up from 68%.</p>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Goals w/ Admin Selected Components</h4>
                <div className="space-y-2">
                  <div className="border border-amber-200 rounded-lg px-4 py-3 bg-amber-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG 1.0.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 45% &rarr; Target: 90%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Patient will improve articulation of /r/ sound across all word positions with 90% accuracy.</p>
                    <div className="mt-2 space-y-1.5 text-xs text-gray-600">
                      <div><span className="font-medium text-gray-500">Progress status:</span> Progressing</div>
                      <div><span className="font-medium text-gray-500">Session notes:</span> Responding well to visual cues for /r/ blends, increasing accuracy in initial and medial positions</div>
                    </div>
                  </div>
                  <div className="ml-6 border border-amber-200 rounded-lg px-4 py-2.5 bg-amber-50/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">STG 1.2.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 40% &rarr; Target: 90%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Produce /r/ in final position with 90% accuracy given minimal verbal cues.</p>
                    <div className="mt-2 space-y-1.5 text-xs text-gray-600">
                      <div><span className="font-medium text-gray-500">Progress status:</span> Plateau</div>
                      <div><span className="font-medium text-gray-500">Session notes:</span> Still struggling with -er endings, adding visual modeling strategies next session</div>
                    </div>
                  </div>
                  <div className="border border-amber-200 rounded-lg px-4 py-3 bg-amber-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG 2.0.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 20% &rarr; Target: 80%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Patient will improve expressive language skills to formulate age-appropriate sentences.</p>
                    <div className="mt-2 space-y-1.5 text-xs text-gray-600">
                      <div><span className="font-medium text-gray-500">Progress status:</span> Progressing</div>
                      <div><span className="font-medium text-gray-500">Session notes:</span> Beginning to use sentence starters independently, moderate assist level</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showFormat === "freetext_goalcustom" && project === "vncf" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">Patient arrived on time and was cooperative. Parent reports practicing /r/ words at home 3x per week. Session focused on articulation drills targeting /r/ in all positions. Patient demonstrated 72% accuracy across all positions, up from 68%.</p>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Goals w/ Custom Components
                  <span className="ml-2 text-xs font-medium text-violet-600 bg-violet-100 rounded-full px-2 py-0.5">Possible future iteration</span>
                </h4>
                <div className="space-y-2">
                  <div className="border border-amber-200 rounded-lg px-4 py-3 bg-amber-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG 1.0.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 45% &rarr; Target: 90%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Patient will improve articulation of /r/ sound across all word positions with 90% accuracy.</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50 text-xs text-gray-600">
                        <span className="font-medium text-gray-500">Trials:</span> 29/40 (73%)
                      </div>
                      <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50 text-xs text-gray-600">
                        <span className="font-medium text-gray-500">Notes:</span> Responding well to visual cues, increasing accuracy in initial and medial positions
                      </div>
                      <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50 text-xs text-gray-600">
                        <span className="font-medium text-gray-500">Rating:</span> 4 / 5
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 border border-amber-200 rounded-lg px-4 py-2.5 bg-amber-50/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">STG 1.2.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 40% &rarr; Target: 90%</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Produce /r/ in final position with 90% accuracy given minimal verbal cues.</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50 text-xs text-gray-600">
                        <span className="font-medium text-gray-500">Prompting:</span> Mod level, Modeling type
                      </div>
                      <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50 text-xs text-gray-600">
                        <span className="font-medium text-gray-500">Checklist:</span> Needs modification, Carryover noted
                      </div>
                    </div>
                  </div>
                  <div className="border border-amber-200 rounded-lg px-4 py-3 bg-amber-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG 2.0.0</span>
                      <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">active</span>
                      <span className="text-xs text-gray-400">Baseline: 20% &rarr; Target: 80%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Patient will improve expressive language skills to formulate age-appropriate sentences.</p>
                    <div className="mt-2 space-y-1.5">
                      <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50 text-xs text-gray-600">
                        <span className="font-medium text-gray-500">Status:</span> Progressing
                      </div>
                      <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50 text-xs text-gray-600">
                        <span className="font-medium text-gray-500">Notes:</span> Beginning to use sentence starters independently
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* V2 Goal Progress saved view */}
        {showFormat === "freetext_goalprogress" && project === "goals_v2" && (
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Goal Progress</h3>
            <div className="space-y-3">
              {speechGoals.filter((g) => g.goal_type !== "short_term").map((goal) => {
                const children = speechGoals.filter((c) => c.parent_id === goal.id);
                return (
                  <div key={goal.id}>
                    <GoalDataShowCard goal={goal} />
                    {children.map((child) => (
                      <div key={child.id} className="ml-8 mt-2">
                        <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>
                        <GoalDataShowCard goal={child} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* V2 Goal Checklist saved view */}
        {showFormat === "freetext_goallist" && project === "goals_v2" && (
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Goal Checklist</h3>
            <div className="space-y-3">
              {speechGoals.filter((g) => g.goal_type !== "short_term").slice(0, 2).map((goal) => {
                const children = speechGoals.filter((c) => c.parent_id === goal.id);
                return (
                  <div key={goal.id}>
                    <div className="rounded-lg overflow-hidden border border-indigo-200 shadow-sm">
                      <div className="flex items-center justify-between px-4 py-2 bg-indigo-100/80">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-sm font-bold text-indigo-900">{goal.version_a}.{goal.version_b}.{goal.version_c} Long Term Goal</span>
                          <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-600">Addressed</span>
                      </div>
                      <div className="bg-indigo-50/30 px-4 py-3 space-y-2">
                        <p className="text-sm text-gray-600">{goal.goal_text}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                            <span className="text-[11px] font-semibold text-gray-500 block">Current Functional Level</span>
                            <span className="text-sm text-gray-600">Producing /r/ at 72% across positions; initial position strongest at 85%</span>
                          </div>
                          <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                            <span className="text-[11px] font-semibold text-gray-500 block">Session Notes</span>
                            <span className="text-sm text-gray-600 italic">Worked on this goal — good progress with visual supports today.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {children.slice(0, 1).map((child) => (
                      <div key={child.id} className="ml-8 mt-2">
                        <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>
                        <div className="rounded-lg overflow-hidden border border-indigo-200 shadow-sm">
                          <div className="flex items-center justify-between px-4 py-2 bg-indigo-100/80">
                            <div className="flex items-center gap-3">
                              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              <span className="text-sm font-bold text-indigo-900">{child.version_a}.{child.version_b}.{child.version_c} Short Term Goal</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">Addressed</span>
                          </div>
                          <div className="bg-indigo-50/30 px-4 py-3 space-y-2">
                            <p className="text-sm text-gray-600">{child.goal_text}</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                                <span className="text-[11px] font-semibold text-gray-500 block">Current Functional Level</span>
                                <span className="text-sm text-gray-600">Final position /r/ at 68%; -er endings most challenging</span>
                              </div>
                              <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                                <span className="text-[11px] font-semibold text-gray-500 block">Session Notes</span>
                                <span className="text-sm text-gray-600 italic">Focused on final position — still challenging but improving with modeling.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* V2 Goal Admin - saved view */}
        {showFormat === "freetext_v2goaladmin" && project === "goals_v2" && (
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Goals w/ Admin Components</h3>
            <div className="space-y-3">
              {speechGoals.filter((g) => g.goal_type !== "short_term").map((goal) => {
                const latestDp = goal.data_points[goal.data_points.length - 1];
                return (
                  <div key={goal.id}>
                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between px-4 py-2 bg-indigo-100/70">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-indigo-900">{goal.version_a}.{goal.version_b}.{goal.version_c} Long Term Goal</span>
                          <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
                        </div>
                        <span className="text-xs font-medium text-gray-600">Active</span>
                      </div>
                      <div className="bg-gray-50/60 px-4 py-3 space-y-2">
                        <p className="text-sm text-gray-600">{goal.goal_text}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                            <span className="text-[11px] font-semibold text-gray-500 block">Progress Status</span>
                            <span className="text-sm text-gray-600">{latestDp ? "Progressing" : "No data"}</span>
                          </div>
                          <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5">
                            <span className="text-[11px] font-semibold text-gray-500 block">Session Notes</span>
                            <span className="text-sm text-gray-600 italic">Responding well to visual cues, increasing accuracy</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* V2 Goal Custom - saved view */}
        {showFormat === "freetext_v2goalcustom" && project === "goals_v2" && (
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Goals w/ Custom Components
              <span className="ml-2 text-xs font-medium text-violet-600 bg-violet-100 rounded-full px-2 py-0.5">Future iteration</span>
            </h3>
            <div className="space-y-3">
              {speechGoals.filter((g) => g.goal_type !== "short_term").slice(0, 2).map((goal) => (
                <div key={goal.id}>
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2 bg-indigo-100/70">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-indigo-900">{goal.version_a}.{goal.version_b}.{goal.version_c} Long Term Goal</span>
                        <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-600">Active</span>
                    </div>
                    <div className="bg-gray-50/60 px-4 py-3 space-y-2">
                      <p className="text-sm text-gray-600">{goal.goal_text}</p>
                      <div className="space-y-1.5">
                        <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-600">
                          <span className="text-[11px] font-semibold text-gray-500 block">Trials</span>
                          29/40 (73%)
                        </div>
                        <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-600">
                          <span className="text-[11px] font-semibold text-gray-500 block">Notes</span>
                          <span className="italic">Responding well to visual cues, increasing accuracy in initial and medial positions</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-600">
                          <span className="text-[11px] font-semibold text-gray-500 block">Rating</span>
                          4 / 5
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional fields - only for SOAP/Free Text/DAP */}
        {project === "vncf" && (showFormat === "soap" || showFormat === "freetext" || showFormat === "dap") && (
          <div className="px-5 py-4 border-b border-gray-200 space-y-3">
            <div>
              <div className="text-xs font-semibold text-gray-800 mb-1">Diagnosis Codes</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">F80.2 - Mixed receptive-expressive language disorder</span>
                <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">R48.8 - Other symbolic dysfunctions</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-800 mb-1">Prognosis</div>
              <div className="text-sm text-gray-600">Good</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-800 mb-1">Therapy Recommendations</div>
              <div className="text-sm text-gray-600">Continue current plan of care, Modify treatment approach</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-800 mb-1">Patient/Caregiver Education Provided</div>
              <div className="text-sm text-gray-600">Home program, Caregiver training</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-800 mb-1">Next Session Date</div>
              <div className="text-sm text-gray-600">04/15/2026</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-800 mb-1">Additional Notes</div>
              <div className="text-sm text-gray-600">Parent given updated home practice sheet for /r/ words. Discussed importance of daily practice in natural contexts.</div>
            </div>
          </div>
        )}

        {/* Therapy activities bar - for VNCF formats without goal list/progress */}
        {project === "vncf" && (showFormat === "soap" || showFormat === "freetext" || showFormat === "dap") && (
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-indigo-700">Therapy activities and trials</h3>
              <button className="w-7 h-7 flex items-center justify-center text-white bg-indigo-700 rounded text-lg font-bold hover:bg-indigo-800 transition-colors">+</button>
            </div>
            <div className="border-t-2 border-indigo-200" />
          </div>
        )}

        {/* Goal Progress Section removed — data collection now happens on the visit note form (New), not the show page */}
        {false && (
        <div className="px-5 py-4">
          {!showGoalProgress ? (
            <button
              onClick={() => setShowGoalProgress(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-indigo-600 border-2 border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Add Goal Progress
              {Object.keys(savedUpdates).length > 0 && (
                <span className="text-xs text-indigo-400">({Object.keys(savedUpdates).length} of {speechGoals.length} updated)</span>
              )}
            </button>
          ) : (
          <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">Goal Progress</h3>
              <button onClick={() => setShowGoalProgress(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{Object.keys(savedUpdates).length} of {speechGoals.length} updated</span>
              {aiState === "idle" && (
                <button
                  onClick={handleAiAnalyze}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze Note
                </button>
              )}
              {aiState === "loading" && (
                <span className="inline-flex items-center gap-1.5 text-xs text-violet-500">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing note...
                </span>
              )}
              {aiState === "done" && (
                <span className="inline-flex items-center gap-1 text-xs text-violet-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {aiSuggestions.length} suggestions
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {speechGoals.map((goal) => {
              const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
              const update = savedUpdates[goal.id];
              const latestDataPoint = goal.data_points[goal.data_points.length - 1];

              return (
                <div
                  key={goal.id}
                  className={`border rounded-lg px-4 py-3 ${
                    update ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"
                  } ${goal.goal_type === "short_term" ? "ml-6" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0">
                        {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
                      </span>
                      <StatusBadge status={goal.current_status} />
                      <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
                      {latestDataPoint && !update && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-xs text-gray-500">Last: {formatValue(latestDataPoint.value, goal)}</span>
                        </>
                      )}
                      {update && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-xs text-green-600 font-medium">
                            {formatValue(update.dataValue, goal)}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      {update ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setUpdatingGoal(goal)}
                            className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors"
                            title="Edit update"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Updated
                            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { const next = { ...savedUpdates }; delete next[goal.id]; setSavedUpdates(next); }}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                            title="Remove update"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUpdatingGoal(goal)}
                          className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Goal text */}
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed truncate">{goal.goal_text}</p>

                  {/* Saved update details */}
                  {update && (
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      {update.activityName && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-0.5 text-gray-600">
                          {update.activityName}
                        </span>
                      )}
                      {update.comment && (
                        <span className="italic">{update.comment}</span>
                      )}
                    </div>
                  )}

                  {/* AI suggestion */}
                  {!update && (() => {
                    const suggestion = getAiSuggestion(goal.id);
                    if (!suggestion) return null;
                    const confidenceColor = suggestion.confidence === "high" ? "text-green-600 bg-green-100" : suggestion.confidence === "medium" ? "text-amber-600 bg-amber-100" : "text-gray-500 bg-gray-100";
                    return (
                      <div className="mt-2 border border-violet-200 rounded-lg bg-violet-50/50 px-3 py-2.5 space-y-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-xs font-medium text-violet-700">AI Suggestion</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${confidenceColor}`}>
                            {suggestion.confidence} confidence
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-500 w-16 flex-shrink-0">Value:</span>
                            <span className="text-gray-700">{formatValue(suggestion.suggestedValue, goal)}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-500 w-16 flex-shrink-0">Activity:</span>
                            <span className="text-gray-700">{suggestion.suggestedActivity}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-medium text-gray-500 w-16 flex-shrink-0">Note:</span>
                            <span className="text-gray-700">{suggestion.suggestedComment}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 italic">{suggestion.reasoning}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleSaveUpdate(goal.id, suggestion.suggestedComment, suggestion.suggestedValue, suggestion.suggestedActivity);
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => {
                              setSavedUpdates({ ...savedUpdates, [goal.id]: { comment: suggestion.suggestedComment, dataValue: suggestion.suggestedValue, activityName: suggestion.suggestedActivity } });
                              setUpdatingGoal(goal);
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-100"
                          >
                            Edit &amp; Accept
                          </button>
                          <button
                            onClick={() => setAiSuggestions(aiSuggestions.filter((s) => s.goalId !== goal.id))}
                            className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
          </div>
          )}
        </div>
        )}

        {/* Sign button */}
        <div className="flex justify-end px-5 py-4 border-t border-gray-200">
          <button
            disabled
            className="px-4 py-2 text-sm font-medium text-white bg-gray-300 rounded-lg cursor-not-allowed"
          >
            Sign Visit Note
          </button>
        </div>
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; Visit Note Preview
        </span>
      </div>

      {/* Goal update modal */}
      {updatingGoal && (
        <GoalUpdateModal
          goal={updatingGoal}
          onSave={handleSaveUpdate}
          onClose={() => setUpdatingGoal(null)}
          initialComment={savedUpdates[updatingGoal.id]?.comment}
          initialDataValue={savedUpdates[updatingGoal.id]?.dataValue}
          initialActivityName={savedUpdates[updatingGoal.id]?.activityName}
        />
      )}
    </div>
  );
}
