import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  CalendarDays,
  Stethoscope,
  DollarSign,
  Syringe,
  Weight,
  FileText,
  ClipboardList,
  MessageSquare,
  Eye,
  X,
  Save,
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
import { toast } from "sonner"; // Importar toast para notificações

// Mock data (centralizado aqui para facilitar o exemplo, mas idealmente viria de um serviço)
interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthday: string;
  coatColor: string;
  weight: number;
  microchip: string;
  notes: string;
}

interface Client {
  id: string;
  name: string;
  animals: Animal[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "William",
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
      },
    ],
  },
  {
    id: "2",
    name: "Maria",
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
      },
    ],
  },
  {
    id: "3",
    name: "João",
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
      },
    ],
  },
  {
    id: "4",
    name: "Ana",
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
  fileUrl: string; // Placeholder for a file URL
}

interface PrescriptionEntry {
  id: string;
  date: string;
  medicationName: string;
  dosePerAdministration: string;
  frequency: string;
  period: string;
  instructions: string; // Simplified for table display
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

// Mock de receitas existentes (para simular carregamento em modo de edição)
const mockPrescriptions: PrescriptionEntry[] = [
  {
    id: "rx1",
    date: "2023-11-01",
    medicationName: "Antibiótico X, Anti-inflamatório Y",
    dosePerAdministration: "Ver detalhes",
    frequency: "2x ao dia",
    period: "7 dias",
    instructions: "Administrar com alimento.",
  },
  {
    id: "rx-long-test", // Adicionando a receita longa aqui
    date: new Date().toISOString().split('T')[0],
    medicationName: "Receita de Teste Longa (8 medicamentos)",
    dosePerAdministration: "Ver detalhes",
    frequency: "Ver detalhes",
    period: "Ver detalhes",
    instructions: "Esta é uma receita de teste com múltiplos medicamentos para verificar a paginação do PDF.",
  },
];


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
      alert("Por favor, preencha a data, tipo de exame e veterinário.");
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
        alert("Por favor, preencha o resultado do exame.");
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{animal.name} - Prontuário</h1>
        <Link to={`/clients/${client.id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para {client.name}
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Informações do Animal</h2>
        <Card>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tutor:</p>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Espécie:</p>
              <p className="font-medium">{animal.species}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Raça:</p>
              <p className="font-medium">{animal.breed}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sexo:</p>
              <p className="font-medium">{animal.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nascimento:</p>
              <p className="font-medium">{animal.birthday}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pelagem:</p>
              <p className="font-medium">{animal.coatColor}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peso:</p>
              <p className="font-medium">{animal.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Microchip:</p>
              <p className="font-medium">{animal.microchip || "N/A"}</p>
            </div>
            <div className="col-span-full">
              <p className="text-sm text-muted-foreground">Observações:</p>
              <p className="font-medium">{animal.notes || "Nenhuma observação."}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
          <TabsTrigger value="appointments">
            <Stethoscope className="h-4 w-4 mr-2" /> Atendimento
          </TabsTrigger>
          <TabsTrigger value="exams">
            <CalendarDays className="h-4 w-4 mr-2" /> Exames
          </TabsTrigger>
          <TabsTrigger value="sales">
            <DollarSign className="h-4 w-4 mr-2" /> Vendas
          </TabsTrigger>
          <TabsTrigger value="vaccines">
            <Syringe className="h-4 w-4 mr-2" /> Vacinas
          </TabsTrigger>
          <TabsTrigger value="weight">
            <Weight className="h-4 w-4 mr-2" /> Peso
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" /> Documentos
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <ClipboardList className="h-4 w-4 mr-2" /> Receitas
          </TabsTrigger>
          <TabsTrigger value="observations">
            <MessageSquare className="h-4 w-4 mr-2" /> Observações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Atendimentos</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Atendimento
              </Button>
            </CardHeader>
            <CardContent>
              {mockAppointments.length > 0 ? (
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
                    {mockAppointments.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>{app.vet}</TableCell>
                        <TableCell>{app.notes}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhum atendimento registrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Exames</CardTitle>
              <Link to={`/clients/${clientId}/animals/${animalId}/add-exam`}> {/* Link para a nova página */}
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Exame
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {examsList.length > 0 ? (
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
                    {examsList.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>{exam.type}</TableCell>
                        <TableCell>{exam.result}</TableCell>
                        <TableCell>{exam.vet}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhum exame registrado.</p>
              )}
            </CardContent>
          </Card>

          {/* Modal para Adicionar Exame (mantido aqui para referência, mas não usado diretamente) */}
          <Dialog open={isAddExamDialogOpen} onOpenChange={setIsAddExamDialogOpen}>
            <DialogContent className="sm:max-w-[700px]"> {/* Aumentado o tamanho do modal */}
              <DialogHeader>
                <DialogTitle>Adicionar Novo Exame</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do exame para adicionar ao prontuário.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="examDate" className="text-right">
                    Data
                  </Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="examType" className="text-right">
                    Tipo de Exame
                  </Label>
                  <Select onValueChange={setNewExamType} value={newExamType} >
                    <SelectTrigger id="examType" className="col-span-3">
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
                  <Label htmlFor="examVet" className="text-right">
                    Veterinário
                  </Label>
                  <Select onValueChange={setNewExamVet} value={newExamVet}>
                    <SelectTrigger id="examVet" className="col-span-3">
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
                    <h3 className="col-span-4 text-lg font-semibold mt-4 mb-2">Eritrograma</h3>
                    <div className="grid grid-cols-2 col-span-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hemacias">Hemácias (m/mm3)</Label>
                        <Input id="hemacias" type="number" placeholder="Ex: 5.5" value={newHemacias} onChange={(e) => setNewHemacias(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="volumeGlobular">Volume globular (%)</Label>
                        <Input id="volumeGlobular" type="number" placeholder="Ex: 37" value={newVolumeGlobular} onChange={(e) => setNewVolumeGlobular(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hemoglobina">Hemoglobina (g/dL)</Label>
                        <Input id="hemoglobina" type="number" placeholder="Ex: 12.0" value={newHemoglobina} onChange={(e) => setNewHemoglobina(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vgm">VGM (fL)</Label>
                        <Input id="vgm" type="number" placeholder="Ex: 60.0" value={newVGM} onChange={(e) => setNewVGM(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="chgm">CHGM (%)</Label>
                        <Input id="chgm" type="number" placeholder="Ex: 31" value={newCHGM} onChange={(e) => setNewCHGM(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plaquetas">Plaquetas (m/mm3)</Label>
                        <Input id="plaquetas" type="number" placeholder="Ex: 300" value={newPlaquetas} onChange={(e) => setNewPlaquetas(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="formasTotais">Formas totais (m/mm3)</Label>
                        <Input id="formasTotais" type="number" placeholder="Ex: 6.0" value={newFormasTotais} onChange={(e) => setNewFormasTotais(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hemaciasNucleadas">Hemácias nucleadas (g/dL)</Label>
                        <Input id="hemaciasNucleadas" type="number" placeholder="Ex: 0" value={newHemaciasNucleadas} onChange={(e) => setNewHemaciasNucleadas(e.target.value)} />
                      </div>
                    </div>

                    <h3 className="col-span-4 text-lg font-semibold mt-4 mb-2">Leucograma</h3>
                    <div className="grid grid-cols-2 col-span-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="leucocitos">Leucócitos (m/mm3)</Label>
                        <Input id="leucocitos" type="number" placeholder="Ex: 6.0" value={newLeucocitos} onChange={(e) => setNewLeucocitos(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bastoes">Bastões (%)</Label>
                        <Input id="bastoes" type="number" placeholder="Ex: 0" value={newBastoes} onChange={(e) => setNewBastoes(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="segmentados">Segmentados (%)</Label>
                        <Input id="segmentados" type="number" placeholder="Ex: 60" value={newSegmentados} onChange={(e) => setNewSegmentados(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linfocitos">Linfócitos (%)</Label>
                        <Input id="linfocitos" type="number" placeholder="Ex: 30" value={newLinfocitos} onChange={(e) => setNewLinfocitos(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monocitos">Monócitos (%)</Label>
                        <Input id="monocitos" type="number" placeholder="Ex: 3" value={newMonocitos} onChange={(e) => setNewMonocitos(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eosinofilos">Eosinófilos (%)</Label>
                        <Input id="eosinofilos" type="number" placeholder="Ex: 2" value={newEosinofilos} onChange={(e) => setNewEosinofilos(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="basofilos">Basófilos (%)</Label>
                        <Input id="basofilos" type="number" placeholder="Ex: 1" value={newBasofilos} onChange={(e) => setNewBasofilos(e.target.value)} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="examResult" className="text-right">
                      Resultado
                    </Label>
                    <Input
                      id="examResult"
                      placeholder="Resultado do exame"
                      value={newExamResult}
                      onChange={(e) => setNewExamResult(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label htmlFor="examObservations" className="text-right">
                    Observações
                  </Label>
                  <Textarea
                    id="examObservations"
                    placeholder="Observações gerais do exame"
                    value={newExamObservations}
                    onChange={(e) => setNewExamObservations(e.target.value)}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="operator" className="text-right">
                    Operador
                  </Label>
                  <Input
                    id="operator"
                    placeholder="Nome do operador"
                    value={newOperator}
                    onChange={(e) => setNewOperator(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="referenceDate" className="text-right">
                    Data de Referência
                  </Label>
                  <Input
                    id="referenceDate"
                    type="date"
                    value={newReferenceDate}
                    onChange={(e) => setNewReferenceDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="referenceTables" className="text-right">
                    Tabelas de referência
                  </Label>
                  <Textarea
                    id="referenceTables"
                    placeholder="Tabelas de referência"
                    value={newReferenceTables}
                    onChange={(e) => setNewReferenceTables(e.target.value)}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="conclusions" className="text-right">
                    Conclusões
                  </Label>
                  <Textarea
                    id="conclusions"
                    placeholder="Conclusões do exame"
                    value={newConclusions}
                    onChange={(e) => setNewConclusions(e.target.value)}
                    className="col-span-3"
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddExamDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddExam}>
                  Salvar Exame
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="sales" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Vendas</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Venda
              </Button>
            </CardHeader>
            <CardContent>
              {mockSales.length > 0 ? (
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
                    {mockSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.item}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhuma venda registrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccines" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Vacinas</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Vacina
              </Button>
            </CardHeader>
            <CardContent>
              {mockVaccines.length > 0 ? (
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
                    {mockVaccines.map((vaccine) => (
                      <TableRow key={vaccine.id}>
                        <TableCell>{vaccine.date}</TableCell>
                        <TableCell>{vaccine.type}</TableCell>
                        <TableCell>{vaccine.nextDue}</TableCell>
                        <TableCell>{vaccine.vet}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhuma vacina registrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nova aba: Peso */}
        <TabsContent value="weight" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de Peso</CardTitle>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newWeightDate}
                  onChange={(e) => setNewWeightDate(e.target.value)}
                  className="w-[150px]"
                />
                <Input
                  type="number"
                  placeholder="Peso (kg)"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-[120px]"
                />
                <Button size="sm" onClick={handleAddWeight}>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Peso
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {weightHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Peso (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weightHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell className="text-right">{entry.weight.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhum registro de peso.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nova aba: Documentos */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documentos</CardTitle>
              <div className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Nome do Documento"
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  className="w-[200px]"
                />
                <Input
                  type="file"
                  onChange={(e) => setNewDocumentFile(e.target.files ? e.target.files[0] : null)}
                  className="w-[200px]"
                />
                <Button size="sm" onClick={handleAddDocument} disabled={!newDocumentName || !newDocumentFile}>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Documento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.date}</TableCell>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell className="text-right">
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" /> Ver
                            </Button>
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhum documento registrado.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nova aba: Receitas */}
        <TabsContent value="prescriptions" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Receitas</CardTitle>
              <Link to={`/clients/${clientId}/animals/${animalId}/add-prescription`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Nova Receita
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {prescriptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Medicação</TableHead>
                      <TableHead>Dosagem</TableHead>
                      <TableHead>Frequência</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((rx) => (
                      <TableRow key={rx.id}>
                        <TableCell>{rx.date}</TableCell>
                        <TableCell>{rx.medicationName}</TableCell>
                        <TableCell>{rx.dosePerAdministration}</TableCell>
                        <TableCell>{rx.frequency}</TableCell>
                        <TableCell>{rx.period}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/clients/${clientId}/animals/${animalId}/edit-prescription/${rx.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" /> Ver
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground mt-4">Nenhuma receita registrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nova aba: Observações */}
        <TabsContent value="observations" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Observações Gerais</CardTitle>
              <Button size="sm" onClick={handleAddObservation} disabled={!newObservation.trim()}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Observação
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Textarea
                  placeholder="Adicione uma nova observação..."
                  rows={3}
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                />
              </div>
              {observations.length > 0 ? (
                <div className="space-y-4">
                  {observations.map((obs) => (
                    <div key={obs.id} className="border p-3 rounded-md bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">{obs.date}</p>
                      <p>{obs.observation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma observação registrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientRecordPage;