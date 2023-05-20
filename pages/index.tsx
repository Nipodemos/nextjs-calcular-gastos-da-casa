import { useEffect } from 'react'
import MostrarDespesas from '../components/mostrar_despesas'
import MostrarDivisao from '../components/mostrar_divisao'
import MostrarPessoas from '../components/mostrar_pessoas'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { GetServerSideProps } from 'next'
import { IPessoa, IDespesa, mainStore } from '../stores/mainStore'

export type jsonBinType = {
  pessoas: Array<IPessoa>;
  despesas: Array<IDespesa>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const apiPassword = process.env.API_PASSWORD;
  const apiBinKey = process.env.API_BIN_KEY;
  if (!apiPassword || !apiBinKey) {
    throw new Error("API_PASSWORD ou API_BIN_KEY não definidos");
  }
  const res = await fetch('https://json.extendsclass.com/bin/' + apiBinKey, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Security-key': apiPassword
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
  const popularDespesas = mainStore((state) => state.popularDespesas);
  const popularPessoas = mainStore((state) => state.popularPessoas);
  useEffect(() => {
    console.log('jsonBin :>> ', jsonBin);
    popularDespesas(jsonBin.despesas);
    popularPessoas(jsonBin.pessoas);
  }, [jsonBin, popularDespesas, popularPessoas])

  if (!jsonBin.pessoas) {
    return <div>Tem algo errado</div>
  }
  return (
    <Container fluid >
      <Row >
        <Col sm={6}><MostrarDespesas /></Col>
        <Col sm={3}><MostrarDivisao /></Col>
        <Col sm={3}><MostrarPessoas /></Col>
      </Row>
    </Container>
  )
}
