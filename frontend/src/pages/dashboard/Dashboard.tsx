import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sistema de Gerenciamento Escolar</h1>
        <div className="user-info">
          <span>Bem-vindo(a), {user?.nome} ({user?.perfil})</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>
      <main className="dashboard-content">
        <section className="welcome-card">
          <h2>Painel de Controle</h2>
          <p>Você está acessando a área restrita. O serviço JWT está em funcionamento.</p>
        </section>
      </main>
    </div>
  );
};
