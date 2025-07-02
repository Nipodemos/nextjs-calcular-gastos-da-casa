import { IPessoa, IDespesa } from "@/types";

// --- Funções da API de Despesas ---

export async function adicionarDespesa(
  valor: number,
  descricao: string
): Promise<IDespesa | null> {
  const respostaApi = await fetch("/api/despesa/inserir_despesa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ descricao, valor }),
  });
  if (respostaApi.ok) {
    return await respostaApi.json();
  }
  return null;
}

export async function alterarDespesa(
  id: number,
  valor: number,
  descricao: string
): Promise<IDespesa | null> {
  const respostaApi = await fetch("/api/despesa/editar_despesa", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, valor, descricao }),
  });
  if (respostaApi.ok) {
    return await respostaApi.json();
  }
  return null;
}

export async function removerDespesa(id: number): Promise<boolean> {
  const resultadoApi = await fetch("/api/despesa/excluir_despesa", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return resultadoApi.ok;
}

// --- Funções da API de Pessoas ---

export async function adicionarPessoa(
  pessoaData: Omit<IPessoa, "id">
): Promise<IPessoa | null> {
  const respostaApi = await fetch("/api/pessoa/inserir_pessoa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pessoaData),
  });
  if (respostaApi.ok) {
    return await respostaApi.json();
  }
  return null;
}

export async function alterarPessoa(
  pessoaData: IPessoa
): Promise<IPessoa | null> {
  const resultadoApi = await fetch("/api/pessoa/editar_pessoa", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pessoaData),
  });
  if (resultadoApi.ok) {
    return await resultadoApi.json();
  }
  return null;
}

export async function removerPessoa(id: number): Promise<boolean> {
  const resultadoApi = await fetch("/api/pessoa/excluir_pessoa", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return resultadoApi.ok;
}
