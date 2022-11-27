import { use, useEffect, useState } from "react"

interface propsType {
  despesas: Array<despesasType>;
  pessoas: Array<pessoasType>;
}


type pessoasType = {
  nome: string;
  salario: number;
  alimentacao: number;
  inss: number;
}

type despesasType = {
  id: number;
  valor: number;
  descricao: string;
}

type valorPorPessoa = {
  nome: string;
  valor: number;
}

export default function MostrarDivisao({ despesas, pessoas }: propsType) {
  const [valorPorPessoa, setValorPorPessoa] = useState<Array<valorPorPessoa>>([]);

  useEffect(() => {
    console.log('despesas', despesas)
    console.log('pessoas', pessoas)

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
      return { nome: pessoa.nome, valor }
    }))
  }, [despesas, pessoas])


  return (
    <div style={{ width: '30vw', display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center' }} >
      <h1>Divisão</h1>
      <ul>
        {valorPorPessoa.map(pessoa => (
          <li key={pessoa.nome}>
            <p>Nome: {pessoa.nome}</p>
            <p>Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(pessoa.valor.toFixed(0)))}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}