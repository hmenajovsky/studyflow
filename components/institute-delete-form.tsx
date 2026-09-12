"use client";

import { useFormState } from "react-dom";
import { deleteInstitute, type InstituteResult } from "@/lib/institute-actions";

export default function InstituteDeleteForm({
  instituteId,
}: {
  instituteId: string;
}) {
  const [state, formAction] = useFormState<InstituteResult, FormData>(
    deleteInstitute,
    null,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="instituteId" value={instituteId} />
      <button
        type="submit"
        className="rounded-full border border-red-300 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-400 dark:border-red-800 dark:text-red-400"
      >
        Supprimer {"l'institut"}
      </button>
      {state && state.status === "error" && (
        <p
          role="status"
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}