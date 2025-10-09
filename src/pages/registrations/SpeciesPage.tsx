import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Species {
  id: string;
  name: string;
}

const mockSpecies: Species[] = [
  { id: "1", name: "Cachorro" },
  { id: "2", name: "Gato" },
  { id: "3", name: "Pássaro" },
  { id: "4", name: "Roedor" },
];

const SpeciesPage = () => {
  const [speciesList, setSpeciesList] = useState<Species[]>(mockSpecies);
  const [newSpeciesName, setNewSpeciesName] = useState("");

  const handleAddSpecies = () => {
    if (newSpeciesName.trim()) {
      const newSpecies: Species = {
        id: String(speciesList.length + 1),
        name: newSpeciesName.trim(),
      };
      setSpeciesList([...speciesList, newSpecies]);
      setNewSpeciesName("");
    }
  };

  const handleDeleteSpecies = (id: string) => {
    setSpeciesList(speciesList.filter(species => species.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cadastro de Espécies</h1>
        <Link to="/registrations">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nova espécie"
          className="max-w-xs"
          value={newSpeciesName}
          onChange={(e) => setNewSpeciesName(e.target.value)}
        />
        <Button onClick={handleAddSpecies}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Espécie
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
            {speciesList.map((species) => (
              <TableRow key={species.id}>
                <TableCell className="font-medium">{species.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteSpecies(species.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {speciesList.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Nenhuma espécie cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SpeciesPage;