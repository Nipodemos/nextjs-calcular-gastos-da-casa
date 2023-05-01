import { useState } from 'react'
import MostrarDespesas from '../components/mostrar_despesas'
import MostrarDivisao from '../components/mostrar_divisao'
import MostrarPessoas from '../components/mostrar_pessoas'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { GetServerSideProps } from 'next'

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

export type jsonBinType = {
  pessoas: Array<pessoasType>;
  despesas: Array<despesasType>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://json.extendsclass.com/bin/83eeef7011ba', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Security-key': '33561820'
    }
  })
  const jsonBin: jsonBinType = await res.json()
  console.log('jsonBin :>> ', jsonBin);
  return {
    props: {
      jsonBin
    }
  }
}
/*
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
*/

export default function Home({ jsonBin }: { jsonBin: jsonBinType }) {
  console.log('jsonBin :>> ', jsonBin);
  const [pessoas, setPessoas] = useState(jsonBin.pessoas);
  const [despesas, setDespesas] = useState(jsonBin.despesas);
  if (!jsonBin.pessoas) {
    return <div>Tem algo errado</div>
  }
  return (
    <Container fluid >
      <Row >
        <Col sm={6}><MostrarDespesas jsonBin={jsonBin} despesas={despesas} setDespesas={setDespesas} /></Col>
        <Col sm={3}><MostrarDivisao despesas={despesas} pessoas={pessoas} /></Col>
        <Col sm={3}><MostrarPessoas pessoas={pessoas} setPessoas={setPessoas} /></Col>
      </Row>
    </Container>
  )
}
