import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InstituteDeleteForm from "@/components/institute-delete-form";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function InstitutePage({
  params,
}: {
  params: { id: string };
}) {
  const institute = await prisma.researchInstitute.findUnique({
    where: { id: params.id },
    include: {
      studies: { orderBy: { startDate: "asc" } },
    },
  });

  if (!institute) notFound();

  const details = [
    { label: "Ville", value: institute.city },
    { label: "Pays", value: institute.country },
    { label: "Études associées", value: String(institute.studies.length) },
    { label: "Créé le", value: dateFormatter.format(institute.createdAt) },
  ];

  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <Link
        href="/institutes"
        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
      >
        ← Retour aux instituts
      </Link>

      <article className="mt-6 max-w-2xl">
        <header>
          <h1 className="text-3xl font-bold">{institute.name}</h1>
          <p className="mt-2 text-foreground/70">{institute.description}</p>
        </header>

        <dl className="mt-8 divide-y divide-black/[0.08] border-y border-black/[0.08] dark:divide-white/[0.145] dark:border-white/[0.145]">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <dt className="text-foreground/70">{label}</dt>
              <dd className="font-medium text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </article>

      <section className="mt-10 max-w-2xl">
        <h2 className="text-2xl font-bold">Études de {"l'institut"}</h2>

        {institute.studies.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/70">
            Aucune étude associée à cet institut.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-black/[0.08] border-y border-black/[0.08] dark:divide-white/[0.145] dark:border-white/[0.145]">
            {institute.studies.map((study) => (
              <li key={study.id} className="py-3">
                <Link
                  href={`/studies/${study.id}`}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {study.title}
                </Link>
                <p className="mt-1 text-sm text-foreground/60">
                  {dateFormatter.format(study.startDate)} · {study.location}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href={`/institutes/${institute.id}/edit`}
          className="rounded-full border border-black/[0.08] px-5 py-2 text-sm font-medium transition-colors hover:border-foreground/40 dark:border-white/[0.145]"
        >
          Modifier
        </Link>
        <InstituteDeleteForm instituteId={institute.id} />
      </nav>
    </main>
  );
}