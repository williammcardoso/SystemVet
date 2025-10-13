"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as LucideIcons from "lucide-react"; // Importar todos os ícones sob um alias
import { useTheme } from "next-themes"; // Para Dark Mode

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 shadow-sm">
      {/* Hamburger menu para mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onToggleMobileSidebar}
      >
        <LucideIcons.Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex-1 text-lg font-medium"></div> {/* Espaço flexível para empurrar itens para a direita */}

      <div className="flex items-center gap-4">
        {/* Botão de Dark Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="transition-colors duration-200"
        >
          {theme === "dark" ? (
            <LucideIcons.Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <LucideIcons.Moon className="h-5 w-5 text-blue-600" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notificações */}
        <Button variant="ghost" size="icon" className="relative">
          <LucideIcons.Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          <span className="sr-only">Notificações</span>
        </Button>

        {/* Ajuda */}
        <Link to="/help">
          <Button variant="ghost" size="icon">
            <LucideIcons.HelpCircle className="h-5 w-5" />
            <span className="sr-only">Ajuda</span>
          </Button>
        </Link>

        {/* Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/public/placeholder.svg" alt="User Avatar" />
                <AvatarFallback>WC</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">William Cardoso</p>
                <p className="text-xs leading-none text-muted-foreground">
                  william@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LucideIcons.Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LucideIcons.LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;