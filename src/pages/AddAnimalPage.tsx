import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FaArrowLeft, FaPlus, FaTimes, FaSave, FaPaw } from "react-icons/fa"; // Importar ícones de react-icons
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // Importar useSearchParams
import { toast } from "sonner";
import { mockClients, addMockAnimalToClient } from "@/mockData/clients"; // Importar o mock de clientes centralizado e a função para adicionar animal
import { Animal, Client } from "@/types/client"; // Importar as interfaces Animal e Client

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook para ler parâmetros da URL
  const initialClientId = searchParams.get('clientId'); // Pega o clientId da URL

  const [selectedTutorId, setSelectedTutorId] = useState<string | undefined>(initialClientId || undefined);
  const [animalName, setAnimalName] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>(undefined);
  const [selectedBreed, setSelectedBreed] = useState<string | undefined>(undefined);
  const [gender, setGender] = useState<Animal['gender'] | undefined>(undefined);
  const [birthday, setBirthday] = useState("");
  const [coatColor, setCoatColor] = useState<string | undefined>(undefined);
  const [weight, setWeight] = useState<number | ''>('');
  const [microchip, setMicrochip] = useState("");
  const [notes, setNotes] = useState("");

  const filteredBreeds = selectedSpecies
    ? mockBreeds.filter(breed => breed.speciesId === selectedSpecies)
    : [];

  const handleSaveAnimal = () => {
    if (!selectedTutorId || !animalName.trim() || !selectedSpecies || !gender || !birthday || weight === '') {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newAnimal: Omit<Animal, 'id'> = {
      name: animalName.trim(),
      species: mockSpecies.find(s => s.id === selectedSpecies)?.name || '',
      breed: mockBreeds.find(b => b.id === selectedBreed)?.name || '',
      gender: gender,
      birthday: birthday,
      coatColor: mockCoatTypes.find(c => c.id === coatColor)?.name || '',
      weight: Number(weight),
      microchip: microchip.trim(),
      notes: notes.trim(),
      status: 'Ativo', // Default status
    };

    const addedAnimal = addMockAnimalToClient(selectedTutorId, newAnimal);

    if (addedAnimal) {
      toast.success(`Animal ${addedAnimal.name} adicionado com sucesso ao cliente!`);
      navigate(`/clients/${selectedTutorId}`); // Navegar para a página de detalhes do cliente
    } else {
      toast.error("Erro ao adicionar animal. Cliente não encontrado.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <FaPaw className="h-5 w-5 text-gray-500 dark:text-gray-400" /> Adicionar Animal
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Cadastre um novo animal e suas informações.
              </p>
            </div>
          </div>
          <Link to="/clients">
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; <Link to="/clients" className="hover:text-blue-500 dark:hover:text-blue-400">Clientes</Link> &gt; Adicionar Animal
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="space-y-2">
            <Label htmlFor="tutor">Tutor/Responsável*</Label>
            <Select onValueChange={setSelectedTutorId} value={selectedTutorId} disabled={!!initialClientId}>
              <SelectTrigger id="tutor" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
            <Input id="animalName" placeholder="Nome do animal" value={animalName} onChange={(e) => setAnimalName(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="species">Espécie*</Label>
            <Select onValueChange={setSelectedSpecies} value={selectedSpecies}>
              <SelectTrigger id="species" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
            <Select disabled={!selectedSpecies} onValueChange={setSelectedBreed} value={selectedBreed}>
              <SelectTrigger id="breed" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
            <Label htmlFor="gender">Sexo*</Label>
            <Select onValueChange={(value: Animal['gender']) => setGender(value)} value={gender}>
              <SelectTrigger id="gender" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Macho">Macho</SelectItem>
                <SelectItem value="Fêmea">Fêmea</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthday">Data de Nascimento*</Label>
            <Input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coatColor">Cor da Pelagem</Label>
            <Select onValueChange={setCoatColor} value={coatColor}>
              <SelectTrigger id="coatColor" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
            <Label htmlFor="weight">Peso (kg)*</Label>
            <Input id="weight" type="number" placeholder="Ex: 5.5" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="microchip">Microchip</Label>
            <Input id="microchip" placeholder="Número do microchip" value={microchip} onChange={(e) => setMicrochip(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
          </div>
        </div>

        <div className="mt-6 space-y-2 p-6 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <Label htmlFor="animalNotes">Observações</Label>
          <Textarea id="animalNotes" placeholder="Adicione observações sobre o animal..." rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => navigate("/clients")} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
            <FaTimes className="mr-2 h-4 w-4" /> Cancelar
          </Button>
          <Button onClick={handleSaveAnimal} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
            <FaSave className="mr-2 h-4 w-4" /> Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAnimalPage;