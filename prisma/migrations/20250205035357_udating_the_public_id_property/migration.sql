/*
  Warnings:

  - A unique constraint covering the columns `[publicID]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_publicID_key" ON "Post"("publicID");
