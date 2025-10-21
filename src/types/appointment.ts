export interface BaseAppointmentDetails {
  queixaPrincipal?: string;
  historicoClinico?: string;
  alimentacao?: string;
  vacinacaoVermifugacaoAtualizadas?: 'sim' | 'nao' | '';
  usoMedicacoes?: string;
  ambiente?: 'interno' | 'externo' | 'misto' | '';
  contatoOutrosAnimais?: 'sim' | 'nao' | '';
  temperaturaCorporal?: number;
  mucosas?: string;
  frequenciaCardiaca?: number;
  frequenciaRespiratoria?: number;
  linfonodos?: string;
  auscultaCardiaca?: string;
  auscultaPulmonar?: string;
  abdomen?: string;
  peleAnexos?: string;
  outrosAchadosClinicos?: string;
  diagnosticoPresuntivo?: string;
  diagnosticoDefinitivo?: string;
  condutaTratamento?: string;
  retornoRecomendadoEmDias?: number;
}

export interface ConsultationDetails extends BaseAppointmentDetails {
  // Campos específicos de consulta clínica
}

export interface VaccinationDetails {
  tipoVacina?: string; // Ex: Polivalente, Antirrábica
  nomeComercial?: string;
  lote?: string;
  fabricante?: string;
  dataFabricacao?: string;
  dataValidade?: string;
  doseAplicada?: number;
  viaAdministracao?: 'SC' | 'IM' | 'VO' | 'IN' | '';
  localAplicacao?: string;
  reacaoAdversaObservada?: string;
  profissionalAplicou?: string; // Pré-preenchido com o veterinário logado
}

export interface SurgeryDetails {
  tipoCirurgia?: string; // Ex: Castração, Piometra
  tempoJejumHoras?: number;
  medicacaoPreAnestesica?: string;
  anestesicoUtilizado?: string;
  procedimentoRealizado?: string;
  achadosIntraoperatorios?: string;
  complicacoesIntraoperatorias?: string;
  tempoCirurgicoMin?: number;
  responsavelAnestesia?: string;
  responsavelCirurgia?: string;
  medicamentosPosOperatorios?: string;
}

export interface ReturnDetails {
  atendimentoOrigemId?: string; // ID do atendimento anterior
  motivoRetorno?: string;
  evolucaoObservada?: string;
  novoDiagnosticoConduta?: string;
}

export interface EmergencyDetails {
  horaChegada?: string; // Ex: "HH:mm"
  condicaoGeral?: 'alerta' | 'deprimido' | 'inconsciente' | 'choque' | 'dispneia' | 'sangramento' | 'convulsao' | 'outros' | '';
  manobrasSuporteRealizadas?: string;
  medicamentosAdministrados?: string;
  encaminhamento?: 'internacao' | 'alta' | 'obito' | '';
}

export interface CheckupDetails {
  ultimaVacinacao?: string; // Data
  ultimaVermifugacao?: string; // Data
  avaliacaoDentaria?: string;
  avaliacaoNutricional?: string;
  avaliacaoCorporalEscala?: number; // Escala 1-9
  recomendacoesPreventivas?: string;
}

export type AppointmentSpecificDetails =
  | { type: 'Consulta', details: ConsultationDetails }
  | { type: 'Vacina', details: VaccinationDetails }
  | { type: 'Retorno', details: ReturnDetails }
  | { type: 'Cirurgia', details: SurgeryDetails }
  | { type: 'Emergência', details: EmergencyDetails }
  | { type: 'Check-up', details: CheckupDetails }
  | { type: 'Outros', details: BaseAppointmentDetails }; // Para tipos não especificados

export interface AppointmentEntry {
  id: string;
  animalId: string;
  date: string; // Data do atendimento
  type: 'Consulta' | 'Vacina' | 'Retorno' | 'Cirurgia' | 'Emergência' | 'Check-up' | 'Outros' | '';
  vet: string; // Veterinário responsável
  pesoAtual?: number;
  temperaturaCorporal?: number; // Temperatura corporal (campo sempre visível)
  observacoesGerais?: string; // Observações gerais (campo sempre visível)
  details: AppointmentSpecificDetails['details']; // Detalhes específicos do tipo de atendimento
  attachments?: { name: string; url: string }[]; // Para anexos
}