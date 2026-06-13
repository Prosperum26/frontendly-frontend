import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header />
      <main className="w-full min-h-[917px] flex-grow flex items-center justify-center bg-[#F8F9FF] p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;