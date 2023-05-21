import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const apiPassword = process.env.API_PASSWORD;
  const apiBinKey = process.env.API_BIN_KEY;
  if (!apiPassword || !apiBinKey) {
    throw new Error("API_PASSWORD ou API_BIN_KEY não definidos");
  }
  let completeData = {
    pessoas: req.body.pessoas,
    despesas: req.body.despesas,
  };
  const response = await fetch(
    `https://json.extendsclass.com/bin/${apiBinKey}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Security-key": apiPassword,
      },
      body: JSON.stringify(completeData),
    }
  );
  console.log("response.status :>> ", response.status);
  console.log("response.statusText :>> ", response.statusText);
  console.log("response.json() :>> ", await response.json());
  if (response.status !== 200) {
    return res
      .status(response.status)
      .json({ succes: false, error: "Erro ao atualizar o JSON" });
  }

  res.status(200).json({ success: true });
};
export default handler;
