import { useState } from 'react'
import MostrarDespesas from '../components/mostrar_despesas'
import MostrarDivisao from '../components/mostrar_divisao'
import MostrarPessoas from '../components/mostrar_pessoas'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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

type jsonBinType = {
  pessoas: Array<pessoasType>;
  despesas: Array<despesasType>;
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   const res = await fetch('https://json.extendsclass.com/bin/83eeef7011ba')
//   const jsonBin: jsonBinType = await res.json()
//   return {
//     props: {
//       jsonBin
//     }
//   }
// }

const arrayDespesas = [
  { id: 1, valor: 500, descricao: 'pra comida' },
  { id: 2, valor: 400, descricao: 'pra carne' },
  { id: 3, valor: 640, descricao: 'pra semana' },
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
    <Container fluid >
      <Row >
        <Col sm={6}><MostrarDespesas despesas={despesas} setDespesas={setDespesas} /></Col>
        <Col sm={3}><MostrarDivisao despesas={despesas} pessoas={pessoas} /></Col>
        <Col sm={3}><MostrarPessoas pessoas={pessoas} setPessoas={setPessoas} /></Col>

      </Row>
    </Container>
  )
}
