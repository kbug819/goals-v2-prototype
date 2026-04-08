export type GoalType = "long_term" | "short_term" | "standalone";
export type GoalStatus = "pending" | "active" | "met" | "discontinued";
export type MeasurementType = "percentage" | "count" | "duration" | "scale" | "binary" | "custom";

export interface GoalEvent {
  id: string;
  status: GoalStatus;
  occurred_on: string;
  comment: string | null;
  user_name: string;
  created_at: string;
}

export interface DataPoint {
  recorded_at: string;
  value: string;
  note: string | null;
}

export interface LinkedDocument {
  document_type: "CarePlan" | "Evaluation";
  document_label: string;
  signed: boolean;
}

export interface PatientGoal {
  id: string;
  goal_type: GoalType;
  parent_id: string | null;
  goal_text: string;
  measurement_type: MeasurementType;
  baseline_value: string | null;
  target_value: string | null;
  measurement_config: Record<string, unknown>;
  version_a: number;
  version_b: number;
  version_c: number;
  start_date: string;
  target_date: string | null;
  met_on: string | null;
  discipline: string;
  current_status: GoalStatus;
  events: GoalEvent[];
  data_points: DataPoint[];
  children: PatientGoal[];
  linked_document?: LinkedDocument | null;
}

export interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  disciplines: string[];
  status: string;
}

export const mockPatient: Patient = {
  id: "pat-1",
  name: "Jane Demo",
  date_of_birth: "2019-06-15",
  disciplines: ["Speech", "OT", "PT"],
  status: "Active",
};

export const mockGoals: PatientGoal[] = [
  // ── Speech Goals ──
  {
    id: "pg-1",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will improve articulation of /r/ sound across all word positions with 90% accuracy in structured and unstructured tasks.",
    measurement_type: "percentage",
    baseline_value: "45",
    target_value: "90",
    measurement_config: {},
    version_a: 1,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-09-01",
    met_on: null,
    discipline: "Speech",
    current_status: "active",
    events: [
      { id: "ev-1", status: "pending", occurred_on: "2026-03-01", comment: "Goal created from evaluation findings", user_name: "Sam Therapist", created_at: "2026-03-01T10:00:00Z" },
      { id: "ev-2", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-2b", status: "active", occurred_on: "2026-04-02", comment: "Progressing well — responding to visual cues for /r/ blends, continuing current approach", user_name: "Sam Therapist", created_at: "2026-04-02T15:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "45", note: "Initial baseline" },
      { recorded_at: "2026-03-12", value: "52", note: "Responding to visual cues" },
      { recorded_at: "2026-03-19", value: "60", note: null },
      { recorded_at: "2026-03-26", value: "68", note: "Good progress with /r/ blends" },
      { recorded_at: "2026-04-02", value: "72", note: null },
    ],
    children: [
      {
        id: "pg-2",
        goal_type: "short_term",
        parent_id: "pg-1",
        goal_text:
          "Patient will produce /r/ in initial position of words with 90% accuracy given minimal verbal cues across 3 consecutive sessions.",
        measurement_type: "percentage",
        baseline_value: "30",
        target_value: "90",
        measurement_config: {},
        version_a: 1,
        version_b: 1,
        version_c: 0,
        start_date: "2026-03-01",
        target_date: "2026-06-01",
        met_on: "2026-04-01",
        discipline: "Speech",
        current_status: "met",
        events: [
          { id: "ev-3", status: "pending", occurred_on: "2026-03-01", comment: "Created as STG under articulation LTG", user_name: "Sam Therapist", created_at: "2026-03-01T10:01:00Z" },
          { id: "ev-4", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
          { id: "ev-6", status: "met", occurred_on: "2026-04-01", comment: "Patient achieved 92% accuracy across 3 consecutive sessions", user_name: "Sam Therapist", created_at: "2026-04-01T14:00:00Z" },
        ],
        data_points: [
          { recorded_at: "2026-03-05", value: "45", note: "Produced /r/ in initial with verbal cue" },
          { recorded_at: "2026-03-12", value: "60", note: "Improving with visual model" },
          { recorded_at: "2026-03-19", value: "75", note: null },
          { recorded_at: "2026-03-26", value: "88", note: "Approaching target" },
          { recorded_at: "2026-04-01", value: "92", note: "Met - 3 consecutive sessions above 90%" },
        ],
        children: [],
      },
      {
        id: "pg-3",
        goal_type: "short_term",
        parent_id: "pg-1",
        goal_text:
          "Patient will produce /r/ in final position of words with 90% accuracy given minimal verbal cues across 3 consecutive sessions.",
        measurement_type: "percentage",
        baseline_value: "40",
        target_value: "90",
        measurement_config: {},
        version_a: 1,
        version_b: 2,
        version_c: 0,
        start_date: "2026-03-01",
        target_date: "2026-07-01",
        met_on: null,
        discipline: "Speech",
        current_status: "active",
        events: [
          { id: "ev-5", status: "pending", occurred_on: "2026-03-01", comment: "Created as STG under articulation LTG", user_name: "Sam Therapist", created_at: "2026-03-01T10:02:00Z" },
          { id: "ev-7", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
          { id: "ev-7b", status: "active", occurred_on: "2026-04-02", comment: "Still working on -er endings, adding modeling strategies next session", user_name: "Sam Therapist", created_at: "2026-04-02T15:05:00Z" },
        ],
        data_points: [
          { recorded_at: "2026-03-05", value: "40", note: null },
          { recorded_at: "2026-03-12", value: "48", note: null },
          { recorded_at: "2026-03-19", value: "55", note: "Struggles with -er endings" },
          { recorded_at: "2026-03-26", value: "62", note: null },
          { recorded_at: "2026-04-02", value: "68", note: "Better with modeling" },
        ],
        children: [],
      },
    ],
  },
  {
    id: "pg-4",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will improve expressive language skills to formulate age-appropriate sentences with minimal assistance.",
    measurement_type: "scale",
    baseline_value: "maximal_assist",
    target_value: "independent",
    measurement_config: {
      levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"],
    },
    version_a: 2,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-12-01",
    met_on: null,
    discipline: "Speech",
    current_status: "active",
    events: [
      { id: "ev-8", status: "pending", occurred_on: "2026-03-01", comment: "Goal created to address expressive language delays", user_name: "Sam Therapist", created_at: "2026-03-01T10:05:00Z" },
      { id: "ev-9", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-9b", status: "active", occurred_on: "2026-04-02", comment: "Holding steady at moderate assist — beginning to use sentence starters independently", user_name: "Sam Therapist", created_at: "2026-04-02T15:10:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "maximal_assist", note: "Baseline assessment" },
      { recorded_at: "2026-03-19", value: "moderate_assist", note: "Responding to sentence starters" },
      { recorded_at: "2026-04-02", value: "moderate_assist", note: "Consistent at moderate assist level" },
    ],
    children: [],
  },
  {
    id: "pg-5",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will increase mean length of utterance (MLU) from 2.5 to 4.0 words per utterance in spontaneous speech across 3 consecutive sessions.",
    measurement_type: "custom",
    baseline_value: "2.5",
    target_value: "4.0",
    measurement_config: { unit: "words", label: "Mean Length of Utterance" },
    version_a: 3,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-15",
    target_date: "2026-09-15",
    met_on: null,
    discipline: "Speech",
    current_status: "active",
    events: [
      { id: "ev-10", status: "pending", occurred_on: "2026-03-15", comment: "Standalone goal added to track MLU progress", user_name: "Sam Therapist", created_at: "2026-03-15T09:00:00Z" },
      { id: "ev-11", status: "active", occurred_on: "2026-03-15", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-15T09:30:00Z" },
      { id: "ev-11b", status: "active", occurred_on: "2026-04-02", comment: "Good gains — using more descriptors and conjunctions in spontaneous speech", user_name: "Sam Therapist", created_at: "2026-04-02T15:15:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-19", value: "2.5", note: "Baseline" },
      { recorded_at: "2026-03-26", value: "2.8", note: null },
      { recorded_at: "2026-04-02", value: "3.1", note: "Using more descriptors" },
    ],
    children: [],
  },
  {
    id: "pg-6",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will follow 2-step directions with 80% accuracy to improve receptive language skills.",
    measurement_type: "percentage",
    baseline_value: "35",
    target_value: "80",
    measurement_config: {},
    version_a: 4,
    version_b: 0,
    version_c: 0,
    start_date: "2026-01-15",
    target_date: "2026-06-01",
    met_on: null,
    discipline: "Speech",
    current_status: "discontinued",
    events: [
      { id: "ev-12", status: "pending", occurred_on: "2026-01-15", comment: "Goal created for receptive language", user_name: "Sam Therapist", created_at: "2026-01-15T10:00:00Z" },
      { id: "ev-13", status: "active", occurred_on: "2026-01-15", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-01-15T10:30:00Z" },
      { id: "ev-14", status: "discontinued", occurred_on: "2026-03-20", comment: "Reassessing approach - patient responding better to visual supports. Will create new goal with modified strategy.", user_name: "Sam Therapist", created_at: "2026-03-20T15:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-01-22", value: "35", note: null },
      { recorded_at: "2026-02-05", value: "38", note: null },
      { recorded_at: "2026-02-19", value: "40", note: "Minimal progress" },
      { recorded_at: "2026-03-05", value: "42", note: null },
    ],
    children: [],
  },
  {
    id: "pg-7",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will produce a minimum of 10 spontaneous requests per session using verbal or AAC modalities.",
    measurement_type: "count",
    baseline_value: "2",
    target_value: "10",
    measurement_config: { unit: "requests", per: "session" },
    version_a: 5,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-08-01",
    met_on: null,
    discipline: "Speech",
    current_status: "active",
    events: [
      { id: "ev-15", status: "pending", occurred_on: "2026-03-01", comment: "Goal created to increase spontaneous requesting", user_name: "Sam Therapist", created_at: "2026-03-01T10:10:00Z" },
      { id: "ev-16", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-16b", status: "active", occurred_on: "2026-04-02", comment: "Making progress — requesting preferred items without prompts, working on varied contexts", user_name: "Sam Therapist", created_at: "2026-04-02T15:20:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "2", note: "Baseline - only requests with prompting" },
      { recorded_at: "2026-03-12", value: "3", note: null },
      { recorded_at: "2026-03-19", value: "5", note: "Beginning to request preferred items independently" },
      { recorded_at: "2026-03-26", value: "6", note: null },
      { recorded_at: "2026-04-02", value: "7", note: "Consistent improvement with visual supports" },
    ],
    children: [],
  },
  // ── OT Goals ──
  {
    id: "pg-8",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will sustain attention to a structured tabletop activity for 180 seconds without redirection.",
    measurement_type: "duration",
    baseline_value: "30",
    target_value: "180",
    measurement_config: { unit: "seconds" },
    version_a: 6,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-09-01",
    met_on: null,
    discipline: "OT",
    current_status: "active",
    events: [
      { id: "ev-17", status: "pending", occurred_on: "2026-03-01", comment: "Goal created to address attention and task persistence", user_name: "Sam Therapist", created_at: "2026-03-01T11:00:00Z" },
      { id: "ev-18", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-18b", status: "active", occurred_on: "2026-04-02", comment: "Steady improvement — sensory breaks helping, up to 105s without redirection", user_name: "Sam Therapist", created_at: "2026-04-02T15:25:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "30", note: "Baseline" },
      { recorded_at: "2026-03-12", value: "45", note: null },
      { recorded_at: "2026-03-19", value: "60", note: "Better with sensory breaks" },
      { recorded_at: "2026-03-26", value: "90", note: null },
      { recorded_at: "2026-04-02", value: "105", note: "Steady improvement" },
    ],
    children: [],
  },
  {
    id: "pg-9",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will independently tie shoes using a two-loop method without physical assistance.",
    measurement_type: "binary",
    baseline_value: "false",
    target_value: "true",
    measurement_config: {},
    version_a: 7,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-07-01",
    met_on: null,
    discipline: "OT",
    current_status: "active",
    events: [
      { id: "ev-19", status: "pending", occurred_on: "2026-03-01", comment: "Goal created for fine motor independence", user_name: "Sam Therapist", created_at: "2026-03-01T11:05:00Z" },
      { id: "ev-20", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-20b", status: "active", occurred_on: "2026-04-02", comment: "Not yet achieved — forming first loop independently, still needs help with second loop", user_name: "Sam Therapist", created_at: "2026-04-02T15:30:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "false", note: "Cannot initiate without hand-over-hand" },
      { recorded_at: "2026-03-19", value: "false", note: "Can cross laces but not form loops" },
      { recorded_at: "2026-04-02", value: "false", note: "Forming first loop independently, needs help with second" },
    ],
    children: [],
  },
  {
    id: "pg-10",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will improve bilateral coordination to complete age-appropriate self-care tasks with 80% independence.",
    measurement_type: "percentage",
    baseline_value: "25",
    target_value: "80",
    measurement_config: {},
    version_a: 8,
    version_b: 0,
    version_c: 0,
    start_date: "2026-04-08",
    target_date: "2026-10-08",
    met_on: null,
    discipline: "OT",
    current_status: "pending",
    events: [
      { id: "ev-21", status: "pending", occurred_on: "2026-04-08", comment: "Added to initial OT evaluation", user_name: "Sam Therapist", created_at: "2026-04-08T09:00:00Z" },
    ],
    data_points: [],
    children: [
      {
        id: "pg-11",
        goal_type: "short_term",
        parent_id: "pg-10",
        goal_text:
          "Patient will button and unbutton 4 buttons on a shirt within 2 minutes given verbal cues only.",
        measurement_type: "duration",
        baseline_value: "300",
        target_value: "120",
        measurement_config: { unit: "seconds" },
        version_a: 8,
        version_b: 1,
        version_c: 0,
        start_date: "2026-04-08",
        target_date: "2026-07-08",
        met_on: null,
        discipline: "OT",
        current_status: "pending",
        events: [
          { id: "ev-22", status: "pending", occurred_on: "2026-04-08", comment: "Added to initial OT evaluation", user_name: "Sam Therapist", created_at: "2026-04-08T09:01:00Z" },
        ],
        data_points: [],
        children: [],
        linked_document: { document_type: "Evaluation", document_label: "OT Evaluation - Apr 8, 2026", signed: false },
      },
    ],
    linked_document: { document_type: "Evaluation", document_label: "OT Evaluation - Apr 8, 2026", signed: false },
  },
  {
    id: "pg-12",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will use a pincer grasp to pick up small objects (beads, coins) and place them in a container with 90% accuracy across 3 consecutive sessions.",
    measurement_type: "percentage",
    baseline_value: "40",
    target_value: "90",
    measurement_config: {},
    version_a: 9,
    version_b: 0,
    version_c: 0,
    start_date: "2026-04-05",
    target_date: "2026-10-05",
    met_on: null,
    discipline: "OT",
    current_status: "pending",
    events: [
      { id: "ev-23", status: "pending", occurred_on: "2026-04-05", comment: "Added to OT plan of care renewal", user_name: "Sam Therapist", created_at: "2026-04-05T14:00:00Z" },
    ],
    data_points: [],
    children: [],
    linked_document: { document_type: "CarePlan", document_label: "OT Plan of Care - Apr 5, 2026", signed: false },
  },
  // ── PT Goals ──
  {
    id: "pg-13",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will improve dynamic balance to navigate uneven surfaces and playground equipment with supervision only.",
    measurement_type: "scale",
    baseline_value: "maximal_assist",
    target_value: "supervision",
    measurement_config: {
      levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"],
    },
    version_a: 10,
    version_b: 0,
    version_c: 0,
    start_date: "2026-02-15",
    target_date: "2026-08-15",
    met_on: null,
    discipline: "PT",
    current_status: "active",
    events: [
      { id: "ev-24", status: "pending", occurred_on: "2026-02-15", comment: "Goal created from PT evaluation", user_name: "Sam Therapist", created_at: "2026-02-15T09:00:00Z" },
      { id: "ev-25", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-25b", status: "active", occurred_on: "2026-04-03", comment: "Moving to minimal assist — navigating wood chips and grass with standby only", user_name: "Sam Therapist", created_at: "2026-04-03T14:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "maximal_assist", note: "Baseline - needs hand-held support on all surfaces" },
      { recorded_at: "2026-03-06", value: "moderate_assist", note: "Walking on grass with one hand held" },
      { recorded_at: "2026-03-20", value: "moderate_assist", note: null },
      { recorded_at: "2026-04-03", value: "minimal_assist", note: "Navigating wood chips with standby assist" },
    ],
    children: [
      {
        id: "pg-14",
        goal_type: "short_term",
        parent_id: "pg-13",
        goal_text:
          "Patient will walk across a 4-inch balance beam for 6 feet with minimal assist in 3 out of 4 trials.",
        measurement_type: "percentage",
        baseline_value: "25",
        target_value: "75",
        measurement_config: {},
        version_a: 10,
        version_b: 1,
        version_c: 0,
        start_date: "2026-02-15",
        target_date: "2026-05-15",
        met_on: null,
        discipline: "PT",
        current_status: "active",
        events: [
          { id: "ev-26", status: "pending", occurred_on: "2026-02-15", comment: "Created as STG under balance LTG", user_name: "Sam Therapist", created_at: "2026-02-15T09:01:00Z" },
          { id: "ev-27", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
          { id: "ev-27b", status: "active", occurred_on: "2026-04-03", comment: "Plateaued at 2/4 trials — adding lateral weight shift exercises to support progress", user_name: "Sam Therapist", created_at: "2026-04-03T14:05:00Z" },
        ],
        data_points: [
          { recorded_at: "2026-02-20", value: "25", note: "1/4 trials - falls off after 2 feet" },
          { recorded_at: "2026-03-06", value: "25", note: null },
          { recorded_at: "2026-03-20", value: "50", note: "2/4 trials - completing 4 feet consistently" },
          { recorded_at: "2026-04-03", value: "50", note: "Steady but not yet at 3/4" },
        ],
        children: [],
      },
    ],
  },
  {
    id: "pg-15",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will ascend and descend a full flight of stairs using reciprocal pattern with rail support independently.",
    measurement_type: "binary",
    baseline_value: "false",
    target_value: "true",
    measurement_config: {},
    version_a: 11,
    version_b: 0,
    version_c: 0,
    start_date: "2026-02-15",
    target_date: "2026-06-15",
    met_on: "2026-03-27",
    discipline: "PT",
    current_status: "met",
    events: [
      { id: "ev-28", status: "pending", occurred_on: "2026-02-15", comment: "Goal for stair navigation safety", user_name: "Sam Therapist", created_at: "2026-02-15T09:05:00Z" },
      { id: "ev-29", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-30", status: "met", occurred_on: "2026-03-27", comment: "Patient demonstrated reciprocal stair pattern with rail x3 consecutive sessions", user_name: "Sam Therapist", created_at: "2026-03-27T11:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "false", note: "Step-to pattern only, both feet each step" },
      { recorded_at: "2026-03-06", value: "false", note: "Reciprocal ascending, step-to descending" },
      { recorded_at: "2026-03-20", value: "false", note: "Reciprocal both directions but inconsistent" },
      { recorded_at: "2026-03-27", value: "true", note: "Consistent reciprocal pattern up and down with rail" },
    ],
    children: [],
  },
  {
    id: "pg-16",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will increase single-leg stance duration to 15 seconds bilaterally to support functional mobility.",
    measurement_type: "duration",
    baseline_value: "3",
    target_value: "15",
    measurement_config: { unit: "seconds" },
    version_a: 12,
    version_b: 0,
    version_c: 0,
    start_date: "2026-02-15",
    target_date: "2026-08-15",
    met_on: null,
    discipline: "PT",
    current_status: "active",
    events: [
      { id: "ev-31", status: "pending", occurred_on: "2026-02-15", comment: "Goal created for lower extremity stability", user_name: "Sam Therapist", created_at: "2026-02-15T09:10:00Z" },
      { id: "ev-32", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-32b", status: "active", occurred_on: "2026-04-03", comment: "Improving symmetry between sides — right at 10s, left catching up at 8s", user_name: "Sam Therapist", created_at: "2026-04-03T14:10:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "3", note: "Baseline - bilateral" },
      { recorded_at: "2026-03-06", value: "5", note: null },
      { recorded_at: "2026-03-20", value: "7", note: "Better on right, left still at 5s" },
      { recorded_at: "2026-04-03", value: "9", note: "Improving symmetry" },
    ],
    children: [],
  },
  // ── Additional OT Goals (scale primary, count + percentage supporting) ──
  {
    id: "pg-17",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will improve handwriting legibility from dependent to minimal assist using appropriate letter sizing and spacing.",
    measurement_type: "scale",
    baseline_value: "dependent",
    target_value: "minimal_assist",
    measurement_config: {
      levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"],
    },
    version_a: 13,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-09-01",
    met_on: null,
    discipline: "OT",
    current_status: "active",
    events: [
      { id: "ev-33", status: "pending", occurred_on: "2026-03-01", comment: "Goal created for handwriting remediation", user_name: "Sam Therapist", created_at: "2026-03-01T11:15:00Z" },
      { id: "ev-34", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-34b", status: "active", occurred_on: "2026-04-02", comment: "At moderate assist now — writing first name with moderate cueing, working on letter sizing", user_name: "Sam Therapist", created_at: "2026-04-02T15:35:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "dependent", note: "Cannot form letters without hand-over-hand" },
      { recorded_at: "2026-03-19", value: "maximal_assist", note: "Forming some letters with verbal + visual cues" },
      { recorded_at: "2026-04-02", value: "moderate_assist", note: "Writing first name with moderate cueing" },
    ],
    children: [],
  },
  {
    id: "pg-18",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will complete 8 clothing fasteners (buttons, snaps, zippers) independently within a dressing routine.",
    measurement_type: "count",
    baseline_value: "2",
    target_value: "8",
    measurement_config: { unit: "fasteners", per: "routine" },
    version_a: 14,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-08-01",
    met_on: null,
    discipline: "OT",
    current_status: "active",
    events: [
      { id: "ev-35", status: "pending", occurred_on: "2026-03-01", comment: "Goal for self-care independence", user_name: "Sam Therapist", created_at: "2026-03-01T11:20:00Z" },
      { id: "ev-36", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-36b", status: "active", occurred_on: "2026-04-02", comment: "Up to 4 fasteners — managing large buttons now, snaps and zipper pull consistent", user_name: "Sam Therapist", created_at: "2026-04-02T15:40:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "2", note: "Can manage large snaps only" },
      { recorded_at: "2026-03-19", value: "3", note: "Added zipper pull with adapter" },
      { recorded_at: "2026-04-02", value: "4", note: "Managing large buttons now" },
    ],
    children: [],
  },
  {
    id: "pg-19",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will use scissors to cut along a straight line within 1/4 inch accuracy in 80% of trials.",
    measurement_type: "percentage",
    baseline_value: "20",
    target_value: "80",
    measurement_config: {},
    version_a: 15,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-07-01",
    met_on: null,
    discipline: "OT",
    current_status: "active",
    events: [
      { id: "ev-37", status: "pending", occurred_on: "2026-03-01", comment: "Goal for scissor skill development", user_name: "Sam Therapist", created_at: "2026-03-01T11:25:00Z" },
      { id: "ev-38", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-38b", status: "active", occurred_on: "2026-04-02", comment: "Transitioned to standard scissors — accuracy improving, still working on curves", user_name: "Sam Therapist", created_at: "2026-04-02T15:45:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "20", note: "Baseline - difficulty with grasp and bilateral coordination" },
      { recorded_at: "2026-03-19", value: "35", note: "Improving with adaptive scissors" },
      { recorded_at: "2026-04-02", value: "45", note: "Transitioned to standard scissors" },
    ],
    children: [],
  },
  // ── Additional PT Goals (duration/count primary, scale supporting) ──
  {
    id: "pg-20",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will perform 10 consecutive heel raises bilaterally to improve ankle strength for functional mobility.",
    measurement_type: "count",
    baseline_value: "3",
    target_value: "10",
    measurement_config: { unit: "repetitions", per: "set" },
    version_a: 16,
    version_b: 0,
    version_c: 0,
    start_date: "2026-02-15",
    target_date: "2026-07-15",
    met_on: null,
    discipline: "PT",
    current_status: "active",
    events: [
      { id: "ev-39", status: "pending", occurred_on: "2026-02-15", comment: "Goal created for ankle strengthening", user_name: "Sam Therapist", created_at: "2026-02-15T09:15:00Z" },
      { id: "ev-40", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-40b", status: "active", occurred_on: "2026-04-03", comment: "At 7 reps freestanding — good progress, targeting 10 by next month", user_name: "Sam Therapist", created_at: "2026-04-03T14:15:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "3", note: "Baseline - loses balance after 3" },
      { recorded_at: "2026-03-06", value: "4", note: null },
      { recorded_at: "2026-03-20", value: "6", note: "Using wall for light support" },
      { recorded_at: "2026-04-03", value: "7", note: "Freestanding now" },
    ],
    children: [],
  },
  {
    id: "pg-21",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will improve functional transfers from floor to stand to supervision level to support safe play transitions.",
    measurement_type: "scale",
    baseline_value: "moderate_assist",
    target_value: "supervision",
    measurement_config: {
      levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"],
    },
    version_a: 17,
    version_b: 0,
    version_c: 0,
    start_date: "2026-02-15",
    target_date: "2026-08-15",
    met_on: null,
    discipline: "PT",
    current_status: "active",
    events: [
      { id: "ev-41", status: "pending", occurred_on: "2026-02-15", comment: "Goal created for transfer safety", user_name: "Sam Therapist", created_at: "2026-02-15T09:20:00Z" },
      { id: "ev-42", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-42b", status: "active", occurred_on: "2026-04-03", comment: "At minimal assist — using furniture to pull to stand, not quite at supervision yet", user_name: "Sam Therapist", created_at: "2026-04-03T14:20:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "moderate_assist", note: "Needs assist at hips for floor-to-stand" },
      { recorded_at: "2026-03-06", value: "moderate_assist", note: null },
      { recorded_at: "2026-03-20", value: "minimal_assist", note: "Using furniture to pull to stand with standby" },
      { recorded_at: "2026-04-03", value: "minimal_assist", note: "More consistent but not yet at supervision" },
    ],
    children: [],
  },
  // ── Additional Speech Goals (percentage primary, count + scale supporting) ──
  {
    id: "pg-22",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will correctly use regular past tense -ed in spontaneous speech with 80% accuracy across 3 consecutive sessions.",
    measurement_type: "percentage",
    baseline_value: "30",
    target_value: "80",
    measurement_config: {},
    version_a: 18,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-08-01",
    met_on: null,
    discipline: "Speech",
    current_status: "active",
    events: [
      { id: "ev-43", status: "pending", occurred_on: "2026-03-01", comment: "Goal for morphological marker development", user_name: "Sam Therapist", created_at: "2026-03-01T10:15:00Z" },
      { id: "ev-44", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-44b", status: "active", occurred_on: "2026-04-02", comment: "At 50% — generalizing to novel verbs in structured tasks, not yet in conversation", user_name: "Sam Therapist", created_at: "2026-04-02T15:50:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "30", note: "Baseline - omits -ed in most contexts" },
      { recorded_at: "2026-03-19", value: "42", note: "Using -ed with high-frequency verbs" },
      { recorded_at: "2026-04-02", value: "50", note: "Generalizing to novel verbs in structured tasks" },
    ],
    children: [],
  },
  {
    id: "pg-23",
    goal_type: "standalone",
    parent_id: null,
    goal_text:
      "Patient will initiate 5 conversational turns per structured play interaction to improve pragmatic language.",
    measurement_type: "count",
    baseline_value: "1",
    target_value: "5",
    measurement_config: { unit: "turns", per: "interaction" },
    version_a: 19,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-08-01",
    met_on: null,
    discipline: "Speech",
    current_status: "active",
    events: [
      { id: "ev-45", status: "pending", occurred_on: "2026-03-01", comment: "Goal for pragmatic language and social communication", user_name: "Sam Therapist", created_at: "2026-03-01T10:20:00Z" },
      { id: "ev-46", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-46b", status: "active", occurred_on: "2026-04-02", comment: "Up to 3 turns — starting to ask questions during play, needs support for topic maintenance", user_name: "Sam Therapist", created_at: "2026-04-02T15:55:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "1", note: "Baseline - responds but rarely initiates" },
      { recorded_at: "2026-03-19", value: "2", note: "Initiating with preferred topics" },
      { recorded_at: "2026-04-02", value: "3", note: "Beginning to ask questions during play" },
    ],
    children: [],
  },
  {
    id: "pg-24",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will improve oral motor coordination for feeding from maximal assist to minimal assist level.",
    measurement_type: "scale",
    baseline_value: "maximal_assist",
    target_value: "minimal_assist",
    measurement_config: {
      levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"],
    },
    version_a: 20,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-10-01",
    met_on: null,
    discipline: "Speech",
    current_status: "active",
    events: [
      { id: "ev-47", status: "pending", occurred_on: "2026-03-01", comment: "Goal created for oral motor and feeding therapy", user_name: "Sam Therapist", created_at: "2026-03-01T10:25:00Z" },
      { id: "ev-48", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-48b", status: "active", occurred_on: "2026-04-02", comment: "Moved to moderate assist — managing soft solids with verbal cues, continuing texture progression", user_name: "Sam Therapist", created_at: "2026-04-02T16:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "maximal_assist", note: "Baseline - difficulty managing purees without support" },
      { recorded_at: "2026-03-19", value: "maximal_assist", note: "Tolerating textured purees with cueing" },
      { recorded_at: "2026-04-02", value: "moderate_assist", note: "Managing soft solids with moderate verbal cues" },
    ],
    children: [],
  },
];
