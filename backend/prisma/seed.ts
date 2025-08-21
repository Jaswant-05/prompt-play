// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { username: "host@example.com" },
    update: {},
    create: {
      username: "host@example.com",
      password: "hashed",
      firstName: "Host",
      lastName: "User",
    },
  });

  const code = "ABC123";

  const existing = await prisma.quiz.findUnique({
    where: { code },
    select: { id: true },
  });

  if (existing) {
    await prisma.$transaction([
      // wipe scores for this quiz
      prisma.point.deleteMany({ where: { quizId: existing.id } }),
      // wipe questions; Options cascade from Question on delete in your schema
      prisma.question.deleteMany({ where: { quizId: existing.id } }),
      // reset quiz meta back to DRAFT (and topic if you want)
      prisma.quiz.update({
        where: { id: existing.id },
        data: { status: "DRAFT", topic: "Basic Algebra", expiresAt: null },
      }),
    ]);

    // (re)create fresh questions with options
    const q1 = await prisma.question.create({
      data: {
        quizId: existing.id,
        title: "2 + 2 = ?",
        options: {
          create: [
            { title: "3", isCorrect: false },
            { title: "4", isCorrect: true },
            { title: "5", isCorrect: false },
          ],
        },
      },
    });

    const q2 = await prisma.question.create({
      data: {
        quizId: existing.id,
        title: "2 * 3 = ?",
        options: {
          create: [
            { title: "5", isCorrect: false },
            { title: "6", isCorrect: true },
            { title: "7", isCorrect: false },
          ],
        },
      },
    });

    console.log(
      `Reset existing quiz ${code} to DRAFT with questions: [${q1.id}, ${q2.id}] (owner host@example.com)`
    );
  } else {
    await prisma.quiz.create({
      data: {
        userId: owner.id,
        code,
        topic: "Basic Algebra",
        status: "DRAFT",
        questions: {
          create: [
            {
              title: "2 + 2 = ?",
              options: {
                create: [
                  { title: "3", isCorrect: false },
                  { title: "4", isCorrect: true },
                  { title: "5", isCorrect: false },
                ],
              },
            },
            {
              title: "2 * 3 = ?",
              options: {
                create: [
                  { title: "5", isCorrect: false },
                  { title: "6", isCorrect: true },
                  { title: "7", isCorrect: false },
                ],
              },
            },
          ],
        },
      },
    });

    console.log("Seeded quiz code: ABC123, owner is host@example.com");
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
