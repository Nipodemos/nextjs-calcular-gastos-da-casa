import { use, useEffect, useState } from "react"
import { mainStore } from "../stores/mainStore";

type valorPorPessoa = {
  nome: string;
  valor: number;
  salario: number;
}

export default function MostrarDivisao() {
  const despesas = mainStore((state) => state.despesas)
  const pessoas = mainStore((state) => state.pessoas)
  const [valorPorPessoa, setValorPorPessoa] = useState<Array<valorPorPessoa>>([]);

  useEffect(() => {

    const totalDespesas = despesas.reduce((acc, despesa) => {
      return acc + despesa.valor
    }, 0)

    const totalReceitas = pessoas.reduce((acc, pessoa) => {
      return acc + pessoa.salario - (pessoa.salario * pessoa.inss) + pessoa.alimentacao
    }, 0)


    setValorPorPessoa(pessoas.map(pessoa => {
      const receitaPessoa = pessoa.salario - (pessoa.salario * pessoa.inss) + pessoa.alimentacao
      const porcentagem = receitaPessoa / totalReceitas
      console.log('\n\n\n---\npessoa.nome :>> ', pessoa.nome);
      console.log('totalDespesas :>> ', totalDespesas);
      console.log('totalReceitas :>> ', totalReceitas);
      console.log('receitaPessoa :>> ', receitaPessoa);
      console.log('porcentagem :>> ', porcentagem.toFixed(2));
      const valor = Number(totalDespesas * porcentagem)
      console.log('valor :>> ', valor);
      return { nome: pessoa.nome, valor, salario: pessoa.salario }
    }))
  }, [despesas, pessoas])


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center' }} >
      <h1>Divisão</h1>
      <ul>
        {valorPorPessoa.map(pessoa => (
          <li key={pessoa.nome}>
            <p>Nome: {pessoa.nome}</p>
            <p>Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(pessoa.valor.toFixed(0)))}</p>
            <p>Sobra: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number((pessoa.salario - pessoa.valor).toFixed(0)))}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}