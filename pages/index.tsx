import { useEffect } from 'react'
import MostrarDespesas from '../components/mostrar_despesas'
import MostrarDivisao from '../components/mostrar_divisao'
import MostrarPessoas from '../components/mostrar_pessoas'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { IPessoa, IDespesa, mainStore } from '../stores/pessoa_e_despesa'
import prisma from '../prisma/db'

export type jsonBinType = {
  pessoas: Array<IPessoa>;
  despesas: Array<IDespesa>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const jsonBin = {
    "pessoas": [
      {
        "porcentagemTaxaInss": 9,
        "porcentagemTaxaAlimentacao": 0,
        "porcentagemTaxaPassagem": 6,
        "nome": "Alan",
        "salario": 2043,
        "valorAlimentacao": 240
      },
      {
        "porcentagemTaxaInss": 9,
        "porcentagemTaxaAlimentacao": 0,
        "porcentagemTaxaPassagem": 6,
        "nome": "Thales",
        "salario": 1600,
        "valorAlimentacao": 240
      },
      {
        "porcentagemTaxaInss": 0,
        "porcentagemTaxaAlimentacao": 0,
        "porcentagemTaxaPassagem": 0,
        "nome": "Winer",
        "salario": 1320,
        "valorAlimentacao": 0
      }
    ],
    "despesas": [
      {
        "valor": 500,
        "descricao": "Compra do mês"
      },
      {
        "valor": 520,
        "descricao": "Carne"
      },
      {
        "valor": 520,
        "descricao": "Pra semana"
      },
      {
        "valor": 99.9,
        "descricao": "Internet (com juros)"
      },
      {
        "valor": 227.04,
        "descricao": "Cemig"
      },
      {
        "valor": 60,
        "descricao": "Plano saúde mamãe"
      },
      {
        "valor": 122.36,
        "descricao": "Copasa"
      },
      {
        "valor": 22,
        "descricao": "Plano funerário"
      },
      {
        "valor": 19.9,
        "descricao": "IPTV"
      }
    ]
  }


  let pessoasProp = await prisma.pessoa.findMany({ orderBy: { nome: 'asc' } });
  let despesasProp = await prisma.despesa.findMany({ orderBy: { descricao: 'asc' } });
  if (pessoasProp.length === 0) {
    console.log('criando as pessoas no banco de dados...')
    for (let i = 0; i < jsonBin.pessoas.length; i++) {
      await prisma.pessoa.create({
        data: jsonBin.pessoas[i]
      })
    }
    pessoasProp = await prisma.pessoa.findMany({ orderBy: { nome: 'asc' } });
  }
  if (despesasProp.length === 0) {
    console.log('criando as despesas no banco de dados...')
    for (let i = 0; i < jsonBin.despesas.length; i++) {
      await prisma.despesa.create({
        data: jsonBin.despesas[i]
      })
    }
    despesasProp = await prisma.despesa.findMany({ orderBy: { descricao: 'asc' } });
  }

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
