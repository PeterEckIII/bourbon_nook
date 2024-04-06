/*
  Warnings:

  - You are about to drop the column `batch` on the `bottle` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `bottle` table. All the data in the column will be lost.
  - You are about to drop the column `distiller` on the `bottle` table. All the data in the column will be lost.
  - You are about to drop the column `killDate` on the `bottle` table. All the data in the column will be lost.
  - You are about to drop the column `openDate` on the `bottle` table. All the data in the column will be lost.
  - You are about to drop the column `producer` on the `bottle` table. All the data in the column will be lost.
  - You are about to drop the column `proof` on the `bottle` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `bottle` table. All the data in the column will be lost.
  - The `status` column on the `bottle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BottleStatus" AS ENUM ('OPENED', 'SEALED', 'FINISHED');

-- AlterTable
ALTER TABLE "bottle" DROP COLUMN "batch",
DROP COLUMN "color",
DROP COLUMN "distiller",
DROP COLUMN "killDate",
DROP COLUMN "openDate",
DROP COLUMN "producer",
DROP COLUMN "proof",
DROP COLUMN "size",
ADD COLUMN     "distillery" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "BottleStatus" NOT NULL DEFAULT 'SEALED';

-- DropEnum
DROP TYPE "bottle_status";
