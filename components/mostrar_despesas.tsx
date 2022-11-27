import { ChangeEvent } from "react";

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

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const newDespesas = despesas.map((despesa) => {
      if (despesa.id === id) {
        return { ...despesa, valor: Number(e.target.value) };
      }
      return despesa;
    });
    setDespesas(newDespesas);
  };

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
    <div style={{ width: '30vw', display: 'flex', flexDirection: 'column', alignContent: 'center' }} >
      <h1>Despesas</h1>
      <ul>
        {despesas.map(despesa => (
          <li key={despesa.id}>
            <input onChange={(event) => handleValueChange(event, despesa.id)} value={despesa.valor} />
            <input onChange={(event) => handleDescriptionChange(event, despesa.id)} value={despesa.descricao} />
            <button onClick={() => setDespesas(despesas.filter((despesaAtual) => despesaAtual.id !== despesa.id))}>Remover</button>
          </li>
        ))}
      </ul>
      <button onClick={() => setDespesas([...despesas, { id: despesas.length + 1, valor: 0, descricao: '' }])}>Adicionar Despesa</button>
    </div>
  )
}