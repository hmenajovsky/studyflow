export type BarDatum = {
  label: string;
  value: number;
  flagged: boolean;
};

export default function BarChart({
  title,
  unit,
  data,
}: {
  title: string;
  unit: string;
  data: BarDatum[];
}) {
  if (data.length === 0) return null;

  const width = 640;
  const height = 240;
  const paddingTop = 24;
  const paddingBottom = 32;
  const barGap = 16;
  const chartHeight = height - paddingTop - paddingBottom;
  const slot = width / data.length;
  const barWidth = Math.max(8, slot - barGap);

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="overflow-x-auto">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
        {title} ({unit})
      </h3>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Graphique de ${title} par participant`}
        className="mt-3"
      >
        {data.map((datum, index) => {
          const x = index * slot + (slot - barWidth) / 2;
          const barHeight = (datum.value / maxValue) * chartHeight;
          const y = paddingTop + chartHeight - barHeight;

          return (
            <g key={datum.label}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={datum.flagged ? "#dc2626" : "#0284c7"}
              />
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="11"
                className="fill-foreground"
              >
                {datum.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={height - 12}
                textAnchor="middle"
                fontSize="10"
                className="fill-foreground/60"
              >
                {datum.label}
              </text>
            </g>
          );
        })}
      </svg>
      {data.some((d) => d.flagged) && (
        <p className="mt-2 text-xs text-red-600">
          Barres rouges : valeur hors plage de plausibilité.
        </p>
      )}
    </div>
  );
}