// components/mostrar_divisao.tsx

import { Card, ListGroup } from "react-bootstrap";
// 1. IMPORTE O TIPO DO DADO QUE ELE VAI RECEBER
import { DivisaoCalculada } from "../lib/calculations";

// 2. DEFINA AS PROPS DO COMPONENTE
interface MostrarDivisaoProps {
  divisao: DivisaoCalculada[];
}

export default function MostrarDivisao({ divisao }: MostrarDivisaoProps) {
  // 3. REMOVA A LINHA DA STORE! A variável 'divisao' agora vem das props.
  // const valoresPorPessoa = useValorPorPessoaStore((state) => state);

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <h1 className="mb-5">Divisão</h1>
      {/* 4. USE A PROP DIRETAMENTE */}
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