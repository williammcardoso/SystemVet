import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMoneyBillWave, FaPlus, FaDollarSign, FaArrowUp, FaArrowDown, FaChartLine, FaChartBar, FaWallet, FaTag, FaCalendarAlt, FaPaw } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getOverallFinancialSummary, mockFinancialTransactions, FinancialTransaction } from "@/mockData/financial";
import { mockClients } from "@/mockData/clients"; // Importar mockClients para obter nome do animal

const FinancialPage = () => {
  const { totalRevenue, totalExpenses, netProfit } = getOverallFinancialSummary();

  // Ordenar transações por data, mais recentes primeiro
  const sortedTransactions = [...mockFinancialTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getAnimalName = (clientId?: string, animalId?: string) => {
    if (!clientId || !animalId) return 'N/A';
    const client = mockClients.find(c => c.id === clientId);
    const animal = client?.animals.find(a => a.id === animalId);
    return animal?.name || 'N/A';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4 sm:gap-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaMoneyBillWave className="h-5 w-5 text-muted-foreground" /> Módulo Financeiro
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Visão geral e gerenciamento das finanças da clínica.
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Painel
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; Financeiro
        </p>
      </div>

      <div className="flex-1 p-6">
        {/* Cards de Resumo Financeiro */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <FaArrowUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">R$ {totalRevenue.toFixed(2).replace('.', ',')}</div>
              <p className="text-xs text-muted-foreground">
                Total de entradas no período.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
              <FaArrowDown className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">R$ {totalExpenses.toFixed(2).replace('.', ',')}</div>
              <p className="text-xs text-muted-foreground">
                Total de saídas no período.
              </p>
            </CardContent>
          </Card>
          <Card className={cn(
            "shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1",
            netProfit >= 0 ? "" : ""
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <FaChartLine className={cn("h-5 w-5", netProfit >= 0 ? "text-primary" : "text-destructive")} />
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                netProfit >= 0 ? "text-primary" : "text-destructive"
              )}>R$ {netProfit.toFixed(2).replace('.', ',')}</div>
              <p className="text-xs text-muted-foreground">
                Resultado financeiro geral.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lançamentos Recentes */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FaWallet className="h-5 w-5 text-primary" /> Lançamentos Recentes
            </CardTitle>
            <Button size="sm" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
              <FaPlus className="h-4 w-4 mr-2" /> Adicionar Lançamento
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {sortedTransactions.length > 0 ? (
              <div className="space-y-4">
                {sortedTransactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4 bg-card shadow-sm border border-border">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full",
                          transaction.type === 'income' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        )}>
                          {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                        <p className="text-lg font-semibold text-foreground">
                          {transaction.description}
                        </p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-lg font-bold",
                        transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {transaction.type === 'income' ? <FaArrowUp className="h-4 w-4" /> : <FaArrowDown className="h-4 w-4" />}
                        R$ {transaction.amount.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="h-3 w-3" /> {formatDate(transaction.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FaTag className="h-3 w-3" /> Categoria: {transaction.category}
                      </div>
                      {transaction.relatedAnimalId && (
                        <div className="flex items-center gap-1">
                          <FaPaw className="h-3 w-3" /> Animal: {getAnimalName(transaction.relatedClientId, transaction.relatedAnimalId)}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4">Nenhum lançamento financeiro registrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialPage;