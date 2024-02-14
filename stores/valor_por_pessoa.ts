import { derive } from "derive-zustand";
import { IPessoa, mainStore } from "./pessoa_e_despesa";
import { useStore } from "zustand";

interface ValoresPorPessoa {
  nomePessoa: string;
  porcentagem: number;
  valor: number;
  valorQueSobra: number;

  inssValor: number;
  passagemValor: number;

  salarioLiquido: number;
}

const valoresPorPessoaStore = derive<ValoresPorPessoa[]>((get) => {
  const pessoas = get(mainStore).pessoas;
  const despesas = get(mainStore).despesas;
  const totalDespesas = despesas.reduce((acc, despesa) => {
    return acc + despesa.valor;
  }, 0);

  const totalReceitas = pessoas.reduce((acc, pessoa) => {
    const salarioLiquido = getSalarioLiquido(pessoa);
    return acc + salarioLiquido;
  }, 0);

  return pessoas.map((pessoa) => {
    const salarioLiquido = getSalarioLiquido(pessoa);
    const porcentagem = Number((salarioLiquido / totalReceitas).toFixed(2));
    const valor = Number(totalDespesas * porcentagem);
    const valorQueSobra = salarioLiquido - valor;
    const inssValor = getValorTaxaInss(pessoa);
    const passagemValor = getValorTaxaPassagem(pessoa);
    return {
      porcentagem,
      valor,
      valorQueSobra,
      inssValor,
      passagemValor,
      porcentagemTaxaPassagem: pessoa.porcentagemTaxaPassagem,
      nomePessoa: pessoa.nome,
      salarioLiquido,
    };
  });
});

function getSalarioLiquido(pessoa: IPessoa) {
  let valorTaxaPassagem = getValorTaxaPassagem(pessoa);
  let valorTaxaAlimentacao = getValorTaxaAlimentacao(pessoa);
  let valorTaxaInss = getValorTaxaInss(pessoa);

  return (
    pessoa.salario -
    valorTaxaInss -
    valorTaxaPassagem -
    valorTaxaAlimentacao +
    pessoa.valorAlimentacao
  );
}

function getValorTaxaInss({ salario, porcentagemTaxaInss }: IPessoa) {
  let valorTaxaInss = 0;
  if (porcentagemTaxaInss > 0) {
    valorTaxaInss = (salario / 100) * porcentagemTaxaInss - 19.8;
  }
  return valorTaxaInss;
}

function getValorTaxaPassagem({ salario, porcentagemTaxaPassagem }: IPessoa) {
  let valorTaxaPassagem = 0;
  if (porcentagemTaxaPassagem > 0) {
    valorTaxaPassagem = (salario / 100) * porcentagemTaxaPassagem - 19.8;
  }
  return valorTaxaPassagem;
}

function getValorTaxaAlimentacao({
  salario,
  porcentagemTaxaAlimentacao,
}: IPessoa) {
  let valorTaxaAlimentacao = 0;
  if (porcentagemTaxaAlimentacao > 0) {
    valorTaxaAlimentacao = (salario / 100) * porcentagemTaxaAlimentacao;
  }
  return valorTaxaAlimentacao;
}

export const useValorPorPessoaStore = <T>(
  selector: (state: ValoresPorPessoa[]) => T
) => useStore(valoresPorPessoaStore, selector);
