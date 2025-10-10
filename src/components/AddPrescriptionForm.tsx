import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; // Importar Switch
import { Plus, Trash2, ChevronUp } from "lucide-react"; // Adicionar ícones

interface PrescriptionData {
  useType: string;
  pharmacyType: string;
  medicationName: string;
  concentration: string;
  pharmaceuticalForm: string;
  customPharmaceuticalForm?: string;
  dosePerAdministration: string;
  frequency: string;
  customFrequency?: string;
  period: string;
  customPeriod?: string;
  useCustomInstructions: boolean;
  generalObservations: string;
}

interface AddPrescriptionFormProps {
  onAddPrescription: (data: PrescriptionData) => void;
}

const mockUseTypes = ["Uso Contínuo", "Uso Pontual", "Uso Pós-Cirúrgico"];
const mockPharmacyTypes = ["Farmácia Veterinária", "Farmácia Humana"];
const mockPharmaceuticalForms = ["Comprimido", "Líquido", "Injetável", "Tópico", "Outro"];
const mockFrequencies = ["1x ao dia", "2x ao dia", "3x ao dia", "A cada 8 horas", "A cada 12 horas", "Outro"];
const mockPeriods = ["7 dias", "14 dias", "30 dias", "Até o fim do tratamento", "Outro"];

const AddPrescriptionForm: React.FC<AddPrescriptionFormProps> = ({ onAddPrescription }) => {
  const [useType, setUseType] = useState<string>("");
  const [pharmacyType, setPharmacyType] = useState<string>("");
  const [medicationName, setMedicationName] = useState<string>("");
  const [concentration, setConcentration] = useState<string>("");
  const [pharmaceuticalForm, setPharmaceuticalForm] = useState<string>("");
  const [customPharmaceuticalForm, setCustomPharmaceuticalForm] = useState<string>("");
  const [dosePerAdministration, setDosePerAdministration] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [customFrequency, setCustomFrequency] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [customPeriod, setCustomPeriod] = useState<string>("");
  const [useCustomInstructions, setUseCustomInstructions] = useState<boolean>(false);
  const [generalObservations, setGeneralObservations] = useState<string>("");

  const handleSubmit = () => {
    if (
      !useType ||
      !pharmacyType ||
      !medicationName.trim() ||
      !pharmaceuticalForm ||
      !dosePerAdministration.trim() ||
      !frequency ||
      !period
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const data: PrescriptionData = {
      useType,
      pharmacyType,
      medicationName: medicationName.trim(),
      concentration: concentration.trim(),
      pharmaceuticalForm: pharmaceuticalForm === "Outro" ? customPharmaceuticalForm.trim() : pharmaceuticalForm,
      dosePerAdministration: dosePerAdministration.trim(),
      frequency: frequency === "Outro" ? customFrequency.trim() : frequency,
      period: period === "Outro" ? customPeriod.trim() : period,
      useCustomInstructions,
      generalObservations: generalObservations.trim(),
    };

    onAddPrescription(data);
    // Reset form fields
    setUseType("");
    setPharmacyType("");
    setMedicationName("");
    setConcentration("");
    setPharmaceuticalForm("");
    setCustomPharmaceuticalForm("");
    setDosePerAdministration("");
    setFrequency("");
    setCustomFrequency("");
    setPeriod("");
    setCustomPeriod("");
    setUseCustomInstructions(false);
    setGeneralObservations("");
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
            #1
          </span>
          Medicamento sem nome
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="useType">Tipo de Uso *</Label>
          <Select onValueChange={setUseType} value={useType}>
            <SelectTrigger id="useType">
              <SelectValue placeholder="Selecionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {mockUseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pharmacyType">Tipo de Farmácia *</Label>
          <Select onValueChange={setPharmacyType} value={pharmacyType}>
            <SelectTrigger id="pharmacyType">
              <SelectValue placeholder="Selecionar farmácia" />
            </SelectTrigger>
            <SelectContent>
              {mockPharmacyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="medicationName">Nome do Medicamento *</Label>
          <Input
            id="medicationName"
            placeholder="Ex: Carprofeno"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="concentration">Concentração</Label>
          <Input
            id="concentration"
            placeholder="Ex: 75mg, 100mg/ml"
            value={concentration}
            onChange={(e) => setConcentration(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pharmaceuticalForm">Forma Farmacêutica *</Label>
          <Select onValueChange={setPharmaceuticalForm} value={pharmaceuticalForm}>
            <SelectTrigger id="pharmaceuticalForm">
              <SelectValue placeholder="Selecionar forma" />
            </SelectTrigger>
            <SelectContent>
              {mockPharmaceuticalForms.map((form) => (
                <SelectItem key={form} value={form}>
                  {form}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {pharmaceuticalForm === "Outro" && (
            <Input
              placeholder="Ou digite forma personalizada"
              value={customPharmaceuticalForm}
              onChange={(e) => setCustomPharmaceuticalForm(e.target.value)}
              className="mt-2"
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dosePerAdministration">Dose por Administração *</Label>
          <Input
            id="dosePerAdministration"
            placeholder="Ex: 1, 0.5, 2"
            value={dosePerAdministration}
            onChange={(e) => setDosePerAdministration(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequência *</Label>
          <Select onValueChange={setFrequency} value={frequency}>
            <SelectTrigger id="frequency">
              <SelectValue placeholder="A cada..." />
            </SelectTrigger>
            <SelectContent>
              {mockFrequencies.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">Período *</Label>
          <Select onValueChange={setPeriod} value={period}>
            <SelectTrigger id="period">
              <SelectValue placeholder="Por..." />
            </SelectTrigger>
            <SelectContent>
              {mockPeriods.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalQuantity">Quantidade Total</Label>
          <Input id="totalQuantity" placeholder="Auto calculado" disabled />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frequency === "Outro" && (
          <Input
            placeholder="Ou digite frequência personalizada"
            value={customFrequency}
            onChange={(e) => setCustomFrequency(e.target.value)}
          />
        )}
        {period === "Outro" && (
          <Input
            placeholder="Ou digite período personalizado"
            value={customPeriod}
            onChange={(e) => setCustomPeriod(e.target.value)}
          />
        )}
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="custom-instructions"
          checked={useCustomInstructions}
          onCheckedChange={setUseCustomInstructions}
        />
        <Label htmlFor="custom-instructions">Usar instrução personalizada</Label>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit}>
          <Plus className="h-4 w-4 mr-2" /> Salvar Medicamento
        </Button>
      </div>

      <div className="space-y-2 mt-6">
        <h4 className="text-lg font-semibold">Observações Gerais</h4>
        <Textarea
          id="generalObservations"
          placeholder="Instruções especiais, restrições alimentares, ou outras observações..."
          rows={3}
          value={generalObservations}
          onChange={(e) => setGeneralObservations(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddPrescriptionForm;