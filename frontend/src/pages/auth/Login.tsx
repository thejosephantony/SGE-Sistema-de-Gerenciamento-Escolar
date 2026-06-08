import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, senha });
      const { token, ...user } = response.data;
      
      signIn(token, user);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        // O backend respondeu com um status de erro (ex: 401, 500)
        setError(`Erro ${err.response.status}: ${err.response.data?.message || 'Credenciais inválidas'}`);
      } else if (err.request) {
        // A requisição foi feita mas não houve resposta (Backend offline ou CORS)
        setError('O servidor não respondeu (Network Error). Verifique se o Backend (Java) está mesmo rodando e sem erros no console.');
      } else {
        // Outro tipo de erro
        setError('Erro na requisição: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>SGE</h1>
          <p>Sistema de Gerenciamento Escolar</p>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
