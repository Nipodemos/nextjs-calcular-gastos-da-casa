import { NextApiHandler } from "next";
import prisma from "../../../prisma/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    nome,
    salario,
    valorAlimentacao,
    porcentagemTaxaInss,
    porcentagemTaxaAlimentacao,
    porcentagemTaxaPassagem,
  } = req.body;
  const pessoa = await prisma.pessoa.create({
    data: {
      nome,
      salario,
      valorAlimentacao,
      porcentagemTaxaInss,
      porcentagemTaxaAlimentacao,
      porcentagemTaxaPassagem,
    },
  });
  res.status(200).json(pessoa);
};

export default handler;
