import { readFileSync } from "fs";
import { prisma } from "../lib/prisma";
import { RULE_BY_KEY } from "../lib/study-metrics";

const HEADER = "study;email;metric;value;unit";

type ParsedRow = {
  line: number;
  studyTitle: string;
  email: string;
  metric: string;
  value: number;
  unit: string;
};

const [, , path] = process.argv;

if (!path) {
  console.error("Usage : npm run data:import -- <fichier.csv>");
  process.exit(1);
}

function parseValue(raw: string): number | null {
  const value = Number(raw.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function parseCsv(text: string): ParsedRow[] {
  return text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter(({ text }) => text !== "")
    .filter(({ text, line }) => {
      if (text === HEADER) {
        console.warn(`Ligne ${line} : en-tête ignoré.`);
        return false;
      }
      return true;
    })
    .map(({ line, text }) => {
      const [studyTitle, email, metric, valueRaw, unit] = text.split(";");
      const value = parseValue(valueRaw ?? "");
      return {
        line,
        studyTitle: studyTitle?.trim() ?? "",
        email: (email ?? "").trim().toLowerCase(),
        metric: metric?.trim() ?? "",
        value: value ?? NaN,
        unit: unit?.trim() ?? "",
      } satisfies ParsedRow;
    });
}

async function main() {
  const raw = readFileSync(path, "utf8");
  const rows = parseCsv(raw);

  const errors: string[] = [];
  const measurements: { enrollmentId: string; metric: string; value: number; unit: string }[] =
    [];

  for (const row of rows) {
    const { line, studyTitle, email, metric, value } = row;
    const ctx = `Ligne ${line}`;

    if (!studyTitle || !email || !metric || Number.isNaN(value)) {
      errors.push(`${ctx} : colonnes 'study;email;metric;value;unit' attendues.`);
      continue;
    }

    const study = await prisma.study.findFirst({ where: { title: studyTitle } });
    if (!study) {
      errors.push(`${ctx} : étude introuvable : "${studyTitle}".`);
      continue;
    }
    if (!RULE_BY_KEY[metric]) {
      console.warn(`${ctx} : métrique "${metric}" sans seuil de cohérence défini.`);
    }

    const participant = await prisma.participant.findUnique({ where: { email } });
    if (!participant) {
      errors.push(`${ctx} : participant introuvable : ${email}.`);
      continue;
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studyId_participantId: { studyId: study.id, participantId: participant.id },
      },
    });
    if (!enrollment) {
      errors.push(`${ctx} : ${email} n'est pas inscrit(e) à "${studyTitle}".`);
      continue;
    }

    measurements.push({
      enrollmentId: enrollment.id,
      metric,
      value,
      unit: row.unit || RULE_BY_KEY[metric]?.unit || "",
    });
  }

  if (errors.length > 0) {
    console.error(`Import abandonné : ${errors.length} erreur(s).`);
    errors.forEach((error) => console.error(`  ${error}`));
    process.exit(1);
  }

  if (measurements.length === 0) {
    console.error("Aucune mesure à importer. Le fichier est vide ou mal formé.");
    process.exit(1);
  }

  const result = await prisma.measurement.createMany({
    data: measurements,
  });

  console.log(
    `${result.count} mesure(s) importée(s) pour ${rows.length} ligne(s) lues.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });