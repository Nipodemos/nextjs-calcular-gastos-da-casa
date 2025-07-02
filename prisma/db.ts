// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Função que cria e estende o Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

// Inferimos o tipo do cliente estendido
type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>;

// Adicionamos o tipo correto ao escopo global
declare global {
  var prisma: PrismaClientExtended | undefined;
}

// Usamos a mesma lógica singleton, mas com a função
const prisma = globalThis.prisma ?? prismaClientSingleton();

// Exportamos o cliente para uso na aplicação
export default prisma;

// Em desenvolvimento, evitamos criar novas instâncias a cada hot-reload
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
