import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface IPessoa {
  nome: string;
  salario: number;
  alimentacao: number;
  inss: number;
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
  popularPessoas: (pessoas: IPessoa[]) => void;
  popularDespesas: (despesas: IDespesa[]) => void;
}

export const mainStore = create(
  immer<ImainStore>((set, get) => ({
    pessoas: [],
    despesas: [],
    adicionarDespesa: async (valor: number, descricao: string) => {
      const id = Math.floor(Math.random() * Date.now());
      const newDespesa: IDespesa = { id, valor, descricao };
      set((state) => {
        state.despesas.push(newDespesa);
      });
      return await atualizarApiBin(get().pessoas, get().despesas);
    },
    alterarDespesa: async (id: number, valor: number, descricao: string) => {
      set((state) => {
        const index = state.despesas.findIndex((d) => d.id === id);
        state.despesas[index].valor = valor;
        state.despesas[index].descricao = descricao;
      });
      return await atualizarApiBin(get().pessoas, get().despesas);
    },
    removerDespesa: async (id: number) => {
      set((state) => {
        const index = state.despesas.findIndex((d) => d.id === id);
        state.despesas.splice(index, 1);
      });
      return await atualizarApiBin(get().pessoas, get().despesas);
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
