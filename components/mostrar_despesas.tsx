import { ChangeEvent, useState } from "react";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";

interface propsType {
  despesas: Array<despesasType>;
  setDespesas: Function;
}

type despesasType = {
  id: number;
  valor: number;
  descricao: string;
}

export default function MostrarDespesas({ despesas, setDespesas }: propsType) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const newDespesas = despesas.map((despesa) => {
      if (despesa.id === id) {
        return { ...despesa, valor: Number(e.target.value) };
      }
      return despesa;
    });
    setDespesas(newDespesas);
  };
  const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const newDespesas = despesas.map((despesa) => {
      if (despesa.id === id) {
        return { ...despesa, descricao: e.target.value };
      }
      return despesa;
    });
    setDespesas(newDespesas);
  };

  return (
    <>
      <Row >
        <Col>
          <h1>Despesas</h1>
          <Button variant="success" style={{ marginBottom: '8px' }} onClick={() => setDespesas([...despesas, { id: despesas.length + 1, valor: 0, descricao: '' }])}>Adicionar Despesa</Button>
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
                    <Button style={{ marginRight: '8px' }} onClick={handleShow} >Editar</Button>
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
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you&apos;re reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}