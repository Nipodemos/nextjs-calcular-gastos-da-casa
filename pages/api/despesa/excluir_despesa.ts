import { NextApiHandler } from "next";
import prisma from "../../../prisma/db";

const handler: NextApiHandler = async (req, res) => {
  const { id } = req.body;
  const despesa = await prisma.despesa.delete({
    where: {
      id,
    },
  });
  res.status(200).json(despesa);
};
export default handler;
