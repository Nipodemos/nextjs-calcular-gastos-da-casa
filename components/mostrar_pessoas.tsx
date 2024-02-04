import { Button, Card, ListGroup, Spinner, Modal, Form, Row } from "react-bootstrap";
import { mainStore } from "../stores/pessoa_e_despesa";
import { useStore } from "zustand";
import { useValorPorPessoaStore } from "../stores/valor_por_pessoa";
import { useState } from "react";

type FormDataType = {
  id: number | null;
  nome: string;
  salario: number;
  alimentacao: number;
  inssPorcentagem: number;
}

export default function MostrarPessoas() {
  const pessoas = mainStore((state) => state.pessoas)
  const valorPorPessoa = useValorPorPessoaStore((state) => state);
  const adicionarPessoa = mainStore((state) => state.adicionarPessoa);
  const alterarPessoa = mainStore((state) => state.alterarPessoa);
  const removerPessoa = mainStore((state) => state.removerPessoa);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    id: null,
    nome: '',
    salario: 0,
    alimentacao: 0,
    inssPorcentagem: 0,
  });

  const handleShow = (id: number | null) => {
    if (id) {
      const pessoa = pessoas.find((apessoa) => apessoa.id === id);
      if (!pessoa) {
        throw new Error("Despesa não encontrada");
      }
      setFormData({ id: pessoa.id, nome: pessoa.nome, salario: pessoa.salario, inssPorcentagem: pessoa.inssPorcentagem, alimentacao: pessoa.alimentacao })
    } else {
      setFormData({
        id: null,
        nome: '',
        salario: 0,
        alimentacao: 0,
        inssPorcentagem: 0,
      })
    }
    setShowModal(true)
  };
  const handleClose = () => setShowModal(false);
  const handleSave = async () => {
    setIsLoading(true);
    let resultado = false;
    if (formData.id === null) {
      resultado = await adicionarPessoa(formData.nome, formData.salario, formData.alimentacao, formData.inssPorcentagem);
    } else {
      resultado = await alterarPessoa(formData.id, formData.nome, formData.salario, formData.alimentacao, formData.inssPorcentagem);
    }

    if (!resultado) {
      alert('Erro ao salvar despesa')
    }
    else {
      setShowModal(false)
      setShowToastSuccess(true)
      setFormData({
        id: null,
        nome: '',
        salario: 0,
        alimentacao: 0,
        inssPorcentagem: 0,
      })
    }
    setIsLoading(false);
  }
  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    let resultado = await removerPessoa(id);
    if (!resultado) {
      alert('Erro ao excluir despesa')
    }
    else {
      setShowToastSuccess(true)
    }
    setIsDeleting(null);
    setIsLoading(false);
  }
  return (
    <div >

      <h1 >Salários</h1>
      <Button variant="success" style={{ marginBottom: '8px' }} onClick={() => handleShow(null)}>Adicionar Pessoa</Button>
      {pessoas.map(({ id, nome, salario, alimentacao, inssPorcentagem }) => {
        const valores = valorPorPessoa.find((valor) => valor.nomePessoa === nome);
        if (valores === undefined) {
          return <></>
        }
        const { inssValor, passagemValor, salarioLiquido } = valores;

        const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        return (
          <Card className="mb-3" key={nome} style={{ width: '15rem' }}>
            <Card.Body>
              <Card.Title>
                {nome}
                <Button className="ms-2" size='sm' style={{ marginRight: '8px' }} onClick={() => handleShow(id)} >Editar</Button>
                <Button variant="danger" size='sm' type="button" disabled={isDeleting === id} onClick={() => handleDelete(id)}>
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
              </Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>Salário Bruto: {formatacao.format(salario)}</ListGroup.Item>
              <ListGroup.Item>Alimentação: {formatacao.format(alimentacao)}</ListGroup.Item>
              <ListGroup.Item>INSS: {formatacao.format(inssValor * -1)} ({inssPorcentagem * 100}%)</ListGroup.Item>
              <ListGroup.Item>Passagem: {formatacao.format(passagemValor * -1)} (6%)</ListGroup.Item>
              <ListGroup.Item>Salário líquido: {formatacao.format(salarioLiquido)}</ListGroup.Item>
            </ListGroup>
          </Card>
        )
      })}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id === null ? "Nova Pessoa" : "Alterar Pessoa"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Form>
              <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="Nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formSalario">
                <Form.Label>Valor</Form.Label>
                <Form.Control type="number" placeholder="Salário" value={formData.salario} onChange={(e) => setFormData({ ...formData, salario: Number(e.target.value) })} />
              </Form.Group>
              <Form.Group controlId="formAlimentacao">
                <Form.Label>Alimentação</Form.Label>
                <Form.Control type="number" placeholder="Alimentação" value={formData.alimentacao} onChange={(e) => setFormData({ ...formData, alimentacao: Number(e.target.value) })} />
              </Form.Group>
              <Form.Group controlId="formInss">
                <Form.Label>INSS (porcentagem)</Form.Label>
                <Form.Control type="number" placeholder="INSS" value={formData.inssPorcentagem} onChange={(e) => setFormData({ ...formData, inssPorcentagem: Number(e.target.value) })} />
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
    </div>
  )
}