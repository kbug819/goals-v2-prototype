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

// Helper to create events
function ev(id: string, status: GoalStatus, date: string, comment: string | null, funcLevel: string | null, user: string): GoalEvent {
  return { id, status, occurred_on: date, comment, current_functional_level: funcLevel, user_name: user, created_at: `${date}T10:00:00Z` };
}

// Helper to create data points
function dp(date: string, value: string, activity: string | null, note: string | null, user: string): DataPoint {
  return { recorded_at: date, value, activity_name: activity, note, recorded_by: user, visit_note_id: "vn-demo" };
}

const SLP = "Sam Therapist";
const OTR = "Jordan OT";
const PTA = "Alex PT";

export const mockGoals: PatientGoal[] = [
  // ════════════════════════════════════════════════════════════════
  // SPEECH GOALS (10 total: 6 active, 2 met, 2 discontinued)
  // ════════════════════════════════════════════════════════════════

  // ── LTG 1.0.0 — Percentage — Articulation /r/ ── ACTIVE
  {
    id: "sp-1", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will improve articulation of /r/ sound across all word positions with 90% accuracy in structured and unstructured tasks.",
    measurement_type: "percentage", baseline_value: "45", target_value: "90", measurement_config: {},
    version_a: 1, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "Speech", current_status: "active",
    events: [
      ev("sp-1-e1", "pending", "2026-03-01", "Goal created from evaluation findings", "Produces /r/ in initial position with maximal verbal cues; inconsistent in conversational speech", SLP),
      ev("sp-1-e2", "active", "2026-03-01", "Activated on POC signing", "Produces /r/ in initial position with maximal verbal cues; inconsistent in conversational speech", SLP),
      ev("sp-1-e3", "active", "2026-04-02", "Progressing well — responding to visual cues for /r/ blends", "Producing /r/ at 72% across positions; initial position strongest at 85%, final at 65%", SLP),
    ],
    data_points: [
      dp("2026-03-05", "45", "Articulation drills", "Initial baseline", SLP),
      dp("2026-03-12", "52", "Articulation drills", "Responding to visual cues", SLP),
      dp("2026-03-19", "58", "Minimal pairs", "Improving with modeling", SLP),
      dp("2026-03-26", "65", "Sentence completion", "Gaining consistency", SLP),
      dp("2026-04-02", "72", "Conversation practice", "72% across all positions", SLP),
    ],
    children: [
      // STG 1.1.0 — MET
      {
        id: "sp-1-1", goal_type: "short_term", parent_id: "sp-1",
        goal_text: "Patient will produce /r/ in initial position of words with 90% accuracy given minimal verbal cues across 3 consecutive sessions.",
        measurement_type: "percentage", baseline_value: "30", target_value: "90", measurement_config: {},
        version_a: 1, version_b: 1, version_c: 0,
        start_date: "2026-03-01", target_date: "2026-06-01", met_on: "2026-04-01",
        discipline: "Speech", current_status: "met",
        events: [
          ev("sp-1-1-e1", "pending", "2026-03-01", "STG for initial /r/", "Initial /r/ at 30%", SLP),
          ev("sp-1-1-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
          ev("sp-1-1-e3", "met", "2026-04-01", "Achieved 92% across 3 consecutive sessions", "Initial /r/ at 92% — consistent with minimal cues", SLP),
        ],
        data_points: [
          dp("2026-03-05", "45", "Articulation drills", "Baseline", SLP),
          dp("2026-03-12", "60", "Articulation cards", "Improving", SLP),
          dp("2026-03-19", "75", "Minimal pairs", "Responding well", SLP),
          dp("2026-03-26", "88", "Sentence completion", "Approaching target", SLP),
          dp("2026-04-01", "92", "Conversation", "Met — 3 consecutive above 90%", SLP),
        ],
        children: [], linked_document: null,
      },
      // STG 1.2.0 — ACTIVE
      {
        id: "sp-1-2", goal_type: "short_term", parent_id: "sp-1",
        goal_text: "Patient will produce /r/ in final position of words with 90% accuracy given minimal verbal cues.",
        measurement_type: "percentage", baseline_value: "40", target_value: "90", measurement_config: {},
        version_a: 1, version_b: 2, version_c: 0,
        start_date: "2026-03-01", target_date: "2026-07-01", met_on: null,
        discipline: "Speech", current_status: "active",
        events: [
          ev("sp-1-2-e1", "pending", "2026-03-01", null, "Final /r/ at 40%", SLP),
          ev("sp-1-2-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
        ],
        data_points: [
          dp("2026-03-05", "40", "Word-level drills", "Baseline", SLP),
          dp("2026-03-19", "52", "Word-level drills", "Improving", SLP),
          dp("2026-04-02", "68", "Sentence practice", "Progressing — -er endings still challenging", SLP),
        ],
        children: [], linked_document: null,
      },
    ],
    linked_document: null,
  },

  // ── LTG 2.0.0 — Scale — Expressive Language ── ACTIVE
  {
    id: "sp-2", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will improve expressive language skills to formulate age-appropriate sentences with minimal assistance.",
    measurement_type: "scale", baseline_value: "maximal_assist", target_value: "independent",
    measurement_config: { levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
    version_a: 2, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-12-01", met_on: null,
    discipline: "Speech", current_status: "active",
    events: [
      ev("sp-2-e1", "pending", "2026-03-01", "Goal created to address expressive language delays", "Formulates 2-3 word utterances; relies on gestures for complex needs", SLP),
      ev("sp-2-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
      ev("sp-2-e3", "active", "2026-04-02", "Holding at moderate assist — beginning to use sentence starters independently", "Using sentence starters independently; moderate cueing for complex sentences", SLP),
    ],
    data_points: [
      dp("2026-03-05", "maximal_assist", "Structured play", "Baseline", SLP),
      dp("2026-03-19", "moderate_assist", "Sentence building", "Responding to sentence starters", SLP),
      dp("2026-04-02", "moderate_assist", null, "Consistent at moderate assist", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 3.0.0 — Custom — MLU ── ACTIVE
  {
    id: "sp-3", goal_type: "standalone", parent_id: null,
    goal_text: "Patient will increase mean length of utterance (MLU) from 2.5 to 4.0 words per utterance in spontaneous speech across 3 consecutive sessions.",
    measurement_type: "custom", baseline_value: "2.5", target_value: "4.0",
    measurement_config: { unit: "words", label: "Mean Length of Utterance" },
    version_a: 3, version_b: 0, version_c: 0,
    start_date: "2026-03-15", target_date: "2026-09-15", met_on: null,
    discipline: "Speech", current_status: "active",
    events: [
      ev("sp-3-e1", "pending", "2026-03-15", "Standalone goal for MLU tracking", "Averages 2.5 words per utterance; uses mostly nouns and verbs", SLP),
      ev("sp-3-e2", "active", "2026-03-15", "Activated on POC signing", null, SLP),
      ev("sp-3-e3", "active", "2026-04-02", "Good gains — using more descriptors", "MLU at 3.1; using descriptors and conjunctions in spontaneous speech", SLP),
    ],
    data_points: [
      dp("2026-03-19", "2.5", null, "Baseline", SLP),
      dp("2026-03-26", "2.8", null, "Using more descriptors", SLP),
      dp("2026-04-02", "3.1", "Story retell", "Increasing spontaneous sentence length", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 4.0.0 — Count — Following Directions ── ACTIVE
  {
    id: "sp-4", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will follow multi-step directions with 8 out of 10 accuracy across 3 consecutive sessions.",
    measurement_type: "count", baseline_value: "3", target_value: "8",
    measurement_config: { unit: "correct", per: "10 trials" },
    version_a: 4, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "Speech", current_status: "active",
    events: [
      ev("sp-4-e1", "pending", "2026-03-01", "Created to address receptive language", "Follows 1-step directions; inconsistent with 2-step", SLP),
      ev("sp-4-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
    ],
    data_points: [
      dp("2026-03-05", "3", "Classroom routine", "Baseline — 3/10 multi-step", SLP),
      dp("2026-03-19", "4", "Play-based tasks", "Improving with visual supports", SLP),
      dp("2026-04-02", "5", "Structured activities", "5/10 — responding to repetition", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 5.0.0 — Duration — Sustained Phonation ── ACTIVE
  {
    id: "sp-5", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will sustain phonation for 10 seconds on a single breath to support voice projection and breath control.",
    measurement_type: "duration", baseline_value: "3", target_value: "10",
    measurement_config: { unit: "seconds" },
    version_a: 5, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-08-01", met_on: null,
    discipline: "Speech", current_status: "active",
    events: [
      ev("sp-5-e1", "pending", "2026-03-01", "Voice therapy goal — breath support", "Sustains /a/ for 3 seconds; runs out of breath mid-sentence", SLP),
      ev("sp-5-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
    ],
    data_points: [
      dp("2026-03-05", "3", "Sustained /a/", "Baseline", SLP),
      dp("2026-03-19", "5", "Breathing exercises", "Improving breath control", SLP),
      dp("2026-04-02", "6", "Sustained vowels", "6 seconds — steady improvement", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 6.0.0 — Binary — AAC Device Use ── ACTIVE
  {
    id: "sp-6", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will independently initiate communication using AAC device to request preferred items without prompting.",
    measurement_type: "binary", baseline_value: "false", target_value: "true",
    measurement_config: {},
    version_a: 6, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "Speech", current_status: "active",
    events: [
      ev("sp-6-e1", "pending", "2026-03-01", "AAC goal — independent initiation", "Requires full physical prompting to access AAC device", SLP),
      ev("sp-6-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
    ],
    data_points: [
      dp("2026-03-05", "false", "AAC training", "Baseline — requires full prompting", SLP),
      dp("2026-03-19", "false", "AAC modeling", "Responding to modeling but not initiating", SLP),
      dp("2026-04-02", "false", "Structured play", "Beginning to reach for device with gestural cue", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 7.0.0 — Percentage — Phonological Processes ── DISCONTINUED
  {
    id: "sp-7", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will eliminate fronting of velar sounds /k/ and /g/ with 80% accuracy in conversational speech.",
    measurement_type: "percentage", baseline_value: "20", target_value: "80", measurement_config: {},
    version_a: 7, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-08-01", met_on: null,
    discipline: "Speech", current_status: "discontinued",
    events: [
      ev("sp-7-e1", "pending", "2026-03-01", null, "Substitutes /t/ for /k/ and /d/ for /g/ in all positions", SLP),
      ev("sp-7-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
      ev("sp-7-e3", "discontinued", "2026-04-01", "Discontinuing — reassessing approach after plateau; will target through new phonological awareness goal", "No improvement after 4 weeks; patient not stimulable for /k/ in isolation", SLP),
    ],
    data_points: [
      dp("2026-03-05", "20", "Phonological drills", "Baseline", SLP),
      dp("2026-03-19", "22", "Minimal pairs", "Minimal progress", SLP),
      dp("2026-04-01", "20", "Structured tasks", "Plateau — not stimulable", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 8.0.0 — Scale — Social Communication ── DISCONTINUED
  {
    id: "sp-8", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will initiate and maintain conversational turns with peers with supervision level support.",
    measurement_type: "scale", baseline_value: "dependent", target_value: "supervision",
    measurement_config: { levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
    version_a: 8, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "Speech", current_status: "discontinued",
    events: [
      ev("sp-8-e1", "pending", "2026-03-01", null, "Does not initiate with peers; parallel play only", SLP),
      ev("sp-8-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
      ev("sp-8-e3", "discontinued", "2026-04-05", "Family requesting focus on articulation and language instead; social pragmatics to be addressed in group therapy", null, SLP),
    ],
    data_points: [
      dp("2026-03-05", "dependent", null, "Baseline", SLP),
      dp("2026-03-19", "dependent", "Peer play", "No change", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 9.0.0 — Duration — Fluency ── MET
  {
    id: "sp-9", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will produce 60 seconds of fluent speech using easy onset technique in structured conversation.",
    measurement_type: "duration", baseline_value: "15", target_value: "60",
    measurement_config: { unit: "seconds" },
    version_a: 9, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-06-01", met_on: "2026-04-05",
    discipline: "Speech", current_status: "met",
    events: [
      ev("sp-9-e1", "pending", "2026-03-01", "Fluency goal — easy onset", "15 seconds fluent speech before disfluency; secondary behaviors present", SLP),
      ev("sp-9-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
      ev("sp-9-e3", "met", "2026-04-05", "Patient consistently achieving 60+ seconds of fluent speech with easy onset in structured and semi-structured tasks", "Fluent for 60+ seconds in structured conversation; reduced secondary behaviors", SLP),
    ],
    data_points: [
      dp("2026-03-05", "15", "Easy onset drills", "Baseline", SLP),
      dp("2026-03-12", "25", "Structured reading", "Improving", SLP),
      dp("2026-03-19", "40", "Conversation", "Good progress", SLP),
      dp("2026-03-26", "55", "Semi-structured", "Approaching target", SLP),
      dp("2026-04-05", "65", "Conversation", "Met — consistent 60+ seconds", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 10.0.0 — Count — Vocabulary ── MET
  {
    id: "sp-10", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will use 20 new functional vocabulary words expressively across 3 different contexts.",
    measurement_type: "count", baseline_value: "5", target_value: "20",
    measurement_config: { unit: "words", per: "session" },
    version_a: 10, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-06-01", met_on: "2026-04-02",
    discipline: "Speech", current_status: "met",
    events: [
      ev("sp-10-e1", "pending", "2026-03-01", "Vocabulary expansion goal", "Uses ~5 functional words expressively", SLP),
      ev("sp-10-e2", "active", "2026-03-01", "Activated on POC signing", null, SLP),
      ev("sp-10-e3", "met", "2026-04-02", "Using 22 functional words across home, school, and clinic contexts", "22 functional words used expressively across contexts", SLP),
    ],
    data_points: [
      dp("2026-03-05", "5", "Vocabulary cards", "Baseline", SLP),
      dp("2026-03-12", "9", "Play-based", "Adding food/toy words", SLP),
      dp("2026-03-19", "14", "Structured play", "Using in multiple contexts", SLP),
      dp("2026-04-02", "22", "Natural environment", "Met — 22 words across 3 contexts", SLP),
    ],
    children: [],
    linked_document: null,
  },

  // ════════════════════════════════════════════════════════════════
  // OT GOALS (10 total: 6 active, 2 met, 2 discontinued)
  // ════════════════════════════════════════════════════════════════

  // ── LTG 1.0.0 — Percentage — Fine Motor Grasp ── ACTIVE
  {
    id: "ot-1", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will demonstrate age-appropriate tripod grasp on writing utensils with 80% accuracy during classroom writing tasks.",
    measurement_type: "percentage", baseline_value: "25", target_value: "80", measurement_config: {},
    version_a: 1, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "OT", current_status: "active",
    events: [
      ev("ot-1-e1", "pending", "2026-03-01", "Fine motor goal from OT evaluation", "Uses fisted grasp; unable to maintain tripod for more than 10 seconds", OTR),
      ev("ot-1-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
      ev("ot-1-e3", "active", "2026-04-02", "Improving — maintaining tripod with verbal cues", "Tripod grasp at 55% during structured writing; reverting to fisted grasp when fatigued", OTR),
    ],
    data_points: [
      dp("2026-03-05", "25", "Handwriting practice", "Baseline", OTR),
      dp("2026-03-12", "35", "Pencil grip exercises", "Improving with adaptive grip", OTR),
      dp("2026-03-19", "42", "Writing tasks", "Better endurance", OTR),
      dp("2026-04-02", "55", "Classroom work", "55% — verbal cues needed", OTR),
    ],
    children: [
      // STG 1.1.0 — ACTIVE
      {
        id: "ot-1-1", goal_type: "short_term", parent_id: "ot-1",
        goal_text: "Patient will maintain tripod grasp on pencil for 2 minutes during structured writing activity.",
        measurement_type: "duration", baseline_value: "10", target_value: "120",
        measurement_config: { unit: "seconds" },
        version_a: 1, version_b: 1, version_c: 0,
        start_date: "2026-03-01", target_date: "2026-06-01", met_on: null,
        discipline: "OT", current_status: "active",
        events: [
          ev("ot-1-1-e1", "pending", "2026-03-01", null, null, OTR),
          ev("ot-1-1-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
        ],
        data_points: [
          dp("2026-03-05", "10", "Grip endurance", "Baseline — 10 seconds", OTR),
          dp("2026-03-19", "35", "Writing practice", "Improving", OTR),
          dp("2026-04-02", "60", "Structured writing", "60 seconds — halfway", OTR),
        ],
        children: [], linked_document: null,
      },
    ],
    linked_document: null,
  },

  // ── LTG 2.0.0 — Scale — Self-Feeding ── ACTIVE
  {
    id: "ot-2", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will independently use utensils for self-feeding with age-appropriate foods with minimal assistance.",
    measurement_type: "scale", baseline_value: "maximal_assist", target_value: "independent",
    measurement_config: { levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
    version_a: 2, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-10-01", met_on: null,
    discipline: "OT", current_status: "active",
    events: [
      ev("ot-2-e1", "pending", "2026-03-01", "Self-feeding independence goal", "Uses fingers for most foods; drops spoon frequently", OTR),
      ev("ot-2-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
    ],
    data_points: [
      dp("2026-03-05", "maximal_assist", "Mealtime practice", "Baseline", OTR),
      dp("2026-03-19", "moderate_assist", "Utensil training", "Using adapted spoon", OTR),
      dp("2026-04-02", "moderate_assist", null, "Consistent moderate assist", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 3.0.0 — Duration — Seated Attention ── ACTIVE
  {
    id: "ot-3", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will maintain seated attention during tabletop activities for 15 minutes with no more than 2 redirections.",
    measurement_type: "duration", baseline_value: "3", target_value: "15",
    measurement_config: { unit: "minutes" },
    version_a: 3, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "OT", current_status: "active",
    events: [
      ev("ot-3-e1", "pending", "2026-03-01", "Attention/self-regulation goal", "Leaves seat after 3 minutes; requires constant redirection", OTR),
      ev("ot-3-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
    ],
    data_points: [
      dp("2026-03-05", "3", "Tabletop puzzle", "Baseline — 3 minutes", OTR),
      dp("2026-03-19", "6", "Art activity", "Improving with sensory breaks", OTR),
      dp("2026-04-02", "8", "Writing task", "8 minutes with 1 redirection", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 4.0.0 — Count — Buttons/Fasteners ── ACTIVE
  {
    id: "ot-4", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will independently fasten 5 buttons on a shirt within 3 minutes.",
    measurement_type: "count", baseline_value: "0", target_value: "5",
    measurement_config: { unit: "buttons", per: "trial" },
    version_a: 4, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-08-01", met_on: null,
    discipline: "OT", current_status: "active",
    events: [
      ev("ot-4-e1", "pending", "2026-03-01", "Dressing skills goal", "Cannot manipulate buttons; relies on caregiver for fasteners", OTR),
      ev("ot-4-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
    ],
    data_points: [
      dp("2026-03-05", "0", "Button board", "Baseline — 0 buttons", OTR),
      dp("2026-03-19", "1", "Button practice", "Managing large buttons with effort", OTR),
      dp("2026-04-02", "2", "Dressing practice", "2 large buttons independently", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 5.0.0 — Binary — Shoe Tying ── ACTIVE
  {
    id: "ot-5", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will independently tie shoes using a two-loop method.",
    measurement_type: "binary", baseline_value: "false", target_value: "true",
    measurement_config: {},
    version_a: 5, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "OT", current_status: "active",
    events: [
      ev("ot-5-e1", "pending", "2026-03-01", "Self-care independence goal", "Cannot cross laces; uses velcro shoes only", OTR),
      ev("ot-5-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
    ],
    data_points: [
      dp("2026-03-05", "false", "Shoe tying practice", "Baseline — cannot cross laces", OTR),
      dp("2026-03-19", "false", "Two-loop method", "Can cross laces but not form loops", OTR),
      dp("2026-04-02", "false", "Structured practice", "Forming first loop with assist", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 6.0.0 — Custom — Handwriting Legibility ── ACTIVE
  {
    id: "ot-6", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will write first and last name legibly within standard-sized lines on paper with 4 out of 5 trials.",
    measurement_type: "custom", baseline_value: "1", target_value: "4",
    measurement_config: { unit: "legible trials", label: "Name Writing Legibility" },
    version_a: 6, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "OT", current_status: "active",
    events: [
      ev("ot-6-e1", "pending", "2026-03-01", "Handwriting legibility goal", "Letters oversized and inconsistent; writes outside lines", OTR),
      ev("ot-6-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
    ],
    data_points: [
      dp("2026-03-05", "1", "Name writing", "Baseline — 1/5 legible", OTR),
      dp("2026-03-19", "2", "Lined paper", "Improving letter sizing", OTR),
      dp("2026-04-02", "2.5", "Classroom worksheet", "More consistent", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 7.0.0 — Percentage — Visual Motor ── DISCONTINUED
  {
    id: "ot-7", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will copy geometric shapes (circle, square, triangle, diamond) with 80% accuracy.",
    measurement_type: "percentage", baseline_value: "30", target_value: "80", measurement_config: {},
    version_a: 7, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-08-01", met_on: null,
    discipline: "OT", current_status: "discontinued",
    events: [
      ev("ot-7-e1", "pending", "2026-03-01", null, "Copies circle inconsistently; cannot copy square or triangle", OTR),
      ev("ot-7-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
      ev("ot-7-e3", "discontinued", "2026-04-01", "Discontinuing — focusing on functional handwriting instead of isolated shape copying per teacher/parent request", null, OTR),
    ],
    data_points: [
      dp("2026-03-05", "30", "Shape copying", "Baseline", OTR),
      dp("2026-03-19", "35", "Template tracing", "Minimal progress", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 8.0.0 — Scale — Dressing ── DISCONTINUED
  {
    id: "ot-8", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will independently don and doff jacket with zipper with supervision level support.",
    measurement_type: "scale", baseline_value: "maximal_assist", target_value: "supervision",
    measurement_config: { levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
    version_a: 8, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-08-01", met_on: null,
    discipline: "OT", current_status: "discontinued",
    events: [
      ev("ot-8-e1", "pending", "2026-03-01", null, "Cannot start zipper; needs full assist for jacket", OTR),
      ev("ot-8-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
      ev("ot-8-e3", "discontinued", "2026-04-05", "Parent reports child has transitioned to pullover clothing only; dressing with zipper no longer a priority", null, OTR),
    ],
    data_points: [
      dp("2026-03-05", "maximal_assist", "Dressing practice", "Baseline", OTR),
      dp("2026-03-19", "maximal_assist", null, "No change", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 9.0.0 — Count — Bead Stringing ── MET
  {
    id: "ot-9", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will string 10 beads onto a lace independently within 5 minutes.",
    measurement_type: "count", baseline_value: "2", target_value: "10",
    measurement_config: { unit: "beads", per: "trial" },
    version_a: 9, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-06-01", met_on: "2026-04-02",
    discipline: "OT", current_status: "met",
    events: [
      ev("ot-9-e1", "pending", "2026-03-01", "Fine motor coordination goal", "Strings 2 beads with max effort; loses control of lace", OTR),
      ev("ot-9-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
      ev("ot-9-e3", "met", "2026-04-02", "Stringing 12 beads independently in 4 minutes — goal met", "Excellent bilateral coordination; strings beads with ease", OTR),
    ],
    data_points: [
      dp("2026-03-05", "2", "Bead stringing", "Baseline", OTR),
      dp("2026-03-12", "5", "Bead stringing", "Improving grip", OTR),
      dp("2026-03-19", "8", "Bead stringing", "Almost there", OTR),
      dp("2026-04-02", "12", "Bead stringing", "Met — 12 beads in 4 min", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 10.0.0 — Binary — Scissors Use ── MET
  {
    id: "ot-10", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will independently cut along a straight line within 1/4 inch accuracy.",
    measurement_type: "binary", baseline_value: "false", target_value: "true",
    measurement_config: {},
    version_a: 10, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-06-01", met_on: "2026-03-26",
    discipline: "OT", current_status: "met",
    events: [
      ev("ot-10-e1", "pending", "2026-03-01", "Scissors skill goal", "Cannot open/close scissors; uses two hands", OTR),
      ev("ot-10-e2", "active", "2026-03-01", "Activated on POC signing", null, OTR),
      ev("ot-10-e3", "met", "2026-03-26", "Cutting straight lines within 1/4 inch consistently — goal met ahead of schedule", "Independent scissors use with proper grasp", OTR),
    ],
    data_points: [
      dp("2026-03-05", "false", "Scissors practice", "Baseline — cannot open/close", OTR),
      dp("2026-03-12", "false", "Adapted scissors", "Learning to open/close", OTR),
      dp("2026-03-19", "false", "Cutting strips", "Cutting but not on line", OTR),
      dp("2026-03-26", "true", "Line cutting", "Met — within 1/4 inch", OTR),
    ],
    children: [],
    linked_document: null,
  },

  // ════════════════════════════════════════════════════════════════
  // PT GOALS (10 total: 6 active, 2 met, 2 discontinued)
  // ════════════════════════════════════════════════════════════════

  // ── LTG 1.0.0 — Count — Walking Distance ── ACTIVE
  {
    id: "pt-1", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will walk 50 feet independently with a steady gait pattern across 3 consecutive sessions.",
    measurement_type: "count", baseline_value: "10", target_value: "50",
    measurement_config: { unit: "feet", per: "trial" },
    version_a: 1, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "PT", current_status: "active",
    events: [
      ev("pt-1-e1", "pending", "2026-03-01", "Ambulation goal from PT evaluation", "Ambulates 10 feet with rolling walker and moderate assist; loses balance on turns", PTA),
      ev("pt-1-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
      ev("pt-1-e3", "active", "2026-04-05", "Good progress — 25 feet with minimal assist", "Ambulates 25 feet with rolling walker and minimal assist; improved heel-toe pattern", PTA),
    ],
    data_points: [
      dp("2026-03-05", "10", "Gait training", "Baseline — 10 feet with mod assist", PTA),
      dp("2026-03-12", "12", "Gait training", "Slight improvement", PTA),
      dp("2026-03-19", "18", "Gait training", "Reduced to min assist", PTA),
      dp("2026-03-26", "22", "Obstacle course", "Navigating obstacles", PTA),
      dp("2026-04-02", "25", "Gait training", "25 feet with min assist", PTA),
    ],
    children: [
      // STG 1.1.0 — ACTIVE
      {
        id: "pt-1-1", goal_type: "short_term", parent_id: "pt-1",
        goal_text: "Patient will walk 25 feet with rolling walker and minimal assistance maintaining upright posture.",
        measurement_type: "count", baseline_value: "10", target_value: "25",
        measurement_config: { unit: "feet", per: "trial" },
        version_a: 1, version_b: 1, version_c: 0,
        start_date: "2026-03-01", target_date: "2026-06-01", met_on: null,
        discipline: "PT", current_status: "active",
        events: [
          ev("pt-1-1-e1", "pending", "2026-03-01", "Stepping stone toward 50-foot goal", null, PTA),
          ev("pt-1-1-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
        ],
        data_points: [
          dp("2026-03-05", "10", "Gait training", "Baseline", PTA),
          dp("2026-03-19", "18", "Gait training", "Progressing", PTA),
          dp("2026-04-02", "25", "Gait training", "Approaching target", PTA),
        ],
        children: [], linked_document: null,
      },
    ],
    linked_document: null,
  },

  // ── LTG 2.0.0 — Duration — Standing Balance ── ACTIVE
  {
    id: "pt-2", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will maintain static standing balance on a stable surface for 30 seconds without upper extremity support.",
    measurement_type: "duration", baseline_value: "5", target_value: "30",
    measurement_config: { unit: "seconds" },
    version_a: 2, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-08-01", met_on: null,
    discipline: "PT", current_status: "active",
    events: [
      ev("pt-2-e1", "pending", "2026-03-01", "Balance goal", "Stands 5 seconds unsupported before requiring hand-hold", PTA),
      ev("pt-2-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
    ],
    data_points: [
      dp("2026-03-05", "5", "Balance board", "Baseline — 5 seconds", PTA),
      dp("2026-03-19", "10", "Static balance", "Improving", PTA),
      dp("2026-04-02", "15", "Balance activities", "15 seconds — halfway", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 3.0.0 — Scale — Stair Navigation ── ACTIVE
  {
    id: "pt-3", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will navigate 4 stairs with reciprocal pattern and railing with supervision level support.",
    measurement_type: "scale", baseline_value: "maximal_assist", target_value: "supervision",
    measurement_config: { levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
    version_a: 3, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "PT", current_status: "active",
    events: [
      ev("pt-3-e1", "pending", "2026-03-01", "Stair mobility goal", "Step-to pattern with two-hand railing and max assist", PTA),
      ev("pt-3-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
    ],
    data_points: [
      dp("2026-03-05", "maximal_assist", "Stair training", "Baseline", PTA),
      dp("2026-03-19", "moderate_assist", "Stair training", "One-hand railing, step-to", PTA),
      dp("2026-04-02", "moderate_assist", null, "Consistent moderate assist", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 4.0.0 — Percentage — Single Leg Stance ── ACTIVE
  {
    id: "pt-4", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will maintain single leg stance for 5 seconds on each leg with 80% success rate across trials.",
    measurement_type: "percentage", baseline_value: "20", target_value: "80", measurement_config: {},
    version_a: 4, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-08-01", met_on: null,
    discipline: "PT", current_status: "active",
    events: [
      ev("pt-4-e1", "pending", "2026-03-01", "Balance assessment goal", "Single leg stance < 2 seconds bilaterally", PTA),
      ev("pt-4-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
    ],
    data_points: [
      dp("2026-03-05", "20", "Balance assessment", "Baseline — 20% success", PTA),
      dp("2026-03-19", "35", "Balance exercises", "Improving R > L", PTA),
      dp("2026-04-02", "45", "Obstacle course", "45% — steady improvement", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 5.0.0 — Custom — Timed Up and Go ── ACTIVE
  {
    id: "pt-5", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will complete the Timed Up and Go (TUG) test in under 12 seconds demonstrating safe functional mobility.",
    measurement_type: "custom", baseline_value: "25", target_value: "12",
    measurement_config: { unit: "seconds", label: "TUG Test Time" },
    version_a: 5, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "PT", current_status: "active",
    events: [
      ev("pt-5-e1", "pending", "2026-03-01", "Functional mobility assessment goal", "TUG at 25 seconds — fall risk category", PTA),
      ev("pt-5-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
    ],
    data_points: [
      dp("2026-03-05", "25", "TUG test", "Baseline — 25 seconds", PTA),
      dp("2026-03-19", "21", "TUG test", "Improving gait speed", PTA),
      dp("2026-04-02", "18", "TUG test", "18 seconds — moderate fall risk", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 6.0.0 — Binary — Independent Transfers ── ACTIVE
  {
    id: "pt-6", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will independently transfer from wheelchair to mat and back without physical assistance.",
    measurement_type: "binary", baseline_value: "false", target_value: "true",
    measurement_config: {},
    version_a: 6, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-09-01", met_on: null,
    discipline: "PT", current_status: "active",
    events: [
      ev("pt-6-e1", "pending", "2026-03-01", "Transfer independence goal", "Requires moderate assist for all transfers; unable to weight shift independently", PTA),
      ev("pt-6-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
    ],
    data_points: [
      dp("2026-03-05", "false", "Transfer training", "Baseline — mod assist needed", PTA),
      dp("2026-03-19", "false", "Transfer practice", "Min assist — weight shifting improving", PTA),
      dp("2026-04-02", "false", "Functional mobility", "CGA level — close to independent", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 7.0.0 — Count — Step Ups ── DISCONTINUED
  {
    id: "pt-7", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will perform 10 consecutive step-ups on a 6-inch step with proper form.",
    measurement_type: "count", baseline_value: "2", target_value: "10",
    measurement_config: { unit: "step-ups", per: "trial" },
    version_a: 7, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-07-01", met_on: null,
    discipline: "PT", current_status: "discontinued",
    events: [
      ev("pt-7-e1", "pending", "2026-03-01", null, "Can perform 2 step-ups with railing; knee valgus noted", PTA),
      ev("pt-7-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
      ev("pt-7-e3", "discontinued", "2026-04-01", "Discontinuing — patient experiencing knee pain; MD recommends avoiding step-up exercises until orthopedic clearance", "Knee pain with step-ups; referred to orthopedics", PTA),
    ],
    data_points: [
      dp("2026-03-05", "2", "Step-ups", "Baseline", PTA),
      dp("2026-03-19", "4", "Step-ups", "Improving but pain noted", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 8.0.0 — Percentage — Dynamic Balance ── DISCONTINUED
  {
    id: "pt-8", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will maintain balance during dynamic activities (reaching, turning) with 80% success rate.",
    measurement_type: "percentage", baseline_value: "30", target_value: "80", measurement_config: {},
    version_a: 8, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-08-01", met_on: null,
    discipline: "PT", current_status: "discontinued",
    events: [
      ev("pt-8-e1", "pending", "2026-03-01", null, "Loses balance with any reaching beyond arm's length", PTA),
      ev("pt-8-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
      ev("pt-8-e3", "discontinued", "2026-04-05", "Merging into functional mobility goals — dynamic balance addressed through walking and stair training instead", null, PTA),
    ],
    data_points: [
      dp("2026-03-05", "30", "Balance assessment", "Baseline", PTA),
      dp("2026-03-19", "35", "Reaching tasks", "Minimal improvement", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 9.0.0 — Duration — Prone Extension ── MET
  {
    id: "pt-9", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will maintain prone extension (superman) position for 15 seconds to improve core strength.",
    measurement_type: "duration", baseline_value: "3", target_value: "15",
    measurement_config: { unit: "seconds" },
    version_a: 9, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-06-01", met_on: "2026-04-02",
    discipline: "PT", current_status: "met",
    events: [
      ev("pt-9-e1", "pending", "2026-03-01", "Core strengthening goal", "Maintains prone extension 3 seconds before collapsing", PTA),
      ev("pt-9-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
      ev("pt-9-e3", "met", "2026-04-02", "Maintaining 18 seconds consistently — goal met", "Excellent core strength gains; 18 seconds prone extension", PTA),
    ],
    data_points: [
      dp("2026-03-05", "3", "Prone extension", "Baseline", PTA),
      dp("2026-03-12", "6", "Core exercises", "Improving", PTA),
      dp("2026-03-19", "10", "Prone extension", "10 seconds", PTA),
      dp("2026-03-26", "14", "Core circuit", "Almost there", PTA),
      dp("2026-04-02", "18", "Prone extension", "Met — 18 seconds", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ── LTG 10.0.0 — Scale — Sit-to-Stand ── MET
  {
    id: "pt-10", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will perform sit-to-stand from a standard chair with supervision level support.",
    measurement_type: "scale", baseline_value: "moderate_assist", target_value: "supervision",
    measurement_config: { levels: ["dependent", "maximal_assist", "moderate_assist", "minimal_assist", "supervision", "independent"] },
    version_a: 10, version_b: 0, version_c: 0,
    start_date: "2026-03-01", target_date: "2026-06-01", met_on: "2026-03-26",
    discipline: "PT", current_status: "met",
    events: [
      ev("pt-10-e1", "pending", "2026-03-01", "Functional mobility goal", "Requires mod assist to stand from chair; uses armrests heavily", PTA),
      ev("pt-10-e2", "active", "2026-03-01", "Activated on POC signing", null, PTA),
      ev("pt-10-e3", "met", "2026-03-26", "Performing sit-to-stand with supervision only — no physical assist needed", "Independent sit-to-stand with supervision; good technique", PTA),
    ],
    data_points: [
      dp("2026-03-05", "moderate_assist", "Sit-to-stand", "Baseline", PTA),
      dp("2026-03-12", "minimal_assist", "Functional mobility", "Improving", PTA),
      dp("2026-03-19", "minimal_assist", "Sit-to-stand", "Consistent min assist", PTA),
      dp("2026-03-26", "supervision", "Sit-to-stand", "Met — supervision only", PTA),
    ],
    children: [],
    linked_document: null,
  },

  // ════════════════════════════════════════════════════════════════
  // PENDING GOALS (1 per discipline — on unsigned documents)
  // ════════════════════════════════════════════════════════════════

  // Speech — pending on Evaluation
  {
    id: "sp-pending", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will demonstrate age-appropriate phonological awareness skills including rhyming, segmenting, and blending with 80% accuracy.",
    measurement_type: "percentage", baseline_value: "25", target_value: "80", measurement_config: {},
    version_a: 11, version_b: 0, version_c: 0,
    start_date: "2026-04-15", target_date: "2026-10-15", met_on: null,
    discipline: "Speech", current_status: "pending",
    events: [
      ev("sp-p-e1", "pending", "2026-04-15", "New goal from reassessment — phonological awareness deficits identified", "Identifies rhyming words in 25% of opportunities; unable to segment or blend sounds", SLP),
    ],
    data_points: [],
    children: [],
    linked_document: { document_type: "Evaluation", document_label: "Speech Evaluation — Apr 2026", signed: false },
  },

  // OT — pending on Plan of Care
  {
    id: "ot-pending", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will independently open and close a ziplock bag and twist off a bottle cap to improve bilateral hand coordination.",
    measurement_type: "binary", baseline_value: "false", target_value: "true", measurement_config: {},
    version_a: 11, version_b: 0, version_c: 0,
    start_date: "2026-04-15", target_date: "2026-09-01", met_on: null,
    discipline: "OT", current_status: "pending",
    events: [
      ev("ot-p-e1", "pending", "2026-04-15", "New goal added to renewed POC — bilateral coordination", "Cannot stabilize objects with non-dominant hand; drops items when twisting", OTR),
    ],
    data_points: [],
    children: [],
    linked_document: { document_type: "CarePlan", document_label: "OT Plan of Care — Apr 2026", signed: false },
  },

  // PT — pending on Plan of Care
  {
    id: "pt-pending", goal_type: "long_term", parent_id: null,
    goal_text: "Patient will hop on one foot 5 times on each leg maintaining balance without hand support.",
    measurement_type: "count", baseline_value: "0", target_value: "5",
    measurement_config: { unit: "hops", per: "each leg" },
    version_a: 11, version_b: 0, version_c: 0,
    start_date: "2026-04-15", target_date: "2026-09-01", met_on: null,
    discipline: "PT", current_status: "pending",
    events: [
      ev("pt-p-e1", "pending", "2026-04-15", "New goal for dynamic balance and lower extremity strength", "Cannot hop; lifts foot but loses balance immediately", PTA),
    ],
    data_points: [],
    children: [],
    linked_document: { document_type: "CarePlan", document_label: "PT Plan of Care — Apr 2026", signed: false },
  },
];
