import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateInstitute } from "@/lib/institute-actions";
import InstituteForm from "@/components/institute-form";

export default async function EditInstitutePage({
  params,
}: {
  params: { id: string };
}) {
  const institute = await prisma.researchInstitute.findUnique({
    where: { id: params.id },
  });

  if (!institute) notFound();

  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <Link
        href={`/institutes/${institute.id}`}
        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
      >
        ← Retour à {"l'institut"}
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold">Modifier {"l'institut"}</h1>
        <p className="mt-2 text-foreground/70">{institute.name}</p>
      </header>

      <InstituteForm action={updateInstitute} institute={institute} />
    </main>
  );
}