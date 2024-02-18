import { Card, ListGroup } from "react-bootstrap";
import { useValorPorPessoaStore } from "../stores/valor_por_pessoa";

export default function MostrarDivisao() {
  const valoresPorPessoa = useValorPorPessoaStore((state) => state);
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <h1 className="mb-5">Divisão</h1>
      {valoresPorPessoa.map(({ nomePessoa, valor, valorQueSobra, porcentagem }) =>
        <Card className="mb-3" key={nomePessoa} style={{ width: '15rem' }}>
          <Card.Body>
            <Card.Title>{nomePessoa}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>
              Valor: {formatter.format(Number(valor.toFixed(0)))}
              {' '} ({(porcentagem * 100).toFixed(0)}%)
            </ListGroup.Item>
            <ListGroup.Item>
              Sobra: {formatter.format(Number(valorQueSobra.toFixed(0)))}
            </ListGroup.Item>
          </ListGroup>

        </Card>
      )}
    </>
  )
}