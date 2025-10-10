import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface AddPrescriptionFormProps {
  onAddPrescription: (medication: string, dosage: string, instructions: string) => void;
}

const AddPrescriptionForm: React.FC<AddPrescriptionFormProps> = ({ onAddPrescription }) => {
  const [medication, setMedication] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  const handleSubmit = () => {
    if (medication.trim() && dosage.trim()) {
      onAddPrescription(medication.trim(), dosage.trim(), instructions.trim());
      setMedication("");
      setDosage("");
      setInstructions("");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded-lg bg-muted/50">
      <div className="space-y-2">
        <Label htmlFor="medication">Medicação</Label>
        <Input
          id="medication"
          placeholder="Nome da medicação"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dosage">Dosagem</Label>
        <Input
          id="dosage"
          placeholder="Ex: 5mg, 2x ao dia"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
      </div>
      <div className="space-y-2 col-span-full">
        <Label htmlFor="instructions">Instruções</Label>
        <Textarea
          id="instructions"
          placeholder="Instruções de uso"
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      <div className="col-span-full flex justify-end">
        <Button onClick={handleSubmit} disabled={!medication || !dosage}>
          <Plus className="h-4 w-4 mr-2" /> Salvar Receita
        </Button>
      </div>
    </div>
  );
};

export default AddPrescriptionForm;