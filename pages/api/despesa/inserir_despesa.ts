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
  res.status(200).json(despesa);
};
export default handler;
