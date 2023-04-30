import { useEffect, useState } from "react";

interface propsType {
  pessoas: Array<pessoasType>;
  setPessoas: Function;
}

type pessoasType = {
  nome: string;
  salario: number;
  alimentacao: number;
  inss: number;
}

export default function MostrarPessoas({ pessoas, setPessoas }: propsType) {

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