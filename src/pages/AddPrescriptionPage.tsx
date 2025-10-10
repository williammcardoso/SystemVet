import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Eye, X, Save, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PrescriptionMedicationForm, { MedicationData } from "@/components/PrescriptionMedicationForm";
import PrescriptionPreviewDialog from "@/components/PrescriptionPreviewDialog"; // Nova importação
import { toast } from "sonner"; // Importar toast para notificações

// Mock data para clientes (tutores)
const mockClients = [
  { id: "1", name: "William" },
  { id: "2", name: "Maria" },
  { id: "3", name: "João" },
  { id: "4", name: "Ana" },
  { id: "5", name: "Zara" }, // Adicionado Zara para o exemplo do print
];

const AddPrescriptionPage = () => {
  const { clientId, animalId } = useParams<{ clientId: string; animalId: string }>();
  const navigate = useNavigate();

  const [selectedClient, setSelectedClient] = useState<string | undefined>(clientId);
  const [medications, setMedications] = useState<MedicationData[]>([]);
  const [generalObservations, setGeneralObservations] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Novo estado para o diálogo de pré-visualização

  const handleAddMedication = () => {
    const newMedication: MedicationData = {
      id: `med-${Date.now()}`,
      useType: "",
      pharmacyType: "",
      medicationName: "",
      concentration: "",
      pharmaceuticalForm: "",
      dosePerAdministration: "",
      frequency: "",
      period: "",
      useCustomInstructions: false,
      generatedInstructions: "",
      generalObservations: "", // This field is for individual medication observations, not the general one
      totalQuantity: "",
    };
    setMedications((prev) => [...prev, newMedication]);
  };

  const handleSaveMedication = (updatedMedication: MedicationData) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === updatedMedication.id ? updatedMedication : med))
    );
    toast.success(`Medicamento '${updatedMedication.medicationName || 'sem nome'}' salvo!`);
  };

  const handleDeleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
    toast.info("Medicamento removido.");
  };

  const handleToggleMedicationCollapse = (id: string) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, isCollapsed: !med.isCollapsed } : med
      )
    );
  };

  const handleSavePrescription = () => {
    if (!selectedClient) {
      toast.error("Por favor, selecione um paciente.");
      return;
    }
    if (medications.length === 0) {
      toast.error("Adicione pelo menos um medicamento à receita.");
      return;
    }

    // Aqui você faria a lógica para salvar a receita completa (enviar para uma API, etc.)
    console.log("Salvando Receita para Cliente:", selectedClient);
    console.log("Medicamentos:", medications);
    console.log("Observações Gerais:", generalObservations);

    toast.success("Receita salva com sucesso!");
    navigate(`/clients/${clientId}/animals/${animalId}/record`); // Voltar para o prontuário
  };

  const handlePreview = () => {
    if (!selectedClient) {
      toast.error("Por favor, selecione um paciente para pré-visualizar.");
      return;
    }
    if (medications.length === 0) {
      toast.error("Adicione pelo menos um medicamento para pré-visualizar.");
      return;
    }
    setIsPreviewOpen(true);
  };

  const selectedClientName = mockClients.find(c => c.id === selectedClient)?.name || "";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LinkIcon className="h-6 w-6 text-primary" /> Nova Receita Simples
        </h1>
        <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
          </Button>
        </Link>
      </div>

      <p className="text-muted-foreground mb-6">
        Selecione o paciente, adicione medicamentos e veja as instruções sendo geradas automaticamente
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="patient-select">Paciente</Label>
            <Select onValueChange={setSelectedClient} value={selectedClient}>
              <SelectTrigger id="patient-select">
                <SelectValue placeholder="Selecione o paciente..." />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Medicamentos</CardTitle>
          <Button onClick={handleAddMedication}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Medicamento
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {medications.length === 0 && (
            <p className="text-muted-foreground">Nenhum medicamento adicionado ainda.</p>
          )}
          {medications.map((med, index) => (
            <PrescriptionMedicationForm
              key={med.id}
              medication={med}
              index={index}
              onSave={handleSaveMedication}
              onDelete={handleDeleteMedication}
              onToggleCollapse={handleToggleMedicationCollapse}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Observações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="generalObservations"
            placeholder="Instruções especiais, restrições alimentares, ou outras observações..."
            rows={5}
            value={generalObservations}
            onChange={(e) => setGeneralObservations(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate(`/clients/${clientId}/animals/${animalId}/record`)}>
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button variant="outline" onClick={handlePreview}> {/* Botão Visualizar atualizado */}
          <Eye className="mr-2 h-4 w-4" /> Visualizar
        </Button>
        <Button onClick={handleSavePrescription}>
          <Save className="mr-2 h-4 w-4" /> Salvar Receita Simples
        </Button>
      </div>

      <PrescriptionPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        clientName={selectedClientName}
        medications={medications}
        generalObservations={generalObservations}
      />
    </div>
  );
};

export default AddPrescriptionPage;