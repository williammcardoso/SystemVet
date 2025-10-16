import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMoneyBillWave, FaPlus, FaDollarSign, FaArrowUp, FaArrowDown, FaChartLine, FaChartBar, FaWallet, FaTag, FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getOverallFinancialSummary, mockFinancialTransactions, FinancialTransaction } from "@/mockData/financial";

const FinancialPage = () => {
  const { totalRevenue, totalExpenses, netProfit } = getOverallFinancialSummary();

  // Ordenar transações por data, mais recentes primeiro
  const sortedTransactions = [...mockFinancialTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <FaMoneyBillWave className="h-5 w-5 text-gray-500 dark:text-gray-400" /> Módulo Financeiro
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Visão geral e gerenciamento das finanças da clínica.
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Painel
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; Financeiro
        </p>
      </div>

      <div className="flex-1 p-6">
        {/* Cards de Resumo Financeiro */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:border-green-500 border-t-4 border-green-400 dark:bg-gray-800/90">
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
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:border-red-500 border-t-4 border-red-400 dark:bg-gray-800/90">
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
            "shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-t-4 dark:bg-gray-800/90",
            netProfit >= 0 ? "hover:border-blue-500 border-blue-400" : "hover:border-orange-500 border-orange-400"
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <FaChartLine className={cn("h-5 w-5", netProfit >= 0 ? "text-blue-500" : "text-orange-500")} />
            </CardHeader>
            <CardContent>
              <div className={cn(
                "text-2xl font-bold",
                netProfit >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
              )}>R$ {netProfit.toFixed(2).replace('.', ',')}</div>
              <p className="text-xs text-muted-foreground">
                Resultado financeiro geral.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lançamentos Recentes */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-purple-400 dark:bg-gray-800/90">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaWallet className="h-5 w-5 text-purple-500" /> Lançamentos Recentes
            </CardTitle>
            <Button size="sm" className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
              <FaPlus className="h-4 w-4 mr-2" /> Adicionar Lançamento
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {sortedTransactions.length > 0 ? (
              <div className="space-y-4">
                {sortedTransactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4 bg-background dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
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
                          <FaPaw className="h-3 w-3" /> Animal: {mockClients.find(c => c.id === transaction.relatedClientId)?.animals.find(a => a.id === transaction.relatedAnimalId)?.name || 'N/A'}
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