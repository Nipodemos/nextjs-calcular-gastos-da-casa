
import { IDespesa, IPessoa } from '@/types';
import { verify } from 'jsonwebtoken';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { Alert, Button, Modal, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import * as api from '../lib/api';
import { calcularDivisao } from '../lib/calculations';
import prisma from '../prisma/db';
import MostrarDespesas from '../components/mostrar_despesas';
import MostrarPessoas from '../components/mostrar_pessoas';
import { Toast, ToastContainer } from 'react-bootstrap';

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
  const [pessoas, setPessoas] = useState<IPessoa[]>(pessoasProp ?? []);
  const [despesas, setDespesas] = useState<IDespesa[]>(despesasProp ?? []);

  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [shareButtonText, setShareButtonText] = useState("Compartilhar Valores");

  // const [showShareModal, setShowShareModal] = useState(false);
  // const [shareMessage, setShareMessage] = useState("");

  const handleShowToastSuccess = () => setShowToastSuccess(true);
  const handleCloseToastSuccess = () => setShowToastSuccess(false);

  const handleAdicionarDespesa = async (valor: number, descricao: string) => {
    console.log('handleAdicionarDespesa', valor, descricao);
    const novaDespesa = await api.adicionarDespesa(valor, descricao);
    if (novaDespesa) {
      setDespesas(prev => [...prev, novaDespesa].sort((a, b) => a.descricao.localeCompare(b.descricao)));
      return true;
    }
    return false;
  };
  const handleAdicionarPessoa = async (pessoa: Omit<IPessoa, 'id'>) => {
    console.log('handleAdicionarPessoa', pessoa);
    const novaPessoa = await api.adicionarPessoa(pessoa);
    if (novaPessoa) {
      setPessoas(prev => [...prev, novaPessoa].sort((a, b) => a.nome.localeCompare(b.nome)));
      return true;
    }
    return false;
  };

  const handleAlterarDespesa = async (id: number, valor: number, descricao: string) => {
    console.log('handleAlterarDespesa', id, valor, descricao);
    const despesaAlterada = await api.alterarDespesa(id, valor, descricao);
    if (despesaAlterada) {
      setDespesas(prev => prev.map(d => d.id === id ? despesaAlterada : d));
      return true;
    }
    return false;
  };
  const handleAlterarPessoa = async (pessoa: IPessoa) => {
    console.log('handleAlterarPessoa', pessoa);
    const pessoaAlterada = await api.alterarPessoa(pessoa);
    if (pessoaAlterada) {
      setPessoas(prev => prev.map(d => d.id === pessoa.id ? pessoaAlterada : d));
      return true;
    }
    return false;
  };

  const handleRemoverDespesa = async (id: number) => {
    console.log('handleRemoverDespesa', id);
    const sucesso = await api.removerDespesa(id);
    if (sucesso) {
      setDespesas(prev => prev.filter(d => d.id !== id));
      return true;
    }
    return false;
  };

  const handleRemoverPessoa = async (id: number) => {
    console.log('handleRemoverPessoa', id);
    const sucesso = await api.removerPessoa(id);
    if (sucesso) {
      setPessoas(prev => prev.filter(p => p.id !== id));
      return true;
    }
    return false;
  }

  const generateShareMessage = () => {
    const messageParts: string[] = [];
    const dataAtual = new Date();
    const mesPorExtenso = dataAtual.toLocaleString('pt-BR', { month: 'long' });
    const anoQuatroDigitos = dataAtual.getFullYear();

    messageParts.push(`*Resumo de Despesas da Casa - ${mesPorExtenso}/${anoQuatroDigitos}*\n`);

    divisaoCalculada.forEach(item => {
      const valorFormatado = formatter.format(item.valor);
      messageParts.push(`*${item.nomePessoa}*: ${valorFormatado}`);
    });

    const totalPessoas = divisaoCalculada.reduce((acc, item) => acc + item.valor, 0);
    messageParts.push(`\n*Despesas da Casa*: ${formatter.format(totalDespesas)}`);
    messageParts.push(`\n*Receita da Casa (Total Pessoas)*: ${formatter.format(totalPessoas)}`);

    return messageParts.join('\n');
  };

  const handleShare = () => {
    const message = generateShareMessage();
    navigator.clipboard.writeText(message);
    // setShowToastSuccess(true); // Removido para o novo comportamento do botão

    setShareButtonText("Copiado!");
    setTimeout(() => {
      setShareButtonText("Compartilhar Valores");
    }, 2000);
  };

  // const handleCloseShareModal = () => setShowShareModal(false);

  // const handleCopyToClipboard = () => {
  //   navigator.clipboard.writeText(shareMessage);
  //   // Opcional: Adicionar um toast de sucesso para copiar
  // };

  const divisaoCalculada = calcularDivisao(pessoas, despesas);
  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const porcentagemContribuicao = divisaoCalculada.length > 0 ? (divisaoCalculada[0].valor / divisaoCalculada[0].salarioLiquido * 100) : 0;

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 d-flex align-items-center">
        <Col xs={12} md={8}>
          <h1 className="fw-bold">Dashboard de Despesas da Casa</h1>
          <p className="text-muted">Um resumo financeiro do seu lar.</p>
        </Col>
        <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
          <Button variant="info" onClick={handleShare} style={{ transition: 'all 0.2s ease-in-out' }}><i className="bi bi-share-fill me-2"></i>{shareButtonText}</Button>
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
            onShowToastSuccess={handleShowToastSuccess}
          />
        </Col>

        <Col lg={5}>
          <MostrarPessoas
            pessoas={pessoas}
            divisaoCalculada={divisaoCalculada}
            onAdicionarPessoa={handleAdicionarPessoa}
            onAlterarPessoa={handleAlterarPessoa}
            onRemoverPessoa={handleRemoverPessoa}
            onShowToastSuccess={handleShowToastSuccess}
          />
        </Col>
      </Row>

      {/* <Modal show={showShareModal} onHide={handleCloseShareModal}>
        <Modal.Header closeButton>
          <Modal.Title>Valores para Compartilhar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="shareMessageTextarea">
            <Form.Label>Copie a mensagem abaixo para compartilhar:</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={shareMessage}
              readOnly
              className="mb-3"
              style={{ resize: 'none' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseShareModal}>Fechar</Button>
          <Button variant="primary" onClick={handleCopyToClipboard}>
            <i className="bi bi-clipboard me-2"></i>Copiar
          </Button>
        </Modal.Footer>
      </Modal> */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast bg='success' onClose={handleCloseToastSuccess} show={showToastSuccess} delay={3000} autohide >
          <Toast.Header> <strong className="me-auto">Sucesso!</strong> </Toast.Header>
          <Toast.Body className="text-white">Operação realizada com sucesso.</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}
