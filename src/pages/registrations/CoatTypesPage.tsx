import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaArrowLeft, FaPlus, FaEdit, FaTrashAlt, FaPalette } from "react-icons/fa"; // Importar ícones de react-icons
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CoatType {
  id: string;
  name: string;
}

const mockCoatTypes: CoatType[] = [
  { id: "1", name: "Curta" },
  { id: "2", name: "Longa" },
  { id: "3", name: "Lisa" },
  { id: "4", name: "Ondulada" },
];

const CoatTypesPage = () => {
  const [coatTypesList, setCoatTypesList] = useState<CoatType[]>(mockCoatTypes);
  const [newCoatTypeName, setNewCoatTypeName] = useState("");

  const handleAddCoatType = () => {
    if (newCoatTypeName.trim()) {
      const newCoatType: CoatType = {
        id: String(coatTypesList.length + 1),
        name: newCoatTypeName.trim(),
      };
      setCoatTypesList([...coatTypesList, newCoatType]);
      setNewCoatTypeName("");
    }
  };

  const handleDeleteCoatType = (id: string) => {
    setCoatTypesList(coatTypesList.filter(coatType => coatType.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <FaPalette className="h-5 w-5 text-gray-500 dark:text-gray-400" /> Cadastro de Pelagens
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Gerencie os tipos de pelagens dos animais.
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; Cadastros &gt; Pelagens
        </p>
      </div>

      <div className="flex-1 p-6">
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-green-400 dark:bg-gray-800/90">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaPalette className="h-5 w-5 text-green-500" /> Lista de Pelagens
            </CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Nova pelagem"
                className="max-w-xs bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                value={newCoatTypeName}
                onChange={(e) => setNewCoatTypeName(e.target.value)}
              />
              <Button onClick={handleAddCoatType} className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                <FaPlus className="mr-2 h-4 w-4" /> Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coatTypesList.map((coatType, index) => (
                    <TableRow key={coatType.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                      <TableCell className="font-medium">{coatType.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="mr-2 rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCoatType(coatType.id)} className="rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                          <FaTrashAlt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {coatTypesList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                        Nenhuma pelagem cadastrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoatTypesPage;