import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaPaw, FaPlus, FaEye } from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils"; // Importar cn
import { mockClients } from "@/mockData/clients"; // Importar o mock de clientes centralizado
import { Client, Animal } from "@/types/client"; // Importar as interfaces Client e Animal

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
            <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
          </Button>
        </Link>
      </div>
    );
  }

  const handleViewRecord = (animalId: string) => {
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <FaUsers className="h-5 w-5 text-gray-500 dark:text-gray-400" /> Detalhes do Cliente: {client.name}
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Visualize as informações do responsável e seus animais.
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
          Painel &gt; <Link to="/clients" className="hover:text-blue-500 dark:hover:text-blue-400">Clientes</Link> &gt; {client.name}
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid gap-6 py-4 max-w-5xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-blue-400 dark:bg-gray-800/90">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                <FaUsers className="h-5 w-5 text-blue-500" /> Informações do Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <p className="text-[#4B5563] dark:text-gray-400 font-medium">Nome: <span className="font-normal text-foreground">{client.name}</span></p>
              <p className="text-[#4B5563] dark:text-gray-400 font-medium">Email: <span className="font-normal text-foreground">{client.mainEmailContact}</span></p>
              <p className="text-[#4B5563] dark:text-gray-400 font-medium">Telefone: <span className="font-normal text-foreground">{client.mainPhoneContact}</span></p>
              {/* Adicione mais detalhes do cliente aqui se disponíveis */}
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-purple-400 dark:bg-gray-800/90">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                <FaPaw className="h-5 w-5 text-purple-500" /> Animais de {client.name}
              </CardTitle>
              <Link to={`/animals/add?clientId=${client.id}`}> {/* Passa o clientId como parâmetro */}
                <Button size="sm" className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <FaPlus className="h-4 w-4 mr-2" /> Adicionar Animal
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-0">
              {client.animals.length > 0 ? (
                <div className="overflow-hidden">
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
                      {client.animals.map((animal, index) => (
                        <TableRow key={animal.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                          <TableCell className="font-medium">{animal.name}</TableCell>
                          <TableCell>{animal.species}</TableCell>
                          <TableCell>{animal.breed}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewRecord(animal.id)} className="rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                              <FaEye className="h-4 w-4 mr-2" /> Ver Prontuário
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground py-4">Nenhum animal cadastrado para este cliente.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;