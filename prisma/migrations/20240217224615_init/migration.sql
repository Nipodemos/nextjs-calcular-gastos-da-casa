-- CreateTable
CREATE TABLE "Pessoa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "porcentagemTaxaInss" REAL NOT NULL,
    "porcentagemTaxaAlimentacao" REAL NOT NULL,
    "porcentagemTaxaPassagem" REAL NOT NULL,
    "salario" REAL NOT NULL,
    "valorAlimentacao" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" REAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "dataDespesa" DATETIME NOT NULL,
    CONSTRAINT "Despesa_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
