import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import cloneDeep from "lodash/cloneDeep";

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
      const copiaDespesas = cloneDeep(get().despesas);
      copiaDespesas.push(newDespesa);
      let resApi: ResApi = await atualizarApiBin(get().pessoas, copiaDespesas);
      if (resApi.success === true) {
        set((state) => {
          state.despesas.push(newDespesa);
        });
        return true;
      }
      return false;
    },
    alterarDespesa: async (id: number, valor: number, descricao: string) => {
      const copiaDespesas = cloneDeep(get().despesas);
      const index = copiaDespesas.findIndex((d) => d.id === id);
      copiaDespesas[index].valor = valor;
      copiaDespesas[index].descricao = descricao;
      let resApi: ResApi = await atualizarApiBin(get().pessoas, copiaDespesas);
      if (resApi.success) {
        set((state) => {
          const index = state.despesas.findIndex((d) => d.id === id);
          state.despesas[index].valor = valor;
          state.despesas[index].descricao = descricao;
        });
        return true;
      }
      return false;
    },
    removerDespesa: async (id: number) => {
      const copiaDespesas = cloneDeep(get().despesas);
      const index = copiaDespesas.findIndex((d) => d.id === id);
      copiaDespesas.splice(index, 1);
      let resApi: ResApi = await atualizarApiBin(get().pessoas, copiaDespesas);
      if (resApi.success) {
        set((state) => {
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
      const id = Math.floor(Math.random() * Date.now());
      const newPessoa: IPessoa = {
        id,
        nome,
        salario,
        valorAlimentacao,
        porcentagemTaxaInss,
        porcentagemTaxaAlimentacao,
        porcentagemTaxaPassagem,
      };
      const copiaPessoas = cloneDeep(get().pessoas);
      copiaPessoas.push(newPessoa);
      let resApi: ResApi = await atualizarApiBin(copiaPessoas, get().despesas);
      if (resApi.success === true) {
        set((state) => {
          state.pessoas.push(newPessoa);
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
      const copiaPessoas = cloneDeep(get().pessoas);
      const index = copiaPessoas.findIndex((d) => d.id === id);
      copiaPessoas[index].id = id;
      copiaPessoas[index].nome = nome;
      copiaPessoas[index].salario = salario;
      copiaPessoas[index].valorAlimentacao = valorAlimentacao;
      copiaPessoas[index].porcentagemTaxaInss = porcentagemTaxaInss;
      copiaPessoas[index].porcentagemTaxaAlimentacao =
        porcentagemTaxaAlimentacao;
      copiaPessoas[index].porcentagemTaxaPassagem = porcentagemTaxaPassagem;

      let resApi: ResApi = await atualizarApiBin(copiaPessoas, get().despesas);
      if (resApi.success) {
        set((state) => {
          const index = state.despesas.findIndex((d) => d.id === id);
          state.pessoas[index].id = id;
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
      const copiaPessoas = cloneDeep(get().pessoas);
      const index = copiaPessoas.findIndex((p) => p.id === id);
      copiaPessoas.splice(index, 1);
      let resApi: ResApi = await atualizarApiBin(copiaPessoas, get().despesas);
      if (resApi.success) {
        set((state) => {
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
