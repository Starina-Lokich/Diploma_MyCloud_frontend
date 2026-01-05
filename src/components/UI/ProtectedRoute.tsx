import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import Loader from './Loader'; // Предполагаем, что есть компонент загрузки

interface ProtectedRouteProps {
  isAdmin?: boolean;
  requireAuth?: boolean; // Можно сделать опциональным
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  isAdmin = false, 
  requireAuth = true 
}) => {
  const { isAuthenticated, user, loading } = useAppSelector(state => state.auth);

  // Пока загружаем данные - показываем лоадер
  if (loading) {
    return <Loader />;
  }

  // Если требуется аутентификация, но пользователь не аутентифицирован
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если требуется доступ администратора
  if (isAdmin) {
    // Проверяем, что пользователь загружен и является администратором
    if (!user) {
      // Пользователь не загружен (но isAuthenticated = true) - странная ситуация
      return <Navigate to="/login" replace />;
    }
    
    // Проверяем разные возможные поля администратора
    const isUserAdmin = user.is_admin || user.is_staff || user.is_superuser;
    if (!isUserAdmin) {
      // Можно показывать сообщение "Доступ запрещен" вместо редиректа
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;