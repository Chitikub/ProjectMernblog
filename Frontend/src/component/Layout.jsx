import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-200"> 
      <header className="sticky top-0 z-50"> 
        <Header />
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl"> 
        
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
