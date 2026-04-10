"use client";

import { useState } from "react";
import { GoalType, MeasurementType, PatientGoal } from "@/data/mockData";

const MEASUREMENT_TYPES: { value: MeasurementType; label: string; description: string }[] = [
  { value: "percentage", label: "Percentage", description: "Accuracy or success rate (0-100%)" },
  { value: "count", label: "Count", description: "Number of occurrences (trials, requests, reps)" },
  { value: "duration", label: "Duration", description: "Time-based measurement (seconds, minutes)" },
  { value: "scale", label: "Scale", description: "Ordered levels (assistance, cueing, independence)" },
  { value: "binary", label: "Binary", description: "Pass/fail, yes/no, achieved/not achieved" },
  { value: "custom", label: "Custom", description: "Free-form measurement with custom unit and label" },
];

const SCALE_PRESETS: { name: string; levels: string[] }[] = [
  {
    name: "Assistance Level",
    levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"],
  },
  {
    name: "Cueing Level",
    levels: ["full_physical", "partial_physical", "full_verbal", "partial_verbal", "gestural", "independent"],
  },
  {
    name: "Frequency",
    levels: ["never", "rarely", "sometimes", "often", "usually", "always"],
  },
];

const COUNT_UNIT_PRESETS = ["trials", "requests", "repetitions", "occurrences", "attempts", "steps"];
const COUNT_PER_PRESETS = ["session", "minute", "routine", "interaction", "set"];
const DURATION_UNIT_PRESETS = ["seconds", "minutes"];

interface GoalEditorModalProps {
  disciplines: string[];
  existingGoals: PatientGoal[];
  onSave: (goal: PatientGoal) => void;
  onClose: () => void;
}

export default function GoalEditorModal({ disciplines, existingGoals, onSave, onClose }: GoalEditorModalProps) {
  const [goalType, setGoalType] = useState<GoalType>("long_term");
  const [parentId, setParentId] = useState<string | null>(null);
  const [goalText, setGoalText] = useState("");
  const [discipline, setDiscipline] = useState(disciplines[0]);
  const [measurementType, setMeasurementType] = useState<MeasurementType>("percentage");
  const [baselineValue, setBaselineValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetDate, setTargetDate] = useState("");

  // Scale config
  const [scalePreset, setScalePreset] = useState(0);
  const [customLevels, setCustomLevels] = useState<string[]>([""]);
  const [useCustomScale, setUseCustomScale] = useState(false);

  // Count config
  const [countUnit, setCountUnit] = useState("trials");
  const [countPer, setCountPer] = useState("session");

  // Duration config
  const [durationUnit, setDurationUnit] = useState("seconds");

  // Custom config
  const [customLabel, setCustomLabel] = useState("");
  const [customUnit, setCustomUnit] = useState("");

  const topLevelGoals = existingGoals.filter((g) => g.goal_type === "long_term" && g.discipline === discipline);

  function buildMeasurementConfig(): Record<string, unknown> {
    switch (measurementType) {
      case "scale": {
        const levels = useCustomScale ? customLevels.filter((l) => l.trim()) : SCALE_PRESETS[scalePreset].levels;
        return { levels };
      }
      case "count":
        return { unit: countUnit, per: countPer };
      case "duration":
        return { unit: durationUnit };
      case "custom":
        return { label: customLabel, unit: customUnit };
      default:
        return {};
    }
  }

  function handleSave() {
    if (!goalText.trim()) return;

    const config = buildMeasurementConfig();
    const id = `pg-new-${Date.now()}`;
    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    const newGoal: PatientGoal = {
      id,
      goal_type: goalType,
      parent_id: parentId,
      goal_text: goalText,
      measurement_type: measurementType,
      baseline_value: baselineValue || null,
      target_value: targetValue || null,
      measurement_config: config,
      version_a: existingGoals.length + 1,
      version_b: goalType === "short_term" ? 1 : 0,
      version_c: 0,
      start_date: today,
      target_date: targetDate || null,
      met_on: null,
      discipline,
      current_status: "pending",
      events: [
        {
          id: `ev-new-${Date.now()}`,
          status: "pending",
          occurred_on: today,
          comment: "Goal created via custom form editor",
          current_functional_level: null,
          user_name: "Sam Therapist",
          created_at: now,
        },
      ],
      data_points: [],
      children: [],
    };

    onSave(newGoal);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-16 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add New Goal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Goal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
            <div className="flex gap-2">
              {([
                { value: "long_term" as GoalType, label: "Long Term (LTG)" },
                { value: "short_term" as GoalType, label: "Short Term (STG)" },
                { value: "standalone" as GoalType, label: "Standalone (LTG)" },
              ]).map((t) => (
                <button
                  key={t.value}
                  onClick={() => { setGoalType(t.value); if (t.value !== "short_term") setParentId(null); }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    goalType === t.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Discipline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discipline</label>
            <div className="flex gap-2">
              {disciplines.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiscipline(d)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    discipline === d
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Parent goal (for STGs) */}
          {goalType === "short_term" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parent LTG</label>
              {topLevelGoals.length > 0 ? (
                <select
                  value={parentId || ""}
                  onChange={(e) => setParentId(e.target.value || null)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a parent LTG...</option>
                  {topLevelGoals.map((g) => (
                    <option key={g.id} value={g.id}>
                      LTG {g.version_a}.{g.version_b}.{g.version_c} — {g.goal_text.slice(0, 60)}...
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-400 italic">No LTGs exist for {discipline} yet. Create one first.</p>
              )}
            </div>
          )}

          {/* Goal Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal Text</label>
            <textarea
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              rows={3}
              placeholder="Patient will..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Measurement Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Type</label>
            <div className="grid grid-cols-3 gap-2">
              {MEASUREMENT_TYPES.map((mt) => (
                <button
                  key={mt.value}
                  onClick={() => {
                    setMeasurementType(mt.value);
                    setBaselineValue("");
                    setTargetValue("");
                  }}
                  className={`text-left px-3 py-2.5 rounded-lg border transition-colors ${
                    measurementType === mt.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className={`text-sm font-medium ${measurementType === mt.value ? "text-indigo-700" : "text-gray-700"}`}>
                    {mt.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{mt.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Measurement Config (type-specific) */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
              {MEASUREMENT_TYPES.find((m) => m.value === measurementType)?.label} Configuration
            </h3>

            {/* Percentage */}
            {measurementType === "percentage" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Baseline (%)</label>
                  <input
                    type="number" min="0" max="100"
                    value={baselineValue}
                    onChange={(e) => setBaselineValue(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Target (%)</label>
                  <input
                    type="number" min="0" max="100"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="e.g. 90"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Count */}
            {measurementType === "count" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Baseline</label>
                    <input
                      type="number" min="0"
                      value={baselineValue}
                      onChange={(e) => setBaselineValue(e.target.value)}
                      placeholder="e.g. 2"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Target</label>
                    <input
                      type="number" min="0"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Unit</label>
                    <select
                      value={countUnit}
                      onChange={(e) => setCountUnit(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {COUNT_UNIT_PRESETS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Per</label>
                    <select
                      value={countPer}
                      onChange={(e) => setCountPer(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {COUNT_PER_PRESETS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Duration */}
            {measurementType === "duration" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Baseline</label>
                    <input
                      type="number" min="0"
                      value={baselineValue}
                      onChange={(e) => setBaselineValue(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Target</label>
                    <input
                      type="number" min="0"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="e.g. 180"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unit</label>
                  <div className="flex gap-2">
                    {DURATION_UNIT_PRESETS.map((u) => (
                      <button
                        key={u}
                        onClick={() => setDurationUnit(u)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          durationUnit === u
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scale */}
            {measurementType === "scale" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Scale Preset</label>
                  <div className="space-y-2">
                    {SCALE_PRESETS.map((preset, i) => (
                      <button
                        key={preset.name}
                        onClick={() => { setScalePreset(i); setUseCustomScale(false); setBaselineValue(""); setTargetValue(""); }}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          !useCustomScale && scalePreset === i
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-700">{preset.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {preset.levels.map((l) => l.replace(/_/g, " ")).join(" → ")}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => setUseCustomScale(true)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                        useCustomScale
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-700">Custom Scale</div>
                      <div className="text-xs text-gray-400 mt-0.5">Define your own ordered levels</div>
                    </button>
                  </div>
                </div>

                {useCustomScale && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Custom Levels (lowest to highest)</label>
                    <div className="space-y-1.5">
                      {customLevels.map((level, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-5">{i + 1}.</span>
                          <input
                            value={level}
                            onChange={(e) => {
                              const updated = [...customLevels];
                              updated[i] = e.target.value;
                              setCustomLevels(updated);
                            }}
                            placeholder={`Level ${i + 1}`}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {customLevels.length > 1 && (
                            <button
                              onClick={() => setCustomLevels(customLevels.filter((_, j) => j !== i))}
                              className="text-gray-300 hover:text-red-400"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setCustomLevels([...customLevels, ""])}
                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                      >
                        + Add level
                      </button>
                    </div>
                  </div>
                )}

                {/* Scale baseline/target */}
                {(() => {
                  const levels = useCustomScale ? customLevels.filter((l) => l.trim()) : SCALE_PRESETS[scalePreset].levels;
                  if (levels.length < 2) return null;
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Baseline</label>
                        <select
                          value={baselineValue}
                          onChange={(e) => setBaselineValue(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select...</option>
                          {levels.map((l) => (
                            <option key={l} value={l}>{l.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Target</label>
                        <select
                          value={targetValue}
                          onChange={(e) => setTargetValue(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select...</option>
                          {levels.map((l) => (
                            <option key={l} value={l}>{l.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Binary */}
            {measurementType === "binary" && (
              <div className="text-sm text-gray-500">
                <p>Baseline will be set to <span className="font-medium text-gray-700">Not achieved</span> and target to <span className="font-medium text-gray-700">Achieved</span>.</p>
                <p className="text-xs text-gray-400 mt-1">No additional configuration needed.</p>
              </div>
            )}

            {/* Custom */}
            {measurementType === "custom" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Measurement Label</label>
                    <input
                      value={customLabel}
                      onChange={(e) => setCustomLabel(e.target.value)}
                      placeholder="e.g. Mean Length of Utterance"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Unit</label>
                    <input
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      placeholder="e.g. words"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Baseline</label>
                    <input
                      value={baselineValue}
                      onChange={(e) => setBaselineValue(e.target.value)}
                      placeholder="e.g. 2.5"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Target</label>
                    <input
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="e.g. 4.0"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Date (optional)</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!goalText.trim() || (goalType === "short_term" && !parentId)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add Goal
          </button>
        </div>
      </div>
    </div>
  );
}
