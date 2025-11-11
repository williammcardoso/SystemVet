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

// Mock data for species
const mockSpecies = [
  { id: "1", name: "Canino" },
  { id: "2", name: "Felino" },
  { id: "3", name: "Pássaro" },
  { id: "4", name: "Roedor" },
  { id: "other", name: "Outro" },
];

// Mock data for breeds, categorized by speciesId
const mockBreeds = [
  // Canino (speciesId: "1")
  { id: "c1", name: "SRD / Vira-lata", speciesId: "1" },
  { id: "c2", name: "American Bully", speciesId: "1" },
  { id: "c3", name: "Beagle", speciesId: "1" },
  { id: "c4", name: "Bernese Mountain Dog", speciesId: "1" },
  { id: "c5", name: "Bichon Frisé", speciesId: "1" },
  { id: "c6", name: "Border Collie", speciesId: "1" },
  { id: "c7", name: "Boxer", speciesId: "1" },
  { id: "c8", name: "Bulldog Francês", speciesId: "1" },
  { id: "c9", name: "Cane Corso", speciesId: "1" },
  { id: "c10", name: "Chihuahua", speciesId: "1" },
  { id: "c11", name: "Chow Chow", speciesId: "1" },
  { id: "c12", name: "Cocker Spaniel", speciesId: "1" },
  { id: "c13", name: "Dachshund (Salsicha)", speciesId: "1" },
  { id: "c14", name: "Dogue Alemão", speciesId: "1" },
  { id: "c15", name: "Golden Retriever", speciesId: "1" },
  { id: "c16", name: "Husky Siberiano", speciesId: "1" },
  { id: "c17", name: "Labrador Retriever", speciesId: "1" },
  { id: "c18", name: "Lhasa Apso", speciesId: "1" },
  { id: "c19", name: "Lulu da Pomerânia (Spitz Alemão)", speciesId: "1" },
  { id: "c20", name: "Maltês", speciesId: "1" },
  { id: "c21", name: "Pastor Alemão", speciesId: "1" },
  { id: "c22", name: "Pastor Australiano", speciesId: "1" },
  { id: "c23", name: "Pastor Belga Malinois", speciesId: "1" },
  { id: "c24", name: "Pinscher Miniatura", speciesId: "1" },
  { id: "c25", name: "Pit Bull (American Pit Bull Terrier)", speciesId: "1" },
  { id: "c26", name: "Pit Monster", speciesId: "1" },
  { id: "c27", name: "Poodle", speciesId: "1" },
  { id: "c28", name: "Pug", speciesId: "1" },
  { id: "c29", name: "Rottweiler", speciesId: "1" },
  { id: "c30", name: "Schnauzer", speciesId: "1" },
  { id: "c31", name: "Shih Tzu", speciesId: "1" },
  { id: "c32", name: "Staffordshire Terrier (Amstaff)", speciesId: "1" },
  { id: "c33", name: "Yorkshire Terrier", speciesId: "1" },

  // Felino (speciesId: "2")
  { id: "f1", name: "SRD / Vira-lata", speciesId: "2" },
  { id: "f2", name: "American Shorthair", speciesId: "2" },
  { id: "f3", name: "Angorá Turco", speciesId: "2" },
  { id: "f4", name: "Azul Russo", speciesId: "2" },
  { id: "f5", name: "Bengal", speciesId: "2" },
  { id: "f6", name: "Maine Coon", speciesId: "2" },
  { id: "f7", name: "Persa", speciesId: "2" },
  { id: "f8", name: "Ragdoll", speciesId: "2" },
  { id: "f9", name: "Siamês", speciesId: "2" },
  { id: "f10", name: "Sphynx", speciesId: "2" },

  // Pássaro (speciesId: "3")
  { id: "p1", name: "Calopsita", speciesId: "3" },
  { id: "p2", name: "Canário", speciesId: "3" },
  { id: "p3", name: "Periquito", speciesId: "3" },
  { id: "p4", name: "Agapornis", speciesId: "3" },
  { id: "p5", name: "Cacatua", speciesId: "3" },
  { id: "p6", name: "Papagaio", speciesId: "3" },

  // Roedor (speciesId: "4")
  { id: "r1", name: "Hamster", speciesId: "4" },
  { id: "r2", name: "Porquinho-da-Índia", speciesId: "4" },
  { id: "r3", name: "Coelho", speciesId: "4" },
  { id: "r4", name: "Chinchila", speciesId: "4" },
  { id: "r5", name: "Rato Twister", speciesId: "4" },
];

// Mock data for coat types (sorted alphabetically)
const mockCoatTypesBase = [
  { id: "ct5", name: "Amarelo" },
  { id: "ct9", name: "Bicolor (Duas cores)" },
  { id: "ct2", name: "Branco" },
  { id: "ct4", name: "Caramelo (Dourado/Fulvo)" },
  { id: "ct6", name: "Cinza (Azul/Prata)" },
  { id: "ct7", name: "Creme (Bege)" },
  { id: "ct8", name: "Laranja (Vermelho)" },
  { id: "ct12", name: "Malhado (Com manchas)" },
  { id: "ct3", name: "Marrom (Chocolate)" },
  { id: "ct1", name: "Preto" },
  { id: "ct11", name: "Tigrado (Listrado)" },
  { id: "ct10", name: "Tricolor (Três cores)" },
];

const AddAnimalPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialClientId = searchParams.get('clientId');

  const [selectedTutorId, setSelectedTutorId] = useState<string | undefined>(initialClientId || undefined);
  const [animalName, setAnimalName] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>(undefined);
  const [customSpeciesName, setCustomSpeciesName] = useState(""); // New state for custom species
  const [selectedBreed, setSelectedBreed] = useState<string | undefined>(undefined);
  const [customBreedName, setCustomBreedName] = useState(""); // New state for custom breed
  const [gender, setGender] = useState<Animal['gender'] | undefined>(undefined);
  const [birthday, setBirthday] = useState("");
  const [selectedCoatColor, setSelectedCoatColor] = useState<string | undefined>(undefined);
  const [customCoatColorName, setCustomCoatColorName] = useState(""); // New state for custom coat color
  const [weight, setWeight] = useState<number | ''>('');
  const [microchip, setMicrochip] = useState("");
  const [notes, setNotes] = useState("");

  // Filter breeds based on selected species and sort them
  const getFilteredBreeds = () => {
    if (!selectedSpecies) return [];
    if (selectedSpecies === "other") return [{ id: "other-custom", name: "Outra Raça", speciesId: "other" }];

    const breedsForSpecies = mockBreeds.filter(breed => breed.speciesId === selectedSpecies);

    // Separate SRD / Vira-lata
    const srdBreed = breedsForSpecies.find(b => b.name === "SRD / Vira-lata");
    const otherBreeds = breedsForSpecies.filter(b => b.name !== "SRD / Vira-lata");

    // Sort other breeds alphabetically
    const sortedOtherBreeds = [...otherBreeds].sort((a, b) => a.name.localeCompare(b.name));

    // Combine SRD (if exists), sorted other breeds, and then "Outra Raça"
    const finalBreeds = [];
    if (srdBreed) {
      finalBreeds.push(srdBreed);
    }
    finalBreeds.push(...sortedOtherBreeds);
    finalBreeds.push({ id: `other-${selectedSpecies}`, name: "Outra Raça", speciesId: selectedSpecies });

    return finalBreeds;
  };

  // Prepare coat color options with "Outra Cor" at the end
  const getCoatColorOptions = () => {
    const sortedColors = [...mockCoatTypesBase].sort((a, b) => a.name.localeCompare(b.name));
    return [...sortedColors, { id: "other-color", name: "Outra Cor" }];
  };

  // Reset breed and custom breed when species changes
  useEffect(() => {
    setSelectedBreed(undefined);
    setCustomBreedName("");
  }, [selectedSpecies]);

  // Reset custom species name if "Outro" is deselected
  useEffect(() => {
    if (selectedSpecies !== "other") {
      setCustomSpeciesName("");
    }
  }, [selectedSpecies]);

  // Reset custom breed name if "Outra Raça" is deselected
  useEffect(() => {
    if (selectedBreed && !selectedBreed.startsWith("other-")) {
      setCustomBreedName("");
    }
  }, [selectedBreed]);

  // Reset custom coat color name if "Outra Cor" is deselected
  useEffect(() => {
    if (selectedCoatColor !== "other-color") {
      setCustomCoatColorName("");
    }
  }, [selectedCoatColor]);


  const handleSaveAnimal = () => {
    // Determine final species name
    const finalSpeciesName = selectedSpecies === "other"
      ? customSpeciesName.trim()
      : mockSpecies.find(s => s.id === selectedSpecies)?.name || '';

    // Determine final breed name
    const finalBreedName = selectedBreed && selectedBreed.startsWith("other-")
      ? customBreedName.trim()
      : mockBreeds.find(b => b.id === selectedBreed)?.name || '';

    // Determine final coat color name
    const finalCoatColorName = selectedCoatColor === "other-color"
      ? customCoatColorName.trim()
      : mockCoatTypesBase.find(c => c.id === selectedCoatColor)?.name || '';

    // Basic validation
    if (!selectedTutorId || !animalName.trim() || !finalSpeciesName || !gender || !birthday || weight === '') {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (selectedSpecies === "other" && !customSpeciesName.trim()) {
      toast.error("Por favor, digite o nome da espécie personalizada.");
      return;
    }
    if (selectedBreed && selectedBreed.startsWith("other-") && !customBreedName.trim()) {
      toast.error("Por favor, digite o nome da raça personalizada.");
      return;
    }
    if (selectedCoatColor === "other-color" && !customCoatColorName.trim()) {
      toast.error("Por favor, digite o nome da cor da pelagem personalizada.");
      return;
    }


    const newAnimal: Omit<Animal, 'id'> = {
      name: animalName.trim(),
      species: finalSpeciesName,
      breed: finalBreedName,
      gender: gender,
      birthday: birthday,
      coatColor: finalCoatColorName,
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
            {selectedSpecies === "other" && (
              <Input
                id="customSpeciesName"
                placeholder="Digite a espécie"
                value={customSpeciesName}
                onChange={(e) => setCustomSpeciesName(e.target.value)}
                className="mt-2 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="breed">Raça</Label>
            <Select disabled={!selectedSpecies || selectedSpecies === "other"} onValueChange={setSelectedBreed} value={selectedBreed}>
              <SelectTrigger id="breed" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {getFilteredBreeds().map((breed) => (
                  <SelectItem key={breed.id} value={breed.id}>
                    {breed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBreed && selectedBreed.startsWith("other-") && (
              <Input
                id="customBreedName"
                placeholder="Digite a raça"
                value={customBreedName}
                onChange={(e) => setCustomBreedName(e.target.value)}
                className="mt-2 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
              />
            )}
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
            <Select onValueChange={setSelectedCoatColor} value={selectedCoatColor}>
              <SelectTrigger id="coatColor" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {getCoatColorOptions().map((coatType) => (
                  <SelectItem key={coatType.id} value={coatType.id}>
                    {coatType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCoatColor === "other-color" && (
              <Input
                id="customCoatColorName"
                placeholder="Digite a cor da pelagem"
                value={customCoatColorName}
                onChange={(e) => setCustomCoatColorName(e.target.value)}
                className="mt-2 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
              />
            )}
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