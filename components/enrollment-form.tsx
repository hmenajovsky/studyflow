"use client";

import { useFormState, useFormStatus } from "react-dom";
import { enroll, type EnrollmentResult } from "@/lib/actions";

export default function EnrollmentForm({ studyId }: { studyId: string }) {
  const [state, formAction] = useFormState<EnrollmentResult, FormData>(
    enroll,
    null,
  );

  return (
    <section className="mt-10 max-w-2xl">
      <h2 className="text-2xl font-bold">{"S'inscrire à cette étude"}</h2>
      <p className="mt-2 text-sm text-foreground/70">
        Renseignez vos coordonnées pour participer à cette étude.
      </p>

      {state && (
        <p
          role="status"
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
            state.status === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="studyId" value={studyId} />
        <input
          type="text"
          name="name"
          required
          placeholder="Nom complet"
          className="rounded-xl border border-black/[0.08] px-4 py-2 text-sm outline-none transition-colors focus:border-foreground/40 dark:border-white/[0.145]"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Adresse e-mail"
          className="rounded-xl border border-black/[0.08] px-4 py-2 text-sm outline-none transition-colors focus:border-foreground/40 dark:border-white/[0.145]"
        />
        <SubmitButton />
      </form>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-60"
    >
      {pending ? "Enregistrement…" : "S'inscrire"}
    </button>
  );
}