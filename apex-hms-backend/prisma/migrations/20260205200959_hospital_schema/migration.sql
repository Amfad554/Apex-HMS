/*
  Warnings:

  - You are about to drop the column `bloodGroup` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `PatientProfile` table. All the data in the column will be lost.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospitalName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "bloodGroup",
DROP COLUMN "dateOfBirth",
DROP COLUMN "gender",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "hospitalName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'HOSPITAL';
