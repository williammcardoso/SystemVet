import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Edit, Trash2 } from "@lucide/react"; // Importações nomeadas explícitas
import { Link } from "react-router-dom";

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cadastro de Pelagens</h1>
        <Link to="/registrations">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nova pelagem"
          className="max-w-xs"
          value={newCoatTypeName}
          onChange={(e) => setNewCoatTypeName(e.target.value)}
        />
        <Button onClick={handleAddCoatType}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Pelagem
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coatTypesList.map((coatType) => (
              <TableRow key={coatType.id}>
                <TableCell className="font-medium">{coatType.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCoatType(coatType.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {coatTypesList.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Nenhuma pelagem cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CoatTypesPage;