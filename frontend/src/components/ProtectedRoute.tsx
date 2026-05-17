import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  // If not logged in, redirect to login page. 
  // Otherwise, render the child routes using <Outlet />
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};