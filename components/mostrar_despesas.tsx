import { useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";

interface propsType {
  despesas: Array<despesasType>;
  setDespesas: Function;
}

type despesasType = {
  id: number;
  valor: number;
  descricao: string;
}

type FormDataType = {
  id: number | null;
  valor: number;
  descricao: string;
}

export default function MostrarDespesas({ despesas, setDespesas }: propsType) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    id: null,
    valor: 0,
    descricao: ''
  });

  const handleClose = () => setShow(false);
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
    setShow(true)
  };
  const handleSave = () => {
    if (formData.id === null) {
      setDespesas([...despesas, { ...formData, id: despesas.length + 1, }])
    } else {
      setDespesas(despesas.map((despesa) => {
        if (despesa.id === formData.id) {
          return { ...despesa, ...formData }
        }
        return despesa
      }))
    }
    setShow(false)
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
                    <Button variant="danger" type="button" onClick={() => setDespesas(despesas.filter((despesaAtual) => despesaAtual.id !== id))}>Remover</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
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
          <Button variant="primary" onClick={handleSave}>
            Gravar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}