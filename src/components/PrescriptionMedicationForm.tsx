import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, ChevronUp, ChevronDown, Edit } from "lucide-react";
import { cn } from "@/lib/utils"; // Importar cn para classes condicionais

export interface MedicationData {
  id: string;
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
  generatedInstructions: string; // This will store the final instruction (auto or custom)
  generalObservations: string; // This is for the separate 'Observações Gerais' at the bottom
  totalQuantity: string; // Numeric string for calculation
  totalQuantityDisplay?: string; // Formatted string for display in PDF
  isCollapsed?: boolean; // To control collapse state in the form
}

interface PrescriptionMedicationFormProps {
  medication: MedicationData;
  index: number;
  onSave: (updatedMedication: MedicationData) => void;
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string) => void;
}

const mockUseTypes = ["Uso Oral", "Uso Tópico", "Uso Oftalmológico", "Uso Auricular", "Uso Injetável"];
const mockPharmacyTypes = ["Farmácia Veterinária", "Farmácia Humana"];
const mockPharmaceuticalForms = ["Comprimido", "Cápsula", "Líquido (ml)", "Gotas", "Aplicação", "Spray", "Pomada", "Outro"];
const mockFrequencies = ["6 horas", "8 horas", "12 horas", "24 horas (1x/dia)", "Outro"];
const mockPeriods = ["3 dias", "5 dias", "7 dias", "10 dias", "14 dias", "21 dias", "Outro"];

const PrescriptionMedicationForm: React.FC<PrescriptionMedicationFormProps> = ({
  medication,
  index,
  onSave,
  onDelete,
  onToggleCollapse,
}) => {
  const [useType, setUseType] = useState<string>(medication.useType);
  const [pharmacyType, setPharmacyType] = useState<string>(medication.pharmacyType);
  const [medicationName, setMedicationName] = useState<string>(medication.medicationName);
  const [concentration, setConcentration] = useState<string>(medication.concentration);
  const [pharmaceuticalForm, setPharmaceuticalForm] = useState<string>(medication.pharmaceuticalForm);
  const [customPharmaceuticalForm, setCustomPharmaceuticalForm] = useState<string>(medication.customPharmaceuticalForm || "");
  const [dosePerAdministration, setDosePerAdministration] = useState<string>(medication.dosePerAdministration);
  const [frequency, setFrequency] = useState<string>(medication.frequency);
  const [customFrequency, setCustomFrequency] = useState<string>(medication.customFrequency || "");
  const [period, setPeriod] = useState<string>(medication.period);
  const [customPeriod, setCustomPeriod] = useState<string>(medication.customPeriod || "");
  const [useCustomInstructions, setUseCustomInstructions] = useState<boolean>(medication.useCustomInstructions);
  const [customInstructionInput, setCustomInstructionInput] = useState<string>(
    medication.useCustomInstructions ? medication.generatedInstructions : ""
  ); // New state for custom instruction text
  const [generalObservations, setGeneralObservations] = useState<string>(medication.generalObservations);
  const [totalQuantity, setTotalQuantity] = useState<string>(medication.totalQuantity);
  const [totalQuantityDisplay, setTotalQuantityDisplay] = useState<string>(medication.totalQuantityDisplay || "");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(medication.isCollapsed || false); // Start expanded by default for new forms

  // Função para gerar as instruções automaticamente
  const generateAutoInstructions = () => {
    let instructions = "";
    const doseText = dosePerAdministration.trim();
    let formText = pharmaceuticalForm === "Outro" && customPharmaceuticalForm.trim() ? customPharmaceuticalForm.trim() : pharmaceuticalForm.trim();
    const freqText = frequency === "Outro" && customFrequency.trim() ? customFrequency.trim() : frequency.trim();
    const periodText = period === "Outro" && customPeriod.trim() ? customPeriod.trim() : period.trim();

    // Ensure formText is lowercase for the instruction, but keep original for display if needed elsewhere
    const displayFormText = formText.toLowerCase(); 
    const pluralFormText = (displayFormText.includes("comprimido") || displayFormText.includes("cápsula"))
        ? `${displayFormText}(s)`
        : displayFormText;

    if (doseText && formText && freqText && periodText) {
      instructions = `Dê ${doseText} ${pluralFormText}, a cada ${freqText}, durante ${periodText}.`;
    } else if (doseText && formText && freqText) {
      instructions = `Dê ${doseText} ${pluralFormText}, a cada ${freqText}.`;
    } else if (doseText && formText) {
      instructions = `Dê ${doseText} ${pluralFormText}.`;
    } else if (doseText) {
      instructions = `Dê ${doseText}.`;
    }
    return instructions;
  };

  useEffect(() => {
    // Calculate total quantity (simple example, can be more complex)
    let calculatedQuantity = 0;
    const doseNum = parseFloat(dosePerAdministration);
    const periodValue = period === "Outro" && customPeriod.trim() ? customPeriod.trim() : period.trim();
    const periodNum = parseFloat(periodValue.split(' ')[0]); // e.g., "7 dias" -> 7

    if (!isNaN(doseNum) && !isNaN(periodNum)) {
      let freqMultiplier = 1;
      if (frequency.includes("24 horas")) freqMultiplier = 1;
      else if (frequency.includes("12 horas")) freqMultiplier = 2;
      else if (frequency.includes("8 horas")) freqMultiplier = 3;
      else if (frequency.includes("6 horas")) freqMultiplier = 4;
      
      calculatedQuantity = doseNum * freqMultiplier * periodNum;
    }
    setTotalQuantity(calculatedQuantity > 0 ? calculatedQuantity.toString() : "");

    // Format total quantity for display in PDF
    let formattedTotalQuantity = "";
    if (calculatedQuantity > 0) {
      let formUnit = pharmaceuticalForm === "Outro" && customPharmaceuticalForm.trim() ? customPharmaceuticalForm.trim() : pharmaceuticalForm.trim();
      formUnit = formUnit.toLowerCase(); // Ensure lowercase for unit
      
      // Simple pluralization logic
      if (formUnit.includes("comprimido") || formUnit.includes("cápsula") || formUnit.includes("gota") || formUnit.includes("aplicacao")) {
        formattedTotalQuantity = `${calculatedQuantity} ${formUnit}(s)`;
      } else if (formUnit.includes("ml")) {
        formattedTotalQuantity = `${calculatedQuantity} mL`;
      } else {
        formattedTotalQuantity = `${calculatedQuantity} ${formUnit}`; // Fallback for other units
      }
    }
    setTotalQuantityDisplay(formattedTotalQuantity);

  }, [dosePerAdministration, pharmaceuticalForm, customPharmaceuticalForm, frequency, customFrequency, period, customPeriod]);

  const handleSave = () => {
    if (
      !useType ||
      !pharmacyType ||
      !medicationName.trim() ||
      !pharmaceuticalForm ||
      !dosePerAdministration.trim() ||
      !frequency ||
      !period ||
      (useCustomInstructions && !customInstructionInput.trim()) // Custom instruction is required if enabled
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const currentAutoGeneratedInstructions = generateAutoInstructions(); // Gerar instruções aqui

    const updatedMedication: MedicationData = {
      ...medication,
      useType,
      pharmacyType,
      medicationName: medicationName.trim(),
      concentration: concentration.trim(),
      pharmaceuticalForm: pharmaceuticalForm === "Outro" ? customPharmaceuticalForm.trim() : pharmaceuticalForm,
      customPharmaceuticalForm: pharmaceuticalForm === "Outro" ? customPharmaceuticalForm.trim() : undefined,
      dosePerAdministration: dosePerAdministration.trim(),
      frequency: frequency === "Outro" ? customFrequency.trim() : frequency,
      customFrequency: frequency === "Outro" ? customFrequency.trim() : undefined,
      period: period === "Outro" ? customPeriod.trim() : period,
      customPeriod: period === "Outro" ? customPeriod.trim() : undefined,
      useCustomInstructions,
      generatedInstructions: useCustomInstructions ? customInstructionInput.trim() : currentAutoGeneratedInstructions, // Usar as instruções geradas
      generalObservations: generalObservations.trim(),
      totalQuantity,
      totalQuantityDisplay, // Save the formatted display string
      isCollapsed: true, // Collapse after saving
    };
    console.log("[PrescriptionMedicationForm] Salvando medicamento:", updatedMedication); // Adicionado console.log
    onSave(updatedMedication);
    setIsCollapsed(true); // Collapse after saving
  };

  const handleEdit = () => {
    setIsCollapsed(false); // Expand to edit
  };

  const displayMedicationName = medicationName.trim() || "Medicamento sem nome";
  const displayPharmacyType = pharmacyType === "Farmácia Veterinária" ? "Vet" : "Humana";
  const currentAutoGeneratedInstructionsForDisplay = generateAutoInstructions(); // Gerar para exibição

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
            #{index + 1}
          </span>
          {isCollapsed ? (
            <>
              {displayMedicationName} {concentration && ` ${concentration}`}
              {pharmacyType && <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">{displayPharmacyType}</span>}
            </>
          ) : (
            displayMedicationName
          )}
        </h3>
        <div className="flex items-center gap-2">
          {isCollapsed && (
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onDelete(medication.id)}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onToggleCollapse(medication.id)}>
            {isCollapsed ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`useType-${medication.id}`}>Tipo de Uso *</Label>
              <Select onValueChange={setUseType} value={useType}>
                <SelectTrigger id={`useType-${medication.id}`}>
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
              <Label htmlFor={`pharmacyType-${medication.id}`}>Tipo de Farmácia *</Label>
              <Select onValueChange={setPharmacyType} value={pharmacyType}>
                <SelectTrigger id={`pharmacyType-${medication.id}`}>
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
              <Label htmlFor={`medicationName-${medication.id}`}>Nome do Medicamento *</Label>
              <Input
                id={`medicationName-${medication.id}`}
                placeholder="Ex: Carprofeno"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`concentration-${medication.id}`}>Concentração</Label>
              <Input
                id={`concentration-${medication.id}`}
                placeholder="Ex: 75mg, 100mg/ml"
                value={concentration}
                onChange={(e) => setConcentration(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`pharmaceuticalForm-${medication.id}`}>Forma Farmacêutica *</Label>
              <Select onValueChange={setPharmaceuticalForm} value={pharmaceuticalForm}>
                <SelectTrigger id={`pharmaceuticalForm-${medication.id}`}>
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
              <Label htmlFor={`dosePerAdministration-${medication.id}`}>Dose por Administração *</Label>
              <Input
                id={`dosePerAdministration-${medication.id}`}
                placeholder="Ex: 1, 0.5, 2"
                value={dosePerAdministration}
                onChange={(e) => setDosePerAdministration(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor={`frequency-${medication.id}`}>Frequência *</Label>
              <Select onValueChange={setFrequency} value={frequency}>
                <SelectTrigger id={`frequency-${medication.id}`}>
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
              <Label htmlFor={`period-${medication.id}`}>Período *</Label>
              <Select onValueChange={setPeriod} value={period}>
                <SelectTrigger id={`period-${medication.id}`}>
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
              <Label htmlFor={`totalQuantity-${medication.id}`}>Quantidade Total</Label>
              <Input id={`totalQuantity-${medication.id}`} placeholder="Auto calculado" value={totalQuantityDisplay} disabled />
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
              id={`custom-instructions-${medication.id}`}
              checked={useCustomInstructions}
              onCheckedChange={setUseCustomInstructions}
            />
            <Label htmlFor={`custom-instructions-${medication.id}`}>Usar instrução personalizada</Label>
          </div>

          {useCustomInstructions ? (
            <div className="space-y-2 mt-4">
              <Label htmlFor={`customInstructionInput-${medication.id}`}>Instrução Personalizada *</Label>
              <Textarea
                id={`customInstructionInput-${medication.id}`}
                placeholder="Digite a instrução de uso personalizada..."
                rows={3}
                value={customInstructionInput}
                onChange={(e) => setCustomInstructionInput(e.target.value)}
              />
            </div>
          ) : (
            currentAutoGeneratedInstructionsForDisplay && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm mt-4 dark:bg-green-950 dark:border-green-700 dark:text-green-200">
                <p className="font-semibold mb-1">Instrução Gerada:</p>
                <p>{currentAutoGeneratedInstructionsForDisplay}</p>
              </div>
            )
          )}

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>
              <Plus className="h-4 w-4 mr-2" /> Salvar Medicamento
            </Button>
          </div>

          <div className="space-y-2 mt-6">
            <h4 className="text-lg font-semibold">Observações Gerais</h4>
            <Textarea
              id={`generalObservations-${medication.id}`}
              placeholder="Instruções especiais, restrições alimentares, ou outras observações..."
              rows={3}
              value={generalObservations}
              onChange={(e) => setGeneralObservations(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PrescriptionMedicationForm;