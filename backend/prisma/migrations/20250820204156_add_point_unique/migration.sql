/*
  Warnings:

  - A unique constraint covering the columns `[userId,quizId]` on the table `Point` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Point_userId_quizId_key" ON "public"."Point"("userId", "quizId");
