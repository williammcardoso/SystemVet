"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaArrowLeft, FaUsers, FaPaw, FaPlus, FaEye, FaStethoscope, FaCalendarAlt, FaDollarSign, FaSyringe, FaWeightHanging, FaFileAlt, FaClipboardList, FaCommentAlt, FaHeart, FaMale, FaUser, FaPrint, FaDownload, FaTimes, FaSave, FaBalanceScale, FaFileMedical, FaExclamationTriangle, FaFlask, FaTag, FaBox, FaClock, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaTrashAlt, FaPrescriptionBottleAlt, FaEdit
} from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { PrescriptionEntry } from "@/types/medication";
import { mockPrescriptions } from "@/mockData/prescriptions";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Importar DropdownMenu
import { pdf } from "@react-pdf/renderer"; // Importar pdf para impressão
import { PrescriptionPdfContent } from "@/components/PrescriptionPdfContent"; // Importar o componente de conteúdo do PDF
import { FinancialTransaction, mockFinancialTransactions } from "@/mockData/financial"; // Importar mock data financeiro
import { AppointmentEntry, BaseAppointmentDetails, ConsultationDetails } from "@/types/appointment"; // Importar a nova interface de atendimento
import { mockClients } from "@/mockData/clients"; // Importar o mock de clientes centralizado
import { Client, Animal } from "@/types/client"; // Importar as interfaces Client e Animal

// Mock data para atendimentos (agora com a nova interface AppointmentEntry)
const initialMockAppointments: AppointmentEntry[] = [
  {
    id: "app1",
    animalId: "a1",
    date: "2023-10-26",
    type: "Consulta",
    vet: "Dr. William Cardoso",
    pesoAtual: 25.0,
    temperaturaCorporal: 38.5,
    observacoesGerais: "Animal saudável, check-up de rotina.",
    details: {
      queixaPrincipal: "Check-up anual",
      historicoClinico: "Sem intercorrências recentes.",
      alimentacao: "Ração seca premium",
      vacinacaoVermifugacaoAtualizadas: "sim",
      ambiente: "interno",
      contatoOutrosAnimais: "nao",
      mucosas: "róseas, úmidas",
      frequenciaCardiaca: 100,
      frequenciaRespiratoria: 20,
      diagnosticoDefinitivo: "Saudável",
      condutaTratamento: "Manter rotina, próxima vacina em 6 meses.",
      retornoRecomendadoEmDias: 180,
      suspeitaDiagnostica: "Saudável", // Adicionado para teste
    } as ConsultationDetails,
    attachments: [],
  },
  {
    id: "app2",
    animalId: "a1",
    date: "2024-03-10",
    type: "Vacina",
    vet: "Dra. Ana Paula",
    pesoAtual: 25.5,
    temperaturaCorporal: 38.0,
    observacoesGerais: "Aplicação da vacina V8.",
    details: {
      tipoVacina: "Polivalente",
      nomeComercial: "Duramune Max 5/4L",
      lote: "ABC123XYZ",
      fabricante: "Boehringer Ingelheim",
      dataFabricacao: "2023-01-01",
      dataValidade: "2025-01-01",
      doseAplicada: 1.0,
      viaAdministracao: "SC",
      localAplicacao: "Escapular Direita",
      reacaoAdversaObservada: "Nenhuma",
      profissionalAplicou: "Dra. Ana Paula",
    },
    attachments: [],
  },
  {
    id: "app3",
    animalId: "a3",
    date: "2024-01-15",
    type: "Emergência",
    vet: "Dr. Carlos Eduardo",
    pesoAtual: 18.0,
    temperaturaCorporal: 39.5,
    observacoesGerais: "Animal chegou com dispneia e tosse.",
    details: {
      horaChegada: "14:30",
      condicaoGeral: "dispneia",
      manobrasSuporteRealizadas: "Oxigenoterapia, fluidoterapia.",
      medicamentosAdministrados: "Furosemida, Dexametasona.",
      encaminhamento: "internacao",
      suspeitaDiagnostica: "Pneumonia", // Adicionado para teste
      condutaTratamento: "Internação e tratamento com antibióticos.",
    },
    attachments: [],
  },
  {
    id: "app4",
    animalId: "a1",
    date: "2024-07-25",
    type: "Outros", // Exemplo de atendimento simples
    vet: "Dr. William Cardoso",
    pesoAtual: 26.0,
    temperaturaCorporal: 38.2,
    observacoesGerais: "Animal com leve tosse. Prescrito xarope.",
    details: {
      queixaPrincipal: "Tosse leve",
      condutaTratamento: "Xarope para tosse por 5 dias.",
      proximosPassos: "Reavaliar em 5 dias.",
    } as BaseAppointmentDetails,
    attachments: [],
  },
];

// Mock data para tipos de exame e veterinários
const mockExamTypes = [
  { id: "1", name: "Hemograma Completo" },
  { id: "2", name: "Exame de Fezes" },
  { id: "3", name: "Urinálise" },
  { id: "4", name: "Raio-X" },
];

const mockVets = [
  { id: "1", name: "Dr. Silva" },
  { id: "2", name: "Dra. Costa" },
  { id: "3", "name": "Dr. Souza" },
];

// Interface para Exames (incluindo campos de hemograma)
interface ExamEntry {
  id: string;
  date: string;
  type: string;
  result: string;
  vet: string;
  // Campos específicos para Hemograma
  hemacias?: number;
  volumeGlobular?: number;
  hemoglobina?: number;
  vgm?: number;
  chgm?: number;
  plaquetas?: number;
  formasTotais?: number;
  hemaciasNucleadas?: number;
  leucocitos?: number;
  bastoes?: number;
  segmentados?: number;
  linfocitos?: number;
  monocitos?: number;
  eosinofilos?: number;
  basofilos?: number;
  // Campos adicionais
  examObservations?: string;
  operator?: string;
  referenceDate?: string;
  referenceTables?: string;
  conclusions?: string;
}

// Mock data para as novas abas
interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

interface DocumentEntry {
  id: string;
  date: string;
  name: string;
  fileUrl: string;
}

interface ObservationEntry {
  id: string;
  date: string;
  observation: string;
}

const mockVaccines = [
  { id: "vac1", date: "2024-03-10", type: "V8", nextDue: "2025-03-10", vet: "Dra. Costa" },
];


// Helper function to calculate age
const calculateAge = (birthday: string) => {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? `${age} ano(s)` : 'Menos de 1 ano';
};

const PatientRecordPage = () => {
  const { clientId, animalId } = useParams<{ clientId: string; animalId: string }>();
  const navigate = useNavigate();

  const client = mockClients.find(c => c.id === clientId);
  const animal = client?.animals.find(a => a.id === animalId);

  // State para a aba ativa, com valor inicial do localStorage ou 'appointments'
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`patientRecordActiveTab-${animalId}`) || 'appointments';
    }
    return 'appointments';
  });

  // Efeito para salvar a aba ativa no localStorage sempre que ela mudar
  useEffect(() => {
    if (typeof window !== 'undefined' && animalId) {
      localStorage.setItem(`patientRecordActiveTab-${animalId}`, activeTab);
    }
  }, [activeTab, animalId]);

  // State para os atendimentos do animal
  const [animalAppointments, setAnimalAppointments] = useState<AppointmentEntry[]>(
    initialMockAppointments.filter(app => app.animalId === animalId)
  );
  // REMOVIDO: isAppointmentFormOpen e editingAppointment não são mais necessários aqui
  // const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  // const [editingAppointment, setEditingAppointment] = useState<AppointmentEntry | undefined>(undefined);


  // State para as novas abas
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([
    { id: "w1", date: "2023-01-01", weight: 20.5 },
    { id: "w2", date: "2023-07-15", weight: 22.1 },
    { id: "w3", date: "2024-01-20", weight: 23.0 },
  ]);
  const [newWeight, setNewWeight] = useState<string>("");
  const [newWeightDate, setNewWeightDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [documents, setDocuments] = useState<DocumentEntry[]>([
    { id: "d1", date: "2023-05-01", name: "Termo de Adoção", fileUrl: "#" },
    { id: "d2", date: "2024-02-10", name: "Autorização Cirúrgica", fileUrl: "#" },
  ]);
  const [newDocumentName, setNewDocumentName] = useState<string>("");
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);

  // A lista de prescrições aqui representa as receitas FINALIZADAS
  const [prescriptions, setPrescriptions] = useState<PrescriptionEntry[]>(mockPrescriptions);

  // Use useEffect to update the state if mockPrescriptions changes (e.e., after a save)
  // This is a simple way to "refresh" the list when returning to the page.
  useEffect(() => {
    setPrescriptions([...mockPrescriptions]); // Create a new array reference to trigger re-render
  }, [location.pathname]); // Re-run when the path changes (e.g., returning from add/edit page)


  const [observations, setObservations] = useState<ObservationEntry[]>([
    { id: "o1", date: "2023-09-20", observation: "Animal apresentou melhora significativa após tratamento." },
    { id: "o2", date: "2024-01-05", observation: "Recomendado check-up anual em 6 meses." },
  ]);
  const [newObservation, setNewObservation] = useState<string>("");

  // State para a lista de exames e o modal de adição
  const [examsList, setExamsList] = useState<ExamEntry[]>([]); // Inicialmente vazio, pois a adição é feita em outra página
  const [isAddExamDialogOpen, setIsAddExamDialogOpen] = useState(false);
  const [newExamDate, setNewExamDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newExamType, setNewExamType] = useState<string | undefined>(undefined);
  const [newExamResult, setNewExamResult] = useState<string>("");
  const [newExamVet, setNewExamVet] = useState<string | undefined>(undefined);

  // Campos específicos para Hemograma
  const [newHemacias, setNewHemacias] = useState<string>("");
  const [newVolumeGlobular, setNewVolumeGlobular] = useState<string>("");
  const [newHemoglobina, setNewHemoglobina] = useState<string>("");
  const [newVGM, setNewVGM] = useState<string>("");
  const [newCHGM, setNewCHGM] = useState<string>("");
  const [newPlaquetas, setNewPlaquetas] = useState<string>("");
  const [newFormasTotais, setNewFormasTotais] = useState<string>("");
  const [newHemaciasNucleadas, setNewHemaciasNucleadas] = useState<string>("");

  const [newLeucocitos, setNewLeucocitos] = useState<string>("");
  const [newBastoes, setNewBastoes] = useState<string>("");
  const [newSegmentados, setNewSegmentados] = useState<string>("");
  const [newLinfocitos, setNewLinfocitos] = useState<string>("");
  const [newMonocitos, setNewMonocitos] = useState<string>("");
  const [newEosinofilos, setNewEosinofilos] = useState<string>("");
  const [newBasofilos, setNewBasofilos] = useState<string>("");

  // Campos adicionais
  const [newExamObservations, setNewExamObservations] = useState<string>("");
  const [newOperator, setNewOperator] = useState<string>("");
  const [newReferenceDate, setNewReferenceDate] = useState<string>("");
  const [newReferenceTables, setNewReferenceTables] = useState<string>("");
  const [newConclusions, setNewConclusions] = useState<string>("");

  // Filtrar transações financeiras relacionadas a este animal
  const animalFinancialTransactions = mockFinancialTransactions.filter(
    (t) => t.relatedAnimalId === animalId
  );

  // Filtrar transações de vendas relacionadas a este animal
  const animalSalesTransactions = mockFinancialTransactions.filter(
    (t) => t.relatedAnimalId === animalId && t.type === 'income' && t.category === 'Venda de Produtos' // Assumindo categoria 'Venda de Produtos' para vendas
  );


  if (!client || !animal) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Animal ou Cliente não encontrado.</h1>
        <Link to="/clients">
          <Button variant="outline" className="bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
            <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
          </Button>
        </Link>
      </div>
    );
  }

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Handlers para as novas funcionalidades
  const handleAddWeight = () => {
    if (newWeight.trim() && newWeightDate) {
      const newEntry: WeightEntry = {
        id: String(weightHistory.length + 1),
        date: newWeightDate,
        weight: parseFloat(newWeight),
      };
      setWeightHistory([...weightHistory, newEntry]);
      setNewWeight("");
      setNewWeightDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleAddDocument = () => {
    if (newDocumentName.trim() && newDocumentFile) {
      // In a real application, you would upload the file and get a URL
      const newEntry: DocumentEntry = {
        id: String(documents.length + 1),
        date: new Date().toISOString().split('T')[0],
        name: newDocumentName.trim(),
        fileUrl: URL.createObjectURL(newDocumentFile), // Placeholder URL
      };
      setDocuments([...documents, newEntry]);
      setNewDocumentName("");
      setNewDocumentFile(null);
    }
  };

  const handleAddObservation = () => {
    if (newObservation.trim()) {
      const newEntry: ObservationEntry = {
        id: String(observations.length + 1),
        date: new Date().toISOString().split('T')[0], // Usar a data atual para a observação
        observation: newObservation.trim(),
      };
      setObservations([...observations, newEntry]);
      setNewObservation("");
    }
  };

  const handleAddExam = () => {
    if (!newExamDate || !newExamType || !newExamVet) {
      toast.error("Por favor, preencha a data, tipo de exame e veterinário.");
      return;
    }

    let examData: ExamEntry = {
      id: String(examsList.length + 1),
      date: newExamDate,
      type: newExamType,
      result: newExamResult, // Default result for non-hemogram
      vet: newExamVet,
      examObservations: newExamObservations,
      operator: newOperator,
      referenceDate: newReferenceDate,
      referenceTables: newReferenceTables,
      conclusions: newConclusions,
    };

    if (newExamType === "Hemograma Completo") {
      examData = {
        ...examData,
        hemacias: parseFloat(newHemacias) || undefined,
        volumeGlobular: parseFloat(newVolumeGlobular) || undefined,
        hemoglobina: parseFloat(newHemoglobina) || undefined,
        vgm: parseFloat(newVGM) || undefined,
        chgm: parseFloat(newCHGM) || undefined,
        plaquetas: parseFloat(newPlaquetas) || undefined,
        formasTotais: parseFloat(newFormasTotais) || undefined,
        hemaciasNucleadas: parseFloat(newHemaciasNucleadas) || undefined,
        leucocitos: parseFloat(newLeucocitos) || undefined,
        bastoes: parseFloat(newBastoes) || undefined,
        segmentados: parseFloat(newSegmentados) || undefined,
        linfocitos: parseFloat(newLinfocitos) || undefined,
        monocitos: parseFloat(newMonocitos) || undefined,
        eosinofilos: parseFloat(newEosinofilos) || undefined,
        basofilos: parseFloat(newBasofilos) || undefined,
      };
      // Summarize hemogram results for the table display
      examData.result = `Hemograma: Hemácias ${newHemacias}, Leucócitos ${newLeucocitos}, Plaquetas ${newPlaquetas}`;
    } else {
      if (!newExamResult.trim()) {
        toast.error("Por favor, preencha o resultado do exame.");
        return;
      }
    }

    setExamsList([...examsList, examData]);
    setIsAddExamDialogOpen(false);
    // Resetar campos do formulário
    setNewExamDate(new Date().toISOString().split('T')[0]);
    setNewExamType(undefined);
    setNewExamResult("");
    setNewExamVet(undefined);
    setNewHemacias("");
    setNewVolumeGlobular("");
    setNewHemoglobina("");
    setNewVGM("");
    setNewCHGM("");
    setNewPlaquetas("");
    setNewFormasTotais("");
    setNewHemaciasNucleadas("");
    setNewLeucocitos("");
    setNewBastoes("");
    setNewSegmentados("");
    setNewLinfocitos("");
    setNewMonocitos("");
    setNewEosinofilos("");
    setNewBasofilos("");
    setNewExamObservations("");
    setNewOperator("");
    setNewReferenceDate("");
    setNewReferenceTables("");
    setNewConclusions("");
  };

  const handlePrintSinglePrescription = async (rx: PrescriptionEntry) => {
    if (!client || !animal) {
      toast.error("Erro: Dados do cliente ou animal não disponíveis para impressão.");
      return;
    }

    const blob = await pdf(
      PrescriptionPdfContent({
        animalName: animal.name,
        animalId: animal.id,
        animalSpecies: animal.species,
        tutorName: client.name,
        tutorAddress: client.address.street + ", " + client.address.number + " - " + client.address.city + " - " + client.address.state,
        medications: rx.medications || [], // Passar array vazio se for manipulada
        generalObservations: rx.instructions,
        showElectronicSignatureText: false,
        prescriptionType: rx.type,
        pharmacistName: "Farmacêutico(a) Responsável", // Mock data for pharmacist
        pharmacistCpf: "CPF: 000.000.000-00",
        pharmacistCfr: "CRF: 00000",
        pharmacistAddress: "Endereço da Farmácia, 000 - Cidade - UF",
        pharmacistPhone: "Telefone: (00) 00000-0000",
        manipulatedPrescription: rx.manipulatedPrescription, // Passar dados da manipulada
      })
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
    toast.success("Receita enviada para impressão!");
  };

  // Handlers para Atendimentos (atualizados para a nova página)
  const handleAddAppointmentClick = () => {
    navigate(`/clients/${clientId}/animals/${animalId}/add-appointment`);
  };

  const handleEditAppointmentClick = (appointment: AppointmentEntry) => {
    navigate(`/clients/${clientId}/animals/${animalId}/edit-appointment/${appointment.id}`);
  };

  const handleDeleteAppointment = (id: string) => {
    setAnimalAppointments((prev) => prev.filter((app) => app.id !== id));
    toast.info("Atendimento excluído.");
  };

  const handleEditAnimal = () => {
    navigate(`/clients/${clientId}/animals/${animalId}/edit`);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4 sm:gap-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaUser className="h-5 w-5 text-muted-foreground" /> Prontuário Consolidado
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Visão completa do histórico médico
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
              <FaPrint className="mr-2 h-4 w-4" /> Imprimir
            </Button>
            <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
              <FaDownload className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
            <Link to={`/clients/${client.id}`}>
              <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
                <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para {client.name}
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; <Link to="/clients" className="hover:text-primary">Clientes</Link> &gt; <Link to={`/clients/${client.id}`} className="hover:text-primary">{client.name}</Link> &gt; {animal.name}
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <Card className="bg-card shadow-sm border border-border rounded-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FaHeart className="h-5 w-5 text-primary" /> Informações do Paciente
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleEditAnimal} className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
                <FaEdit className="mr-2 h-4 w-4" /> Editar Animal
              </Button>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-0">
              {/* Coluna 1: Animal Info & Details */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    {/* Usar FaPaw como fallback para o avatar do animal */}
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                      <FaPaw className="h-6 w-6 text-white" /> {/* Adicionado text-white explicitamente */}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-bold text-foreground">{animal.name}</p>
                    <p className="text-sm text-muted-foreground">{animal.species} • {animal.breed}</p>
                  </div>
                </div>
                <Badge className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium w-fit",
                  animal.status === 'Ativo' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                )}>
                  {animal.status}
                </Badge>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                    <p>Idade: <span className="font-normal text-foreground">{calculateAge(animal.birthday)}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBalanceScale className="h-4 w-4 text-muted-foreground" />
                    <p>Peso: <span className="font-normal text-foreground">{animal.weight.toFixed(1)} kg</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    {animal.gender === "Macho" ? <FaMale className="h-4 w-4 text-muted-foreground" /> : <FaUser className="h-4 w-4 text-muted-foreground" />}
                    <p>Sexo: <span className="font-normal text-foreground">{animal.gender}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                    <p>Última consulta: <span className="font-normal text-foreground">{formatDate(animal.lastConsultationDate || '')}</span></p>
                  </div>
                </div>
              </div>

              {/* Coluna 2: Tutor e Financeiro */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-base font-semibold text-foreground mb-1">Tutor Responsável</p>
                  <p className="text-sm text-muted-foreground">Nome: <span className="font-normal text-foreground">{client.name}</span></p>
                  <p className="text-sm text-muted-foreground">Telefone: <span className="font-normal text-foreground">{client.mainPhoneContact}</span></p>
                </div>
                <div className="bg-muted/50 dark:bg-muted/30 p-3 rounded-md border border-border">
                  <p className="text-base font-semibold text-foreground mb-1">Resumo Financeiro</p>
                  <p className="text-sm text-muted-foreground">Total de procedimentos: <span className="font-normal text-foreground">{animal.totalProcedures || 0}</span></p>
                  <p className="text-sm text-muted-foreground">Valor total: <span className="font-normal text-foreground">R$ {(animal.totalValue || 0).toFixed(2).replace('.', ',')}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 h-auto flex-wrap bg-card shadow-sm border border-border rounded-md p-2">
            <TabsTrigger value="appointments" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaStethoscope className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Atendimento</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaFlask className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Exames</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaDollarSign className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="vaccines" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaSyringe className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Vacinas</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaWeightHanging className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Peso</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaFileAlt className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaPrescriptionBottleAlt className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Receitas</span>
            </TabsTrigger>
            <TabsTrigger value="observations" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaCommentAlt className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Observações</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary flex items-center">
              <FaMoneyBillWave className="h-4 w-4 mr-2" /> <span className="whitespace-nowrap">Financeiro</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-4">
            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaStethoscope className="h-5 w-5 text-primary" /> Histórico de Atendimentos
                </CardTitle>
                <Button size="sm" onClick={handleAddAppointmentClick} className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <FaPlus className="h-4 w-4 mr-2" /> Adicionar Atendimento
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {animalAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {animalAppointments.map((app) => {
                      const appDetails = app.details as BaseAppointmentDetails; // Cast para BaseAppointmentDetails
                      const displaySummary = appDetails.suspeitaDiagnostica || appDetails.condutaTratamento || app.observacoesGerais || "Sem descrição detalhada.";
                      const retornoInfo = appDetails.retornoRecomendadoEmDias ? `Retorno em ${appDetails.retornoRecomendadoEmDias} dias.` : '';

                      return (
                        <Card key={app.id} className="p-4 bg-input shadow-sm border border-border">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                            <div className="flex items-center gap-2">
                              <Badge className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {app.type}
                              </Badge>
                              <p className="text-lg font-semibold text-foreground">
                                {displaySummary}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditAppointmentClick(app)} className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                                <FaEye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteAppointment(app.id)} className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                                <FaTrashAlt className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FaCalendarAlt className="h-3 w-3" /> {formatDate(app.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <FaStethoscope className="h-3 w-3" /> {app.vet}
                            </div>
                            {retornoInfo && (
                              <div className="flex items-center gap-1 col-span-full">
                                <FaClock className="h-3 w-3" /> {retornoInfo}
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum atendimento registrado.</p>
                )}
              </CardContent>
            </Card>
            {/* REMOVIDO: Dialog para Adicionar/Editar Atendimento */}
            {/* <Dialog open={isAppointmentFormOpen} onOpenChange={setIsAppointmentFormOpen}>
              <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-card shadow-sm border border-border rounded-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-foreground">
                    {editingAppointment ? "Editar Atendimento" : "Novo Atendimento"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Preencha os detalhes do atendimento.
                  </DialogDescription>
                </DialogHeader>
                <AppointmentForm
                  animalId={animalId!}
                  clientId={clientId!}
                  initialData={editingAppointment}
                  onSave={handleSaveAppointment}
                  onCancel={handleCancelAppointmentForm}
                  mockAppointments={animalAppointments}
                />
              </DialogContent>
            </Dialog> */}
          </TabsContent>

          <TabsContent value="exams" className="mt-4">
            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaFlask className="h-5 w-5 text-primary" /> Histórico de Exames
                </CardTitle>
                <Link to={`/clients/${clientId}/animals/${animalId}/add-exam`}>
                  <Button size="sm" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <FaPlus className="h-4 w-4 mr-2" /> Adicionar Exame
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                {examsList.length > 0 ? (
                  <div className="space-y-4">
                    {examsList.map((exam) => (
                      <Card key={exam.id} className="p-4 bg-input shadow-sm border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {exam.type}
                            </Badge>
                            <p className="text-lg font-semibold text-foreground">
                              {exam.result}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                            <FaEye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="h-3 w-3" /> {formatDate(exam.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStethoscope className="h-3 w-3" /> {exam.vet}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum exame registrado.</p>
                )}
              </CardContent>
            </Card>

            <Dialog open={isAddExamDialogOpen} onOpenChange={setIsAddExamDialogOpen}>
              <DialogContent className="sm:max-w-[700px] bg-card shadow-sm border border-border rounded-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-foreground">Adicionar Novo Exame</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Preencha os detalhes do exame para adicionar ao prontuário.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="examDate" className="sm:text-right text-muted-foreground font-medium">
                      Data
                    </Label>
                    <Input
                      id="examDate"
                      type="date"
                      value={newExamDate}
                      onChange={(e) => setNewExamDate(e.target.value)}
                      className="col-span-3 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="examType" className="sm:text-right text-muted-foreground font-medium">
                      Tipo de Exame
                    </Label>
                    <Select onValueChange={setNewExamType} value={newExamType} >
                      <SelectTrigger id="examType" className="col-span-3 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                        <SelectValue placeholder="Selecione o tipo de exame" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockExamTypes.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="examVet" className="sm:text-right text-muted-foreground font-medium">
                      Veterinário
                    </Label>
                    <Select onValueChange={setNewExamVet} value={newExamVet}>
                      <SelectTrigger id="examVet" className="col-span-3 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                        <SelectValue placeholder="Selecione o veterinário" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVets.map((vet) => (
                          <SelectItem key={vet.id} value={vet.name}>
                            {vet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {newExamType === "Hemograma Completo" ? (
                    <>
                      <h3 className="col-span-4 text-lg font-semibold mt-4 mb-2 text-foreground">Eritrograma</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 col-span-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hemacias" className="text-muted-foreground font-medium">Hemácias (m/mm3)</Label>
                          <Input id="hemacias" type="number" placeholder="Ex: 5.5" value={newHemacias} onChange={(e) => setNewHemacias(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="volumeGlobular" className="text-muted-foreground font-medium">Volume globular (%)</Label>
                          <Input id="volumeGlobular" type="number" placeholder="Ex: 37" value={newVolumeGlobular} onChange={(e) => setNewVolumeGlobular(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hemoglobina" className="text-muted-foreground font-medium">Hemoglobina (g/dL)</Label>
                          <Input id="hemoglobina" type="number" placeholder="Ex: 12.0" value={newHemoglobina} onChange={(e) => setNewHemoglobina(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vgm" className="text-muted-foreground font-medium">VGM (fL)</Label>
                          <Input id="vgm" type="number" placeholder="Ex: 60.0" value={newVGM} onChange={(e) => setNewVGM(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chgm" className="text-muted-foreground font-medium">CHGM (%)</Label>
                          <Input id="chgm" type="number" placeholder="Ex: 31" value={newCHGM} onChange={(e) => setNewCHGM(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plaquetas" className="text-muted-foreground font-medium">Plaquetas (m/mm3)</Label>
                          <Input id="plaquetas" type="number" placeholder="Ex: 300" value={newPlaquetas} onChange={(e) => setNewPlaquetas(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="formasTotais" className="text-muted-foreground font-medium">Formas totais (m/mm3)</Label>
                          <Input id="formasTotais" type="number" placeholder="Ex: 6.0" value={newFormasTotais} onChange={(e) => setNewFormasTotais(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hemaciasNucleadas">Hemácias nucleadas (g/dL)</Label>
                          <Input id="hemaciasNucleadas" type="number" placeholder="Ex: 0" value={newHemaciasNucleadas} onChange={(e) => setNewHemaciasNucleadas(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                      </div>

                      <h3 className="col-span-4 text-lg font-semibold mt-4 mb-2 text-foreground">Leucograma</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="leucocitos" className="text-muted-foreground font-medium">Leucócitos (m/mm3)</Label>
                          <Input id="leucocitos" type="number" placeholder="Ex: 6.0" value={newLeucocitos} onChange={(e) => setNewLeucocitos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bastoes" className="text-muted-foreground font-medium">Bastões (%)</Label>
                          <Input id="bastoes" type="number" placeholder="Ex: 0" value={newBastoes} onChange={(e) => setNewBastoes(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="segmentados">Segmentados (%)</Label>
                          <Input id="segmentados" type="number" placeholder="Ex: 60" value={newSegmentados} onChange={(e) => setNewSegmentados(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linfocitos">Linfócitos (%)</Label>
                          <Input id="linfocitos" type="number" placeholder="Ex: 30" value={newLinfocitos} onChange={(e) => setNewLinfocitos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monocitos">Monócitos (%)</Label>
                          <Input id="monocitos" type="number" placeholder="Ex: 3" value={newMonocitos} onChange={(e) => setNewMonocitos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eosinofilos">Eosinófilos (%)</Label>
                          <Input id="eosinofilos" type="number" placeholder="Ex: 2" value={newEosinofilos} onChange={(e) => setNewEosinofilos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="basofilos">Basófilos (%)</Label>
                          <Input id="basofilos" type="number" placeholder="Ex: 1" value={newBasofilos} onChange={(e) => setNewBasofilos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="examResult" className="text-muted-foreground font-medium">Resultado</Label>
                      <Input
                        id="examResult"
                        placeholder="Resultado do exame"
                        value={newExamResult}
                        onChange={(e) => setNewExamResult(e.target.value)}
                        className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                      />
                    </div>
                  )}

                  <div className="space-y-2 col-span-full mt-4">
                    <Label htmlFor="examObservations" className="text-muted-foreground font-medium">Observações</Label>
                    <Textarea
                      id="examObservations"
                      placeholder="Observações gerais do exame"
                      value={newExamObservations}
                      onChange={(e) => setNewExamObservations(e.target.value)}
                      rows={3}
                      className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="operator" className="text-muted-foreground font-medium">Operador</Label>
                      <Input
                        id="operator"
                        placeholder="Nome do operador"
                        value={newOperator}
                        onChange={(e) => setNewOperator(e.target.value)}
                        className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referenceDate" className="text-muted-foreground font-medium">Data de Referência</Label>
                      <Input
                        id="referenceDate"
                        type="date"
                        value={newReferenceDate}
                        onChange={(e) => setNewReferenceDate(e.target.value)}
                        className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="referenceTables" className="text-muted-foreground font-medium">Tabelas de referência</Label>
                    <Textarea
                      id="referenceTables"
                      placeholder="Tabelas de referência"
                      value={newReferenceTables}
                      onChange={(e) => setNewReferenceTables(e.target.value)}
                      rows={3}
                      className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="conclusions" className="text-muted-foreground font-medium">Conclusões</Label>
                    <Textarea
                      id="conclusions"
                      placeholder="Conclusões do exame"
                      value={newConclusions}
                      onChange={(e) => setNewConclusions(e.target.value)}
                      rows={5}
                      className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddExamDialogOpen(false)} className="bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
                    <FaTimes className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                  <Button onClick={handleAddExam} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <FaSave className="mr-2 h-4 w-4" /> Salvar Exame
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="sales" className="mt-4">
            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaDollarSign className="h-5 w-5 text-primary" /> Histórico de Vendas
                </CardTitle>
                <Button size="sm" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <FaPlus className="h-4 w-4 mr-2" /> Adicionar Venda
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {animalSalesTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {animalSalesTransactions.map((sale) => (
                      <Card key={sale.id} className="p-4 bg-input shadow-sm border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {sale.category}
                            </Badge>
                            <p className="text-lg font-semibold text-foreground">
                              {sale.description}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            R$ {sale.amount.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="h-3 w-3" /> {formatDate(sale.date)}
                          </div>
                          {/* <div className="flex items-center gap-1">
                            <FaBox className="h-3 w-3" /> Quantidade: {sale.quantity}
                          </div> */}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhuma venda registrada.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccines" className="mt-4">
            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaSyringe className="h-5 w-5 text-primary" /> Histórico de Vacinas
                </CardTitle>
                <Button size="sm" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <FaPlus className="h-4 w-4 mr-2" /> Adicionar Vacina
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {mockVaccines.length > 0 ? (
                  <div className="space-y-4">
                    {mockVaccines.map((vaccine) => (
                      <Card key={vaccine.id} className="p-4 bg-input shadow-sm border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              {vaccine.type}
                            </Badge>
                            <p className="text-lg font-semibold text-foreground">
                              Próxima Dose: {formatDate(vaccine.nextDue)}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                            <FaEye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="h-3 w-3" /> {formatDate(vaccine.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStethoscope className="h-3 w-3" /> {vaccine.vet}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhuma vacina registrada.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Peso */}
          <TabsContent value="weight" className="mt-4">
            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaWeightHanging className="h-5 w-5 text-primary" /> Histórico de Peso
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <Input
                    type="date"
                    value={newWeightDate}
                    onChange={(e) => setNewWeightDate(e.target.value)}
                    className="w-full sm:w-[150px] bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                  />
                  <Input
                    type="number"
                    placeholder="Peso (kg)"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full sm:w-[120px] bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                  />
                  <Button size="sm" onClick={handleAddWeight} className="w-full sm:w-auto rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <FaPlus className="h-4 w-4 mr-2" /> Adicionar Peso
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {weightHistory.length > 0 ? (
                  <div className="space-y-4">
                    {weightHistory.map((entry) => (
                      <Card key={entry.id} className="p-4 bg-input shadow-sm border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <FaWeightHanging className="h-4 w-4 text-muted-foreground" />
                            <p className="text-lg font-semibold text-foreground">
                              {entry.weight.toFixed(2)} kg
                            </p>
                          </div>
                          {/* Ações para peso, se houver */}
                          <Button variant="ghost" size="icon" className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                            <FaEye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FaCalendarAlt className="h-3 w-3" /> {formatDate(entry.date)}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum registro de peso.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Documentos */}
          <TabsContent value="documents" className="mt-4">
            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaFileAlt className="h-5 w-5 text-primary" /> Documentos
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center flex-wrap">
                  <Input
                    type="text"
                    placeholder="Nome do Documento"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                    className="w-full sm:w-[200px] bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                  />
                  <Input
                    type="file"
                    onChange={(e) => setNewDocumentFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full sm:w-[200px] bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                  />
                  <Button size="sm" onClick={handleAddDocument} disabled={!newDocumentName || !newDocumentFile} className="w-full sm:w-auto rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <FaPlus className="h-4 w-4 mr-2" /> Adicionar Documento
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <Card key={doc.id} className="p-4 bg-input shadow-sm border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <FaFileAlt className="h-4 w-4 text-muted-foreground" />
                            <p className="text-lg font-semibold text-foreground">
                              {doc.name}
                            </p>
                          </div>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                              <FaEye className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FaCalendarAlt className="h-3 w-3" /> {formatDate(doc.date)}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum documento registrado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Receitas */}
          <TabsContent value="prescriptions" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Card para Receita Simples */}
              <Link to={`/clients/${clientId}/animals/${animalId}/add-prescription?type=simple`}>
                <Card className="flex flex-col items-center justify-center p-6 text-center bg-card shadow-sm border border-border rounded-md h-full">
                  <FaFileMedical className="h-12 w-12 text-primary mb-3" />
                  <CardTitle className="text-lg font-semibold text-foreground">Receita Simples</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Medicamentos de uso comum</p>
                </Card>
              </Link>

              {/* Card para Receita Controlada */}
              <Link to={`/clients/${clientId}/animals/${animalId}/add-prescription?type=controlled`}>
                <Card className="flex flex-col items-center justify-center p-6 text-center bg-card shadow-sm border border-border rounded-md h-full">
                  <FaExclamationTriangle className="h-12 w-12 text-destructive mb-3" />
                  <CardTitle className="text-lg font-semibold text-foreground">Receita Controlada</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Medicamentos controlados</p>
                </Card>
              </Link>

              {/* Card para Receita Manipulada */}
              <Link to={`/clients/${clientId}/animals/${animalId}/add-prescription?type=manipulated`}>
                <Card className="flex flex-col items-center justify-center p-6 text-center bg-card shadow-sm border border-border rounded-md h-full">
                  <FaFlask className="h-12 w-12 text-accent mb-3" />
                  <CardTitle className="text-lg font-semibold text-foreground">Receita Manipulada</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Medicamentos manipulados</p>
                </Card>
              </Link>
            </div>

            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaPrescriptionBottleAlt className="h-5 w-5 text-primary" /> Prescrições Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions.map((rx) => (
                      <Card key={rx.id} className="p-4 bg-input shadow-sm border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              "px-2 py-0.5 text-xs font-medium rounded-full",
                              rx.type === 'simple' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                              rx.type === 'controlled' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                              rx.type === 'manipulated' && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            )}>
                              {rx.type === 'simple' ? 'Receita Simples' : rx.type === 'controlled' ? 'Controlada' : 'Manipulada'}
                            </Badge>
                            <p className="text-lg font-semibold text-foreground">
                              {rx.treatmentDescription || "Receita sem descrição"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handlePrintSinglePrescription(rx)} className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                              <FaPrint className="h-4 w-4" />
                            </Button>
                            <Link to={`/clients/${clientId}/animals/${animalId}/edit-prescription/${rx.id}?type=${rx.type}`}> {/* Adicionado ?type=${rx.type} */}
                              <Button variant="ghost" size="icon" className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                                <FaEye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="h-3 w-3" /> {formatDate(rx.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaStethoscope className="h-3 w-3" /> Dr. William Cardoso {/* Placeholder para o veterinário */}
                          </div>
                          <div className="flex items-center gap-1 col-span-full">
                            <FaClipboardList className="h-3 w-3" /> {rx.type === 'manipulated' ? (rx.manipulatedPrescription?.formulaComponents?.length || 0) : (rx.medications?.length || 0)} medicamento(s)
                          </div>
                        </div>
                        {rx.medicationName && (
                          <p className="text-sm text-foreground bg-muted/50 dark:bg-muted/30 p-3 rounded-md border border-border">
                            Medicamentos: {rx.medicationName}
                          </p>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-4 py-4">Nenhuma receita registrada.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Observações */}
          <TabsContent value="observations" className="mt-4">
            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 gap-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaCommentAlt className="h-5 w-5 text-primary" /> Observações Gerais
                </CardTitle>
                <Button size="sm" onClick={handleAddObservation} disabled={!newObservation.trim()} className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <FaPlus className="h-4 w-4 mr-2" /> Adicionar Observação
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <Textarea
                    placeholder="Adicione uma nova observação..."
                    rows={3}
                    value={newObservation}
                    onChange={(e) => setNewObservation(e.target.value)}
                    className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                  />
                </div>
                {observations.length > 0 ? (
                  <div className="space-y-4">
                    {observations.map((obs) => (
                      <Card key={obs.id} className="p-4 bg-input shadow-sm border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <FaCommentAlt className="h-4 w-4 text-muted-foreground" />
                            <p className="text-lg font-semibold text-foreground">
                              {obs.observation}
                            </p>
                          </div>
                          {/* Ações para observação, se houver */}
                          <Button variant="ghost" size="icon" className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                            <FaEye className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FaCalendarAlt className="h-3 w-3" /> {formatDate(obs.date)}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhuma observação registrada.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Financeiro */}
          <TabsContent value="financial" className="mt-4">
            <Card className="bg-card shadow-sm border border-border rounded-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <FaMoneyBillWave className="h-5 w-5 text-primary" /> Histórico Financeiro
                </CardTitle>
                <Button size="sm" className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <FaPlus className="h-4 w-4 mr-2" /> Adicionar Lançamento
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {animalFinancialTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {animalFinancialTransactions.map((transaction) => (
                      <Card key={transaction.id} className="p-4 bg-input shadow-sm border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className={cn(
                              "px-2 py-0.5 text-xs font-medium rounded-full",
                              transaction.type === 'income' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            )}>
                              {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                            </Badge>
                            <p className="text-lg font-semibold text-foreground">
                              {transaction.description}
                            </p>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 text-lg font-bold",
                            transaction.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )}>
                            {transaction.type === 'income' ? <FaArrowUp className="h-4 w-4" /> : <FaArrowDown className="h-4 w-4" />}
                            R$ {transaction.amount.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="h-3 w-3" /> {formatDate(transaction.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaTag className="h-3 w-3" /> Categoria: {transaction.category}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum lançamento financeiro registrado para este animal.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientRecordPage;