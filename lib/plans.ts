export const PLAN_KEYS = ["starter", "pro", "team"] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];

export const PLAN_RANK: Record<PlanKey, number> = {
  starter: 1,
  pro: 2,
  team: 3,
};

export function isHigherPlan(current: PlanKey, other: PlanKey): boolean {
  return PLAN_RANK[current] > PLAN_RANK[other];
}
