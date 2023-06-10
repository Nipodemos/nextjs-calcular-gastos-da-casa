import { use, useEffect, useState } from "react"
import { mainStore } from "../stores/pessoa_e_despesa";
import { Card, ListGroup } from "react-bootstrap";
import { useValorPorPessoaStore } from "../stores/valor_por_pessoa";

export default function MostrarDivisao() {
  const valoresPorPessoa = useValorPorPessoaStore((state) => state);


  return (
    <>
      <h1 className="mb-5">Divisão</h1>
      {valoresPorPessoa.map(({ nomePessoa, valor, valorQueSobra }) =>
        <Card className="mb-3" key={nomePessoa} style={{ width: '15rem' }}>
          <Card.Body>
            <Card.Title>{nomePessoa}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor.toFixed(0)))}</ListGroup.Item>
            <ListGroup.Item>Sobra: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valorQueSobra.toFixed(0)))}</ListGroup.Item>
          </ListGroup>

        </Card>
      )}
    </>
  )
}