"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type EnrollmentResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEnrollment(formData: FormData) {
  const studyId = formData.get("studyId");
  const name = formData.get("name");
  const email = formData.get("email");

  return {
    studyId: typeof studyId === "string" ? studyId.trim() : "",
    name: typeof name === "string" ? name.trim() : "",
    email: typeof email === "string" ? email.trim().toLowerCase() : "",
  };
}

export async function enroll(
  _prevState: EnrollmentResult,
  formData: FormData,
): Promise<EnrollmentResult> {
  const { studyId, name, email } = parseEnrollment(formData);

  if (!studyId || !name || !EMAIL_PATTERN.test(email)) {
    return {
      status: "error",
      message: "Veuillez renseigner un nom et une adresse e-mail valides.",
    };
  }

  const result = await prisma.$transaction(async (tx): Promise<EnrollmentResult> => {
    const participant = await tx.participant.upsert({
      where: { email },
      update: {},
      create: { name, email },
    });

    const existing = await tx.enrollment.findUnique({
      where: {
        studyId_participantId: { studyId, participantId: participant.id },
      },
    });

    if (existing) {
      return {
        status: "error",
        message:
          "Vous êtes déjà inscrit(e) à cette étude avec cette adresse e-mail.",
      };
    }

    const study = await tx.study.findUnique({
      where: { id: studyId },
      select: { maxParticipants: true },
    });

    if (!study) {
      return {
        status: "error",
        message: "Cette étude n'existe pas ou n'est plus disponible.",
      };
    }

    const confirmedCount = await tx.enrollment.count({
      where: { studyId, status: "CONFIRMED" },
    });

    const status =
      confirmedCount <= study.maxParticipants ? "CONFIRMED" : "WAITLISTED";

    await tx.enrollment.create({
      data: { studyId, participantId: participant.id, status },
    });

    return status === "CONFIRMED"
      ? {
          status: "success",
          message: "Inscription confirmée — vous êtes inscrit(e) à cette étude.",
        }
      : {
          status: "success",
          message:
            "L'étude est complète — vous êtes placé(e) en liste d'attente.",
        };
  });

  revalidatePath(`/studies/${studyId}`);
  return result;
}