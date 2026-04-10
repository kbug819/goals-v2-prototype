"use client";

import { useState } from "react";
import { mockGoals, PatientGoal } from "@/data/mockData";
import StatusBadge from "./StatusBadge";

type NoteFormat = "soap" | "freetext" | "dap" | "freetext_goals" | "freetext_goallist";

const NOTE_FORMATS: { value: NoteFormat; label: string; shortLabel: string; description: string }[] = [
  { value: "soap", label: "Visit Note - SOAP", shortLabel: "SOAP", description: "Subjective, Objective, Assessment, Plan" },
  { value: "freetext", label: "Visit Note - Free Text", shortLabel: "Free Text", description: "Unstructured clinical narrative" },
  { value: "dap", label: "Visit Note - DAP", shortLabel: "DAP", description: "Data, Assessment, Plan" },
  { value: "freetext_goals", label: "Visit Note - Free Text & Goal Progress", shortLabel: "Free Text & Goal Progress", description: "Free text narrative with structured goal tracking" },
  { value: "freetext_goallist", label: "Visit Note - Free Text & Goal List", shortLabel: "Free Text & Goal List", description: "Free text narrative with goal checklist" },
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

function FreeTextGoalProgress() {
  const [showGoals, setShowGoals] = useState(false);
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

      {/* Goal Progress - collapsible like Visit Note Show */}
      {!showGoals ? (
        <button
          onClick={() => setShowGoals(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-indigo-600 border-2 border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Add Goal Progress
          {Object.keys(updates).length > 0 && (
            <span className="text-xs text-indigo-400">({Object.keys(updates).length} of {speechGoals.length} updated)</span>
          )}
        </button>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-700">Goal Progress</h3>
              <button onClick={() => setShowGoals(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
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
      )}
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
          <label className="text-xs font-medium text-gray-500">Goals Addressed</label>
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

          {format === "freetext_goals" && (
            <FreeTextGoalProgress />
          )}

          {format === "freetext_goallist" && (
            <FreeTextGoalList />
          )}
        </div>

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

      {/* Right sidebar */}
      <div className="w-72 flex-shrink-0 space-y-3">
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
      </div>
    </div>
  );
}

export default function VisitNoteNewView() {
  const [selectedFormat, setSelectedFormat] = useState<NoteFormat>("soap");

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Visit Note</h2>
        <p className="text-sm text-gray-400">New visit note preview</p>
      </div>

      {/* Format selector */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {NOTE_FORMATS.map((format) => (
          <button
            key={format.value}
            onClick={() => setSelectedFormat(format.value!)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              selectedFormat === format.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {format.shortLabel}
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
