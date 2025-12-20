import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Добро пожаловать в облачное хранилище</h1>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Новый пользователь?</h2>
          <p className="mb-3">Зарегистрируйтесь для доступа к вашему персональному хранилищу</p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Регистрация
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Уже зарегистрированы?</h2>
          <p className="mb-4">Войдите в систему для доступа к вашим файлам</p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
