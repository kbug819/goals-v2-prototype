"use client";

import { useState } from "react";
import { PatientGoal, GoalStatus, mockGoals, mockPatient } from "@/data/mockData";
import GoalEditorInline from "@/components/goals-v2/GoalEditorInline";
import DevNote from "@/components/shared/DevNote";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatDate";

// STG editor uses GoalEditorInline with parentGoal prop

// ── Status action (continue / met / discontinue) ──
function StatusActionRow({ goal, activeChildCount = 0, onStatusChange }: { goal: PatientGoal; activeChildCount?: number; onStatusChange: (id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) => void }) {
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

  const showChildWarning = activeChildCount > 0 && (action === "met" || action === "discontinued");

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

      {showChildWarning && (
        <div className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${
          action === "met"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>
            {action === "met"
              ? `This will also mark ${activeChildCount} active short-term goal${activeChildCount > 1 ? "s" : ""} as met.`
              : `This will also discontinue ${activeChildCount} active short-term goal${activeChildCount > 1 ? "s" : ""}.`
            }
          </span>
        </div>
      )}

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
  onRevert,
}: {
  goal: PatientGoal;
  childGoals: PatientGoal[];
  onStatusChange: (id: string, status: GoalStatus, comment: string, currentFunctionalLevel: string | null) => void;
  onAddStg: (parentId: string) => void;
  onEdit: (goal: PatientGoal) => void;
  onDelete: (id: string) => void;
  onRevert?: (id: string) => void;
}) {
  const latestEvent = goal.events[goal.events.length - 1];
  const isTopLevel = goal.goal_type !== "short_term";

  const isClosedOnForm = goal.current_status === "met" || goal.current_status === "discontinued";
  const isChild = goal.goal_type === "short_term";
  const goalLabel = isChild ? "Short Term Goal" : "Long Term Goal";

  // ── Met / Discontinued on this form: in-place card with revert ──
  if (isClosedOnForm) {
    const closedBg = goal.current_status === "met" ? "bg-blue-100/60" : "bg-red-100/60";
    const closedHeaderBg = goal.current_status === "met" ? "bg-blue-200/80" : "bg-red-200/80";
    return (
      <div className={`${isChild ? "ml-8 mt-2" : ""}`}>
        {isChild && <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>}
        <div className={`rounded-lg overflow-hidden border border-gray-200 ${closedBg}`}>
          {/* Header bar */}
          <div className={`flex items-center justify-between px-4 py-2.5 ${closedHeaderBg}`}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-800">
                {goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}
              </span>
              <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Current status: {goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}</span>
              {onRevert && (
                <button
                  onClick={() => onRevert(goal.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors flex-shrink-0 shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Revert
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-3">
            <p className="text-sm text-gray-500 leading-relaxed">{goal.goal_text}</p>
            {latestEvent?.comment ? (
              <p className="text-sm text-gray-400 italic mt-2">{latestEvent.comment}</p>
            ) : null}
          </div>
        </div>

        {/* Child STGs also show their closed state */}
        {childGoals.length > 0 && (
          <div className="space-y-2">
            {childGoals.map((child) => (
              <ActiveGoalCard key={child.id} goal={child} childGoals={[]} onStatusChange={onStatusChange} onAddStg={onAddStg} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Active goal: full card ──
  return (
    <div className={`${isChild ? "ml-8 mt-2" : ""}`}>
      {isChild && <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>}
      <div className={`rounded-lg overflow-hidden border shadow-sm ${goal.current_status === "pending" ? "border-amber-200" : "border-gray-200"} bg-white`}>
        {/* Header bar */}
        <div className={`flex items-center justify-between px-4 py-2.5 ${goal.current_status === "pending" ? "bg-amber-100/80" : "bg-indigo-100/70"}`}>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${goal.current_status === "pending" ? "text-amber-900" : "text-indigo-900"}`}>
              {goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}
            </span>
            <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Current status: {goal.current_status.charAt(0).toUpperCase() + goal.current_status.slice(1)}</span>
            {goal.current_status === "pending" && (
              <>
                <button onClick={() => onEdit(goal)} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Edit pending goal">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => onDelete(goal.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete pending goal">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-3">
          {/* Goal text */}
          <p className="text-sm text-gray-700 leading-relaxed">{goal.goal_text}</p>

          {/* Measurement trajectory table */}
          {goal.current_status === "active" && goal.baseline_value && goal.target_value && goal.data_points.length > 0 && (() => {
            const dp = goal.data_points;
            const currentDp = dp[dp.length - 1];
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
              <div className={`grid gap-3 mt-1 ${previousDp ? "grid-cols-4" : "grid-cols-3"}`}>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Baseline</label>
                  <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 text-sm text-gray-700">{fmt(goal.baseline_value!)}</div>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">{formatDate(goal.start_date)}</span>
                </div>
                {previousDp && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Previous</label>
                    <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 text-sm text-gray-700">{fmt(previousDp.value)}</div>
                    <span className="text-[11px] text-gray-400 mt-0.5 block">{formatDate(previousDp.recorded_at)}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 mb-1">Current</label>
                  <div className="border border-indigo-200 rounded px-2.5 py-1.5 bg-indigo-50 text-sm font-semibold text-indigo-700">{fmt(currentDp.value)}</div>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">{formatDate(currentDp.recorded_at)}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target</label>
                  <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-gray-50 text-sm text-gray-700">{fmt(goal.target_value!)}</div>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">{goal.target_date ? formatDate(goal.target_date) : "—"}</span>
                </div>
              </div>
            );
          })()}

          {/* Current functional level + Comment side by side */}
          {(latestEvent?.current_functional_level || latestEvent?.comment) ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Current Functional Level {latestEvent?.occurred_on ? <span className="font-normal text-gray-400">{formatDate(latestEvent.occurred_on)}</span> : null}</label>
                <div className="text-sm text-gray-600 bg-gray-50 rounded px-2.5 py-1.5 border border-gray-200 min-h-[2.25rem]">{latestEvent?.current_functional_level || "—"}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Previous Comment {latestEvent?.occurred_on ? <span className="font-normal text-gray-400">{formatDate(latestEvent.occurred_on)}</span> : null}</label>
                <div className="text-sm text-gray-600 italic bg-gray-50 rounded px-2.5 py-1.5 border border-gray-200 min-h-[2.25rem]">{latestEvent?.comment || "—"}</div>
              </div>
            </div>
          ) : null}

          {/* Status actions */}
          <StatusActionRow goal={goal} activeChildCount={childGoals.filter((c) => c.current_status === "active").length} onStatusChange={onStatusChange} />

          {/* Add STG button for top-level goals */}
          {isTopLevel && goal.current_status === "active" && (
            <button
              onClick={() => onAddStg(goal.id)}
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Short Term Goal
            </button>
          )}
        </div>
      </div>

      {/* Child STGs */}
      {childGoals.length > 0 && (
        <div className="space-y-2">
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
  // Track goals whose status was changed on this form (not pre-existing met/discontinued)
  const [changedOnForm, setChangedOnForm] = useState<Set<string>>(new Set());

  const speechGoals = goals.filter((g) => g.discipline === "Speech");
  // Show active goals + goals changed to met/disc on this form (in place)
  const visibleTopLevel = speechGoals.filter((g) => g.goal_type !== "short_term" && (g.current_status === "active" || changedOnForm.has(g.id)));
  const pendingTopLevel = speechGoals.filter((g) => g.current_status === "pending" && g.goal_type !== "short_term");

  function getChildren(parentId: string) {
    return speechGoals.filter((g) => g.parent_id === parentId && (g.current_status === "active" || g.current_status === "pending" || changedOnForm.has(g.id)));
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
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    // If met or discontinued on a parent goal, cascade to active children
    const cascadeIds = new Set<string>([id]);
    if (status === "met" || status === "discontinued") {
      goals.forEach((g) => {
        if (g.parent_id === id && g.current_status === "active") {
          cascadeIds.add(g.id);
        }
      });
      setChangedOnForm((prev) => { const next = new Set(prev); cascadeIds.forEach((cid) => next.add(cid)); return next; });
    }
    setGoals(goals.map((g) => {
      if (!cascadeIds.has(g.id)) return g;
      const isParent = g.id === id;
      return {
        ...g,
        current_status: status,
        met_on: status === "met" ? today : g.met_on,
        events: [...g.events, {
          id: `ev-action-${Date.now()}-${g.id}`,
          status,
          occurred_on: today,
          comment: isParent
            ? (comment || (status === "met" ? "Goal met" : "Goal continued"))
            : `${status === "met" ? "Met" : "Discontinued"} with parent LTG`,
          current_functional_level: currentFunctionalLevel,
          user_name: "Sam Therapist",
          created_at: now,
        }],
      };
    }));
  }

  function handleRevertStatus(id: string) {
    // Revert goal and only children that were cascaded on this form
    const revertIds = new Set<string>([id]);
    goals.forEach((g) => {
      if (g.parent_id === id && changedOnForm.has(g.id)) {
        revertIds.add(g.id);
      }
    });
    const now = new Date().toISOString();
    const today = now.slice(0, 10);
    setChangedOnForm((prev) => {
      const next = new Set(prev);
      revertIds.forEach((rid) => next.delete(rid));
      return next;
    });
    setGoals(goals.map((g) => {
      if (!revertIds.has(g.id)) return g;
      // Find the last functional level before the form change
      const priorEvents = g.events.filter((e) => !e.id.startsWith("ev-action-"));
      const priorLevel = [...priorEvents].reverse().find((e) => e.current_functional_level)?.current_functional_level || null;
      return {
        ...g,
        current_status: "active" as GoalStatus,
        met_on: null,
        events: [...g.events, {
          id: `ev-revert-${Date.now()}-${g.id}`,
          status: "active" as GoalStatus,
          occurred_on: today,
          comment: "Reverted to active (unsigned draft)",
          current_functional_level: priorLevel,
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
        todos={["Decision needed: Should marking an LTG as met/discontinued automatically cascade to all active STGs? This is new behavior (V1 does not cascade). Current prototype cascades with a warning prompt + revert option. Confirm with team whether this should be mandatory, optional (checkbox), or not included."]}
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

      {/* Current goals (active + changed-on-form met/disc stay in place) */}
      {visibleTopLevel.length > 0 && (
        <div className="space-y-3 mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Current Goals</h3>
          {visibleTopLevel.map((goal) => (
            <div key={goal.id}>
              <ActiveGoalCard
                goal={goal}
                childGoals={getChildren(goal.id)}
                onStatusChange={handleStatusChange}
                onAddStg={(parentId) => setAddingStgFor(parentId)}
                onEdit={setEditingGoal}
                onDelete={handleDelete}
                onRevert={handleRevertStatus}
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
