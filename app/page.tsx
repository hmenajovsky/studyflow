import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StudyFilter, { type Period } from "@/components/study-filter";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

function remainingPlaces(study: {
  maxParticipants: number;
  _count: { enrollments: number };
}) {
  return study.maxParticipants - study._count.enrollments;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

function periodRange(period: Period): { gte: Date; lt: Date } | null {
  const from = startOfToday();
  if (period === "week") return { gte: from, lt: addDays(from, 14) };
  if (period === "month") return { gte: from, lt: addMonths(from, 1) };
  return null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string | string[]; period?: string | string[] };
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const period: Period =
    searchParams.period === "week" || searchParams.period === "month"
      ? searchParams.period
      : "all";

  const range = periodRange(period);
  const studies = await prisma.study.findMany({
    where: {
      ...(q ? { title: { contains: q } } : {}),
      ...(range ? { startDate: { gte: range.gte, lt: range.lt } } : {}),
    },
    orderBy: { startDate: "asc" },
    include: {
      _count: {
        select: {
          enrollments: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });

  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Études cliniques disponibles</h1>
        <p className="mt-2 text-foreground/70">
          Recherchez par titre et filtrez par période de début.
        </p>
      </header>

      <section aria-label="Recherche et filtres" className="mb-8">
        <StudyFilter q={q} period={period} />
      </section>

      <section aria-label="Liste des études" className="grid gap-6">
        {studies.map((study) => {
          const remaining = remainingPlaces(study);
          return (
            <div
              key={study.id}
              className="flex flex-col gap-4 rounded-xl border border-black/[0.08] dark:border-white/[0.145] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{study.title}</h2>
                  <p className="mt-1 text-sm text-foreground/70">
                    {formatDate(study.startDate)} · {study.location}
                  </p>
                </div>
                <span className="rounded-full bg-foreground/5 px-3 py-1 text-sm font-medium">
                  {study.category}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm">
                  {remaining > 0 ? (
                    <>
                      <span className="font-semibold">{remaining}</span>{" "}
                      place{remaining > 1 ? "s" : ""} restante
                      {remaining > 1 ? "s" : ""}
                    </>
                  ) : (
                    <span className="font-semibold text-red-600">Complet</span>
                  )}
                </p>
                <Link
                  href={`/studies/${study.id}`}
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
                >
                  Voir le détail
                </Link>
              </div>
            </div>
          );
        })}

        {studies.length === 0 && (
          <div className="rounded-xl border border-dashed border-black/[0.2] p-8 text-center dark:border-white/[0.3]">
            <p className="text-foreground/70">
              Aucune étude ne correspond à vos critères.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
            >
              Réinitialiser les filtres
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}