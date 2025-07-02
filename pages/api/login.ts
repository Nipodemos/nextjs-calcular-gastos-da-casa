// pages/api/login.js
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { NextApiHandler } from "next";

const SECRET_KEY =
  process.env.JWT_SECRET || "fallback-secret-para-desenvolvimento"; // Crie uma JWT_SECRET no seu .env.local também!
const SITE_PASSWORD = process.env.SITE_PASSWORD;

const handler: NextApiHandler = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { password } = req.body;

  // Verifica se a senha enviada é a mesma da variável de ambiente
  if (password === SITE_PASSWORD) {
    // Senha correta! Vamos criar um token.
    const token = sign(
      { isAuthenticated: true }, // Payload do token
      SECRET_KEY,
      { expiresIn: "7d" } // O token expira em 7 dias
    );

    // Serializa o cookie para ser enviado no cabeçalho da resposta
    const serializedCookie = serialize("auth_token", token, {
      httpOnly: true, // O cookie não pode ser acessado via JavaScript no front-end (MUITO IMPORTANTE para segurança)
      secure: process.env.NODE_ENV !== "development", // Use 'secure' em produção (HTTPS)
      sameSite: "strict", // Proteção contra ataques CSRF
      maxAge: 60 * 60 * 24 * 7, // Duração do cookie em segundos (7 dias)
      path: "/", // O cookie é válido para todo o site
    });

    res.setHeader("Set-Cookie", serializedCookie);
    res.status(200).json({ message: "Login successful" });
  } else {
    // Senha incorreta
    res.status(401).json({ message: "Invalid credentials" });
  }
};
export default handler;
