"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FaCalendarAlt,
  FaStethoscope,
  FaWeightHanging,
  FaThermometerHalf,
  FaNotesMedical,
  FaSyringe,
  FaCut,
  FaRedo,
  FaAmbulance,
  FaCheckCircle,
  FaPaperclip,
  FaSave,
  FaTimes,
  FaPrescriptionBottleAlt,
  FaPlus,
  FaFileAlt,
  FaUserMd,
  FaHeartbeat,
  FaLungs,
  FaHamburger,
  FaBrain,
  FaExclamationCircle,
  FaRunning,
  FaBone as FaBoneIcon,
  FaHistory as FaHistoryIcon,
  FaUtensils as FaUtensilsIcon,
  FaHeadSideMask as FaHeadSideMaskIcon,
} from "react-icons/fa";
import { toast } from "sonner";
import { AppointmentEntry, ConsultationDetails, VaccinationDetails, SurgeryDetails, ReturnDetails, EmergencyDetails, CheckupDetails, BaseAppointmentDetails } from "@/types/appointment";
import { mockUserSettings } from "@/mockData/settings";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { updateAnimalDetails, mockClients } from "@/mockData/clients"; // Re-importado mockClients

interface AppointmentFormProps {
  animalId: string;
  clientId: string;
  initialData?: AppointmentEntry;
  onSave: (appointment: AppointmentEntry) => void;
  onCancel: () => void;
  mockAppointments: AppointmentEntry[]; // Para selecionar atendimento de origem
}

// Mock data para veterinários (pode vir de um contexto ou API real)
const mockVets = [
  { id: "1", name: "Dr. William Cardoso" },
  { id: "2", name: "Dra. Ana Paula" },
  { id: "3", name: "Dr. Carlos Eduardo" },
];

const mockVaccineTypes = [
  "Polivalente", "Antirrábica", "Giardíase", "Gripe", "Leucemia Felina", "Outra"
];

const mockSurgeryTypes = [
  "Castração", "Piometra", "Cesariana", "Hérnia", "Remoção de Tumor", "Outra"
];

const mockViaAdministracao = [
  { value: "SC", label: "Subcutânea (SC)" },
  { value: "IM", label: "Intramuscular (IM)" },
  { value: "VO", label: "Via Oral (VO)" },
  { value: "IN", label: "Intranasal (IN)" },
];

const mockLocalAplicacao = [
  "Escapular Direita", "Escapular Esquerda", "Posterior Direita", "Posterior Esquerda", "Outro"
];

const mockCondicaoGeral = [
  { value: "alerta", label: "Alerta" },
  { value: "deprimido", label: "Deprimido" },
  { value: "inconsciente", label: "Inconsciente" },
  { value: "choque", label: "Choque" },
  { value: "dispneia", label: "Dispneia" },
  { value: "sangramento", label: "Sangramento" },
  { value: "convulsao", label: "Convulsão" },
  { value: "outros", label: "Outros" },
];

const mockEncaminhamento = [
  { value: "internacao", label: "Internação" },
  { value: "alta", label: "Alta" },
  { value: "obito", label: "Óbito" },
];

const mockApetiteDegluticaoOptions = [
  { value: "normorexia", label: "Normorexia" },
  { value: "hiporexia", label: "Hiporexia" },
  { value: "anorexia", label: "Anorexia" },
  { value: "polifagia", label: "Polifagia" },
  { value: "parorexia", label: "Parorexia" },
  { value: "disfagia", label: "Disfagia" },
  { value: "apetiteSeletivo", label: "Apetite seletivo" },
];

const mockIngestaoAguaOptions = [
  { value: "normodipsia", label: "Normodipsia" },
  { value: "polidipsia", label: "Polidipsia" },
  { value: "oligodipsia", label: "Oligodipsia" },
  { value: "adipsia", label: "Adipsia" },
];

const mockMiccaoAlteracoesOptions = [
  { value: "disuria", label: "Disúria" },
  { value: "poliuria", label: "Poliúria" },
  { value: "polaciuria", label: "Polaciúria" },
  { value: "oliguria", label: "Oligúria" },
  { value: "anuria", label: "Anúria" },
  { value: "esforco", label: "Esforço" },
  { value: "incontinencia", label: "Incontinência" },
  { value: "nicturia", label: "Nictúria" },
  { value: "paraurese", label: "Paraurese" },
  { value: "enurese", label: "Enurese" },
];

const mockFezesDefecacoesOptions = [
  { value: "normoquesia", label: "Normoquesia" },
  { value: "disquesia", label: "Disquesia" },
  { value: "tenesmo", label: "Tenesmo" },
  { value: "diarreia", label: "Diarreia" },
  { value: "hematoquesia", label: "Hematoquesia" },
  { value: "melena", label: "Melena" },
];

const mockAlteracoesRespiratoriasTipos = [
  { value: "taquipneia", label: "Taquipneia" },
  { value: "bradipneia", label: "Bradipneia" },
  { value: "dispneia", label: "Dispneia" },
  { value: "apneia", label: "Apneia" },
];

const mockIntoleranciaExercicioTipos = [
  { value: "cansacoPosExercicio", label: "Cansaço pós-exercício" },
  { value: "taquicardia", label: "Taquicardia" },
  { value: "bradicardia", label: "Bradicardia" },
  { value: "sincope", label: "Síncope" },
  { value: "cianose", label: "Cianose" },
];

const mockOlhosEstadoOptions = [
  { value: "normais", label: "Normais" },
  { value: "anisocoria", label: "Anisocoria" },
  { value: "miose", label: "Miose" },
  { value: "midriase", label: "Midríase" },
];

const mockOrelhasAlteracoesOptions = [
  { value: "prurido", label: "Prurido" },
  { value: "secrecao", label: "Secreção" },
  { value: "odor", label: "Odor" },
  { value: "meneiosCefalicos", label: "Meneios cefálicos" },
  { value: "normoacusia", label: "Normoacusia" },
  { value: "acusia", label: "Acusia" },
];

const mockDoencaPeriodontalGrau = [
  { value: "1", label: "Grau 1" },
  { value: "2", label: "Grau 2" },
  { value: "3", label: "Grau 3" },
  { value: "4", label: "Grau 4" },
];

const mockPeleAnexosAlteracoesOptions = [
  { value: "prurido", label: "Prurido" },
  { value: "descamação", label: "Descamação" },
  { value: "odores", label: "Odores" },
  { value: "lesoes", label: "Lesões" },
  { value: "localizacoes", label: "Localizações" },
  { value: "nda", label: "NDA" },
];

const mockMucosasEstadoOptions = [
  { value: "normocoradas", label: "Normocoradas" },
  { value: "hipocoradas", label: "Hipocoradas" },
  { value: "hiperemica", label: "Hiperêmica" },
  { value: "congestas", label: "Congestas" },
  { value: "cianotica", label: "Cianótica" },
  { value: "icterica", label: "Ictérica" },
];

const mockPadraoRespiratorioOptions = [
  { value: "dispneia", label: "Dispneia" },
  { value: "taquipneia", label: "Taquipneia" },
  { value: "bradipneia", label: "Bradipneia" },
  { value: "apneia", label: "Apneia" },
  { value: "normal", label: "Normal" },
];


const AppointmentForm: React.FC<AppointmentFormProps> = ({
  animalId,
  clientId,
  initialData,
  onSave,
  onCancel,
  mockAppointments,
}) => {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(initialData?.time || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })); // Adicionado estado para a hora
  const [type, setType] = useState<AppointmentEntry['type']>(initialData?.type || '');
  const [vet, setVet] = useState(initialData?.vet || mockUserSettings.userName); // Pré-selecionado
  const [pesoAtual, setPesoAtual] = useState<number | ''>(initialData?.pesoAtual || '');
  const [temperaturaCorporal, setTemperaturaCorporal] = useState<number | ''>(initialData?.temperaturaCorporal || '');
  const [frequenciaCardiaca, setFrequenciaCardiaca] = useState<number | ''>(initialData?.frequenciaCardiaca || '');
  const [frequenciaRespiratoria, setFrequenciaRespiratoria] = useState<number | ''>(initialData?.frequenciaRespiratoria || '');
  const [observacoesGerais, setObservacoesGerais] = useState(initialData?.observacoesGerais || '');
  const [details, setDetails] = useState<ConsultationDetails>(initialData?.details as ConsultationDetails || {});
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>(initialData?.attachments || []);
  const [newAttachmentFile, setNewAttachmentFile] = useState<File | null>(null);
  const [newAttachmentName, setNewAttachmentName] = useState<string>("");

  // Novo estado para controlar o modo de consulta (simples/completo)
  const [isSimpleConsultationMode, setIsSimpleConsultationMode] = useState<boolean>(
    initialData?.type === 'Consulta' && !(initialData?.details as ConsultationDetails)?.historicoClinico // Inferir se é simples se não houver histórico clínico detalhado
      ? true
      : false
  );

  const formRef = useRef<HTMLFormElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sincroniza o estado `pesoAtual` do formulário com a prop `initialData?.pesoAtual`
  // Isso garante que, ao reabrir ou salvar o formulário, o campo de peso reflita o valor mais recente do atendimento.
  useEffect(() => {
    if (initialData?.pesoAtual !== undefined && initialData.pesoAtual !== pesoAtual) {
      setPesoAtual(initialData.pesoAtual);
    } else if (initialData?.pesoAtual === undefined && pesoAtual !== '') {
      setPesoAtual('');
    }
  }, [initialData?.pesoAtual]); // Depende apenas do valor específico da prop

  // Auto-save logic
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      // Simulate saving to a temporary state or local storage
      // In a real app, this would trigger an API call
      console.log("Auto-saving appointment data...", { date, time, type, vet, pesoAtual, temperaturaCorporal, observacoesGerais, details, attachments });
      toast.info("Rascunho salvo automaticamente!", { duration: 1000 });
    }, 120000); // Auto-save every 2 minutes (120000 ms)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [date, time, type, vet, pesoAtual, temperaturaCorporal, frequenciaCardiaca, frequenciaRespiratoria, observacoesGerais, details, attachments]);

  const handleDetailChange = (field: keyof ConsultationDetails, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: keyof ConsultationDetails, value: string, isChecked: boolean) => {
    setDetails(prev => {
      const currentValues = (prev[field] || []) as string[];
      if (isChecked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      }
    });
  };

  const handleSave = () => {
    if (!date || !type) {
      toast.error("Por favor, preencha a Data do Atendimento e o Tipo de Atendimento.");
      return;
    }

    if (pesoAtual === '' || temperaturaCorporal === '' || frequenciaCardiaca === '' || frequenciaRespiratoria === '') {
      toast.info("Alguns sinais vitais não preenchidos. Salvando como rascunho.", { duration: 3000 });
    }

    const newAppointment: AppointmentEntry = {
      id: initialData?.id || `app-${Date.now()}`,
      animalId,
      date,
      time, // Incluído o campo de hora
      type,
      vet,
      pesoAtual: Number(pesoAtual) || undefined, // Permitir undefined se vazio
      temperaturaCorporal: Number(temperaturaCorporal) || undefined, // Permitir undefined se vazio
      frequenciaCardiaca: Number(frequenciaCardiaca) || undefined,
      frequenciaRespiratoria: Number(frequenciaRespiratoria) || undefined,
      observacoesGerais,
      details,
      attachments,
    };
    onSave(newAppointment);

    // Atualizar o peso do animal no mockClients se o peso atual for fornecido
    if (pesoAtual !== '') {
      const currentClient = mockClients.find(c => c.id === clientId);
      const currentAnimal = currentClient?.animals.find(a => a.id === animalId);

      if (currentAnimal && currentAnimal.weight !== Number(pesoAtual)) {
        updateAnimalDetails(clientId, animalId, {
          weight: Number(pesoAtual),
          lastWeightSource: "Atendimento Clínico",
        });
        toast.info(`Peso do animal atualizado automaticamente para ${pesoAtual} kg!`);
      }
    }
  };

  const handleAddAttachment = () => {
    if (newAttachmentFile && newAttachmentName.trim()) {
      const newAttachment = {
        name: newAttachmentName.trim(),
        url: URL.createObjectURL(newAttachmentFile), // Placeholder URL
      };
      setAttachments(prev => [...prev, newAttachment]);
      setNewAttachmentName("");
      setNewAttachmentFile(null);
      toast.success("Anexo adicionado!");
    } else {
      toast.error("Por favor, forneça um nome e selecione um arquivo para o anexo.");
    }
  };

  const handleDeleteAttachment = (url: string) => {
    setAttachments(prev => prev.filter(att => att.url !== url));
    toast.info("Anexo removido.");
  };

  const renderDynamicFields = () => {
    switch (type) {
      case 'Consulta':
        const consultationDetails = details as ConsultationDetails;
        return (
          <>
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="simple-consultation-mode"
                checked={isSimpleConsultationMode}
                onCheckedChange={setIsSimpleConsultationMode}
              />
              <Label htmlFor="simple-consultation-mode">Modo de Consulta Simplificado</Label>
            </div>

            {isSimpleConsultationMode ? (
              // Simplified Consultation Fields
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="queixaPrincipal">Queixa Principal</Label>
                  <Textarea id="queixaPrincipal" value={consultationDetails.queixaPrincipal || ''} onChange={(e) => handleDetailChange('queixaPrincipal', e.target.value)} rows={2} placeholder="Descreva a queixa principal do tutor..." />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="observacoesOcorrencias">Observações e Ocorrências</Label>
                  <Textarea id="observacoesOcorrencias" value={consultationDetails.observacoesOcorrencias || ''} onChange={(e) => handleDetailChange('observacoesOcorrencias', e.target.value)} rows={2} />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="examesSolicitados">Exames Solicitados</Label>
                  <Textarea id="examesSolicitados" value={consultationDetails.examesSolicitados || ''} onChange={(e) => handleDetailChange('examesSolicitados', e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suspeitaDiagnostica">Suspeita Diagnóstica</Label>
                  <Input id="suspeitaDiagnostica" value={consultationDetails.suspeitaDiagnostica || ''} onChange={(e) => handleDetailChange('suspeitaDiagnostica', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosticoDiferencial">Diagnóstico Diferencial</Label>
                  <Input id="diagnosticoDiferencial" value={consultationDetails.diagnosticoDiferencial || ''} onChange={(e) => handleDetailChange('diagnosticoDiferencial', e.target.value)} />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="procedimentoRealizadoConsulta">Procedimento Realizado Durante a Consulta</Label>
                  <Textarea id="procedimentoRealizadoConsulta" value={consultationDetails.procedimentoRealizadoConsulta || ''} onChange={(e) => handleDetailChange('procedimentoRealizadoConsulta', e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosticoPresuntivo">Diagnóstico Presuntivo</Label>
                  <Input id="diagnosticoPresuntivo" value={consultationDetails.diagnosticoPresuntivo || ''} onChange={(e) => handleDetailChange('diagnosticoPresuntivo', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosticoDefinitivo">Diagnóstico Definitivo</Label>
                  <Input id="diagnosticoDefinitivo" value={consultationDetails.diagnosticoDefinitivo || ''} onChange={(e) => handleDetailChange('diagnosticoDefinitivo', e.target.value)} />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="condutaTratamento">Conduta / Tratamento Prescrito</Label>
                  <Textarea id="condutaTratamento" value={consultationDetails.condutaTratamento || ''} onChange={(e) => handleDetailChange('condutaTratamento', e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retornoRecomendadoEmDias">Retorno recomendado em (dias)</Label>
                  <Input id="retornoRecomendadoEmDias" type="number" value={consultationDetails.retornoRecomendadoEmDias || ''} onChange={(e) => handleDetailChange('retornoRecomendadoEmDias', Number(e.target.value))} />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label htmlFor="proximosPassos">Próximos Passos</Label>
                  <Textarea id="proximosPassos" value={consultationDetails.proximosPassos || ''} onChange={(e) => handleDetailChange('proximosPassos', e.target.value)} rows={3} />
                </div>
              </div>
            ) : (
              // Full Consultation Fields (existing Accordion structure)
              <Accordion type="multiple" defaultValue={["anamnese", "exameFisico", "diagnosticoTratamento"]} className="w-full">
                {/* Anamnese Section */}
                <AccordionItem value="anamnese">
                  <AccordionTrigger className="text-base font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                    <FaUserMd className="h-5 w-5 text-blue-500" /> Anamnese
                  </AccordionTrigger>
                  <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="queixaPrincipal">Queixa Principal</Label>
                        <Textarea id="queixaPrincipal" value={consultationDetails.queixaPrincipal || ''} onChange={(e) => handleDetailChange('queixaPrincipal', e.target.value)} rows={3} placeholder="Descreva a queixa principal do tutor..." />
                      </div>

                      <Accordion type="multiple" defaultValue={["historicoGeral", "alimentacaoHidratacao", "sistemaDigestorio", "sistemaRespiratorio"]}>
                        <AccordionItem value="historicoGeral">
                          <AccordionTrigger className="text-sm font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                            <FaHistoryIcon className="h-4 w-4 text-gray-500" /> Histórico Geral
                          </AccordionTrigger>
                          <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Vacinação do Paciente */}
                            <div className="space-y-2">
                              <Label>Vacinação do Paciente</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('vacinacaoPaciente', value)} value={consultationDetails.vacinacaoPaciente || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="vacinacao-sim" />
                                  <Label htmlFor="vacinacao-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="vacinacao-nao" />
                                  <Label htmlFor="vacinacao-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.vacinacaoPaciente === 'sim' && (
                                <Textarea placeholder="Observações sobre a vacinação" value={consultationDetails.vacinacaoPacienteObs || ''} onChange={(e) => handleDetailChange('vacinacaoPacienteObs', e.target.value)} rows={1} />
                              )}
                            </div>

                            {/* Uso de Medicação */}
                            <div className="space-y-2">
                              <Label>Uso de Medicação</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('usoMedicacao', value)} value={consultationDetails.usoMedicacao || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="medicacao-sim" />
                                  <Label htmlFor="medicacao-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="medicacao-nao" />
                                  <Label htmlFor="medicacao-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.usoMedicacao === 'sim' && (
                                <Textarea placeholder="Quais medicações?" value={consultationDetails.usoMedicacaoQuais || ''} onChange={(e) => handleDetailChange('usoMedicacaoQuais', e.target.value)} rows={1} />
                              )}
                            </div>

                            {/* Possibilidade de Intoxicação */}
                            <div className="space-y-2">
                              <Label>Possibilidade de Intoxicação</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('possibilidadeIntoxicacao', value)} value={consultationDetails.possibilidadeIntoxicacao || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="intoxicacao-sim" />
                                  <Label htmlFor="intoxicacao-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="intoxicacao-nao" />
                                  <Label htmlFor="intoxicacao-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.possibilidadeIntoxicacao === 'sim' && (
                                <Textarea placeholder="Observações sobre a intoxicação" value={consultationDetails.possibilidadeIntoxicacaoObs || ''} onChange={(e) => handleDetailChange('possibilidadeIntoxicacaoObs', e.target.value)} rows={1} />
                              )}
                            </div>

                            {/* Alergias do Paciente */}
                            <div className="space-y-2">
                              <Label>Alergias do Paciente</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('alergiasPaciente', value)} value={consultationDetails.alergiasPaciente || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="alergias-sim" />
                                  <Label htmlFor="alergias-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="alergias-nao" />
                                  <Label htmlFor="alergias-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.alergiasPaciente === 'sim' && (
                                <Textarea placeholder="Observações sobre as alergias" value={consultationDetails.alergiasPacienteObs || ''} onChange={(e) => handleDetailChange('alergiasPacienteObs', e.target.value)} rows={1} />
                              )}
                            </div>

                            {/* Histórico Cirúrgico */}
                            <div className="space-y-2">
                              <Label>Histórico Cirúrgico</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('historicoCirurgico', value)} value={consultationDetails.historicoCirurgico || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="cirurgico-sim" />
                                  <Label htmlFor="cirurgico-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="cirurgico-nao" />
                                  <Label htmlFor="cirurgico-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.historicoCirurgico === 'sim' && (
                                <Textarea placeholder="Quais cirurgias?" value={consultationDetails.historicoCirurgicoQuais || ''} onChange={(e) => handleDetailChange('historicoCirurgicoQuais', e.target.value)} rows={1} />
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="alimentacaoHidratacao">
                          <AccordionTrigger className="text-sm font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                            <FaUtensilsIcon className="h-4 w-4 text-gray-500" /> Alimentação e Hidratação
                          </AccordionTrigger>
                          <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Alimentação */}
                            <div className="space-y-2 col-span-full">
                              <Label htmlFor="alimentacaoTipo">Alimentação</Label>
                              <Select onValueChange={(value: 'racaoSeca' | 'racaoUmida' | 'mista' | 'alimentacaoCaseira') => handleDetailChange('alimentacaoTipo', value)} value={consultationDetails.alimentacaoTipo || ''}>
                                <SelectTrigger><SelectValue placeholder="Selecione o tipo de alimentação" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="racaoSeca">Ração seca</SelectItem>
                                  <SelectItem value="racaoUmida">Ração úmida</SelectItem>
                                  <SelectItem value="mista">Mista</SelectItem>
                                  <SelectItem value="alimentacaoCaseira">Alimentação caseira</SelectItem>
                                </SelectContent>
                              </Select>
                              {consultationDetails.alimentacaoTipo === 'alimentacaoCaseira' && (
                                <Textarea placeholder="Observações sobre a alimentação caseira" value={consultationDetails.alimentacaoObs || ''} onChange={(e) => handleDetailChange('alimentacaoObs', e.target.value)} rows={1} />
                              )}
                            </div>

                            {/* Estado de Apetite e Deglutição */}
                            <div className="space-y-2 col-span-full">
                              <Label>Estado de Apetite e Deglutição</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {mockApetiteDegluticaoOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`apetite-${option.value}`}
                                      checked={consultationDetails.apetiteDegluticao?.includes(option.value)}
                                      onCheckedChange={(checked: boolean) => handleMultiSelectChange('apetiteDegluticao', option.value, checked)}
                                    />
                                    <Label htmlFor={`apetite-${option.value}`}>{option.label}</Label>
                                  </div>
                                ))}
                              </div>
                              <Textarea placeholder="Observações sobre apetite e deglutição" value={consultationDetails.apetiteDegluticaoObs || ''} onChange={(e) => handleDetailChange('apetiteDegluticaoObs', e.target.value)} rows={1} />
                            </div>

                            {/* Ingestão de Água */}
                            <div className="space-y-2 col-span-full">
                              <Label>Ingestão de Água</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {mockIngestaoAguaOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`agua-${option.value}`}
                                      checked={consultationDetails.ingestaoAgua?.includes(option.value)}
                                      onCheckedChange={(checked: boolean) => handleMultiSelectChange('ingestaoAgua', option.value, checked)}
                                    />
                                    <Label htmlFor={`agua-${option.value}`}>{option.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="sistemaDigestorio">
                          <AccordionTrigger className="text-sm font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                            <FaHamburger className="h-4 w-4 text-gray-500" /> Sistema Digestório
                          </AccordionTrigger>
                          <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Êmese e Regurgitação */}
                            <div className="space-y-2 col-span-full">
                              <Label>Êmese e Regurgitação</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('emeseRegurgitacao', value)} value={consultationDetails.emeseRegurgitacao || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="emese-sim" />
                                  <Label htmlFor="emese-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="emese-nao" />
                                  <Label htmlFor="emese-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.emeseRegurgitacao === 'sim' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                                  <Input placeholder="Início" value={consultationDetails.emeseRegurgitacaoComplementoInicio || ''} onChange={(e) => handleDetailChange('emeseRegurgitacaoComplementoInicio', e.target.value)} />
                                  <Input placeholder="Quantidade" value={consultationDetails.emeseRegurgitacaoComplementoQuantidade || ''} onChange={(e) => handleDetailChange('emeseRegurgitacaoComplementoQuantidade', e.target.value)} />
                                  <Input placeholder="Frequência" value={consultationDetails.emeseRegurgitacaoComplementoFrequencia || ''} onChange={(e) => handleDetailChange('emeseRegurgitacaoComplementoFrequencia', e.target.value)} />
                                  <Input placeholder="Aspecto" value={consultationDetails.emeseRegurgitacaoComplementoAspecto || ''} onChange={(e) => handleDetailChange('emeseRegurgitacaoComplementoAspecto', e.target.value)} />
                                </div>
                              )}
                            </div>

                            {/* Micção */}
                            <div className="space-y-2 col-span-full">
                              <Label>Micção</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('miccaoNormal', value)} value={consultationDetails.miccaoNormal || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="miccao-normal-sim" />
                                  <Label htmlFor="miccao-normal-sim">Normal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="miccao-normal-nao" />
                                  <Label htmlFor="miccao-normal-nao">Alterada</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.miccaoNormal === 'sim' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  <Input placeholder="Frequência" value={consultationDetails.miccaoFrequencia || ''} onChange={(e) => handleDetailChange('miccaoFrequencia', e.target.value)} />
                                  <Input placeholder="Aspecto" value={consultationDetails.miccaoAspecto || ''} onChange={(e) => handleDetailChange('miccaoAspecto', e.target.value)} />
                                </div>
                              )}
                              {consultationDetails.miccaoNormal === 'nao' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                                  {mockMiccaoAlteracoesOptions.map(option => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`miccao-${option.value}`}
                                        checked={consultationDetails.miccaoAlteracoes?.includes(option.value)}
                                        onCheckedChange={(checked: boolean) => handleMultiSelectChange('miccaoAlteracoes', option.value, checked)}
                                      />
                                      <Label htmlFor={`miccao-${option.value}`}>{option.label}</Label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Fezes e Defecações */}
                            <div className="space-y-2 col-span-full">
                              <Label>Fezes e Defecações</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {mockFezesDefecacoesOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`fezes-${option.value}`}
                                      checked={consultationDetails.fezesDefecacoes?.includes(option.value)}
                                      onCheckedChange={(checked: boolean) => handleMultiSelectChange('fezesDefecacoes', option.value, checked)}
                                    />
                                    <Label htmlFor={`fezes-${option.value}`}>{option.label}</Label>
                                  </div>
                                ))}
                              </div>
                              <Textarea placeholder="Complemento sobre fezes e defecações" value={consultationDetails.fezesDefecacoesComplemento || ''} onChange={(e) => handleDetailChange('fezesDefecacoesComplemento', e.target.value)} rows={1} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="sistemaRespiratorio">
                          <AccordionTrigger className="text-sm font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                            <FaLungs className="h-4 w-4 text-gray-500" /> Sistema Respiratório
                          </AccordionTrigger>
                          <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Alterações Respiratórias */}
                            <div className="space-y-2 col-span-full">
                              <Label>Alterações Respiratórias</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('alteracoesRespiratorias', value)} value={consultationDetails.alteracoesRespiratorias || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="resp-sim" />
                                  <Label htmlFor="resp-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="resp-nao" />
                                  <Label htmlFor="resp-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.alteracoesRespiratorias === 'sim' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                                  {mockAlteracoesRespiratoriasTipos.map(option => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`resp-tipo-${option.value}`}
                                        checked={consultationDetails.alteracoesRespiratoriasTipos?.includes(option.value)}
                                        onCheckedChange={(checked: boolean) => handleMultiSelectChange('alteracoesRespiratoriasTipos', option.value, checked)}
                                      />
                                      <Label htmlFor={`resp-tipo-${option.value}`}>{option.label}</Label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Tosse */}
                            <div className="space-y-2">
                              <Label>Tosse</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('tosse', value)} value={consultationDetails.tosse || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="tosse-sim" />
                                  <Label htmlFor="tosse-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="tosse-nao" />
                                  <Label htmlFor="tosse-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.tosse === 'sim' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  <Input placeholder="Período" value={consultationDetails.tossePeriodo || ''} onChange={(e) => handleDetailChange('tossePeriodo', e.target.value)} />
                                  <Input placeholder="Frequência" value={consultationDetails.tosseFrequencia || ''} onChange={(e) => handleDetailChange('tosseFrequencia', e.target.value)} />
                                </div>
                              )}
                            </div>

                            {/* Espirros */}
                            <div className="space-y-2">
                              <Label>Espirros</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('espirros', value)} value={consultationDetails.espirros || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="espirros-sim" />
                                  <Label htmlFor="espirros-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="espirros-nao" />
                                  <Label htmlFor="espirros-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.espirros === 'sim' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  <Input placeholder="Período" value={consultationDetails.espirrosPeriodo || ''} onChange={(e) => handleDetailChange('espirrosPeriodo', e.target.value)} />
                                  <Input placeholder="Frequência" value={consultationDetails.espirrosFrequencia || ''} onChange={(e) => handleDetailChange('espirrosFrequencia', e.target.value)} />
                                </div>
                              )}
                            </div>

                            {/* Intolerância ao Exercício */}
                            <div className="space-y-2 col-span-full">
                              <Label>Intolerância ao Exercício</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('intoleranciaExercicio', value)} value={consultationDetails.intoleranciaExercicio || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="intolerancia-sim" />
                                  <Label htmlFor="intolerancia-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="intolerancia-nao" />
                                  <Label htmlFor="intolerancia-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.intoleranciaExercicio === 'sim' && (
                                <>
                                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                                    {mockIntoleranciaExercicioTipos.map(option => (
                                      <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`intolerancia-tipo-${option.value}`}
                                          checked={consultationDetails.intoleranciaExercicioTipos?.includes(option.value)}
                                          onCheckedChange={(checked: boolean) => handleMultiSelectChange('intoleranciaExercicioTipos', option.value, checked)}
                                        />
                                        <Label htmlFor={`intolerancia-tipo-${option.value}`}>{option.label}</Label>
                                      </div>
                                    ))}
                                  </div>
                                  <Textarea placeholder="Observações sobre a intolerância ao exercício" value={consultationDetails.intoleranciaExercicioObs || ''} onChange={(e) => handleDetailChange('intoleranciaExercicioObs', e.target.value)} rows={1} />
                                </>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Exame Físico Section */}
                <AccordionItem value="exameFisico">
                  <AccordionTrigger className="text-base font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                    <FaHeartbeat className="h-5 w-5 text-green-500" /> Exame Físico
                  </AccordionTrigger>
                  <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Exame Físico Realizado */}
                        <div className="space-y-2 col-span-full">
                          <Label>Exame Físico Realizado</Label>
                          <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('exameFisicoRealizado', value)} value={consultationDetails.exameFisicoRealizado || ''} className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sim" id="exame-fisico-sim" />
                              <Label htmlFor="exame-fisico-sim">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nao" id="exame-fisico-nao" />
                              <Label htmlFor="exame-fisico-nao">Não</Label>
                            </div>
                          </RadioGroup>
                          {consultationDetails.exameFisicoRealizado === 'sim' && (
                            <Textarea placeholder="Observações gerais do exame físico" value={consultationDetails.exameFisicoObs || ''} onChange={(e) => handleDetailChange('exameFisicoObs', e.target.value)} rows={1} />
                          )}
                        </div>

                        {/* Contenção */}
                        <div className="space-y-2">
                          <Label>Foi necessário uso de alguma forma de contenção?</Label>
                          <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('usoContencao', value)} value={consultationDetails.usoContencao || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="contencao-sim" />
                                  <Label htmlFor="contencao-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="contencao-nao" />
                                  <Label htmlFor="contencao-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.usoContencao === 'sim' && (
                                <Input placeholder="Qual contenção?" value={consultationDetails.usoContencaoQual || ''} onChange={(e) => handleDetailChange('usoContencaoQual', e.target.value)} />
                              )}
                            </div>
                          </div>

                      <Accordion type="multiple" defaultValue={["cabecaPescoco", "toraxAbdomen", "linfonodosPele"]}>
                        <AccordionItem value="cabecaPescoco">
                          <AccordionTrigger className="text-sm font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                            <FaHeadSideMaskIcon className="h-4 w-4 text-gray-500" /> Cabeça e Pescoço
                          </AccordionTrigger>
                          <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Secreção Nasal */}
                            <div className="space-y-2">
                              <Label>Secreção Nasal</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('secrecaoNasal', value)} value={consultationDetails.secrecaoNasal || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="nasal-sim" />
                                  <Label htmlFor="nasal-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="nasal-nao" />
                                  <Label htmlFor="nasal-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.secrecaoNasal === 'sim' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  <Input placeholder="Início" value={consultationDetails.secrecaoNasalComplementoInicio || ''} onChange={(e) => handleDetailChange('secrecaoNasalComplementoInicio', e.target.value)} />
                                  <Input placeholder="Aspecto e Quantidade" value={consultationDetails.secrecaoNasalComplementoAspectoQuantidade || ''} onChange={(e) => handleDetailChange('secrecaoNasalComplementoAspectoQuantidade', e.target.value)} />
                                </div>
                              )}
                            </div>

                            {/* Secreção Ocular */}
                            <div className="space-y-2">
                              <Label>Secreção Ocular</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('secrecaoOcular', value)} value={consultationDetails.secrecaoOcular || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="ocular-sim" />
                                  <Label htmlFor="ocular-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="ocular-nao" />
                                  <Label htmlFor="ocular-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.secrecaoOcular === 'sim' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  <Input placeholder="Início" value={consultationDetails.secrecaoOcularComplementoInicio || ''} onChange={(e) => handleDetailChange('secrecaoOcularComplementoInicio', e.target.value)} />
                                  <Input placeholder="Aspecto e Quantidade" value={consultationDetails.secrecaoOcularComplementoAspectoQuantidade || ''} onChange={(e) => handleDetailChange('secrecaoOcularComplementoAspectoQuantidade', e.target.value)} />
                                </div>
                              )}
                            </div>

                            {/* Olhos */}
                            <div className="space-y-2">
                              <Label htmlFor="olhosEstado">Olhos</Label>
                              <Select onValueChange={(value: string) => handleDetailChange('olhosEstado', value)} value={consultationDetails.olhosEstado || ''}>
                                <SelectTrigger><SelectValue placeholder="Selecione o estado dos olhos" /></SelectTrigger>
                                <SelectContent>
                                  {mockOlhosEstadoOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Textarea placeholder="Observações sobre os olhos" value={consultationDetails.olhosObs || ''} onChange={(e) => handleDetailChange('olhosObs', e.target.value)} rows={1} />
                            </div>

                            {/* Orelhas */}
                            <div className="space-y-2">
                              <Label>Orelhas</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {mockOrelhasAlteracoesOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`orelhas-${option.value}`}
                                      checked={consultationDetails.orelhasAlteracoes?.includes(option.value)}
                                      onCheckedChange={(checked: boolean) => handleMultiSelectChange('orelhasAlteracoes', option.value, checked)}
                                    />
                                    <Label htmlFor={`orelhas-${option.value}`}>{option.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Boca e Anexos */}
                            <div className="space-y-2">
                              <Label>Boca e Anexos</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('bocaAnexos', value)} value={consultationDetails.bocaAnexos || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="boca-sim" />
                                  <Label htmlFor="boca-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="boca-nao" />
                                  <Label htmlFor="boca-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.bocaAnexos === 'sim' && (
                                <Textarea placeholder="Descreva" value={consultationDetails.bocaAnexosDescricao || ''} onChange={(e) => handleDetailChange('bocaAnexosDescricao', e.target.value)} rows={1} />
                              )}
                            </div>

                            {/* Doença Periodontal */}
                            <div className="space-y-2">
                              <Label>Doença Periodontal</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('doencaPeriodontal', value)} value={consultationDetails.doencaPeriodontal || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="periodontal-sim" />
                                  <Label htmlFor="periodontal-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="periodontal-nao" />
                                  <Label htmlFor="periodontal-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.doencaPeriodontal === 'sim' && (
                                <Select onValueChange={(value: '1' | '2' | '3' | '4') => handleDetailChange('doencaPeriodontalGrau', value)} value={consultationDetails.doencaPeriodontalGrau || ''}>
                                  <SelectTrigger><SelectValue placeholder="Grau" /></SelectTrigger>
                                  <SelectContent>
                                    {mockDoencaPeriodontalGrau.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>

                            {/* Pescoço e Coluna */}
                            <div className="space-y-2 col-span-full">
                              <Label>Pescoço e Coluna</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('pescocoColuna', value)} value={consultationDetails.pescocoColuna || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="pescoco-sim" />
                                  <Label htmlFor="pescoco-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="pescoco-nao" />
                                  <Label htmlFor="pescoco-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.pescocoColuna === 'sim' && (
                                <Textarea placeholder="Descreva" value={consultationDetails.pescocoColunaDescricao || ''} onChange={(e) => handleDetailChange('pescocoColunaDescricao', e.target.value)} rows={1} />
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="toraxAbdomen">
                          <AccordionTrigger className="text-sm font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                            <FaHamburger className="h-4 w-4 text-gray-500" /> Tórax e Abdômen
                          </AccordionTrigger>
                          <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Abdômen: Desconforto Abdominal */}
                            <div className="space-y-2">
                              <Label>Desconforto Abdominal</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('desconfortoAbdominal', value)} value={consultationDetails.desconfortoAbdominal || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="desconforto-sim" />
                                  <Label htmlFor="desconforto-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="desconforto-nao" />
                                  <Label htmlFor="desconforto-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.desconfortoAbdominal === 'sim' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  <Input placeholder="Região de sensibilidade" value={consultationDetails.desconfortoAbdominalRegiaoSensibilidade || ''} onChange={(e) => handleDetailChange('desconfortoAbdominalRegiaoSensibilidade', e.target.value)} />
                                  <Input placeholder="Nível de dor" value={consultationDetails.desconfortoAbdominalNivelDor || ''} onChange={(e) => handleDetailChange('desconfortoAbdominalNivelDor', e.target.value)} />
                                </div>
                              )}
                            </div>

                            {/* Aumento de Volume Abdominal */}
                            <div className="space-y-2">
                              <Label>Aumento de Volume Abdominal</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('aumentoVolumeAbdominal', value)} value={consultationDetails.aumentoVolumeAbdominal || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="volume-sim" />
                                  <Label htmlFor="volume-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="volume-nao" />
                                  <Label htmlFor="volume-nao">Não</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.aumentoVolumeAbdominal === 'sim' && (
                                <Input placeholder="Região do aumento de volume" value={consultationDetails.aumentoVolumeAbdominalRegiao || ''} onChange={(e) => handleDetailChange('aumentoVolumeAbdominalRegiao', e.target.value)} />
                              )}
                            </div>

                            {/* Mucosas */}
                            <div className="space-y-2 col-span-full">
                              <Label>Mucosas</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {mockMucosasEstadoOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`mucosas-${option.value}`}
                                      checked={consultationDetails.mucosasEstado?.includes(option.value)}
                                      onCheckedChange={(checked: boolean) => handleMultiSelectChange('mucosasEstado', option.value, checked)}
                                    />
                                    <Label htmlFor={`mucosas-${option.value}`}>{option.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Frequência Respiratória Obs. Ausculta */}
                            <div className="space-y-2">
                              <Label htmlFor="frequenciaRespiratoriaObsAusculta">Obs. Ausculta Respiratória</Label>
                              <Textarea placeholder="Observações na ausculta respiratória" value={consultationDetails.frequenciaRespiratoriaObsAusculta || ''} onChange={(e) => handleDetailChange('frequenciaRespiratoriaObsAusculta', e.target.value)} rows={1} />
                            </div>

                            {/* Sopro */}
                            <div className="space-y-2">
                              <Label>Sopro</Label>
                              <RadioGroup onValueChange={(value: 'sim' | 'nao') => handleDetailChange('sopro', value)} value={consultationDetails.sopro || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="sim" id="sopro-sim" />
                                  <Label htmlFor="sopro-sim">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="nao" id="sopro-nao" />
                                  <Label htmlFor="sopro-nao">Não</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Padrão Respiratório */}
                            <div className="space-y-2 col-span-full">
                              <Label>Padrão Respiratório</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {mockPadraoRespiratorioOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`padrao-resp-${option.value}`}
                                      checked={consultationDetails.padraoRespiratorio?.includes(option.value)}
                                      onCheckedChange={(checked: boolean) => handleMultiSelectChange('padraoRespiratorio', option.value, checked)}
                                    />
                                    <Label htmlFor={`padrao-resp-${option.value}`}>{option.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Frequência Cardíaca Obs. Ausculta */}
                            <div className="space-y-2">
                              <Label htmlFor="frequenciaCardiacaObsAusculta">Obs. Ausculta Cardíaca</Label>
                              <Textarea placeholder="Observações na ausculta cardíaca" value={consultationDetails.frequenciaCardiacaObsAusculta || ''} onChange={(e) => handleDetailChange('frequenciaCardiacaObsAusculta', e.target.value)} rows={1} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="linfonodosPele">
                          <AccordionTrigger className="text-sm font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                            <FaBoneIcon className="h-4 w-4 text-gray-500" /> Linfonodos e Pele
                          </AccordionTrigger>
                          <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Linfonodos */}
                            <div className="space-y-2 col-span-full">
                              <Label>Linfonodos</Label>
                              <RadioGroup onValueChange={(value: 'normal' | 'infartado') => handleDetailChange('linfonodosEstado', value)} value={consultationDetails.linfonodosEstado || ''} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="normal" id="linfonodos-normal" />
                                  <Label htmlFor="linfonodos-normal">Normal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="infartado" id="linfonodos-infartado" />
                                  <Label htmlFor="linfonodos-infartado">Infartado</Label>
                                </div>
                              </RadioGroup>
                              {consultationDetails.linfonodosEstado === 'infartado' && (
                                <Textarea placeholder="Qual linfonodo(s) apresentou alteração? Observações:" value={consultationDetails.linfonodosAlteracaoQualObs || ''} onChange={(e) => handleDetailChange('linfonodosAlteracaoQualObs', e.target.value)} rows={1} />
                              )}
                            </div>

                            {/* Pele e Anexos */}
                            <div className="space-y-2 col-span-full">
                              <Label>Pele e Anexos</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {mockPeleAnexosAlteracoesOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`pele-${option.value}`}
                                      checked={consultationDetails.peleAnexosAlteracoes?.includes(option.value)}
                                      onCheckedChange={(checked: boolean) => handleMultiSelectChange('peleAnexosAlteracoes', option.value, checked)}
                                    />
                                    <Label htmlFor={`pele-${option.value}`}>{option.label}</Label>
                                  </div>
                                ))}
                              </div>
                              <Textarea placeholder="Descreva, se necessário, com fotos nos anexos." value={consultationDetails.peleAnexosDescricao || ''} onChange={(e) => handleDetailChange('peleAnexosDescricao', e.target.value)} rows={1} />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Diagnóstico e Tratamento Section (Restored) */}
                <AccordionItem value="diagnosticoTratamento">
                  <AccordionTrigger className="text-base font-semibold text-[#374151] dark:text-gray-100 flex items-center gap-2">
                    <FaBrain className="h-5 w-5 text-purple-500" /> Diagnóstico e Tratamento
                  </AccordionTrigger>
                  <AccordionContent className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="observacoesOcorrencias">Observações e Ocorrências</Label>
                      <Textarea id="observacoesOcorrencias" value={consultationDetails.observacoesOcorrencias || ''} onChange={(e) => handleDetailChange('observacoesOcorrencias', e.target.value)} rows={2} />
                    </div>
                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="examesSolicitados">Exames Solicitados</Label>
                      <Textarea id="examesSolicitados" value={consultationDetails.examesSolicitados || ''} onChange={(e) => handleDetailChange('examesSolicitados', e.target.value)} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suspeitaDiagnostica">Suspeita Diagnóstica</Label>
                      <Input id="suspeitaDiagnostica" value={consultationDetails.suspeitaDiagnostica || ''} onChange={(e) => handleDetailChange('suspeitaDiagnostica', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diagnosticoDiferencial">Diagnóstico Diferencial</Label>
                      <Input id="diagnosticoDiferencial" value={consultationDetails.diagnosticoDiferencial || ''} onChange={(e) => handleDetailChange('diagnosticoDiferencial', e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="procedimentoRealizadoConsulta">Procedimento Realizado Durante a Consulta</Label>
                      <Textarea id="procedimentoRealizadoConsulta" value={consultationDetails.procedimentoRealizadoConsulta || ''} onChange={(e) => handleDetailChange('procedimentoRealizadoConsulta', e.target.value)} rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diagnosticoPresuntivo">Diagnóstico Presuntivo</Label>
                      <Input id="diagnosticoPresuntivo" value={consultationDetails.diagnosticoPresuntivo || ''} onChange={(e) => handleDetailChange('diagnosticoPresuntivo', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diagnosticoDefinitivo">Diagnóstico Definitivo</Label>
                      <Input id="diagnosticoDefinitivo" value={consultationDetails.diagnosticoDefinitivo || ''} onChange={(e) => handleDetailChange('diagnosticoDefinitivo', e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="condutaTratamento">Conduta / Tratamento Prescrito</Label>
                      <Textarea id="condutaTratamento" value={consultationDetails.condutaTratamento || ''} onChange={(e) => handleDetailChange('condutaTratamento', e.target.value)} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retornoRecomendadoEmDias">Retorno recomendado em (dias)</Label>
                      <Input id="retornoRecomendadoEmDias" type="number" value={consultationDetails.retornoRecomendadoEmDias || ''} onChange={(e) => handleDetailChange('retornoRecomendadoEmDias', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="proximosPassos">Próximos Passos</Label>
                      <Textarea id="proximosPassos" value={consultationDetails.proximosPassos || ''} onChange={(e) => handleDetailChange('proximosPassos', e.target.value)} rows={3} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </>
        );
      case 'Vacina':
        const vaccinationDetails = details as VaccinationDetails;
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Ficha de Controle Vacinal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoVacina">Tipo de Vacina</Label>
                <Select onValueChange={(value) => handleDetailChange('tipoVacina', value)} value={vaccinationDetails.tipoVacina || ''}>
                  <SelectTrigger id="tipoVacina"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {mockVaccineTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomeComercial">Nome Comercial</Label>
                <Input id="nomeComercial" value={vaccinationDetails.nomeComercial || ''} onChange={(e) => handleDetailChange('nomeComercial', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lote">Lote</Label>
                <Input id="lote" value={vaccinationDetails.lote || ''} onChange={(e) => handleDetailChange('lote', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fabricante">Fabricante</Label>
                <Input id="fabricante" value={vaccinationDetails.fabricante || ''} onChange={(e) => handleDetailChange('fabricante', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFabricacao">Data de Fabricação</Label>
                <Input id="dataFabricacao" type="date" value={vaccinationDetails.dataFabricacao || ''} onChange={(e) => handleDetailChange('dataFabricacao', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataValidade">Data de Validade</Label>
                <Input id="dataValidade" type="date" value={vaccinationDetails.dataValidade || ''} onChange={(e) => handleDetailChange('dataValidade', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doseAplicada">Dose Aplicada (mL)</Label>
                <Input id="doseAplicada" type="number" value={vaccinationDetails.doseAplicada || ''} onChange={(e) => handleDetailChange('doseAplicada', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="viaAdministracao">Via de Administração</Label>
                <Select onValueChange={(value: 'SC' | 'IM' | 'VO' | 'IN') => handleDetailChange('viaAdministracao', value)} value={vaccinationDetails.viaAdministracao || ''}>
                  <SelectTrigger id="viaAdministracao"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {mockViaAdministracao.map(via => <SelectItem key={via.value} value={via.value}>{via.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="localAplicacao">Local de Aplicação</Label>
                <Select onValueChange={(value) => handleDetailChange('localAplicacao', value)} value={vaccinationDetails.localAplicacao || ''}>
                  <SelectTrigger id="localAplicacao"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {mockLocalAplicacao.map(local => <SelectItem key={local} value={local}>{local}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="reacaoAdversaObservada">Reação Adversa Observada</Label>
                <Textarea id="reacaoAdversaObservada" value={vaccinationDetails.reacaoAdversaObservada || ''} onChange={(e) => handleDetailChange('reacaoAdversaObservada', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profissionalAplicou">Profissional que aplicou</Label>
                <Input id="profissionalAplicou" value={vaccinationDetails.profissionalAplicou || vet} disabled />
              </div>
            </div>
          </>
        );
      case 'Cirurgia':
        const surgeryDetails = details as SurgeryDetails;
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Ficha Cirúrgica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoCirurgia">Tipo de Cirurgia</Label>
                <Select onValueChange={(value) => handleDetailChange('tipoCirurgia', value)} value={surgeryDetails.tipoCirurgia || ''}>
                  <SelectTrigger id="tipoCirurgia"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {mockSurgeryTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tempoJejumHoras">Tempo de Jejum (horas)</Label>
                <Input id="tempoJejumHoras" type="number" value={surgeryDetails.tempoJejumHoras || ''} onChange={(e) => handleDetailChange('tempoJejumHoras', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicacaoPreAnestesica">Medicação Pré-anestésica</Label>
                <Input id="medicacaoPreAnestesica" value={surgeryDetails.medicacaoPreAnestesica || ''} onChange={(e) => handleDetailChange('medicacaoPreAnestesica', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anestesicoUtilizado">Anestésico Utilizado</Label>
                <Input id="anestesicoUtilizado" value={surgeryDetails.anestesicoUtilizado || ''} onChange={(e) => handleDetailChange('anestesicoUtilizado', e.target.value)} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="procedimentoRealizado">Procedimento Realizado</Label>
                <Textarea id="procedimentoRealizado" value={surgeryDetails.procedimentoRealizado || ''} onChange={(e) => handleDetailChange('procedimentoRealizado', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="achadosIntraoperatorios">Achados Intraoperatórios</Label>
                <Textarea id="achadosIntraoperatorios" value={surgeryDetails.achadosIntraoperatórios || ''} onChange={(e) => handleDetailChange('achadosIntraoperatórios', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="complicacoesIntraoperatorias">Complicações Intraoperatórias</Label>
                <Textarea id="complicacoesIntraoperatorias" value={surgeryDetails.complicacoesIntraoperatórias || ''} onChange={(e) => handleDetailChange('complicacoesIntraoperatórias', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tempoCirurgicoMin">Tempo Cirúrgico (min)</Label>
                <Input id="tempoCirurgicoMin" type="number" value={surgeryDetails.tempoCirurgicoMin || ''} onChange={(e) => handleDetailChange('tempoCirurgicoMin', Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavelAnestesia">Responsável pela Anestesia</Label>
                <Input id="responsavelAnestesia" value={surgeryDetails.responsavelAnestesia || ''} onChange={(e) => handleDetailChange('responsavelAnestesia', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavelCirurgia">Responsável pela Cirurgia</Label>
                <Input id="responsavelCirurgia" value={surgeryDetails.responsavelCirurgia || ''} onChange={(e) => handleDetailChange('responsavelCirurgia', e.target.value)} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="medicamentosPosOperatorios">Medicamentos Pós-operatórios Prescritos</Label>
                <Textarea id="medicamentosPosOperatorios" value={surgeryDetails.medicamentosPosOperatorios || ''} onChange={(e) => handleDetailChange('medicamentosPosOperatorios', e.target.value)} rows={2} />
              </div>
            </div>
          </>
        );
      case 'Retorno':
        const returnDetails = details as ReturnDetails;
        const animalAppointmentsForSelect = mockAppointments.filter(app => app.animalId === animalId);
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Evolução Clínica (Retorno)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="atendimentoOrigemId">Atendimento de Origem</Label>
                <Select onValueChange={(value) => handleDetailChange('atendimentoOrigemId', value)} value={returnDetails.atendimentoOrigemId || ''}>
                  <SelectTrigger id="atendimentoOrigemId"><SelectValue placeholder="Selecione um atendimento anterior..." /></SelectTrigger>
                  <SelectContent>
                    {animalAppointmentsForSelect.map(app => (
                      <SelectItem key={app.id} value={app.id}>
                        {app.date} - {app.type} ({app.observacoesGerais?.substring(0, 30)}...)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivoRetorno">Motivo do Retorno</Label>
                <Input id="motivoRetorno" value={returnDetails.motivoRetorno || ''} onChange={(e) => handleDetailChange('motivoRetorno', e.target.value)} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="evolucaoObservada">Evolução Observada</Label>
                <Textarea id="evolucaoObservada" value={returnDetails.evolucaoObservada || ''} onChange={(e) => handleDetailChange('evolucaoObservada', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="novoDiagnosticoConduta">Novo Diagnóstico / Conduta</Label>
                <Textarea id="novoDiagnosticoConduta" value={returnDetails.novoDiagnosticoConduta || ''} onChange={(e) => handleDetailChange('novoDiagnosticoConduta', e.target.value)} rows={3} />
              </div>
            </div>
          </>
        );
      case 'Emergência':
        const emergencyDetails = details as EmergencyDetails;
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Ficha de Atendimento Emergencial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horaChegada">Hora de Chegada</Label>
                <Input id="horaChegada" type="time" value={emergencyDetails.horaChegada || ''} onChange={(e) => handleDetailChange('horaChegada', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condicaoGeral">Condição Geral</Label>
                <Select onValueChange={(value: EmergencyDetails['condicaoGeral']) => handleDetailChange('condicaoGeral', value)} value={emergencyDetails.condicaoGeral || ''}>
                  <SelectTrigger id="condicaoGeral"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {mockCondicaoGeral.map(cond => <SelectItem key={cond.value} value={cond.value}>{cond.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="manobrasSuporteRealizadas">Manobras de Suporte Realizadas</Label>
                <Textarea id="manobrasSuporteRealizadas" value={emergencyDetails.manobrasSuporteRealizadas || ''} onChange={(e) => handleDetailChange('manobrasSuporteRealizadas', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="medicamentosAdministrados">Medicamentos Administrados</Label>
                <Textarea id="medicamentosAdministrados" value={emergencyDetails.medicamentosAdministrados || ''} onChange={(e) => handleDetailChange('medicamentosAdministrados', e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="encaminhamento">Encaminhamento</Label>
                <Select onValueChange={(value: EmergencyDetails['encaminhamento']) => handleDetailChange('encaminhamento', value)} value={emergencyDetails.encaminhamento || ''}>
                  <SelectTrigger id="encaminhamento"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {mockEncaminhamento.map(enc => <SelectItem key={enc.value} value={enc.value}>{enc.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 'Check-up':
        const checkupDetails = details as CheckupDetails;
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Avaliação Geral (Check-up)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ultimaVacinacao">Última Vacinação</Label>
                <Input id="ultimaVacinacao" type="date" value={checkupDetails.ultimaVacinacao || ''} onChange={(e) => handleDetailChange('ultimaVacinacao', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ultimaVermifugacao">Última Vermifugação</Label>
                <Input id="ultimaVermifugacao" type="date" value={checkupDetails.ultimaVermifugacao || ''} onChange={(e) => handleDetailChange('ultimaVermifugacao', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avaliacaoDentaria">Avaliação Dentária</Label>
                <Input id="avaliacaoDentaria" value={checkupDetails.avaliacaoDentaria || ''} onChange={(e) => handleDetailChange('avaliacaoDentaria', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avaliacaoNutricional">Avaliação Nutricional</Label>
                <Input id="avaliacaoNutricional" value={checkupDetails.avaliacaoNutricional || ''} onChange={(e) => handleDetailChange('avaliacaoNutricional', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avaliacaoCorporalEscala">Avaliação Corporal (escala 1–9)</Label>
                <Input id="avaliacaoCorporalEscala" type="number" min="1" max="9" value={checkupDetails.avaliacaoCorporalEscala || ''} onChange={(e) => handleDetailChange('avaliacaoCorporalEscala', Number(e.target.value))} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="recomendacoesPreventivas">Recomendações Preventivas</Label>
                <Textarea id="recomendacoesPreventivas" value={checkupDetails.recomendacoesPreventivas || ''} onChange={(e) => handleDetailChange('recomendacoesPreventivas', e.target.value)} rows={3} />
              </div>
            </div>
          </>
        );
      case 'Outros':
        const otherDetails = details as BaseAppointmentDetails;
        return (
          <>
            <h3 className="text-lg font-semibold mb-4">Detalhes Adicionais</h3>
            <div className="space-y-2">
              <Label htmlFor="outrosDetalhes">Descrição Detalhada</Label>
              <Textarea id="outrosDetalhes" value={otherDetails.historicoClinico || ''} onChange={(e) => handleDetailChange('historicoClinico', e.target.value)} rows={5} />
            </div>
          </>
        );
      default:
        return <p className="text-muted-foreground">Selecione um tipo de atendimento para ver os campos específicos.</p>;
    }
  };

  return (
    <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      {/* Dados Gerais */}
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
            <FaNotesMedical className="h-5 w-5 text-blue-500" /> Dados Gerais do Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data do Atendimento *</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Hora do Atendimento *</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Atendimento *</Label>
            <Select onValueChange={(value: AppointmentEntry['type']) => setType(value)} value={type} required>
              <SelectTrigger id="type"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Consulta">Consulta Clínica</SelectItem>
                <SelectItem value="Vacina">Vacinação</SelectItem>
                <SelectItem value="Retorno">Retorno</SelectItem>
                <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                <SelectItem value="Emergência">Emergência</SelectItem>
                <SelectItem value="Check-up">Check-up</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vet">Veterinário Responsável</Label>
            <Select onValueChange={setVet} value={vet}>
              <SelectTrigger id="vet"><SelectValue placeholder="Selecione o veterinário" /></SelectTrigger>
              <SelectContent>
                {mockVets.map(v => <SelectItem key={v.id} value={v.name}>{v.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pesoAtual">Peso Atual (kg)</Label>
              <Input id="pesoAtual" type="number" step="0.1" value={pesoAtual} onChange={(e) => setPesoAtual(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperaturaCorporal">Temperatura Corporal (°C)</Label>
              <Input id="temperaturaCorporal" type="number" step="0.1" value={temperaturaCorporal} onChange={(e) => setTemperaturaCorporal(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequenciaCardiaca">Frequência Cardíaca (Bpm)</Label>
              <Input id="frequenciaCardiaca" type="number" value={frequenciaCardiaca} onChange={(e) => setFrequenciaCardiaca(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequenciaRespiratoria">Frequência Respiratória (Mrm)</Label>
              <Input id="frequenciaRespiratoria" type="number" value={frequenciaRespiratoria} onChange={(e) => setFrequenciaRespiratoria(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2 col-span-full">
            <Label htmlFor="observacoesGerais">Observações Gerais</Label>
            <Textarea id="observacoesGerais" value={observacoesGerais} onChange={(e) => setObservacoesGerais(e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Atendimento (Campos Dinâmicos) */}
      {type && (
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              {type === 'Consulta' && <FaStethoscope className="h-5 w-5 text-green-500" />}
              {type === 'Vacina' && <FaSyringe className="h-5 w-5 text-yellow-500" />}
              {type === 'Cirurgia' && <FaCut className="h-5 w-5 text-red-500" />}
              {type === 'Retorno' && <FaRedo className="h-5 w-5 text-purple-500" />}
              {type === 'Emergência' && <FaAmbulance className="h-5 w-5 text-orange-500" />}
              {type === 'Check-up' && <FaCheckCircle className="h-5 w-5 text-teal-500" />}
              {type === 'Outros' && <FaNotesMedical className="h-5 w-5 text-gray-500" />}
              Detalhes do Atendimento ({type})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderDynamicFields()}
          </CardContent>
        </Card>
      )}

      {/* Anexos */}
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
            <FaPaperclip className="h-5 w-5 text-gray-500" /> Anexos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="newAttachmentName">Nome do Anexo</Label>
              <Input
                id="newAttachmentName"
                placeholder="Ex: Exame de Sangue.pdf"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="newAttachmentFile">Arquivo</Label>
              <Input
                id="newAttachmentFile"
                type="file"
                onChange={(e) => setNewAttachmentFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            <Button type="button" onClick={handleAddAttachment} className="shrink-0 w-full md:w-auto">
              <FaPlus className="mr-2 h-4 w-4" /> Adicionar Anexo
            </Button>
          </div>
          {attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Anexos Atuais:</h4>
              <ul className="list-disc pl-5">
                {attachments.map((att, index) => (
                  <li key={index} className="flex items-center justify-between text-sm text-muted-foreground">
                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {att.name}
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAttachment(att.url)}>
                      <FaTimes className="h-3 w-3 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-950/80 dark:border-gray-800 sticky bottom-0 z-10">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaTimes className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Link to={`/clients/${clientId}/animals/${animalId}/add-prescription`} className="w-full sm:w-auto">
          <Button type="button" variant="secondary" className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
            <FaPrescriptionBottleAlt className="mr-2 h-4 w-4" /> Gerar Prescrição
          </Button>
        </Link>
        <Button type="button" variant="secondary" className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaFileAlt className="mr-2 h-4 w-4" /> Gerar PDF do Atendimento
        </Button>
        <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
          <FaSave className="mr-2 h-4 w-4" /> Salvar Atendimento
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;