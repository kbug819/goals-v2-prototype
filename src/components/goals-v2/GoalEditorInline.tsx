"use client";

import { useState, useCallback } from "react";
import { GoalType, MeasurementType, PatientGoal } from "@/data/mockData";

// ── Mock AI SMART goal suggestions ──
// Maps rough input keywords to structured SMART goal suggestions
interface AiSuggestion {
  goalText: string;
  measurementType: MeasurementType;
  baselineValue: string;
  targetValue: string;
  measurementConfig: Record<string, unknown>;
}

function getMockAiSuggestion(roughText: string, discipline: string): AiSuggestion {
  const lower = roughText.toLowerCase();

  if (discipline === "Speech") {
    if (lower.includes("/r/") || lower.includes("articulation") || lower.includes("sound")) {
      return {
        goalText: "Patient will produce /r/ in all word positions (initial, medial, final) with 90% accuracy given minimal verbal cues across 3 consecutive sessions in structured and unstructured tasks.",
        measurementType: "percentage",
        baselineValue: "40",
        targetValue: "90",
        measurementConfig: {},
      };
    }
    if (lower.includes("sentence") || lower.includes("expressive") || lower.includes("language")) {
      return {
        goalText: "Patient will formulate age-appropriate sentences of 5+ words using correct subject-verb-object structure with 80% accuracy given visual supports across 3 consecutive sessions.",
        measurementType: "percentage",
        baselineValue: "30",
        targetValue: "80",
        measurementConfig: {},
      };
    }
    if (lower.includes("request") || lower.includes("ask") || lower.includes("want")) {
      return {
        goalText: "Patient will independently initiate 8 spontaneous requests per session using verbal or AAC modalities without prompting across 3 consecutive sessions.",
        measurementType: "count",
        baselineValue: "2",
        targetValue: "8",
        measurementConfig: { unit: "requests", per: "session" },
      };
    }
    if (lower.includes("follow") || lower.includes("direction") || lower.includes("receptive")) {
      return {
        goalText: "Patient will follow 2-step novel directions with 80% accuracy given no more than 1 verbal repetition across 3 consecutive sessions.",
        measurementType: "percentage",
        baselineValue: "35",
        targetValue: "80",
        measurementConfig: {},
      };
    }
  }

  if (discipline === "OT") {
    if (lower.includes("handwriting") || lower.includes("writing") || lower.includes("letter")) {
      return {
        goalText: "Patient will independently copy 10 lowercase letters with correct formation, sizing within guidelines, and appropriate spacing with 80% accuracy across 3 consecutive sessions.",
        measurementType: "percentage",
        baselineValue: "25",
        targetValue: "80",
        measurementConfig: {},
      };
    }
    if (lower.includes("button") || lower.includes("dress") || lower.includes("zipper") || lower.includes("self-care")) {
      return {
        goalText: "Patient will independently complete upper body dressing including buttons, zippers, and snaps with minimal verbal cueing within 5 minutes across 3 consecutive sessions.",
        measurementType: "scale",
        baselineValue: "maximal_assist",
        targetValue: "minimal_assist",
        measurementConfig: { levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
      };
    }
    if (lower.includes("scissor") || lower.includes("cut")) {
      return {
        goalText: "Patient will use scissors to cut along curved and straight lines within 1/4 inch accuracy in 80% of trials using a standard grasp across 3 consecutive sessions.",
        measurementType: "percentage",
        baselineValue: "20",
        targetValue: "80",
        measurementConfig: {},
      };
    }
  }

  if (discipline === "PT") {
    if (lower.includes("balance") || lower.includes("stand")) {
      return {
        goalText: "Patient will maintain single-leg stance for 15 seconds bilaterally on a level surface without upper extremity support across 3 consecutive sessions.",
        measurementType: "duration",
        baselineValue: "3",
        targetValue: "15",
        measurementConfig: { unit: "seconds" },
      };
    }
    if (lower.includes("stair") || lower.includes("step")) {
      return {
        goalText: "Patient will ascend and descend a full flight of 12 stairs using a reciprocal pattern with rail support only and no verbal cueing across 3 consecutive sessions.",
        measurementType: "binary",
        baselineValue: "false",
        targetValue: "true",
        measurementConfig: {},
      };
    }
    if (lower.includes("walk") || lower.includes("gait") || lower.includes("mobility")) {
      return {
        goalText: "Patient will ambulate 200 feet on level surfaces with a reciprocal gait pattern at supervision level without assistive device across 3 consecutive sessions.",
        measurementType: "scale",
        baselineValue: "moderate_assist",
        targetValue: "supervision",
        measurementConfig: { levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
      };
    }
  }

  // Generic fallback
  return {
    goalText: `Patient will ${roughText.toLowerCase().replace(/^patient will\s*/i, "")} with 80% accuracy given minimal cueing across 3 consecutive sessions as measured by clinician observation.`,
    measurementType: "percentage",
    baselineValue: "30",
    targetValue: "80",
    measurementConfig: {},
  };
}

// ── AI-assisted goal text component ──
function GoalTextWithAi({
  goalText, setGoalText, discipline,
  setMeasurementType,
  setBaselineValue, setTargetValue,
  setCountUnit, setCountPer, setDurationUnit,
  setCustomLabel, setCustomUnit,
  setUseCustomScale, setCustomLevels,
}: {
  goalText: string;
  setGoalText: (v: string) => void;
  discipline: string;
  setMeasurementType: (v: MeasurementType) => void;
  setBaselineValue: (v: string) => void;
  setTargetValue: (v: string) => void;
  setCountUnit: (v: string) => void;
  setCountPer: (v: string) => void;
  setDurationUnit: (v: string) => void;
  setCustomLabel: (v: string) => void;
  setCustomUnit: (v: string) => void;
  setUseCustomScale: (v: boolean) => void;
  setCustomLevels: (v: string[]) => void;
}) {
  const [aiState, setAiState] = useState<"idle" | "loading" | "suggestion">("idle");
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null);

  const handleImprove = useCallback(() => {
    if (!goalText.trim()) return;
    setAiState("loading");

    // Simulate API delay
    setTimeout(() => {
      const result = getMockAiSuggestion(goalText, discipline);
      setSuggestion(result);
      setAiState("suggestion");
    }, 1200);
  }, [goalText, discipline]);

  function acceptSuggestion() {
    if (!suggestion) return;
    setGoalText(suggestion.goalText);
    setMeasurementType(suggestion.measurementType);
    setBaselineValue(suggestion.baselineValue);
    setTargetValue(suggestion.targetValue);

    // Apply measurement config
    const config = suggestion.measurementConfig;
    if (suggestion.measurementType === "count") {
      setCountUnit((config.unit as string) || "trials");
      setCountPer((config.per as string) || "session");
    } else if (suggestion.measurementType === "duration") {
      setDurationUnit((config.unit as string) || "seconds");
    } else if (suggestion.measurementType === "custom") {
      setCustomLabel((config.label as string) || "");
      setCustomUnit((config.unit as string) || "");
    } else if (suggestion.measurementType === "scale" && config.levels) {
      setUseCustomScale(true);
      setCustomLevels(config.levels as string[]);
    }

    setSuggestion(null);
    setAiState("idle");
  }

  function dismissSuggestion() {
    setSuggestion(null);
    setAiState("idle");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-gray-500">Goal Text</label>
        {aiState === "idle" && goalText.trim().length > 5 && (
          <button
            onClick={handleImprove}
            className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Improve with AI
          </button>
        )}
        {aiState === "loading" && (
          <span className="inline-flex items-center gap-1.5 text-xs text-violet-500">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating SMART goal...
          </span>
        )}
      </div>
      <textarea
        value={goalText}
        onChange={(e) => { setGoalText(e.target.value); if (aiState === "suggestion") dismissSuggestion(); }}
        rows={2}
        placeholder="Type rough notes here... e.g. 'work on /r/ sounds' or 'improve balance'"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
      />

      {/* AI suggestion preview */}
      {aiState === "suggestion" && suggestion && (
        <div className="mt-2 border border-violet-200 rounded-lg overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 border-b border-violet-200">
            <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-medium text-violet-700">AI Suggestion</span>
          </div>
          <div className="px-3 py-3 space-y-3">
            {/* Original vs suggested */}
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-400">Your input:</span>
                <p className="text-sm text-gray-400 line-through mt-0.5">{goalText}</p>
              </div>
              <div>
                <span className="text-xs text-violet-500">SMART goal:</span>
                <p className="text-sm text-gray-800 mt-0.5 leading-relaxed">{suggestion.goalText}</p>
              </div>
            </div>

            {/* Suggested measurement fields */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">
                Type: {suggestion.measurementType}
              </span>
              {suggestion.baselineValue && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                  Baseline: {suggestion.baselineValue}
                </span>
              )}
              {suggestion.targetValue && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                  Target: {suggestion.targetValue}
                </span>
              )}
              {typeof suggestion.measurementConfig.unit === "string" && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                  Unit: {suggestion.measurementConfig.unit}
                </span>
              )}
            </div>

            {/* Accept / Edit / Reject */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={acceptSuggestion}
                className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => { setGoalText(suggestion.goalText); dismissSuggestion(); }}
                className="px-3 py-1.5 text-xs font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
              >
                Use text only
              </button>
              <button
                onClick={dismissSuggestion}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MEASUREMENT_TYPES: { value: MeasurementType; label: string; description: string }[] = [
  { value: "percentage", label: "Percentage", description: "Accuracy or success rate (0-100%)" },
  { value: "count", label: "Count", description: "Number of occurrences (trials, requests, reps)" },
  { value: "duration", label: "Duration", description: "Time-based measurement (seconds, minutes)" },
  { value: "scale", label: "Scale", description: "Ordered levels (assistance, cueing, independence)" },
  { value: "binary", label: "Binary", description: "Pass/fail, yes/no, achieved/not achieved" },
  { value: "custom", label: "Custom", description: "Free-form measurement with custom unit and label" },
];

const SCALE_PRESETS: { name: string; levels: string[] }[] = [
  { name: "Assistance Level", levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
  { name: "Cueing Level", levels: ["full_physical", "partial_physical", "full_verbal", "partial_verbal", "gestural", "independent"] },
  { name: "Frequency", levels: ["never", "rarely", "sometimes", "often", "usually", "always"] },
  { name: "Progress Status", levels: ["see_comments", "not_achieved", "progressing_inconsistently", "progressing_gradually", "progressing_satisfactorily", "achieved"] },
];

const COUNT_UNIT_PRESETS = ["trials", "requests", "repetitions", "occurrences", "attempts", "steps", "feet"];
const COUNT_PER_PRESETS = ["session", "minute", "routine", "interaction", "set"];
const DURATION_UNIT_PRESETS = ["seconds", "minutes"];

interface GoalEditorInlineProps {
  disciplines: string[];
  existingGoals: PatientGoal[];
  onSave: (goal: PatientGoal) => void;
  onCancel: () => void;
  editingGoal?: PatientGoal | null;
  parentGoal?: PatientGoal | null;
}

export default function GoalEditorInline({ disciplines, existingGoals, onSave, onCancel, editingGoal, parentGoal }: GoalEditorInlineProps) {
  const isStg = !!parentGoal;
  const isEditing = !!editingGoal;
  const [goalType] = useState<GoalType>(isStg ? "short_term" : (editingGoal?.goal_type || "long_term"));
  const [parentId] = useState<string | null>(isStg ? parentGoal!.id : (editingGoal?.parent_id || null));
  const [goalText, setGoalText] = useState(editingGoal?.goal_text || "");
  const [discipline] = useState(editingGoal?.discipline || disciplines[0]);
  const [measurementType, setMeasurementType] = useState<MeasurementType>(editingGoal?.measurement_type || "percentage");
  const [baselineValue, setBaselineValue] = useState(editingGoal?.baseline_value || "");
  const [targetValue, setTargetValue] = useState(editingGoal?.target_value || "");
  const [targetDate, setTargetDate] = useState(editingGoal?.target_date || "");
  const [currentFunctionalLevel, setCurrentFunctionalLevel] = useState(
    editingGoal?.events?.[0]?.current_functional_level || ""
  );
  const [scalePreset, setScalePreset] = useState(0);
  const [customLevels, setCustomLevels] = useState<string[]>([""]);
  const [useCustomScale, setUseCustomScale] = useState(false);
  const [countUnit, setCountUnit] = useState(
    (editingGoal?.measurement_config?.unit as string) || "trials"
  );
  const [countPer, setCountPer] = useState(
    (editingGoal?.measurement_config?.per as string) || "session"
  );
  const [durationUnit, setDurationUnit] = useState(
    (editingGoal?.measurement_config?.unit as string) || "seconds"
  );
  const [customLabel, setCustomLabel] = useState(
    (editingGoal?.measurement_config?.label as string) || ""
  );
  const [customUnit, setCustomUnit] = useState(
    (editingGoal?.measurement_config?.unit as string) || ""
  );

  function buildMeasurementConfig(): Record<string, unknown> {
    switch (measurementType) {
      case "scale": {
        const levels = useCustomScale ? customLevels.filter((l) => l.trim()) : SCALE_PRESETS[scalePreset].levels;
        return { levels };
      }
      case "count": return { unit: countUnit, per: countPer };
      case "duration": return { unit: durationUnit };
      case "custom": return { label: customLabel, unit: customUnit };
      default: return {};
    }
  }

  function handleSave() {
    if (!goalText.trim() || !targetDate) return;
    const config = buildMeasurementConfig();
    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    if (isEditing) {
      onSave({
        ...editingGoal!,
        goal_text: goalText,
        measurement_type: measurementType,
        baseline_value: baselineValue || null,
        target_value: targetValue || null,
        measurement_config: config,
        target_date: targetDate,
        discipline,
      });
    } else {
      onSave({
        id: `pg-new-${Date.now()}`,
        goal_type: goalType,
        parent_id: parentId,
        goal_text: goalText,
        measurement_type: measurementType,
        baseline_value: baselineValue || null,
        target_value: targetValue || null,
        measurement_config: config,
        version_a: parentId && parentGoal ? parentGoal.version_a : (Math.max(0, ...existingGoals.filter((g) => g.goal_type !== "short_term").map((g) => g.version_a)) + 1),
        version_b: parentId && parentGoal ? (Math.max(0, ...existingGoals.filter((g) => g.parent_id === parentId).map((g) => g.version_b)) + 1) : 0,
        version_c: 0,
        start_date: today,
        target_date: targetDate,
        met_on: null,
        discipline,
        current_status: "pending",
        events: [{
          id: `ev-new-${Date.now()}`,
          status: "pending",
          occurred_on: today,
          comment: "Goal created via custom form editor",
          current_functional_level: currentFunctionalLevel || null,
          user_name: "Sam Therapist",
          created_at: now,
        }],
        data_points: [],
        children: [],
      });
    }
  }

  return (
    <div className="border-2 border-indigo-200 rounded-lg bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-b border-indigo-200 rounded-t-lg">
        <h3 className="text-sm font-semibold text-indigo-700">{isEditing ? "Edit Goal" : isStg ? "New Short Term Goal" : "New Goal"}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Goal Text + AI */}
        <GoalTextWithAi
          goalText={goalText}
          setGoalText={setGoalText}
          discipline={discipline}
          setMeasurementType={setMeasurementType}
          setBaselineValue={setBaselineValue}
          setTargetValue={setTargetValue}
          setCountUnit={setCountUnit}
          setCountPer={setCountPer}
          setDurationUnit={setDurationUnit}
          setCustomLabel={setCustomLabel}
          setCustomUnit={setCustomUnit}
          setUseCustomScale={setUseCustomScale}
          setCustomLevels={setCustomLevels}
        />

        {/* Measurement Type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Measurement Type</label>
          <div className="grid grid-cols-6 gap-1.5">
            {MEASUREMENT_TYPES.map((mt) => (
              <button
                key={mt.value}
                onClick={() => { setMeasurementType(mt.value); setBaselineValue(""); setTargetValue(""); }}
                title={mt.description}
                className={`text-center px-2 py-2 rounded-lg border transition-colors ${
                  measurementType === mt.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`text-xs font-medium ${measurementType === mt.value ? "text-indigo-700" : "text-gray-600"}`}>
                  {mt.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Measurement Config */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
          <h4 className="text-xs font-medium text-gray-500">
            {MEASUREMENT_TYPES.find((m) => m.value === measurementType)?.label} Configuration
          </h4>

          {measurementType === "percentage" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Baseline (%)</label>
                <input type="number" min="0" max="100" value={baselineValue} onChange={(e) => setBaselineValue(e.target.value)} placeholder="e.g. 45" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Target (%)</label>
                <input type="number" min="0" max="100" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="e.g. 90" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          )}

          {measurementType === "count" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Baseline</label>
                  <input type="number" min="0" value={baselineValue} onChange={(e) => setBaselineValue(e.target.value)} placeholder="e.g. 2" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Target</label>
                  <input type="number" min="0" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="e.g. 10" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Unit</label>
                  <select value={countUnit} onChange={(e) => setCountUnit(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {COUNT_UNIT_PRESETS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Per</label>
                  <select value={countPer} onChange={(e) => setCountPer(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {COUNT_PER_PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {measurementType === "duration" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Baseline</label>
                  <input type="number" min="0" value={baselineValue} onChange={(e) => setBaselineValue(e.target.value)} placeholder="e.g. 30" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Target</label>
                  <input type="number" min="0" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="e.g. 180" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Unit</label>
                <div className="flex gap-1.5">
                  {DURATION_UNIT_PRESETS.map((u) => (
                    <button key={u} onClick={() => setDurationUnit(u)} className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${durationUnit === u ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>{u}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {measurementType === "scale" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Scale Preset</label>
                <div className="space-y-1.5">
                  {SCALE_PRESETS.map((preset, i) => (
                    <button
                      key={preset.name}
                      onClick={() => { setScalePreset(i); setUseCustomScale(false); setBaselineValue(""); setTargetValue(""); }}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${!useCustomScale && scalePreset === i ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <div className="text-xs font-medium text-gray-700">{preset.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{preset.levels.map((l) => l.replace(/_/g, " ")).join(" → ")}</div>
                    </button>
                  ))}
                  <button
                    onClick={() => setUseCustomScale(true)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${useCustomScale ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <div className="text-xs font-medium text-gray-700">Custom Scale</div>
                    <div className="text-xs text-gray-400 mt-0.5">Define your own ordered levels</div>
                  </button>
                </div>
              </div>

              {useCustomScale && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Custom Levels (lowest to highest)</label>
                  <div className="space-y-1.5">
                    {customLevels.map((level, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                        <input value={level} onChange={(e) => { const u = [...customLevels]; u[i] = e.target.value; setCustomLevels(u); }} placeholder={`Level ${i + 1}`} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        {customLevels.length > 1 && (
                          <button onClick={() => setCustomLevels(customLevels.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => setCustomLevels([...customLevels, ""])} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">+ Add level</button>
                  </div>
                </div>
              )}

              {(() => {
                const levels = useCustomScale ? customLevels.filter((l) => l.trim()) : SCALE_PRESETS[scalePreset].levels;
                if (levels.length < 2) return null;
                return (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Baseline</label>
                      <select value={baselineValue} onChange={(e) => setBaselineValue(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select...</option>
                        {levels.map((l) => <option key={l} value={l}>{l.replace(/_/g, " ")}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Target</label>
                      <select value={targetValue} onChange={(e) => setTargetValue(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Select...</option>
                        {levels.map((l) => <option key={l} value={l}>{l.replace(/_/g, " ")}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {measurementType === "binary" && (
            <p className="text-xs text-gray-400">Baseline: <span className="text-gray-600">Not met</span> → Target: <span className="text-gray-600">Met</span>. No additional configuration needed.</p>
          )}

          {measurementType === "custom" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Measurement Label</label>
                  <input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} placeholder="e.g. Mean Length of Utterance" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Unit</label>
                  <input value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} placeholder="e.g. words" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Baseline</label>
                  <input value={baselineValue} onChange={(e) => setBaselineValue(e.target.value)} placeholder="e.g. 2.5" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Target</label>
                  <input value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="e.g. 4.0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Functional Level + Target Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Functional Level</label>
            <textarea
              value={currentFunctionalLevel}
              onChange={(e) => setCurrentFunctionalLevel(e.target.value)}
              rows={2}
              placeholder="Describe patient's current functional status..."
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Target Date</label>
            <div className="flex items-center gap-2">
              <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button
                type="button"
                onClick={() => {
                  const d = targetDate ? new Date(targetDate + "T00:00:00") : new Date();
                  d.setDate(d.getDate() + 7);
                  setTargetDate(d.toISOString().slice(0, 10));
                }}
                className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
              >
                +1 Wk
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[11px] text-gray-400">Quick set:</span>
              {[
                { label: "End of POC", months: 0, poc: true },
                { label: "3 mo", months: 3, poc: false },
                { label: "6 mo", months: 6, poc: false },
                { label: "1 yr", months: 12, poc: false },
              ].map((shortcut) => (
                <button
                  key={shortcut.label}
                  type="button"
                  onClick={() => {
                    if (shortcut.poc) {
                      setTargetDate("2026-09-01");
                    } else {
                      const d = new Date();
                      d.setMonth(d.getMonth() + shortcut.months);
                      setTargetDate(d.toISOString().slice(0, 10));
                    }
                  }}
                  className="px-2 py-0.5 text-[11px] font-medium text-gray-500 border border-gray-200 rounded hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button onClick={onCancel} className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!goalText.trim() || !targetDate}
          className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isEditing ? "Save Changes" : isStg ? "Add STG" : "Add Goal"}
        </button>
      </div>
    </div>
  );
}
