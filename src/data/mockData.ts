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

export interface PatientGoal {
  id: string;
  goal_type: GoalType;
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
  name: "Emma Rodriguez",
  date_of_birth: "2019-06-15",
  disciplines: ["Speech-Language Pathology", "Occupational Therapy"],
  status: "Active",
};

export const mockGoals: PatientGoal[] = [
  {
    id: "pg-1",
    goal_type: "long_term",
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
    discipline: "Speech-Language Pathology",
    current_status: "active",
    events: [
      { id: "ev-1", status: "pending", occurred_on: "2026-03-01", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-01T10:00:00Z" },
      { id: "ev-2", status: "active", occurred_on: "2026-03-01", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-01T10:30:00Z" },
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
        discipline: "Speech-Language Pathology",
        current_status: "met",
        events: [
          { id: "ev-3", status: "pending", occurred_on: "2026-03-01", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-01T10:01:00Z" },
          { id: "ev-4", status: "active", occurred_on: "2026-03-01", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-01T10:30:00Z" },
          { id: "ev-6", status: "met", occurred_on: "2026-04-01", comment: "Patient achieved 92% accuracy across 3 consecutive sessions", user_name: "Dr. Sarah Chen", created_at: "2026-04-01T14:00:00Z" },
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
        discipline: "Speech-Language Pathology",
        current_status: "active",
        events: [
          { id: "ev-5", status: "pending", occurred_on: "2026-03-01", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-01T10:02:00Z" },
          { id: "ev-7", status: "active", occurred_on: "2026-03-01", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-01T10:30:00Z" },
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
    discipline: "Speech-Language Pathology",
    current_status: "active",
    events: [
      { id: "ev-8", status: "pending", occurred_on: "2026-03-01", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-01T10:05:00Z" },
      { id: "ev-9", status: "active", occurred_on: "2026-03-01", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-01T10:30:00Z" },
    ],
    data_points: [],
    children: [],
  },
  {
    id: "pg-5",
    goal_type: "standalone",
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
    discipline: "Speech-Language Pathology",
    current_status: "active",
    events: [
      { id: "ev-10", status: "pending", occurred_on: "2026-03-15", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-15T09:00:00Z" },
      { id: "ev-11", status: "active", occurred_on: "2026-03-15", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-03-15T09:30:00Z" },
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
    discipline: "Speech-Language Pathology",
    current_status: "discontinued",
    events: [
      { id: "ev-12", status: "pending", occurred_on: "2026-01-15", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-01-15T10:00:00Z" },
      { id: "ev-13", status: "active", occurred_on: "2026-01-15", comment: null, user_name: "Dr. Sarah Chen", created_at: "2026-01-15T10:30:00Z" },
      { id: "ev-14", status: "discontinued", occurred_on: "2026-03-20", comment: "Reassessing approach - patient responding better to visual supports. Will create new goal with modified strategy.", user_name: "Dr. Sarah Chen", created_at: "2026-03-20T15:00:00Z" },
    ],
    data_points: [
      { recorded_at: "2026-01-22", value: "35", note: null },
      { recorded_at: "2026-02-05", value: "38", note: null },
      { recorded_at: "2026-02-19", value: "40", note: "Minimal progress" },
      { recorded_at: "2026-03-05", value: "42", note: null },
    ],
    children: [],
  },
];
