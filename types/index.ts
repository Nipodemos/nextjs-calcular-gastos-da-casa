// types/index.ts

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
