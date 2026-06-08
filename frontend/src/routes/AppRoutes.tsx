import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { PrivateRoute } from './PrivateRoute';

export const AppRoutes: React.FC = () => {
  const { signed } = useAuth();

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route 
        path="/login" 
        element={signed ? <Navigate to="/dashboard" replace /> : <Login />} 
      />

      {/* Rotas Privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Adicionar as demais rotas privadas aqui futuramente */}
      </Route>

      {/* Rota Padrão */}
      <Route path="*" element={<Navigate to={signed ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};
