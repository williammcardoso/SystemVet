import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as LucideIcons from "lucide-react"; // Padronizando importação de ícones
import { Link } from "react-router-dom";

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cadastro de Raças</h1>
        <Link to="/registrations">
          <Button variant="outline">
            <LucideIcons.ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Nova raça"
          className="max-w-xs"
          value={newBreedName}
          onChange={(e) => setNewBreedName(e.target.value)}
        />
        <Select onValueChange={setSelectedSpeciesId} value={selectedSpeciesId}>
          <SelectTrigger className="w-[180px]">
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
        <Button onClick={handleAddBreed} disabled={!newBreedName.trim() || !selectedSpeciesId}>
          <LucideIcons.Plus className="mr-2 h-4 w-4" /> Adicionar Raça
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Espécie</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breedsList.map((breed) => (
              <TableRow key={breed.id}>
                <TableCell className="font-medium">{breed.name}</TableCell>
                <TableCell>{breed.speciesName}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <LucideIcons.Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteBreed(breed.id)}>
                    <LucideIcons.Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {breedsList.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nenhuma raça cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BreedsPage;