"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTimes, FaEye, FaSave, FaPrint, FaDownload, FaClipboardList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PrescriptionMedicationForm, { MedicationData } from "@/components/PrescriptionMedicationForm";
import PrescriptionManipulatedForm from "@/components/PrescriptionManipulatedForm"; // Importar o novo componente
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { PrescriptionPdfContent } from "@/components/PrescriptionPdfContent";
import { PrescriptionEntry, ManipulatedPrescriptionData } from "@/types/medication"; // Importar ManipulatedPrescriptionData
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
} from "@/components/ui/alert-dialog";

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
  address: string;
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

  // Estados para Receita Simples/Controlada
  const [currentPrescriptionMedications, setCurrentPrescriptionMedications] = useState<MedicationData[]>([]);
  const [currentPrescriptionGeneralObservations, setCurrentPrescriptionGeneralObservations] = useState<string>("");
  const [treatmentDescription, setTreatmentDescription] = useState<string>("");

  // Estados para Receita Manipulada
  const [manipulatedPrescriptionData, setManipulatedPrescriptionData] = useState<ManipulatedPrescriptionData | undefined>(undefined);

  // Estados para dados do farmacêutico (NÃO APARECEM NO FORMULÁRIO, APENAS PARA O PDF)
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
      const existingPrescription = mockPrescriptions.find(p => p.id === prescriptionId);
      if (existingPrescription) {
        setTreatmentDescription(existingPrescription.treatmentDescription || "");

        if (existingPrescription.type === 'manipulated' && existingPrescription.manipulatedPrescription) {
          setManipulatedPrescriptionData(existingPrescription.manipulatedPrescription);
          setCurrentPrescriptionGeneralObservations(existingPrescription.manipulatedPrescription.generalObservations); // Usar as observações da manipulada
        } else if (existingPrescription.medications) {
          setCurrentPrescriptionMedications(existingPrescription.medications.map(med => ({ ...med, isCollapsed: true })));
          setCurrentPrescriptionGeneralObservations(existingPrescription.instructions); // Usar as observações da simples/controlada
          if (existingPrescription.type === 'controlled') {
            setAllowMultipleMedications(existingPrescription.medications.length > 1);
          }
        }
      } else {
        toast.error("Receita não encontrada.");
        navigate(`/clients/${clientId}/animals/${animalId}/record`);
      }
    } else {
      setAllowMultipleMedications(false);
      // Reset manipulated data for new prescriptions
      setManipulatedPrescriptionData(undefined);
      setCurrentPrescriptionMedications([]);
      setCurrentPrescriptionGeneralObservations("");
      setTreatmentDescription("");
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
      isCollapsed: false,
    };
    setCurrentPrescriptionMedications((prev) => [...prev, newMedication]);
  };

  const handleConfirmAddMultipleMedications = () => {
    setAllowMultipleMedications(true);
    setIsControlledMedicationWarningOpen(false);
    handleAddMedication();
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

  const handleSaveManipulatedPrescription = (data: ManipulatedPrescriptionData) => {
    setManipulatedPrescriptionData(data);
    setCurrentPrescriptionGeneralObservations(data.generalObservations); // Sincronizar observações gerais
    toast.success("Dados da receita manipulada salvos no formulário!");
  };

  const handleSavePrescription = () => {
    if (prescriptionType !== 'manipulated' && currentPrescriptionMedications.length === 0) {
      toast.error("Adicione pelo menos um medicamento à receita.");
      return;
    }
    if (prescriptionType === 'manipulated' && !manipulatedPrescriptionData) {
      toast.error("Preencha os dados da receita manipulada antes de salvar.");
      return;
    }

    let newPrescription: PrescriptionEntry;

    if (prescriptionType === 'manipulated' && manipulatedPrescriptionData) {
      newPrescription = {
        id: prescriptionId || `rx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        medicationName: manipulatedPrescriptionData.formulaComponents.map(c => c.name).join(", ") || "Receita Manipulada",
        treatmentDescription: treatmentDescription.trim() || undefined,
        instructions: manipulatedPrescriptionData.generalObservations,
        type: prescriptionType,
        manipulatedPrescription: manipulatedPrescriptionData,
      };
    } else {
      const summaryMedicationName = currentPrescriptionMedications
        .map(med => med.medicationName)
        .filter(name => name.trim() !== "")
        .join(", ");

      newPrescription = {
        id: prescriptionId || `rx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        medicationName: summaryMedicationName || "Receita sem medicamentos",
        treatmentDescription: treatmentDescription.trim() || undefined,
        instructions: currentPrescriptionGeneralObservations,
        type: prescriptionType,
        medications: currentPrescriptionMedications.map(med => ({ ...med, isCollapsed: true })),
      };
    }

    if (prescriptionId) {
      const index = mockPrescriptions.findIndex(p => p.id === prescriptionId);
      if (index !== -1) {
        mockPrescriptions[index] = newPrescription;
      }
    } else {
      mockPrescriptions.push(newPrescription);
    }

    toast.success("Receita salva com sucesso!");
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  const handlePrintPrescription = async () => {
    if (prescriptionType !== 'manipulated' && currentPrescriptionMedications.length === 0) {
      toast.error("Adicione pelo menos um medicamento para imprimir a receita.");
      return;
    }
    if (prescriptionType === 'manipulated' && !manipulatedPrescriptionData) {
      toast.error("Preencha os dados da receita manipulada antes de imprimir.");
      return;
    }

    try {
      const blob = await pdf(
        PrescriptionPdfContent({
          animalName: animal.name,
          animalId: animal.id,
          animalSpecies: animal.species,
          tutorName: client.name,
          tutorAddress: client.address,
          medications: currentPrescriptionMedications, // Passar vazio se for manipulada
          generalObservations: currentPrescriptionGeneralObservations,
          showElectronicSignatureText: false,
          prescriptionType: prescriptionType,
          pharmacistName: pharmacistName,
          pharmacistCpf: pharmacistCpf,
          pharmacistCfr: pharmacistCfr,
          pharmacistAddress: pharmacistAddress,
          pharmacistPhone: pharmacistPhone,
          manipulatedPrescription: manipulatedPrescriptionData, // Passar dados da manipulada
        })
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao imprimir a receita:", error);
      toast.error("Erro ao gerar PDF para impressão. Verifique o console para detalhes.");
    }
  };

  const handleSavePdf = async () => {
    if (prescriptionType !== 'manipulated' && currentPrescriptionMedications.length === 0) {
      toast.error("Adicione pelo menos um medicamento para salvar a receita em PDF.");
      return;
    }
    if (prescriptionType === 'manipulated' && !manipulatedPrescriptionData) {
      toast.error("Preencha os dados da receita manipulada antes de salvar em PDF.");
      return;
    }

    try {
      const blob = await pdf(
        PrescriptionPdfContent({
          animalName: animal.name,
          animalId: animal.id,
          animalSpecies: animal.species,
          tutorName: client.name,
          tutorAddress: client.address,
          medications: currentPrescriptionMedications, // Passar vazio se for manipulada
          generalObservations: currentPrescriptionGeneralObservations,
          showElectronicSignatureText: true,
          prescriptionType: prescriptionType,
          pharmacistName: pharmacistName,
          pharmacistCpf: pharmacistCpf,
          pharmacistCfr: pharmacistCfr,
          pharmacistAddress: pharmacistAddress,
          pharmacistPhone: pharmacistPhone,
          manipulatedPrescription: manipulatedPrescriptionData, // Passar dados da manipulada
        })
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receita_${animal.name}_${client.name}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Receita salva em PDF com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar a receita em PDF:", error);
      toast.error("Erro ao gerar PDF para download. Verifique o console para detalhes.");
    }
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

          {prescriptionType === 'manipulated' ? (
            <PrescriptionManipulatedForm
              initialData={manipulatedPrescriptionData}
              onSave={handleSaveManipulatedPrescription}
            />
          ) : (
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
          )}

          {/* Observações Gerais da Receita (este campo será preenchido pelo estado de manipulatedPrescriptionData.generalObservations se for manipulada) */}
          {prescriptionType !== 'manipulated' && (
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
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-950/80 dark:border-gray-800 sticky bottom-0 z-10">
        <Button variant="outline" onClick={() => navigate(`/clients/${clientId}/animals/${animalId}/record`)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaTimes className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button variant="secondary" onClick={handlePrintPrescription} disabled={(prescriptionType !== 'manipulated' && currentPrescriptionMedications.length === 0) || (prescriptionType === 'manipulated' && !manipulatedPrescriptionData)} className="rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaPrint className="mr-2 h-4 w-4" /> Imprimir
        </Button>
        <Button variant="secondary" onClick={handleSavePdf} disabled={(prescriptionType !== 'manipulated' && currentPrescriptionMedications.length === 0) || (prescriptionType === 'manipulated' && !manipulatedPrescriptionData)} className="rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaDownload className="mr-2 h-4 w-4" /> Salvar PDF
        </Button>
        <Button onClick={handleSavePrescription} disabled={(prescriptionType !== 'manipulated' && currentPrescriptionMedications.length === 0) || (prescriptionType === 'manipulated' && !manipulatedPrescriptionData)} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
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