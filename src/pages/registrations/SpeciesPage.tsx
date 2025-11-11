import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FaArrowLeft, FaPlus, FaEdit, FaTrashAlt, FaPaw } from "react-icons/fa"; // Importar ícones de react-icons
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaPaw className="h-5 w-5 text-muted-foreground" /> Cadastro de Espécies
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Gerencie as espécies de animais atendidos pela clínica.
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; Cadastros &gt; Espécies
        </p>
      </div>

      <div className="flex-1 p-6">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FaPaw className="h-5 w-5 text-primary" /> Lista de Espécies
            </CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Nova espécie"
                className="max-w-xs bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                value={newSpeciesName}
                onChange={(e) => setNewSpeciesName(e.target.value)}
              />
              <Button onClick={handleAddSpecies} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
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
                  {speciesList.map((species, index) => (
                    <TableRow key={species.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                      <TableCell className="font-medium">{species.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="mr-2 rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSpecies(species.id)} className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                          <FaTrashAlt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {speciesList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                        Nenhuma espécie cadastrada.
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

export default SpeciesPage;