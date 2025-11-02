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

  const pessoaFormatada = {
    ...pessoa,
    salario: pessoa.salario.toNumber(),
    valorAlimentacao: pessoa.valorAlimentacao.toNumber(),
    porcentagemTaxaInss: pessoa.porcentagemTaxaInss.toNumber(),
    porcentagemTaxaAlimentacao: pessoa.porcentagemTaxaAlimentacao.toNumber(),
    porcentagemTaxaPassagem: pessoa.porcentagemTaxaPassagem.toNumber(),
  };

  res.status(200).json(pessoaFormatada);
};

export default handler;
