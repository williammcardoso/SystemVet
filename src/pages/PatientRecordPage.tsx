import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Users, PawPrint, Plus, Eye, Stethoscope, CalendarDays, DollarSign, Syringe, Weight, FileText, ClipboardList, MessageSquare, Heart, Male, Female, Printer, Download, X, Save, User, Scale
} from "lucide-react";
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

// Mock data (centralizado aqui para facilitar o exemplo, mas idealmente viria de um serviço)
interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: "Macho" | "Fêmea" | "Outro";
  birthday: string;
  coatColor: string;
  weight: number;
  microchip: string;
  notes: string;
  status: 'Ativo' | 'Inativo';
  lastConsultationDate?: string;
  totalProcedures?: number;
  totalValue?: number;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  animals: Animal[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "William",
    phone: "(19) 99363-1981",
    animals: [
      {
        id: "a1",
        name: "Totó",
        species: "Cachorro",
        breed: "Labrador",
        gender: "Macho",
        birthday: "2020-01-15",
        coatColor: "Dourado",
        weight: 25.0,
        microchip: "123456789",
        notes: "Animal muito dócil e brincalhão.",
        status: 'Ativo',
        lastConsultationDate: "2024-07-20",
        totalProcedures: 5,
        totalValue: 435.00,
      },
      {
        id: "a2",
        name: "Bolinha",
        species: "Cachorro",
        breed: "Poodle",
        gender: "Fêmea",
        birthday: "2021-05-20",
        coatColor: "Branco",
        weight: 5.0,
        microchip: "987654321",
        notes: "Adora passear no parque.",
        status: 'Ativo',
        lastConsultationDate: "2024-06-10",
        totalProcedures: 2,
        totalValue: 150.00,
      },
    ],
  },
  {
    id: "2",
    name: "Maria",
    phone: "(11) 98765-4321",
    animals: [
      {
        id: "a3",
        name: "Fido",
        species: "Cachorro",
        breed: "Vira-lata",
        gender: "Macho",
        birthday: "2019-03-10",
        coatColor: "Caramelo",
        weight: 18.0,
        microchip: "",
        notes: "Resgatado, um pouco tímido.",
        status: 'Ativo',
        lastConsultationDate: "2024-05-01",
        totalProcedures: 3,
        totalValue: 280.00,
      },
      {
        id: "a4",
        name: "Miau",
        species: "Gato",
        breed: "Siamês",
        gender: "Fêmea",
        birthday: "2022-07-01",
        coatColor: "Creme",
        weight: 3.5,
        microchip: "112233445",
        notes: "Gosta de dormir no sol.",
        status: 'Inativo',
        lastConsultationDate: "2023-12-15",
        totalProcedures: 1,
        totalValue: 80.00,
      },
    ],
  },
  {
    id: "3",
    name: "João",
    phone: "(21) 91234-5678",
    animals: [
      {
        id: "a5",
        name: "Rex",
        species: "Cachorro",
        breed: "Pastor Alemão",
        gender: "Macho",
        birthday: "2018-11-22",
        coatColor: "Preto e Marrom",
        weight: 30.0,
        microchip: "556677889",
        notes: "Animal de guarda, muito leal.",
        status: 'Ativo',
        lastConsultationDate: "2024-04-05",
        totalProcedures: 7,
        totalValue: 600.00,
      },
    ],
  },
  {
    id: "4",
    name: "Ana",
    phone: "(31) 99876-5432",
    animals: [],
  },
];

// Mock data para atendimentos, exames, vendas, vacinas
const mockAppointments = [
  { id: "app1", date: "2023-10-26", type: "Consulta de Rotina", vet: "Dr. Silva", notes: "Animal saudável." },
  { id: "app2", date: "2024-03-10", type: "Vacinação Anual", vet: "Dra. Costa", notes: "Vacina V8 aplicada." },
];

const mockSales = [
  { id: "sale1", date: "2023-10-26", item: "Ração Premium 1kg", quantity: 1, total: 50.00 },
  { id: "sale2", date: "2024-03-10", item: "Brinquedo para Cachorro", quantity: 1, total: 25.00 },
];

const mockVaccines = [
  { id: "vac1", date: "2024-03-10", type: "V8", nextDue: "2025-03-10", vet: "Dra. Costa" },
];

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
  { id: "3", name: "Dr. Souza" },
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
  const [examsList, setExamsList] = useState<ExamEntry[]>([
    { id: "ex1", date: "2023-10-25", type: "Hemograma Completo", result: "Normal", vet: "Dr. Silva", hemacias: 5.5, leucocitos: 12.0, plaquetas: 300 },
    { id: "ex2", date: "2024-03-09", type: "Exame de Fezes", result: "Negativo para parasitas", vet: "Dra. Costa" },
  ]);
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

  // Campos adicionais do exame
  const [newExamObservations, setNewExamObservations] = useState<string>("");
  const [newOperator, setNewOperator] = useState<string>("");
  const [newReferenceDate, setNewReferenceDate] = useState<string>("");
  const [newReferenceTables, setNewReferenceTables] = useState<string>("");
  const [newConclusions, setNewConclusions] = useState<string>("");


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
        date: new Date().toISOString().split('T')[0],
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


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" /> Prontuário Consolidado
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Visão completa do histórico médico
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <Printer className="mr-2 h-4 w-4" /> Imprimir
            </Button>
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <Download className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
            <Link to={`/clients/${client.id}`}>
              <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para {client.name}
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; <Link to="/clients" className="hover:text-blue-500 dark:hover:text-blue-400">Clientes</Link> &gt; <Link to={`/clients/${client.id}`} className="hover:text-blue-500 dark:hover:text-blue-400">{client.name}</Link> &gt; {animal.name}
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-blue-400 dark:bg-gray-800/90">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                <Heart className="h-5 w-5 text-red-500" /> Informações do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-0">
              {/* Coluna 1: Animal Info */}
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/public/placeholder.svg" alt="Animal Avatar" />
                    <AvatarFallback className="bg-blue-500 text-white text-lg font-bold">{animal.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-bold text-foreground">{animal.name}</p>
                    <p className="text-sm text-muted-foreground">{animal.species} • {animal.breed}</p>
                  </div>
                </div>
                <Badge className={cn(
                  "mt-2 px-3 py-1 rounded-full text-xs font-medium",
                  animal.status === 'Ativo' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                )}>
                  {animal.status}
                </Badge>
              </div>

              {/* Coluna 2: Detalhes do Animal */}
              <div className="grid grid-cols-2 gap-y-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-[#4B5563] dark:text-gray-400">Idade: <span className="font-normal text-foreground">{calculateAge(animal.birthday)}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-[#4B5563] dark:text-gray-400">Peso: <span className="font-normal text-foreground">{animal.weight.toFixed(1)} kg</span></p>
                </div>
                <div className="flex items-center gap-2">
                  {animal.gender === "Macho" ? <Male className="h-4 w-4 text-muted-foreground" /> : <Female className="h-4 w-4 text-muted-foreground" />}
                  <p className="text-sm text-[#4B5563] dark:text-gray-400">Sexo: <span className="font-normal text-foreground">{animal.gender}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-[#4B5563] dark:text-gray-400">Última consulta: <span className="font-normal text-foreground">{formatDate(animal.lastConsultationDate || '')}</span></p>
                </div>
              </div>

              {/* Coluna 3: Tutor e Financeiro */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#374151] dark:text-gray-100 mb-1">Tutor Responsável</p>
                  <p className="text-sm text-[#4B5563] dark:text-gray-400">Nome: <span className="font-normal text-foreground">{client.name}</span></p>
                  <p className="text-sm text-[#4B5563] dark:text-gray-400">Telefone: <span className="font-normal text-foreground">{client.phone}</span></p>
                </div>
                <div className="bg-muted/50 dark:bg-muted/30 p-3 rounded-md border border-muted dark:border-gray-700">
                  <p className="text-sm font-semibold text-[#374151] dark:text-gray-100 mb-1">Resumo Financeiro</p>
                  <p className="text-sm text-[#4B5563] dark:text-gray-400">Total de procedimentos: <span className="font-normal text-foreground">{animal.totalProcedures || 0}</span></p>
                  <p className="text-sm text-[#4B5563] dark:text-gray-400">Valor total: <span className="font-normal text-foreground">R$ {(animal.totalValue || 0).toFixed(2).replace('.', ',')}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 h-auto flex-wrap bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-2">
            <TabsTrigger value="appointments" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">
              <Stethoscope className="h-4 w-4 mr-2" /> Atendimento
            </TabsTrigger>
            <TabsTrigger value="exams" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">
              <CalendarDays className="h-4 w-4 mr-2" /> Exames
            </TabsTrigger>
            <TabsTrigger value="sales" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">
              <DollarSign className="h-4 w-4 mr-2" /> Vendas
            </TabsTrigger>
            <TabsTrigger value="vaccines" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">
              <Syringe className="h-4 w-4 mr-2" /> Vacinas
            </TabsTrigger>
            <TabsTrigger value="weight" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">
              <Weight className="h-4 w-4 mr-2" /> Peso
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">
              <FileText className="h-4 w-4 mr-2" /> Documentos
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">
              <ClipboardList className="h-4 w-4 mr-2" /> Receitas
            </TabsTrigger>
            <TabsTrigger value="observations" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">
              <MessageSquare className="h-4 w-4 mr-2" /> Observações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-blue-400 dark:bg-gray-800/90">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                  <Stethoscope className="h-5 w-5 text-blue-500" /> Histórico de Atendimentos
                </CardTitle>
                <Button size="sm" className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Atendimento
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {mockAppointments.length > 0 ? (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Veterinário</TableHead>
                          <TableHead>Observações</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAppointments.map((app, index) => (
                          <TableRow key={app.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                            <TableCell>{formatDate(app.date)}</TableCell>
                            <TableCell>{app.type}</TableCell>
                            <TableCell>{app.vet}</TableCell>
                            <TableCell>{app.notes}</TableCell>
                            <TableCell className="text-right">
                              <Eye className="h-4 w-4" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum atendimento registrado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams" className="mt-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-purple-400 dark:bg-gray-800/90">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                  <CalendarDays className="h-5 w-5 text-purple-500" /> Histórico de Exames
                </CardTitle>
                <Link to={`/clients/${clientId}/animals/${animalId}/add-exam`}>
                  <Button size="sm" className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Exame
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                {examsList.length > 0 ? (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Resultado</TableHead>
                          <TableHead>Veterinário</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {examsList.map((exam, index) => (
                          <TableRow key={exam.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                            <TableCell>{formatDate(exam.date)}</TableCell>
                            <TableCell>{exam.type}</TableCell>
                            <TableCell>{exam.result}</TableCell>
                            <TableCell>{exam.vet}</TableCell>
                            <TableCell className="text-right">
                              <Eye className="h-4 w-4" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum exame registrado.</p>
                )}
              </CardContent>
            </Card>

            <Dialog open={isAddExamDialogOpen} onOpenChange={setIsAddExamDialogOpen}>
              <DialogContent className="sm:max-w-[700px] bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:bg-gray-800/90">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-[#374151] dark:text-gray-100">Adicionar Novo Exame</DialogTitle>
                  <DialogDescription className="text-sm text-[#6B7280] dark:text-gray-400">
                    Preencha os detalhes do exame para adicionar ao prontuário.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="examDate" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                      Data
                    </Label>
                    <Input
                      id="examDate"
                      type="date"
                      value={newExamDate}
                      onChange={(e) => setNewExamDate(e.target.value)}
                      className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="examType" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                      Tipo de Exame
                    </Label>
                    <Select onValueChange={setNewExamType} value={newExamType} >
                      <SelectTrigger id="examType" className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="examVet" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                      Veterinário
                    </Label>
                    <Select onValueChange={setNewExamVet} value={newExamVet}>
                      <SelectTrigger id="examVet" className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
                      <h3 className="col-span-4 text-lg font-semibold mt-4 mb-2 text-[#374151] dark:text-gray-100">Eritrograma</h3>
                      <div className="grid grid-cols-2 col-span-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hemacias" className="text-[#4B5563] dark:text-gray-400 font-medium">Hemácias (m/mm3)</Label>
                          <Input id="hemacias" type="number" placeholder="Ex: 5.5" value={newHemacias} onChange={(e) => setNewHemacias(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="volumeGlobular" className="text-[#4B5563] dark:text-gray-400 font-medium">Volume globular (%)</Label>
                          <Input id="volumeGlobular" type="number" placeholder="Ex: 37" value={newVolumeGlobular} onChange={(e) => setNewVolumeGlobular(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hemoglobina" className="text-[#4B5563] dark:text-gray-400 font-medium">Hemoglobina (g/dL)</Label>
                          <Input id="hemoglobina" type="number" placeholder="Ex: 12.0" value={newHemoglobina} onChange={(e) => setNewHemoglobina(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vgm" className="text-[#4B5563] dark:text-gray-400 font-medium">VGM (fL)</Label>
                          <Input id="vgm" type="number" placeholder="Ex: 60.0" value={newVGM} onChange={(e) => setNewVGM(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chgm" className="text-[#4B5563] dark:text-gray-400 font-medium">CHGM (%)</Label>
                          <Input id="chgm" type="number" placeholder="Ex: 31" value={newCHGM} onChange={(e) => setNewCHGM(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plaquetas" className="text-[#4B5563] dark:text-gray-400 font-medium">Plaquetas (m/mm3)</Label>
                          <Input id="plaquetas" type="number" placeholder="Ex: 300" value={newPlaquetas} onChange={(e) => setNewPlaquetas(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="formasTotais" className="text-[#4B5563] dark:text-gray-400 font-medium">Formas totais (m/mm3)</Label>
                          <Input id="formasTotais" type="number" placeholder="Ex: 6.0" value={newFormasTotais} onChange={(e) => setNewFormasTotais(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hemaciasNucleadas" className="text-[#4B5563] dark:text-gray-400 font-medium">Hemácias nucleadas (g/dL)</Label>
                          <Input id="hemaciasNucleadas" type="number" placeholder="Ex: 0" value={newHemaciasNucleadas} onChange={(e) => setNewHemaciasNucleadas(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                      </div>

                      <h3 className="col-span-4 text-lg font-semibold mt-4 mb-2 text-[#374151] dark:text-gray-100">Leucograma</h3>
                      <div className="grid grid-cols-2 col-span-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="leucocitos" className="text-[#4B5563] dark:text-gray-400 font-medium">Leucócitos (m/mm3)</Label>
                          <Input id="leucocitos" type="number" placeholder="Ex: 6.0" value={newLeucocitos} onChange={(e) => setNewLeucocitos(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bastoes" className="text-[#4B5563] dark:text-gray-400 font-medium">Bastões (%)</Label>
                          <Input id="bastoes" type="number" placeholder="Ex: 0" value={newBastoes} onChange={(e) => setNewBastoes(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="segmentados" className="text-[#4B5563] dark:text-gray-400 font-medium">Segmentados (%)</Label>
                          <Input id="segmentados" type="number" placeholder="Ex: 60" value={newSegmentados} onChange={(e) => setNewSegmentados(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linfocitos" className="text-[#4B5563] dark:text-gray-400 font-medium">Linfócitos (%)</Label>
                          <Input id="linfocitos" type="number" placeholder="Ex: 30" value={newLinfocitos} onChange={(e) => setNewLinfocitos(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monocitos" className="text-[#4B5563] dark:text-gray-400 font-medium">Monócitos (%)</Label>
                          <Input id="monocitos" type="number" placeholder="Ex: 3" value={newMonocitos} onChange={(e) => setNewMonocitos(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eosinofilos" className="text-[#4B5563] dark:text-gray-400 font-medium">Eosinófilos (%)</Label>
                          <Input id="eosinofilos" type="number" placeholder="Ex: 2" value={newEosinofilos} onChange={(e) => setNewEosinofilos(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="basofilos" className="text-[#4B5563] dark:text-gray-400 font-medium">Basófilos (%)</Label>
                          <Input id="basofilos" type="number" placeholder="Ex: 1" value={newBasofilos} onChange={(e) => setNewBasofilos(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="examResult" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                        Resultado
                      </Label>
                      <Input
                        id="examResult"
                        placeholder="Resultado do exame"
                        value={newExamResult}
                        onChange={(e) => setNewExamResult(e.target.value)}
                        className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4 mt-4">
                    <Label htmlFor="examObservations" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                      Observações
                    </Label>
                    <Textarea
                      id="examObservations"
                      placeholder="Observações gerais do exame"
                      value={newExamObservations}
                      onChange={(e) => setNewExamObservations(e.target.value)}
                      className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="operator" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                      Operador
                    </Label>
                    <Input
                      id="operator"
                      placeholder="Nome do operador"
                      value={newOperator}
                      onChange={(e) => setNewOperator(e.target.value)}
                      className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="referenceDate" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                      Data de Referência
                    </Label>
                    <Input
                      id="referenceDate"
                      type="date"
                      value={newReferenceDate}
                      onChange={(e) => setNewReferenceDate(e.target.value)}
                      className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="referenceTables" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                      Tabelas de referência
                    </Label>
                    <Textarea
                      id="referenceTables"
                      placeholder="Tabelas de referência"
                      value={newReferenceTables}
                      onChange={(e) => setNewReferenceTables(e.target.value)}
                      className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="conclusions" className="text-right text-[#4B5563] dark:text-gray-400 font-medium">
                      Conclusões
                    </Label>
                    <Textarea
                      id="conclusions"
                      placeholder="Conclusões do exame"
                      value={newConclusions}
                      onChange={(e) => setNewConclusions(e.target.value)}
                      className="col-span-3 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                      rows={5}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddExamDialogOpen(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                    <X className="mr-2 h-4 w-4" /> Cancelar
                  </Button>
                  <Button onClick={handleAddExam} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <Save className="mr-2 h-4 w-4" /> Salvar Exame
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="sales" className="mt-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-green-400 dark:bg-gray-800/90">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                  <DollarSign className="h-5 w-5 text-green-500" /> Histórico de Vendas
                </CardTitle>
                <Button size="sm" className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Venda
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {mockSales.length > 0 ? (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Quantidade</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockSales.map((sale, index) => (
                          <TableRow key={sale.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                            <TableCell>{formatDate(sale.date)}</TableCell>
                            <TableCell>{sale.item}</TableCell>
                            <TableCell>{sale.quantity}</TableCell>
                            <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Eye className="h-4 w-4" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhuma venda registrada.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccines" className="mt-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-yellow-400 dark:bg-gray-800/90">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                  <Syringe className="h-5 w-5 text-yellow-500" /> Histórico de Vacinas
                </CardTitle>
                <Button size="sm" className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Vacina
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {mockVaccines.length > 0 ? (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Próxima Dose</TableHead>
                          <TableHead>Veterinário</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockVaccines.map((vaccine, index) => (
                          <TableRow key={vaccine.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                            <TableCell>{formatDate(vaccine.date)}</TableCell>
                            <TableCell>{vaccine.type}</TableCell>
                            <TableCell>{formatDate(vaccine.nextDue)}</TableCell>
                            <TableCell>{vaccine.vet}</TableCell>
                            <TableCell className="text-right">
                              <Eye className="h-4 w-4" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhuma vacina registrada.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Peso */}
          <TabsContent value="weight" className="mt-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-orange-400 dark:bg-gray-800/90">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                  <Weight className="h-5 w-5 text-orange-500" /> Histórico de Peso
                </CardTitle>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={newWeightDate}
                    onChange={(e) => setNewWeightDate(e.target.value)}
                    className="w-[150px] bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                  />
                  <Input
                    type="number"
                    placeholder="Peso (kg)"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-[120px] bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                  />
                  <Button size="sm" onClick={handleAddWeight} className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Peso
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {weightHistory.length > 0 ? (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Peso (kg)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {weightHistory.map((entry, index) => (
                          <TableRow key={entry.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                            <TableCell>{formatDate(entry.date)}</TableCell>
                            <TableCell className="text-right">{entry.weight.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum registro de peso.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Documentos */}
          <TabsContent value="documents" className="mt-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-teal-400 dark:bg-gray-800/90">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                  <FileText className="h-5 w-5 text-teal-500" /> Documentos
                </CardTitle>
                <div className="flex gap-2 items-center flex-wrap">
                  <Input
                    type="text"
                    placeholder="Nome do Documento"
                    value={newDocumentName}
                    onChange={(e) => setNewDocumentName(e.target.value)}
                    className="w-[200px] bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                  />
                  <Input
                    type="file"
                    onChange={(e) => setNewDocumentFile(e.target.files ? e.target.files[0] : null)}
                    className="w-[200px] bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                  />
                  <Button size="sm" onClick={handleAddDocument} disabled={!newDocumentName || !newDocumentFile} className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Documento
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {documents.length > 0 ? (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc, index) => (
                          <TableRow key={doc.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                            <TableCell>{formatDate(doc.date)}</TableCell>
                            <TableCell>{doc.name}</TableCell>
                            <TableCell className="text-right">
                              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhum documento registrado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Receitas */}
          <TabsContent value="prescriptions" className="mt-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-indigo-400 dark:bg-gray-800/90">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                  <ClipboardList className="h-5 w-5 text-indigo-500" /> Receitas
                </CardTitle>
                <Link to={`/clients/${clientId}/animals/${animalId}/add-prescription`}>
                  <Button size="sm" className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Nova Receita
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                {prescriptions.length > 0 ? (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Medicação</TableHead>
                          <TableHead>Tratamento</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prescriptions.map((rx, index) => (
                          <TableRow key={rx.id} className={cn(index % 2 === 1 && "bg-muted/50")}>
                            <TableCell>{formatDate(rx.date)}</TableCell>
                            <TableCell>{rx.medicationName}</TableCell>
                            <TableCell>{rx.treatmentDescription || "N/A"}</TableCell>
                            <TableCell className="text-right">
                              <Link to={`/clients/${clientId}/animals/${animalId}/edit-prescription/${rx.id}`}>
                                <Button variant="ghost" size="sm" className="rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                                  <Eye className="h-4 w-4" /> Ver
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-4 py-4">Nenhuma receita registrada.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba: Observações */}
          <TabsContent value="observations" className="mt-4">
            <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-gray-400 dark:bg-gray-800/90">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                  <MessageSquare className="h-5 w-5 text-gray-500" /> Observações Gerais
                </CardTitle>
                <Button size="sm" onClick={handleAddObservation} disabled={!newObservation.trim()} className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Observação
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <Textarea
                    placeholder="Adicione uma nova observação..."
                    rows={3}
                    value={newObservation}
                    onChange={(e) => setNewObservation(e.target.value)}
                    className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                  />
                </div>
                {observations.length > 0 ? (
                  <div className="space-y-4">
                    {observations.map((obs, index) => (
                      <div key={obs.id} className={cn("border p-3 rounded-md bg-white dark:bg-gray-800", index % 2 === 1 ? "bg-muted/50 dark:bg-gray-700" : "bg-background dark:bg-gray-800")}>
                        <p className="text-sm text-[#4B5563] dark:text-gray-400 font-medium mb-1">{formatDate(obs.date)}</p>
                        <p className="text-foreground">{obs.observation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">Nenhuma observação registrada.</p>
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