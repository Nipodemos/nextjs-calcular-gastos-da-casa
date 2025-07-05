// components/mostrar_divisao.tsx

import { Card, ListGroup } from "react-bootstrap";
// 1. IMPORTE O TIPO DO DADO QUE ELE VAI RECEBER
import { DivisaoCalculada } from "../lib/calculations";

// 2. DEFINA AS PROPS DO COMPONENTE
interface MostrarDivisaoProps {
  divisao: DivisaoCalculada[];
}

export default function MostrarDivisao({ divisao }: MostrarDivisaoProps) {

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatterPorcentagem = new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  let porcentagemDoSalarioPaga = formatterPorcentagem.format(divisao[0].valor / divisao[0].salarioLiquido * 100);


  return (
    <>
      <h1>Divisão</h1>
      <p>Obs: Todos estão dando {porcentagemDoSalarioPaga}% do salário para casa</p>
      {divisao.map(({ nomePessoa, valor, valorQueSobra, porcentagem }) =>
        <Card className="mb-3" key={nomePessoa} style={{ width: '15rem' }}>
          <Card.Body>
            <Card.Title>{nomePessoa}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>
              Valor: {formatter.format(valor)}
              {' '} ({(porcentagem * 100).toFixed(2)}%)
            </ListGroup.Item>
            <ListGroup.Item>
              Sobra: {formatter.format(valorQueSobra)}
            </ListGroup.Item>
          </ListGroup>
        </Card>
      )}
    </>
  )
}