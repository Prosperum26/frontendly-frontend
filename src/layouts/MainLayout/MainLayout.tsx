import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header />
      <main className="w-full min-h-[917px] flex-grow flex flex-col bg-surface">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;