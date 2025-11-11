import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaArrowLeft, FaPlus, FaEdit, FaTrashAlt, FaPaw } from "react-icons/fa"; // Importar ícones de react-icons
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Breed {
  id: string;
  name: string;
  speciesId: string;
  speciesName: string;
}

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

const mockBreeds: Breed[] = [
  { id: "1", name: "Labrador", speciesId: "1", speciesName: "Cachorro" },
  { id: "2", name: "Poodle", speciesId: "1", speciesName: "Cachorro" },
  { id: "3", name: "Siamês", speciesId: "2", speciesName: "Gato" },
  { id: "4", name: "Persa", speciesId: "2", speciesName: "Gato" },
];

const BreedsPage = () => {
  const [breedsList, setBreedsList] = useState<Breed[]>(mockBreeds);
  const [newBreedName, setNewBreedName] = useState("");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | undefined>(undefined);

  const handleAddBreed = () => {
    if (newBreedName.trim() && selectedSpeciesId) {
      const species = mockSpecies.find(s => s.id === selectedSpeciesId);
      if (species) {
        const newBreed: Breed = {
          id: String(breedsList.length + 1),
          name: newBreedName.trim(),
          speciesId: selectedSpeciesId,
          speciesName: species.name,
        };
        setBreedsList([...breedsList, newBreed]);
        setNewBreedName("");
        setSelectedSpeciesId(undefined);
      }
    }
  };

  const handleDeleteBreed = (id: string) => {
    setBreedsList(breedsList.filter(breed => breed.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaPaw className="h-5 w-5 text-muted-foreground" /> Cadastro de Raças
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Gerencie as raças de animais, associando-as às suas respectivas espécies.
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
          Painel &gt; Cadastros &gt; Raças
        </p>
      </div>

      <div className="flex-1 p-6">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FaPaw className="h-5 w-5 text-primary" /> Lista de Raças
            </CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Nova raça"
                className="max-w-xs bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                value={newBreedName}
                onChange={(e) => setNewBreedName(e.target.value)}
              />
              <Select onValueChange={setSelectedSpeciesId} value={selectedSpeciesId}>
                <SelectTrigger className="w-[180px] bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                  <SelectValue placeholder="Selecione a Espécie" />
                </SelectTrigger>
                <SelectContent>
                  {mockSpecies.map((species) => (
                    <SelectItem key={species.id} value={species.id}>
                      {species.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddBreed} disabled={!newBreedName.trim() || !selectedSpeciesId} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
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
                    <TableHead>Espécie</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breedsList.map((breed, index) => (
                    <TableRow key={breed.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                      <TableCell className="font-medium">{breed.name}</TableCell>
                      <TableCell>{breed.speciesName}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="mr-2 rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                          <FaEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteBreed(breed.id)} className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                          <FaTrashAlt className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {breedsList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                        Nenhuma raça cadastrada.
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

export default BreedsPage;