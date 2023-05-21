import { Dispatch, SetStateAction, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner, Table, Toast, ToastContainer } from "react-bootstrap";
import { jsonBinType } from "../pages";
import { mainStore } from "../stores/mainStore";


type FormDataType = {
  id: number | null;
  valor: number;
  descricao: string;
}

export default function MostrarDespesas() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    id: null,
    valor: 0,
    descricao: ''
  });
  const despesas = mainStore((state) => state.despesas)
  const adicionarDespesa = mainStore((state) => state.adicionarDespesa);
  const alterarDespesa = mainStore((state) => state.alterarDespesa);
  const removerDespesa = mainStore((state) => state.removerDespesa);

  const handleClose = () => setShowModal(false);
  const handleShow = (id: number | null) => {
    if (id) {
      const despesa = despesas.find((despesa) => despesa.id === id);
      if (!despesa) {
        throw new Error("Despesa não encontrada");
      }
      setFormData({ id: despesa.id, valor: despesa.valor, descricao: despesa.descricao })
    } else {
      setFormData({ id: null, valor: 0, descricao: '' })
    }
    setShowModal(true)
  };
  const handleSave = async () => {
    setIsLoading(true);
    let resultado = false;
    if (formData.id === null) {
      resultado = await adicionarDespesa(formData.valor, formData.descricao);
    } else {
      resultado = await alterarDespesa(formData.id, formData.valor, formData.descricao);
    }

    if (!resultado) {
      alert('Erro ao salvar despesa')
    }
    else {
      setShowModal(false)
      setShowToastSuccess(true)
      setFormData({ id: null, valor: 0, descricao: '' })
    }
    setIsLoading(false);
  }

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    let resultado = await removerDespesa(id);
    if (!resultado) {
      alert('Erro ao excluir despesa')
    }
    else {
      setShowToastSuccess(true)
    }
    setIsLoading(false);
  }

  const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <>
      <Row >
        <Col>
          <h1>Despesas</h1>
          <Button variant="success" style={{ marginBottom: '8px' }} onClick={() => handleShow(null)}>Adicionar Despesa</Button>
          <Table bordered>
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
                    <Button style={{ marginRight: '8px' }} onClick={() => handleShow(id)} >Editar</Button>
                    <Button variant="danger" type="button" disabled={isDeleting === id} onClick={() => handleDelete(id)}>
                      {isDeleting === id ? (
                        <>
                          <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          Excluindo...
                        </>
                      ) : 'Excluir'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id === null ? "Nova Despesa" : "Alterar Despesa"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Form>
              <Form.Group controlId="formValor">
                <Form.Label>Valor</Form.Label>
                <Form.Control type="number" placeholder="Valor" value={formData.valor} onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })} />
              </Form.Group>

              <Form.Group controlId="formDescricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control type="text" placeholder="Descrição" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
              </Form.Group>
            </Form>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button disabled={isLoading} variant="primary" onClick={handleSave}>
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Gravando...
              </>
            ) : 'Gravar'}

          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast bg='success' onClose={() => setShowToastSuccess(false)} show={showToastSuccess} delay={7000} autohide >
          <Toast.Header>
            <strong className="me-auto">Sucesso!</strong>
          </Toast.Header>
          <Toast.Body>Informações foram gravadas</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}