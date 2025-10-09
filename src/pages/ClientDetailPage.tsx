import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PawPrint, Eye } from "lucide-react";
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

const ClientDetailPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();

  const client = mockClients.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Cliente não encontrado.</h1>
        <Link to="/clients">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
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
        <h1 className="text-3xl font-bold">Detalhes do Cliente: {client.name}</h1>
        <Link to="/clients">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Responsável</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nome: <span className="font-medium text-foreground">{client.name}</span></p>
          {/* Adicione mais detalhes do cliente aqui se disponíveis */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Animais de {client.name}</CardTitle>
          <Link to="/animals/add"> {/* Link para adicionar animal, talvez com pré-seleção do tutor */}
            <Button size="sm">
              <PawPrint className="h-4 w-4 mr-2" /> Adicionar Animal
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
                      <Button variant="ghost" size="sm" onClick={() => handleViewRecord(animal.id)}>
                        <Eye className="h-4 w-4 mr-2" /> Ver Prontuário
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">Nenhum animal cadastrado para este cliente.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetailPage;