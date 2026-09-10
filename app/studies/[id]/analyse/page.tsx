import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  METRIC_RULES,
  isPlausible,
} from "@/lib/study-metrics";
import { mean, min, max, standardDeviation } from "@/lib/statistics";
import BarChart from "@/components/bar-chart";

const numberFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});

function formatNumber(value: number | null): string {
  return value === null ? "—" : numberFormatter.format(value);
}

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmé",
  WAITLISTED: "Liste d'attente",
};

type ParticipantRow = {
  name: string;
  email: string;
  status: string;
  values: Record<string, { value: number; unit: string }>;
};

export default async function StudyAnalysisPage({
  params,
}: {
  params: { id: string };
}) {
  const study = await prisma.study.findUnique({
    where: { id: params.id },
    include: {
      enrollments: {
        include: {
          participant: true,
          measurements: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!study) notFound();

  const rows: ParticipantRow[] = study.enrollments.map((enrollment) => ({
    name: enrollment.participant.name,
    email: enrollment.participant.email,
    status: enrollment.status,
    values: Object.fromEntries(
      enrollment.measurements.map((measurement) => [
        measurement.metric,
        { value: measurement.value, unit: measurement.unit },
      ]),
    ),
  }));

  const hasData = rows.some((row) => Object.keys(row.values).length > 0);

  const metricStats = METRIC_RULES.map((rule) => {
    const values = rows.flatMap((row) =>
      row.values[rule.key] ? [row.values[rule.key].value] : [],
    );
    return {
      rule,
      count: values.length,
      mean: mean(values),
      min: min(values),
      max: max(values),
      standardDeviation: standardDeviation(values),
      flaggedCount: values.filter((v) => !isPlausible(v, rule)).length,
    };
  }).filter((stats) => stats.count > 0);

  const primary = metricStats[0];

  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <Link
        href={`/studies/${study.id}`}
        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
      >
        ← Retour à {"l'étude"}
      </Link>

      <header className="mt-4 mb-10">
        <h1 className="text-3xl font-bold">Analyse des données</h1>
        <p className="mt-2 text-foreground/70">{study.title}</p>
      </header>

      {!hasData && (
        <div className="rounded-xl border border-dashed border-black/[0.2] p-8 text-center dark:border-white/[0.3]">
          <p className="text-foreground/70">
            Aucune donnée de mesure pour cette étude.
          </p>
          <p className="mt-2 text-sm text-foreground/50">
            Importez des données avec{" "}
            <code className="text-foreground/70">
              npm run data:import -- fichier.csv
            </code>
            .
          </p>
        </div>
      )}

      {hasData && metricStats.length === 0 && (
        <div className="rounded-xl border border-dashed border-black/[0.2] p-8 text-center dark:border-white/[0.3]">
          <p className="text-foreground/70">
            Des mesures existent mais aucune métrique reconnue par les seuils
            {"d'analyse"}.
          </p>
        </div>
      )}

      {metricStats.length > 0 && (
        <>
          <section aria-label="Indicateurs statistiques" className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">
              Indicateurs statistiques
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metricStats.map(({ rule, count, mean, min, max, standardDeviation, flaggedCount }) => (
                <div
                  key={rule.key}
                  className="rounded-xl border border-black/[0.08] p-5 dark:border-white/[0.145]"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
                    {rule.label}
                  </h3>
                  {flaggedCount > 0 && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      ⚠ {flaggedCount} valeur(s) hors plage de plausibilité
                    </p>
                  )}
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-foreground/70">Effectif</dt>
                    <dd className="text-right font-medium">{count}</dd>
                    <dt className="text-foreground/70">Moyenne</dt>
                    <dd className="text-right font-medium">
                      {formatNumber(mean)} {rule.unit}
                    </dd>
                    <dt className="text-foreground/70">Min</dt>
                    <dd className="text-right font-medium">
                      {formatNumber(min)} {rule.unit}
                    </dd>
                    <dt className="text-foreground/70">Max</dt>
                    <dd className="text-right font-medium">
                      {formatNumber(max)} {rule.unit}
                    </dd>
                    <dt className="text-foreground/70">Écart type</dt>
                    <dd className="text-right font-medium">
                      {formatNumber(standardDeviation)} {rule.unit}
                    </dd>
                  </dl>
                </div>
              ))}
            </div>
          </section>

          {primary && (
            <section aria-label="Graphique" className="mb-10">
              <h2 className="mb-4 text-xl font-semibold">Graphique</h2>
              <BarChart
                title={primary.rule.label}
                unit={primary.rule.unit}
                data={rows
                  .filter((row) => row.values[primary.rule.key])
                  .map((row) => ({
                    label: row.name.split(" ")[0],
                    value: row.values[primary.rule.key].value,
                    flagged: !isPlausible(
                      row.values[primary.rule.key].value,
                      primary.rule,
                    ),
                  }))}
              />
            </section>
          )}

          <section aria-label="Données par participant">
            <h2 className="mb-4 text-xl font-semibold">Données par participant</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black/[0.08] text-left text-foreground/70 dark:border-white/[0.145]">
                    <th className="py-2 pr-4 font-medium">Participant</th>
                    <th className="py-2 pr-4 font-medium">Statut</th>
                    {metricStats.map(({ rule }) => (
                      <th key={rule.key} className="py-2 pr-4 font-medium text-right">
                        {rule.label} ({rule.unit})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.email}
                      className="border-b border-black/[0.08] last:border-0 dark:border-white/[0.145]"
                    >
                      <td className="py-2 pr-4">
                        <div className="font-medium">{row.name}</div>
                        <div className="text-foreground/60">{row.email}</div>
                      </td>
                      <td className="py-2 pr-4">{STATUS_LABELS[row.status] ?? row.status}</td>
                      {metricStats.map(({ rule }) => {
                        const cell = row.values[rule.key];
                        if (!cell) {
                          return (
                            <td key={rule.key} className="py-2 pr-4 text-right text-foreground/40">
                              —
                            </td>
                          );
                        }
                        const flagged = !isPlausible(cell.value, rule);
                        return (
                          <td
                            key={rule.key}
                            title={flagged ? "Hors plage de plausibilité" : undefined}
                            className={`py-2 pr-4 text-right font-medium ${flagged ? "text-red-600" : ""}`}
                          >
                            {numberFormatter.format(cell.value)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}