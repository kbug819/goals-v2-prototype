"use client";

import { useState } from "react";
import DevNote from "@/components/shared/DevNote";

type ComponentConfig = "goal_list" | "goal_progress" | "goal_admin" | "goal_custom" | null;

function GoalListConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Session Checklist</h2>
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
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Include session notes field per goal</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Include current functional level field per goal</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Show STGs nested under LTGs</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
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

function GoalProgressConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Goal Data Collection</h2>
          <p className="text-sm text-gray-500 mt-0.5">smart-goal-data-collection</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <p className="text-xs text-gray-400 mb-1.5">Primary label describing this form field</p>
            <input defaultValue="Goal Data Collection" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fields per goal:</label>
            <p className="text-xs text-gray-400 mb-1.5">Select which fields appear for each goal</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked disabled className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Today&apos;s measurement <span className="text-xs text-gray-400">(always on)</span></span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Activity name</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Session note</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display options:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Show measurement trajectory (Baseline / Previous / Current / Target)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
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

function GoalAdminConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Goal Admin Components</h2>
          <p className="text-sm text-gray-500 mt-0.5">smart-goal-admin-collection</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <p className="text-xs text-gray-400 mb-1.5">Primary label describing this form field</p>
            <input defaultValue="Goal Progress w/ Components" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Components per goal:</label>
            <p className="text-xs text-gray-400 mb-1.5">Select which components appear under each goal. These are fixed for all therapists filling out this form.</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Progress status (radio: Progressing / Plateau / Regression / Met)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Session notes (text area)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Trials (correct / total)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Prompting level &amp; type</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Scale / Rating (1-5)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Custom checkboxes</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progress status options:</label>
            <p className="text-xs text-gray-400 mb-1.5">Comma delimited list of status options</p>
            <input defaultValue="Progressing,Plateau,Regression,Met" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Data storage</p>
            <p className="text-xs text-gray-500">Creates <code className="bg-gray-200 px-1 rounded">GoalDataPoint</code> for measurement fields + stores admin component values in <code className="bg-gray-200 px-1 rounded">FormDatum</code>.</p>
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

function GoalCustomConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Goal Custom Components</h2>
            <span className="text-xs font-medium text-violet-600 bg-violet-100 rounded-full px-2 py-0.5">Future iteration</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">smart-goal-custom-collection</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <input defaultValue="Goal Progress w/ Custom Components" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="bg-violet-50 rounded-lg px-4 py-3 border border-violet-200">
            <p className="text-xs font-semibold text-violet-700 mb-1">How this differs from Admin Components</p>
            <p className="text-xs text-violet-600">With Admin Components, the admin pre-selects which fields show per goal and therapists fill them in. With Custom Components, the <em>therapist</em> can dynamically add/remove components per goal at fill time. E.g., one goal might need prompting data while another needs duration tracking.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available components (therapist picks at fill time):</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Trials (correct / total)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Prompting level &amp; type</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Notes (text area)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Rating (1-5)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Custom checkboxes</span>
              </label>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Data storage</p>
            <p className="text-xs text-gray-500">Same as Admin Components — <code className="bg-gray-200 px-1 rounded">GoalDataPoint</code> + <code className="bg-gray-200 px-1 rounded">FormDatum</code>. The difference is only in the fill-time UX.</p>
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
  { name: "Session Checklist", slug: "smart-goals-session-checklist", description: "Checkbox list of active goals with session notes per goal", config: "goal_list" },
  { name: "Goal Data Collection", slug: "smart-goal-data-collection", description: "Full measurement logging per goal — measurement, activity, note", config: "goal_progress" },
  { name: "Goal Admin Components", slug: "smart-goal-admin-collection", description: "Admin-configured fields per goal (progress status, trials, prompting, etc.)", config: "goal_admin" },
  { name: "Goal Custom Components", slug: "smart-goal-custom-collection", description: "Therapist adds custom components per goal at fill time", config: "goal_custom", future: true },
];

function FormEditorRow({ type, children, highlight, onGear }: { type: string; children: React.ReactNode; highlight?: boolean; onGear?: () => void }) {
  return (
    <div className={`border-b border-gray-200 ${highlight ? "bg-blue-50/30" : ""}`}>
      <div className="flex items-center justify-between px-4 py-1 bg-slate-100/80 border-b border-slate-200/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={onGear} className="text-slate-400 hover:text-slate-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0" />
            </svg>
          </button>
          <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 bg-slate-300 rounded-full" />)}</div>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          <span className="font-medium">{type}</span>
        </div>
        <div className="flex items-center gap-2">
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

export default function ComponentSetupView() {
  const [openConfig, setOpenConfig] = useState<ComponentConfig>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews what the Custom Form Editor looks like when setting up visit note goal components. Click a goal component to see its configuration options."
        todos={[]}
      />

      {/* Editor header */}
      <div className="flex items-center justify-between mb-0 bg-slate-100 border border-slate-200 rounded-t-lg px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-lg font-semibold text-slate-800">Visit Note — Goal Components</span>
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

          {/* Row: Clinical Note */}
          <FormEditorRow type="Text Area">
            <label className="block text-sm font-semibold text-gray-800">Clinical Note:</label>
            <textarea rows={2} placeholder="Write your clinical note here..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 resize-none" />
          </FormEditorRow>

          {/* Row: Session Checklist */}
          <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig("goal_list")}>
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-800">Session Checklist</span>
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
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Current Functional Level</span></div>
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Session Notes</span></div>
                  </div>
                </div>
              </div>
              <div className="ml-4 rounded overflow-hidden border border-gray-200">
                <label className="flex items-center gap-3 px-3 py-1 bg-gray-100/80 cursor-pointer">
                  <input type="checkbox" disabled className="w-3.5 h-3.5 rounded border-gray-300" />
                  <span className="text-[10px] text-gray-400">&#8627;</span>
                  <span className="text-[10px] font-bold text-gray-600">1.2.0 Short Term Goal</span>
                </label>
              </div>
            </div>
          </FormEditorRow>

          {/* Row: Goal Data Collection */}
          <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig("goal_progress")}>
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-800">Goal Data Collection</span>
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
                  <div className="grid grid-cols-4 gap-1">
                    {[{l:"Baseline",v:"45%"},{l:"Previous",v:"52%"},{l:"Current",v:"72%",hl:true},{l:"Target",v:"90%"}].map((c) => (
                      <div key={c.l}>
                        <div className={`text-[9px] font-semibold ${c.hl ? "text-indigo-600" : "text-gray-500"}`}>{c.l}</div>
                        <div className={`border rounded px-1.5 py-0.5 text-[10px] ${c.hl ? "border-indigo-200 bg-indigo-50 font-semibold text-indigo-700" : "border-gray-200 bg-white text-gray-600"}`}>{c.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Measurement</span></div>
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Activity</span></div>
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Note</span></div>
                  </div>
                </div>
              </div>
              <div className="ml-4 rounded overflow-hidden border border-gray-200">
                <div className="bg-indigo-100/70 px-3 py-1 flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">&#8627;</span>
                  <span className="text-[10px] font-bold text-indigo-800">1.2.0 Short Term Goal</span>
                </div>
              </div>
            </div>
          </FormEditorRow>

          {/* Row: Goal Admin Components */}
          <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig("goal_admin")}>
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-800">Goal Admin Components</span>
              <span className="text-xs text-gray-400 ml-2 font-mono">smart-goal-admin-collection</span>
            </div>
            <div className="border border-dashed border-indigo-200 rounded-lg p-3 bg-indigo-50/20 space-y-2">
              <div className="rounded overflow-hidden border border-gray-200">
                <div className="bg-indigo-100/70 px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-900">1.0.0 Long Term Goal</span>
                  <span className="text-[10px] text-gray-600">Active</span>
                </div>
                <div className="bg-gray-50/60 px-3 py-2 space-y-1">
                  <p className="text-[10px] text-gray-400">Patient will improve articulation of /r/ sound...</p>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Progress Status</span></div>
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Session Notes</span></div>
                  </div>
                </div>
              </div>
            </div>
          </FormEditorRow>

          {/* Row: Goal Custom Components (future) */}
          <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig("goal_custom")}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">Goal Custom Components</span>
              <span className="text-xs text-gray-400 font-mono">smart-goal-custom-collection</span>
              <span className="text-[10px] text-violet-500 bg-violet-100 rounded px-1.5 py-0.5 font-medium">Future</span>
            </div>
            <div className="border border-dashed border-violet-200 rounded-lg p-3 bg-violet-50/20 space-y-2">
              <div className="rounded overflow-hidden border border-gray-200">
                <div className="bg-indigo-100/70 px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-900">1.0.0 Long Term Goal</span>
                  <span className="text-[10px] text-gray-600">Active</span>
                </div>
                <div className="bg-gray-50/60 px-3 py-2 space-y-1">
                  <p className="text-[10px] text-gray-400">Patient will improve articulation of /r/ sound...</p>
                  <div className="space-y-1">
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Trials: 29/40 (73%)</span></div>
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Notes: Responding well to visual cues...</span></div>
                    <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white"><span className="text-[9px] text-gray-400">Rating: 4 / 5</span></div>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] text-violet-500 border border-violet-200 rounded px-1.5 py-0.5 bg-violet-50">+ Add component</span>
                  </div>
                </div>
              </div>
            </div>
          </FormEditorRow>

          {/* Row: Save */}
          <FormEditorRow type="System">
            <button disabled className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-300 rounded-lg cursor-not-allowed">Save Visit Note</button>
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
                className="w-full text-left px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
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
              <div className="px-2 py-1">Signature</div>
            </div>
          </div>
        </div>
      </div>

      {/* Config modals */}
      {openConfig === "goal_list" && <GoalListConfig onClose={() => setOpenConfig(null)} />}
      {openConfig === "goal_progress" && <GoalProgressConfig onClose={() => setOpenConfig(null)} />}
      {openConfig === "goal_admin" && <GoalAdminConfig onClose={() => setOpenConfig(null)} />}
      {openConfig === "goal_custom" && <GoalCustomConfig onClose={() => setOpenConfig(null)} />}

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
