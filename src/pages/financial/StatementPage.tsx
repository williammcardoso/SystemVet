import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaFileInvoice } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatementPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaFileInvoice className="h-5 w-5 text-muted-foreground" /> Demonstrativo Financeiro
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Visualize o demonstrativo financeiro da clínica.
              </p>
            </div>
          </div>
          <Link to="/financial">
            <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Financeiro
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; Financeiro &gt; Demonstrativo
        </p>
      </div>

      <div className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md text-center bg-card shadow-sm border border-border rounded-md border-t-4 border-primary">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">
              Funcionalidade em Breve!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A página de Demonstrativo Financeiro está em desenvolvimento. Volte em breve para mais novidades!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatementPage;