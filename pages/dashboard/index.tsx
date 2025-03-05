import { useEffect } from 'react'
import MostrarDespesas from '../../components/mostrar_despesas'
import MostrarDivisao from '../../components/mostrar_divisao'
import MostrarPessoas from '../../components/mostrar_pessoas'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { IPessoa, IDespesa, mainStore } from '../../stores/pessoa_e_despesa'
import prisma from '../../prisma/db'

export type jsonBinType = {
  pessoas: Array<IPessoa>;
  despesas: Array<IDespesa>;
}

export const getServerSideProps: GetServerSideProps = async () => {


  let pessoasProp = await prisma.pessoa.findMany({ orderBy: { nome: 'asc' } });
  let despesasProp = await prisma.despesa.findMany({ orderBy: { descricao: 'asc' } });

  return {
    props: {
      pessoasProp,
      despesasProp
    }
  }
}


export default function Home({
  pessoasProp,
  despesasProp
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const popularDespesas = mainStore((state) => state.popularDespesas);
  const popularPessoas = mainStore((state) => state.popularPessoas);
  useEffect(() => {
    popularDespesas(despesasProp);
    popularPessoas(pessoasProp);
  }, [despesasProp, pessoasProp, popularDespesas, popularPessoas])

  if (!pessoasProp) {
    return <div>Tem algo errado</div>
  }
  return (
    <Container fluid >
      <Row >
        <Col sm={12} md={6}><MostrarDespesas /></Col>
        <Col sm={12} md={6}>
          <Row>
            <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} sm={12} md={6}><MostrarDivisao /></Col>
            <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} sm={12} md={6}><MostrarPessoas /></Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
