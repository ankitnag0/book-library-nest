/*
  Warnings:

  - Added the required column `type` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'approved');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('checkout', 'return');

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "type" "RequestType" NOT NULL;
