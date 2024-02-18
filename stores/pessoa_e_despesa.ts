import { Despesa } from "@prisma/client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IPessoa {
  id: number;
  nome: string;
  salario: number;
  valorAlimentacao: number;
  porcentagemTaxaInss: number;
  porcentagemTaxaAlimentacao: number;
  porcentagemTaxaPassagem: number;
}

export interface IDespesa {
  id: number;
  valor: number;
  descricao: string;
}

interface ImainStore {
  pessoas: IPessoa[];
  despesas: IDespesa[];
  adicionarDespesa: (valor: number, descricao: string) => Promise<boolean>;
  alterarDespesa: (
    id: number,
    valor: number,
    descricao: string
  ) => Promise<boolean>;
  removerDespesa: (id: number) => Promise<boolean>;
  adicionarPessoa: (
    nome: string,
    salario: number,
    valorAlimentacao: number,
    porcentagemTaxaInss: number,
    porcentagemTaxaAlimentacao: number,
    porcentagemTaxaPassagem: number
  ) => Promise<boolean>;
  alterarPessoa: (
    id: number,
    nome: string,
    salario: number,
    valorAlimentacao: number,
    porcentagemTaxaInss: number,
    porcentagemTaxaAlimentacao: number,
    porcentagemTaxaPassagem: number
  ) => Promise<boolean>;
  removerPessoa: (id: number) => Promise<boolean>;
  popularPessoas: (pessoas: IPessoa[]) => void;
  popularDespesas: (despesas: IDespesa[]) => void;
}

export const mainStore = create(
  immer<ImainStore>((set, get) => ({
    pessoas: [],
    despesas: [],
    adicionarDespesa: async (valor: number, descricao: string) => {
      const respostaApi = await fetch("/api/despesa/inserir_despesa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao,
          valor,
        }),
      });
      const novaDespesa: IDespesa = await respostaApi.json();
      if (respostaApi.status === 200) {
        set((state) => {
          state.despesas.push(novaDespesa);
        });
        return true;
      }
      return false;
    },
    alterarDespesa: async (id: number, valor: number, descricao: string) => {
      const respostaApi = await fetch("/api/despesa/editar_despesa", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          valor,
          descricao,
        }),
      });
      const despesaEditada: IDespesa = await respostaApi.json();
      if (respostaApi.status === 200) {
        set((state) => {
          const index = state.despesas.findIndex((d) => d.id === id);
          state.despesas[index].id = despesaEditada.id;
          state.despesas[index].valor = despesaEditada.valor;
          state.despesas[index].descricao = despesaEditada.descricao;
        });
        return true;
      }
      return false;
    },
    removerDespesa: async (id: number) => {
      const resultadoApi = await fetch("/api/despesa/excluir_despesa", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (resultadoApi.status === 200) {
        set((state) => {
          const index = state.despesas.findIndex((d) => d.id === id);
          state.despesas.splice(index, 1);
        });
        return true;
      }
      return false;
    },
    adicionarPessoa: async (
      nome: string,
      salario: number,
      valorAlimentacao: number,
      porcentagemTaxaInss: number,
      porcentagemTaxaAlimentacao: number,
      porcentagemTaxaPassagem: number
    ) => {
      const respostaApi = await fetch("/api/pessoa/inserir_pessoa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          salario,
          valorAlimentacao,
          porcentagemTaxaInss,
          porcentagemTaxaAlimentacao,
          porcentagemTaxaPassagem,
        }),
      });
      const pessoaAdicionada: IPessoa = await respostaApi.json();
      if (respostaApi.status === 200) {
        set((state) => {
          state.pessoas.push({
            id: pessoaAdicionada.id,
            nome,
            salario,
            valorAlimentacao,
            porcentagemTaxaInss,
            porcentagemTaxaAlimentacao,
            porcentagemTaxaPassagem,
          });
        });
        return true;
      }
      return false;
    },
    alterarPessoa: async (
      id: number,
      nome: string,
      salario: number,
      valorAlimentacao: number,
      porcentagemTaxaInss: number,
      porcentagemTaxaAlimentacao: number,
      porcentagemTaxaPassagem: number
    ) => {
      const resultadoApi = await fetch("/api/pessoa/editar_pessoa", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          nome,
          salario,
          valorAlimentacao,
          porcentagemTaxaInss,
          porcentagemTaxaAlimentacao,
          porcentagemTaxaPassagem,
        }),
      });
      const pessoaEditada: IPessoa = await resultadoApi.json();
      if (resultadoApi.status === 200) {
        set((state) => {
          const index = state.pessoas.findIndex((d) => d.id === id);
          state.pessoas[index].id = pessoaEditada.id;
          state.pessoas[index].nome = nome;
          state.pessoas[index].salario = salario;
          state.pessoas[index].valorAlimentacao = valorAlimentacao;
          state.pessoas[index].porcentagemTaxaInss = porcentagemTaxaInss;
          state.pessoas[index].porcentagemTaxaAlimentacao =
            porcentagemTaxaAlimentacao;
          state.pessoas[index].porcentagemTaxaPassagem =
            porcentagemTaxaPassagem;
        });
        return true;
      }
      return false;
    },
    removerPessoa: async (id: number) => {
      const resultadoApi = await fetch("/api/pessoa/excluir_pessoa", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (resultadoApi.status === 200) {
        set((state) => {
          const index = state.pessoas.findIndex((d) => d.id === id);
          state.pessoas.splice(index, 1);
        });
        return true;
      }
      return false;
    },
    popularPessoas: (pessoas: IPessoa[]) => {
      set((state) => {
        state.pessoas = pessoas;
      });
    },
    popularDespesas: (despesas: IDespesa[]) => {
      set((state) => {
        state.despesas = despesas;
      });
    },
  }))
);

const atualizarApiBin = async (pessoas: IPessoa[], despesas: IDespesa[]) => {
  const resultado = await fetch("/api/atualizar_json_storage", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pessoas,
      despesas,
    }),
  });
  return await resultado.json();
};
