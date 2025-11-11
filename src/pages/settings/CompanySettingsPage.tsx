import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCog, FaArrowLeft, FaBuilding, FaMapPin, FaWrench, FaTimes, FaSave } from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { mockCompanySettings, updateMockCompanySettings } from "@/mockData/settings";

const CompanySettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(mockCompanySettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    updateMockCompanySettings(settings);
    toast.success("✅ Configurações salvas com sucesso!");
    // navigate("/settings"); // Pode voltar para uma página de configurações geral ou dashboard
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {/* Avatar ou Ícone para o título da página */}
            {/* <Avatar className="h-8 w-8">
              <AvatarImage src="/public/placeholder.svg" alt="Company Avatar" />
              <AvatarFallback>CM</AvatarFallback>
            </Avatar> */}
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaCog className="h-6 w-6 text-muted-foreground group-hover:animate-spin-slow" /> Configurações da Empresa
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Gerencie as informações e credenciais da sua empresa.
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
          Painel &gt; <Link to="/settings/company" className="hover:text-primary">Configurações</Link> &gt; Empresa
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4 max-w-5xl mx-auto">
          {/* Card: Informações Gerais */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FaBuilding className="h-5 w-5 text-primary" /> Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-muted-foreground font-medium">Nome da Empresa</Label>
                <Input id="companyName" value={settings.companyName} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crmv" className="text-muted-foreground font-medium">CRMV</Label>
                  <Input id="crmv" value={settings.crmv} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-muted-foreground font-medium">Telefone</Label>
                  <Input id="phone" value={settings.phone} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapaRegistration" className="text-muted-foreground font-medium">Registro no MAPA</Label>
                <Input id="mapaRegistration" value={settings.mapaRegistration} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-medium">Email</Label>
                <Input id="email" type="email" value={settings.email} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Endereço */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FaMapPin className="h-5 w-5 text-primary" /> Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-muted-foreground font-medium">Endereço Completo</Label>
                <Textarea id="address" value={settings.address} onChange={handleChange} rows={2} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-muted-foreground font-medium">Cidade</Label>
                  <Input id="city" value={settings.city} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-muted-foreground font-medium">CEP</Label>
                  <Input id="zipCode" value={settings.zipCode} onChange={handleChange} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Outros */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border rounded-md lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FaWrench className="h-5 w-5 text-primary" /> Outros
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-muted-foreground font-medium">URL do Logo (Placeholder)</Label>
                <Input id="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="Ex: /public/logo.png" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
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

export default CompanySettingsPage;