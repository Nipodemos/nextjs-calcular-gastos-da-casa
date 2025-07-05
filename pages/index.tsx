// pages/index.tsx

import { useState } from 'react';
import MostrarDespesas from './mostrar_despesas';
import MostrarPessoas from './mostrar_pessoas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { verify } from 'jsonwebtoken';
import { IPessoa, IDespesa } from '@/types';
import prisma from '../prisma/db';
import { calcularDivisao } from '../lib/calculations';
import * as api from '../lib/api';
import { Alert } from 'react-bootstrap';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.auth_token;
  const SECRET_KEY = process.env.JWT_SECRET;

  const redirectToLogin = {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };

  if (!SECRET_KEY) {
    console.error("ERRO: JWT_SECRET não está definido no arquivo .env.local");
    return redirectToLogin;
  }

  if (!token) {
    return redirectToLogin;
  }

  try {
    verify(token, SECRET_KEY);

    let pessoasProp = await prisma.pessoa.findMany({ orderBy: { nome: 'asc' } });
    let novoPessoasProp = pessoasProp.map((pessoa) => {
      return {
        ...pessoa,
        salario: pessoa.salario.toNumber(),
        valorAlimentacao: pessoa.valorAlimentacao.toNumber(),
        porcentagemTaxaInss: pessoa.porcentagemTaxaInss.toNumber(),
        porcentagemTaxaAlimentacao: pessoa.porcentagemTaxaAlimentacao.toNumber(),
        porcentagemTaxaPassagem: pessoa.porcentagemTaxaPassagem.toNumber(),
      }
    })

    let despesasProp = await prisma.despesa.findMany({ orderBy: { descricao: 'asc' } });
    let novoDespesasProp = despesasProp.map((despesa) => {
      return {
        ...despesa,
        valor: despesa.valor.toNumber(),
      }
    })


    return {
      props: {
        pessoasProp: novoPessoasProp,
        despesasProp: novoDespesasProp,
      }
    }
  } catch (error) {
    console.error("Erro de autenticação, token inválido:", (error as Error).message);
    return redirectToLogin;
  }
};

export default function Home({
  pessoasProp,
  despesasProp
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [pessoas, setPessoas] = useState<IPessoa[]>(pessoasProp);
  const [despesas, setDespesas] = useState<IDespesa[]>(despesasProp);


  const handleAdicionarDespesa = async (valor: number, descricao: string) => {
    const novaDespesa = await api.adicionarDespesa(valor, descricao);
    if (novaDespesa) {
      setDespesas(prev => [...prev, novaDespesa].sort((a, b) => a.descricao.localeCompare(b.descricao)));
      return true;
    }
    return false;
  };
  const handleAdicionarPessoa = async (pessoa: Omit<IPessoa, 'id'>) => {
    const novaPessoa = await api.adicionarPessoa(pessoa);
    if (novaPessoa) {
      setPessoas(prev => [...prev, novaPessoa].sort((a, b) => a.nome.localeCompare(b.nome)));
      return true;
    }
    return false;
  };

  const handleAlterarDespesa = async (id: number, valor: number, descricao: string) => {
    const despesaAlterada = await api.alterarDespesa(id, valor, descricao);
    if (despesaAlterada) {
      setDespesas(prev => prev.map(d => d.id === id ? despesaAlterada : d));
      return true;
    }
    return false;
  };
  const handleAlterarPessoa = async (pessoa: IPessoa) => {
    const pessoaAlterada = await api.alterarPessoa(pessoa);
    if (pessoaAlterada) {
      setPessoas(prev => prev.map(d => d.id === pessoa.id ? pessoaAlterada : d));
      return true;
    }
    return false;
  };

  const handleRemoverDespesa = async (id: number) => {
    const sucesso = await api.removerDespesa(id);
    if (sucesso) {
      setDespesas(prev => prev.filter(d => d.id !== id));
      return true;
    }
    return false;
  };

  const handleRemoverPessoa = async (id: number) => {
    const sucesso = await api.removerPessoa(id);
    if (sucesso) {
      setPessoas(prev => prev.filter(p => p.id !== id));
      return true;
    }
    return false;
  }

  const divisaoCalculada = calcularDivisao(pessoas, despesas);
  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const porcentagemContribuicao = divisaoCalculada.length > 0 ? (divisaoCalculada[0].valor / divisaoCalculada[0].salarioLiquido * 100) : 0;

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Dashboard de Despesas da Casa</h1>
          <p className="text-muted">Um resumo financeiro do seu lar.</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Alert variant="primary" className="h-100">
            <Alert.Heading>Total de Despesas</Alert.Heading>
            <p className="fs-2 fw-bold mb-0">{formatter.format(totalDespesas)}</p>
          </Alert>
        </Col>
        <Col md={6}>
          <Alert variant="info" className="h-100">
            <Alert.Heading>Proporção de Contribuição</Alert.Heading>
            <p className="fs-2 fw-bold mb-0">{porcentagemContribuicao.toFixed(2)}%</p>
            <p className="mb-0">Cada pessoa está contribuindo com essa porcentagem do seu salário líquido.</p>
          </Alert>
        </Col>
      </Row>

      <Row >
        <Col lg={7} className="mb-4 mb-lg-0">
          <MostrarDespesas
            despesas={despesas}
            onAdicionarDespesa={handleAdicionarDespesa}
            onAlterarDespesa={handleAlterarDespesa}
            onRemoverDespesa={handleRemoverDespesa}
          />
        </Col>

        <Col lg={5}>
          <MostrarPessoas
            pessoas={pessoas}
            divisaoCalculada={divisaoCalculada}
            onAdicionarPessoa={handleAdicionarPessoa}
            onAlterarPessoa={handleAlterarPessoa}
            onRemoverPessoa={handleRemoverPessoa}
          />
        </Col>
      </Row>
    </Container>
  )
}
