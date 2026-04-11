"use client";

import { useState } from "react";

interface DevNoteProps {
  description: string;
  todos?: string[];
}

export default function DevNote({ description, todos = [] }: DevNoteProps) {
  const [showTodos, setShowTodos] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const pendingCount = todos.filter((_, i) => !checkedItems[i]).length;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg mb-4 overflow-hidden">
      <div className="px-4 py-3">
        {/* Header + description always visible */}
        <div className="flex items-center gap-1.5 mb-1">
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="text-xs font-semibold text-amber-700">Dev Note</span>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">{description}</p>

        {/* Questions / To Do toggle */}
        {todos.length > 0 && (
          <button
            onClick={() => setShowTodos(!showTodos)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Questions / To Do
            {pendingCount > 0 ? (
              <span className="bg-amber-200 text-amber-800 rounded-full px-2 py-0.5 font-medium">{pendingCount} open</span>
            ) : (
              <span className="bg-green-200 text-green-800 rounded-full px-2 py-0.5 font-medium">all done</span>
            )}
            <svg className={`w-3 h-3 transition-transform ${showTodos ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Expandable todo list */}
      {showTodos && todos.length > 0 && (
        <div className="px-4 pb-3 pt-2 border-t border-amber-200">
          <div className="space-y-1.5">
            {todos.map((todo, i) => (
              <label key={i} className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkedItems[i] || false}
                  onChange={(e) => setCheckedItems({ ...checkedItems, [i]: e.target.checked })}
                  className="w-3.5 h-3.5 mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className={`text-xs leading-relaxed ${checkedItems[i] ? "text-amber-400 line-through" : "text-amber-700"}`}>
                  {todo}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
