import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, RotateCcw, Settings, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // Importar cn

// Mock data (centralizado aqui para facilitar o exemplo, mas idealmente viria de um serviço)
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


const ClientsPage = () => {
  const [responsibleSearch, setResponsibleSearch] = useState("");
  const [animalSearch, setAnimalSearch] = useState("");
  const [filteredClients, setFilteredClients] = useState<Client[]>(mockClients);

  const handleSearch = () => {
    const lowerCaseResponsibleSearch = responsibleSearch.toLowerCase();
    const lowerCaseAnimalSearch = animalSearch.toLowerCase();

    const results = mockClients.filter(client => {
      const matchesResponsible = client.name.toLowerCase().includes(lowerCaseResponsibleSearch);
      const matchesAnimal = client.animals.some(animal =>
        animal.name.toLowerCase().includes(lowerCaseAnimalSearch)
      );
      return matchesResponsible && (animalSearch === "" || matchesAnimal);
    });
    setFilteredClients(results);
  };

  const handleReset = () => {
    setResponsibleSearch("");
    setAnimalSearch("");
    setFilteredClients(mockClients);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[150px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Responsável"
            className="pl-9 focus-visible:ring-primary transition-all duration-200"
            value={responsibleSearch}
            onChange={(e) => setResponsibleSearch(e.target.value)}
          />
        </div>
        <div className="relative flex-1 min-w-[150px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Animal"
            className="pl-9 focus-visible:ring-primary transition-all duration-200"
            value={animalSearch}
            onChange={(e) => setAnimalSearch(e.target.value)}
          />
        </div>
        <Button variant="secondary" size="icon" onClick={handleSearch} className="rounded-md hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="rounded-md hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
          <Filter className="h-4 w-4" /> {/* Placeholder for advanced filter */}
        </Button>
        <Button variant="secondary" size="icon" onClick={handleReset} className="rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Link to="/clients/add">
          <Button className="rounded-md bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground font-bold transition-all duration-200">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Responsável
          </Button>
        </Link>
        <Link to="/animals/add">
          <Button variant="outline" className="rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Animal
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Animais</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client, index) => (
              <TableRow key={client.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                <TableCell className="font-medium">{client.name} ({client.animals.length})</TableCell>
                <TableCell>{client.animals.map(a => a.name).join(", ")}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/clients/${client.id}`}>
                    <Button variant="ghost" size="sm" className="rounded-md hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                      <Eye className="h-4 w-4 mr-2" /> Ver
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsPage;