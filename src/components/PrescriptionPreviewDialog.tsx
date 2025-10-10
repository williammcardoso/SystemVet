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
import { PDFViewer } from "@react-pdf/renderer"; // Import PDFViewer
import PrescriptionPdfDocument from "./PrescriptionPdfDocument"; // Import the new PDF document component
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden p-0"> {/* Adjusted size and padding */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Pré-visualização da Receita</DialogTitle>
          <DialogDescription>
            Verifique os detalhes da receita antes de salvar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {isOpen && ( // Only render PDFViewer when dialog is open to avoid errors
            <PDFViewer width="100%" height="calc(90vh - 120px)"> {/* Adjust height dynamically */}
              <PrescriptionPdfDocument
                clientName={clientName}
                medications={medications}
                generalObservations={generalObservations}
              />
            </PDFViewer>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" /> Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionPreviewDialog;