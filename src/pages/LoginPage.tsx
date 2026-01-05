import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Валидация формы
  const validateForm = () => {
    // Валидация логина (как в RegisterPage)
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
    if (!usernameRegex.test(username)) {
      setError('Логин должен начинаться с буквы, содержать 4-20 символов (латиница и цифры)');
      return false;
    }
    
    // Валидация пароля (не пустой)
    if (!password.trim()) {
      setError('Введите пароль');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Клиентская валидация
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const user = await dispatch(loginUser({ username, password })).unwrap();

      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/storage');
      }
    } catch (err: any) {
      setError(err.payload?.detail || 'Неверные учетные данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход в систему</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium required-field">Логин</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="relative">
            <label className="block mb-1 font-medium required-field">Пароль</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded  pr-10"
              required
            />
            <button
              type="button"
            className="password-toggle absolute right-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="password-toggle-icon">
                {showPassword ? '👁️' : <span className="strikethrough">👁️</span>}
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary mx-auto block w-64 text-white py-2 px-6 rounded-lg mt-8 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
          <div> Поля, отмеченные <span className="text-red-500 font-bold">*</span>, обязательны для заполнения</div>
        </form>

        <div className="mt-4 text-center">
          <p>
            Нет аккаунта?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Зарегистрируйтесь</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;