import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, RotateCcw, Settings, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface Client {
  id: string;
  name: string;
  animals: string[];
}

const mockClients: Client[] = [
  { id: "1", name: "William (1)", animals: ["Totó"] },
  { id: "2", name: "Maria (2)", animals: ["Fido", "Miau"] },
  { id: "3", name: "João (1)", animals: ["Rex"] },
  { id: "4", name: "Ana (0)", animals: [] },
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
        animal.toLowerCase().includes(lowerCaseAnimalSearch)
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
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Responsável"
          className="max-w-xs"
          value={responsibleSearch}
          onChange={(e) => setResponsibleSearch(e.target.value)}
        />
        <Input
          placeholder="Animal"
          className="max-w-xs"
          value={animalSearch}
          onChange={(e) => setAnimalSearch(e.target.value)}
        />
        <Button variant="secondary" size="icon" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <Filter className="h-4 w-4" /> {/* Placeholder for advanced filter */}
        </Button>
        <Button variant="secondary" size="icon" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Link to="/clients/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Animais</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.animals.join(", ")}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/clients/${client.id}`}> {/* Link to client detail page */}
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> Ver
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
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