"use client";

import { useState } from "react";
import DevNote from "@/components/shared/DevNote";

function GoalProgressConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Goal Progress</h2>
          <p className="text-sm text-gray-500 mt-0.5">smart-goals-progress-report</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <p className="text-xs text-gray-400 mb-1.5">Primary label describing this form field</p>
            <input defaultValue="Goal Progress" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal display options:</label>
            <p className="text-xs text-gray-400 mb-1.5">Choose what information to show per goal</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked disabled className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Show current status per goal <span className="text-xs text-gray-400">(always on)</span></span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Show baseline / target values</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Show current functional level</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Include narrative text area per goal</span>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data visualization:</label>
            <p className="text-xs text-gray-400 mb-1.5">Toggle measurement data features. Turn these off for a simpler narrative-only layout.</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Measurement trajectory (Baseline / Previous / Current / Target)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Progress line chart from data points</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Session data table (expandable)</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status actions:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Allow status update from progress report (Continue / Met / Discontinue)</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reporting period data source:</label>
            <p className="text-xs text-gray-400 mb-1.5">Charts and trajectory values are computed from data points within this range</p>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Use reporting period dates from progress report</option>
              <option>Use all data points (no date filter)</option>
            </select>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-1">Data storage</p>
            <p className="text-xs text-gray-500">Reads from <code className="bg-gray-200 px-1 rounded">goal_data_points</code> (measurement history) and <code className="bg-gray-200 px-1 rounded">patient_goal_events</code> (status + functional level). Narratives stored in <code className="bg-gray-200 px-1 rounded">FormDatum</code>. On signing, <code className="bg-gray-200 px-1 rounded">PatientGoalSnapshot</code> freezes goal state.</p>
          </div>
          <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">Tip</p>
            <p className="text-xs text-blue-600">For a simple narrative-only progress report, uncheck all data visualization options. The component will show goals with status, baseline/target, and narrative fields only — no charts or tables.</p>
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

export default function PRComponentSetupView() {
  const [openConfig, setOpenConfig] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews what the Custom Form Editor looks like when setting up the progress report goal component. One component (smart-goals-progress-report) with configurable options — admin toggles chart, trajectory, session data, and status update features on/off."
        todos={[]}
      />

      {/* Editor header */}
      <div className="flex items-center justify-between mb-0 bg-slate-100 border border-slate-200 rounded-t-lg px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-lg font-semibold text-slate-800">Progress Report — Custom Form Setup</span>
        </div>
        <span className="text-xs bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-600">Custom Form Editor</span>
      </div>

      <div className="flex gap-0">
        {/* Left: Form canvas */}
        <div className="flex-1 bg-white border border-gray-200 border-t-0 rounded-bl-lg min-h-[500px]">
          <div className="divide-y divide-gray-200">
            {/* Standard header components */}
            <div className="px-5 py-3 flex items-center gap-3">
              <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
              <div>
                <span className="text-sm text-gray-500">Patient Info</span>
                <span className="text-xs text-gray-400 ml-2">Smart component</span>
              </div>
            </div>

            <div className="px-5 py-3 flex items-center gap-3">
              <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
              <div>
                <span className="text-sm text-gray-500">Reporting Period</span>
                <span className="text-xs text-gray-400 ml-2">Date range</span>
              </div>
            </div>

            <div className="px-5 py-3 flex items-center gap-3">
              <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
              <div>
                <span className="text-sm text-gray-500">Overall Summary</span>
                <span className="text-xs text-gray-400 ml-2">Rich text</span>
              </div>
            </div>

            {/* Goal Progress component */}
            <div className="px-5 py-4 bg-blue-50/30 cursor-pointer hover:bg-blue-50/60 transition-colors" onClick={() => setOpenConfig(true)}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0" />
                  </svg>
                  <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-indigo-700 font-semibold">Goal Progress</span>
                      <span className="text-xs text-gray-400 font-mono">smart-goals-progress-report</span>
                    </div>
                    <span className="text-gray-400 cursor-pointer">&times;</span>
                  </div>
                  <p className="text-xs text-gray-500">Goal review with configurable data visualization, measurement trajectory, charts, status updates, and narrative per goal</p>

                  {/* Mini preview */}
                  <div className="mt-2 space-y-1.5">
                    <div className="border border-dashed border-gray-300 rounded px-3 py-2 bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600">LTG 1.0.0</span>
                        <span className="text-[10px] text-green-600 bg-green-50 px-1 rounded">active</span>
                        <span className="text-[10px] text-gray-400">percentage</span>
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">Patient will improve articulation of /r/ sound...</div>
                      <div className="flex gap-2 mt-1">
                        <div className="flex-1 grid grid-cols-4 gap-1">
                          {["Baseline", "Previous", "Current", "Target"].map((l) => (
                            <div key={l} className="text-center">
                              <div className="text-[8px] text-gray-400">{l}</div>
                              <div className={`text-[9px] font-medium ${l === "Current" ? "text-indigo-600" : "text-gray-500"}`}>{l === "Baseline" ? "45%" : l === "Previous" ? "68%" : l === "Current" ? "72%" : "90%"}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-3 bg-gray-100 rounded flex items-center px-0.5">
                          <div className="h-1.5 bg-indigo-400 rounded" style={{ width: "60%" }} />
                        </div>
                        <span className="text-[8px] text-gray-400">Chart</span>
                      </div>
                      <div className="mt-1 border border-dashed border-gray-200 rounded px-2 py-1 bg-gray-50">
                        <span className="text-[10px] text-gray-400 italic">Narrative text area...</span>
                      </div>
                    </div>
                    <div className="ml-5 border border-dashed border-gray-200 rounded px-3 py-1.5 bg-white">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-500">STG 1.2.0</span>
                        <span className="text-[10px] text-gray-400 truncate">Produce /r/ in final position...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trailing standard components */}
            <div className="px-5 py-3 flex items-center gap-3">
              <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
              <div>
                <span className="text-sm text-gray-500">Recommendations</span>
                <span className="text-xs text-gray-400 ml-2">Rich text</span>
              </div>
            </div>

            <div className="px-5 py-3 flex items-center gap-3">
              <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
              <div>
                <span className="text-sm text-gray-500">Prognosis</span>
                <span className="text-xs text-gray-400 ml-2">Select</span>
              </div>
            </div>

            <div className="px-5 py-3 flex items-center gap-3">
              <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
              <div>
                <span className="text-sm text-gray-500">Sign / Save Button</span>
                <span className="text-xs text-gray-400 ml-2">System</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Available components */}
        <div className="w-56 bg-gray-50 border border-gray-200 border-t-0 border-l-0 rounded-br-lg p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Goal Components</h3>
          <button
            onClick={() => setOpenConfig(true)}
            className="w-full text-left px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">Goal Progress</span>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">Configurable goal review — toggle charts, trajectory, status updates, and narratives</p>
          </button>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Standard</h3>
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="px-2 py-1">Patient info</div>
              <div className="px-2 py-1">Reporting period</div>
              <div className="px-2 py-1">Rich text</div>
              <div className="px-2 py-1">Diagnosis codes</div>
              <div className="px-2 py-1">Prognosis</div>
              <div className="px-2 py-1">Signature</div>
            </div>
          </div>
        </div>
      </div>

      {/* Config modal */}
      {openConfig && <GoalProgressConfig onClose={() => setOpenConfig(false)} />}

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype — Progress Report Custom Form Setup
        </span>
      </div>
    </div>
  );
}
