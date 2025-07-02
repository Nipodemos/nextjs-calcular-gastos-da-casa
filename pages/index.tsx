// pages/index.tsx

import { useState } from 'react'; // Importe o useState
import MostrarDespesas from './mostrar_despesas';
import MostrarDivisao from './mostrar_divisao';
import MostrarPessoas from './mostrar_pessoas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { verify } from 'jsonwebtoken';
import { IPessoa, IDespesa } from '@/types';
import prisma from '../prisma/db';
import { calcularDivisao } from '../lib/calculations';

// 1. IMPORTE AS NOVAS FUNÇÕES DA API
import * as api from '../lib/api';

// getServerSideProps continua exatamente igual. Está perfeito.
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Pega o token do cookie da requisição do navegador
  const token = context.req.cookies.auth_token;
  const SECRET_KEY = process.env.JWT_SECRET;

  // Define um objeto de redirecionamento para não repetir código
  const redirectToLogin = {
    redirect: {
      destination: '/login', // A página de login que criamos
      permanent: false,
    },
  };

  // 1. Verifica se a variável de ambiente do segredo existe. Se não, é um erro de config.
  if (!SECRET_KEY) {
    console.error("ERRO: JWT_SECRET não está definido no arquivo .env.local");
    // Não podemos autenticar sem o segredo, então bloqueamos o acesso.
    return redirectToLogin;
  }

  // 2. Verifica se o cookie com o token existe. Se não, o usuário não está logado.
  if (!token) {
    return redirectToLogin;
  }

  try {
    // 3. Tenta verificar o token. Se for inválido ou expirado, a função 'verify' vai lançar um erro.
    verify(token, SECRET_KEY);

    // 4. Se chegamos aqui, o token é VÁLIDO! O usuário está autenticado.
    // Agora sim, executamos a lógica original de buscar os dados no banco.
    let pessoasProp = await prisma.pessoa.findMany({ orderBy: { nome: 'asc' } });
    let despesasProp = await prisma.despesa.findMany({ orderBy: { descricao: 'asc' } });

    // É uma boa prática serializar os dados para evitar erros com tipos como Date
    return {
      props: {
        pessoasProp: JSON.parse(JSON.stringify(pessoasProp)),
        despesasProp: JSON.parse(JSON.stringify(despesasProp)),
      }
    }
  } catch (error) {
    // 5. Se 'verify' lançou um erro, o token é inválido. Redirecionamos para o login.
    console.error("Erro de autenticação, token inválido:", (error as Error).message);
    return redirectToLogin;
  }
};

export default function Home({
  pessoasProp,
  despesasProp
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  // 2. GERENCIE O ESTADO AQUI, USANDO AS PROPS DO SERVIDOR COMO VALOR INICIAL
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
      setPessoas(prev => [...prev, novaPessoa].sort((a, b) => a.descricao.localeCompare(b.descricao)));
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


  // 4. O CÁLCULO DA DIVISÃO AGORA USA O ESTADO LOCAL, PARA SER REATIVO
  const divisaoCalculada = calcularDivisao(pessoas, despesas);

  return (
    <Container fluid >
      <Row >
        <Col sm={12} md={6}>
          {/* 5. PASSE O ESTADO E OS HANDLERS VIA PROPS */}
          <MostrarDespesas
            despesas={despesas}
            onAdicionarDespesa={handleAdicionarDespesa}
            onAlterarDespesa={handleAlterarDespesa}
            onRemoverDespesa={handleRemoverDespesa}
          />
        </Col>

        <Col sm={12} md={6}>
          <Row>
            <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} sm={12} md={6}>
              <MostrarDivisao divisao={divisaoCalculada} />
            </Col>
            <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} sm={12} md={6}>
              <MostrarPessoas
                pessoas={pessoas}
                divisaoCalculada={divisaoCalculada}
                onAdicionarPessoa={handleAdicionarPessoa}
                onAlterarPessoa={handleAdicionarPessoa}
                onRemoverPessoa={handleRemoverPessoa}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}