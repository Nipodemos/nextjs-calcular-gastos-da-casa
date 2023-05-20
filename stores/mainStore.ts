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
      return atualizarApiBin(get().pessoas, get().despesas);
    },
    alterarDespesa: async (id: number, valor: number, descricao: string) => {
      set((state) => {
        const index = state.despesas.findIndex((d) => d.id === id);
        state.despesas[index].valor = valor;
        state.despesas[index].descricao = descricao;
      });
      return atualizarApiBin(get().pessoas, get().despesas);
    },
    removerDespesa: async (id: number) => {
      set((state) => {
        const index = state.despesas.findIndex((d) => d.id === id);
        state.despesas.splice(index, 1);
      });
      return atualizarApiBin(get().pessoas, get().despesas);
    },
  }))
);

interface IAtualizarApiBin {
  (pessoas: IPessoa[], despesas: IDespesa[]): Promise<boolean>;
}

const atualizarApiBin: IAtualizarApiBin = async (pessoas, despesas) => {
  const apiPassword = process.env.API_PASSWORD;
  const apiBinKey = process.env.API_BIN_KEY;
  if (!apiPassword || !apiBinKey) {
    throw new Error("API_PASSWORD ou API_BIN_KEY não definidos");
  }
  let completeData = {
    pessoas,
    despesas,
  };
  const res = await fetch("https://json.extendsclass.com/bin/apiBinKey", {
    method: "PUT",
    headers: {
      "Security-key": apiPassword,
    },
    body: JSON.stringify(completeData),
  });
  const response = await res.json();
  console.log("response :>> ", response);
  if (!res.ok) {
    return false;
  }
  return true;
};
