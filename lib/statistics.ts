export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

export function min(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.min(...values);
}

export function max(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.max(...values);
}

export function standardDeviation(values: number[]): number | null {
  const m = mean(values);
  if (m === null || values.length < 2) return null;
  const variance =
    values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}