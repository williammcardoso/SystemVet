"use client";

import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStethoscope,
  FaEdit,
  FaCalendarAlt,
  FaUserMd,
  FaWeightHanging,
  FaThermometerHalf,
  FaNotesMedical,
  FaPaperclip,
  FaFlask,
  FaSyringe,
  FaCut,
  FaRedo,
  FaAmbulance,
  FaCheckCircle,
  FaBrain,
  FaExclamationCircle,
  FaHistory,
  FaUtensils,
  FaHeadSideMask,
  FaHamburger,
  FaLungs,
  FaBone,
  FaHeartbeat,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AppointmentEntry,
  ConsultationDetails,
  VaccinationDetails,
  SurgeryDetails,
  ReturnDetails,
  EmergencyDetails,
  CheckupDetails,
  BaseAppointmentDetails,
} from "@/types/appointment";
import { mockClients } from "@/mockData/clients";
import { mockAppointments } from "@/pages/AddAppointmentPage"; // Import mockAppointments from where it's defined

const AppointmentViewPage: React.FC = () => {
  const { clientId, animalId, appointmentId } = useParams<{
    clientId: string;
    animalId: string;
    appointmentId: string;
  }>();
  const navigate = useNavigate();

  const client = mockClients.find((c) => c.id === clientId);
  const animal = client?.animals.find((a) => a.id === animalId);
  const appointment = mockAppointments.find((app) => app.id === appointmentId);

  if (!client || !animal || !appointment) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Atendimento, Animal ou Cliente não encontrado.
        </h1>
        <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
          <Button variant="outline">
            <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
          </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const renderField = (label: string, value: any, icon?: React.ElementType) => {
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
      return null;
    }
    let displayValue = value;
    if (Array.isArray(value)) {
      displayValue = value.join(", ");
    } else if (typeof value === 'boolean') {
      displayValue = value ? 'Sim' : 'Não';
    } else if (typeof value === 'number') {
      displayValue = value.toString();
    }

    return (
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        {icon && React.createElement(icon, { className: "h-4 w-4 mt-1 flex-shrink-0" })}
        <div>
          <span className="font-medium text-foreground">{label}:</span> {displayValue}
        </div>
      </div>
    );
  };

  const renderDynamicDetails = (appType: AppointmentEntry["type"], details: any) => {
    switch (appType) {
      case "Consulta":
        const consultationDetails = details as ConsultationDetails;
        return (
          <>
            <div className="p-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaUserMd className="h-5 w-5 text-blue-500" /> Anamnese</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {renderField("Queixa Principal", consultationDetails.queixaPrincipal)}
                {renderField("Histórico Clínico", consultationDetails.historicoClinico)}
                {renderField("Alimentação", consultationDetails.alimentacao)}
                {renderField("Vacinação/Vermifugação Atualizadas", consultationDetails.vacinacaoVermifugacaoAtualizadas)}
                {renderField("Uso de Medicações", consultationDetails.usoMedicacoes)}
                {renderField("Ambiente", consultationDetails.ambiente)}
                {renderField("Contato com Outros Animais", consultationDetails.contatoOutrosAnimais)}
                {renderField("Vacinação do Paciente", consultationDetails.vacinacaoPaciente)}
                {renderField("Obs. Vacinação", consultationDetails.vacinacaoPacienteObs)}
                {renderField("Uso de Medicação", consultationDetails.usoMedicacao)}
                {renderField("Quais Medicações", consultationDetails.usoMedicacaoQuais)}
                {renderField("Possibilidade de Intoxicação", consultationDetails.possibilidadeIntoxicacao)}
                {renderField("Obs. Intoxicação", consultationDetails.possibilidadeIntoxicacaoObs)}
                {renderField("Alergias do Paciente", consultationDetails.alergiasPaciente)}
                {renderField("Obs. Alergias", consultationDetails.alergiasPacienteObs)}
                {renderField("Histórico Cirúrgico", consultationDetails.historicoCirurgico)}
                {renderField("Quais Cirurgias", consultationDetails.historicoCirurgicoQuais)}
                {renderField("Tipo de Alimentação", consultationDetails.alimentacaoTipo)}
                {renderField("Obs. Alimentação", consultationDetails.alimentacaoObs)}
                {renderField("Apetite e Deglutição", consultationDetails.apetiteDegluticao)}
                {renderField("Obs. Apetite/Deglutição", consultationDetails.apetiteDegluticaoObs)}
                {renderField("Êmese e Regurgitação", consultationDetails.emeseRegurgitacao)}
                {renderField("Início Êmese/Regurgitação", consultationDetails.emeseRegurgitacaoComplementoInicio)}
                {renderField("Quantidade Êmese/Regurgitação", consultationDetails.emeseRegurgitacaoComplementoQuantidade)}
                {renderField("Frequência Êmese/Regurgitação", consultationDetails.emeseRegurgitacaoComplementoFrequencia)}
                {renderField("Aspecto Êmese/Regurgitação", consultationDetails.emeseRegurgitacaoComplementoAspecto)}
                {renderField("Ingestão de Água", consultationDetails.ingestaoAgua)}
                {renderField("Micção Normal", consultationDetails.miccaoNormal)}
                {renderField("Frequência Micção", consultationDetails.miccaoFrequencia)}
                {renderField("Aspecto Micção", consultationDetails.miccaoAspecto)}
                {renderField("Alterações Micção", consultationDetails.miccaoAlteracoes)}
                {renderField("Fezes e Defecações", consultationDetails.fezesDefecacoes)}
                {renderField("Complemento Fezes/Defecações", consultationDetails.fezesDefecacoesComplemento)}
                {renderField("Alterações Respiratórias", consultationDetails.alteracoesRespiratorias)}
                {renderField("Tipos Alterações Respiratórias", consultationDetails.alteracoesRespiratoriasTipos)}
                {renderField("Tosse", consultationDetails.tosse)}
                {renderField("Período Tosse", consultationDetails.tossePeriodo)}
                {renderField("Frequência Tosse", consultationDetails.tosseFrequencia)}
                {renderField("Espirros", consultationDetails.espirros)}
                {renderField("Período Espirros", consultationDetails.espirrosPeriodo)}
                {renderField("Frequência Espirros", consultationDetails.espirrosFrequencia)}
                {renderField("Intolerância ao Exercício", consultationDetails.intoleranciaExercicio)}
                {renderField("Tipos Intolerância ao Exercício", consultationDetails.intoleranciaExercicioTipos)}
                {renderField("Obs. Intolerância ao Exercício", consultationDetails.intoleranciaExercicioObs)}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaHeartbeat className="h-5 w-5 text-green-500" /> Exame Físico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {renderField("Exame Físico Realizado", consultationDetails.exameFisicoRealizado)}
                {renderField("Obs. Exame Físico", consultationDetails.exameFisicoObs)}
                {renderField("Uso de Contenção", consultationDetails.usoContencao)}
                {renderField("Qual Contenção", consultationDetails.usoContencaoQual)}
                {renderField("Secreção Nasal", consultationDetails.secrecaoNasal)}
                {renderField("Início Secreção Nasal", consultationDetails.secrecaoNasalComplementoInicio)}
                {renderField("Aspecto/Quantidade Secreção Nasal", consultationDetails.secrecaoNasalComplementoAspectoQuantidade)}
                {renderField("Secreção Ocular", consultationDetails.secrecaoOcular)}
                {renderField("Início Secreção Ocular", consultationDetails.secrecaoOcularComplementoInicio)}
                {renderField("Aspecto/Quantidade Secreção Ocular", consultationDetails.secrecaoOcularComplementoAspectoQuantidade)}
                {renderField("Olhos", consultationDetails.olhosEstado)}
                {renderField("Obs. Olhos", consultationDetails.olhosObs)}
                {renderField("Orelhas", consultationDetails.orelhasAlteracoes)}
                {renderField("Boca e Anexos", consultationDetails.bocaAnexos)}
                {renderField("Descrição Boca e Anexos", consultationDetails.bocaAnexosDescricao)}
                {renderField("Doença Periodontal", consultationDetails.doencaPeriodontal)}
                {renderField("Grau Doença Periodontal", consultationDetails.doencaPeriodontalGrau)}
                {renderField("Pescoço e Coluna", consultationDetails.pescocoColuna)}
                {renderField("Descrição Pescoço e Coluna", consultationDetails.pescocoColunaDescricao)}
                {renderField("Desconforto Abdominal", consultationDetails.desconfortoAbdominal)}
                {renderField("Região Sensibilidade Abdominal", consultationDetails.desconfortoAbdominalRegiaoSensibilidade)}
                {renderField("Nível de Dor Abdominal", consultationDetails.desconfortoAbdominalNivelDor)}
                {renderField("Aumento Volume Abdominal", consultationDetails.aumentoVolumeAbdominal)}
                {renderField("Região Aumento Volume Abdominal", consultationDetails.aumentoVolumeAbdominalRegiao)}
                {renderField("Mucosas", consultationDetails.mucosasEstado)}
                {renderField("Frequência Respiratória (Mrm)", consultationDetails.frequenciaRespiratoria)}
                {renderField("Obs. Ausculta Respiratória", consultationDetails.frequenciaRespiratoriaObsAusculta)}
                {renderField("Sopro", consultationDetails.sopro)}
                {renderField("Padrão Respiratório", consultationDetails.padraoRespiratorio)}
                {renderField("Frequência Cardíaca (Bpm)", consultationDetails.frequenciaCardiaca)}
                {renderField("Obs. Ausculta Cardíaca", consultationDetails.frequenciaCardiacaObsAusculta)}
                {renderField("Linfonodos", consultationDetails.linfonodosEstado)}
                {renderField("Obs. Linfonodos", consultationDetails.linfonodosAlteracaoQualObs)}
                {renderField("Pele e Anexos", consultationDetails.peleAnexosAlteracoes)}
                {renderField("Descrição Pele e Anexos", consultationDetails.peleAnexosDescricao)}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaExclamationCircle className="h-5 w-5 text-orange-500" /> Parâmetros de Atitude A (AVDN)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {renderField("Mucosa", consultationDetails.avdnMucosa)}
                {renderField("TPC", consultationDetails.avdnTpc)}
                {renderField("FC", consultationDetails.avdnFc)}
                {renderField("FR", consultationDetails.avdnFr)}
                {renderField("Padrão Respiratório", consultationDetails.avdnPadraoRespiratorio)}
                {renderField("Pulso", consultationDetails.avdnPulso)}
                {renderField("PAS", consultationDetails.avdnPas)}
                {renderField("Manguito #", consultationDetails.avdnManguito)}
                {renderField("Temperatura °C", consultationDetails.avdnTemperatura)}
                {renderField("Sem dor abdominal", consultationDetails.avdnSemDorAbdominal)}
                {renderField("Hidratação: Turgor cutâneo", consultationDetails.avdnHidratacaoTurgorCutaneo)}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaBrain className="h-5 w-5 text-purple-500" /> Diagnóstico e Tratamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {renderField("Observações e Ocorrências", consultationDetails.observacoesOcorrencias)}
                {renderField("Exames Solicitados", consultationDetails.examesSolicitados)}
                {renderField("Suspeita Diagnóstica", consultationDetails.suspeitaDiagnostica)}
                {renderField("Diagnóstico Diferencial", consultationDetails.diagnosticoDiferencial)}
                {renderField("Procedimento Realizado Durante a Consulta", consultationDetails.procedimentoRealizadoConsulta)}
                {renderField("Diagnóstico Presuntivo", consultationDetails.diagnosticoPresuntivo)}
                {renderField("Diagnóstico Definitivo", consultationDetails.diagnosticoDefinitivo)}
                {renderField("Conduta / Tratamento Prescrito", consultationDetails.condutaTratamento)}
                {renderField("Retorno recomendado em (dias)", consultationDetails.retornoRecomendadoEmDias)}
                {renderField("Próximos Passos", consultationDetails.proximosPassos)}
              </div>
            </div>
          </>
        );
      case "Vacina":
        const vaccinationDetails = details as VaccinationDetails;
        return (
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaSyringe className="h-5 w-5 text-primary" /> Ficha de Controle Vacinal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {renderField("Tipo de Vacina", vaccinationDetails.tipoVacina)}
              {renderField("Nome Comercial", vaccinationDetails.nomeComercial)}
              {renderField("Lote", vaccinationDetails.lote)}
              {renderField("Fabricante", vaccinationDetails.fabricante)}
              {renderField("Data de Fabricação", formatDate(vaccinationDetails.dataFabricacao || ""))}
              {renderField("Data de Validade", formatDate(vaccinationDetails.dataValidade || ""))}
              {renderField("Dose Aplicada (mL)", vaccinationDetails.doseAplicada)}
              {renderField("Via de Administração", vaccinationDetails.viaAdministracao)}
              {renderField("Local de Aplicação", vaccinationDetails.localAplicacao)}
              {renderField("Reação Adversa Observada", vaccinationDetails.reacaoAdversaObservada)}
              {renderField("Profissional que aplicou", vaccinationDetails.profissionalAplicou)}
            </div>
          </div>
        );
      case "Cirurgia":
        const surgeryDetails = details as SurgeryDetails;
        return (
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaCut className="h-5 w-5 text-primary" /> Ficha Cirúrgica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {renderField("Tipo de Cirurgia", surgeryDetails.tipoCirurgia)}
              {renderField("Tempo de Jejum (horas)", surgeryDetails.tempoJejumHoras)}
              {renderField("Medicação Pré-anestésica", surgeryDetails.medicacaoPreAnestesica)}
              {renderField("Anestésico Utilizado", surgeryDetails.anestesicoUtilizado)}
              {renderField("Procedimento Realizado", surgeryDetails.procedimentoRealizado)}
              {renderField("Achados Intraoperatórios", surgeryDetails.achadosIntraoperatórios)}
              {renderField("Complicações Intraoperatórias", surgeryDetails.complicacoesIntraoperatórias)}
              {renderField("Tempo Cirúrgico (min)", surgeryDetails.tempoCirurgicoMin)}
              {renderField("Responsável pela Anestesia", surgeryDetails.responsavelAnestesia)}
              {renderField("Responsável pela Cirurgia", surgeryDetails.responsavelCirurgia)}
              {renderField("Medicamentos Pós-operatórios Prescritos", surgeryDetails.medicamentosPosOperatorios)}
            </div>
          </div>
        );
      case "Retorno":
        const returnDetails = details as ReturnDetails;
        const originalAppointment = mockAppointments.find(
          (app) => app.id === returnDetails.atendimentoOrigemId
        );
        return (
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaRedo className="h-5 w-5 text-primary" /> Evolução Clínica (Retorno)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {renderField(
                "Atendimento de Origem",
                originalAppointment
                  ? `${formatDate(originalAppointment.date)} - ${originalAppointment.type}`
                  : "Não informado"
              )}
              {renderField("Motivo do Retorno", returnDetails.motivoRetorno)}
              {renderField("Evolução Observada", returnDetails.evolucaoObservada)}
              {renderField("Novo Diagnóstico / Conduta", returnDetails.novoDiagnosticoConduta)}
            </div>
          </div>
        );
      case "Emergência":
        const emergencyDetails = details as EmergencyDetails;
        return (
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaAmbulance className="h-5 w-5 text-primary" /> Ficha de Atendimento Emergencial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {renderField("Hora de Chegada", emergencyDetails.horaChegada)}
              {renderField("Condição Geral", emergencyDetails.condicaoGeral)}
              {renderField("Manobras de Suporte Realizadas", emergencyDetails.manobrasSuporteRealizadas)}
              {renderField("Medicamentos Administrados", emergencyDetails.medicamentosAdministrados)}
              {renderField("Encaminhamento", emergencyDetails.encaminhamento)}
            </div>
          </div>
        );
      case "Check-up":
        const checkupDetails = details as CheckupDetails;
        return (
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaCheckCircle className="h-5 w-5 text-primary" /> Avaliação Geral (Check-up)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {renderField("Última Vacinação", formatDate(checkupDetails.ultimaVacinacao || ""))}
              {renderField("Última Vermifugação", formatDate(checkupDetails.ultimaVermifugacao || ""))}
              {renderField("Avaliação Dentária", checkupDetails.avaliacaoDentaria)}
              {renderField("Avaliação Nutricional", checkupDetails.avaliacaoNutricional)}
              {renderField("Avaliação Corporal (escala 1–9)", checkupDetails.avaliacaoCorporalEscala)}
              {renderField("Recomendações Preventivas", checkupDetails.recomendacoesPreventivas)}
            </div>
          </div>
        );
      case "Outros":
        const otherDetails = details as BaseAppointmentDetails;
        return (
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><FaNotesMedical className="h-5 w-5 text-primary" /> Detalhes Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {renderField("Descrição Detalhada", otherDetails.historicoClinico)}
              {renderField("Queixa Principal", otherDetails.queixaPrincipal)}
              {renderField("Observações e Ocorrências", otherDetails.observacoesOcorrencias)}
              {renderField("Exames Solicitados", otherDetails.examesSolicitados)}
              {renderField("Suspeita Diagnóstica", otherDetails.suspeitaDiagnostica)}
              {renderField("Diagnóstico Diferencial", otherDetails.diagnosticoDiferencial)}
              {renderField("Procedimento Realizado Durante a Consulta", otherDetails.procedimentoRealizadoConsulta)}
              {renderField("Diagnóstico Presuntivo", otherDetails.diagnosticoPresuntivo)}
              {renderField("Diagnóstico Definitivo", otherDetails.diagnosticoDefinitivo)}
              {renderField("Conduta / Tratamento Prescrito", otherDetails.condutaTratamento)}
              {renderField("Retorno recomendado em (dias)", otherDetails.retornoRecomendadoEmDias)}
              {renderField("Próximos Passos", otherDetails.proximosPassos)}
            </div>
          </div>
        );
      default:
        return <p className="text-muted-foreground p-4">Nenhum detalhe específico para este tipo de atendimento.</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4 sm:gap-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaStethoscope className="h-5 w-5 text-muted-foreground" /> Detalhes do Atendimento
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Visualizando o atendimento de {animal.name} ({appointment.type}).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                navigate(
                  `/clients/${clientId}/animals/${animalId}/edit-appointment/${appointmentId}`
                )
              }
              className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
            >
              <FaEdit className="mr-2 h-4 w-4" /> Editar Atendimento
            </Button>
            <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
              <Button
                variant="outline"
                className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt;{" "}
          <Link to="/clients" className="hover:text-primary">
            Clientes
          </Link>{" "}
          &gt;{" "}
          <Link to={`/clients/${client.id}`} className="hover:text-primary">
            {client.name}
          </Link>{" "}
          &gt;{" "}
          <Link
            to={`/clients/${clientId}/animals/${animalId}/record`}
            className="hover:text-primary"
          >
            {animal.name}
          </Link>{" "}
          &gt; Detalhes do Atendimento
        </p>
      </div>

      <div className="flex-1 p-6">
        <Card className="bg-card shadow-sm border border-border rounded-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FaNotesMedical className="h-5 w-5 text-primary" /> Informações do Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {renderField("Data", formatDate(appointment.date))}
              {renderField("Tipo", appointment.type)}
              {renderField("Veterinário", appointment.vet)}
              {renderField("Peso Atual (kg)", appointment.pesoAtual)}
              {renderField("Temperatura Corporal (°C)", appointment.temperaturaCorporal)}
              {renderField("Observações Gerais", appointment.observacoesGerais)}
            </div>

            {/* Detalhes Específicos do Atendimento */}
            {renderDynamicDetails(appointment.type, appointment.details)}

            {/* Anexos */}
            {appointment.attachments && appointment.attachments.length > 0 && (
              <div className="p-4 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FaPaperclip className="h-5 w-5 text-primary" /> Anexos
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {appointment.attachments.map((att, index) => (
                    <li key={index}>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {att.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentViewPage;