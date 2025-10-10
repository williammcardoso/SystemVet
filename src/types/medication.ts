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

export interface PrescriptionEntry {
  id: string;
  date: string;
  medicationName: string; // Summary for the table
  dosePerAdministration: string; // Summary for the table
  frequency: string; // Summary for the table
  period: string; // Summary for the table
  instructions: string; // General observations for the prescription
  medications: MedicationData[]; // Full details of medications
}