// pages/mostrar_despesas.tsx (ou onde estiver)

import { useState } from "react";
import { Button, Form, Modal, Row, Spinner, Table, Toast, ToastContainer } from "react-bootstrap";
import { IDespesa } from "@/types"; // Mantenha para o tipo

// 1. CORREÇÃO PRINCIPAL: As funções agora retornam Promise<boolean>
interface MostrarDespesasProps {
  despesas: IDespesa[];
  onRemoverDespesa: (id: number) => Promise<boolean>;
  onAlterarDespesa: (id: number, valor: number, descricao: string) => Promise<boolean>;
  onAdicionarDespesa: (valor: number, descricao: string) => Promise<boolean>;
}

type FormDataType = {
  id: number | null;
  valor: number;
  descricao: string;
}

export default function MostrarDespesas({
  despesas,
  onRemoverDespesa,
  onAlterarDespesa,
  onAdicionarDespesa
}: MostrarDespesasProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    id: null,
    valor: 0,
    descricao: ''
  });

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

  // 2. NENHUMA MUDANÇA NECESSÁRIA AQUI. Agora está correto com os tipos das props.
  const handleSave = async () => {
    setIsLoading(true);
    let resultado = false;

    if (formData.id === null) {
      resultado = await onAdicionarDespesa(formData.valor, formData.descricao);
    } else {
      resultado = await onAlterarDespesa(formData.id, formData.valor, formData.descricao);
    }

    if (!resultado) {
      alert('Erro ao salvar despesa')
    } else {
      handleClose();
      setShowToastSuccess(true);
    }
    setIsLoading(false);
  }

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    const resultado = await onRemoverDespesa(id);
    if (!resultado) {
      alert('Erro ao excluir despesa')
    } else {
      setShowToastSuccess(true)
    }
    setIsDeleting(null);
  }

  const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  // O JSX continua o mesmo.
  return (
    <>
      <h1>Despesas</h1>
      <Button variant="success" className="mb-2" onClick={() => handleShow(null)}>Adicionar Despesa</Button>
      <Table bordered>
        {/* ... sua tabela ... */}
        <thead>
          <tr>
            <th>Valor</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {despesas.map(({ id, valor, descricao }) => (
            <tr key={id}>
              <td>{formatacao.format(valor)}</td>
              <td>{descricao}</td>
              <td>
                <Button className="me-2" onClick={() => handleShow(id)} >Editar</Button>
                <Button variant="danger" type="button" disabled={isDeleting === id} onClick={() => handleDelete(id)}>
                  {isDeleting === id ? (
                    <>
                      <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                      Excluindo...
                    </>
                  ) : 'Excluir'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose}>
        {/* ... seu modal ... */}
        <Modal.Header closeButton>
          <Modal.Title>{formData.id === null ? "Nova Despesa" : "Alterar Despesa"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formValor">
              <Form.Label>Valor</Form.Label>
              <Form.Control type="number" placeholder="Valor" value={formData.valor} onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })} onChange={(e) => setFormData((prev) => ({ ...prev, valor: Number(e.target.value) }))} />
            </Form.Group>

            <Form.Group controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control type="text" placeholder="Descrição" value={formData.descricao} onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))} />
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
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast bg='success' onClose={() => setShowToastSuccess(false)} show={showToastSuccess} delay={3000} autohide >
          <Toast.Header> <strong className="me-auto">Sucesso!</strong> </Toast.Header>
          <Toast.Body className="text-white">Informações foram gravadas</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}