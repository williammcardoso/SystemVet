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

// Novas interfaces para Receita Manipulada
export interface ManipulatedFormulaComponent {
  id: string;
  name: string;
  dosageQuantity: string;
  dosageUnit: string; // Ex: Grama (g), Miligrama (mg), Mililitro (mL)
}

export interface ManipulatedVehicleExcipient {
  type: string; // Ex: Comprimido, Cápsula, Líquido
  quantity: string; // Ex: "30"
  unit: string; // Ex: %, Grama (g), Micrograma (mcg)
}

export interface ManipulatedPosologyAutomatic {
  dosage: string;
  measure: string; // Ex: Comprimido, Cápsula
  frequencyValue: string; // Ex: "1"
  frequencyUnit: string; // Ex: "Dia"
  durationValue: string; // Ex: "5"
  durationUnit: string; // Ex: "Dia"
  finalDescription: string; // Auto-gerada
}

export interface ManipulatedPosologyFreeText {
  finalDescription: string; // Texto livre
}

export type ManipulatedPosology = { type: 'automatic', data: ManipulatedPosologyAutomatic } | { type: 'freeText', data: ManipulatedPosologyFreeText };

export interface ManipulatedProductDetails {
  productType: string; // Ex: "Simples" (do sistema de origem da imagem)
  quantity: string; // Ex: "1 unidade"
  pharmacy: string; // Ex: "Veterinária"
  route: string; // Ex: "Oral"
}

export interface ManipulatedPrescriptionData {
  formulaComponents: ManipulatedFormulaComponent[];
  vehicleExcipient?: ManipulatedVehicleExcipient;
  posology: ManipulatedPosology;
  productDetails: ManipulatedProductDetails;
  generalObservations: string; // Observações gerais para a receita manipulada
}

// Atualização da PrescriptionEntry para ser um tipo de união
export interface PrescriptionEntry {
  id: string;
  date: string;
  medicationName: string; // Resumo para a tabela
  treatmentDescription?: string; // Novo campo para descrição do tratamento
  instructions: string; // Observações gerais da receita (para simples/controlada)
  type: 'simple' | 'controlled' | 'manipulated'; // Novo campo para o tipo de receita
  medications?: MedicationData[]; // Detalhes completos dos medicamentos (apenas para simples/controlada)
  manipulatedPrescription?: ManipulatedPrescriptionData; // Detalhes da receita manipulada (apenas para manipulada)
}