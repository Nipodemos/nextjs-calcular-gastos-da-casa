import { use, useEffect, useState } from "react"
import { mainStore } from "../stores/mainStore";
import { Card, ListGroup } from "react-bootstrap";

type valorPorPessoa = {
  nome: string;
  valor: number;
  salario: number;
}

export default function MostrarDivisao() {
  const despesas = mainStore((state) => state.despesas)
  const pessoas = mainStore((state) => state.pessoas)
  const [valorPorPessoa, setValorPorPessoa] = useState<Array<valorPorPessoa>>([]);

  useEffect(() => {

    const totalDespesas = despesas.reduce((acc, despesa) => {
      return acc + despesa.valor
    }, 0)

    const totalReceitas = pessoas.reduce((acc, pessoa) => {
      return acc + pessoa.salario - (pessoa.salario * pessoa.inss - 19.80) - (pessoa.salario * 0.06) + pessoa.alimentacao
    }, 0)


    setValorPorPessoa(pessoas.map(pessoa => {
      const receitaPessoa = pessoa.salario - (pessoa.salario * pessoa.inss - 19.80) - (pessoa.salario * 0.06) + pessoa.alimentacao
      const porcentagem = receitaPessoa / totalReceitas
      console.log('\n\n\n---\npessoa.nome :>> ', pessoa.nome);
      console.log('totalDespesas :>> ', totalDespesas);
      console.log('totalReceitas :>> ', totalReceitas);
      console.log('receitaPessoa :>> ', receitaPessoa);
      console.log('porcentagem :>> ', porcentagem.toFixed(2));
      const valor = Number(totalDespesas * porcentagem)
      console.log('valor :>> ', valor);
      return { nome: pessoa.nome, valor, salario: pessoa.salario, receita: receitaPessoa }
    }))
  }, [despesas, pessoas])


  return (
    <>
      <h1 className="mb-5">Divisão</h1>
      {valorPorPessoa.map(pessoa =>
        <Card className="mb-3" key={pessoa.nome} style={{ width: '15rem' }}>
          <Card.Body>
            <Card.Title>{pessoa.nome}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(pessoa.valor.toFixed(0)))}</ListGroup.Item>
            <ListGroup.Item>Sobra: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number((pessoa.salario - pessoa.valor).toFixed(0)))}</ListGroup.Item>
          </ListGroup>

        </Card>
      )}
    </>
  )
}