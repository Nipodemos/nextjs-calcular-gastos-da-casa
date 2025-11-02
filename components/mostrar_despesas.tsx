

import { IDespesa } from "@/types";
import { useState } from "react";
import { Button, Card, Form, Modal, Spinner, Table } from "react-bootstrap";

interface MostrarDespesasProps {
  despesas: IDespesa[];
  onRemoverDespesa: (id: number) => Promise<boolean>;
  onAlterarDespesa: (id: number, valor: number, descricao: string) => Promise<boolean>;
  onAdicionarDespesa: (valor: number, descricao: string) => Promise<boolean>;
  onShowToastSuccess: () => void;
}

type FormDataType = {
  id: number | null;
  valor: number | string;
  descricao: string;
}

export default function MostrarDespesas({
  despesas,
  onRemoverDespesa,
  onAlterarDespesa,
  onAdicionarDespesa,
  onShowToastSuccess
}: MostrarDespesasProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  // const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    id: null,
    valor: 0,
    descricao: ''
  });

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [despesaToDeleteId, setDespesaToDeleteId] = useState<number | null>(null);

  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);

  const handleClose = () => setShowModal(false);
  const handleShow = (id: number | null) => {
    if (id) {
      const despesa = despesas.find((despesa) => despesa.id === id);
      if (!despesa) {
        console.error("Despesa não encontrada");
        return;
      }
      setFormData({ id: despesa.id, valor: despesa.valor, descricao: despesa.descricao })
    } else {
      setFormData({ id: null, valor: 0, descricao: '' })
    }
    setShowModal(true)
  };

  const handleShowDeleteConfirm = (id: number) => {
    setDespesaToDeleteId(id);
    setShowDeleteConfirmModal(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDespesaToDeleteId(null);
    setShowDeleteConfirmModal(false);
  };

  const handleConfirmDelete = async () => {
    if (despesaToDeleteId !== null) {
      setIsDeleting(despesaToDeleteId);
      const resultado = await onRemoverDespesa(despesaToDeleteId);
      if (resultado) {
        // setShowToastSuccess(true);
        onShowToastSuccess();
      } else {
        alert('Erro ao excluir despesa');
      }
      setIsDeleting(null);
      handleCloseDeleteConfirm();
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    let resultado = false;

    const valorParaSalvar = Number(formData.valor);

    if (formData.id === null) {
      resultado = await onAdicionarDespesa(valorParaSalvar, formData.descricao);
    } else {
      resultado = await onAlterarDespesa(formData.id, valorParaSalvar, formData.descricao);
    }
    if (resultado) {
      handleClose();
      // setShowToastSuccess(true);
      onShowToastSuccess();
    } else {
      alert('Erro ao salvar despesa');
    }
    setIsLoading(false);
  }

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    const resultado = await onRemoverDespesa(id);
    if (resultado) {
      // setShowToastSuccess(true);
      onShowToastSuccess();
    } else {
      alert('Erro ao excluir despesa');
    }
    setIsDeleting(null);
  }

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Despesas do Mês</h4>
          <Button variant="success" onClick={() => handleShow(null)}>
            <i className="bi bi-plus-lg me-2"></i>Adicionar Despesa
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">Descrição</th>
                <th className="text-end">Valor</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {despesas.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-muted p-4">Nenhuma despesa cadastrada.</td>
                </tr>
              )}
              {despesas.map(({ id, valor, descricao }) => (
                <tr key={id}>
                  <td className="ps-3 align-middle">{descricao}</td>
                  <td className={`text-end align-middle ${valor < 0 ? 'text-success' : 'text-danger'}`}>{formatter.format(valor  * -1)}</td>
                  <td className="text-center">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(id)}>Editar</Button>
                    <Button variant="outline-danger" size="sm" type="button" disabled={isDeleting === id} onClick={() => handleShowDeleteConfirm(id)}>
                      {isDeleting === id ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : 'Excluir'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="text-end">
          <span className="me-2">Total:</span>
          <span className="fw-bold fs-5">{formatter.format(totalDespesas)}</span>
        </Card.Footer>
      </Card>

      {/* O Modal e o ToastContainer continuam iguais */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id === null ? "Nova Despesa" : "Alterar Despesa"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formValor">
              <Form.Label>Valor (R$)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ex: 150.50"
                value={formData.valor}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '-') {
                    setFormData((prev) => ({ ...prev, valor: value }));
                  } else {
                    setFormData((prev) => ({ ...prev, valor: Number(value) }));
                  }
                }}
              />
            </Form.Group>
            <Form.Group controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control type="text" placeholder="Ex: Conta de Luz" value={formData.descricao} onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}> Fechar </Button>
          <Button disabled={isLoading} variant="primary" onClick={handleSave}>
            {isLoading ? (<><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Gravando...</>) : 'Gravar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteConfirmModal} onHide={handleCloseDeleteConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja excluir esta despesa?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirm}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting !== null}>
            {isDeleting !== null ? <Spinner as="span" animation="border" size="sm" /> : 'Excluir'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast bg='success' onClose={() => setShowToastSuccess(false)} show={showToastSuccess} delay={3000} autohide >
          <Toast.Header> <strong className="me-auto">Sucesso!</strong> </Toast.Header>
          <Toast.Body className="text-white">Operação realizada com sucesso.</Toast.Body>
        </Toast>
      </ToastContainer> */}
    </>
  )
}
