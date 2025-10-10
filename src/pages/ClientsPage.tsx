import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, RotateCcw, Settings, Eye, User, Phone, Home } from "lucide-react"; // Adicionado novos ícones
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; // Importar Badge

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
  cpf: string;
  contact: { phone: string; email: string };
  address: string;
  lastConsultation: string;
  animals: Animal[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "William",
    cpf: "123.456.789-00",
    contact: { phone: "(19) 99999-1234", email: "william@email.com" },
    address: "Rua das Flores, 123",
    lastConsultation: "14/01/2024",
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
    name: "Maria Silva",
    cpf: "987.654.321-00",
    contact: { phone: "(11) 99999-5678", email: "maria@email.com" },
    address: "Av. Principal, 456",
    lastConsultation: "09/01/2024",
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
    name: "João Santos",
    cpf: "456.789.123-00",
    contact: { phone: "(11) 99999-9012", email: "joao@email.com" },
    address: "Rua do Campo, 789",
    lastConsultation: "07/01/2024",
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
    name: "Ana Costa",
    cpf: "111.222.333-44",
    contact: { phone: "(21) 98765-4321", email: "ana@email.com" },
    address: "Av. Beira Mar, 100",
    lastConsultation: "01/02/2024",
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
      const matchesResponsible = client.name.toLowerCase().includes(lowerCaseResponsibleSearch) ||
                                 client.cpf.includes(lowerCaseResponsibleSearch) ||
                                 client.contact.phone.includes(lowerCaseResponsibleSearch) ||
                                 client.contact.email.toLowerCase().includes(lowerCaseResponsibleSearch);
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tutores</h1>
          <p className="text-muted-foreground">Gestão de tutores dos pacientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/clients/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Tutor
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 p-4 bg-card rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF ou telefone..."
            className="w-full pl-9"
            value={responsibleSearch}
            onChange={(e) => setResponsibleSearch(e.target.value)}
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
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Lista de Tutores ({filteredClients.length})</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Pets</TableHead>
              <TableHead>Última Consulta</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.cpf}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" /> {client.contact.phone}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" /> {client.contact.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Home className="h-3 w-3 text-muted-foreground" /> {client.address}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-badge-green text-badge-green-foreground">
                    {client.animals.length} pet(s)
                  </Badge>
                </TableCell>
                <TableCell>{client.lastConsultation}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/clients/${client.id}`}>
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
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhum tutor encontrado.
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