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

interface ResApi {
  success: boolean;
  error?: string;
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
      let resApi: ResApi = await atualizarApiBin(get().pessoas, get().despesas);
      if (resApi.success === false) {
        set((state) => {
          state.despesas.pop();
        });
        return false;
      }
      return true;
    },
    alterarDespesa: async (id: number, valor: number, descricao: string) => {
      let valorOriginal: number;
      let descricaoOriginal: string;
      set((state) => {
        const index = state.despesas.findIndex((d) => d.id === id);
        valorOriginal = state.despesas[index].valor;
        descricaoOriginal = state.despesas[index].descricao;
        state.despesas[index].valor = valor;
        state.despesas[index].descricao = descricao;
      });
      let resApi: ResApi = await atualizarApiBin(get().pessoas, get().despesas);
      if (resApi.success === false) {
        set((state) => {
          const index = state.despesas.findIndex((d) => d.id === id);
          state.despesas[index].valor = valorOriginal;
          state.despesas[index].descricao = descricaoOriginal;
        });
        return false;
      }
      return true;
    },
    removerDespesa: async (id: number) => {
      let despesaRemovida: IDespesa;
      set((state) => {
        const index = state.despesas.findIndex((d) => d.id === id);
        despesaRemovida = state.despesas[index];
        state.despesas.splice(index, 1);
      });
      let resApi: ResApi = await atualizarApiBin(get().pessoas, get().despesas);
      if (resApi.success === false) {
        set((state) => {
          state.despesas.push(despesaRemovida);
        });
        return false;
      }
      return true;
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
