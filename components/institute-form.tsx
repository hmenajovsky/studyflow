"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { InstituteResult } from "@/lib/institute-actions";

const inputClass =
  "rounded-xl border border-black/[0.08] px-4 py-2 text-sm outline-none transition-colors focus:border-foreground/40 dark:border-white/[0.145]";

export default function InstituteForm({
  action,
  institute,
}: {
  action: (
    prevState: InstituteResult,
    formData: FormData,
  ) => Promise<InstituteResult>;
  institute?: {
    id: string;
    name: string;
    description: string;
    city: string;
    country: string;
  };
}) {
  const [state, formAction] = useFormState<InstituteResult, FormData>(
    action,
    null,
  );

  return (
    <section className="mt-10 max-w-2xl">
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
        {institute && (
          <input type="hidden" name="instituteId" value={institute.id} />
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="institute-name" className="text-sm font-medium">
            Nom
          </label>
          <input
            id="institute-name"
            type="text"
            name="name"
            required
            defaultValue={institute?.name}
            placeholder="Nom de l'institut"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="institute-description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="institute-description"
            name="description"
            required
            defaultValue={institute?.description}
            rows={3}
            placeholder="Activités principales de l'institut"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="institute-city" className="text-sm font-medium">
              Ville
            </label>
            <input
              id="institute-city"
              type="text"
              name="city"
              required
              defaultValue={institute?.city}
              placeholder="Ville"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="institute-country" className="text-sm font-medium">
              Pays
            </label>
            <input
              id="institute-country"
              type="text"
              name="country"
              required
              defaultValue={institute?.country}
              placeholder="Pays"
              className={inputClass}
            />
          </div>
        </div>

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
      {pending ? "Enregistrement…" : "Enregistrer"}
    </button>
  );
}