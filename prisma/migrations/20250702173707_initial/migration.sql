-- CreateTable
CREATE TABLE "Pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "porcentagemTaxaInss" DOUBLE PRECISION NOT NULL,
    "porcentagemTaxaAlimentacao" DOUBLE PRECISION NOT NULL,
    "porcentagemTaxaPassagem" DOUBLE PRECISION NOT NULL,
    "salario" DOUBLE PRECISION NOT NULL,
    "valorAlimentacao" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Despesa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_nome_key" ON "Pessoa"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Despesa_descricao_key" ON "Despesa"("descricao");
