// pages/login.tsx

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setSuccess('Login realizado com sucesso! Redirecionando...');
        router.push('/');
      } else {
        const data = await res.json();
        // A API retornou um erro (senha incorreta)
        setError(data.message);
        setIsLoading(false);
      }
    } catch (err) {
      // Erro de rede ou a API está fora do ar
      setError('Ocorreu um erro de conexão. Tente novamente mais tarde.');
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    // Container principal para centralizar o conteúdo na tela
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <Row className="w-100 justify-content-center">
        {/* Coluna que segura o card de login, com largura responsiva */}
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          {/* Usando o componente Card para um visual limpo e encaixotado */}
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fw-bold mb-4 text-center">Controle de Despesas</h2>
              <p className="text-center text-muted mb-4">Por favor, insira a senha para acessar o painel.</p>

              {/* Mostra a mensagem de erro, se houver */}
              {error && <Alert variant="danger">{error}</Alert>}

              {/* 3. Exibimos a mensagem de sucesso aqui */}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label>Senha de Acesso</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    size="lg"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        {/* O texto do botão agora se adapta à mensagem de sucesso */}
                        <span className="ms-2">{success ? 'Redirecionando...' : 'Entrando...'}</span>
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}