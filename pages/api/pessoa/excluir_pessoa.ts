import { NextApiHandler } from "next";
import prisma from "../../../prisma/db";

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.body;
  const pessoa = await prisma.pessoa.delete({
    where: {
      id,
    },
  });
  res.status(200).json(pessoa);
};
export default handler;
