"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom"; // Importar useSearchParams
import { FaArrowLeft, FaPlus, FaTimes, FaEye, FaSave, FaPrint, FaDownload } from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Importar Input
import PrescriptionMedicationForm, { MedicationData } from "@/components/PrescriptionMedicationForm";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { PrescriptionPdfContent } from "@/components/PrescriptionPdfContent";
import { PrescriptionEntry } from "@/types/medication";
import { mockPrescriptions } from "@/mockData/prescriptions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Importar AlertDialog

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
  const [searchParams] = useSearchParams();
  const prescriptionType = (searchParams.get('type') as 'simple' | 'controlled' | 'manipulated') || 'simple';

  const client = mockClients.find(c => c.id === clientId);
  const animal = client?.animals.find(a => a.id === animalId);

  const [currentPrescriptionMedications, setCurrentPrescriptionMedications] = useState<MedicationData[]>([]);
  const [currentPrescriptionGeneralObservations, setCurrentPrescriptionGeneralObservations] = useState<string>("");
  const [treatmentDescription, setTreatmentDescription] = useState<string>("");

  // Estados para dados do farmacêutico (apenas para receita controlada)
  const [pharmacistName, setPharmacistName] = useState<string>("");
  const [pharmacistCpf, setPharmacistCpf] = useState<string>("");
  const [pharmacistCfr, setPharmacistCfr] = useState<string>("");
  const [pharmacistAddress, setPharmacistAddress] = useState<string>("");
  const [pharmacistPhone, setPharmacistPhone] = useState<string>("");

  // Estado para o AlertDialog de confirmação de múltiplos medicamentos
  const [isControlledMedicationWarningOpen, setIsControlledMedicationWarningOpen] = useState(false);
  const [allowMultipleMedications, setAllowMultipleMedications] = useState(false);


  useEffect(() => {
    if (prescriptionId) {
      // Load existing prescription data if in edit mode
      const existingPrescription = mockPrescriptions.find(p => p.id === prescriptionId);
      if (existingPrescription) {
        setCurrentPrescriptionMedications(existingPrescription.medications.map(med => ({ ...med, isCollapsed: true }))); // Collapse existing meds
        setCurrentPrescriptionGeneralObservations(existingPrescription.instructions);
        setTreatmentDescription(existingPrescription.treatmentDescription || "");

        // Para receitas controladas, os dados do farmacêutico não são carregados do mock,
        // pois não são armazenados. Eles seriam preenchidos novamente pelo usuário.
        if (existingPrescription.type === 'controlled') {
          setAllowMultipleMedications(existingPrescription.medications.length > 1); // Se já tem mais de um, permite
        }
      } else {
        toast.error("Receita não encontrada.");
        navigate(`/clients/${clientId}/animals/${animalId}/record`);
      }
    } else {
      // Reset pharmacist data for new prescriptions
      setPharmacistName("");
      setPharmacistCpf("");
      setPharmacistCfr("");
      setPharmacistAddress("");
      setPharmacistPhone("");
      setAllowMultipleMedications(false);
    }
  }, [prescriptionId, clientId, animalId, navigate, prescriptionType]);


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
    if (prescriptionType === 'controlled' && currentPrescriptionMedications.length >= 1 && !allowMultipleMedications) {
      setIsControlledMedicationWarningOpen(true);
      return;
    }

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

  const handleConfirmAddMultipleMedications = () => {
    setAllowMultipleMedications(true);
    setIsControlledMedicationWarningOpen(false);
    handleAddMedication(); // Add the medication after confirmation
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

    // Validate pharmacist details for controlled prescriptions
    if (prescriptionType === 'controlled' && (!pharmacistName.trim() || !pharmacistCpf.trim() || !pharmacistCfr.trim() || !pharmacistAddress.trim() || !pharmacistPhone.trim())) {
      toast.error("Por favor, preencha todos os dados do farmacêutico para a receita controlada.");
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
      treatmentDescription: treatmentDescription.trim() || undefined,
      instructions: currentPrescriptionGeneralObservations,
      type: prescriptionType, // Salvar o tipo de receita
      // Dados do farmacêutico não são salvos na PrescriptionEntry
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
        showElectronicSignatureText: false,
        prescriptionType: prescriptionType, // Passar o tipo de receita
        pharmacistName: pharmacistName,
        pharmacistCpf: pharmacistCpf,
        pharmacistCfr: pharmacistCfr,
        pharmacistAddress: pharmacistAddress,
        pharmacistPhone: pharmacistPhone,
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
        showElectronicSignatureText: true,
        prescriptionType: prescriptionType, // Passar o tipo de receita
        pharmacistName: pharmacistName,
        pharmacistCpf: pharmacistCpf,
        pharmacistCfr: pharmacistCfr,
        pharmacistAddress: pharmacistAddress,
        pharmacistPhone: pharmacistPhone,
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
          {prescriptionId ? "Editar Receita" : "Adicionar Nova Receita"} ({prescriptionType === 'simple' ? 'Simples' : prescriptionType === 'controlled' ? 'Controlada' : 'Manipulada'}) para {animal.name}
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

        {prescriptionType === 'controlled' && (
          <Card className="mb-4 border-t-4 border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Dados do Farmacêutico (Receita Controlada)</CardTitle>
              <p className="text-sm text-muted-foreground">Estas informações serão incluídas no PDF da receita controlada.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacistName">Nome do Farmacêutico *</Label>
                  <Input id="pharmacistName" value={pharmacistName} onChange={(e) => setPharmacistName(e.target.value)} placeholder="Nome completo do farmacêutico" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacistCpf">CPF *</Label>
                  <Input id="pharmacistCpf" value={pharmacistCpf} onChange={(e) => setPharmacistCpf(e.target.value)} placeholder="CPF do farmacêutico" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacistCfr">CRF *</Label>
                  <Input id="pharmacistCfr" value={pharmacistCfr} onChange={(e) => setPharmacistCfr(e.target.value)} placeholder="Registro no CRF (Ex: CRF-SP 12345)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacistPhone">Telefone *</Label>
                  <Input id="pharmacistPhone" value={pharmacistPhone} onChange={(e) => setPharmacistPhone(e.target.value)} placeholder="Telefone do farmacêutico" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pharmacistAddress">Endereço da Farmácia *</Label>
                <Textarea id="pharmacistAddress" value={pharmacistAddress} onChange={(e) => setPharmacistAddress(e.target.value)} placeholder="Endereço completo da farmácia" rows={2} />
              </div>
            </CardContent>
          </Card>
        )}

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

      {/* AlertDialog para Receita Controlada */}
      <AlertDialog open={isControlledMedicationWarningOpen} onOpenChange={setIsControlledMedicationWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Receita Controlada: Múltiplos Medicamentos</AlertDialogTitle>
            <AlertDialogDescription>
              Receitas controladas geralmente permitem apenas um medicamento por formulário. Deseja adicionar mais de um medicamento mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAddMultipleMedications}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddPrescriptionPage;