-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "resetcode" TEXT,
ADD COLUMN     "resetexp" TIMESTAMP(3);
