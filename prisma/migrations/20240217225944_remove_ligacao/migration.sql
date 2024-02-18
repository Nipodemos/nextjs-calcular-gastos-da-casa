/*
  Warnings:

  - You are about to drop the column `pessoaId` on the `Despesa` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Despesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" REAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataDespesa" DATETIME NOT NULL
);
INSERT INTO "new_Despesa" ("dataDespesa", "descricao", "id", "valor") SELECT "dataDespesa", "descricao", "id", "valor" FROM "Despesa";
DROP TABLE "Despesa";
ALTER TABLE "new_Despesa" RENAME TO "Despesa";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
