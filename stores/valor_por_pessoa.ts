import { derive } from "derive-zustand";
import { mainStore } from "./pessoa_e_despesa";
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

  const totalReceitas = pessoas.reduce(
    (acc, { salario, alimentacao, inssPorcentagem }) => {
      const passagem = salario * 0.06;
      const inss = salario * inssPorcentagem - 19.8;
      return acc + (salario - inss - passagem + alimentacao);
    },
    0
  );

  return pessoas.map((pessoa) => {
    const inssValor = pessoa.salario * pessoa.inssPorcentagem - 19.8;
    const passagemValor = pessoa.salario * 0.06;
    const receitaPessoa =
      pessoa.salario - inssValor - passagemValor + pessoa.alimentacao;
    const porcentagem = Number((receitaPessoa / totalReceitas).toFixed(2));
    const valor = Number(totalDespesas * porcentagem);
    const valorQueSobra = receitaPessoa - valor;
    const salarioLiquido = pessoa.salario - inssValor - passagemValor;
    return {
      porcentagem,
      valor,
      valorQueSobra,
      inssValor,
      passagemValor,
      nomePessoa: pessoa.nome,
      salarioLiquido,
    };
  });
});

export const useValorPorPessoaStore = <T>(
  selector: (state: ValoresPorPessoa[]) => T
) => useStore(valoresPorPessoaStore, selector);
