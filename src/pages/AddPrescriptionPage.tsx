"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTimes, FaEye, FaSave, FaPrint, FaDownload } from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // Importar Label
import PrescriptionMedicationForm, { MedicationData } from "@/components/PrescriptionMedicationForm";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { PrescriptionPdfContent } from "@/components/PrescriptionPdfContent";
import { PrescriptionEntry } from "@/types/medication";
import { mockPrescriptions } from "@/mockData/prescriptions";

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


const AddPrescriptionPage = () => {
  const { clientId, animalId, prescriptionId } = useParams<{ clientId: string; animalId: string; prescriptionId?: string }>();
  const navigate = useNavigate();

  const client = mockClients.find(c => c.id === clientId);
  const animal = client?.animals.find(a => a.id === animalId);

  const [currentPrescriptionMedications, setCurrentPrescriptionMedications] = useState<MedicationData[]>([]);
  const [currentPrescriptionGeneralObservations, setCurrentPrescriptionGeneralObservations] = useState<string>("");
  const [treatmentDescription, setTreatmentDescription] = useState<string>(""); // Novo estado para a descrição do tratamento

  useEffect(() => {
    if (prescriptionId) {
      // Load existing prescription data if in edit mode
      const existingPrescription = mockPrescriptions.find(p => p.id === prescriptionId);
      if (existingPrescription) {
        setCurrentPrescriptionMedications(existingPrescription.medications.map(med => ({ ...med, isCollapsed: true }))); // Collapse existing meds
        setCurrentPrescriptionGeneralObservations(existingPrescription.instructions);
        setTreatmentDescription(existingPrescription.treatmentDescription || ""); // Carregar descrição do tratamento
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
            <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
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

    // Generate a summary medication name for the table display
    const summaryMedicationName = currentPrescriptionMedications
      .map(med => med.medicationName)
      .filter(name => name.trim() !== "")
      .join(", ");

    const newPrescription: PrescriptionEntry = {
      id: prescriptionId || `rx-${Date.now()}`, // Use existing ID if editing, otherwise new ID
      date: new Date().toISOString().split('T')[0],
      medicationName: summaryMedicationName || "Receita sem medicamentos",
      treatmentDescription: treatmentDescription.trim() || undefined, // Salvar a descrição do tratamento
      instructions: currentPrescriptionGeneralObservations,
      medications: currentPrescriptionMedications.map(med => ({ ...med, isCollapsed: true })), // Ensure all are collapsed when saved
    };

    if (prescriptionId) {
      // Update existing prescription
      const index = mockPrescriptions.findIndex(p => p.id === prescriptionId);
      if (index !== -1) {
        mockPrescriptions[index] = newPrescription;
      }
    } else {
      // Add new prescription
      mockPrescriptions.push(newPrescription);
    }

    toast.success("Receita salva com sucesso!");
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  const handlePrintPrescription = async () => {
    if (currentPrescriptionMedications.length === 0) {
      toast.error("Adicione pelo menos um medicamento para imprimir a receita.");
      return;
    }

    // Gerar o PDF como um Blob, chamando a função PrescriptionPdfContent
    const blob = await pdf(
      PrescriptionPdfContent({
        animalName: animal.name,
        animalId: animal.id,
        animalSpecies: animal.species,
        tutorName: client.name,
        tutorAddress: client.address,
        medications: currentPrescriptionMedications,
        generalObservations: currentPrescriptionGeneralObservations,
        showElectronicSignatureText: false, // Não mostrar "Assinado eletronicamente por" para impressão
      })
    ).toBlob();

    // Criar uma URL para o Blob e abrir em uma nova aba
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url); // Limpar a URL do Blob após a abertura
  };

  const handleSavePdf = async () => {
    if (currentPrescriptionMedications.length === 0) {
      toast.error("Adicione pelo menos um medicamento para salvar a receita em PDF.");
      return;
    }

    const blob = await pdf(
      PrescriptionPdfContent({
        animalName: animal.name,
        animalId: animal.id,
        animalSpecies: animal.species,
        tutorName: client.name,
        tutorAddress: client.address,
        medications: currentPrescriptionMedications,
        generalObservations: currentPrescriptionGeneralObservations,
        showElectronicSignatureText: true, // Mostrar "Assinado eletronicamente por" para salvar PDF
      })
    ).toBlob();

    // Criar um link de download e clicar nele
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receita_${animal.name}_${client.name}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Receita salva em PDF com sucesso!");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {prescriptionId ? "Editar Receita" : "Adicionar Nova Receita"} para {animal.name}
        </h1>
        <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
          <Button variant="outline">
            <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 py-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Descrição do Tratamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="treatmentDescription">Tratamento (Ex: Tratamento de Anemia)</Label>
              <Textarea
                id="treatmentDescription"
                placeholder="Descreva o tratamento geral da receita..."
                rows={3}
                value={treatmentDescription}
                onChange={(e) => setTreatmentDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

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
              <FaPlus className="mr-2 h-4 w-4" /> Adicionar Medicamento
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
          <FaTimes className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button variant="secondary" onClick={handlePrintPrescription} disabled={currentPrescriptionMedications.length === 0}>
          <FaPrint className="mr-2 h-4 w-4" /> Imprimir
        </Button>
        <Button variant="secondary" onClick={handleSavePdf} disabled={currentPrescriptionMedications.length === 0}>
          <FaDownload className="mr-2 h-4 w-4" /> Salvar PDF
        </Button>
        <Button onClick={handleSavePrescription} disabled={currentPrescriptionMedications.length === 0}>
          <FaSave className="mr-2 h-4 w-4" /> Salvar Receita
        </Button>
      </div>
    </div>
  );
};

export default AddPrescriptionPage;