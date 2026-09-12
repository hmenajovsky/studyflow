import { PrismaClient, EnrollmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.enrollment.deleteMany()
  await prisma.participant.deleteMany()
  await prisma.study.deleteMany()
  await prisma.researchInstitute.deleteMany()

  const inDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  const institutesData = [
    {
      name: 'Institut de Recherche Clinique de Paris',
      description:
        'Centre de référence pour les essais cliniques en neurologie et vaccination.',
      city: 'Paris',
      country: 'France',
    },
    {
      name: 'Institut Régional du Cœur',
      description:
        "Spécialisé dans les études cardiovasculaires et le suivi de l'hypertension.",
      city: 'Lyon',
      country: 'France',
    },
    {
      name: 'Institut de Pharmacologie du Nord',
      description:
        'Site dédié aux études de pharmacocinétique et aux traitements adjuvants.',
      city: 'Lille',
      country: 'France',
    },
    {
      name: 'Institut de Prévention Métabolique',
      description:
        "Lieu d'expérimentation sur les métabolismes et le suivi des pathologies chroniques.",
      city: 'Toulouse',
      country: 'France',
    },
    {
      name: 'Institut de Recherche en Santé de Genève',
      description:
        'Centre spécialisé dans le développement de biomarqueurs et la médecine de précision.',
      city: 'Genève',
      country: 'Suisse',
    },
  ]

  const institutes = await Promise.all(
    institutesData.map((data) => prisma.researchInstitute.create({ data })),
  )

  const studies = await Promise.all(
    [
      {
        title: 'Efficacité d\'un nouveau traitement contre la migraine',
        description:
          'Étude randomisée en double aveugle comparant un nouveau traitement aux soins standards.',
        startDate: new Date('2026-10-15'),
        location: 'Paris',
        category: 'Neurologie',
        maxParticipants: 60,
        instituteId: institutes[0].id,
      },
      {
        title: 'Impact de l\'activité physique sur la tension artérielle',
        description:
          'Suivi de 6 mois mesurant l\'effet d\'un programme d\'exercice sur l\'hypertension.',
        startDate: new Date('2026-11-01'),
        location: 'Lyon',
        category: 'Cardiologie',
        maxParticipants: 2,
        instituteId: institutes[1].id,
      },
      {
        title: 'Évaluation d\'un nouveau vaccin contre la grippe saisonnière',
        description:
          'Essai clinique de phase 2 évaluant l\'innocuité et l\'immunogénicité du candidat vaccin.',
        startDate: new Date('2026-12-05'),
        location: 'Bordeaux',
        category: 'Vaccination',
        maxParticipants: 300,
        instituteId: institutes[0].id,
      },
      {
        title: 'Étude de biodisponibilité d\'une molécule antidiabétique',
        description:
          'Mesure des paramètres pharmacocinétiques d\'un nouveau comprimé à libération prolongée.',
        startDate: new Date('2027-01-20'),
        location: 'Lille',
        category: 'Métabolisme',
        maxParticipants: 24,
        instituteId: institutes[2].id,
      },
      {
        title: 'Traitement adjuvant du mélanome de stade précoce',
        description:
          'Comparaison de deux schémas thérapeutiques adjuvants après exérèse chirurgicale.',
        startDate: new Date('2027-02-10'),
        location: 'Marseille',
        category: 'Oncologie',
        maxParticipants: 120,
        instituteId: institutes[2].id,
      },
      {
        title: 'Observance d\'un traitement antihypertenseur en ville',
        description:
          'Étude observationnelle mesurant l\'observance thérapeutique à l\'aide d\'un carnet numérique.',
        startDate: inDays(3),
        location: 'Nantes',
        category: 'Cardiologie',
        maxParticipants: 80,
        instituteId: institutes[1].id,
      },
      {
        title: 'Télémédecine pour le suivi du diabète de type 2',
        description:
          'Étude évaluant l\'impact d\'un suivi par télémédecine sur l\'équilibre glycémique.',
        startDate: inDays(15),
        location: 'Toulouse',
        category: 'Métabolisme',
        maxParticipants: 150,
        instituteId: institutes[3].id,
      },
      {
        title: 'Atelier : suivi des indices corporels',
        description:
          'Jeu de données simplifié pour l\'atelier : suivi du poids (kg) et de la taille (cm) de participants fictifs.',
        startDate: inDays(8),
        location: 'Grenoble',
        category: 'Nutrition',
        maxParticipants: 10,
        instituteId: institutes[3].id,
      },
      {
        title: 'Évaluation d\'un biomarqueur salivaire pour le stress',
        description:
          'Étude pilote mesurant la pertinence d\'un biomarqueur salivaire comme indicateur du stress chronique.',
        startDate: inDays(20),
        location: 'Genève',
        category: 'Cardiologie',
        maxParticipants: 40,
        instituteId: institutes[4].id,
      },
    ].map((data) => prisma.study.create({ data })),
  )

  const participants = await Promise.all(
    [
      { name: 'Camille Dupont', email: 'camille.dupont@example.com' },
      { name: 'Lucas Martin', email: 'lucas.martin@example.com' },
      { name: 'Emma Bernard', email: 'emma.bernard@example.com' },
      { name: 'Hugo Petit', email: 'hugo.petit@example.com' },
      { name: 'Léa Robert', email: 'lea.robert@example.com' },
      { name: 'Nathan Richard', email: 'nathan.richard@example.com' },
      { name: 'Marie Leroy', email: 'marie.leroy@example.com' },
      { name: 'Thomas Moreau', email: 'thomas.moreau@example.com' },
      { name: 'Sofia Rossi', email: 'sofia.rossi@example.com' },
      { name: 'Julien Garnier', email: 'julien.garnier@example.com' },
    ].map((data) => prisma.participant.create({ data })),
  )

  const enrollments = [
    { study: studies[0], participant: participants[0], status: EnrollmentStatus.CONFIRMED },
    { study: studies[0], participant: participants[1], status: EnrollmentStatus.WAITLISTED },
    { study: studies[1], participant: participants[2], status: EnrollmentStatus.CONFIRMED },
    { study: studies[1], participant: participants[3], status: EnrollmentStatus.CONFIRMED },
    { study: studies[2], participant: participants[0], status: EnrollmentStatus.CONFIRMED },
    { study: studies[2], participant: participants[4], status: EnrollmentStatus.CONFIRMED },
    { study: studies[2], participant: participants[5], status: EnrollmentStatus.WAITLISTED },
    { study: studies[3], participant: participants[1], status: EnrollmentStatus.CONFIRMED },
    { study: studies[4], participant: participants[3], status: EnrollmentStatus.WAITLISTED },
    { study: studies[4], participant: participants[5], status: EnrollmentStatus.CONFIRMED },
    { study: studies[5], participant: participants[2], status: EnrollmentStatus.CONFIRMED },
    { study: studies[6], participant: participants[0], status: EnrollmentStatus.CONFIRMED },
    { study: studies[6], participant: participants[4], status: EnrollmentStatus.WAITLISTED },
    { study: studies[7], participant: participants[6], status: EnrollmentStatus.CONFIRMED },
    { study: studies[7], participant: participants[7], status: EnrollmentStatus.CONFIRMED },
    { study: studies[7], participant: participants[8], status: EnrollmentStatus.CONFIRMED },
    { study: studies[7], participant: participants[9], status: EnrollmentStatus.WAITLISTED },
  ]

  for (const { study, participant, status } of enrollments) {
    await prisma.enrollment.create({
      data: {
        studyId: study.id,
        participantId: participant.id,
        status,
      },
    })
  }

  console.log(
    `Seed terminé : ${institutes.length} instituts, ${studies.length} études, ${participants.length} participants, ${enrollments.length} inscriptions.`,
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })