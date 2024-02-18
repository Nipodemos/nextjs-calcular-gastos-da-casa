/*
  Warnings:

  - A unique constraint covering the columns `[descricao]` on the table `Despesa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome]` on the table `Pessoa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Despesa_descricao_key" ON "Despesa"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Pessoa_nome_key" ON "Pessoa"("nome");
