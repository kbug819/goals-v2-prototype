"use client";

import { useState } from "react";
import { mockGoals, PatientGoal } from "@/data/mockData";
import { V1_MOCK_GOALS, PROMPTING_LEVELS, PROMPTING_TYPES } from "@/data/v1MockData";
import StatusBadge from "@/components/shared/StatusBadge";
import DevNote from "@/components/shared/DevNote";

type NoteFormat = "soap" | "freetext" | "dap" | "freetext_v1goallist" | "freetext_v1goalprogress" | "freetext_v1goaladmin" | "freetext_v1goalcustom" | "freetext_goals" | "freetext_goallist" | "freetext_v2goaladmin" | "freetext_v2goalcustom";

const NOTE_FORMATS: { value: NoteFormat; label: string; shortLabel: string; description: string }[] = [
  { value: "soap", label: "Visit Note - SOAP", shortLabel: "SOAP", description: "Subjective, Objective, Assessment, Plan" },
  { value: "freetext", label: "Visit Note - Free Text", shortLabel: "Free Text", description: "Unstructured clinical narrative" },
  { value: "dap", label: "Visit Note - DAP", shortLabel: "DAP", description: "Data, Assessment, Plan" },
  { value: "freetext_v1goallist", label: "w/ Goal List", shortLabel: "w/ Goal List", description: "Free text narrative with current goal checklist" },
  { value: "freetext_v1goalprogress", label: "w/ Goal Progress", shortLabel: "w/ Goal Progress", description: "Free text narrative with trials and prompting data" },
  { value: "freetext_v1goaladmin", label: "w/ Goal Admin Components", shortLabel: "w/ Goal Admin Components", description: "Free text with goals and admin-configured components per goal" },
  { value: "freetext_v1goalcustom", label: "w/ Goal Custom Components", shortLabel: "w/ Goal Custom Components", description: "Free text with goals and customizable components per goal" },
  { value: "freetext_goals", label: "w/ Goal Progress", shortLabel: "w/ Goal Progress", description: "Free text narrative with structured goal tracking" },
  { value: "freetext_goallist", label: "w/ Goal List", shortLabel: "w/ Goal List", description: "Free text narrative with goal checklist" },
  { value: "freetext_v2goaladmin", label: "w/ Goal Admin Components", shortLabel: "w/ Goal Admin Components", description: "Free text with V2 goals and admin-configured components" },
  { value: "freetext_v2goalcustom", label: "w/ Goal Custom Components", shortLabel: "w/ Goal Custom Components", description: "Free text with V2 goals and customizable components per goal" },
];

const DISCIPLINES = ["Speech", "OT", "PT"];

const PLANS_OF_CARE: Record<string, string[]> = {
  "Speech": ["Speech POC - Mar 2026", "Speech POC - Jan 2026"],
  "OT": ["OT POC - Mar 2026", "OT POC - Jan 2026"],
  "PT": ["PT POC - Feb 2026"],
};

function formatGoalValue(value: string, goal: PatientGoal): string {
  const display = value.replace(/_/g, " ");
  switch (goal.measurement_type) {
    case "percentage": return `${display}%`;
    case "duration": return `${display} ${(goal.measurement_config.unit as string) || "seconds"}`;
    case "count": {
      const unit = (goal.measurement_config.unit as string) || "";
      return `${display} ${unit}`;
    }
    case "binary": return display === "true" ? "Achieved" : "Not achieved";
    default: return display;
  }
}


function V1StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    met: "bg-blue-100 text-blue-700",
    discontinue: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function FreeTextV1GoalList() {
  const activeGoals = V1_MOCK_GOALS.filter((g) => g.status === "active");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
        <textarea rows={6} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-xs font-medium text-gray-500">Goals Addressed <span className="ml-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">Possible new custom form component</span></label>
          <span className="text-xs text-gray-400 italic">Only checked goals will show on the completed visit note</span>
        </div>
        <div className="space-y-2">
          {activeGoals.map((ltg) => (
            <div key={ltg.id}>
              {/* LTG row */}
              <div className={`border rounded-lg px-4 py-3 ${checked[ltg.id] ? "border-indigo-200 bg-indigo-50/30" : "border-gray-200 bg-white"}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked[ltg.id] || false}
                    onChange={(e) => setChecked({ ...checked, [ltg.id]: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        LTG {ltg.version_a}.{ltg.version_b}.{ltg.version_c}
                      </span>
                      <V1StatusBadge status={ltg.status} />
                      <span className="text-xs text-gray-400">Baseline: {ltg.baseline}% &rarr; Target: {ltg.target}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{ltg.goal}</p>
                    <div className="text-xs text-gray-400 mt-1">Target date: {ltg.target_date}</div>
                  </div>
                </label>
                {checked[ltg.id] && (
                  <div className="mt-2 ml-7">
                    <textarea
                      value={notes[ltg.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [ltg.id]: e.target.value })}
                      rows={2}
                      placeholder="Notes for this goal..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* STG children */}
              {ltg.children.filter((s) => s.status === "active").map((stg) => (
                <div key={stg.id} className={`ml-6 mt-1.5 border rounded-lg px-4 py-3 ${checked[stg.id] ? "border-indigo-200 bg-indigo-50/30" : "border-gray-100 bg-white"}`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked[stg.id] || false}
                      onChange={(e) => setChecked({ ...checked, [stg.id]: e.target.checked })}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                          STG {stg.version_a}.{stg.version_b}.{stg.version_c}
                        </span>
                        <V1StatusBadge status={stg.status} />
                        <span className="text-xs text-gray-400">Baseline: {stg.baseline}% &rarr; Target: {stg.target}%</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{stg.goal}</p>
                    </div>
                  </label>
                  {checked[stg.id] && (
                    <div className="mt-2 ml-7">
                      <textarea
                        value={notes[stg.id] || ""}
                        onChange={(e) => setNotes({ ...notes, [stg.id]: e.target.value })}
                        rows={2}
                        placeholder="Notes for this goal..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


type V1GoalUpdate = { activity: string; correct: string; total: string; promptLevel: string; promptTypes: string[] };

function FreeTextV1GoalProgress() {
  const activeGoals = V1_MOCK_GOALS.filter((g) => g.status === "active");
  const [drafts, setDrafts] = useState<Record<string, V1GoalUpdate>>({});
  const [saved, setSaved] = useState<Record<string, V1GoalUpdate>>({});

  function updateField(goalId: string, field: string, val: string | string[]) {
    const newVal = field === "promptTypes" && typeof val === "string" ? (val ? [val] : []) : val;
    setDrafts({ ...drafts, [goalId]: { ...drafts[goalId], [field]: newVal } as V1GoalUpdate });
  }

  function saveGoal(goalId: string) {
    if (drafts[goalId]) {
      setSaved({ ...saved, [goalId]: drafts[goalId] });
      const next = { ...drafts };
      delete next[goalId];
      setDrafts(next);
    }
  }

  function editGoal(goalId: string) {
    if (saved[goalId]) {
      setDrafts({ ...drafts, [goalId]: saved[goalId] });
      const next = { ...saved };
      delete next[goalId];
      setSaved(next);
    }
  }

  function deleteGoal(goalId: string) {
    const nextSaved = { ...saved };
    delete nextSaved[goalId];
    setSaved(nextSaved);
    const nextDrafts = { ...drafts };
    delete nextDrafts[goalId];
    setDrafts(nextDrafts);
  }


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
        <textarea rows={6} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Goal Progress <span className="ml-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">Possible new custom form component</span></h3>
          <span className="text-xs text-gray-400">{Object.keys(saved).length} of {activeGoals.length + activeGoals.reduce((n, g) => n + g.children.filter((c) => c.status === "active").length, 0)} updated</span>
        </div>

        <div className="space-y-3">
          {activeGoals.map((ltg) => (
            <div key={ltg.id}>
              {/* LTG */}
              <GoalProgressCard label={`LTG ${ltg.version_a}.${ltg.version_b}.${ltg.version_c}`} goalText={ltg.goal} baseline={ltg.baseline} target={ltg.target} status={ltg.status} draft={drafts[ltg.id]} savedData={saved[ltg.id]} onUpdateField={(f, v) => updateField(ltg.id, f, v)} onSave={() => saveGoal(ltg.id)} onEdit={() => editGoal(ltg.id)} onDelete={() => deleteGoal(ltg.id)} isChild={false} />

              {/* STG children */}
              {ltg.children.filter((s) => s.status === "active").map((stg) => (
                <GoalProgressCard key={stg.id} label={`STG ${stg.version_a}.${stg.version_b}.${stg.version_c}`} goalText={stg.goal} baseline={stg.baseline} target={stg.target} status={stg.status} draft={drafts[stg.id]} savedData={saved[stg.id]} onUpdateField={(f, v) => updateField(stg.id, f, v)} onSave={() => saveGoal(stg.id)} onEdit={() => editGoal(stg.id)} onDelete={() => deleteGoal(stg.id)} isChild={true} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoalProgressCard({ label, goalText, baseline, target, status, draft, savedData, onUpdateField, onSave, onEdit, onDelete, isChild }: {
  label: string;
  goalText: string;
  baseline: number;
  target: number;
  status: string;
  draft?: V1GoalUpdate;
  savedData?: V1GoalUpdate;
  onUpdateField: (field: string, val: string) => void;
  onSave: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isChild: boolean;
}) {
  const isSaved = !!savedData;
  const isEditing = !!draft;
  const displayData = savedData || draft;
  const accuracy = displayData?.correct && displayData?.total ? `${((parseInt(displayData.correct) / parseInt(displayData.total)) * 100).toFixed(0)}%` : null;

  return (
    <div className={`${isChild ? "ml-6 mt-1.5" : ""}`}>
      <div className={`border rounded-lg px-4 py-3 ${isSaved ? "border-amber-300 bg-amber-50/50" : isEditing ? "border-indigo-200 bg-white" : "border-gray-200 bg-white"}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`text-xs font-mono font-bold ${isChild ? "text-indigo-500" : "text-indigo-600"} bg-indigo-50 px-2 py-0.5 rounded`}>
              {label}
            </span>
            <V1StatusBadge status={status} />
            <span className="text-xs text-gray-400">Baseline: {baseline}% &rarr; Target: {target}%</span>
            {isSaved && accuracy && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs font-medium text-amber-700">Accuracy: {accuracy}</span>
              </>
            )}
          </div>
          {isSaved && (
            <div className="flex items-center gap-1.5">
              <button onClick={() => onEdit()} className="text-gray-400 hover:text-indigo-500 transition-colors" title="Edit">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => onDelete()} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed truncate">{goalText}</p>

        {/* Saved summary */}
        {isSaved && savedData && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {savedData.activity && <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">{savedData.activity}</span>}
            {savedData.correct && savedData.total && <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">{savedData.correct}/{savedData.total} ({accuracy})</span>}
            {savedData.promptLevel && <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">{savedData.promptLevel}</span>}
            {savedData.promptTypes?.[0] && <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">{savedData.promptTypes[0]}</span>}
          </div>
        )}

        {/* Editing form */}
        {isEditing && (
          <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Therapy Activity</label>
              <input value={draft?.activity || ""} onChange={(e) => onUpdateField("activity", e.target.value)} placeholder="e.g. Articulation drills, Story retell" className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Correct Trials</label>
                <input type="number" min="0" value={draft?.correct || ""} onChange={(e) => onUpdateField("correct", e.target.value)} placeholder="e.g. 8" className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Total Trials</label>
                <input type="number" min="0" value={draft?.total || ""} onChange={(e) => onUpdateField("total", e.target.value)} placeholder="e.g. 10" className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            {draft?.correct && draft?.total && (
              <div className="text-xs text-green-600 font-medium">
                Response Accuracy: {draft.correct}/{draft.total} ({((parseInt(draft.correct) / parseInt(draft.total)) * 100).toFixed(0)}%)
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Prompting Level</label>
                <select value={draft?.promptLevel || ""} onChange={(e) => onUpdateField("promptLevel", e.target.value)} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select...</option>
                  {PROMPTING_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Prompting Type</label>
                <select value={draft?.promptTypes?.[0] || ""} onChange={(e) => onUpdateField("promptTypes", e.target.value)} className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select...</option>
                  {PROMPTING_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => onSave()} className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                Update
              </button>
            </div>
          </div>
        )}

        {/* Click to start editing */}
        {!isSaved && !isEditing && (
          <button onClick={() => onUpdateField("activity", "")} className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 font-medium">
            + Add therapy activity
          </button>
        )}
      </div>
    </div>
  );
}

const CUSTOM_COMPONENT_OPTIONS = [
  { value: "text_area", label: "Text Area" },
  { value: "trials", label: "Trials (Correct / Total)" },
  { value: "prompting", label: "Prompting Level & Type" },
  { value: "scale", label: "Scale / Rating" },
  { value: "checkboxes", label: "Checkboxes" },
  { value: "select_dropdown", label: "Dropdown Select" },
];

function FreeTextV1GoalAdmin() {
  const activeGoals = V1_MOCK_GOALS.filter((g) => g.status === "active");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
        <textarea rows={6} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Goals w/ Admin Selected Components
            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">Possible new custom form component</span>
          </h3>
          <span className="text-xs text-gray-400 italic">Showing active goals and custom radio button.</span>
        </div>

        <div className="space-y-3">
          {activeGoals.map((ltg) => (
            <div key={ltg.id}>
              <div className="border border-gray-200 rounded-lg px-4 py-3 bg-white">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG {ltg.version_a}.{ltg.version_b}.{ltg.version_c}</span>
                  <V1StatusBadge status={ltg.status} />
                  <span className="text-xs text-gray-400">Baseline: {ltg.baseline}% &rarr; Target: {ltg.target}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{ltg.goal}</p>

                {/* Admin-configured components - same for every goal */}
                <div className="mt-3 space-y-2">
                  <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Progress Status</label>
                    <div className="flex gap-2">
                      {["Progressing", "Plateau", "Regression", "Met"].map((opt) => (
                        <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name={`status-${ltg.id}`} className="w-3.5 h-3.5 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                          <span className="text-xs text-gray-600">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Session Notes</label>
                    <textarea rows={2} placeholder="Notes for this goal..." className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  </div>
                </div>
              </div>

              {/* STG children */}
              {ltg.children.filter((s) => s.status === "active").map((stg) => (
                <div key={stg.id} className="ml-6 mt-1.5 border border-gray-100 rounded-lg px-4 py-3 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">STG {stg.version_a}.{stg.version_b}.{stg.version_c}</span>
                    <V1StatusBadge status={stg.status} />
                    <span className="text-xs text-gray-400">Baseline: {stg.baseline}% &rarr; Target: {stg.target}%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{stg.goal}</p>
                  <div className="mt-3 space-y-2">
                    <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Progress Status</label>
                      <div className="flex gap-2">
                        {["Progressing", "Plateau", "Regression", "Met"].map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name={`status-${stg.id}`} className="w-3.5 h-3.5 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-xs text-gray-600">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Session Notes</label>
                      <textarea rows={2} placeholder="Notes for this goal..." className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FreeTextV1GoalCustom() {
  const activeGoals = V1_MOCK_GOALS.filter((g) => g.status === "active");
  const [goalComponents, setGoalComponents] = useState<Record<string, string[]>>({});
  const [addingFor, setAddingFor] = useState<string | null>(null);

  function addComponent(goalId: string, componentType: string) {
    const current = goalComponents[goalId] || [];
    setGoalComponents({ ...goalComponents, [goalId]: [...current, componentType] });
    setAddingFor(null);
  }

  function removeComponent(goalId: string, index: number) {
    const current = [...(goalComponents[goalId] || [])];
    current.splice(index, 1);
    setGoalComponents({ ...goalComponents, [goalId]: current });
  }

  function renderComponent(type: string, goalId: string, index: number) {
    return (
      <div key={`${goalId}-${index}`} className="border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">{CUSTOM_COMPONENT_OPTIONS.find((c) => c.value === type)?.label}</span>
          <button onClick={() => removeComponent(goalId, index)} className="text-gray-300 hover:text-red-500 transition-colors" title="Remove component">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {type === "text_area" && (
          <textarea rows={2} placeholder="Enter notes..." className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
        )}
        {type === "trials" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Correct</label>
              <input type="number" min="0" placeholder="e.g. 8" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Total</label>
              <input type="number" min="0" placeholder="e.g. 10" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        )}
        {type === "prompting" && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Level</label>
              <select className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select...</option>
                {PROMPTING_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-0.5">Type</label>
              <select className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select...</option>
                {PROMPTING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        )}
        {type === "scale" && (
          <div>
            <label className="block text-xs text-gray-400 mb-0.5">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} className="w-8 h-8 text-sm border border-gray-200 rounded hover:bg-indigo-50 hover:border-indigo-300 transition-colors">{n}</button>
              ))}
            </div>
          </div>
        )}
        {type === "checkboxes" && (
          <div className="space-y-1">
            {["Achieved target", "Needs modification", "Carryover noted", "Parent/caregiver involved"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-xs text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        )}
        {type === "select_dropdown" && (
          <select className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select...</option>
            <option value="progressing">Progressing</option>
            <option value="plateau">Plateau</option>
            <option value="regression">Regression</option>
            <option value="met">Met</option>
          </select>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
        <textarea rows={6} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Goals w/ Custom Components
            <span className="ml-2 text-xs font-medium text-violet-600 bg-violet-100 rounded-full px-2 py-0.5">Possible future iteration</span>
          </h3>
          <span className="text-xs text-gray-400 italic">Add any component type under each goal</span>
        </div>

        <div className="space-y-3">
          {activeGoals.map((ltg) => (
            <div key={ltg.id}>
              {/* LTG */}
              <div className="border border-gray-200 rounded-lg px-4 py-3 bg-white">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG {ltg.version_a}.{ltg.version_b}.{ltg.version_c}</span>
                  <V1StatusBadge status={ltg.status} />
                  <span className="text-xs text-gray-400">Baseline: {ltg.baseline}% &rarr; Target: {ltg.target}%</span>
                </div>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{ltg.goal}</p>

                {/* Added components */}
                {(goalComponents[ltg.id] || []).length > 0 && (
                  <div className="mt-2 space-y-2">
                    {(goalComponents[ltg.id] || []).map((comp, i) => renderComponent(comp, ltg.id, i))}
                  </div>
                )}

                {/* Add component button */}
                <div className="mt-2">
                  {addingFor === ltg.id ? (
                    <div className="flex flex-wrap gap-1.5">
                      {CUSTOM_COMPONENT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => addComponent(ltg.id, opt.value)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          + {opt.label}
                        </button>
                      ))}
                      <button onClick={() => setAddingFor(null)} className="px-2.5 py-1 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingFor(ltg.id)}
                      className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add component
                    </button>
                  )}
                </div>
              </div>

              {/* STG children */}
              {ltg.children.filter((s) => s.status === "active").map((stg) => (
                <div key={stg.id} className="ml-6 mt-1.5 border border-gray-100 rounded-lg px-4 py-3 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">STG {stg.version_a}.{stg.version_b}.{stg.version_c}</span>
                    <V1StatusBadge status={stg.status} />
                    <span className="text-xs text-gray-400">Baseline: {stg.baseline}% &rarr; Target: {stg.target}%</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{stg.goal}</p>

                  {(goalComponents[stg.id] || []).length > 0 && (
                    <div className="mt-2 space-y-2">
                      {(goalComponents[stg.id] || []).map((comp, i) => renderComponent(comp, stg.id, i))}
                    </div>
                  )}

                  <div className="mt-2">
                    {addingFor === stg.id ? (
                      <div className="flex flex-wrap gap-1.5">
                        {CUSTOM_COMPONENT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => addComponent(stg.id, opt.value)}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                          >
                            + {opt.label}
                          </button>
                        ))}
                        <button onClick={() => setAddingFor(null)} className="px-2.5 py-1 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingFor(stg.id)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add component
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function V2GoalCard({ goal, children: childGoals }: { goal: PatientGoal; children: PatientGoal[] }) {
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  const latestEvent = goal.events.length > 0 ? goal.events[goal.events.length - 1] : null;
  const latestDp = goal.data_points.length > 0 ? goal.data_points[goal.data_points.length - 1] : null;
  const isChild = goal.goal_type === "short_term";

  return (
    <div className={isChild ? "ml-6 border-l-2 border-indigo-100 pl-4 mt-2" : ""}>
      <div className="border border-gray-200 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${goal.current_status === "active" ? "text-green-600 bg-green-50" : goal.current_status === "met" ? "text-blue-600 bg-blue-50" : "text-gray-600 bg-gray-100"}`}>{goal.current_status}</span>
          <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
          {latestDp ? (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">Current: {formatGoalValue(latestDp.value, goal)}</span>
            </>
          ) : null}
        </div>
        <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{goal.goal_text}</p>
        {latestEvent?.current_functional_level ? (
          <div className="text-xs text-gray-500 mt-1"><span className="font-medium text-gray-600">Function:</span> {latestEvent.current_functional_level}</div>
        ) : null}
      </div>
      {childGoals.map((child) => (
        <V2GoalCard key={child.id} goal={child}>{[]}</V2GoalCard>
      ))}
    </div>
  );
}

function FreeTextV2GoalAdmin() {
  const speechGoals = mockGoals.filter((g) => g.discipline === "Speech" && g.current_status === "active" && g.goal_type !== "short_term");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
        <textarea rows={6} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Goals w/ Admin Selected Components</h3>
          <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">Possible new custom form component</span>
        </div>
        <div className="space-y-3">
          {speechGoals.map((goal) => (
            <div key={goal.id}>
              <div className="border border-gray-200 rounded-lg px-4 py-3 bg-white">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">LTG {goal.version_a}.{goal.version_b}.{goal.version_c}</span>
                  <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">active</span>
                  <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
                  {goal.data_points.length > 0 ? <span className="text-xs text-gray-400">Current: {formatGoalValue(goal.data_points[goal.data_points.length - 1].value, goal)}</span> : null}
                </div>
                <p className="text-sm text-gray-600 mt-1.5">{goal.goal_text}</p>
                <div className="mt-3 space-y-2">
                  <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Progress Status</label>
                    <div className="flex gap-2">
                      {["Progressing", "Plateau", "Regression", "Met"].map((opt) => (
                        <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" name={`v2status-${goal.id}`} className="w-3.5 h-3.5 border-gray-300 text-indigo-600" />
                          <span className="text-xs text-gray-600">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Session Notes</label>
                    <textarea rows={2} placeholder="Notes for this goal..." className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  </div>
                </div>
              </div>
              {goal.children.filter((c) => c.current_status === "active").map((child) => (
                <div key={child.id} className="ml-6 mt-1.5 border border-gray-100 rounded-lg px-4 py-3 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">STG {child.version_a}.{child.version_b}.{child.version_c}</span>
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">active</span>
                    <span className="text-xs text-gray-400 capitalize">{child.measurement_type}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{child.goal_text}</p>
                  <div className="mt-3 space-y-2">
                    <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Progress Status</label>
                      <div className="flex gap-2">
                        {["Progressing", "Plateau", "Regression", "Met"].map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input type="radio" name={`v2status-${child.id}`} className="w-3.5 h-3.5 border-gray-300 text-indigo-600" />
                            <span className="text-xs text-gray-600">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded px-3 py-2 bg-gray-50/50">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Session Notes</label>
                      <textarea rows={2} placeholder="Notes for this goal..." className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FreeTextV2GoalCustom() {
  const speechGoals = mockGoals.filter((g) => g.discipline === "Speech" && g.current_status === "active" && g.goal_type !== "short_term");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
        <textarea rows={6} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Goals w/ Custom Components</h3>
          <span className="text-xs font-medium text-violet-600 bg-violet-100 rounded-full px-2 py-0.5">Possible future iteration</span>
        </div>
        <p className="text-xs text-gray-400 italic mb-3">Therapists can dynamically add components per goal. Uses V2 measurement types and functional levels.</p>
        <div className="space-y-3">
          {speechGoals.map((goal) => (
            <div key={goal.id}>
              <V2GoalCard goal={goal}>{goal.children.filter((c) => c.current_status === "active")}</V2GoalCard>
              <div className="mt-1 ml-1">
                <button className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add component
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FreeTextGoalProgress() {
  const [updates, setUpdates] = useState<Record<string, { value: string; activity: string; note: string }>>({});

  // Get active Speech goals
  const speechGoals: PatientGoal[] = [];
  for (const g of mockGoals) {
    if (g.discipline === "Speech" && g.current_status === "active") {
      speechGoals.push(g);
      for (const c of g.children) {
        if (c.current_status === "active") speechGoals.push(c);
      }
    }
  }

  function updateField(goalId: string, field: "value" | "activity" | "note", val: string) {
    setUpdates({ ...updates, [goalId]: { ...updates[goalId], [field]: val } });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
        <textarea rows={6} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>

      {/* Goal Progress - always visible */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Goal Progress <span className="ml-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">Possible new custom form component</span></h3>
          <span className="text-xs text-gray-400">{Object.values(updates).filter((u) => u.value).length} of {speechGoals.length} updated</span>
        </div>
          <div className="space-y-2">
            {speechGoals.map((goal) => {
              const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
              const latestDataPoint = goal.data_points[goal.data_points.length - 1];
              const update = updates[goal.id];
              const hasUpdate = update?.value?.trim();

              return (
                <div
                  key={goal.id}
                  className={`border rounded-lg px-4 py-3 ${
                    hasUpdate ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white"
                  } ${goal.goal_type === "short_term" ? "ml-6" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0">
                        {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
                      </span>
                      <StatusBadge status={goal.current_status} />
                      <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
                      {latestDataPoint && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-xs text-gray-500">Last: {formatGoalValue(latestDataPoint.value, goal)}</span>
                        </>
                      )}
                    </div>
                    {hasUpdate && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed truncate">{goal.goal_text}</p>

                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-0.5">Measurement</label>
                      <input
                        value={update?.value || ""}
                        onChange={(e) => updateField(goal.id, "value", e.target.value)}
                        placeholder={goal.measurement_type === "percentage" ? "e.g. 75" : goal.measurement_type === "scale" ? "e.g. moderate assist" : "Value"}
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-0.5">Activity</label>
                      <input
                        value={update?.activity || ""}
                        onChange={(e) => updateField(goal.id, "activity", e.target.value)}
                        placeholder="e.g. Articulation drills"
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-0.5">Note</label>
                      <input
                        value={update?.note || ""}
                        onChange={(e) => updateField(goal.id, "note", e.target.value)}
                        placeholder="Optional"
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
}

function FreeTextGoalList() {
  // Get active Speech goals
  const speechGoals: PatientGoal[] = [];
  for (const g of mockGoals) {
    if (g.discipline === "Speech" && g.current_status === "active") {
      speechGoals.push(g);
      for (const c of g.children) {
        if (c.current_status === "active") speechGoals.push(c);
      }
    }
  }

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
        <textarea rows={6} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-xs font-medium text-gray-500">Goals Addressed <span className="ml-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">Possible new custom form component</span></label>
          <span className="text-xs text-gray-400 italic">Only checked goals will show on the completed visit note</span>
        </div>
        <div className="space-y-2">
          {speechGoals.map((goal) => {
            const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
            const isChecked = checked[goal.id] || false;

            return (
              <div
                key={goal.id}
                className={`border rounded-lg px-4 py-3 ${
                  isChecked ? "border-indigo-200 bg-indigo-50/30" : "border-gray-200 bg-white"
                } ${goal.goal_type === "short_term" ? "ml-6" : ""}`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setChecked({ ...checked, [goal.id]: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{goal.goal_text}</p>
                  </div>
                </label>
                {isChecked && (
                  <div className="mt-2 ml-7">
                    <textarea
                      value={notes[goal.id] || ""}
                      onChange={(e) => setNotes({ ...notes, [goal.id]: e.target.value })}
                      rows={2}
                      placeholder="Notes for this goal..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NoteForm({ format }: { format: NoteFormat }) {
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:30");
  const [discipline, setDiscipline] = useState("Speech");
  const [planOfCare, setPlanOfCare] = useState("");
  const [showPriorNote, setShowPriorNote] = useState(false);
  const [showPoc, setShowPoc] = useState(false);

  const pocs = PLANS_OF_CARE[discipline] || [];

  return (
    <div className="flex gap-5">
      {/* Left column - form */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg">
        {/* Session details - vertical */}
        <div className="px-5 py-4 border-b border-gray-200 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Discipline</label>
            <select
              value={discipline}
              onChange={(e) => { setDiscipline(e.target.value); setPlanOfCare(""); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Plan of Care</label>
            <select
              value={planOfCare}
              onChange={(e) => setPlanOfCare(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a plan of care...</option>
              {pocs.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Note content area */}
        <div className="px-5 py-4 border-t border-gray-200 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Note</h3>

          {format === "soap" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Subjective</label>
                <textarea rows={3} placeholder="Patient/caregiver report, observations on arrival..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Objective</label>
                <textarea rows={3} placeholder="Activities performed, measurements taken, clinical observations..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Assessment</label>
                <textarea rows={3} placeholder="Clinical interpretation, progress analysis, response to treatment..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Plan</label>
                <textarea rows={3} placeholder="Next steps, modifications, frequency, next session date..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
            </div>
          )}

          {format === "dap" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Data</label>
                <textarea rows={4} placeholder="Objective and subjective data collected during the session..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Assessment</label>
                <textarea rows={3} placeholder="Clinical interpretation and progress toward goals..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Plan</label>
                <textarea rows={3} placeholder="Next steps, modifications, frequency, next session date..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
            </div>
          )}

          {format === "freetext" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Clinical Note</label>
              <textarea rows={10} placeholder="Write your clinical note here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
          )}

          {format === "freetext_v1goallist" && (
            <FreeTextV1GoalList />
          )}

          {format === "freetext_v1goalprogress" && (
            <FreeTextV1GoalProgress />
          )}

          {format === "freetext_v1goaladmin" && (
            <FreeTextV1GoalAdmin />
          )}

          {format === "freetext_v1goalcustom" && (
            <FreeTextV1GoalCustom />
          )}
          {format === "freetext_goals" && (
            <FreeTextGoalProgress />
          )}

          {format === "freetext_goallist" && (
            <FreeTextGoalList />
          )}

          {format === "freetext_v2goaladmin" && (
            <FreeTextV2GoalAdmin />
          )}

          {format === "freetext_v2goalcustom" && (
            <FreeTextV2GoalCustom />
          )}
        </div>

        {/* Additional custom form components - hide on goal-specific formats */}
        {format !== "freetext_v1goallist" && format !== "freetext_v1goalprogress" && format !== "freetext_v1goaladmin" && format !== "freetext_v1goalcustom" && format !== "freetext_goals" && format !== "freetext_goallist" && format !== "freetext_v2goaladmin" && format !== "freetext_v2goalcustom" && (
        <div className="px-5 py-4 border-t border-gray-200 space-y-4">
          {/* Diagnosis Codes (smart component) */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-medium text-gray-500">Diagnosis Codes</label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">
                F80.2 - Mixed receptive-expressive language disorder
                <button className="text-gray-400 hover:text-gray-600">&times;</button>
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 rounded-full px-2.5 py-1">
                R48.8 - Other symbolic dysfunctions
                <button className="text-gray-400 hover:text-gray-600">&times;</button>
              </span>
              <button className="text-xs text-indigo-500 hover:text-indigo-700">+ Add code</button>
            </div>
          </div>

          {/* Prognosis (smart component) */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <label className="text-xs font-medium text-gray-500">Prognosis</label>
            </div>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select prognosis...</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="guarded">Guarded</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          {/* Therapy Recommendations (checkboxes) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Therapy Recommendations</label>
            <div className="space-y-1.5">
              {["Continue current plan of care", "Modify treatment approach", "Increase frequency", "Decrease frequency", "Discharge from services", "Refer to another discipline"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-600">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Patient/Caregiver Education (toggles) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Patient/Caregiver Education Provided</label>
            <div className="flex flex-wrap gap-2">
              {["Home program", "Safety precautions", "Equipment use", "Activity modification", "Caregiver training"].map((opt) => (
                <label key={opt} className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-xs text-gray-600">
                  <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Next Session (date input) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Next Session Date</label>
            <input type="date" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          {/* Additional Notes (text area) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Additional Notes</label>
            <textarea rows={2} placeholder="Any additional clinical notes..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
        </div>
        )}

        {/* Auto-summary checkbox + Save button */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-xs text-gray-600">Automatically generate a summary of the session that is patient- and caregiver-friendly</span>
          </label>
          <button
            disabled
            className="px-4 py-2 text-sm font-medium text-white bg-gray-300 rounded-lg cursor-not-allowed flex-shrink-0 ml-4"
          >
            Save Visit Note
          </button>
        </div>
      </div>

      {/* Right sidebar - hide on formats with inline goals */}
      {format !== "freetext_goals" && format !== "freetext_goallist" && format !== "freetext_v1goallist" && format !== "freetext_v1goalprogress" && format !== "freetext_v1goaladmin" && format !== "freetext_v1goalcustom" && format !== "freetext_v2goaladmin" && format !== "freetext_v2goalcustom" && <div className="w-72 flex-shrink-0 space-y-3">
        {/* Load a prior note */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowPriorNote(!showPriorNote)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-indigo-700">Load a prior note</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showPriorNote ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showPriorNote && (
            <div className="px-4 py-3 border-t border-gray-100">
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select a prior note...</option>
                <option value="vn-1">Jane Demo: 04/02/2026 at 10:30 AM</option>
                <option value="vn-2">Jane Demo: 03/26/2026 at 10:00 AM</option>
                <option value="vn-3">Jane Demo: 03/19/2026 at 10:30 AM</option>
              </select>
              <div className="flex justify-end mt-2">
                <button className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors">
                  Use chosen previous note
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current plan of care */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowPoc(!showPoc)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-indigo-700">Current plan of care (POC)</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showPoc ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showPoc && (
            <div className="px-4 py-3 border-t border-gray-100">
              {planOfCare ? (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-600">{planOfCare}</p>

                  {/* Mock LTG 1 with STGs */}
                  <div className="space-y-1.5">
                    <div className="border border-gray-200 rounded px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-indigo-600">LTG 1.0.0</span>
                        <span className="text-xs text-gray-400">percentage</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Patient will improve articulation of /r/ sound across all word positions with 90% accuracy.</p>
                      <div className="text-xs text-gray-400 mt-1">Baseline: 45% &rarr; Target: 90%</div>
                    </div>
                    <div className="ml-4 border-l-2 border-indigo-100 pl-2 space-y-1.5">
                      <div className="border border-gray-100 rounded px-2.5 py-1.5">
                        <span className="text-xs font-mono font-bold text-indigo-500">STG 1.1.0</span>
                        <p className="text-xs text-gray-500 mt-0.5">Produce /r/ in initial position with 90% accuracy given minimal verbal cues.</p>
                        <div className="text-xs text-gray-400 mt-0.5">Baseline: 30% &rarr; Target: 90%</div>
                      </div>
                      <div className="border border-gray-100 rounded px-2.5 py-1.5">
                        <span className="text-xs font-mono font-bold text-indigo-500">STG 1.2.0</span>
                        <p className="text-xs text-gray-500 mt-0.5">Produce /r/ in final position with 90% accuracy given minimal verbal cues.</p>
                        <div className="text-xs text-gray-400 mt-0.5">Baseline: 40% &rarr; Target: 90%</div>
                      </div>
                    </div>
                  </div>

                  {/* Mock LTG 2 */}
                  <div className="space-y-1.5">
                    <div className="border border-gray-200 rounded px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-indigo-600">LTG 2.0.0</span>
                        <span className="text-xs text-gray-400">scale</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Patient will improve expressive language skills to formulate age-appropriate sentences with minimal assistance.</p>
                      <div className="text-xs text-gray-400 mt-1">Baseline: maximal assist &rarr; Target: independent</div>
                    </div>
                  </div>

                  {/* Mock LTG 3 with STG */}
                  <div className="space-y-1.5">
                    <div className="border border-gray-200 rounded px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-indigo-600">LTG 3.0.0</span>
                        <span className="text-xs text-gray-400">custom</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Patient will increase MLU from 2.5 to 4.0 words per utterance in spontaneous speech.</p>
                      <div className="text-xs text-gray-400 mt-1">Baseline: 2.5 words &rarr; Target: 4.0 words</div>
                    </div>
                    <div className="ml-4 border-l-2 border-indigo-100 pl-2">
                      <div className="border border-gray-100 rounded px-2.5 py-1.5">
                        <span className="text-xs font-mono font-bold text-indigo-500">STG 3.1.0</span>
                        <p className="text-xs text-gray-500 mt-0.5">Use 3+ word utterances with descriptors in 80% of spontaneous attempts.</p>
                        <div className="text-xs text-gray-400 mt-0.5">Baseline: 30% &rarr; Target: 80%</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-100 text-gray-600 text-xs rounded-lg px-3 py-2.5 text-center">
                  This patient doesn&apos;t appear to have a current plan of care
                </div>
              )}
            </div>
          )}
        </div>
      </div>}
    </div>
  );
}

const VNCF_FORMATS = NOTE_FORMATS.filter((f) => ["soap", "freetext", "dap", "freetext_v1goallist", "freetext_v1goalprogress", "freetext_v1goaladmin", "freetext_v1goalcustom"].includes(f.value));
const V2_FORMATS = NOTE_FORMATS.filter((f) => ["soap", "freetext", "dap", "freetext_goals", "freetext_goallist", "freetext_v2goaladmin", "freetext_v2goalcustom"].includes(f.value));

export default function VisitNoteNewView({ project = "goals_v2" }: { project?: "vncf" | "goals_v2" | "progress_reports" }) {
  const visibleFormats = project === "vncf" ? VNCF_FORMATS : V2_FORMATS;
  const [selectedFormat, setSelectedFormat] = useState<NoteFormat>("soap");

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description='This page previews the new visit note creation flow. Use the "Showing" buttons to switch between possible visit note custom forms. "w/ Goal Admin Components" uses components pre-configured by org admins in the Custom Form Editor (per user request). "w/  Goals Custom Components" allows therapists to dynamically add components per goal at fill time (possible future iteration, but would be cool.'
        todos={["Will we still have the 'Load a prior note' and 'Current plan of care (POC) buttons? Added below but can remove if needed.",
          "Anything else that I need to add to the default form here?",
          "Any other new custom component ideas for goals or other new components that we need to outline here?",
          "Will there still be a generate ai summary check box at the bottom of the form?"
        ]}
      />

      {/* Format selector */}
      <div className="flex items-center gap-1.5 mb-6">
        <span className="text-xs text-gray-400 mr-1">Showing:</span>
        {visibleFormats.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedFormat(f.value!)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              selectedFormat === f.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f.shortLabel}
          </button>
        ))}
      </div>

      {/* Title bar */}
      <div className="flex items-center justify-between mb-6 bg-indigo-50 border border-indigo-100 rounded-lg px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900">{NOTE_FORMATS.find((f) => f.value === selectedFormat)?.label}</h2>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Change Form
        </button>
      </div>

      <NoteForm format={selectedFormat} />

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; New Visit Note Preview
        </span>
      </div>
    </div>
  );
}
