import { useEffect, useState } from "react";

export default function ListarPessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);


  useEffect(() => {
    async function loadPessoas() {
      const response = await api.get('/pessoas');
      setPessoas(response.data);
    }
    loadPessoas();
  }, []);
  return (
    <>
      <h1>Listar Pessoas</h1>

    </>
  )
}