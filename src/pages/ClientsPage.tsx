import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, RotateCcw, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const ClientsPage = () => {
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
        <Input placeholder="Responsável" className="max-w-xs" />
        <Input placeholder="Animal" className="max-w-xs" />
        <Button variant="secondary" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
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
            <TableRow>
              <TableCell className="font-medium">William (1)</TableCell>
              <TableCell>Totó</TableCell>
              <TableCell className="text-right">
                {/* Placeholder for actions like View/Edit */}
                <Button variant="ghost" size="sm">Ver</Button>
              </TableCell>
            </TableRow>
            {/* Add more client rows here */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsPage;