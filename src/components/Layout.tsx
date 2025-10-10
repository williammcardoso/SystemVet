import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; // Importar o novo Header
import { MadeWithDyad } from "./made-with-dyad";
import { useIsMobile } from "@/hooks/use-mobile"; // Importar o hook de mobile

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseMobileSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isMobileOpen={isSidebarOpen} onCloseMobile={handleCloseMobileSidebar} />
      <div className="flex flex-col flex-1 lg:ml-64"> {/* Ajuste para mobile */}
        <Header onToggleMobileSidebar={handleToggleMobileSidebar} /> {/* Usar o novo Header */}
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Layout;