// pages/api/logout.ts

import { serialize } from "cookie";
import { NextApiHandler } from "next";

const handler: NextApiHandler = (req, res) => {
  // O nome do cookie DEVE ser o mesmo usado no login
  const cookieName = "auth_token";

  // O truque para "apagar" um cookie é criar um novo cookie com o mesmo nome,
  // mesmo caminho, mas com uma data de expiração no passado (maxAge: -1).
  // O navegador verá que o cookie expirou e o removerá.
  const serializedCookie = serialize(cookieName, "", {
    // O valor é uma string vazia
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: -1, // <-- A MÁGICA ACONTECE AQUI!
    path: "/", // O caminho DEVE ser o mesmo do cookie original
  });

  // Envia o cabeçalho para o navegador
  res.setHeader("Set-Cookie", serializedCookie);

  // Responde com uma mensagem de sucesso e redireciona para a página de login.
  // O redirecionamento é opcional, mas útil para o seu caso de uso.
  res.redirect(307, "/login");
};

export default handler;
