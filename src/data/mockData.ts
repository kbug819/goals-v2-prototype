export type GoalType = "long_term" | "short_term" | "standalone";
export type GoalStatus = "pending" | "active" | "met" | "discontinued";
export type MeasurementType = "percentage" | "count" | "duration" | "scale" | "binary" | "custom";

export interface GoalEvent {
  id: string;
  status: GoalStatus;
  occurred_on: string;
  comment: string | null;
  current_functional_level: string | null;
  user_name: string;
  created_at: string;
}

export interface DataPoint {
  recorded_at: string;
  value: string;
  activity_name: string | null;
  note: string | null;
  recorded_by: string;
  visit_note_id: string | null;
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
      { id: "ev-1", status: "pending", occurred_on: "2026-03-01", comment: "Goal created from evaluation findings", current_functional_level: "Produces /r/ in initial position with maximal verbal cues in structured tasks only; inconsistent in conversational speech", user_name: "Sam Therapist", created_at: "2026-03-01T10:00:00Z" },
      { id: "ev-2", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Produces /r/ in initial position with maximal verbal cues in structured tasks only; inconsistent in conversational speech", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-2b", status: "active", occurred_on: "2026-04-02", comment: "Progressing well — responding to visual cues for /r/ blends, continuing current approach", current_functional_level: "Producing /r/ at 72% across positions; initial position strongest at 85%, final position at 65%", user_name: "Sam Therapist", created_at: "2026-04-02T15:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "45", activity_name: "Articulation drills", note: "Initial baseline", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-12", value: "52", activity_name: "Articulation drills", note: "Responding to visual cues", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "60", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-26", value: "68", activity_name: "Minimal pairs activity", note: "Good progress with /r/ blends", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "72", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
          { id: "ev-3", status: "pending", occurred_on: "2026-03-01", comment: "Created as STG under articulation LTG", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-03-01T10:01:00Z" },
          { id: "ev-4", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
          { id: "ev-6", status: "met", occurred_on: "2026-04-01", comment: "Patient achieved 92% accuracy across 3 consecutive sessions", current_functional_level: "Producing /r/ in initial position at 92% accuracy with minimal verbal cues in structured and unstructured tasks", user_name: "Sam Therapist", created_at: "2026-04-01T14:00:00Z" },
        ],
        data_points: [
          { recorded_at: "2026-03-05", value: "45", activity_name: "Word-level drills", note: "Produced /r/ in initial with verbal cue", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-03-12", value: "60", activity_name: null, note: "Improving with visual model", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-03-19", value: "75", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-03-26", value: "88", activity_name: null, note: "Approaching target", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-04-01", value: "92", activity_name: "Structured conversation", note: "Met - 3 consecutive sessions above 90%", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
          { id: "ev-5", status: "pending", occurred_on: "2026-03-01", comment: "Created as STG under articulation LTG", current_functional_level: "Produces /r/ in final position inconsistently; struggles with -er endings", user_name: "Sam Therapist", created_at: "2026-03-01T10:02:00Z" },
          { id: "ev-7", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Produces /r/ in final position inconsistently; struggles with -er endings", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
          { id: "ev-7b", status: "active", occurred_on: "2026-04-02", comment: "Still working on -er endings, adding modeling strategies next session", current_functional_level: "Final /r/ at 68% accuracy; -er endings remain difficult, responds to visual modeling", user_name: "Sam Therapist", created_at: "2026-04-02T15:05:00Z" },
        ],
        data_points: [
          { recorded_at: "2026-03-05", value: "40", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-03-12", value: "48", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-03-19", value: "55", activity_name: "Word-level drills", note: "Struggles with -er endings", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-03-26", value: "62", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-04-02", value: "68", activity_name: "Sentence completion", note: "Better with modeling", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-8", status: "pending", occurred_on: "2026-03-01", comment: "Goal created to address expressive language delays", current_functional_level: "Formulates 2-3 word utterances to request preferred items; relies on gestures for complex needs", user_name: "Sam Therapist", created_at: "2026-03-01T10:05:00Z" },
      { id: "ev-9", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Formulates 2-3 word utterances to request preferred items; relies on gestures for complex needs", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-9b", status: "active", occurred_on: "2026-04-02", comment: "Holding steady at moderate assist — beginning to use sentence starters independently", current_functional_level: "Holding at moderate assist for sentence formulation; beginning to use sentence starters independently", user_name: "Sam Therapist", created_at: "2026-04-02T15:10:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "maximal_assist", activity_name: "Structured play", note: "Baseline assessment", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "moderate_assist", activity_name: "Sentence building", note: "Responding to sentence starters", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "moderate_assist", activity_name: null, note: "Consistent at moderate assist level", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-10", status: "pending", occurred_on: "2026-03-15", comment: "Standalone goal added to track MLU progress", current_functional_level: "Produces /r/ in initial position with maximal verbal cues in structured tasks only; inconsistent in conversational speech", user_name: "Sam Therapist", created_at: "2026-03-15T09:00:00Z" },
      { id: "ev-11", status: "active", occurred_on: "2026-03-15", comment: "Activated on POC signing", current_functional_level: "Spontaneous utterances average 2.5 words; uses mostly nouns and verbs with limited descriptors", user_name: "Sam Therapist", created_at: "2026-03-15T09:30:00Z" },
      { id: "ev-11b", status: "active", occurred_on: "2026-04-02", comment: "Good gains — using more descriptors and conjunctions in spontaneous speech", current_functional_level: "MLU at 3.1 words; using more descriptors and conjunctions in spontaneous speech", user_name: "Sam Therapist", created_at: "2026-04-02T15:15:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-19", value: "2.5", activity_name: null, note: "Baseline", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-26", value: "2.8", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "3.1", activity_name: "Story retell", note: "Using more descriptors", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-12", status: "pending", occurred_on: "2026-01-15", comment: "Goal created for receptive language", current_functional_level: "Produces /r/ in initial position with maximal verbal cues in structured tasks only; inconsistent in conversational speech", user_name: "Sam Therapist", created_at: "2026-01-15T10:00:00Z" },
      { id: "ev-13", status: "active", occurred_on: "2026-01-15", comment: "Activated on POC signing", current_functional_level: "Follows 1-step directions consistently; 2-step directions require repetition and gestural cues", user_name: "Sam Therapist", created_at: "2026-01-15T10:30:00Z" },
      { id: "ev-14", status: "discontinued", occurred_on: "2026-03-20", comment: "Reassessing approach - patient responding better to visual supports. Will create new goal with modified strategy.", current_functional_level: "Minimal progress with verbal-only approach; patient responding better to visual supports", user_name: "Sam Therapist", created_at: "2026-03-20T15:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-01-22", value: "35", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-02-05", value: "38", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-02-19", value: "40", activity_name: null, note: "Minimal progress", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-05", value: "42", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-15", status: "pending", occurred_on: "2026-03-01", comment: "Goal created to increase spontaneous requesting", current_functional_level: "Produces /r/ in initial position with maximal verbal cues in structured tasks only; inconsistent in conversational speech", user_name: "Sam Therapist", created_at: "2026-03-01T10:10:00Z" },
      { id: "ev-16", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Requests preferred items only with direct prompting; does not initiate spontaneously", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-16b", status: "active", occurred_on: "2026-04-02", comment: "Making progress — requesting preferred items without prompts, working on varied contexts", current_functional_level: "Requesting preferred items without prompts; working on varied contexts", user_name: "Sam Therapist", created_at: "2026-04-02T15:20:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "2", activity_name: null, note: "Baseline - only requests with prompting", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-12", value: "3", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "5", activity_name: "Free play requesting", note: "Beginning to request preferred items independently", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-26", value: "6", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "7", activity_name: null, note: "Consistent improvement with visual supports", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-17", status: "pending", occurred_on: "2026-03-01", comment: "Goal created to address attention and task persistence", current_functional_level: "Produces /r/ in initial position with maximal verbal cues in structured tasks only; inconsistent in conversational speech", user_name: "Sam Therapist", created_at: "2026-03-01T11:00:00Z" },
      { id: "ev-18", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Attends to tabletop activities for ~30 seconds before requiring redirection", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-18b", status: "active", occurred_on: "2026-04-02", comment: "Steady improvement — sensory breaks helping, up to 105s without redirection", current_functional_level: "Sustaining attention for 105 seconds with sensory breaks; steady improvement", user_name: "Sam Therapist", created_at: "2026-04-02T15:25:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "30", activity_name: null, note: "Baseline", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-12", value: "45", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "60", activity_name: "Tabletop puzzle", note: "Better with sensory breaks", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-26", value: "90", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "105", activity_name: "Coloring task", note: "Steady improvement", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-19", status: "pending", occurred_on: "2026-03-01", comment: "Goal created for fine motor independence", current_functional_level: "Produces /r/ in initial position with maximal verbal cues in structured tasks only; inconsistent in conversational speech", user_name: "Sam Therapist", created_at: "2026-03-01T11:05:00Z" },
      { id: "ev-20", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Cannot initiate shoe tying without hand-over-hand assistance", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-20b", status: "active", occurred_on: "2026-04-02", comment: "Not yet achieved — forming first loop independently, still needs help with second loop", current_functional_level: "Forming first loop independently; needs help with second loop", user_name: "Sam Therapist", created_at: "2026-04-02T15:30:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "false", activity_name: "Shoe tying practice", note: "Cannot initiate without hand-over-hand", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "false", activity_name: null, note: "Can cross laces but not form loops", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "false", activity_name: "Shoe tying practice", note: "Forming first loop independently, needs help with second", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-21", status: "pending", occurred_on: "2026-04-08", comment: "Added to initial OT evaluation", current_functional_level: "Requires maximal physical assist for bilateral coordination during self-care", user_name: "Sam Therapist", created_at: "2026-04-08T09:00:00Z" },
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
          { id: "ev-22", status: "pending", occurred_on: "2026-04-08", comment: "Added to initial OT evaluation", current_functional_level: "Cannot manipulate buttons without hand-over-hand assistance", user_name: "Sam Therapist", created_at: "2026-04-08T09:01:00Z" },
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
      { id: "ev-23", status: "pending", occurred_on: "2026-04-05", comment: "Added to OT plan of care renewal", current_functional_level: "Uses pincer grasp inconsistently; drops small objects frequently", user_name: "Sam Therapist", created_at: "2026-04-05T14:00:00Z" },
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
      { id: "ev-24", status: "pending", occurred_on: "2026-02-15", comment: "Goal created from PT evaluation", current_functional_level: "Requires hand-held support on all uneven surfaces; loses balance on grass and wood chips", user_name: "Sam Therapist", created_at: "2026-02-15T09:00:00Z" },
      { id: "ev-25", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", current_functional_level: "Requires hand-held support on all uneven surfaces; loses balance on grass and wood chips", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-25b", status: "active", occurred_on: "2026-04-03", comment: "Moving to minimal assist — navigating wood chips and grass with standby only", current_functional_level: "Navigating wood chips and grass with standby assist; minimal assist on uneven playground surfaces", user_name: "Sam Therapist", created_at: "2026-04-03T14:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "maximal_assist", activity_name: "Outdoor walking", note: "Baseline - needs hand-held support on all surfaces", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-06", value: "moderate_assist", activity_name: null, note: "Walking on grass with one hand held", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-20", value: "moderate_assist", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-03", value: "minimal_assist", activity_name: "Playground navigation", note: "Navigating wood chips with standby assist", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
          { id: "ev-26", status: "pending", occurred_on: "2026-02-15", comment: "Created as STG under balance LTG", current_functional_level: "Completes 2 feet on balance beam with maximal assist; falls off without support", user_name: "Sam Therapist", created_at: "2026-02-15T09:01:00Z" },
          { id: "ev-27", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", current_functional_level: "Completes 2 feet on balance beam with maximal assist; falls off without support", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
          { id: "ev-27b", status: "active", occurred_on: "2026-04-03", comment: "Plateaued at 2/4 trials — adding lateral weight shift exercises to support progress", current_functional_level: "Completing 4 feet on beam at 2/4 trials; plateaued, adding lateral weight shift exercises", user_name: "Sam Therapist", created_at: "2026-04-03T14:05:00Z" },
        ],
        data_points: [
          { recorded_at: "2026-02-20", value: "25", activity_name: "Balance beam walk", note: "1/4 trials - falls off after 2 feet", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-03-06", value: "25", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-03-20", value: "50", activity_name: null, note: "2/4 trials - completing 4 feet consistently", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
          { recorded_at: "2026-04-03", value: "50", activity_name: null, note: "Steady but not yet at 3/4", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-28", status: "pending", occurred_on: "2026-02-15", comment: "Goal for stair navigation safety", current_functional_level: "Uses step-to pattern for stairs; requires rail and verbal cueing", user_name: "Sam Therapist", created_at: "2026-02-15T09:05:00Z" },
      { id: "ev-29", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", current_functional_level: "Uses step-to pattern for stairs; requires rail and verbal cueing", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-30", status: "met", occurred_on: "2026-03-27", comment: "Patient demonstrated reciprocal stair pattern with rail x3 consecutive sessions", current_functional_level: "Demonstrated reciprocal stair pattern with rail consistently across 3 sessions", user_name: "Sam Therapist", created_at: "2026-03-27T11:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "false", activity_name: null, note: "Step-to pattern only, both feet each step", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-06", value: "false", activity_name: null, note: "Reciprocal ascending, step-to descending", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-20", value: "false", activity_name: null, note: "Reciprocal both directions but inconsistent", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-27", value: "true", activity_name: null, note: "Consistent reciprocal pattern up and down with rail", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-31", status: "pending", occurred_on: "2026-02-15", comment: "Goal created for lower extremity stability", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-02-15T09:10:00Z" },
      { id: "ev-32", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", current_functional_level: "Maintains single-leg stance for 3 seconds bilaterally; loses balance without UE support", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-32b", status: "active", occurred_on: "2026-04-03", comment: "Improving symmetry between sides — right at 10s, left catching up at 8s", current_functional_level: "Right leg at 10s, left at 8s; improving symmetry", user_name: "Sam Therapist", created_at: "2026-04-03T14:10:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "3", activity_name: "Single-leg stance", note: "Baseline - bilateral", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-06", value: "5", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-20", value: "7", activity_name: null, note: "Better on right, left still at 5s", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-03", value: "9", activity_name: "Single-leg stance", note: "Improving symmetry", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-33", status: "pending", occurred_on: "2026-03-01", comment: "Goal created for handwriting remediation", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-03-01T11:15:00Z" },
      { id: "ev-34", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Cannot form letters without hand-over-hand assistance", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-34b", status: "active", occurred_on: "2026-04-02", comment: "At moderate assist now — writing first name with moderate cueing, working on letter sizing", current_functional_level: "Writing first name with moderate cueing; working on letter sizing", user_name: "Sam Therapist", created_at: "2026-04-02T15:35:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "dependent", activity_name: null, note: "Cannot form letters without hand-over-hand", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "maximal_assist", activity_name: null, note: "Forming some letters with verbal + visual cues", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "moderate_assist", activity_name: null, note: "Writing first name with moderate cueing", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-35", status: "pending", occurred_on: "2026-03-01", comment: "Goal for self-care independence", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-03-01T11:20:00Z" },
      { id: "ev-36", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Manages large snaps only; cannot manipulate buttons or zippers", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-36b", status: "active", occurred_on: "2026-04-02", comment: "Up to 4 fasteners — managing large buttons now, snaps and zipper pull consistent", current_functional_level: "Managing 4 fasteners including large buttons, snaps, and zipper pull", user_name: "Sam Therapist", created_at: "2026-04-02T15:40:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "2", activity_name: null, note: "Can manage large snaps only", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "3", activity_name: null, note: "Added zipper pull with adapter", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "4", activity_name: null, note: "Managing large buttons now", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-37", status: "pending", occurred_on: "2026-03-01", comment: "Goal for scissor skill development", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-03-01T11:25:00Z" },
      { id: "ev-38", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Difficulty maintaining grasp on scissors; cannot coordinate bilateral hands for cutting", user_name: "Sam Therapist", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-38b", status: "active", occurred_on: "2026-04-02", comment: "Transitioned to standard scissors — accuracy improving, still working on curves", current_functional_level: "Using standard scissors; accuracy improving on straight lines, still working on curves", user_name: "Sam Therapist", created_at: "2026-04-02T15:45:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "20", activity_name: null, note: "Baseline - difficulty with grasp and bilateral coordination", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "35", activity_name: null, note: "Improving with adaptive scissors", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "45", activity_name: null, note: "Transitioned to standard scissors", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-39", status: "pending", occurred_on: "2026-02-15", comment: "Goal created for ankle strengthening", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-02-15T09:15:00Z" },
      { id: "ev-40", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-40b", status: "active", occurred_on: "2026-04-03", comment: "At 7 reps freestanding — good progress, targeting 10 by next month", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-04-03T14:15:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "3", activity_name: null, note: "Baseline - loses balance after 3", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-06", value: "4", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-20", value: "6", activity_name: null, note: "Using wall for light support", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-03", value: "7", activity_name: null, note: "Freestanding now", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-41", status: "pending", occurred_on: "2026-02-15", comment: "Goal created for transfer safety", current_functional_level: "Requires moderate physical assist at hips for floor-to-stand transitions", user_name: "Sam Therapist", created_at: "2026-02-15T09:20:00Z" },
      { id: "ev-42", status: "active", occurred_on: "2026-02-15", comment: "Activated on POC signing", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-02-15T09:30:00Z" },
      { id: "ev-42b", status: "active", occurred_on: "2026-04-03", comment: "At minimal assist — using furniture to pull to stand, not quite at supervision yet", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-04-03T14:20:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-02-20", value: "moderate_assist", activity_name: null, note: "Needs assist at hips for floor-to-stand", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-06", value: "moderate_assist", activity_name: null, note: null, recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-20", value: "minimal_assist", activity_name: null, note: "Using furniture to pull to stand with standby", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-03", value: "minimal_assist", activity_name: null, note: "More consistent but not yet at supervision", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-43", status: "pending", occurred_on: "2026-03-01", comment: "Goal for morphological marker development", current_functional_level: "Omits past tense -ed in most spontaneous speech contexts", user_name: "Sam Therapist", created_at: "2026-03-01T10:15:00Z" },
      { id: "ev-44", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-44b", status: "active", occurred_on: "2026-04-02", comment: "At 50% — generalizing to novel verbs in structured tasks, not yet in conversation", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-04-02T15:50:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "30", activity_name: null, note: "Baseline - omits -ed in most contexts", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "42", activity_name: null, note: "Using -ed with high-frequency verbs", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "50", activity_name: null, note: "Generalizing to novel verbs in structured tasks", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-45", status: "pending", occurred_on: "2026-03-01", comment: "Goal for pragmatic language and social communication", current_functional_level: "Responds to conversational bids but rarely initiates; limited to 1 turn per interaction", user_name: "Sam Therapist", created_at: "2026-03-01T10:20:00Z" },
      { id: "ev-46", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-46b", status: "active", occurred_on: "2026-04-02", comment: "Up to 3 turns — starting to ask questions during play, needs support for topic maintenance", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-04-02T15:55:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "1", activity_name: null, note: "Baseline - responds but rarely initiates", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "2", activity_name: null, note: "Initiating with preferred topics", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "3", activity_name: null, note: "Beginning to ask questions during play", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
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
      { id: "ev-47", status: "pending", occurred_on: "2026-03-01", comment: "Goal created for oral motor and feeding therapy", current_functional_level: "Difficulty managing purees without support; limited oral motor coordination", user_name: "Sam Therapist", created_at: "2026-03-01T10:25:00Z" },
      { id: "ev-48", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-03-01T10:30:00Z" },
      { id: "ev-48b", status: "active", occurred_on: "2026-04-02", comment: "Moved to moderate assist — managing soft solids with verbal cues, continuing texture progression", current_functional_level: "Cannot produce /r/ in initial position without maximal verbal and visual cues", user_name: "Sam Therapist", created_at: "2026-04-02T16:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "maximal_assist", activity_name: null, note: "Baseline - difficulty managing purees without support", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-03-19", value: "maximal_assist", activity_name: null, note: "Tolerating textured purees with cueing", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
      { recorded_at: "2026-04-02", value: "moderate_assist", activity_name: null, note: "Managing soft solids with moderate verbal cues", recorded_by: "Sam Therapist", visit_note_id: "vn-demo" },
    ],
    children: [],
  },
  // ── PT Goals ──
  {
    id: "pg-25",
    goal_type: "long_term",
    parent_id: null,
    goal_text:
      "Patient will walk 50 feet independently with a steady gait pattern across 3 consecutive sessions.",
    measurement_type: "count",
    baseline_value: "10",
    target_value: "50",
    measurement_config: { unit: "feet", per: "trial" },
    version_a: 1,
    version_b: 0,
    version_c: 0,
    start_date: "2026-03-01",
    target_date: "2026-09-01",
    met_on: null,
    discipline: "PT",
    current_status: "active",
    events: [
      { id: "ev-50", status: "pending", occurred_on: "2026-03-01", comment: "Goal created based on PT evaluation — patient currently requires moderate assist for ambulation", current_functional_level: "Ambulates 10 feet with rolling walker and moderate assist from therapist; loses balance on turns", user_name: "Alex PT", created_at: "2026-03-01T11:00:00Z" },
      { id: "ev-51", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Ambulates 10 feet with rolling walker and moderate assist from therapist; loses balance on turns", user_name: "Alex PT", created_at: "2026-03-01T11:30:00Z" },
      { id: "ev-51b", status: "active", occurred_on: "2026-04-05", comment: "Good progress — increased distance to 25 feet with minimal assist, gait pattern improving", current_functional_level: "Ambulates 25 feet with rolling walker and minimal assist; improved heel-toe pattern, occasional balance corrections on turns", user_name: "Alex PT", created_at: "2026-04-05T14:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-03-05", value: "10", activity_name: "Gait training", note: "Baseline — 10 feet with moderate assist and rolling walker", recorded_by: "Alex PT", visit_note_id: "vn-pt1" },
      { recorded_at: "2026-03-12", value: "12", activity_name: "Gait training", note: "Slight improvement, still needs moderate assist on turns", recorded_by: "Alex PT", visit_note_id: "vn-pt2" },
      { recorded_at: "2026-03-19", value: "18", activity_name: "Gait training", note: "Reduced to min assist for straight-line walking", recorded_by: "Alex PT", visit_note_id: "vn-pt3" },
      { recorded_at: "2026-03-26", value: "22", activity_name: "Gait training with obstacles", note: "Navigating small obstacles, min assist", recorded_by: "Alex PT", visit_note_id: "vn-pt4" },
      { recorded_at: "2026-04-02", value: "25", activity_name: "Gait training", note: "25 feet with min assist, improving heel-toe pattern", recorded_by: "Alex PT", visit_note_id: "vn-pt5" },
    ],
    children: [
      {
        id: "pg-26",
        goal_type: "short_term",
        parent_id: "pg-25",
        goal_text:
          "Patient will walk 25 feet with rolling walker and minimal assistance maintaining upright posture.",
        measurement_type: "count",
        baseline_value: "10",
        target_value: "25",
        measurement_config: { unit: "feet", per: "trial" },
        version_a: 1,
        version_b: 1,
        version_c: 0,
        start_date: "2026-03-01",
        target_date: "2026-06-01",
        met_on: null,
        discipline: "PT",
        current_status: "active",
        events: [
          { id: "ev-52", status: "pending", occurred_on: "2026-03-01", comment: "Short-term stepping stone toward 50-foot goal", current_functional_level: "Ambulates 10 feet with rolling walker and moderate assist", user_name: "Alex PT", created_at: "2026-03-01T11:05:00Z" },
          { id: "ev-53", status: "active", occurred_on: "2026-03-01", comment: "Activated on POC signing", current_functional_level: "Ambulates 10 feet with rolling walker and moderate assist", user_name: "Alex PT", created_at: "2026-03-01T11:30:00Z" },
        ],
        data_points: [
          { recorded_at: "2026-03-05", value: "10", activity_name: "Gait training", note: "Baseline", recorded_by: "Alex PT", visit_note_id: "vn-pt1" },
          { recorded_at: "2026-03-19", value: "18", activity_name: "Gait training", note: "Progressing well", recorded_by: "Alex PT", visit_note_id: "vn-pt3" },
          { recorded_at: "2026-04-02", value: "25", activity_name: "Gait training", note: "Approaching target", recorded_by: "Alex PT", visit_note_id: "vn-pt5" },
        ],
        children: [],
        linked_document: null,
      },
    ],
    linked_document: null,
  },
];
