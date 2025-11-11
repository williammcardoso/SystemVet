"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaSave, FaTimes, FaStethoscope, FaWeightHanging, FaThermometerHalf, FaNotesMedical } from "react-icons/fa";
import { toast } from "sonner";
import { AppointmentEntry, BaseAppointmentDetails } from "@/types/appointment";
import { mockUserSettings } from "@/mockData/settings";

interface SimpleAppointmentFormProps {
  animalId: string;
  clientId: string;
  initialData?: AppointmentEntry;
  onSave: (appointment: AppointmentEntry) => void;
  onCancel: () => void;
}

const mockVets = [
  { id: "1", name: "Dr. William Cardoso" },
  { id: "2", name: "Dra. Ana Paula" },
  { id: "3", name: "Dr. Carlos Eduardo" },
];

const mockAppointmentTypes = [
  { value: "Consulta", label: "Consulta Clínica" },
  { value: "Vacina", label: "Vacinação" },
  { value: "Retorno", label: "Retorno" },
  { value: "Outros", label: "Outros" },
];

const SimpleAppointmentForm: React.FC<SimpleAppointmentFormProps> = ({
  animalId,
  clientId,
  initialData,
  onSave,
  onCancel,
}) => {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<AppointmentEntry['type']>(initialData?.type || 'Consulta');
  const [vet, setVet] = useState(initialData?.vet || mockUserSettings.userName);
  const [pesoAtual, setPesoAtual] = useState<number | ''>(initialData?.pesoAtual || '');
  const [temperaturaCorporal, setTemperaturaCorporal] = useState<number | ''>(initialData?.temperaturaCorporal || '');
  const [observacoesGerais, setObservacoesGerais] = useState(initialData?.observacoesGerais || '');
  const [queixaPrincipal, setQueixaPrincipal] = useState<string>((initialData?.details as BaseAppointmentDetails)?.queixaPrincipal || '');
  const [condutaTratamento, setCondutaTratamento] = useState<string>((initialData?.details as BaseAppointmentDetails)?.condutaTratamento || '');

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save logic
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      console.log("Auto-saving simple appointment data...");
      toast.info("Rascunho salvo automaticamente!", { duration: 1000 });
    }, 120000); // Auto-save every 2 minutes (120000 ms)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [date, type, vet, pesoAtual, temperaturaCorporal, observacoesGerais, queixaPrincipal, condutaTratamento]);

  const handleSave = () => {
    if (!date || !type || !vet || pesoAtual === '' || temperaturaCorporal === '') {
      toast.error("Por favor, preencha todos os campos obrigatórios (Data, Tipo, Veterinário, Peso, Temperatura).");
      return;
    }

    const newAppointment: AppointmentEntry = {
      id: initialData?.id || `app-${Date.now()}`,
      animalId,
      date,
      type,
      vet,
      pesoAtual: Number(pesoAtual),
      temperaturaCorporal: Number(temperaturaCorporal),
      observacoesGerais,
      details: {
        queixaPrincipal,
        condutaTratamento,
        // Outros campos de BaseAppointmentDetails podem ser adicionados aqui se necessário
      } as BaseAppointmentDetails, // Cast para BaseAppointmentDetails
      attachments: initialData?.attachments || [], // Preservar anexos se houver
    };
    onSave(newAppointment);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
            <FaNotesMedical className="h-5 w-5 text-blue-500" /> Dados Essenciais do Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data do Atendimento *</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Atendimento *</Label>
            <Select onValueChange={(value: AppointmentEntry['type']) => setType(value)} value={type} required>
              <SelectTrigger id="type"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
              <SelectContent>
                {mockAppointmentTypes.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vet">Veterinário Responsável *</Label>
            <Select onValueChange={setVet} value={vet} required>
              <SelectTrigger id="vet"><SelectValue placeholder="Selecione o veterinário" /></SelectTrigger>
              <SelectContent>
                {mockVets.map(v => <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pesoAtual">Peso Atual (kg) *</Label>
              <Input id="pesoAtual" type="number" step="0.1" value={pesoAtual} onChange={(e) => setPesoAtual(Number(e.target.value))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperaturaCorporal">Temperatura Corporal (°C) *</Label>
              <Input id="temperaturaCorporal" type="number" step="0.1" value={temperaturaCorporal} onChange={(e) => setTemperaturaCorporal(Number(e.target.value))} required />
            </div>
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="queixaPrincipal">Queixa Principal</Label>
            <Textarea id="queixaPrincipal" value={queixaPrincipal} onChange={(e) => setQueixaPrincipal(e.target.value)} rows={2} placeholder="Descreva a queixa principal do tutor..." />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="condutaTratamento">Conduta / Tratamento Prescrito</Label>
            <Textarea id="condutaTratamento" value={condutaTratamento} onChange={(e) => setCondutaTratamento(e.target.value)} rows={3} placeholder="Descreva a conduta e o tratamento..." />
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="observacoesGerais">Observações Gerais</Label>
            <Textarea id="observacoesGerais" value={observacoesGerais} onChange={(e) => setObservacoesGerais(e.target.value)} rows={3} placeholder="Observações adicionais sobre o atendimento..." />
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-950/80 dark:border-gray-800 sticky bottom-0 z-10">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaTimes className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
          <FaSave className="mr-2 h-4 w-4" /> Salvar Atendimento
        </Button>
      </div>
    </form>
  );
};

export default SimpleAppointmentForm;