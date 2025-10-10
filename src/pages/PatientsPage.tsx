import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, RotateCcw, Eye, PawPrint, User, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
  tutorId: string;
  tutorName: string;
  lastConsultation: string;
  status: "Ativo" | "Inativo";
}

const mockAnimals: Animal[] = [
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
    tutorId: "1",
    tutorName: "William",
    lastConsultation: "14/01/2024",
    status: "Ativo",
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
    tutorId: "1",
    tutorName: "William",
    lastConsultation: "10/03/2024",
    status: "Ativo",
  },
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
    tutorId: "2",
    tutorName: "Maria Silva",
    lastConsultation: "09/01/2024",
    status: "Ativo",
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
    tutorId: "2",
    tutorName: "Maria Silva",
    lastConsultation: "05/02/2024",
    status: "Ativo",
  },
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
    tutorId: "3",
    tutorName: "João Santos",
    lastConsultation: "07/01/2024",
    status: "Ativo",
  },
];

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>(mockAnimals);

  const handleSearch = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = mockAnimals.filter(animal =>
      animal.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      animal.species.toLowerCase().includes(lowerCaseSearchTerm) ||
      animal.breed.toLowerCase().includes(lowerCaseSearchTerm) ||
      animal.tutorName.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredAnimals(results);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredAnimals(mockAnimals);
  };

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
          <p className="text-muted-foreground">Gestão de pacientes e pets</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/animals/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Paciente
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 p-4 bg-card rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do pet, tutor ou espécie..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>
          <Filter className="h-4 w-4 mr-2" /> Filtros
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm bg-card">
        <div className="p-4 border-b flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Lista de Pacientes ({filteredAnimals.length})</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Espécie/Raça</TableHead>
              <TableHead>Idade/Sexo</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Última Consulta</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnimals.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell className="font-medium">{animal.name}</TableCell>
                <TableCell>{animal.species} / {animal.breed}</TableCell>
                <TableCell>
                  {/* Cálculo de idade simplificado para exemplo */}
                  {new Date().getFullYear() - new Date(animal.birthday).getFullYear()} anos / {animal.gender}
                </TableCell>
                <TableCell>
                  <Link to={`/clients/${animal.tutorId}`} className="text-primary hover:underline flex items-center gap-1">
                    <User className="h-3 w-3" /> {animal.tutorName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {animal.weight}kg
                  </Badge>
                </TableCell>
                <TableCell>{animal.lastConsultation}</TableCell>
                <TableCell>
                  <Badge variant={animal.status === "Ativo" ? "default" : "secondary"} className={animal.status === "Ativo" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}>
                    {animal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/clients/${animal.tutorId}/animals/${animal.id}/record`}>
                    <Button variant="ghost" size="sm" className="mr-1">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="mr-1">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredAnimals.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum paciente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientsPage;