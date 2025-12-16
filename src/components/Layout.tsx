import React from 'react'
import MainHeader from "./MainHeader";
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children })=> {
  return (
    <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-1">
          {children || <Outlet />}
        </main>
        {/* <Footer /> */}
    </div>
);
}

export default Layout