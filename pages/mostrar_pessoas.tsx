// pages/mostrar_pessoas.tsx (ou onde estiver)

import { useState } from "react";
import { Button, Card, ListGroup, Spinner, Modal, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { IPessoa } from "@/types";
import { DivisaoCalculada } from "../lib/calculations"; // Importe o tipo da divisão

// 1. DEFINA AS PROPS CORRETAS
interface MostrarPessoasProps {
  pessoas: IPessoa[];
  divisaoCalculada: DivisaoCalculada[];
  onAdicionarPessoa: (data: Omit<IPessoa, 'id'>) => Promise<boolean>;
  onAlterarPessoa: (data: IPessoa) => Promise<boolean>;
  onRemoverPessoa: (id: number) => Promise<boolean>;
}

type FormDataType = Omit<IPessoa, 'id'> & { id: number | null };

const initialFormData: FormDataType = {
  id: null,
  nome: '',
  salario: 0,
  valorAlimentacao: 0,
  porcentagemTaxaInss: 0,
  porcentagemTaxaAlimentacao: 0,
  porcentagemTaxaPassagem: 0,
};

export default function MostrarPessoas({
  pessoas,
  divisaoCalculada,
  onAdicionarPessoa,
  onAlterarPessoa,
  onRemoverPessoa
}: MostrarPessoasProps) {

  // 2. REMOVA TODAS AS CHAMADAS AO ZUSTAND
  // const pessoas = mainStore(...); etc. -> TUDO REMOVIDO

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);

  const handleShow = (id: number | null) => {
    if (id) {
      const pessoa = pessoas.find((p) => p.id === id);
      if (pessoa) setFormData(pessoa);
    } else {
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleSave = async () => {
    setIsLoading(true);
    let resultado = false;

    if (formData.id === null) {
      // Para adicionar, removemos o 'id' do objeto
      const { id, ...pessoaData } = formData;
      resultado = await onAdicionarPessoa(pessoaData);
    } else {
      // Para alterar, o objeto já tem o formato IPessoa
      resultado = await onAlterarPessoa(formData as IPessoa);
    }

    if (!resultado) {
      alert('Erro ao salvar os dados da pessoa');
    } else {
      handleClose();
      setShowToastSuccess(true);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    const resultado = await onRemoverPessoa(id);
    if (!resultado) {
      alert('Erro ao excluir a pessoa');
    } else {
      setShowToastSuccess(true);
    }
    setIsDeleting(null);
  };

  const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div>
      <h1>Salários</h1>
      <Button variant="success" className="mb-2" onClick={() => handleShow(null)}>Adicionar Pessoa</Button>
      {pessoas && pessoas.map((pessoa) => {
        // 3. USE A PROP 'divisaoCalculada' EM VEZ DA STORE
        const valores = divisaoCalculada.find((v) => v.nomePessoa === pessoa.nome);
        if (!valores) return null; // Retorna nulo se não encontrar (mais seguro)

        const { salarioLiquido } = valores;

        return (
          <Card className="mb-3" key={pessoa.id} style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                {pessoa.nome}
                <div>
                  <Button size='sm' className="me-2" onClick={() => handleShow(pessoa.id)}>Editar</Button>
                  <Button variant="danger" size='sm' disabled={isDeleting === pessoa.id} onClick={() => handleDelete(pessoa.id)}>
                    {isDeleting === pessoa.id ? <Spinner as="span" animation="border" size="sm" /> : 'Excluir'}
                  </Button>
                </div>
              </Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>Salário Bruto: {formatacao.format(pessoa.salario)}</ListGroup.Item>
              <ListGroup.Item>Alimentação: {formatacao.format(pessoa.valorAlimentacao)}</ListGroup.Item>
              {/* O cálculo do valor do INSS e Passagem pode ser feito na hora ou vir da prop `divisaoCalculada` se você adicionar lá */}
              <ListGroup.Item>Salário líquido: {formatacao.format(salarioLiquido)}</ListGroup.Item>
            </ListGroup>
          </Card>
        );
      })}

      {/* O Modal continua quase igual, só precisa usar o `formData` */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id === null ? "Nova Pessoa" : "Alterar Pessoa"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
            </Form.Group>
            {/* Adicione os outros campos do formulário aqui, seguindo o padrão acima */}
            <Form.Group className="mb-2" controlId="formSalario">
              <Form.Label>Salário</Form.Label>
              <Form.Control type="number" value={formData.salario} onChange={(e) => setFormData({ ...formData, salario: Number(e.target.value) })} />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formAlimentacao">
              <Form.Label>Alimentação</Form.Label>
              <Form.Control type="number" value={formData.valorAlimentacao} onChange={(e) => setFormData({ ...formData, valorAlimentacao: Number(e.target.value) })} />
            </Form.Group>
            {/* ... etc para todos os campos ... */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fechar</Button>
          <Button disabled={isLoading} variant="primary" onClick={handleSave}>
            {isLoading ? (<><Spinner as="span" animation="grow" size="sm" /> Gravando...</>) : 'Gravar'}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast bg='success' onClose={() => setShowToastSuccess(false)} show={showToastSuccess} delay={3000} autohide >
          <Toast.Header> <strong className="me-auto">Sucesso!</strong> </Toast.Header>
          <Toast.Body className="text-white">Informações foram gravadas</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}