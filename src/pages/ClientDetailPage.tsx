import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PawPrint, Eye, Edit, Trash2 } from "lucide-react"; // Adicionado Edit e Trash2
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  animals: Animal[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "William",
    cpf: "123.456.789-00",
    contact: { phone: "(19) 99999-1234", email: "william@email.com" },
    address: "Rua das Flores, 123",
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
    animals: [],
  },
];

const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const client = mockClients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Tutor não encontrado.</h1>
        <Link to="/clients">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Tutores
          </Button>
        </Link>
      </div>
    );
  }

  const handleViewRecord = (animalId: string) => {
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Detalhes do Tutor: {client.name}</h1>
          <p className="text-muted-foreground">Informações completas e animais associados</p>
        </div>
        <Link to="/clients">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Tutores
          </Button>
        </Link>
      </div>

      <Card className="mb-6 shadow-sm rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informações do Tutor</CardTitle>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-2" /> Editar Tutor
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Nome:</p>
            <p className="font-medium text-foreground">{client.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">CPF:</p>
            <p className="font-medium text-foreground">{client.cpf}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Telefone:</p>
            <p className="font-medium text-foreground">{client.contact.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email:</p>
            <p className="font-medium text-foreground">{client.contact.email}</p>
          </div>
          <div className="col-span-full">
            <p className="text-muted-foreground">Endereço:</p>
            <p className="font-medium text-foreground">{client.address}</p>
          </div>
          {/* Adicione mais detalhes do cliente aqui se disponíveis */}
        </CardContent>
      </Card>

      <Card className="shadow-sm rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pacientes de {client.name}</CardTitle>
          <Link to="/animals/add"> {/* Link para adicionar animal, talvez com pré-seleção do tutor */}
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Adicionar Paciente
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {client.animals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Espécie</TableHead>
                  <TableHead>Raça</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.animals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">{animal.name}</TableCell>
                    <TableCell>{animal.species}</TableCell>
                    <TableCell>{animal.breed}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewRecord(animal.id)} className="mr-1">
                        <Eye className="h-4 w-4" /> Ver Prontuário
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground p-4">Nenhum paciente cadastrado para este tutor.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetailPage;