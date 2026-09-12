"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseInstitute, validateInstitute } from "@/lib/institute";

export type InstituteResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | null;

export async function createInstitute(
  _prevState: InstituteResult,
  formData: FormData,
): Promise<InstituteResult> {
  const input = parseInstitute(formData);
  const error = validateInstitute(input);
  if (error) return { status: "error", message: error };

  await prisma.researchInstitute.create({ data: input });

  revalidatePath("/institutes");
  return { status: "success", message: `Institut « ${input.name} » créé.` };
}

export async function updateInstitute(
  _prevState: InstituteResult,
  formData: FormData,
): Promise<InstituteResult> {
  const id = formData.get("instituteId");
  if (typeof id !== "string" || !id) {
    return { status: "error", message: "Institut introuvable." };
  }

  const input = parseInstitute(formData);
  const error = validateInstitute(input);
  if (error) return { status: "error", message: error };

  await prisma.researchInstitute.update({
    where: { id },
    data: input,
  });

  revalidatePath(`/institutes/${id}`);
  revalidatePath("/institutes");
  return { status: "success", message: `Institut « ${input.name} » mis à jour.` };
}

export async function deleteInstitute(
  _prevState: InstituteResult,
  formData: FormData,
): Promise<InstituteResult> {
  const id = formData.get("instituteId");
  if (typeof id !== "string" || !id) {
    return { status: "error", message: "Institut introuvable." };
  }

  await prisma.researchInstitute.delete({ where: { id } });

  revalidatePath("/institutes");
  redirect("/institutes");
}