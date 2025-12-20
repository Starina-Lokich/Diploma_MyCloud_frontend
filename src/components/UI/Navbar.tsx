import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuElement = document.querySelector('.nav-menu');
      const burgerButton = document.querySelector('.burger-button');

      if (isMenuOpen &&
          menuElement &&
          !event.composedPath().includes(menuElement) &&
          !event.composedPath().includes(burgerButton as Node)) {
            setIsMenuOpen(false);
            console.log('isMenuOpen? ', isMenuOpen);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/"
            className="text-xl font-bold"
            // onClick={() => setIsMenuOpen(false)}
          >
            Облачное хранилище "My Cloud"
          </Link>

          {/* Бургер-меню для мобильных */}
          <button
            className="burger-button ml-4 md:hidden text-white focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Информация о пользователе (десктоп)*/}
        {isAuthenticated && user && (
          <div className="hidden md:flex items-center space-x-4">
            {/* <div className="flex items-center space-x-4"> */}
            <span className="font-medium">
              {user.last_name} {user.first_name} ({user.username})
            </span>
            {user.is_admin && <span className="bg-yellow-500 text-xs px-2 py-1 rounded">Admin</span>}
            {/* </div> */}
          </div>
        )}

        {/* Навигационное меню */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              {user?.is_admin && (
                <Link to="/admin"
                  className="hover:underline py-2 md:py-0"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Админ-панель
                </Link>
              )}

              <Link to="/storage"
                className="hover:underline py-2 md:py-0"
                onClick={() => setIsMenuOpen(false)}
              >
                Мое хранилище
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-left md:text-center"
              >
                Выход
              </button>

              {/* Информация о пользователе (мобильная) */}
              {/* {isAuthenticated && user && (
                <div className="mobile-only pt-4 border-t border-white mt-4">
                  <span className="font-medium">
                    {user.last_name} {user.first_name} ({user.username})
                  </span>
                  {user.is_admin && <span className="bg-yellow-500 text-xs px-2 py-1 rounded ml-2">Admin</span>}
                </div>
              )} */}
            </div>
          ) : (
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <Link to="/login"
                    className="hover:underline py-2 md:py-0"
                    onClick={() => setIsMenuOpen(false)}
              >
                  Вход
              </Link>

              <Link to="/register"
                    className="hover:underline  py-2 md:py-0"
                    onClick={() => setIsMenuOpen(false)}
              >
                  Регистрация
              </Link>
            </div>
          )}

           {/* Информация о пользователе (мобильная) */}
            {isAuthenticated && user && isMenuOpen && (
              <div className="md:hidden pt-4 border-t border-white mt-4">
                <span className="font-medium block">
                  {user.last_name} {user.first_name}
                </span>
                <span className="block">({user.username})</span>
                {user.is_admin && (
                  <span className="bg-yellow-500 text-xs px-2 py-1 rounded mt-2 inline-block">
                    Admin
                  </span>
                )}
              </div>
            )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
