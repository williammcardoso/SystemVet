"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FaCalendarAlt, FaStethoscope, FaWeightHanging, FaThermometerHalf, FaNotesMedical, FaSyringe, FaCut, FaRedo, FaAmbulance, FaCheckCircle, FaPaperclip, FaSave, FaTimes, FaPrescriptionBottleAlt
} from "react-icons/fa";
import { toast } from "sonner";
import { AppointmentEntry, ConsultationDetails, VaccinationDetails, SurgeryDetails, ReturnDetails, EmergencyDetails, CheckupDetails, BaseAppointmentDetails } from "@/types/appointment";
import { mockUserSettings } from "@/mockData/settings";
import { Link } from "react-router-dom";

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

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  animalId,
  clientId,
  initialData,
  onSave,
  onCancel,
  mockAppointments,
}) => {
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<AppointmentEntry['type']>(initialData?.type || '');
  const [vet, setVet] = useState(initialData?.vet || mockUserSettings.userName); // Pré-selecionado
  const [pesoAtual, setPesoAtual] = useState<number | ''>(initialData?.pesoAtual || '');
  const [temperaturaCorporal, setTemperaturaCorporal] = useState<number | ''>(initialData?.temperaturaCorporal || '');
  const [observacoesGerais, setObservacoesGerais] = useState(initialData?.observacoesGerais || '');
  const [details, setDetails] = useState<AppointmentEntry['details']>(initialData?.details || {});
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>(initialData?.attachments || []);
  const [newAttachmentFile, setNewAttachmentFile] = useState<File | null>(null);
  const [newAttachmentName, setNewAttachmentName] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save logic
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => {
      // Simulate saving to a temporary state or local storage
      // In a real app, this would trigger an API call
      console.log("Auto-saving appointment data...", { date, type, vet, pesoAtual, temperaturaCorporal, observacoesGerais, details, attachments });
      toast.info("Rascunho salvo automaticamente!", { duration: 1000 });
    }, 120000); // Auto-save every 2 minutes (120000 ms)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [date, type, vet, pesoAtual, temperaturaCorporal, observacoesGerais, details, attachments]);

  const handleDetailChange = (field: string, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

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
      details,
      attachments,
    };
    onSave(newAppointment);
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
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="anamnese">
                <AccordionTrigger className="text-base font-semibold text-[#374151] dark:text-gray-100">Anamnese</AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="queixaPrincipal">Queixa Principal</Label>
                    <Input id="queixaPrincipal" value={consultationDetails.queixaPrincipal || ''} onChange={(e) => handleDetailChange('queixaPrincipal', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="historicoClinico">Histórico Clínico</Label>
                    <Textarea id="historicoClinico" value={consultationDetails.historicoClinico || ''} onChange={(e) => handleDetailChange('historicoClinico', e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alimentacao">Alimentação</Label>
                    <Input id="alimentacao" value={consultationDetails.alimentacao || ''} onChange={(e) => handleDetailChange('alimentacao', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacinacaoVermifugacaoAtualizadas">Vacinação e vermifugação atualizadas?</Label>
                    <Select onValueChange={(value: 'sim' | 'nao') => handleDetailChange('vacinacaoVermifugacaoAtualizadas', value)} value={consultationDetails.vacinacaoVermifugacaoAtualizadas || ''}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usoMedicacoes">Uso de medicações?</Label>
                    <Input id="usoMedicacoes" value={consultationDetails.usoMedicacoes || ''} onChange={(e) => handleDetailChange('usoMedicacoes', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ambiente">Ambiente</Label>
                    <Select onValueChange={(value: 'interno' | 'externo' | 'misto') => handleDetailChange('ambiente', value)} value={consultationDetails.ambiente || ''}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interno">Interno</SelectItem>
                        <SelectItem value="externo">Externo</SelectItem>
                        <SelectItem value="misto">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contatoOutrosAnimais">Contato com outros animais?</Label>
                    <Select onValueChange={(value: 'sim' | 'nao') => handleDetailChange('contatoOutrosAnimais', value)} value={consultationDetails.contatoOutrosAnimais || ''}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="exameFisico">
                <AccordionTrigger className="text-base font-semibold text-[#374151] dark:text-gray-100">Exame Físico</AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="mucosas">Mucosas</Label>
                    <Input id="mucosas" value={consultationDetails.mucosas || ''} onChange={(e) => handleDetailChange('mucosas', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequenciaCardiaca">Frequência Cardíaca (bpm)</Label>
                    <Input id="frequenciaCardiaca" type="number" value={consultationDetails.frequenciaCardiaca || ''} onChange={(e) => handleDetailChange('frequenciaCardiaca', Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequenciaRespiratoria">Frequência Respiratória (mpm)</Label>
                    <Input id="frequenciaRespiratoria" type="number" value={consultationDetails.frequenciaRespiratoria || ''} onChange={(e) => handleDetailChange('frequenciaRespiratoria', Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linfonodos">Linfonodos</Label>
                    <Input id="linfonodos" value={consultationDetails.linfonodos || ''} onChange={(e) => handleDetailChange('linfonodos', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auscultaCardiaca">Ausculta Cardíaca</Label>
                    <Input id="auscultaCardiaca" value={consultationDetails.auscultaCardiaca || ''} onChange={(e) => handleDetailChange('auscultaCardiaca', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auscultaPulmonar">Ausculta Pulmonar</Label>
                    <Input id="auscultaPulmonar" value={consultationDetails.auscultaPulmonar || ''} onChange={(e) => handleDetailChange('auscultaPulmonar', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abdomen">Abdômen</Label>
                    <Input id="abdomen" value={consultationDetails.abdomen || ''} onChange={(e) => handleDetailChange('abdomen', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="peleAnexos">Pele e Anexos</Label>
                    <Input id="peleAnexos" value={consultationDetails.peleAnexos || ''} onChange={(e) => handleDetailChange('peleAnexos', e.target.value)} />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="outrosAchadosClinicos">Outros Achados Clínicos</Label>
                    <Textarea id="outrosAchadosClinicos" value={consultationDetails.outrosAchadosClinicos || ''} onChange={(e) => handleDetailChange('outrosAchadosClinicos', e.target.value)} rows={2} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="diagnosticoTratamento">
                <AccordionTrigger className="text-base font-semibold text-[#374151] dark:text-gray-100">Diagnóstico e Tratamento</AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {mockViaAdministracao.map(via => <SelectItem key={via.value} value={via.value}>{via.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="localAplicacao">Local de Aplicação</Label>
                <Select onValueChange={(value) => handleDetailChange('localAplicacao', value)} value={vaccinationDetails.localAplicacao || ''}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
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
                <Textarea id="achadosIntraoperatorios" value={surgeryDetails.achadosIntraoperatorios || ''} onChange={(e) => handleDetailChange('achadosIntraoperatorios', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="complicacoesIntraoperatorias">Complicações Intraoperatórias</Label>
                <Textarea id="complicacoesIntraoperatorias" value={surgeryDetails.complicacoesIntraoperatorias || ''} onChange={(e) => handleDetailChange('complicacoesIntraoperatorias', e.target.value)} rows={2} />
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
                  <SelectTrigger><SelectValue placeholder="Selecione um atendimento anterior..." /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
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
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
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
            <Button type="button" onClick={handleAddAttachment} className="shrink-0">
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
      <div className="flex justify-end gap-2 mt-6 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-950/80 dark:border-gray-800 sticky bottom-0 z-10">
        <Button type="button" variant="outline" onClick={onCancel} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaTimes className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Link to={`/clients/${clientId}/animals/${animalId}/add-prescription`} className="mr-2">
          <Button type="button" variant="secondary" className="rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
            <FaPrescriptionBottleAlt className="mr-2 h-4 w-4" /> Gerar Prescrição
          </Button>
        </Link>
        <Button type="button" variant="secondary" className="rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <FaFileAlt className="mr-2 h-4 w-4" /> Gerar PDF do Atendimento
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
          <FaSave className="mr-2 h-4 w-4" /> Salvar Atendimento
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;