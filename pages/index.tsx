import { useState } from 'react'
import MostrarDespesas from '../components/mostrar_despesas'
import MostrarDivisao from '../components/mostrar_divisao'
import MostrarPessoas from '../components/mostrar_pessoas'
import styles from '../styles/Home.module.css'

const arrayDespesas = [
  { id: 1, valor: 400, descricao: 'pra comida' },
  { id: 2, valor: 400, descricao: 'pra carne' },
  { id: 3, valor: 520, descricao: 'pra semana' },
  { id: 4, valor: 100, descricao: 'pra conta de internet' },
  { id: 5, valor: 200, descricao: 'cemig' },
  { id: 6, valor: 130, descricao: 'pra copasa' },
];
const arrayPessoas = [
  {
    nome: "Alan",
    salario: 1964,
    alimentacao: 240,
    inss: 0.09,
  },
  {
    nome: "Thales",
    salario: 1410,
    alimentacao: 240,
    inss: 0.09,
  },
  {
    nome: "Winer",
    salario: 1320,
    alimentacao: 202,
    inss: 0.09,
  }
]

export default function Home() {
  const [pessoas, setPessoas] = useState(arrayPessoas);
  const [despesas, setDespesas] = useState(arrayDespesas);
  return (
    <div className={styles.container} >
      <MostrarDespesas despesas={despesas} setDespesas={setDespesas} />
      <MostrarDivisao despesas={despesas} pessoas={pessoas} />
      <MostrarPessoas pessoas={pessoas} setPessoas={setPessoas} />
    </div>
  )
}
