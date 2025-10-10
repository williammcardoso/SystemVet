"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MedicationData } from "./PrescriptionMedicationForm"; // Import the interface

interface PrescriptionPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  medications: MedicationData[];
  generalObservations: string;
}

const PrescriptionPreviewDialog: React.FC<PrescriptionPreviewDialogProps> = ({
  isOpen,
  onClose,
  clientName,
  medications,
  generalObservations,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pré-visualização da Receita</DialogTitle>
          <DialogDescription>
            Verifique os detalhes da receita antes de salvar.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Paciente:</h3>
            <p className="text-muted-foreground">{clientName || "Não selecionado"}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Medicamentos:</h3>
            {medications.length > 0 ? (
              <div className="space-y-4">
                {medications.map((med, index) => (
                  <div key={med.id} className="border p-3 rounded-md bg-muted/50">
                    <p className="font-medium text-primary mb-1">
                      {index + 1}. {med.medicationName} {med.concentration && `(${med.concentration})`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tipo de Uso: {med.useType || "N/A"} | Farmácia: {med.pharmacyType || "N/A"}
                    </p>
                    <p className="text-sm mt-2">
                      Instruções: <span className="font-semibold">{med.generatedInstructions || "N/A"}</span>
                    </p>
                    {med.totalQuantity && <p className="text-xs text-muted-foreground mt-1">Quantidade Total Estimada: {med.totalQuantity}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum medicamento adicionado.</p>
            )}
          </div>

          {generalObservations && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Observações Gerais:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{generalObservations}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" /> Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionPreviewDialog;