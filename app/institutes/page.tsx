import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function InstitutesPage() {
  const institutes = await prisma.researchInstitute.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { studies: true },
      },
    },
  });

  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-10">
        <Link
          href="/"
          className="text-sm text-foreground/70 transition-colors hover:text-foreground"
        >
          ← Retour aux études
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Instituts de recherche</h1>
            <p className="mt-2 text-foreground/70">
              Gérez les instituts qui organisent les études cliniques.
            </p>
          </div>
          <Link
            href="/institutes/new"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Nouvel institut
          </Link>
        </div>
      </header>

      <section aria-label="Liste des instituts" className="grid gap-6">
        {institutes.map((institute) => (
          <div
            key={institute.id}
            className="flex flex-col gap-4 rounded-xl border border-black/[0.08] p-6 dark:border-white/[0.145]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{institute.name}</h2>
                <p className="mt-1 text-sm text-foreground/70">
                  {institute.city}, {institute.country}
                </p>
              </div>
              <span className="rounded-full bg-foreground/5 px-3 py-1 text-sm font-medium">
                {institute._count.studies} étude
                {institute._count.studies > 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-sm text-foreground/70">
              {institute.description}
            </p>

            <div>
              <Link
                href={`/institutes/${institute.id}`}
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Voir le détail
              </Link>
            </div>
          </div>
        ))}

        {institutes.length === 0 && (
          <div className="rounded-xl border border-dashed border-black/[0.2] p-8 text-center dark:border-white/[0.3]">
            <p className="text-foreground/70">Aucun institut enregistré.</p>
          </div>
        )}
      </section>
    </main>
  );
}