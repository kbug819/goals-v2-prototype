"use client";

import { useState } from "react";
import DevNote from "@/components/shared/DevNote";

function FormEditorRow({ type, children, highlight, onGear }: { type: string; children: React.ReactNode; highlight?: boolean; onGear?: () => void }) {
  return (
    <div className={`border-b border-gray-200 ${highlight ? "bg-blue-50/30" : ""}`}>
      {/* Component type header */}
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
      {/* Component content */}
      <div className="px-6 py-4">
        {children}
      </div>
    </div>
  );
}

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

function FormSettingsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 bg-slate-700 rounded-t-xl">
          <h2 className="text-lg font-semibold text-white">Custom Form Editor</h2>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-0.5">Form Label: <span className="text-red-500">*</span> <span className="font-normal text-xs text-gray-400">Displayed at the top of the form when rendered.</span></label>
            <input defaultValue="Progress Report" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-0.5">Form Description: <span className="font-normal text-xs text-gray-400">A more detailed reason for this custom form.</span></label>
            <textarea rows={2} placeholder="Custom form description (optional)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-0.5">Form Type: <span className="text-red-500">*</span> <span className="font-normal text-xs text-gray-400">Where this form template will be used.</span></label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50">
              Progress Report
              <button className="ml-auto text-gray-400 hover:text-gray-600">&times;</button>
            </div>
          </div>

          {/* Data collection settings - progress report specific */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Data Collection Method:</label>
            <p className="text-xs text-gray-400 mb-2">How session data is collected when a therapist creates a new progress report.</p>
            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input type="radio" name="collection" defaultChecked className="mt-0.5 w-4 h-4 border-gray-300 text-indigo-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Date Range</span>
                  <p className="text-xs text-gray-400">Therapist picks start and end dates. Data points within this window are shown.</p>
                </div>
              </label>
              <label className="flex items-start gap-2">
                <input type="radio" name="collection" className="mt-0.5 w-4 h-4 border-gray-300 text-indigo-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Last N Visits</span>
                  <p className="text-xs text-gray-400">Therapist specifies number of recent visits to pull from (default: 10).</p>
                </div>
              </label>
              <label className="flex items-start gap-2">
                <input type="radio" name="collection" className="mt-0.5 w-4 h-4 border-gray-300 text-indigo-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Two Date Ranges (Comparative)</span>
                  <p className="text-xs text-gray-400">Therapist picks a previous and current period for side-by-side comparison.</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
              <span className="text-sm text-gray-700">Allow therapists to change collection method</span>
            </label>
            <p className="text-xs text-gray-400 ml-6">If unchecked, therapists must use the default method set above.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Default Visit Count:</label>
            <p className="text-xs text-gray-400 mb-1">Used when &quot;Last N Visits&quot; is selected.</p>
            <input type="number" defaultValue={10} className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Usable By: <span className="font-normal text-xs text-gray-400">Select the intended disciplines for this form.</span></label>
            <div className="space-y-1.5 mt-2">
              {["Audiology", "Feeding Therapy", "Occupational Therapy", "Physical Therapy", "Speech Therapy", "Developmental Therapy", "Other"].map((d, i) => (
                <label key={d} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={i < 5} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                  <span className="text-sm text-gray-600">{d}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-800 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PRComponentSetupView() {
  const [openConfig, setOpenConfig] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews the Custom Form Editor for progress reports. Click the gear icon next to the form title to configure form-level settings (collection method, disciplines). Click a goal component to configure its display options. Both the form settings and goal component options would update the custom form template — admin configures once, therapists fill in at report time."
        todos={[
          "The form settings panel (gear icon) and goal component config should both save to the custom form template",
          "Collection method (date range / last N visits / two date ranges) determines how the goal component queries data at fill time",
          "Confirm: should the form settings panel also be available on visit note and POC/Eval custom form setups?",
        ]}
      />

      {/* Editor header */}
      <div className="flex items-center justify-between mb-0 bg-slate-100 border border-slate-200 rounded-t-lg px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-lg font-semibold text-slate-800">Progress Report</span>
          <button
            onClick={() => setShowSettings(true)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="Form settings"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <span className="text-xs bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-600">Custom Form Editor</span>
      </div>

      {/* Form canvas - matches Ambiki custom form editor layout */}
      <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg">

        {/* Row: Patient Info (smart component) */}
        <FormEditorRow type="Smart Component" onGear={() => {}}>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-xs font-semibold text-gray-500">Patient</span><p className="text-gray-400">Emma Johnson</p></div>
            <div><span className="text-xs font-semibold text-gray-500">DOB</span><p className="text-gray-400">06/15/2019</p></div>
            <div><span className="text-xs font-semibold text-gray-500">Therapist</span><p className="text-gray-400">Sam Therapist</p></div>
          </div>
        </FormEditorRow>

        {/* Row: Reporting Period */}
        <FormEditorRow type="Date Range">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800">Reporting Period Start:<span className="text-red-500">*</span></label>
              <input type="date" defaultValue="2026-03-01" className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800">Reporting Period End:<span className="text-red-500">*</span></label>
              <input type="date" defaultValue="2026-04-08" className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1" />
            </div>
          </div>
        </FormEditorRow>

        {/* Row: Overall Summary */}
        <FormEditorRow type="Text Area">
          <label className="block text-sm font-semibold text-gray-800">Overall Summary:</label>
          <textarea rows={2} placeholder="Overall summary of patient progress..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 resize-none" />
        </FormEditorRow>

        {/* Row: Goal Progress (smart component - clickable) */}
        <FormEditorRow type="Smart Component" highlight onGear={() => setOpenConfig(true)}>
          <div className="mb-2">
            <span className="text-sm font-semibold text-gray-800">Goal Progress</span>
            <span className="text-xs text-gray-400 ml-2 font-mono">smart-goals-progress-report</span>
          </div>
          {/* Mini preview of what the component renders */}
          <div className="border border-dashed border-indigo-200 rounded-lg p-3 bg-indigo-50/20 space-y-2">
            <div className="rounded overflow-hidden border border-gray-200">
              <div className="bg-indigo-100/70 px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-900">1.0.0 Long Term Goal</span>
                  <span className="text-[10px] text-gray-500">percentage</span>
                </div>
                <span className="text-[10px] text-gray-600">Current status: Active</span>
              </div>
              <div className="bg-gray-50/60 px-3 py-2 space-y-1.5">
                <p className="text-[11px] text-gray-500">Patient will improve articulation of /r/ sound...</p>
                <div className="grid grid-cols-4 gap-1">
                  {[{l:"Baseline",v:"45%"},{l:"Previous",v:"52%"},{l:"Current",v:"72%",hl:true},{l:"Target",v:"90%"}].map((c) => (
                    <div key={c.l}>
                      <div className={`text-[9px] font-semibold ${c.hl ? "text-indigo-600" : "text-gray-500"}`}>{c.l}</div>
                      <div className={`border rounded px-1.5 py-0.5 text-[10px] ${c.hl ? "border-indigo-200 bg-indigo-50 font-semibold text-indigo-700" : "border-gray-200 bg-white text-gray-600"}`}>{c.v}</div>
                    </div>
                  ))}
                </div>
                <div className="h-6 bg-white rounded border border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-[9px] text-gray-400">Chart placeholder</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white">
                    <span className="text-[9px] text-gray-500">Current Functional Level</span>
                  </div>
                  <div className="border border-gray-200 rounded px-1.5 py-0.5 bg-white">
                    <span className="text-[9px] text-gray-500">Previous Comment</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="text-[9px] text-indigo-600 border border-indigo-200 rounded px-1.5 py-0.5">Continue</span>
                  <span className="text-[9px] text-green-600 border border-green-200 rounded px-1.5 py-0.5">Met</span>
                  <span className="text-[9px] text-red-600 border border-red-200 rounded px-1.5 py-0.5">Discontinue</span>
                </div>
                <div className="border border-gray-200 rounded px-1.5 py-1 bg-white">
                  <span className="text-[9px] text-gray-400 italic">Progress narrative...</span>
                </div>
              </div>
            </div>
            <div className="ml-4 rounded overflow-hidden border border-gray-200">
              <div className="bg-indigo-100/70 px-3 py-1 flex items-center gap-2">
                <span className="text-[10px] text-gray-400">&#8627;</span>
                <span className="text-[10px] font-bold text-indigo-800">1.2.0 Short Term Goal</span>
              </div>
              <div className="bg-gray-50/60 px-3 py-1.5">
                <p className="text-[10px] text-gray-400">Produce /r/ in final position...</p>
              </div>
            </div>
          </div>
        </FormEditorRow>

        {/* Row: Recommendations */}
        <FormEditorRow type="Text Area">
          <label className="block text-sm font-semibold text-gray-800">Recommendations:</label>
          <textarea rows={2} placeholder="Recommendations for the next reporting period..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1 resize-none" />
        </FormEditorRow>

        {/* Row: Prognosis */}
        <FormEditorRow type="Select">
          <label className="block text-sm font-semibold text-gray-800">Prognosis:</label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm mt-1">
            <option value="">Select prognosis...</option>
            <option>Excellent</option><option>Good</option><option>Fair</option><option>Guarded</option><option>Poor</option>
          </select>
        </FormEditorRow>

      </div>

      {/* Config modals */}
      {openConfig && <GoalProgressConfig onClose={() => setOpenConfig(false)} />}
      {showSettings && <FormSettingsPanel onClose={() => setShowSettings(false)} />}

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
