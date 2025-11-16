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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true); // Desktop sidebar state

  const handleToggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseMobileSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  const sidebarWidthClass = isDesktopSidebarOpen ? "lg:w-64" : "lg:w-16";
  const mainContentMarginClass = isDesktopSidebarOpen ? "lg:ml-64" : "lg:ml-16";


  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isMobileOpen={isSidebarOpen} 
        onCloseMobile={handleCloseMobileSidebar} 
        isDesktopOpen={isDesktopSidebarOpen}
        onToggleDesktop={handleToggleDesktopSidebar}
      />
      <div className={`flex flex-col flex-1 ${mainContentMarginClass} transition-all duration-300 ease-in-out`}>
        <Header 
          onToggleMobileSidebar={handleToggleMobileSidebar} 
          onToggleDesktopSidebar={handleToggleDesktopSidebar}
          isDesktopSidebarOpen={isDesktopSidebarOpen}
        />
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Layout;