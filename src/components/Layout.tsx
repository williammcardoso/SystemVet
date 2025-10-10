import React from "react";
import Sidebar from "./Sidebar";
import { MadeWithDyad } from "./made-with-dyad";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Placeholder for a potential top navigation/header content */}
          <div className="flex-1 text-lg font-medium"></div>
          <div className="flex items-center gap-4">
            {/* User profile/notifications could go here */}
            <span className="text-sm text-muted-foreground">William | William</span>
            {/* Add a simple help button */}
            <a href="#" className="text-sm text-blue-500 hover:underline">Ajuda</a>
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Layout;