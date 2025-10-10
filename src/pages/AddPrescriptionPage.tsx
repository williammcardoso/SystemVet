"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Plus, Eye } from "lucide-react"; // Adicionado Eye para o botão Visualizar
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Importar componentes do Dialog
import PrescriptionMedicationForm, { MedicationData } from "@/components/PrescriptionMedicationForm";
import PrescriptionPreviewDialog from "@/components/PrescriptionPreviewDialog"; // Importar o novo componente de visualização de PDF
import { toast } from "sonner";

// Mock data para animais e clientes (para exibir informações no cabeçalho)
interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
}

interface Client {
  id: string;
  name: string;
  address: string; // Adicionado endereço para o tutor
  animals: Animal[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "William",
    address: "Rua Exemplo, 123, Cidade - Estado",
    animals: [
      { id: "a1", name: "Totó", species: "Cachorro", breed: "Labrador" },
      { id: "a2", name: "Bolinha", species: "Cachorro", breed: "Poodle" },
    ],
  },
  {
    id: "2",
    name: "Maria",
    address: "Avenida Teste, 456, Outra Cidade - Outro Estado",
    animals: [
      { id: "a3", name: "Fido", species: "Cachorro", breed: "Vira-lata" },
      { id: "a4", name: "Miau", species: "Gato", breed: "Siamês" },
    ],
  },
];

// Mock de receitas existentes (para simular carregamento em modo de edição)
interface PrescriptionEntry {
  id: string;
  date: string;
  medicationName: string; // Resumo para a tabela
  dosePerAdministration: string;
  frequency: string;
  period: string;
  instructions: string; // Observações gerais
  medications: MedicationData[]; // Detalhes completos dos medicamentos
}

const mockPrescriptions: PrescriptionEntry[] = [
  {
    id: "rx1",
    date: "2023-11-01",
    medicationName: "Antibiótico X, Anti-inflamatório Y",
    dosePerAdministration: "Ver detalhes",
    frequency: "Ver detalhes",
    period: "Ver detalhes",
    instructions: "Administrar com alimento e bastante água.",
    medications: [
      {
        id: "med1",
        useType: "Uso Oral",
        pharmacyType: "Farmácia Veterinária",
        medicationName: "Antibiótico X",
        concentration: "250mg",
        pharmaceuticalForm: "Comprimido",
        dosePerAdministration: "1",
        frequency: "12 horas",
        period: "7 dias",
        useCustomInstructions: false,
        generatedInstructions: "Dê 1 comprimido, a cada 12 horas, durante 7 dias.",
        generalObservations: "Não interromper o tratamento.",
        totalQuantity: "14",
        totalQuantityDisplay: "14 comprimido(s)",
        isCollapsed: true,
      },
      {
        id: "med2",
        useType: "Uso Oral",
        pharmacyType: "Farmácia Humana",
        medicationName: "Anti-inflamatório Y",
        concentration: "50mg",
        pharmaceuticalForm: "Cápsula",
        dosePerAdministration: "0.5",
        frequency: "24 horas (1x/dia)",
        period: "5 dias",
        useCustomInstructions: true,
        generatedInstructions: "Meio comprimido uma vez ao dia, por 5 dias, junto com a ração.",
        generalObservations: "",
        totalQuantity: "2.5",
        totalQuantityDisplay: "2.5 cápsula(s)",
        isCollapsed: true,
      },
    ],
  },
];


const AddPrescriptionPage = () => {
  const { clientId, animalId, prescriptionId } = useParams<{ clientId: string; animalId: string; prescriptionId?: string }>();
  const navigate = useNavigate();

  const client = mockClients.find(c => c.id === clientId);
  const animal = client?.animals.find(a => a.id === animalId);

  const [currentPrescriptionMedications, setCurrentPrescriptionMedications] = useState<MedicationData[]>([]);
  const [currentPrescriptionGeneralObservations, setCurrentPrescriptionGeneralObservations] = useState<string>("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Estado para controlar o modal de visualização

  useEffect(() => {
    if (prescriptionId) {
      // Load existing prescription data if in edit mode
      const existingPrescription = mockPrescriptions.find(p => p.id === prescriptionId);
      if (existingPrescription) {
        setCurrentPrescriptionMedications(existingPrescription.medications.map(med => ({ ...med, isCollapsed: true }))); // Collapse existing meds
        setCurrentPrescriptionGeneralObservations(existingPrescription.instructions);
      } else {
        toast.error("Receita não encontrada.");
        navigate(`/clients/${clientId}/animals/${animalId}/record`);
      }
    }
  }, [prescriptionId, clientId, animalId, navigate]);


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

  const handleAddMedication = () => {
    const newMedication: MedicationData = {
      id: `med-${Date.now()}`,
      useType: "",
      pharmacyType: "",
      medicationName: "",
      concentration: "",
      pharmaceuticalForm: "",
      customPharmaceuticalForm: "",
      dosePerAdministration: "",
      frequency: "",
      customFrequency: "",
      period: "",
      customPeriod: "",
      useCustomInstructions: false,
      generatedInstructions: "",
      generalObservations: "",
      totalQuantity: "",
      totalQuantityDisplay: "",
      isCollapsed: false, // New medications start expanded
    };
    setCurrentPrescriptionMedications((prev) => [...prev, newMedication]);
  };

  const handleSaveMedication = (updatedMedication: MedicationData) => {
    setCurrentPrescriptionMedications((prev) =>
      prev.map((med) => (med.id === updatedMedication.id ? updatedMedication : med))
    );
    toast.success(`Medicamento '${updatedMedication.medicationName || 'sem nome'}' salvo no formulário!`);
  };

  const handleDeleteMedication = (id: string) => {
    setCurrentPrescriptionMedications((prev) => prev.filter((med) => med.id !== id));
    toast.info("Medicamento removido do formulário.");
  };

  const handleToggleMedicationCollapse = (id: string) => {
    setCurrentPrescriptionMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, isCollapsed: !med.isCollapsed } : med
      )
    );
  };

  const handleSavePrescription = () => {
    if (currentPrescriptionMedications.length === 0) {
      toast.error("Adicione pelo menos um medicamento à receita.");
      return;
    }

    // Aqui você faria a lógica para salvar a receita (enviar para uma API, etc.)
    // Por enquanto, apenas exibiremos um toast de sucesso e navegaremos de volta.
    console.log("Salvando receita para Cliente:", client.name, "Animal:", animal.name);
    console.log("Medicamentos:", currentPrescriptionMedications);
    console.log("Observações Gerais da Receita:", currentPrescriptionGeneralObservations);

    toast.success("Receita salva com sucesso!");
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  const handleViewPrescription = () => {
    // Verificar se há medicamentos para visualizar
    if (currentPrescriptionMedications.length === 0) {
      toast.error("Adicione pelo menos um medicamento para visualizar a receita.");
      return;
    }
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {prescriptionId ? "Editar Receita" : "Adicionar Nova Receita"} para {animal.name}
        </h1>
        <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 py-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Medicamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentPrescriptionMedications.length === 0 && (
              <p className="text-muted-foreground">Nenhum medicamento adicionado ainda.</p>
            )}
            {currentPrescriptionMedications.map((med, index) => (
              <PrescriptionMedicationForm
                key={med.id}
                medication={med}
                index={index}
                onSave={handleSaveMedication}
                onDelete={handleDeleteMedication}
                onToggleCollapse={handleToggleMedicationCollapse}
              />
            ))}
            <Button onClick={handleAddMedication} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Medicamento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações Gerais da Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="prescriptionGeneralObservations"
              placeholder="Instruções especiais, restrições alimentares, ou outras observações para a receita..."
              rows={5}
              value={currentPrescriptionGeneralObservations}
              onChange={(e) => setCurrentPrescriptionGeneralObservations(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate(`/clients/${clientId}/animals/${animalId}/record`)}>
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button variant="secondary" onClick={handleViewPrescription}>
          <Eye className="mr-2 h-4 w-4" /> Visualizar
        </Button>
        <Button onClick={handleSavePrescription}>
          <Save className="mr-2 h-4 w-4" /> Salvar Receita
        </Button>
      </div>

      {/* Modal de Visualização da Receita (agora para PDF) */}
      <PrescriptionPreviewDialog
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        animalName={animal.name}
        animalId={animal.id}
        animalSpecies={animal.species}
        tutorName={client.name}
        tutorAddress={client.address}
        medications={currentPrescriptionMedications}
        generalObservations={currentPrescriptionGeneralObservations}
      />
    </div>
  );
};

export default AddPrescriptionPage;