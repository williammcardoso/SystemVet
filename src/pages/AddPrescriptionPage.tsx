"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom"; // Importar useSearchParams
import { FaArrowLeft, FaPlus, FaTimes, FaEye, FaSave, FaPrint, FaDownload, FaClipboardList } from "react-icons/fa"; // Importar ícones de react-icons
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

  // Estados para dados do farmacêutico (NÃO APARECEM NO FORMULÁRIO, APENAS PARA O PDF)
  // Inicializados com dados mock fixos, como no exemplo da imagem
  const [pharmacistName] = useState<string>("Farmacêutico(a) Responsável");
  const [pharmacistCpf] = useState<string>("CPF: 000.000.000-00");
  const [pharmacistCfr] = useState<string>("CRF: 00000");
  const [pharmacistAddress] = useState<string>("Endereço da Farmácia, 000 - Cidade - UF");
  const [pharmacistPhone] = useState<string>("Telefone: (00) 00000-0000");

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
      // Reset allowMultipleMedications for new prescriptions
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

    // Não há validação de dados do farmacêutico aqui, pois eles não são inseridos pelo usuário.

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

  const getPrescriptionTitle = () => {
    let baseTitle = prescriptionId ? "Editar Receita" : "Adicionar Nova Receita";
    let typeText = '';
    if (prescriptionType === 'simple') typeText = 'Simples';
    else if (prescriptionType === 'controlled') typeText = 'Controlada';
    else if (prescriptionType === 'manipulated') typeText = 'Manipulada';
    return `${baseTitle} (${typeText}) para ${animal.name}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <FaClipboardList className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {getPrescriptionTitle()}
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Gerencie os detalhes da receita para {animal.name}.
              </p>
            </div>
          </div>
          <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; <Link to="/clients" className="hover:text-blue-500 dark:hover:text-blue-400">Clientes</Link> &gt; <Link to={`/clients/${client.id}`} className="hover:text-blue-500 dark:hover:text-blue-400">{client.name}</Link> &gt; <Link to={`/clients/${clientId}/animals/${animalId}/record`} className="hover:text-blue-500 dark:hover:text-blue-400">{animal.name}</Link> &gt; Receita
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid gap-4 py-4">
          <Card className="mb-4 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
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
                  className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
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
              <Button onClick={handleAddMedication} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                <FaPlus className="mr-2 h-4 w-4" /> Adicionar Medicamento
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
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
                className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-950/80 dark:border-gray-800 sticky bottom-0 z-10">
        <Button variant="outline" onClick={() => navigate(`/clients/${clientId}/animals/${animalId}/record`)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaTimes className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button variant="secondary" onClick={handlePrintPrescription} disabled={currentPrescriptionMedications.length === 0} className="rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaPrint className="mr-2 h-4 w-4" /> Imprimir
        </Button>
        <Button variant="secondary" onClick={handleSavePdf} disabled={currentPrescriptionMedications.length === 0} className="rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaDownload className="mr-2 h-4 w-4" /> Salvar PDF
        </Button>
        <Button onClick={handleSavePrescription} disabled={currentPrescriptionMedications.length === 0} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
          <FaSave className="mr-2 h-4 w-4" /> Salvar Receita
        </Button>
      </div>

      {/* AlertDialog para Receita Controlada */}
      <AlertDialog open={isControlledMedicationWarningOpen} onOpenChange={setIsControlledMedicationWarningOpen}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:bg-gray-800/90">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-[#374151] dark:text-gray-100">Receita Controlada: Múltiplos Medicamentos</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#6B7280] dark:text-gray-400">
              Receitas controladas geralmente permitem apenas um medicamento por formulário. Deseja adicionar mais de um medicamento mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAddMultipleMedications} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddPrescriptionPage;