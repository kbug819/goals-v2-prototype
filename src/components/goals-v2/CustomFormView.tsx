"use client";

import { useState } from "react";
import { PatientGoal, GoalStatus, mockGoals, mockPatient } from "@/data/mockData";
import GoalEditorInline from "@/components/goals-v2/GoalEditorInline";
import DevNote from "@/components/shared/DevNote";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatDate";

// STG editor uses GoalEditorInline with parentGoal prop

// ── Status action (continue / met / discontinue) ──
function StatusActionRow({ goal, onStatusChange }: { goal: PatientGoal; onStatusChange: (id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) => void }) {
  const [action, setAction] = useState<"continued" | "met" | "discontinued" | null>(null);
  const [comment, setComment] = useState("");
  const [functionalLevel, setFunctionalLevel] = useState("");

  if (goal.current_status !== "active") return null;

  function handleSubmit() {
    if (!action || !comment.trim()) return;
    const statusMap: Record<string, GoalStatus> = { continued: "active", met: "met", discontinued: "discontinued" };
    onStatusChange(goal.id, statusMap[action], comment, functionalLevel || null);
    setAction(null);
    setComment("");
  }

  const actionConfig = {
    continued: { label: "Continuing Goal", placeholder: "Progress update for this goal...", btnLabel: "Save Update", btnClass: "bg-indigo-600 hover:bg-indigo-700", color: "text-indigo-600", borderColor: "border-indigo-200" },
    met: { label: "Marking as Met", placeholder: "How was this goal met? (e.g. achieved 92% across 3 sessions)", btnLabel: "Confirm Met", btnClass: "bg-green-600 hover:bg-green-700", color: "text-green-600", borderColor: "border-green-200" },
    discontinued: { label: "Discontinuing Goal", placeholder: "Reason for discontinuing (e.g. reassessing approach, patient not responding to current strategy)", btnLabel: "Confirm Discontinue", btnClass: "bg-red-600 hover:bg-red-700", color: "text-red-600", borderColor: "border-red-200" },
  };

  if (!action) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <button onClick={() => setAction("continued")} className="px-2.5 py-1 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
          Continue
        </button>
        <button onClick={() => setAction("met")} className="px-2.5 py-1 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
          Mark Met
        </button>
        <button onClick={() => setAction("discontinued")} className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          Discontinue
        </button>
      </div>
    );
  }

  const cfg = actionConfig[action];

  return (
    <div className={`mt-2 border ${cfg.borderColor} rounded-lg p-3 bg-gray-50 space-y-2`}>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder={cfg.placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      <div>
        <label className="block text-xs text-gray-500 mb-1">Current Functional Level</label>
        <input
          value={functionalLevel}
          onChange={(e) => setFunctionalLevel(e.target.value)}
          placeholder="Update patient's current functional status..."
          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => { setAction(null); setComment(""); }} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
        <button
          onClick={handleSubmit}
          disabled={!comment.trim()}
          className={`px-3 py-1 text-xs font-medium text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed ${cfg.btnClass}`}
        >
          {cfg.btnLabel}
        </button>
      </div>
    </div>
  );
}

// ── Active goal card (locked, with synopsis) ──
function ActiveGoalCard({
  goal,
  childGoals,
  onStatusChange,
  onAddStg,
  onEdit,
  onDelete,
}: {
  goal: PatientGoal;
  childGoals: PatientGoal[];
  onStatusChange: (id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) => void;
  onAddStg: (parentId: string) => void;
  onEdit: (goal: PatientGoal) => void;
  onDelete: (id: string) => void;
}) {
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  const latestEvent = goal.events[goal.events.length - 1];
  const latestDataPoint = goal.data_points[goal.data_points.length - 1];
  const isTopLevel = goal.goal_type !== "short_term";

  // Build synopsis
  let synopsis = "";
  if (goal.measurement_type === "percentage" && goal.baseline_value && goal.target_value) {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    synopsis = `${current}% of ${goal.target_value}% target`;
  } else if (goal.measurement_type === "scale") {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    synopsis = `${(current || "").replace(/_/g, " ")} → ${(goal.target_value || "").replace(/_/g, " ")}`;
  } else if (goal.measurement_type === "count" && goal.baseline_value && goal.target_value) {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    const unit = (goal.measurement_config.unit as string) || "";
    synopsis = `${current}/${goal.target_value} ${unit}`;
  } else if (goal.measurement_type === "duration" && goal.baseline_value && goal.target_value) {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    const unit = (goal.measurement_config.unit as string) || "seconds";
    synopsis = `${current}s of ${goal.target_value} ${unit} target`;
  } else if (goal.measurement_type === "binary") {
    const current = latestDataPoint ? latestDataPoint.value : "false";
    synopsis = current === "true" ? "Achieved" : "Not yet achieved";
  } else if (goal.measurement_type === "custom" && goal.baseline_value && goal.target_value) {
    const current = latestDataPoint ? latestDataPoint.value : goal.baseline_value;
    const unit = (goal.measurement_config.unit as string) || "";
    synopsis = `${current} of ${goal.target_value} ${unit}`;
  }

  return (
    <div className={`${goal.goal_type === "short_term" ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}>
      <div className="border border-gray-200 rounded-lg bg-white px-4 py-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
            </span>
            <StatusBadge status={goal.current_status} />
            <span className="text-xs text-gray-400 capitalize">{goal.measurement_type}</span>
            {synopsis && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs font-medium text-gray-600">{synopsis}</span>
              </>
            )}
          </div>
          {goal.current_status === "pending" ? (
            <div className="flex items-center gap-1.5">
              <button onClick={() => onEdit(goal)} className="text-gray-300 hover:text-indigo-500 transition-colors" title="Edit pending goal">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => onDelete(goal.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Delete pending goal">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-gray-300">Locked</span>
            </div>
          )}
        </div>

        {/* Goal text */}
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{goal.goal_text}</p>

        {/* Measurement trajectory table (for continued/active goals with data) */}
        {goal.current_status === "active" && goal.baseline_value && goal.target_value && goal.data_points.length > 0 && (() => {
          const dp = goal.data_points;
          const currentDp = dp[dp.length - 1];
          // "Previous" = value from ~halfway through data points (simulates prior POC period)
          const prevIdx = Math.max(0, Math.floor(dp.length / 2) - 1);
          const previousDp = dp.length > 2 ? dp[prevIdx] : null;
          const fmt = (v: string) => {
            const d = v.replace(/_/g, " ");
            if (goal.measurement_type === "percentage") return `${d}%`;
            if (goal.measurement_type === "duration") return `${d} ${(goal.measurement_config.unit as string) || "sec"}`;
            if (goal.measurement_type === "count") return `${d} ${(goal.measurement_config.unit as string) || ""}`;
            return d;
          };

          return (
            <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left font-semibold text-gray-500">Baseline — {formatDate(goal.start_date)}</th>
                    {previousDp ? <th className="px-3 py-2 text-left font-semibold text-gray-500">Previous — {formatDate(previousDp.recorded_at)}</th> : null}
                    <th className="px-3 py-2 text-left font-semibold text-gray-500">Target — {goal.target_date ? formatDate(goal.target_date) : "—"}</th>
                    <th className="px-3 py-2 text-left font-semibold text-indigo-600">Current — {formatDate(currentDp.recorded_at)}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-2 font-medium text-gray-700">{fmt(goal.baseline_value!)}</td>
                    {previousDp ? <td className="px-3 py-2 font-medium text-gray-700">{fmt(previousDp.value)}</td> : null}
                    <td className="px-3 py-2 font-medium text-gray-700">{fmt(goal.target_value!)}</td>
                    <td className="px-3 py-2 font-semibold text-indigo-600">{fmt(currentDp.value)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* Current functional level */}
        {latestEvent?.current_functional_level ? (
          <div className="mt-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Current Functional Level</label>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">{latestEvent.current_functional_level}</div>
          </div>
        ) : null}

        {/* Last comment */}
        {latestEvent?.comment ? (
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="text-xs text-gray-400 italic">{latestEvent.comment}</span>
          </div>
        ) : null}

        {/* Status actions */}
        <StatusActionRow goal={goal} onStatusChange={onStatusChange} />

        {/* Add STG button for top-level goals */}
        {isTopLevel && (
          <button
            onClick={() => onAddStg(goal.id)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Short Term Goal
          </button>
        )}
      </div>

      {/* Child STGs */}
      {childGoals.length > 0 && (
        <div className="mt-2 space-y-2">
          {childGoals.map((child) => (
            <ActiveGoalCard key={child.id} goal={child} childGoals={[]} onStatusChange={onStatusChange} onAddStg={onAddStg} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pending goal row (deletable + editable) ──
function PendingGoalRow({ goal, onDelete, onEdit }: { goal: PatientGoal; onDelete: (id: string) => void; onEdit: (goal: PatientGoal) => void }) {
  const prefix = goal.goal_type === "short_term" ? "STG" : "LTG";
  return (
    <div className={`${goal.goal_type === "short_term" ? "ml-6 border-l-2 border-amber-200 pl-4" : ""}`}>
      <div className="flex items-center justify-between px-4 py-3 border border-amber-200 bg-amber-50/30 rounded-lg">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0">
            {prefix} {goal.version_a}.{goal.version_b}.{goal.version_c}
          </span>
          <StatusBadge status="pending" />
          <span className="text-sm text-gray-700 truncate">{goal.goal_text}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
          <button onClick={() => onEdit(goal)} className="text-gray-300 hover:text-indigo-500 transition-colors" title="Edit pending goal">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(goal.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Delete pending goal">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main view ──
export default function CustomFormView() {
  const [goals, setGoals] = useState<PatientGoal[]>(() => {
    const flat: PatientGoal[] = [];
    for (const g of mockGoals) {
      flat.push(g);
      for (const c of g.children) {
        flat.push(c);
      }
    }
    return flat;
  });
  const [showNewLtg, setShowNewLtg] = useState(false);
  const [addingStgFor, setAddingStgFor] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<PatientGoal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const speechGoals = goals.filter((g) => g.discipline === "Speech" && g.current_status !== "met" && g.current_status !== "discontinued");
  const activeTopLevel = speechGoals.filter((g) => g.current_status === "active" && g.goal_type !== "short_term");
  const pendingTopLevel = speechGoals.filter((g) => g.current_status === "pending" && g.goal_type !== "short_term");

  function getChildren(parentId: string) {
    return speechGoals.filter((g) => g.parent_id === parentId);
  }

  function handleAddLtg(goal: PatientGoal) {
    setGoals([...goals, goal]);
    setShowNewLtg(false);
  }

  function handleEditSave(updatedGoal: PatientGoal) {
    setGoals(goals.map((g) => g.id === updatedGoal.id ? updatedGoal : g));
    setEditingGoal(null);
  }

  function handleAddStg(goal: PatientGoal) {
    setGoals([...goals, goal]);
    setAddingStgFor(null);
  }

  function handleStatusChange(id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) {
    setGoals(goals.map((g) => {
      if (g.id !== id) return g;
      const now = new Date().toISOString();
      const today = now.slice(0, 10);
      return {
        ...g,
        current_status: status,
        met_on: status === "met" ? today : g.met_on,
        events: [...g.events, {
          id: `ev-action-${Date.now()}`,
          status,
          occurred_on: today,
          comment: comment || (status === "met" ? "Goal met" : "Goal continued"),
          current_functional_level: currentFunctionalLevel,
          user_name: "Sam Therapist",
          created_at: now,
        }],
      };
    }));
  }

  function handleDelete(id: string) {
    setDeleteConfirm(id);
  }

  function confirmDelete() {
    if (deleteConfirm) {
      setGoals(goals.filter((g) => g.id !== deleteConfirm));
      setDeleteConfirm(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews the smart-goals-editor-v2 custom form component for Plans of Care and Evaluations. This is the Goal CRUD component where therapists create, update, continue, meet, or discontinue goals. Active goals are locked after signing. New LTGs and STGs can be added with AI-assisted goal text generation."
        todos={[]}
      />

      {/* Document context banner */}
      <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 text-blue-700">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>
          Editing: <span className="font-medium">Plan of Care — Speech</span>
          <span className="text-blue-400 mx-2">|</span>
          <span className="text-blue-500">Draft — Not yet signed</span>
        </span>
      </div>

      {/* Active goals (locked) */}
      {activeTopLevel.length > 0 && (
        <div className="space-y-3 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Current Goals</h3>
          {activeTopLevel.map((goal) => (
            <div key={goal.id}>
              <ActiveGoalCard
                goal={goal}
                childGoals={getChildren(goal.id)}
                onStatusChange={handleStatusChange}
                onAddStg={(parentId) => setAddingStgFor(parentId)}
                onEdit={setEditingGoal}
                onDelete={handleDelete}
              />
              {addingStgFor === goal.id && (
                <div className="ml-6 border-l-2 border-indigo-200 pl-4 mt-2">
                  <GoalEditorInline
                    disciplines={mockPatient.disciplines}
                    existingGoals={goals}
                    onSave={handleAddStg}
                    onCancel={() => setAddingStgFor(null)}
                    parentGoal={goal}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pending goals */}
      {pendingTopLevel.length > 0 && (
        <div className="space-y-2 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Pending Goals</h3>
          {pendingTopLevel.map((goal) => (
            <div key={goal.id}>
              {editingGoal?.id === goal.id ? (
                <GoalEditorInline
                  disciplines={mockPatient.disciplines}
                  existingGoals={goals}
                  onSave={handleEditSave}
                  onCancel={() => setEditingGoal(null)}
                  editingGoal={editingGoal}
                />
              ) : (
                <PendingGoalRow goal={goal} onDelete={handleDelete} onEdit={setEditingGoal} />
              )}
              {getChildren(goal.id).map((child) => (
                editingGoal?.id === child.id ? (
                  <GoalEditorInline
                    key={child.id}
                    disciplines={mockPatient.disciplines}
                    existingGoals={goals}
                    onSave={handleEditSave}
                    onCancel={() => setEditingGoal(null)}
                    editingGoal={editingGoal}
                  />
                ) : (
                  <PendingGoalRow key={child.id} goal={child} onDelete={handleDelete} onEdit={setEditingGoal} />
                )
              ))}
              {/* Add STG to pending LTG */}
              {addingStgFor === goal.id ? (
                <div className="ml-6 border-l-2 border-indigo-200 pl-4 mt-2">
                  <GoalEditorInline
                    disciplines={mockPatient.disciplines}
                    existingGoals={goals}
                    onSave={handleAddStg}
                    onCancel={() => setAddingStgFor(null)}
                    parentGoal={goal}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setAddingStgFor(goal.id)}
                  className="ml-6 mt-2 inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Short Term Goal
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new LTG button / inline editor */}
      <div className="mt-4">
        {!showNewLtg ? (
          <button
            onClick={() => setShowNewLtg(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-indigo-600 border-2 border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Goal
          </button>
        ) : (
          <GoalEditorInline
            disciplines={mockPatient.disciplines}
            existingGoals={goals}
            onSave={handleAddLtg}
            onCancel={() => setShowNewLtg(false)}
          />
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center gap-4 text-xs text-gray-400">
        <span>{speechGoals.length} goals</span>
        <span>{speechGoals.filter((g) => g.current_status === "pending").length} pending</span>
        <span>{speechGoals.filter((g) => g.current_status === "active").length} active</span>
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype &mdash; Custom Form Preview
        </span>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Goal</h3>
            <p className="text-sm text-gray-600 mb-1">Are you sure you want to delete this pending goal?</p>
            <p className="text-xs text-gray-400 mb-4">This action cannot be undone. Only pending goals can be deleted.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
