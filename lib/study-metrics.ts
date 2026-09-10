export type MetricRule = {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
};

export const METRIC_RULES: MetricRule[] = [
  {
    key: "systolic",
    label: "Tension artérielle systolique",
    unit: "mmHg",
    min: 60,
    max: 260,
  },
  {
    key: "heart_rate",
    label: "Fréquence cardiaque",
    unit: "bpm",
    min: 30,
    max: 230,
  },
  {
    key: "weight",
    label: "Poids",
    unit: "kg",
    min: 30,
    max: 300,
  },
  {
    key: "height",
    label: "Taille",
    unit: "cm",
    min: 100,
    max: 220,
  },
];

export const RULE_BY_KEY: Record<string, MetricRule> = Object.fromEntries(
  METRIC_RULES.map((rule) => [rule.key, rule]),
);

export function isPlausible(value: number, rule?: MetricRule): boolean {
  if (!rule) return true;
  return value >= rule.min && value <= rule.max;
}