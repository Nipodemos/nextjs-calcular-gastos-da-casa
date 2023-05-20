import { mainStore } from "../stores/mainStore";


export default function MostrarPessoas() {
  const pessoas = mainStore((state) => state.pessoas)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }} >

      <h1>Salários</h1>
      <ul>
        {pessoas.map(({ nome, salario, alimentacao, inss }) => {
          const total = salario - (salario * inss) + alimentacao
          const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
          return (
            <li key={nome}>
              <p>Nome: {nome}</p>
              <p>Salário: {formatacao.format(salario)}</p>
              <p>Alimentação: {formatacao.format(alimentacao)}</p>
              <p>INSS: {inss * 100}%</p>
              <p>Total: {formatacao.format(total)}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}