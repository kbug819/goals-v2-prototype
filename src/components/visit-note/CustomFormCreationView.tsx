"use client";

import { useState } from "react";
import DevNote from "@/components/shared/DevNote";

type ComponentConfig = "goal_list" | "goal_progress" | "goal_admin" | null;

function GoalListConfig({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Goal List</h2>
            <p className="text-sm text-gray-500">This component displays active goals as a checklist with optional notes per goal.</p>
          </div>
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
            <input defaultValue="Only checked goals will show on the completed visit note" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Options:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Include notes field per goal</span>
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
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Goal Progress Tracker</h2>
            <p className="text-sm text-gray-500">This component allows therapists to log therapy activities and trials per goal.</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <p className="text-xs text-gray-400 mb-1.5">Primary label describing this form field</p>
            <input defaultValue="Goal Progress" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fields per goal:</label>
            <p className="text-xs text-gray-400 mb-1.5">Select which fields appear for each goal</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Therapy activity name</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Correct trials / Total trials</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Prompting level</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-600">Prompting type</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prompting level options:</label>
            <p className="text-xs text-gray-400 mb-1.5">Comma delimited list of prompting levels</p>
            <input defaultValue="Independent,Min,Mod,Max,Hand-over-hand" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prompting type options:</label>
            <p className="text-xs text-gray-400 mb-1.5">Comma delimited list of prompting types</p>
            <input defaultValue="Verbal,Visual,Tactile,Gestural,Modeling,Phonemic" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Goal w/ Admin Components</h2>
            <p className="text-sm text-gray-500">This component displays goals with admin-configured sub-components for each goal.</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label / Question:</label>
            <p className="text-xs text-gray-400 mb-1.5">Primary label describing this form field</p>
            <input defaultValue="Goals w/ Admin Selected Components" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Components per goal:</label>
            <p className="text-xs text-gray-400 mb-1.5">Select which components appear under each goal. These are fixed for all therapists.</p>
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
        </div>
        <div className="flex justify-between px-6 py-4 border-t border-gray-200">
          <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 rounded-lg hover:bg-indigo-800">Accept</button>
        </div>
      </div>
    </div>
  );
}

const NEW_GOAL_COMPONENTS: { name: string; icon: string; config: ComponentConfig }[] = [
  { name: "Goal List", icon: "☑", config: "goal_list" },
  { name: "Goal Progress Tracker", icon: "📈", config: "goal_progress" },
  { name: "Goal w/ Admin Components", icon: "⚙", config: "goal_admin" },
];

export default function CustomFormCreationView() {
  const [openConfig, setOpenConfig] = useState<ComponentConfig>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews what the Custom Form Editor could look like with new goal-specific smart components. Click a new goal component on the right to see its configuration options."
        todos={["For the 'Goal w/ admin components', what standard components could admin add under each goal? Free text field, radio buttons, check buttons? Or maybe we could get some examples of what users want here and add some specific configurations."]}
      />

      {/* Editor header */}
      <div className="flex items-center justify-between mb-0 bg-slate-100 border border-slate-200 rounded-t-lg px-5 py-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-lg font-semibold text-slate-800">Visit Note - Custom Goals</span>
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white border border-slate-200 rounded px-3 py-1.5 text-slate-600">Visit note</span>
          <span className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-400 text-xs">i</span>
        </div>
      </div>

      <div className="flex gap-0">
        {/* Left: Form canvas showing new goal components */}
        <div className="flex-1 bg-white border border-gray-200 border-t-0 rounded-b-lg">
          <div className="divide-y divide-gray-200">
            {/* Goal List component */}
            <div className="px-5 py-4 bg-blue-50/30">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0" /></svg>
                  <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-indigo-700 font-medium">Goal List</span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">New</span>
                    </div>
                    <span className="text-gray-400 cursor-pointer">&times;</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Goals addressed</p>
                  <p className="text-xs text-gray-400 italic mb-2">Only checked goals will show on the completed visit note</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 border border-dashed border-gray-300 rounded px-3 py-2 bg-white">
                      <input type="checkbox" disabled className="w-3.5 h-3.5 rounded border-gray-300" />
                      <span className="text-xs font-mono text-indigo-600 font-bold">LTG 1.0.0</span>
                      <span className="text-xs text-gray-400 truncate">Patient will improve articulation of /r/ sound...</span>
                    </div>
                    <div className="ml-5 flex items-center gap-2 border border-dashed border-gray-200 rounded px-3 py-1.5 bg-white">
                      <input type="checkbox" disabled className="w-3.5 h-3.5 rounded border-gray-300" />
                      <span className="text-xs font-mono text-indigo-500 font-bold">STG 1.2.0</span>
                      <span className="text-xs text-gray-400 truncate">Produce /r/ in final position...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal Progress Tracker component */}
            <div className="px-5 py-4 bg-blue-50/30">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0" /></svg>
                  <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-indigo-700 font-medium">Goal Progress Tracker</span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">New</span>
                    </div>
                    <span className="text-gray-400 cursor-pointer">&times;</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Goal progress</p>
                  <p className="text-xs text-gray-400 italic mb-2">Active goals with therapy activity, trials, and prompting fields</p>
                  <div className="space-y-1.5">
                    <div className="border border-dashed border-gray-300 rounded px-3 py-2 bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-indigo-600 font-bold">LTG 1.0.0</span>
                        <span className="text-xs text-gray-400 truncate">Patient will improve articulation...</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>Activity: <span className="border-b border-dashed border-gray-300 px-4">___</span></span>
                        <span>Correct: <span className="border-b border-dashed border-gray-300 px-2">__</span> / <span className="border-b border-dashed border-gray-300 px-2">__</span></span>
                        <span>Level: <span className="border-b border-dashed border-gray-300 px-3">___</span></span>
                        <span>Type: <span className="border-b border-dashed border-gray-300 px-3">___</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal w/ Admin Components */}
            <div className="px-5 py-4 bg-blue-50/30">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0" /></svg>
                  <div className="grid grid-cols-3 gap-0.5">{[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />)}</div>
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-indigo-700 font-medium">Goal w/ Admin Components</span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-0.5">New</span>
                    </div>
                    <span className="text-gray-400 cursor-pointer">&times;</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Goals w/ admin selected components</p>
                  <p className="text-xs text-gray-400 italic mb-2">Goals with admin-configured sub-components (progress status, notes, etc.)</p>
                  <div className="space-y-1.5">
                    <div className="border border-dashed border-gray-300 rounded px-3 py-2 bg-white">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono text-indigo-600 font-bold">LTG 1.0.0</span>
                        <span className="text-xs text-gray-400 truncate">Patient will improve articulation...</span>
                      </div>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <span>Progress:</span>
                          {["Progressing", "Plateau", "Regression", "Met"].map((s) => (
                            <span key={s} className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-gray-300 inline-block" />{s}</span>
                          ))}
                        </div>
                        <div>Notes: <span className="border-b border-dashed border-gray-300 px-16">___</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Component palette */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-indigo-800">Component Palette</h3>
            </div>

            {/* Standard Components - collapsed/non-clickable */}
            <div className="px-4 py-2 border-b border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <span>📦</span> Standard Components
                <svg className="w-3 h-3 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </h4>
            </div>

            {/* SMART Components - collapsed */}
            <div className="px-4 py-2 border-b border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <span>🔗</span> SMART Components
                <svg className="w-3 h-3 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </h4>
            </div>

            {/* NEW Goal Components - expanded and clickable */}
            <div className="px-4 py-3 bg-blue-50/30">
              <h4 className="text-xs font-semibold text-gray-600 flex items-center gap-1 mb-1">
                <span>🎯</span> Goal Components
                <span className="text-xs font-medium text-blue-600 bg-blue-100 rounded-full px-1.5 py-0.5 ml-1">New</span>
              </h4>
              <p className="text-xs text-gray-400 mb-2">New goal-specific components for visit notes. Click to configure.</p>
              <div className="space-y-1">
                {NEW_GOAL_COMPONENTS.map((comp) => (
                  <button
                    key={comp.name}
                    onClick={() => setOpenConfig(comp.config)}
                    className="w-full text-left px-2.5 py-2 text-sm text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg border border-transparent hover:border-indigo-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>{comp.icon}</span> {comp.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; Custom Form Editor Preview
        </span>
      </div>

      {/* Config modals */}
      {openConfig === "goal_list" && <GoalListConfig onClose={() => setOpenConfig(null)} />}
      {openConfig === "goal_progress" && <GoalProgressConfig onClose={() => setOpenConfig(null)} />}
      {openConfig === "goal_admin" && <GoalAdminConfig onClose={() => setOpenConfig(null)} />}
    </div>
  );
}
