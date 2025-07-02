import { useEffect } from 'react';
import MostrarDespesas from '../../components/mostrar_despesas';
import MostrarDivisao from '../../components/mostrar_divisao';
import MostrarPessoas from '../../components/mostrar_pessoas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { verify } from 'jsonwebtoken';
import { IPessoa, IDespesa, mainStore } from '../../stores/pessoa_e_despesa';
import prisma from '../../prisma/db';

// Este tipo não precisa mudar
export type jsonBinType = {
  pessoas: Array<IPessoa>;
  despesas: Array<IDespesa>;
}

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
}

export default function Home({
  pessoasProp,
  despesasProp
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const popularDespesas = mainStore((state) => state.popularDespesas);
  const popularPessoas = mainStore((state) => state.popularPessoas);

  useEffect(() => {
    // Este useEffect só vai rodar se getServerSideProps retornar os dados com sucesso.
    if (pessoasProp && despesasProp) {
      popularDespesas(despesasProp);
      popularPessoas(pessoasProp);
    }
  }, [despesasProp, pessoasProp, popularDespesas, popularPessoas])

  // Esta verificação pode até ser removida, pois getServerSideProps nunca
  // retornará props vazias, ele sempre redirecionará antes.
  if (!pessoasProp) {
    // Teoricamente, esta parte do código nunca será alcançada.
    return <div>Carregando...</div>
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