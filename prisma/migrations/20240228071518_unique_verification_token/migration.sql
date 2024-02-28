/*
  Warnings:

  - A unique constraint covering the columns `[verificationtoken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_verificationtoken_key" ON "users"("verificationtoken");
