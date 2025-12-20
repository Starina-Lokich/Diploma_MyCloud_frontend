import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 py-4 md:py-6 text-center">
        Дипломный проект по профессии «Fullstack-разработчик на Python, 2025»
      </footer>
    </div>
  );
};

export default Layout;
