import { describe, expect, it } from "vitest";
import { METRIC_RULES, RULE_BY_KEY, isPlausible } from "../study-metrics";

const weight = RULE_BY_KEY["weight"];
const height = RULE_BY_KEY["height"];
const systolic = RULE_BY_KEY["systolic"];

describe("isPlausible", () => {
  it("accepte une valeur valide", () => {
    expect(isPlausible(62, weight)).toBe(true);
    expect(isPlausible(165, height)).toBe(true);
    expect(isPlausible(124, systolic)).toBe(true);
  });

  it("rejette une valeur négative incohérente", () => {
    expect(isPlausible(-4, weight)).toBe(false);
    expect(isPlausible(-1, height)).toBe(false);
  });

  it("rejette une valeur hors plage (incohérente)", () => {
    expect(isPlausible(345, systolic)).toBe(false);
    expect(isPlausible(18, RULE_BY_KEY["heart_rate"])).toBe(false);
  });

  it("accepte les valeurs limites incluses", () => {
    expect(isPlausible(30, weight)).toBe(true);
    expect(isPlausible(300, weight)).toBe(true);
    expect(isPlausible(100, height)).toBe(true);
    expect(isPlausible(220, height)).toBe(true);
  });

  it("rejette les valeurs juste hors limites", () => {
    expect(isPlausible(29.9, weight)).toBe(false);
    expect(isPlausible(300.1, weight)).toBe(false);
    expect(isPlausible(99.9, height)).toBe(false);
    expect(isPlausible(220.1, height)).toBe(false);
  });

  it("retourne true pour une métrique sans règle définie", () => {
    expect(isPlausible(-4, undefined)).toBe(true);
  });

  it("gère une règle dont min > max : aucune valeur plausible", () => {
    const broken = { key: "broken", label: "Cassée", unit: "x", min: 200, max: 100 };
    expect(isPlausible(150, broken)).toBe(false);
    expect(isPlausible(200, broken)).toBe(false);
    expect(isPlausible(100, broken)).toBe(false);
  });
});

describe("METRIC_RULES", () => {
  it("déclare des plages cohérentes (min <= max)", () => {
    for (const rule of METRIC_RULES) {
      expect(rule.min).toBeLessThanOrEqual(rule.max);
    }
  });

  it("expose chaque règle par sa clé", () => {
    for (const rule of METRIC_RULES) {
      expect(RULE_BY_KEY[rule.key]).toEqual(rule);
    }
  });
});