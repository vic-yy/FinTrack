/*
  Warnings:

  - The values [PAGAMENTO,DESPESA] on the enum `TransactionsTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionsTypes_new" AS ENUM ('PAYMENT', 'EXPENSE', 'INCOME', 'WITHDRAWAL');
ALTER TABLE "Transaction" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionsTypes_new" USING ("type"::text::"TransactionsTypes_new");
ALTER TYPE "TransactionsTypes" RENAME TO "TransactionsTypes_old";
ALTER TYPE "TransactionsTypes_new" RENAME TO "TransactionsTypes";
DROP TYPE "TransactionsTypes_old";
COMMIT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "statementId" INTEGER,
ALTER COLUMN "type" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Statement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
