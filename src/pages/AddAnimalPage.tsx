import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, X } from "lucide-react";
import { Link } from "react-router-dom";

const AddAnimalPage = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Adicionar Animal</h1>
        <Link to="/clients"> {/* Pode ser alterado para voltar para a página de detalhes do cliente */}
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="animalName">Nome do Animal*</Label>
          <Input id="animalName" placeholder="Nome do animal" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="species">Espécie*</Label>
          <Select>
            <SelectTrigger id="species">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Cachorro</SelectItem>
              <SelectItem value="cat">Gato</SelectItem>
              <SelectItem value="bird">Pássaro</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="breed">Raça</Label>
          <Input id="breed" placeholder="Raça" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Sexo</Label>
          <Select>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Macho</SelectItem>
              <SelectItem value="female">Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthday">Data de Nascimento</Label>
          <Input id="birthday" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coatColor">Cor da Pelagem</Label>
          <Input id="coatColor" placeholder="Cor da pelagem" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input id="weight" type="number" placeholder="Ex: 5.5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="microchip">Microchip</Label>
          <Input id="microchip" placeholder="Número do microchip" />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Label htmlFor="animalNotes">Observações</Label>
        <Textarea id="animalNotes" placeholder="Adicione observações sobre o animal..." rows={5} />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline">
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button>
          <Save className="mr-2 h-4 w-4" /> Salvar
        </Button>
      </div>
    </div>
  );
};

export default AddAnimalPage;