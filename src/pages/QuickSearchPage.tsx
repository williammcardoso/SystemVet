import React from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const QuickSearchPage = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Busca Rápida</h1>
          <p className="text-muted-foreground">Encontre rapidamente tutores, pacientes ou informações.</p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="relative mb-6 p-4 bg-card rounded-lg shadow-sm">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, CPF, animal, etc..."
          className="w-full pl-12 py-6 text-lg"
        />
      </div>

      <div className="text-center text-muted-foreground p-8 bg-card rounded-lg shadow-sm">
        <p>Digite algo na barra de busca para começar.</p>
        <p className="mt-2">Resultados aparecerão aqui.</p>
      </div>
    </div>
  );
};

export default QuickSearchPage;