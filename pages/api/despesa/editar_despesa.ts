import { NextApiHandler } from "next";
import prisma from "../../../prisma/db";

const handler: NextApiHandler = async (req, res) => {
  const { descricao, valor, id } = req.body;
  const despesa = await prisma.despesa.update({
    where: {
      id: Number(id),
    },
    data: {
      descricao,
      valor,
    },
  });
  res.status(200).json(despesa);
};
export default handler;
