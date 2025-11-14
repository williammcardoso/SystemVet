"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaStethoscope } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import AppointmentForm from "@/components/AppointmentForm"; // Import the correct AppointmentForm component
import { toast } from "sonner";
import { AppointmentEntry, ConsultationDetails, BaseAppointmentDetails } from "@/types/appointment";
import { mockClients } from "@/mockData/clients";

// Mock data para atendimentos (para o select de "Atendimento de Origem" no formulário de Retorno)
// Em uma aplicação real, isso seria carregado de um serviço ou contexto.
export const mockAppointments: AppointmentEntry[] = [
  {
    id: "app1",
    animalId: "a1",
    date: "2023-10-26",
    time: "10:00",
    type: "Consulta",
    vet: "Dr. William Cardoso",
    pesoAtual: 25.0,
    temperaturaCorporal: 38.5,
    observacoesGerais: "Animal saudável, check-up de rotina.",
    details: {
      queixaPrincipal: "Check-up anual",
      historicoClinico: "Sem intercorrências recentes.",
      alimentacao: "Ração seca premium",
      vacinacaoVermifugacaoAtualizadas: "sim",
      ambiente: "interno",
      contatoOutrosAnimais: "nao",
      mucosas: "róseas, úmidas",
      frequenciaCardiaca: 100,
      frequenciaRespiratoria: 20,
      diagnosticoDefinitivo: "Saudável",
      condutaTratamento: "Manter rotina, próxima vacina em 6 meses.",
      retornoRecomendadoEmDias: 180,
    } as ConsultationDetails,
    attachments: [],
  },
  {
    id: "app2",
    animalId: "a1",
    date: "2024-03-10",
    time: "11:30",
    type: "Vacina",
    vet: "Dra. Ana Paula",
    pesoAtual: 25.5,
    temperaturaCorporal: 38.0,
    observacoesGerais: "Aplicação da vacina V8.",
    details: {
      tipoVacina: "Polivalente",
      nomeComercial: "Duramune Max 5/4L",
      lote: "ABC123XYZ",
      fabricante: "Boehringer Ingelheim",
      dataFabricacao: "2023-01-01",
      dataValidade: "2025-01-01",
      doseAplicada: 1.0,
      viaAdministracao: "SC",
      localAplicacao: "Escapular Direita",
      reacaoAdversaObservada: "Nenhuma",
      profissionalAplicou: "Dra. Ana Paula",
    },
    attachments: [],
  },
  {
    id: "app3",
    animalId: "a3",
    date: "2024-01-15",
    time: "14:30",
    type: "Emergência",
    vet: "Dr. Carlos Eduardo",
    pesoAtual: 18.0,
    temperaturaCorporal: 39.5,
    observacoesGerais: "Animal chegou com dispneia e tosse.",
    details: {
      horaChegada: "14:30",
      condicaoGeral: "dispneia",
      manobrasSuporteRealizadas: "Oxigenoterapia, fluidoterapia.",
      medicamentosAdministrados: "Furosemida, Dexametasona.",
      encaminhamento: "internacao",
    },
    attachments: [],
  },
  {
    id: "app4",
    animalId: "a1",
    date: "2024-07-25",
    time: "15:00",
    type: "Outros", // Exemplo de atendimento simples
    vet: "Dr. William Cardoso",
    pesoAtual: 26.0,
    temperaturaCorporal: 38.2,
    observacoesGerais: "Animal com leve tosse. Prescrito xarope.",
    details: {
      queixaPrincipal: "Tosse leve",
      condutaTratamento: "Xarope para tosse por 5 dias.",
    } as BaseAppointmentDetails,
    attachments: [],
  },
];


const AddAppointmentPage = () => {
  const { clientId, animalId, appointmentId } = useParams<{ clientId: string; animalId: string; appointmentId?: string }>();
  const navigate = useNavigate();

  const client = mockClients.find(c => c.id === clientId);
  const animal = client?.animals.find(a => a.id === animalId);

  const isEditing = !!appointmentId;
  const initialData = isEditing ? mockAppointments.find(app => app.id === appointmentId) : undefined;

  if (!client || !animal) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Animal ou Cliente não encontrado.</h1>
        <Link to="/clients">
          <Button variant="outline">
            <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
          </Button>
        </Link>
      </div>
    );
  }

  const handleSaveAppointment = (newAppointment: AppointmentEntry) => {
    if (isEditing) {
      const index = mockAppointments.findIndex(app => app.id === newAppointment.id);
      if (index !== -1) {
        mockAppointments[index] = newAppointment;
        toast.success("Atendimento atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar atendimento. Atendimento não encontrado.");
      }
    } else {
      mockAppointments.push(newAppointment);
      toast.success("Atendimento salvo com sucesso!");
    }
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  const handleCancel = () => {
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  const pageTitle = isEditing ? "Editar Atendimento" : "Adicionar Novo Atendimento";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4 sm:gap-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaStethoscope className="h-5 w-5 text-muted-foreground" /> {pageTitle}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {isEditing ? `Editando atendimento de ${animal.name}.` : `Registre um novo atendimento para ${animal.name}.`}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleCancel} className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
            <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; <Link to="/clients" className="hover:text-primary">Clientes</Link> &gt; <Link to={`/clients/${client.id}`} className="hover:text-primary">{client.name}</Link> &gt; <Link to={`/clients/${clientId}/animals/${animalId}/record`} className="hover:text-primary">{animal.name}</Link> &gt; {pageTitle}
        </p>
      </div>

      <div className="flex-1 p-6">
        <AppointmentForm
          animalId={animal.id}
          clientId={client.id}
          initialData={initialData}
          onSave={handleSaveAppointment}
          onCancel={handleCancel}
          mockAppointments={mockAppointments} // Pass mockAppointments for 'Retorno' type
        />
      </div>
    </div>
  );
};

export default AddAppointmentPage;