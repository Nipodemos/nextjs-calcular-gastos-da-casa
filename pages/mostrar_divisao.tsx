import { Card, ListGroup } from "react-bootstrap";
import { DivisaoCalculada } from "../lib/calculations";
import { useEffect, useState } from "react";
import { isArray } from "lodash";

interface MostrarDivisaoProps {
  divisao: DivisaoCalculada[];
}

export default function MostrarDivisao({ divisao }: MostrarDivisaoProps) {
  let [porcentagemDoSalarioPaga, setPorcentagemDoSalarioPaga] = useState('');

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });


  useEffect(() => {
    if (divisao && isArray(divisao) && divisao.length > 0) {
      const formatterPorcentagem = new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setPorcentagemDoSalarioPaga(formatterPorcentagem.format(divisao[0].valor / divisao[0].salarioLiquido * 100));

    }
  }, [divisao])


  return (
    <>
      <h1>Divisão</h1>
      <p>Obs: Todos estão dando {porcentagemDoSalarioPaga}% do salário para casa</p>
      {divisao && divisao.map(({ nomePessoa, valor, valorQueSobra, porcentagem }) =>
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