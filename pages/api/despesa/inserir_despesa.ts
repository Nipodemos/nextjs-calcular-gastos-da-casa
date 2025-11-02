import { NextApiHandler } from "next";
import prisma from "../../../prisma/db";

const handler: NextApiHandler = async (req, res) => {
  const { descricao, valor } = req.body;
  const despesa = await prisma.despesa.create({
    data: {
      descricao,
      valor,
    },
  });

  const despesaFormatada = {
    ...despesa,
    valor: despesa.valor.toNumber(),
  };

  res.status(200).json(despesaFormatada);
};
export default handler;
