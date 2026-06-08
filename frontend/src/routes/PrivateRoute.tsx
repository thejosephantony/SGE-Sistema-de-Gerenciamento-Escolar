import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRoute: React.FC = () => {
  const { signed } = useAuth();

  return signed ? <Outlet /> : <Navigate to="/login" replace />;
};
