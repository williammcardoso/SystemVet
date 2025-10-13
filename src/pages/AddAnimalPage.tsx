import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FaArrowLeft, FaPlus, FaTimes, FaSave } from "react-icons/fa"; // Importar ícones de react-icons
import React, { useState } from "react";
import { Link } from "react-router-dom";

// Mock data for clients (tutors) - consistente com ClientsPage
interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthday: string;
  coatColor: string;
  weight: number;
  microchip: string;
  notes: string;
}

interface Client {
  id: string;
  name: string;
  animals: Animal[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "William",
    animals: [
      {
        id: "a1",
        name: "Totó",
        species: "Cachorro",
        breed: "Labrador",
        gender: "Macho",
        birthday: "2020-01-15",
        coatColor: "Dourado",
        weight: 25.0,
        microchip: "123456789",
        notes: "Animal muito dócil e brincalhão.",
      },
      {
        id: "a2",
        name: "Bolinha",
        species: "Cachorro",
        breed: "Poodle",
        gender: "Fêmea",
        birthday: "2021-05-20",
        coatColor: "Branco",
        weight: 5.0,
        microchip: "987654321",
        notes: "Adora passear no parque.",
      },
    ],
  },
  {
    id: "2",
    name: "Maria",
    animals: [
      {
        id: "a3",
        name: "Fido",
        species: "Cachorro",
        breed: "Vira-lata",
        gender: "Macho",
        birthday: "2019-03-10",
        coatColor: "Caramelo",
        weight: 18.0,
        microchip: "",
        notes: "Resgatado, um pouco tímido.",
      },
      {
        id: "a4",
        name: "Miau",
        species: "Gato",
        breed: "Siamês",
        gender: "Fêmea",
        birthday: "2022-07-01",
        coatColor: "Creme",
        weight: 3.5,
        microchip: "112233445",
        notes: "Gosta de dormir no sol.",
      },
    ],
  },
  {
    id: "3",
    name: "João",
    animals: [
      {
        id: "a5",
        name: "Rex",
        species: "Cachorro",
        breed: "Pastor Alemão",
        gender: "Macho",
        birthday: "2018-11-22",
        coatColor: "Preto e Marrom",
        weight: 30.0,
        microchip: "556677889",
        notes: "Animal de guarda, muito leal.",
      },
    ],
  },
  {
    id: "4",
    name: "Ana",
    animals: [],
  },
];

// Mock data for species (from SpeciesPage.tsx)
const mockSpecies = [
  { id: "1", name: "Cachorro" },
  { id: "2", name: "Gato" },
  { id: "3", name: "Pássaro" },
  { id: "4", name: "Roedor" },
];

// Mock data for breeds (from BreedsPage.tsx)
const mockBreeds = [
  { id: "1", name: "Labrador", speciesId: "1" },
  { id: "2", name: "Poodle", speciesId: "1" },
  { id: "3", name: "Siamês", speciesId: "2" },
  { id: "4", name: "Persa", speciesId: "2" },
];

// Mock data for coat types (from CoatTypesPage.tsx)
const mockCoatTypes = [
  { id: "1", name: "Curta" },
  { id: "2", name: "Longa" },
  { id: "3", name: "Lisa" },
  { id: "4", name: "Ondulada" },
];

const AddAnimalPage = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>(undefined);
  const filteredBreeds = selectedSpecies
    ? mockBreeds.filter(breed => breed.speciesId === selectedSpecies)
    : mockBreeds;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Adicionar Animal</h1>
        <Link to="/clients">
          <Button variant="outline">
            <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tutor">Tutor/Responsável*</Label>
          <Select>
            <SelectTrigger id="tutor">
              <SelectValue placeholder="Selecione o tutor..." />
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="animalName">Nome do Animal*</Label>
          <Input id="animalName" placeholder="Nome do animal" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species">Espécie*</Label>
          <Select onValueChange={setSelectedSpecies}>
            <SelectTrigger id="species">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {mockSpecies.map((species) => (
                <SelectItem key={species.id} value={species.id}>
                  {species.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="breed">Raça</Label>
          <Select disabled={!selectedSpecies}>
            <SelectTrigger id="breed">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {filteredBreeds.map((breed) => (
                <SelectItem key={breed.id} value={breed.id}>
                  {breed.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Sexo</Label>
          <Select>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Macho</SelectItem>
              <SelectItem value="female">Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthday">Data de Nascimento</Label>
          <Input id="birthday" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coatColor">Cor da Pelagem</Label>
          <Select>
            <SelectTrigger id="coatColor">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {mockCoatTypes.map((coatType) => (
                <SelectItem key={coatType.id} value={coatType.id}>
                  {coatType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input id="weight" type="number" placeholder="Ex: 5.5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="microchip">Microchip</Label>
          <Input id="microchip" placeholder="Número do microchip" />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Label htmlFor="animalNotes">Observações</Label>
        <Textarea id="animalNotes" placeholder="Adicione observações sobre o animal..." rows={5} />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline">
          <FaTimes className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button>
          <FaSave className="mr-2 h-4 w-4" /> Salvar
        </Button>
      </div>
    </div>
  );
};

export default AddAnimalPage;