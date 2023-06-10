import { Card, ListGroup } from "react-bootstrap";
import { mainStore } from "../stores/pessoa_e_despesa";
import { useStore } from "zustand";
import { useValorPorPessoaStore } from "../stores/valor_por_pessoa";



export default function MostrarPessoas() {
  const pessoas = mainStore((state) => state.pessoas)
  const valorPorPessoa = useValorPorPessoaStore((state) => state);
  return (
    <div >

      <h1 className="mb-5" >Salários</h1>
      {pessoas.map(({ nome, salario, alimentacao, inssPorcentagem }) => {
        const valores = valorPorPessoa.find((valor) => valor.nomePessoa === nome);
        if (valores === undefined) {
          return <></>
        }
        const { inssValor, passagemValor, salarioLiquido } = valores;

        const formatacao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        return (
          <Card className="mb-3" key={nome} style={{ width: '15rem' }}>
            <Card.Body>
              <Card.Title>{nome}</Card.Title>
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
    </div>
  )
}