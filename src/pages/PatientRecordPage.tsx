import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, CalendarDays, Stethoscope, DollarSign, Syringe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Mock data para atendimentos, exames, vendas
const mockAppointments = [
  { id: "app1", date: "2023-10-26", type: "Consulta de Rotina", vet: "Dr. Silva", notes: "Animal saudável." },
  { id: "app2", date: "2024-03-10", type: "Vacinação Anual", vet: "Dra. Costa", notes: "Vacina V8 aplicada." },
];

const mockExams = [
  { id: "ex1", date: "2023-10-25", type: "Hemograma Completo", result: "Normal", vet: "Dr. Silva" },
  { id: "ex2", date: "2024-03-09", type: "Exame de Fezes", result: "Negativo para parasitas", vet: "Dra. Costa" },
];

const mockSales = [
  { id: "sale1", date: "2023-10-26", item: "Ração Premium 1kg", quantity: 1, total: 50.00 },
  { id: "sale2", date: "2024-03-10", item: "Brinquedo para Cachorro", quantity: 1, total: 25.00 },
];


const PatientRecordPage = () => {
  const { clientId, animalId } = useParams<{ clientId: string; animalId: string }>();

  const client = mockClients.find(c => c.id === clientId);
  const animal = client?.animals.find(a => a.id === animalId);

  if (!client || !animal) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Animal ou Cliente não encontrado.</h1>
        <Link to="/clients">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{animal.name} - Prontuário</h1>
        <Link to={`/clients/${client.id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para {client.name}
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Informações do Animal</h2>
        <Card>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tutor:</p>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Espécie:</p>
              <p className="font-medium">{animal.species}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Raça:</p>
              <p className="font-medium">{animal.breed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sexo:</p>
              <p className="font-medium">{animal.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nascimento:</p>
              <p className="font-medium">{animal.birthday}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pelagem:</p>
              <p className="font-medium">{animal.coatColor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peso:</p>
              <p className="font-medium">{animal.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Microchip:</p>
              <p className="font-medium">{animal.microchip || "N/A"}</p>
            </div>
            <div className="col-span-full">
              <p className="text-sm text-muted-foreground">Observações:</p>
              <p className="font-medium">{animal.notes || "Nenhuma observação."}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="appointments">
            <Stethoscope className="h-4 w-4 mr-2" /> Atendimento
          </TabsTrigger>
          <TabsTrigger value="exams">
            <CalendarDays className="h-4 w-4 mr-2" /> Exames
          </TabsTrigger>
          <TabsTrigger value="sales">
            <DollarSign className="h-4 w-4 mr-2" /> Vendas
          </TabsTrigger>
          <TabsTrigger value="vaccines">
            <Syringe className="h-4 w-4 mr-2" /> Vacinas
          </TabsTrigger>
          {/* Adicione mais abas conforme necessário */}
        </TabsList>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Atendimentos</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Atendimento
              </Button>
            </CardHeader>
            <CardContent>
              {mockAppointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Veterinário</TableHead>
                      <TableHead>Observações</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAppointments.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>{app.vet}</TableCell>
                        <TableCell>{app.notes}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhum atendimento registrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Exames</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Exame
              </Button>
            </CardHeader>
            <CardContent>
              {mockExams.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Veterinário</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>{exam.type}</TableCell>
                        <TableCell>{exam.result}</TableCell>
                        <TableCell>{exam.vet}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhum exame registrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Vendas</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Venda
              </Button>
            </CardHeader>
            <CardContent>
              {mockSales.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.item}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhuma venda registrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccines" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Vacinas</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Vacina
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhuma vacina registrada.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientRecordPage;