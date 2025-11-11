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
import { mockClients } from "@/mockData/clients"; // Importar o mock de clientes centralizado
import { Client, Animal } from "@/types/client"; // Importar as interfaces Client e Animal

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4 sm:gap-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaCalendarAlt className="h-5 w-5 text-muted-foreground" /> Agenda
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Gerencie seus agendamentos e consultas.
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; Agenda
        </p>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna do Calendário */}
        <Card className="bg-card shadow-sm border border-border rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FaCalendarAlt className="h-5 w-5 text-primary" /> Calendário
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              className="rounded-md border shadow bg-input w-full" // Adicionado w-full
              modifiers={{
                hasAppointments: appointments.map(app => app.date),
              }}
              modifiersClassNames={{
                hasAppointments: "bg-primary text-primary-foreground rounded-full",
              }}
            />
            <Button onClick={() => handleAddAppointmentClick(selectedDate)} className="mt-4 w-full sm:w-auto rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
              <FaCalendarPlus className="mr-2 h-4 w-4" /> Novo Agendamento
            </Button>
          </CardContent>
        </Card>

        {/* Coluna de Agendamentos do Dia */}
        <Card className="bg-card shadow-sm border border-border rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <FaClock className="h-5 w-5 text-primary" /> Agendamentos para {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Nenhum dia selecionado"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {appointmentsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {appointmentsForSelectedDate.map((app) => (
                  <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg bg-input shadow-sm gap-2">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{app.time} - {app.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <FaUser className="h-3 w-3" /> {app.clientName}
                        <span className="mx-1">•</span>
                        <FaPaw className="h-3 w-3" /> {app.animalName}
                      </p>
                      {app.notes && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <FaStickyNote className="h-3 w-3" /> {app.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditAppointmentClick(app)} className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(app.id)} className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                        <FaTrashAlt className="h-4 w-4 text-destructive" />
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
        <DialogContent className="sm:max-w-[500px] bg-card shadow-sm border border-border rounded-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Preencha os detalhes do agendamento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="appointmentDate" className="text-muted-foreground font-medium">Data</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTime" className="text-muted-foreground font-medium">Hora</Label>
              <Input
                id="appointmentTime"
                type="time"
                value={newAppointmentTime}
                onChange={(e) => setNewAppointmentTime(e.target.value)}
                className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentTitle" className="text-muted-foreground font-medium">Título/Motivo</Label>
              <Input
                id="appointmentTitle"
                placeholder="Ex: Consulta de Rotina"
                value={newAppointmentTitle}
                onChange={(e) => setNewAppointmentTitle(e.target.value)}
                className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSelect" className="text-muted-foreground font-medium">Cliente</Label>
              <Select onValueChange={setNewAppointmentClientId} value={newAppointmentClientId}>
                <SelectTrigger id="clientSelect" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
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
              <Label htmlFor="animalSelect" className="text-muted-foreground font-medium">Animal</Label>
              <Select onValueChange={setNewAppointmentAnimalId} value={newAppointmentAnimalId} disabled={!newAppointmentClientId}>
                <SelectTrigger id="animalSelect" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
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
              <Label htmlFor="appointmentNotes" className="text-muted-foreground font-medium">Observações</Label>
              <Textarea
                id="appointmentNotes"
                placeholder="Notas adicionais sobre o agendamento..."
                value={newAppointmentNotes}
                onChange={(e) => setNewAppointmentNotes(e.target.value)}
                className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
              <FaTimes className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button onClick={handleSaveAppointment} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
              <FaSave className="mr-2 h-4 w-4" /> Salvar Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgendaPage;