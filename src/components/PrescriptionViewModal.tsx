import React from "react";
import { MedicationData } from "./PrescriptionMedicationForm";
import { Separator } from "@/components/ui/separator";
import { User } from "@lucide/react"; // Importação nomeada explícita

interface PrescriptionViewModalProps {
  animalName: string;
  animalId: string;
  animalSpecies: string;
  tutorName: string;
  tutorAddress: string; // Adicionado para o endereço do tutor
  medications: MedicationData[];
  generalObservations: string;
}

const PrescriptionViewModal: React.FC<PrescriptionViewModalProps> = ({
  animalName,
  animalId,
  animalSpecies,
  tutorName,
  tutorAddress,
  medications,
  generalObservations,
}) => {
  // Agrupar medicamentos por tipo de uso
  const groupedMedications = medications.reduce((acc, med) => {
    const useType = med.useType || "Outros";
    if (!acc[useType]) {
      acc[useType] = [];
    }
    acc[useType].push(med);
    return acc;
  }, {} as Record<string, MedicationData[]>);

  return (
    <div className="p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans">
      {/* Header da Clínica */}
      <div className="flex items-start justify-between mb-8 border-b pb-4">
        <div className="flex items-center gap-4">
          <User className="h-10 w-10 text-gray-600 dark:text-gray-400" />
          <div>
            <h2 className="text-xl font-bold">Clínica Moraes Cardoso</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">CRMV 56895 SP</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Registro no MAPA MV0052750203</p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-700 dark:text-gray-300">
          <p>Rua Campos Salles, 175, Centro - Itapira - CEP: 13970-170</p>
          <p>Telefone: (19) 99363-1981</p>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6">Receita Simples</h1>

      {/* Informações do Animal e Tutor */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Animal</h3>
          <p className="text-sm">ID: {animalId}</p>
          <p className="text-sm">Nome: {animalName}</p>
          <p className="text-sm">Espécie: {animalSpecies}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Tutor</h3>
          <p className="text-sm">Nome: {tutorName}</p>
          <p className="text-sm">Endereço: {tutorAddress || "Não informado"}</p>
        </div>
      </div>

      {/* Lista de Medicamentos Agrupados */}
      {Object.keys(groupedMedications).map((useType) => (
        <div key={useType} className="mb-6">
          <h3 className="text-lg font-bold uppercase mb-3 border-b pb-2">{useType}</h3>
          <ol className="list-decimal list-inside space-y-4">
            {groupedMedications[useType].map((med) => (
              <li key={med.id} className="flex flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-base flex-shrink-0">
                    {med.medicationName} {med.concentration}
                  </span>
                  <div className="flex-grow border-b border-gray-300 dark:border-gray-600 mx-2"></div> {/* Esta é a linha */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-0.5 text-xs font-medium border border-gray-400 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200">
                      {med.pharmacyType === "Farmácia Veterinária" ? "VET" : "HUMANA"}
                    </span>
                    {med.totalQuantityDisplay && (
                      <span className="px-2 py-0.5 text-xs font-medium border border-gray-400 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        {med.totalQuantityDisplay}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 ml-4">
                  {med.generatedInstructions}
                </p>
                {med.generalObservations && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-4 mt-1 italic">
                    Obs. Medicamento: {med.generalObservations}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}

      {/* Observações Gerais da Receita */}
      {generalObservations && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-bold mb-2">Observações Gerais da Receita</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{generalObservations}</p>
        </div>
      )}

      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Data: {new Date().toLocaleDateString()}</p>
        <p>Assinatura do Veterinário: _________________________</p>
      </div>
    </div>
  );
};

export default PrescriptionViewModal;