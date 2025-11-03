// Importe apenas os TIPOS que você precisa
import { IPessoa, IDespesa } from "@/types";

// Este é o tipo do resultado que vamos gerar
export interface DivisaoCalculada {
  nomePessoa: string;
  porcentagem: number;
  valor: number;
  valorQueSobra: number;
  salarioLiquido: number;
}

// Esta é a nossa função de cálculo principal e pura
export function calcularDivisao(
  pessoas: IPessoa[],
  despesas: IDespesa[]
): DivisaoCalculada[] {
  if (!pessoas || pessoas.length === 0) {
    return []; // Retorna vazio se não houver pessoas para evitar erros de divisão por zero
  }

  const totalDespesas = despesas.reduce(
    (acc, despesa) => acc + despesa.valor,
    0
  );

  const totalReceitas = pessoas.reduce((acc, pessoa) => {
    const salarioLiquido = getSalarioLiquido(pessoa);
    return acc + salarioLiquido;
  }, 0);

  // Evita divisão por zero se a receita total for 0
  if (totalReceitas === 0) {
    return pessoas.map((p) => ({
      nomePessoa: p.nome,
      porcentagem: 0,
      valor: 0,
      valorQueSobra: getSalarioLiquido(p),
      salarioLiquido: getSalarioLiquido(p),
    }));
  }

  return pessoas.map((pessoa) => {
    const salarioLiquido = getSalarioLiquido(pessoa);
    const porcentagem = salarioLiquido / totalReceitas;
    const valor = totalDespesas * porcentagem;
    const valorQueSobra = salarioLiquido - valor;

    return {
      nomePessoa: pessoa.nome,
      porcentagem,
      valor,
      valorQueSobra,
      salarioLiquido,
    };
  });
}

// As funções auxiliares continuam as mesmas
export function getSalarioLiquido(pessoa: IPessoa): number {
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
  // ... (código idêntico ao que você tinha)
  let valorTaxaInss = 0;
  if (porcentagemTaxaInss > 0) {
    valorTaxaInss = (salario / 100) * porcentagemTaxaInss - 19.8;
  }
  return valorTaxaInss;
}

// ... (cole as outras funções getValorTaxa... aqui também)
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
