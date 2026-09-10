import { describe, expect, it } from "vitest";
import { mean, min, max, standardDeviation } from "../statistics";

describe("valeurs manquantes", () => {
  it("renvoie null pour une série vide", () => {
    expect(mean([])).toBeNull();
    expect(min([])).toBeNull();
    expect(max([])).toBeNull();
    expect(standardDeviation([])).toBeNull();
  });

  it("calcule la moyenne uniquement sur les valeurs présentes", () => {
    expect(mean([62, 78, 55])).toBeCloseTo(65);
  });

  it("renvoie null pour un écart type avec un effectif < 2", () => {
    expect(standardDeviation([42])).toBeNull();
  });
});

describe("min et max", () => {
  it("min inclut les valeurs incohérentes dans les calculs", () => {
    expect(min([62, 78, 55, -4])).toBe(-4);
  });

  it("max renvoie le maximum", () => {
    expect(max([62, 78, 55, -4])).toBe(78);
  });
});

describe("écart type", () => {
  it("vaut 0 pour des valeurs identiques", () => {
    expect(standardDeviation([50, 50, 50])).toBe(0);
  });

  it("calcule l'écart type échantillon (n-1)", () => {
    expect(standardDeviation([1, 2, 3])).toBeCloseTo(1);
  });
});