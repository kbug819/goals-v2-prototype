// V1 mock goals - reflects the current system (LongTermGoal + ShortTermGoal, percentage only)

export interface V1ShortTermGoal {
  id: string;
  type: "ShortTermGoal";
  goal: string;
  baseline: number;
  target: number;
  status: "active" | "met" | "discontinue" | "pending";
  version_a: number;
  version_b: number;
  version_c: number;
  target_date: string;
  activity_count: number;
}

export interface V1LongTermGoal {
  id: string;
  type: "LongTermGoal";
  goal: string;
  baseline: number;
  target: number;
  status: "active" | "met" | "discontinue" | "pending";
  version_a: number;
  version_b: number;
  version_c: number;
  target_date: string;
  activity_count: number;
  children: V1ShortTermGoal[];
}

export const V1_MOCK_GOALS: V1LongTermGoal[] = [
  {
    id: "ltg-1",
    type: "LongTermGoal",
    goal: "Patient will improve articulation of /r/ sound across all word positions with 90% accuracy in structured and unstructured tasks.",
    baseline: 45,
    target: 90,
    status: "active",
    version_a: 1, version_b: 0, version_c: 0,
    target_date: "2026-09-01",
    activity_count: 5,
    children: [
      {
        id: "stg-1",
        type: "ShortTermGoal",
        goal: "Patient will produce /r/ in initial position of words with 90% accuracy given minimal verbal cues across 3 consecutive sessions.",
        baseline: 30, target: 90,
        status: "met",
        version_a: 1, version_b: 1, version_c: 0,
        target_date: "2026-06-01",
        activity_count: 5,
      },
      {
        id: "stg-2",
        type: "ShortTermGoal",
        goal: "Patient will produce /r/ in final position of words with 90% accuracy given minimal verbal cues across 3 consecutive sessions.",
        baseline: 40, target: 90,
        status: "active",
        version_a: 1, version_b: 2, version_c: 0,
        target_date: "2026-07-01",
        activity_count: 5,
      },
    ],
  },
  {
    id: "ltg-2",
    type: "LongTermGoal",
    goal: "Patient will improve expressive language skills to formulate age-appropriate sentences with minimal assistance.",
    baseline: 20,
    target: 80,
    status: "active",
    version_a: 2, version_b: 0, version_c: 0,
    target_date: "2026-12-01",
    activity_count: 3,
    children: [],
  },
  {
    id: "ltg-3",
    type: "LongTermGoal",
    goal: "Patient will follow 2-step directions with 80% accuracy to improve receptive language skills.",
    baseline: 35,
    target: 80,
    status: "discontinue",
    version_a: 3, version_b: 0, version_c: 0,
    target_date: "2026-06-01",
    activity_count: 4,
    children: [],
  },
];

export const PROMPTING_LEVELS = ["Independent", "Min", "Mod", "Max", "Hand-over-hand"];
export const PROMPTING_TYPES = ["Verbal", "Visual", "Tactile", "Gestural", "Modeling", "Phonemic"];
