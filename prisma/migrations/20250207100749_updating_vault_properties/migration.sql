-- DropForeignKey
ALTER TABLE "Vault" DROP CONSTRAINT "Vault_postId_fkey";

-- AlterTable
ALTER TABLE "Vault" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "postId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vault" ADD CONSTRAINT "Vault_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
