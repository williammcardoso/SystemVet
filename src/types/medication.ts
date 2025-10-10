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