import Link from "next/link";
import { createInstitute } from "@/lib/institute-actions";
import InstituteForm from "@/components/institute-form";

export default function NewInstitutePage() {
  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <Link
        href="/institutes"
        className="text-sm text-foreground/70 transition-colors hover:text-foreground"
      >
        ← Retour aux instituts
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold">Nouvel institut</h1>
        <p className="mt-2 text-foreground/70">
          Ajoutez un institut de recherche.
        </p>
      </header>

      <InstituteForm action={createInstitute} />
    </main>
  );
}