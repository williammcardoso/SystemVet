"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";
import { ManipulatedFormulaComponent } from "@/types/medication";

interface ManipulatedFormulaComponentFormProps {
  component: ManipulatedFormulaComponent;
  index: number;
  onUpdate: (id: string, updatedComponent: Partial<ManipulatedFormulaComponent>) => void;
  onDelete: (id: string) => void;
}

const mockDosageUnits = ["Unidade", "Grama (g)", "Miligrama (mg)", "Mililitro (mL)", "Micrograma (mcg)"];

const ManipulatedFormulaComponentForm: React.FC<ManipulatedFormulaComponentFormProps> = ({
  component,
  index,
  onUpdate,
  onDelete,
}) => {
  const [name, setName] = useState(component.name);
  const [dosageQuantity, setDosageQuantity] = useState(component.dosageQuantity);
  const [dosageUnit, setDosageUnit] = useState(component.dosageUnit);

  useEffect(() => {
    onUpdate(component.id, { name, dosageQuantity, dosageUnit });
  }, [name, dosageQuantity, dosageUnit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex items-end gap-4 border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <div className="flex-1 space-y-2">
        <Label htmlFor={`component-name-${component.id}`}>Nome do Componente {index + 1}*</Label>
        <Input
          id={`component-name-${component.id}`}
          placeholder="Digite o Nome do Componente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
        />
      </div>
      <div className="w-32 space-y-2">
        <Label htmlFor={`dosage-quantity-${component.id}`}>Dosagem / Quantidade*</Label>
        <Input
          id={`dosage-quantity-${component.id}`}
          placeholder="Ex: 555"
          value={dosageQuantity}
          onChange={(e) => setDosageQuantity(e.target.value)}
          className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
        />
      </div>
      <div className="w-32 space-y-2">
        <Label htmlFor={`dosage-unit-${component.id}`}>Unidade*</Label>
        <Select onValueChange={setDosageUnit} value={dosageUnit}>
          <SelectTrigger id={`dosage-unit-${component.id}`} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
            <SelectValue placeholder="Ex: Unidade" />
          </SelectTrigger>
          <SelectContent>
            {mockDosageUnits.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onDelete(component.id)} className="rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
        <FaTrashAlt className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
};

export default ManipulatedFormulaComponentForm;