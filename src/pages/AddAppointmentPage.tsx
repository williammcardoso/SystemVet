"use client";

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaStethoscope, FaSave, FaTimes } from "react-icons/fa";
import AppointmentForm from "@/components/AppointmentForm";
import { AppointmentEntry } from "@/types/appointment";
import { toast } from "sonner";

// Mock data para atendimentos (para o select de "Atendimento de Origem" no formulário de Retorno)
// Em uma aplicação real, isso seria carregado de um serviço ou contexto.
const mockAppointments: AppointmentEntry[] = [
  {
    id: "app1",
    animalId: "a1",
    date: "2023-10-26",
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
    },
    attachments: [],
  },
  {
    id: "app2",
    animalId: "a1",
    date: "2024-03-10",
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
];

// Mock data para clientes e animais (para exibir informações no cabeçalho)
interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
}

interface Client {
  id: string;
  name: string;
}

const mockClients: Client[] = [
  { id: "1", name: "William" },
  { id: "2", name: "Maria" },
  { id: "3", name: "João" },
];

const mockAnimals: Animal[] = [
  { id: "a1", name: "Totó", species: "Cachorro", breed: "Labrador" },
  { id: "a2", name: "Bolinha", species: "Cachorro", breed: "Poodle" },
  { id: "a3", name: "Fido", species: "Cachorro", breed: "Vira-lata" },
  { id: "a4", name: "Miau", species: "Gato", species: "Gato", breed: "Siamês" },
  { id: "a5", name: "Rex", species: "Cachorro", breed: "Pastor Alemão" },
];


const AddAppointmentPage = () => {
  const { clientId, animalId, appointmentId } = useParams<{ clientId: string; animalId: string; appointmentId?: string }>();
  const navigate = useNavigate();

  const client = mockClients.find(c => c.id === clientId);
  const animal = mockAnimals.find(a => a.id === animalId);

  const [initialAppointmentData, setInitialAppointmentData] = useState<AppointmentEntry | undefined>(undefined);

  useEffect(() => {
    if (appointmentId) {
      const existingAppointment = mockAppointments.find(app => app.id === appointmentId);
      if (existingAppointment) {
        setInitialAppointmentData(existingAppointment);
      } else {
        toast.error("Atendimento não encontrado.");
        navigate(`/clients/${clientId}/animals/${animalId}/record`);
      }
    } else {
      setInitialAppointmentData(undefined); // Reset for new appointment
    }
  }, [appointmentId, clientId, animalId, navigate]);

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

  const handleSaveAppointment = (appointment: AppointmentEntry) => {
    // Aqui você faria a lógica para salvar o atendimento (enviar para uma API, etc.)
    // Por enquanto, apenas exibiremos um toast de sucesso e navegaremos de volta.
    console.log("Salvando atendimento:", appointment);

    // Simular atualização ou adição no mockAppointments (apenas para demonstração)
    if (appointmentId) {
      const index = mockAppointments.findIndex(app => app.id === appointmentId);
      if (index !== -1) {
        mockAppointments[index] = appointment;
      }
    } else {
      mockAppointments.push(appointment);
    }

    toast.success(appointmentId ? "Atendimento atualizado com sucesso!" : "Atendimento adicionado com sucesso!");
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  const handleCancel = () => {
    navigate(`/clients/${clientId}/animals/${animalId}/record`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <FaStethoscope className="h-5 w-5 text-gray-500 dark:text-gray-400" /> {appointmentId ? "Editar Atendimento" : "Adicionar Atendimento"}
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                {appointmentId ? `Editando atendimento para ${animal.name}.` : `Cadastre um novo atendimento para ${animal.name}.`}
              </p>
            </div>
          </div>
          <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; <Link to="/clients" className="hover:text-blue-500 dark:hover:text-blue-400">Clientes</Link> &gt; <Link to={`/clients/${client.id}`} className="hover:text-blue-500 dark:hover:text-blue-400">{client.name}</Link> &gt; <Link to={`/clients/${clientId}/animals/${animalId}/record`} className="hover:text-blue-500 dark:hover:text-blue-400">{animal.name}</Link> &gt; {appointmentId ? "Editar Atendimento" : "Adicionar Atendimento"}
        </p>
      </div>

      <div className="flex-1 p-6">
        <AppointmentForm
          animalId={animalId!}
          clientId={clientId!}
          initialData={initialAppointmentData}
          onSave={handleSaveAppointment}
          onCancel={handleCancel}
          mockAppointments={mockAppointments} // Passar mockAppointments para o formulário
        />
      </div>
    </div>
  );
};

export default AddAppointmentPage;