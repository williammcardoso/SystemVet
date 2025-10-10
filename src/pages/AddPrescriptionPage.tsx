import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText, Eye, X, Save, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import PrescriptionMedicationForm, { MedicationData } from "@/components/PrescriptionMedicationForm";
import { toast } from "sonner"; // Importar toast para notificações
import { PDFDownloadLink } from "@react-pdf/renderer"; // Importar PDFDownloadLink

import PrescriptionPdfDocument from "@/components/PrescriptionPdfDocument"; // Importar o componente PDF

// Mock data para clientes (tutores) e animais (copiado de PatientRecordPage para consistência)
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
  address: string; // Adicionado endereço para o cliente
  animals: Animal[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "William",
    address: "Rua Exemplo, 123, Bairro - Cidade",
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
    address: "Avenida Principal, 456, Centro - Outra Cidade",
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
    address: "Rua das Flores, 789, Jardim - Cidade Grande",
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
    address: "Travessa da Paz, 10, Vila - Pequena Cidade",
    animals: [],
  },
  {
    id: "5",
    name: "Zara", // Adicionado Zara para o exemplo do print
    address: "Rua das Palmeiras, 50, Bairro Verde - Cidade Nova",
    animals: [
      {
        id: "a6",
        name: "Mel",
        species: "Canino", // Alterado para Canino para corresponder ao print
        breed: "SRD",
        gender: "Fêmea",
        birthday: "2022-03-01",
        coatColor: "Caramelo",
        weight: 10.0,
        microchip: "",
        notes: "Muito ativa.",
      },
    ],
  },
];

// Mock data para informações da clínica e do veterinário
const clinicInfo = {
  name: "Clínica Moraes Cardoso",
  crmv: "56895 SP",
  mapaRegistro: "MV0052750203",
  address: "Rua Campos Salles, 175, Centro - Itapira",
  cep: "13970-170",
  phone: "(19) 99363-1981",
};

const vetInfo = {
  name: "William Cardoso",
  crmv: "56895/SP",
  mapaRegistro: "MV0052750203",
};

const AddPrescriptionPage = () => {
  const { clientId, animalId } = useParams<{ clientId: string; animalId: string }>();
  const navigate = useNavigate();

  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(clientId);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | undefined>(animalId);
  const [medications, setMedications] = useState<MedicationData[]>([]);
  const [generalObservations, setGeneralObservations] = useState<string>("");

  // Encontrar os detalhes completos do cliente e animal
  const currentClient = mockClients.find(c => c.id === selectedClientId);
  const currentAnimal = currentClient?.animals.find(a => a.id === selectedAnimalId);

  const handleAddMedication = () => {
    const newMedication: MedicationData = {
      id: `med-${Date.now()}`,
      useType: "",
      pharmacyType: "",
      medicationName: "",
      concentration: "",
      pharmaceuticalForm: "",
      customPharmaceuticalForm: "", // Inicializado como string vazia
      dosePerAdministration: "",
      frequency: "",
      customFrequency: "", // Inicializado como string vazia
      period: "",
      customPeriod: "", // Inicializado como string vazia
      useCustomInstructions: false,
      generatedInstructions: "", // This will store the final instruction (auto or custom)
      generalObservations: "", // This is for the separate 'Observações Gerais' at the bottom
      totalQuantity: "",
      totalQuantityDisplay: "",
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
    if (!currentClient || !currentAnimal) {
      toast.error("Por favor, selecione um paciente e um animal.");
      return;
    }
    if (medications.length === 0) {
      toast.error("Adicione pelo menos um medicamento à receita.");
      return;
    }

    // Aqui você faria a lógica para salvar a receita completa (enviar para uma API, etc.)
    console.log("Salvando Receita para Cliente:", currentClient.name, "Animal:", currentAnimal.name);
    console.log("Medicamentos:", medications);
    console.log("Observações Gerais:", generalObservations);

    toast.success("Receita salva com sucesso!");
    navigate(`/clients/${clientId}/animals/${animalId}/record`); // Voltar para o prontuário
  };

  const isPreviewDisabled = !currentClient || !currentAnimal || medications.length === 0;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client-select">Tutor/Responsável</Label>
              <Select onValueChange={setSelectedClientId} value={selectedClientId}>
                <SelectTrigger id="client-select">
                  <SelectValue placeholder="Selecione o tutor..." />
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
            <div className="space-y-2">
              <Label htmlFor="animal-select">Animal</Label>
              <Select onValueChange={setSelectedAnimalId} value={selectedAnimalId} disabled={!selectedClientId}>
                <SelectTrigger id="animal-select">
                  <SelectValue placeholder="Selecione o animal..." />
                </SelectTrigger>
                <SelectContent>
                  {currentClient?.animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
        <PDFDownloadLink
          key={medications.length}
          document={
            <PrescriptionPdfDocument
              clinicInfo={clinicInfo}
              clientDetails={currentClient}
              animalDetails={currentAnimal}
              medications={medications}
              generalObservations={generalObservations}
              vetInfo={vetInfo}
            />
          }
          fileName={`receita_${currentClient?.name || 'paciente'}_${currentAnimal?.name || 'animal'}_${Date.now()}.pdf`}
        >
          {({ loading }) => (
            <Button variant="outline" disabled={loading || isPreviewDisabled}>
              <Eye className="mr-2 h-4 w-4" /> {loading ? "Gerando PDF..." : "Visualizar PDF"}
            </Button>
          )}
        </PDFDownloadLink>
        <Button onClick={handleSavePrescription} disabled={isPreviewDisabled}>
          <Save className="mr-2 h-4 w-4" /> Salvar Receita Simples
        </Button>
      </div>
    </div>
  );
};

export default AddPrescriptionPage;