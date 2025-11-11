import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCog, FaArrowLeft, FaUser, FaBriefcase, FaLock, FaTimes, FaSave } from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { mockUserSettings, updateMockUserSettings } from "@/mockData/settings";

const UserSettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(mockUserSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    updateMockUserSettings(settings);
    toast.success("✅ Configurações salvas com sucesso!");
    // navigate("/settings"); // Pode voltar para uma página de configurações geral ou dashboard
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/public/placeholder.svg" alt="User Avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground">US</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaCog className="h-5 w-5 text-muted-foreground group-hover:animate-spin-slow" /> Configurações do Usuário
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Gerencie suas informações e credenciais profissionais.
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
          Painel &gt; <Link to="/settings/company" className="hover:text-primary">Configurações</Link> &gt; Usuário
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4 max-w-5xl mx-auto">
          {/* Card: Informações Pessoais */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FaUser className="h-5 w-5 text-primary" /> Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-muted-foreground font-medium">Nome Completo</Label>
                  <Input id="userName" value={settings.userName} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userEmail" className="text-muted-foreground font-medium">Email</Label>
                  <Input id="userEmail" type="email" value={settings.userEmail} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Informações Profissionais */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FaBriefcase className="h-5 w-5 text-primary" /> Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userCrmv" className="text-muted-foreground font-medium">CRMV</Label>
                  <Input id="userCrmv" value={settings.userCrmv} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userMapaRegistration" className="text-muted-foreground font-medium">Registro no MAPA</Label>
                  <Input id="userMapaRegistration" value={settings.userMapaRegistration} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
              </div>
              <div className="space-y-2 border-t border-border mt-4 pt-4">
                <Label htmlFor="signatureText" className="text-muted-foreground font-medium">Texto da Assinatura (para relatórios)</Label>
                <Textarea id="signatureText" value={settings.signatureText} onChange={handleChange} rows={2} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Segurança (ocupa 2 colunas em telas grandes) */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FaLock className="h-5 w-5 text-primary" /> Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-muted-foreground font-medium">Alterar Senha</Label>
                <Input id="password" type="password" placeholder="Deixe em branco para não alterar" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões Fixos */}
      <div className="sticky bottom-0 p-4 bg-card/80 backdrop-blur-sm flex justify-center gap-4 z-10 border-t border-border">
        <Button variant="outline" onClick={() => navigate("/")} className="bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
          <FaTimes className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
          <FaSave className="mr-2 h-4 w-4" /> Salvar Configurações
        </Button>
      </div>

      {/* Rodapé Discreto */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border">
        © 2025 Clínica Moraes Cardoso – Sistema Veterinário
      </footer>
    </div>
  );
};

export default UserSettingsPage;