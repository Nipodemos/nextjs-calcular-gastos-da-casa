// pages/login.js
import { FormEventHandler, useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros anteriores

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // Se o login for bem-sucedido, redireciona para a página principal
      router.push('/');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit}>
        <h1>Acessar Painel de Despesas</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
          style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', width: '100%' }}>
          Entrar
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
}