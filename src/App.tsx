import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/UI/Layout';
import ProtectedRoute from './components/UI/ProtectedRoute';
import Loader from './components/UI/Loader';

// Динамические импорты для страниц
// import HomePage from './pages/HomePage';
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const StoragePage = React.lazy(() => import('./pages/StoragePage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));



const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

      {/* <Route index element={<HomePage />} /> */}
      {/* Общий Suspense для всех страниц внутри Layout */}
      <Route
        index
        element={
          <Suspense fallback={<Loader />}>
            <HomePage />
          </Suspense>
        }
      />

      {/* <Route path="login" element={<LoginPage />} /> */}
      <Route
        path="login"
        element={
          <Suspense fallback={<Loader />}>
            <LoginPage />
          </Suspense>
        }
      />

      {/* <Route path="register" element={<RegisterPage />} /> */}
      <Route
        path="register"
        element={
          <Suspense fallback={<Loader />}>
            <RegisterPage />
          </Suspense>
        }
      />

      <Route element={<ProtectedRoute />}>
        {/* <Route path="storage" element={<StoragePage />} /> */}
        <Route
            path="storage"
            element={
              <Suspense fallback={<Loader />}>
                <StoragePage />
              </Suspense>
            }
          />
      </Route>

      <Route element={<ProtectedRoute isAdmin={true} />}>
        {/* <Route path="admin" element={<AdminPage />} /> */}
        <Route
            path="admin"
            element={
              <Suspense fallback={<Loader />}>
                <AdminPage />
              </Suspense>
            }
        />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
