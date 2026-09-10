import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EnrollmentForm from "@/components/enrollment-form";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export default async function StudyPage({
  params,
}: {
  params: { id: string };
}) {
  const study = await prisma.study.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          enrollments: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });

  if (!study) notFound();

  const remaining = study.maxParticipants - study._count.enrollments;

  const details = [
    { label: "Date de début", value: formatDate(study.startDate) },
    { label: "Lieu", value: study.location },
    { label: "Catégorie", value: study.category },
    {
      label: "Places restantes",
      value:
        remaining > 0
          ? `${remaining} sur ${study.maxParticipants}`
          : "Complet",
    },
    { label: "Créée le", value: formatDate(study.createdAt) },
  ];

  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <Link
        href="/"
        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
      >
        ← Retour aux études
      </Link>

      <article className="mt-6 max-w-2xl">
        <header>
          <h1 className="text-3xl font-bold">{study.title}</h1>
          <p className="mt-2 text-foreground/70">{study.description}</p>
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

      <nav className="mt-6">
        <Link
          href={`/studies/${study.id}/analyse`}
          className="rounded-full border border-black/[0.08] px-5 py-2 text-sm font-medium transition-colors hover:border-foreground/40 dark:border-white/[0.145]"
        >
          Voir les données
        </Link>
      </nav>

      <EnrollmentForm studyId={study.id} />
    </main>
  );
}