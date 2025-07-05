import { useState } from "react";
import { Button, Card, ListGroup, Spinner, Modal, Form, Row, Toast, ToastContainer, Col, Badge } from "react-bootstrap";
import { IPessoa } from "@/types";
import { DivisaoCalculada } from "../lib/calculations";

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
      const { id, ...pessoaData } = formData;
      resultado = await onAdicionarPessoa(pessoaData);
    } else {
      resultado = await onAlterarPessoa(formData as IPessoa);
    }
    if (resultado) {
      handleClose();
      setShowToastSuccess(true);
    } else {
      alert('Erro ao salvar os dados da pessoa');
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    const resultado = await onRemoverPessoa(id);
    if (resultado) {
      setShowToastSuccess(true);
    } else {
      alert('Erro ao excluir a pessoa');
    }
    setIsDeleting(null);
  };

  const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Pessoas e Salários</h4>
          <Button variant="success" onClick={() => handleShow(null)}>
            <i className="bi bi-person-plus-fill me-2"></i>Adicionar Pessoa
          </Button>
        </Card.Header>
        <Card.Body>
          {pessoas.length === 0 && (
            <div className="text-center text-muted p-4">Nenhuma pessoa cadastrada.</div>
          )}
          {pessoas.map((pessoa) => {
            const valores = divisaoCalculada.find((v) => v.nomePessoa === pessoa.nome);
            if (!valores) return null;

            const { salarioLiquido, valor, valorQueSobra, porcentagem } = valores;

            return (
              <Card className="mb-3" key={pessoa.id}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5">{pessoa.nome}</span>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(pessoa.id)}>Editar</Button>
                    <Button variant="outline-danger" size="sm" disabled={isDeleting === pessoa.id} onClick={() => handleDelete(pessoa.id)}>
                      {isDeleting === pessoa.id ? <Spinner as="span" animation="border" size="sm" /> : 'Excluir'}
                    </Button>
                  </div>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span>Valor a pagar:</span>
                    <span className="fw-bold text-danger">{formatacao.format(valor)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span>Sobra do Salário:</span>
                    <span className="fw-bold text-success">{formatacao.format(valorQueSobra)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center text-muted">
                    <span>Salário Líquido:</span>
                    <span>{formatacao.format(salarioLiquido)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center text-muted">
                    <span>Contribuição (% Renda):</span>
                    <Badge bg="secondary" pill>{(porcentagem * 100).toFixed(2)}%</Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            );
          })}
        </Card.Body>
      </Card>

      {/* O Modal e o ToastContainer continuam iguais */}
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
            <Row>
              <Col>
                <Form.Group className="mb-2" controlId="formSalario">
                  <Form.Label>Salário Bruto</Form.Label>
                  <Form.Control type="number" value={formData.salario} onChange={(e) => setFormData({ ...formData, salario: Number(e.target.value) })} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2" controlId="formAlimentacao">
                  <Form.Label>Vale Alimentação</Form.Label>
                  <Form.Control type="number" value={formData.valorAlimentacao} onChange={(e) => setFormData({ ...formData, valorAlimentacao: Number(e.target.value) })} />
                </Form.Group>
              </Col>
            </Row>
            {/* Adicionei os campos que faltavam no formulário */}
            <Row>
              <Col><Form.Group className="mb-2" controlId="formInss"><Form.Label>Taxa INSS (%)</Form.Label><Form.Control type="number" value={formData.porcentagemTaxaInss} onChange={(e) => setFormData({ ...formData, porcentagemTaxaInss: Number(e.target.value) })} /></Form.Group></Col>
              <Col><Form.Group className="mb-2" controlId="formTaxaAlim"><Form.Label>Taxa Aliment. (%)</Form.Label><Form.Control type="number" value={formData.porcentagemTaxaAlimentacao} onChange={(e) => setFormData({ ...formData, porcentagemTaxaAlimentacao: Number(e.target.value) })} /></Form.Group></Col>
              <Col><Form.Group className="mb-2" controlId="formTaxaPass"><Form.Label>Taxa Passag. (%)</Form.Label><Form.Control type="number" value={formData.porcentagemTaxaPassagem} onChange={(e) => setFormData({ ...formData, porcentagemTaxaPassagem: Number(e.target.value) })} /></Form.Group></Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Fechar</Button>
          <Button disabled={isLoading} variant="primary" onClick={handleSave}>
            {isLoading ? (<><Spinner as="span" animation="grow" size="sm" /> Gravando...</>) : 'Gravar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast bg='success' onClose={() => setShowToastSuccess(false)} show={showToastSuccess} delay={3000} autohide >
          <Toast.Header> <strong className="me-auto">Sucesso!</strong> </Toast.Header>
          <Toast.Body className="text-white">Operação realizada com sucesso.</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
