"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaArrowLeft, FaCalendarPlus, FaPlus, FaTimes, FaSave, FaCalendarAlt, FaClock, FaUser, FaPaw, FaStickyNote, FaEdit, FaTrashAlt } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock Data para Clientes e Animais (simplificado para a agenda)
interface AnimalOption {
  id: string;
  name: string;
  clientId: string;
}

interface ClientOption {
  id: string;
  name: string;
  animals: AnimalOption[];
}

const mockClients: ClientOption[] = [
  {
    id: "1",
    name: "William",
    animals: [
      { id: "a1", name: "Totó", clientId: "1" },
      { id: "a2", name: "Bolinha", clientId: "1" },
    ],
  },
  {
    id: "2",
    name: "Maria",
    animals: [
      { id: "a3", name: "Fido", clientId: "2" },
      { id: "a4", name: "Miau", clientId: "2" },
    ],
  },
];

// Interface para Agendamento
interface Appointment {
  id: string;
  date: Date;
  time: string;
  title: string;
  clientId: string;
  clientName: string;
  animalId: string;
  animalName: string;
  notes?: string;
}

const initialMockAppointments: Appointment[] = [
  {
    id: "app1",
    date: new Date(2024, 7, 15, 10, 0), // 15 de Agosto de 2024, 10:00
    time: "10:00",
    title: "Consulta de Rotina - Totó",
    clientId: "1",
    clientName: "William",
    animalId: "a1",
    animalName: "Totó",
    notes: "Verificar vacinas e peso.",
  },
  {
    id: "app2",
    date: new Date(2024, 7, 15, 14, 30), // 15 de Agosto de 2024, 14:30
    time: "14:30",
    title: "Exame de Sangue - Fido",
    clientId: "2",
    clientName: "Maria",
    animalId: "a3",
    animalName: "Fido",
    notes: "Jejum de 12 horas.",
  },
  {
    id: "app3",
    date: new Date(2024, 7, 16, 9, 0), // 16 de Agosto de 2024, 09:00
    time: "09:00",
    title: "Retorno - Bolinha",
    clientId: "1",
    clientName: "William",
    animalId: "a2",
    animalName: "Bolinha",
    notes: "Avaliar recuperação pós-cirúrgica.",
  },
];

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(initialMockAppointments); // Usar useState para agendamentos

  const [newAppointmentTitle, setNewAppointmentTitle] = useState("");
  const [newAppointmentTime, setNewAppointmentTime] = useState("09:00");
  const [newAppointmentClientId, setNewAppointmentClientId] = useState<string | undefined>(undefined);
  const [newAppointmentAnimalId, setNewAppointmentAnimalId] = useState<string | undefined>(undefined);
  const [newAppointmentNotes, setNewAppointmentNotes] = useState("");

  const filteredAnimals = newAppointmentClientId
    ? mockClients.find(c => c.id === newAppointmentClientId)?.animals || []
    : [];

  const appointmentsForSelectedDate = selectedDate
    ? appointments.filter((app) => isSameDay(app.date, selectedDate))
    : [];

  const handleAddAppointmentClick = (date?: Date) => {
    setEditingAppointment(null);
    setNewAppointmentTitle("");
    setNewAppointmentTime("09:00");
    setNewAppointmentClientId(undefined);
    setNewAppointmentAnimalId(undefined);
    setNewAppointmentNotes("");
    setSelectedDate(date || new Date()); // Pre-select date if provided
    setIsDialogOpen(true);
  };

  const handleEditAppointmentClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setNewAppointmentTitle(appointment.title);
    setNewAppointmentTime(appointment.time);
    setNewAppointmentClientId(appointment.clientId);
    setNewAppointmentAnimalId(appointment.animalId);
    setNewAppointmentNotes(appointment.notes || "");
    setSelectedDate(appointment.date);
    setIsDialogOpen(true);
  };

  const handleSaveAppointment = () => {
    if (!newAppointmentTitle || !selectedDate || !newAppointmentTime || !newAppointmentClientId || !newAppointmentAnimalId) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const client = mockClients.find(c => c.id === newAppointmentClientId);
    const animal = client?.animals.find(a => a.id === newAppointmentAnimalId);

    if (!client || !animal) {
      toast.error("Cliente ou animal selecionado inválido.");
      return;
    }

    const [hours, minutes] = newAppointmentTime.split(':').map(Number);
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    if (editingAppointment) {
      // Update existing appointment
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app.id === editingAppointment.id
            ? {
                ...app,
                date: appointmentDateTime,
                time: newAppointmentTime,
                title: newAppointmentTitle,
                clientId: newAppointmentClientId,
                clientName: client.name,
                animalId: newAppointmentAnimalId,
                animalName: animal.name,
                notes: newAppointmentNotes,
              }
            : app
        ).sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort after update
      );
      toast.success("Agendamento atualizado com sucesso!");
    } else {
      // Add new appointment
      const newAppointment: Appointment = {
        id: `app-${Date.now()}`,
        date: appointmentDateTime,
        time: newAppointmentTime,
        title: newAppointmentTitle,
        clientId: newAppointmentClientId,
        clientName: client.name,
        animalId: newAppointmentAnimalId,
        animalName: animal.name,
        notes: newAppointmentNotes,
      };
      setAppointments((prevAppointments) =>
        [...prevAppointments, newAppointment].sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort after add
      );
      toast.success("Agendamento criado com sucesso!");
    }

    setIsDialogOpen(false);
    // No need to force re-render selectedDate, as setAppointments will handle it.
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prevAppointments) =>
      prevAppointments.filter(app => app.id !== id).sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort after delete
    );
    toast.info("Agendamento excluído.");
    // No need to force re-render selectedDate, as setAppointments will handle it.
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <FaCalendarAlt className="h-5 w-5 text-gray-500 dark:text-gray-400" /> Agenda
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Gerencie seus agendamentos e consultas.
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; Agenda
        </p>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna do Calendário */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-blue-400 dark:bg-gray-800/90">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaCalendarAlt className="h-5 w-5 text-blue-500" /> Calendário
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-md border shadow"
              modifiers={{
                hasAppointments: appointments.map(app => app.date),
              }}
              modifiersClassNames={{
                hasAppointments: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full",
              }}
            />
            <Button onClick={() => handleAddAppointmentClick(selectedDate)} className="mt-4 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
              <FaCalendarPlus className="mr-2 h-4 w-4" /> Novo Agendamento
            </Button>
          </CardContent>
        </Card>

        {/* Coluna de Agendamentos do Dia */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-purple-400 dark:bg-gray-800/90">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaClock className="h-5 w-5 text-purple-500" /> Agendamentos para {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Nenhum dia selecionado"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {appointmentsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {appointmentsForSelectedDate.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg bg-background dark:bg-gray-800 shadow-sm">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{app.time} - {app.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <FaUser className="h-3 w-3" /> {app.clientName}
                        <span className="mx-1">•</span>
                        <FaPaw className="h-3 w-3" /> {app.animalName}
                      </p>
                      {app.notes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <FaStickyNote className="h-3 w-3" /> {app.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAppointmentClick(app)} className="rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(app.id)} className="rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                        <FaTrashAlt className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4">Nenhum agendamento para este dia.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog para Adicionar/Editar Agendamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:bg-gray-800/90">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#374151] dark:text-gray-100">
              {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6B7280] dark:text-gray-400">
              Preencha os detalhes do agendamento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate" className="text-[#4B5563] dark:text-gray-400 font-medium">Data</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTime" className="text-[#4B5563] dark:text-gray-400 font-medium">Hora</Label>
              <Input
                id="appointmentTime"
                type="time"
                value={newAppointmentTime}
                onChange={(e) => setNewAppointmentTime(e.target.value)}
                className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTitle" className="text-[#4B5563] dark:text-gray-400 font-medium">Título/Motivo</Label>
              <Input
                id="appointmentTitle"
                placeholder="Ex: Consulta de Rotina"
                value={newAppointmentTitle}
                onChange={(e) => setNewAppointmentTitle(e.target.value)}
                className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSelect" className="text-[#4B5563] dark:text-gray-400 font-medium">Cliente</Label>
              <Select onValueChange={setNewAppointmentClientId} value={newAppointmentClientId}>
                <SelectTrigger id="clientSelect" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="animalSelect" className="text-[#4B5563] dark:text-gray-400 font-medium">Animal</Label>
              <Select onValueChange={setNewAppointmentAnimalId} value={newAppointmentAnimalId} disabled={!newAppointmentClientId}>
                <SelectTrigger id="animalSelect" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                  <SelectValue placeholder="Selecione o animal" />
                </SelectTrigger>
                <SelectContent>
                  {filteredAnimals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentNotes" className="text-[#4B5563] dark:text-gray-400 font-medium">Observações</Label>
              <Textarea
                id="appointmentNotes"
                placeholder="Notas adicionais sobre o agendamento..."
                value={newAppointmentNotes}
                onChange={(e) => setNewAppointmentNotes(e.target.value)}
                className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
              <FaTimes className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button onClick={handleSaveAppointment} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
              <FaSave className="mr-2 h-4 w-4" /> Salvar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgendaPage;