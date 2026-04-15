"use client";

import { useState } from "react";
import { mockGoals, mockPatient, PatientGoal } from "@/data/mockData";
import DevNote from "@/components/shared/DevNote";
import { formatDate } from "@/utils/formatDate";

const today = new Date().toISOString().slice(0, 10);

function formatGoalValue(value: string, goal: PatientGoal): string {
  const d = value.replace(/_/g, " ");
  if (goal.measurement_type === "percentage") return `${d}%`;
  if (goal.measurement_type === "duration") return `${d} ${(goal.measurement_config.unit as string) || "sec"}`;
  if (goal.measurement_type === "count") return `${d} ${(goal.measurement_config.unit as string) || ""}`;
  return d;
}

// Status that the therapist set on the form (before signing)
type DraftAction = "continued" | "met" | "discontinued";

interface GoalWithDraftAction extends PatientGoal {
  draftAction?: DraftAction;
  draftComment?: string;
  draftFunctionalLevel?: string;
}

function GoalShowCard({ goal, isSigned }: { goal: GoalWithDraftAction; isSigned: boolean }) {
  const goalLabel = goal.goal_type === "short_term" ? "Short Term Goal" : "Long Term Goal";
  const isChild = goal.goal_type === "short_term";
  const latestEvent = goal.events.length > 0 ? goal.events[goal.events.length - 1] : null;

  // Determine display status
  let displayStatus = goal.current_status;
  let pendingLabel = "";
  if (goal.draftAction) {
    if (isSigned) {
      // Signed: show the final status
      displayStatus = goal.draftAction === "continued" ? "active" : goal.draftAction;
    } else {
      // Draft: show the action as pending
      displayStatus = goal.draftAction === "continued" ? "active" : goal.draftAction;
      pendingLabel = goal.draftAction === "continued" ? "" :
        goal.draftAction === "met" ? " (pending sign)" : " (pending sign)";
    }
  } else if (goal.current_status === "pending") {
    displayStatus = isSigned ? "active" : "pending";
  }

  const statusLabel = displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1) + pendingLabel;

  const headerBg =
    displayStatus === "active" ? "bg-indigo-100/70" :
    displayStatus === "pending" ? "bg-amber-100/70" :
    displayStatus === "met" ? "bg-blue-200/80" :
    displayStatus === "discontinued" ? "bg-red-200/80" :
    "bg-gray-100/70";
  const headerText =
    displayStatus === "active" ? "text-indigo-900" :
    displayStatus === "pending" ? "text-amber-900" :
    displayStatus === "met" ? "text-blue-900" :
    displayStatus === "discontinued" ? "text-red-900" :
    "text-gray-900";

  // Use draft functional level/comment if available, otherwise latest event
  const funcLevel = goal.draftFunctionalLevel || latestEvent?.current_functional_level || null;
  const comment = goal.draftComment || latestEvent?.comment || null;
  const eventDate = goal.draftAction ? today : latestEvent?.occurred_on;

  const isClosedStatus = displayStatus === "met" || displayStatus === "discontinued";

  return (
    <div className={`${isChild ? "ml-8 mt-2" : ""}`}>
      {isChild && <div className="text-gray-400 -ml-6 mb-1 text-sm">&#8627;</div>}
      <div className={`rounded-lg overflow-hidden border shadow-sm ${
        isClosedStatus && !isSigned ? "border-gray-300" : "border-gray-200"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-2.5 ${headerBg}`}>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${headerText}`}>
              {goal.version_a}.{goal.version_b}.{goal.version_c} {goalLabel}
            </span>
            <span className="text-xs font-medium text-gray-500 capitalize">{goal.measurement_type}</span>
          </div>
          <span className={`text-sm font-medium ${
            displayStatus === "met" ? "text-blue-700" :
            displayStatus === "discontinued" ? "text-red-700" :
            "text-gray-700"
          }`}>
            {statusLabel}
          </span>
        </div>

        {/* Body */}
        <div className={`px-4 py-3 space-y-3 ${isClosedStatus ? "bg-gray-50" : "bg-gray-50/60"}`}>
          <p className={`text-sm leading-relaxed ${isClosedStatus && !isSigned ? "text-gray-500" : "text-gray-700"}`}>{goal.goal_text}</p>

          {/* Measurement trajectory */}
          {goal.baseline_value && goal.target_value && goal.data_points.length > 0 && (() => {
            const dp = goal.data_points;
            const currentDp = dp[dp.length - 1];
            const prevIdx = Math.max(0, Math.floor(dp.length / 2) - 1);
            const previousDp = dp.length > 2 ? dp[prevIdx] : null;

            return (
              <div className={`grid gap-3 ${previousDp ? "grid-cols-4" : "grid-cols-3"}`}>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Baseline <span className="font-normal text-gray-400">{formatDate(goal.start_date)}</span></label>
                  <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-white text-sm text-gray-700">{formatGoalValue(goal.baseline_value, goal)}</div>
                </div>
                {previousDp && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Previous <span className="font-normal text-gray-400">{formatDate(previousDp.recorded_at)}</span></label>
                    <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-white text-sm text-gray-700">{formatGoalValue(previousDp.value, goal)}</div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 mb-1">Current <span className="font-normal text-indigo-400">{formatDate(currentDp.recorded_at)}</span></label>
                  <div className="border border-indigo-200 rounded px-2.5 py-1.5 bg-indigo-50 text-sm font-semibold text-indigo-700">{formatGoalValue(currentDp.value, goal)}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target <span className="font-normal text-gray-400">{goal.target_date ? formatDate(goal.target_date) : ""}</span></label>
                  <div className="border border-gray-200 rounded px-2.5 py-1.5 bg-white text-sm text-gray-700">{formatGoalValue(goal.target_value, goal)}</div>
                </div>
              </div>
            );
          })()}

          {/* Current functional level + Comment */}
          {(funcLevel || comment) && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Current Functional Level {eventDate ? <span className="font-normal text-gray-400">{formatDate(eventDate)}</span> : null}</label>
                <div className="text-sm text-gray-600 bg-white rounded px-2.5 py-1.5 border border-gray-200 min-h-[2.25rem]">{funcLevel || "—"}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Comment {eventDate ? <span className="font-normal text-gray-400">{formatDate(eventDate)}</span> : null}</label>
                <div className="text-sm text-gray-600 italic bg-white rounded px-2.5 py-1.5 border border-gray-200 min-h-[2.25rem]">{comment || "—"}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Children */}
      {(goal.children as GoalWithDraftAction[]).filter((c) =>
        c.current_status === "active" || c.current_status === "pending" || c.draftAction
      ).map((child) => (
        <GoalShowCard key={child.id} goal={child} isSigned={isSigned} />
      ))}
    </div>
  );
}

const SHOW_FORMATS = [
  { value: "saved", label: "Saved (Draft)" },
  { value: "signed", label: "Signed" },
];

export default function CustomFormShowView() {
  const [showFormat, setShowFormat] = useState("saved");
  const isSigned = showFormat === "signed";

  const activeGoals = mockGoals.filter(
    (g) => g.discipline === "Speech" && g.goal_type !== "short_term" && g.current_status === "active"
  );

  // Simulate therapist actions on the form:
  // - LTG 1.0.0 (pg-1): continued with updated functional level
  // - STG 1.2.0 (pg-3, child of pg-1): discontinued
  // - LTG 2.0.0 (pg-4): continued
  // - LTG 3.0.0 (pg-5, standalone): marked as met with both STGs
  // New pending goals added on this POC
  const draftActions: Record<string, { action: DraftAction; comment: string; funcLevel: string }> = {
    "pg-1": { action: "continued", comment: "Progressing well — 72% across positions, continuing current approach with focus on carryover", funcLevel: "Producing /r/ at 72% across all positions; initial strongest at 85%, final at 65%. Self-monitoring improving." },
    "pg-3": { action: "discontinued", comment: "Discontinuing — reassessing approach for final position /r/, will create new STG with different strategy", funcLevel: "Final position /r/ at 68% but plateauing with current approach; -er endings remain inconsistent" },
    "pg-4": { action: "continued", comment: "Good progress — moving from maximal to moderate assist, continuing expressive language work", funcLevel: "Formulating 3-4 word sentences with moderate verbal cueing; using sentence starters independently" },
    "pg-5": { action: "met", comment: "MLU target of 4.0 achieved across 3 consecutive sessions — goal met", funcLevel: "MLU at 4.1 words in spontaneous speech; using descriptors, conjunctions, and prepositions consistently" },
  };

  // Apply draft actions to goals and their children
  const goalsWithActions: GoalWithDraftAction[] = activeGoals.map((g) => {
    const action = draftActions[g.id];
    const updatedChildren = g.children.map((c) => {
      const childAction = draftActions[c.id];
      // If parent is met, cascade to active children
      if (action?.action === "met" && c.current_status === "active" && !childAction) {
        return { ...c, draftAction: "met" as DraftAction, draftComment: "Met with parent LTG", draftFunctionalLevel: action.funcLevel };
      }
      if (childAction) {
        return { ...c, draftAction: childAction.action, draftComment: childAction.comment, draftFunctionalLevel: childAction.funcLevel };
      }
      return c;
    });

    return {
      ...g,
      children: updatedChildren,
      ...(action ? { draftAction: action.action, draftComment: action.comment, draftFunctionalLevel: action.funcLevel } : {}),
    };
  });

  // New pending goals
  const pendingGoals: GoalWithDraftAction[] = [
    {
      id: "pg-new-stg1",
      goal_type: "short_term",
      parent_id: "pg-1",
      goal_text: "Patient will produce /r/ in medial position of words with 85% accuracy given minimal verbal cues across 3 consecutive sessions.",
      measurement_type: "percentage",
      baseline_value: "35",
      target_value: "85",
      measurement_config: {},
      version_a: 1, version_b: 3, version_c: 0,
      start_date: today,
      target_date: "2026-07-15",
      met_on: null,
      discipline: "Speech",
      current_status: "pending",
      events: [
        { id: "ev-new1", status: "pending", occurred_on: today, comment: "New STG added for medial /r/ position", current_functional_level: "Medial /r/ at 35% — inconsistent even with modeling", user_name: "Sam Therapist", created_at: new Date().toISOString() },
      ],
      data_points: [],
      children: [],
      linked_document: null,
    },
    {
      id: "pg-new-stg2",
      goal_type: "short_term",
      parent_id: "pg-4",
      goal_text: "Patient will formulate 4-word sentences using a visual sentence strip with minimal verbal cues in 8/10 opportunities.",
      measurement_type: "percentage",
      baseline_value: "30",
      target_value: "80",
      measurement_config: {},
      version_a: 2, version_b: 1, version_c: 0,
      start_date: today,
      target_date: "2026-08-01",
      met_on: null,
      discipline: "Speech",
      current_status: "pending",
      events: [
        { id: "ev-new2", status: "pending", occurred_on: today, comment: "New STG targeting sentence formulation", current_functional_level: "Producing 2-3 word utterances; requires moderate assist for 4+ word sentences", user_name: "Sam Therapist", created_at: new Date().toISOString() },
      ],
      data_points: [],
      children: [],
      linked_document: null,
    },
    {
      id: "pg-new-ltg",
      goal_type: "long_term",
      parent_id: null,
      goal_text: "Patient will demonstrate age-appropriate phonological awareness skills including rhyming, segmenting, and blending with 80% accuracy.",
      measurement_type: "percentage",
      baseline_value: "25",
      target_value: "80",
      measurement_config: {},
      version_a: 4, version_b: 0, version_c: 0,
      start_date: today,
      target_date: "2026-10-15",
      met_on: null,
      discipline: "Speech",
      current_status: "pending",
      events: [
        { id: "ev-new3", status: "pending", occurred_on: today, comment: "New LTG added to address phonological awareness deficits identified in reassessment", current_functional_level: "Identifies rhyming words in 25% of opportunities; unable to segment or blend sounds consistently", user_name: "Sam Therapist", created_at: new Date().toISOString() },
      ],
      data_points: [],
      children: [],
      linked_document: null,
    },
  ];

  // Inject pending STGs into parents and add pending LTGs
  const allGoals: GoalWithDraftAction[] = [
    ...goalsWithActions.map((g) => {
      const pendingChildren = pendingGoals.filter((pg) => pg.parent_id === g.id);
      if (pendingChildren.length === 0) return g;
      return { ...g, children: [...g.children, ...pendingChildren] };
    }),
    ...pendingGoals.filter((pg) => pg.goal_type !== "short_term"),
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <DevNote
        description="This page previews the POC/Eval show view. 'Saved (Draft)' shows therapist's actions: continued goals (updated functional level + comment), one STG discontinued (red, pending sign), one LTG met (blue, pending sign), and new pending goals (amber). 'Signed' shows final state: all pending→active, met stays met, discontinued stays discontinued."
        todos={[]}
      />

      {/* Format selector */}
      <div className="flex items-center gap-1.5 mb-6">
        <span className="text-xs text-gray-400 mr-1">Showing:</span>
        {SHOW_FORMATS.map((f) => (
          <button
            key={f.value}
            onClick={() => setShowFormat(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showFormat === f.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Document header */}
      <div className={`rounded-t-lg px-5 py-3 flex items-center justify-between ${isSigned ? "bg-slate-700 text-white" : "bg-slate-600 text-white"}`}>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium">Plan of Care — Speech Therapy</span>
        </div>
        {isSigned ? (
          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Signed {formatDate(today)}</span>
        ) : (
          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">Draft — Saved {formatDate(today)}</span>
        )}
      </div>

      {/* Document body */}
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg">
        {/* Patient info */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Speech Therapy Plan of Care</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-xs font-semibold text-gray-500">Patient</span><p className="text-gray-700">{mockPatient.name}</p></div>
            <div><span className="text-xs font-semibold text-gray-500">DOB</span><p className="text-gray-700">6/15/2019 (6 years old)</p></div>
            <div><span className="text-xs font-semibold text-gray-500">Therapist</span><p className="text-gray-700">Sam Therapist, CCC-SLP</p></div>
            <div><span className="text-xs font-semibold text-gray-500">Discipline</span><p className="text-gray-700">Speech-Language Pathology</p></div>
            <div><span className="text-xs font-semibold text-gray-500">POC Period</span><p className="text-gray-700">3/1/2026 - 9/1/2026</p></div>
            <div><span className="text-xs font-semibold text-gray-500">Diagnosis</span><p className="text-gray-700">F80.2, R48.8</p></div>
          </div>
        </div>

        {/* Frequency / Duration */}
        <div className="px-5 py-3 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-xs font-semibold text-gray-500">Frequency</span><p className="text-gray-700">2x per week</p></div>
            <div><span className="text-xs font-semibold text-gray-500">Duration</span><p className="text-gray-700">30-minute sessions</p></div>
          </div>
        </div>

        {/* Goals section */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Goals</h3>
          <div className="space-y-3">
            {allGoals.map((goal) => (
              <GoalShowCard key={goal.id} goal={goal} isSigned={isSigned} />
            ))}
          </div>
        </div>

        {/* Medical necessity */}
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Medical Necessity</h3>
          <p className="text-sm text-gray-600 leading-relaxed">Continued speech therapy services are medically necessary to address articulation deficits, expressive language delays, and reduced mean length of utterance. Without intervention, the patient is at risk for academic difficulties and social communication challenges. The patient has demonstrated steady progress toward established goals, supporting continued services at the current frequency.</p>
        </div>

        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Prognosis</h3>
          <p className="text-sm text-gray-600">Good — Patient demonstrates consistent progress and strong motivation. Family involvement supports carryover.</p>
        </div>

        {/* Signature section */}
        <div className="px-5 py-4">
          {isSigned ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Sam Therapist, CCC-SLP</p>
                <p className="text-xs text-gray-400">Signed electronically on {formatDate(today)} at 2:15 PM CDT</p>
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">Signed</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>This document has not been signed.</p>
                <p className="text-xs text-gray-400 mt-1">Signing will activate pending goals, finalize met/discontinued statuses, and lock the document.</p>
              </div>
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Sign Plan of Care
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prototype badge */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Goals V2 Prototype — POC / Eval Show Preview
        </span>
      </div>
    </div>
  );
}
