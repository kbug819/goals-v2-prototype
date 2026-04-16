"use client";

import { useState } from "react";
import DevNote from "@/components/shared/DevNote";

type ComponentConfig = "goal_list" | "goal_progress" | "goal_admin" | "goal_custom" | null;

function GoalListConfig({ config, onChange, onClose }: { config: { showNotes: boolean; showFunctionalLevel: boolean; showStgNesting: boolean; showMetGoals: boolean }; onChange: (c: typeof config) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Goal Checklist</h2>
          <p className="text-sm text-gray-500 mt-0.5">smart-goals-session-checklist</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <p className="text-xs text-gray-400 mb-1.5">Primary label describing this form field</p>
            <input defaultValue="Goals Addressed" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label hint:</label>
            <p className="text-xs text-gray-400 mb-1.5">Secondary label giving hint as to what this field is for</p>
            <input defaultValue="Check goals addressed this session" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Options:</label>
            <p className="text-xs text-gray-400 mb-1.5">Changes update the preview on the left in real time.</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={config.showNotes} onChange={() => onChange({ ...config, showNotes: !config.showNotes })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Include session notes field per goal</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={config.showFunctionalLevel} onChange={() => onChange({ ...config, showFunctionalLevel: !config.showFunctionalLevel })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Include current functional level field per goal</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={config.showStgNesting} onChange={() => onChange({ ...config, showStgNesting: !config.showStgNesting })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Show STGs nested under LTGs</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={config.showMetGoals} onChange={() => onChange({ ...config, showMetGoals: !config.showMetGoals })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Include met goals (read-only)</span>
              </label>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Data storage</p>
            <p className="text-xs text-gray-500">Creates a <code className="bg-gray-200 px-1 rounded">PatientGoalEvent</code> per checked goal with status &quot;active&quot; (continuation) and the session note as the comment. No measurement data is recorded.</p>
          </div>
        </div>
        <div className="flex justify-between px-6 py-4 border-t border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800">Accept</button>
        </div>
      </div>
    </div>
  );
}

function GoalProgressConfig({ config, onChange, onClose }: { config: { showTrajectory: boolean; showActivity: boolean; showNote: boolean; showStgNesting: boolean }; onChange: (c: typeof config) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Goal Progress</h2>
          <p className="text-sm text-gray-500 mt-0.5">smart-goal-data-collection</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <p className="text-xs text-gray-400 mb-1.5">Primary label describing this form field</p>
            <input defaultValue="Goal Progress" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fields per goal:</label>
            <p className="text-xs text-gray-400 mb-1.5">Changes update the preview on the left in real time.</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked disabled className="w-4 h-4 rounded border-gray-300 text-indigo-600 disabled:opacity-60" />
                <span className="text-sm text-gray-600">Today&apos;s measurement <span className="text-xs text-gray-400">(always on)</span></span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={config.showActivity} onChange={() => onChange({ ...config, showActivity: !config.showActivity })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Activity name</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={config.showNote} onChange={() => onChange({ ...config, showNote: !config.showNote })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Session note</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display options:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={config.showTrajectory} onChange={() => onChange({ ...config, showTrajectory: !config.showTrajectory })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Show measurement trajectory (Baseline / Previous / Current / Target)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={config.showStgNesting} onChange={() => onChange({ ...config, showStgNesting: !config.showStgNesting })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Show STGs nested under LTGs</span>
              </label>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Data storage</p>
            <p className="text-xs text-gray-500">Creates a <code className="bg-gray-200 px-1 rounded">GoalDataPoint</code> per goal with measurement value, activity name, and note. Powers progress charts and progress report visualizations.</p>
          </div>
        </div>
        <div className="flex justify-between px-6 py-4 border-t border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800">Accept</button>
        </div>
      </div>
    </div>
  );
}

interface AdminControl {
  id: string;
  type: "radio" | "textarea" | "checkboxes" | "dropdown" | "short_input" | "toggles";
  label: string;
  options?: string;
}

const CONTROL_TYPES = [
  { value: "radio", label: "Radio Buttons", icon: "O" },
  { value: "textarea", label: "Text Area", icon: "T" },
  { value: "checkboxes", label: "Checkboxes", icon: "V" },
  { value: "dropdown", label: "Select Dropdown", icon: "D" },
  { value: "short_input", label: "Short Input", icon: "I" },
  { value: "toggles", label: "Toggle Buttons", icon: "~" },
];

function GoalAdminConfig({ controls, onChange, onClose }: { controls: AdminControl[]; onChange: (c: AdminControl[]) => void; onClose: () => void }) {
  function addControl(type: string) {
    const ct = CONTROL_TYPES.find((c) => c.value === type);
    const defaults: Record<string, string> = {
      radio: "Progressing,Plateau,Regression,Met",
      checkboxes: "Needs modification,Carryover noted,Home program updated",
      dropdown: "Independent,Min,Mod,Max,Hand-over-hand",
      toggles: "Yes,No",
    };
    onChange([...controls, {
      id: `ctrl-${Date.now()}`,
      type: type as AdminControl["type"],
      label: ct?.label || "Field",
      options: defaults[type] || "",
    }]);
  }

  function removeControl(id: string) {
    onChange(controls.filter((c) => c.id !== id));
  }

  function updateControl(id: string, field: "label" | "options", value: string) {
    onChange(controls.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Goal Admin</h2>
            <span className="text-[10px] text-violet-500 bg-violet-100 rounded px-1.5 py-0.5 font-medium">Future</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">smart-goal-admin-collection — build custom per-goal fields using standard control types</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <input defaultValue="Goals w/ Admin Components" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Controls per goal:</label>
            <p className="text-xs text-gray-400 mb-2">Add standard form controls that will repeat under each active goal. Changes update the preview on the left.</p>

            {controls.length > 0 && (
              <div className="space-y-2 mb-3">
                {controls.map((ctrl) => (
                  <div key={ctrl.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase">{CONTROL_TYPES.find((c) => c.value === ctrl.type)?.label}</span>
                      <button onClick={() => removeControl(ctrl.id)} className="text-gray-400 hover:text-red-500 text-xs">&times; Remove</button>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-0.5">Label</label>
                      <input value={ctrl.label} onChange={(e) => updateControl(ctrl.id, "label", e.target.value)} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    {(ctrl.type === "radio" || ctrl.type === "checkboxes" || ctrl.type === "dropdown" || ctrl.type === "toggles") && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-0.5">Options (comma separated)</label>
                        <input value={ctrl.options || ""} onChange={(e) => updateControl(ctrl.id, "options", e.target.value)} placeholder="Option 1,Option 2,Option 3" className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div>
              <span className="text-xs text-gray-500 block mb-1.5">Add a control:</span>
              <div className="flex flex-wrap gap-1.5">
                {CONTROL_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => addControl(ct.value)}
                    className="px-2.5 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    + {ct.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Data storage</p>
            <p className="text-xs text-gray-500">Per-goal control values stored in <code className="bg-gray-200 px-1 rounded">FormDatum</code> indexed by goal ID. Uses the same standard control rendering as the rest of the custom form system.</p>
          </div>
        </div>
        <div className="flex justify-between px-6 py-4 border-t border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800">Accept</button>
        </div>
      </div>
    </div>
  );
}

function GoalCustomConfig({ config, onChange, onClose }: { config: Record<string, boolean>; onChange: (c: Record<string, boolean>) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Goal Custom</h2>
            <span className="text-[10px] text-violet-500 bg-violet-100 rounded px-1.5 py-0.5 font-medium">Future</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">smart-goal-custom-collection — therapist picks controls per goal at fill time</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <input defaultValue="Goals w/ Custom Components" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="bg-violet-50 rounded-lg px-4 py-3 border border-violet-200">
            <p className="text-xs font-semibold text-violet-700 mb-1">How this works</p>
            <p className="text-xs text-violet-600">Admin selects which control types are available. At fill time, the therapist sees a &quot;+ Add&quot; menu per goal and picks the controls they need for that specific goal. Different goals can have different controls.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available control types for therapist:</label>
            <p className="text-xs text-gray-400 mb-1.5">Check which standard control types the therapist can add per goal. Changes update the preview on the left.</p>
            <div className="space-y-2">
              {CONTROL_TYPES.map((ct) => (
                <label key={ct.value} className="flex items-center gap-2">
                  <input type="checkbox" checked={config[ct.value] !== false} onChange={() => onChange({ ...config, [ct.value]: !config[ct.value] })} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                  <span className="text-sm text-gray-600">{ct.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Data storage</p>
            <p className="text-xs text-gray-500">Per-goal control values stored in <code className="bg-gray-200 px-1 rounded">FormDatum</code> indexed by goal ID. Same storage as Goal Admin — the difference is the therapist builds the field set at fill time, not the admin.</p>
          </div>
        </div>
        <div className="flex justify-between px-6 py-4 border-t border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800">Accept</button>
        </div>
      </div>
    </div>
  );
}

const GOAL_COMPONENTS: { name: string; slug: string; description: string; config: ComponentConfig; future?: boolean }[] = [
  { name: "Goal Checklist", slug: "smart-goals-session-checklist", description: "Checkbox list of active goals with session notes per goal", config: "goal_list" },
  { name: "Goal Progress", slug: "smart-goal-data-collection", description: "Full measurement logging per goal — measurement, activity, note", config: "goal_progress" },
  { name: "Goal Admin", slug: "smart-goal-admin-collection", description: "Admin builds custom per-goal fields from standard control types", config: "goal_admin", future: true },
  { name: "Goal Custom", slug: "smart-goal-custom-collection", description: "Therapist picks controls per goal at fill time", config: "goal_custom", future: true },
];

function FormEditorRow({ type, children, highlight, onGear }: { type: string; children: React.ReactNode; highlight?: boolean; onGear?: () => void }) {
  return (
    <div className={`border-b border-gray-200 ${highlight ? "bg-blue-50/30" : ""}`}>
      <div className="flex items-center justify-between px-4 py-1 bg-slate-100/80 border-b border-slate-200/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 bg-slate-300 rounded-full" />)}</div>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          <span className="font-medium">{type}</span>
        </div>
        <div className="flex items-center gap-2">
          {onGear && (
            <button onClick={onGear} className="text-slate-500 hover:text-slate-700 p-0.5 border-2 border-amber-400 rounded hover:bg-amber-50 transition-colors ring-2 ring-amber-200 ring-offset-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
          <button className="text-xs text-slate-500 border border-slate-300 rounded px-2 py-0.5 hover:bg-slate-200 flex items-center gap-1">
            <span className="text-[10px]">C</span> Clone
          </button>
          <button className="text-slate-400 hover:text-red-500">&times;</button>
        </div>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

interface EditorConfig {
  showTrajectory: boolean;
  showFunctionalLevel: boolean;
  showComment: boolean;
  showStgNesting: boolean;
  shortcuts: { week: boolean; poc: boolean; mo3: boolean; mo6: boolean; yr1: boolean };
  measurementTypes: { percentage: boolean; count: boolean; duration: boolean; scale: boolean; binary: boolean; custom: boolean };
}

function GoalEditorConfig({ config, onChange, onClose }: { config: EditorConfig; onChange: (c: EditorConfig) => void; onClose: () => void }) {
  const toggle = (path: string) => {
    const parts = path.split(".");
    if (parts.length === 1) {
      onChange({ ...config, [parts[0]]: !(config as unknown as Record<string, boolean>)[parts[0]] });
    } else {
      const group = parts[0] as "shortcuts" | "measurementTypes";
      const key = parts[1];
      onChange({ ...config, [group]: { ...config[group], [key]: !(config[group] as Record<string, boolean>)[key] } });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Goal Editor</h2>
          <p className="text-sm text-gray-500 mt-0.5">smart-goals-editor-v2 — changes update the preview on the left</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <input defaultValue="Goals" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Active goal display options:</label>
            <p className="text-xs text-gray-400 mb-1.5">For active goals carried forward from a previous POC, choose what additional information to display alongside the goal text.</p>
            <div className="space-y-2">
              {([["showTrajectory", "Show measurement trajectory (Baseline / Previous / Current / Target)"], ["showFunctionalLevel", "Show current functional level"], ["showComment", "Show previous comment"], ["showStgNesting", "Show STGs nested under LTGs"]] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" checked={config[key]} onChange={() => toggle(key)} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                  <span className="text-sm text-gray-600">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allowed measurement types:</label>
            <p className="text-xs text-gray-400 mb-1.5">Restrict which measurement types therapists can select when creating goals.</p>
            <div className="space-y-2">
              {([["measurementTypes.percentage", "Percentage", "accuracy, success rate (0-100%)"], ["measurementTypes.count", "Count", "trials, reps, feet, occurrences"], ["measurementTypes.duration", "Duration", "seconds, minutes"], ["measurementTypes.scale", "Scale", "assistance levels, cueing levels"], ["measurementTypes.binary", "Binary", "pass/fail, achieved/not achieved"], ["measurementTypes.custom", "Custom", "free-form with custom unit"]] as const).map(([key, label, desc]) => (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" checked={(config[key.split(".")[0] as "measurementTypes"] as Record<string, boolean>)[key.split(".")[1]]} onChange={() => toggle(key)} disabled={key === "measurementTypes.percentage"} className="w-4 h-4 rounded border-gray-300 text-indigo-600 disabled:opacity-60" />
                  <span className={`text-sm text-gray-600 ${key === "measurementTypes.percentage" ? "text-gray-500" : ""}`}>{label} <span className="text-xs text-gray-400">— {desc}{key === "measurementTypes.percentage" ? " (always on)" : ""}</span></span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target date shortcuts <span className="font-normal text-xs text-gray-400">(optional)</span></label>
            <p className="text-xs text-gray-400 mb-1.5">Optional duration shortcuts shown below the target date field when creating a new goal. Therapists can always pick a date manually.</p>
            <div className="space-y-2">
              {([["shortcuts.week", "+1 Week"], ["shortcuts.poc", "End of POC period"], ["shortcuts.mo3", "3 months"], ["shortcuts.mo6", "6 months"], ["shortcuts.yr1", "1 year"]] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" checked={(key.split(".").length === 2 ? (config[key.split(".")[0] as "shortcuts"] as Record<string, boolean>)[key.split(".")[1]] : false)} onChange={() => toggle(key)} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                  <span className="text-sm text-gray-600">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Data storage</p>
            <p className="text-xs text-gray-500">Creates/updates <code className="bg-gray-200 px-1 rounded">PatientGoal</code> records with events, document links, and snapshots on signing. Goals persist independently of the document.</p>
          </div>
        </div>
        <div className="flex justify-between px-6 py-4 border-t border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800">Accept</button>
        </div>
      </div>
    </div>
  );
}

const SETUP_FORMATS = [
  { value: "poc", label: "POC / Eval" },
  { value: "visit_note", label: "Visit Note" },
];

export default function ComponentSetupView() {
  const [openConfig, setOpenConfig] = useState<ComponentConfig>(null);
  const [showEditorConfig, setShowEditorConfig] = useState(false);
  const [setupFormat, setSetupFormat] = useState("poc");
  // Visit note component configs
  const [checklistConfig, setChecklistConfig] = useState({ showNotes: true, showFunctionalLevel: true, showStgNesting: true, showMetGoals: false });
  const [dataCollConfig, setDataCollConfig] = useState({ showTrajectory: true, showActivity: true, showNote: true, showStgNesting: true });
  const [adminControls, setAdminControls] = useState<AdminControl[]>([
    { id: "ctrl-1", type: "radio", label: "Progress Status", options: "Progressing,Plateau,Regression,Met" },
    { id: "ctrl-2", type: "textarea", label: "Session Notes", options: "" },
  ]);
  const [customConfig, setCustomConfig] = useState<Record<string, boolean>>({ radio: true, textarea: true, checkboxes: true, dropdown: true, short_input: true, toggles: true });

  const [editorConfig, setEditorConfig] = useState<EditorConfig>({
    showTrajectory: true,
    showFunctionalLevel: true,
    showComment: true,
    showStgNesting: true,
    shortcuts: { week: true, poc: true, mo3: true, mo6: true, yr1: true },
    measurementTypes: { percentage: true, count: true, duration: true, scale: true, binary: true, custom: true },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="Click the Goal Editor component on the right (or the gear icon on the preview) to configure settings. The preview on the left updates in real time as you toggle options — measurement types, trajectory, functional level, shortcuts, and more."
        todos={[]}
      />

      {/* Format selector */}
      <div className="flex items-center gap-1.5 mb-6">
        <span className="text-xs text-gray-400 mr-1">Showing:</span>
        {SETUP_FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => setSetupFormat(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              setupFormat === f.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* POC / Eval canvas */}
      {setupFormat === "poc" && (
        <>
          <div className="flex items-center justify-between mb-0 bg-slate-100 border border-slate-200 rounded-t-lg px-5 py-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-lg font-semibold text-slate-800">Plan of Care</span>
              <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Form settings">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-600">Plan of care</span>
              <span className="text-xs bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-600">Custom Form Editor</span>
            </div>
          </div>

          <div className="flex gap-0">
            <div className="flex-1 bg-white border border-gray-200 border-t-0 rounded-bl-lg">
              {/* Goal Editor component — live preview */}
              <FormEditorRow type="Smart Component" highlight onGear={() => setShowEditorConfig(true)}>
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-800">Goals</span>
                  <span className="text-xs text-gray-400 ml-2 font-mono">smart-goals-editor-v2</span>
                </div>
                <div className="border border-dashed border-indigo-200 rounded-lg p-3 bg-indigo-50/20 space-y-2">
                  {/* Active goal preview — reads from editorConfig */}
                  <div className="rounded overflow-hidden border border-gray-200">
                    <div className="bg-indigo-100/70 px-3 py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-900">1.0.0 Long Term Goal</span>
                        <span className="text-[10px] text-gray-500">percentage</span>
                      </div>
                      <span className="text-[10px] text-gray-600">Active</span>
                    </div>
                    <div className="bg-gray-50/60 px-3 py-2 space-y-1.5">
                      <p className="text-[10px] text-gray-500">Patient will improve articulation of /r/ sound...</p>
                      {editorConfig.showTrajectory && (
                        <div className="grid grid-cols-4 gap-1">
                          {[{l:"Baseline",v:"45%"},{l:"Previous",v:"52%"},{l:"Current",v:"72%",hl:true},{l:"Target",v:"90%"}].map((c) => (
                            <div key={c.l}>
                              <div className={`text-[9px] font-semibold ${c.hl ? "text-indigo-600" : "text-gray-500"}`}>{c.l}</div>
                              <div className={`border rounded px-1.5 py-0.5 text-[10px] ${c.hl ? "border-indigo-200 bg-indigo-50 font-semibold text-indigo-700" : "border-gray-200 bg-white text-gray-600"}`}>{c.v}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {(editorConfig.showFunctionalLevel || editorConfig.showComment) && (
                        <div className={`grid gap-1 ${editorConfig.showFunctionalLevel && editorConfig.showComment ? "grid-cols-2" : "grid-cols-1"}`}>
                          {editorConfig.showFunctionalLevel && <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-500">Current Functional Level</span></div>}
                          {editorConfig.showComment && <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-500">Previous Comment</span></div>}
                        </div>
                      )}
                      <div className="flex gap-1">
                        <span className="text-[9px] text-indigo-600 border border-indigo-200 rounded px-1.5 py-0.5">Continue</span>
                        <span className="text-[9px] text-green-600 border border-green-200 rounded px-1.5 py-0.5">Met</span>
                        <span className="text-[9px] text-red-600 border border-red-200 rounded px-1.5 py-0.5">Discontinue</span>
                      </div>
                    </div>
                  </div>
                  {/* STG child */}
                  {editorConfig.showStgNesting && (
                    <div className="ml-4 rounded overflow-hidden border border-gray-200">
                      <div className="bg-indigo-100/70 px-3 py-1 flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">&#8627;</span>
                        <span className="text-[10px] font-bold text-indigo-800">1.1.0 Short Term Goal</span>
                      </div>
                    </div>
                  )}
                  {/* New goal creation form preview — reads from editorConfig */}
                  <div className="rounded overflow-hidden border border-amber-200">
                    <div className="bg-amber-100/70 px-3 py-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900">New Goal</span>
                      <span className="text-[10px] text-amber-700">Pending until signed</span>
                    </div>
                    <div className="bg-white px-3 py-2 space-y-1.5">
                      <div className="border border-gray-200 rounded px-1.5 py-1 bg-gray-50">
                        <span className="text-[9px] text-gray-400">Goal text...</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {([["percentage","Percentage"],["count","Count"],["duration","Duration"],["scale","Scale"],["binary","Binary"],["custom","Custom"]] as const)
                          .filter(([key]) => editorConfig.measurementTypes[key])
                          .map(([key, label], i) => (
                            <span key={key} className={`text-[8px] border rounded px-1 py-0.5 ${i === 0 ? "border-indigo-300 bg-indigo-50 text-indigo-600 font-medium" : "border-gray-200 text-gray-400"}`}>{label}</span>
                          ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50"><span className="text-[9px] text-gray-400">Baseline</span></div>
                        <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50"><span className="text-[9px] text-gray-400">Target</span></div>
                      </div>
                      <div className={`grid gap-1 ${editorConfig.showFunctionalLevel ? "grid-cols-2" : "grid-cols-1"}`}>
                        {editorConfig.showFunctionalLevel && <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50"><span className="text-[9px] text-gray-400">Current Functional Level</span></div>}
                        <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 flex items-center gap-0.5">
                          <span className="text-[9px] text-gray-400">Target Date</span>
                          {editorConfig.shortcuts.week && <span className="text-[7px] text-indigo-500 border border-indigo-200 rounded px-0.5">+1 Wk</span>}
                        </div>
                      </div>
                      {(editorConfig.shortcuts.poc || editorConfig.shortcuts.mo3 || editorConfig.shortcuts.mo6 || editorConfig.shortcuts.yr1) && (
                        <div className="flex gap-0.5">
                          {editorConfig.shortcuts.poc && <span className="text-[7px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">End of POC</span>}
                          {editorConfig.shortcuts.mo3 && <span className="text-[7px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">3 mo</span>}
                          {editorConfig.shortcuts.mo6 && <span className="text-[7px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">6 mo</span>}
                          {editorConfig.shortcuts.yr1 && <span className="text-[7px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">1 yr</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Add goal button */}
                  <div className="border border-dashed border-indigo-300 rounded px-3 py-2 text-center">
                    <span className="text-[10px] text-indigo-500 font-medium">+ Add Goal</span>
                  </div>
                </div>
              </FormEditorRow>

            </div>

            {/* Right sidebar */}
            <div className="w-56 bg-gray-50 border border-gray-200 border-t-0 border-l-0 rounded-br-lg p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Goal Components</h3>
              <button
                onClick={() => setShowEditorConfig(true)}
                className="w-full text-left px-3 py-2.5 bg-amber-50 border-2 border-amber-400 rounded-lg hover:bg-amber-100 transition-colors group ring-2 ring-amber-200 ring-offset-1"
              >
                <span className="text-sm font-semibold text-amber-800">Goal Editor</span>
                <p className="text-[11px] text-amber-500 mt-0.5 leading-tight">Click to configure — preview updates live</p>
              </button>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Standard</h3>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="px-2 py-1">Patient info</div>
                  <div className="px-2 py-1">Rich text</div>
                  <div className="px-2 py-1">Diagnosis codes</div>
                  <div className="px-2 py-1">Prognosis</div>
                    </div>
              </div>
            </div>
          </div>

          {showEditorConfig && <GoalEditorConfig config={editorConfig} onChange={setEditorConfig} onClose={() => setShowEditorConfig(false)} />}
        </>
      )}

      {/* Visit Note canvas (existing) */}
      {setupFormat === "visit_note" && (
      <>


      {/* Editor header */}
      <div className="flex items-center justify-between mb-0 bg-slate-100 border border-slate-200 rounded-t-lg px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-lg font-semibold text-slate-800">Visit Note</span>
          <button className="text-slate-400 hover:text-slate-600 transition-colors" title="Form settings">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-600">Visit note</span>
          <span className="text-xs bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-600">Custom Form Editor</span>
        </div>
      </div>

      <div className="flex gap-0">
        {/* Left: Form canvas */}
        <div className="flex-1 bg-white border border-gray-200 border-t-0 rounded-bl-lg">
          {/* Row: Goal Checklist */}
          <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig("goal_list")}>
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-800">Goal Checklist</span>
              <span className="text-xs text-gray-400 ml-2 font-mono">smart-goals-session-checklist</span>
            </div>
            <div className="border border-dashed border-indigo-200 rounded-lg p-3 bg-indigo-50/20 space-y-2">
              <div className="rounded overflow-hidden border border-gray-200">
                <label className="flex items-center gap-3 px-3 py-1.5 bg-gray-100/80 cursor-pointer">
                  <input type="checkbox" disabled className="w-3.5 h-3.5 rounded border-gray-300" />
                  <span className="text-[11px] font-bold text-gray-700">1.0.0 Long Term Goal</span>
                  <span className="text-[10px] text-gray-400">percentage</span>
                </label>
                <div className="bg-gray-50/60 px-3 py-2">
                  <p className="text-[10px] text-gray-400">Patient will improve articulation of /r/ sound...</p>
                  {(checklistConfig.showFunctionalLevel || checklistConfig.showNotes) && (
                    <div className={`grid gap-1 mt-1 ${checklistConfig.showFunctionalLevel && checklistConfig.showNotes ? "grid-cols-2" : "grid-cols-1"}`}>
                      {checklistConfig.showFunctionalLevel && <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Current Functional Level</span></div>}
                      {checklistConfig.showNotes && <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Session Notes</span></div>}
                    </div>
                  )}
                </div>
              </div>
              {checklistConfig.showStgNesting && (
                <div className="ml-4 rounded overflow-hidden border border-gray-200">
                  <label className="flex items-center gap-3 px-3 py-1 bg-gray-100/80 cursor-pointer">
                    <input type="checkbox" disabled className="w-3.5 h-3.5 rounded border-gray-300" />
                    <span className="text-[10px] text-gray-400">&#8627;</span>
                    <span className="text-[10px] font-bold text-gray-600">1.2.0 Short Term Goal</span>
                  </label>
                </div>
              )}
            </div>
          </FormEditorRow>

          {/* Row: Goal Progress */}
          <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig("goal_progress")}>
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-800">Goal Progress</span>
              <span className="text-xs text-gray-400 ml-2 font-mono">smart-goal-data-collection</span>
            </div>
            <div className="border border-dashed border-indigo-200 rounded-lg p-3 bg-indigo-50/20 space-y-2">
              <div className="rounded overflow-hidden border border-gray-200">
                <div className="bg-indigo-100/70 px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-900">1.0.0 Long Term Goal</span>
                    <span className="text-[10px] text-gray-500">percentage</span>
                  </div>
                  <span className="text-[10px] text-gray-600">Active</span>
                </div>
                <div className="bg-gray-50/60 px-3 py-2 space-y-1.5">
                  <p className="text-[10px] text-gray-400">Patient will improve articulation of /r/ sound...</p>
                  {dataCollConfig.showTrajectory && (
                    <div className="grid grid-cols-4 gap-1">
                      {[{l:"Baseline",v:"45%"},{l:"Previous",v:"52%"},{l:"Current",v:"72%",hl:true},{l:"Target",v:"90%"}].map((c) => (
                        <div key={c.l}>
                          <div className={`text-[9px] font-semibold ${c.hl ? "text-indigo-600" : "text-gray-500"}`}>{c.l}</div>
                          <div className={`border rounded px-1.5 py-0.5 text-[10px] ${c.hl ? "border-indigo-200 bg-indigo-50 font-semibold text-indigo-700" : "border-gray-200 bg-white text-gray-600"}`}>{c.v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={`grid gap-1 grid-cols-${1 + (dataCollConfig.showActivity ? 1 : 0) + (dataCollConfig.showNote ? 1 : 0)}`}>
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Measurement</span></div>
                    {dataCollConfig.showActivity && <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Activity</span></div>}
                    {dataCollConfig.showNote && <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Note</span></div>}
                  </div>
                </div>
              </div>
              {dataCollConfig.showStgNesting && (
                <div className="ml-4 rounded overflow-hidden border border-gray-200">
                  <div className="bg-indigo-100/70 px-3 py-1 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">&#8627;</span>
                    <span className="text-[10px] font-bold text-indigo-800">1.2.0 Short Term Goal</span>
                  </div>
                </div>
              )}
            </div>
          </FormEditorRow>

          {/* Row: Goal Admin */}
          <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig("goal_admin")}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">Goal Admin</span>
              <span className="text-xs text-gray-400 font-mono">smart-goal-admin-collection</span>
              <span className="text-[10px] text-violet-500 bg-violet-100 rounded px-1.5 py-0.5 font-medium">Future</span>
            </div>
            <div className="border border-dashed border-violet-200 rounded-lg p-3 bg-violet-50/10 space-y-2">
              <div className="rounded overflow-hidden border border-gray-200">
                <div className="bg-indigo-100/70 px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-900">1.0.0 Long Term Goal</span>
                  <span className="text-[10px] text-gray-600">Active</span>
                </div>
                <div className="bg-gray-50/60 px-3 py-2 space-y-1">
                  <p className="text-[10px] text-gray-400">Patient will improve articulation of /r/ sound...</p>
                  {adminControls.length > 0 ? (
                    <div className="space-y-1">
                      {adminControls.map((ctrl) => {
                        const typeLabel = CONTROL_TYPES.find((c) => c.value === ctrl.type)?.label || ctrl.type;
                        return (
                          <div key={ctrl.id} className="border border-gray-200 rounded px-1.5 py-0.5 bg-white">
                            <span className="text-[9px] text-gray-500 font-medium">{ctrl.label}</span>
                            <span className="text-[8px] text-gray-300 ml-1">({typeLabel}{ctrl.options ? `: ${ctrl.options.split(",").slice(0, 3).join(", ")}${ctrl.options.split(",").length > 3 ? "..." : ""}` : ""})</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-[9px] text-gray-400 italic">No controls added — click the gear icon to add</div>
                  )}
                </div>
              </div>
            </div>
          </FormEditorRow>

          {/* Row: Goal Custom (future) */}
          <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig("goal_custom")}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">Goal Custom</span>
              <span className="text-xs text-gray-400 font-mono">smart-goal-custom-collection</span>
              <span className="text-[10px] text-violet-500 bg-violet-100 rounded px-1.5 py-0.5 font-medium">Future</span>
            </div>
            <div className="border border-dashed border-violet-200 rounded-lg p-3 bg-violet-50/10 space-y-2">
              <div className="rounded overflow-hidden border border-gray-200">
                <div className="bg-indigo-100/70 px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-900">1.0.0 Long Term Goal</span>
                  <span className="text-[10px] text-gray-600">Active</span>
                </div>
                <div className="bg-gray-50/60 px-3 py-2 space-y-1">
                  <p className="text-[10px] text-gray-400">Patient will improve articulation of /r/ sound...</p>
                  <div className="text-[9px] text-gray-400 italic">Therapist adds controls per goal at fill time:</div>
                  <div className="flex flex-wrap gap-1">
                    {CONTROL_TYPES.filter((ct) => customConfig[ct.value] !== false).map((ct) => (
                      <span key={ct.value} className="text-[8px] text-violet-500 border border-violet-200 rounded px-1.5 py-0.5 bg-violet-50">+ {ct.label}</span>
                    ))}
                  </div>
                  {CONTROL_TYPES.filter((ct) => customConfig[ct.value] !== false).length === 0 && (
                    <div className="text-[9px] text-gray-400 italic">No control types enabled — click the gear icon to configure</div>
                  )}
                </div>
              </div>
            </div>
          </FormEditorRow>

        </div>

        {/* Right: Available components */}
        <div className="w-56 bg-gray-50 border border-gray-200 border-t-0 border-l-0 rounded-br-lg p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Goal Components</h3>
          <div className="space-y-2">
            {GOAL_COMPONENTS.map((comp) => (
              <button
                key={comp.config}
                onClick={() => setOpenConfig(comp.config)}
                className="w-full text-left px-3 py-2.5 bg-amber-50 border-2 border-amber-400 rounded-lg hover:bg-amber-100 transition-colors group ring-1 ring-amber-200"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{comp.name}</span>
                  {comp.future && <span className="text-[10px] text-violet-500 bg-violet-100 rounded px-1 py-0.5">Future</span>}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{comp.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Standard</h3>
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="px-2 py-1">Rich text</div>
              <div className="px-2 py-1">Patient info</div>
              <div className="px-2 py-1">Diagnosis codes</div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Config modals */}
      {openConfig === "goal_list" && <GoalListConfig config={checklistConfig} onChange={setChecklistConfig} onClose={() => setOpenConfig(null)} />}
      {openConfig === "goal_progress" && <GoalProgressConfig config={dataCollConfig} onChange={setDataCollConfig} onClose={() => setOpenConfig(null)} />}
      {openConfig === "goal_admin" && <GoalAdminConfig controls={adminControls} onChange={setAdminControls} onClose={() => setOpenConfig(null)} />}
      {openConfig === "goal_custom" && <GoalCustomConfig config={customConfig} onChange={setCustomConfig} onClose={() => setOpenConfig(null)} />}

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype — Component Setup Preview
        </span>
      </div>
    </div>
  );
}
