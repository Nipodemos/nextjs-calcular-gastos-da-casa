import { Card, ListGroup } from "react-bootstrap";
import { mainStore } from "../stores/mainStore";


export default function MostrarPessoas() {
  const pessoas = mainStore((state) => state.pessoas)
  return (
    <div >

      <h1 className="mb-5" >Salários</h1>
      {pessoas.map(({ nome, salario, alimentacao, inss }) => {
        const total = salario - (salario * inss) - (salario * 0.06) + alimentacao
        const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        return (
          <Card className="mb-3" key={nome} style={{ width: '15rem' }}>
            <Card.Body>
              <Card.Title>{nome}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>Salário Bruto: {formatacao.format(salario)}</ListGroup.Item>
              <ListGroup.Item>Alimentação: {formatacao.format(alimentacao)}</ListGroup.Item>
              <ListGroup.Item>INSS: {formatacao.format((salario * inss) * -1)} ({inss * 100}%)</ListGroup.Item>
              <ListGroup.Item>Passagem: {formatacao.format((salario * 0.06) * -1)} (6%)</ListGroup.Item>
              <ListGroup.Item>Salário líquido: {formatacao.format(total)}</ListGroup.Item>
            </ListGroup>
          </Card>
        )
      })}
    </div>
  )
}