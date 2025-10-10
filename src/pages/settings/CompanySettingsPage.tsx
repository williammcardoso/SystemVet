import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Settings, BuildingOffice2, MapPin, Wrench } from "lucide-react"; // Adicionado Wrench para 'Outros'
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
    <div className="flex flex-col min-h-screen">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-b from-[#eaf2ff] to-[#ffffff] dark:from-gray-900 dark:to-background p-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-primary">
            <Settings className="h-7 w-7" /> Configurações da Empresa
          </h1>
          <Link to="/">
            <Button variant="outline" className="rounded-md hover:bg-secondary/80 transition-colors duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; Configurações &gt; Empresa
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4 max-w-5xl mx-auto">
          {/* Card: Informações Gerais */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BuildingOffice2 className="h-5 w-5 text-blue-500" /> Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input id="companyName" value={settings.companyName} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crmv">CRMV</Label>
                  <Input id="crmv" value={settings.crmv} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={settings.phone} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapaRegistration">Registro no MAPA</Label>
                <Input id="mapaRegistration" value={settings.mapaRegistration} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={settings.email} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Endereço */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-500" /> Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Textarea id="address" value={settings.address} onChange={handleChange} rows={2} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={settings.city} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input id="zipCode" value={settings.zipCode} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Outros */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-400 lg:col-span-2"> {/* Ocupa 2 colunas em telas grandes */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wrench className="h-5 w-5 text-blue-500" /> Outros
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL do Logo (Placeholder)</Label>
                <Input id="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="Ex: /public/logo.png" className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões Fixos */}
      <div className="sticky bottom-0 right-0 p-4 bg-background/90 backdrop-blur-sm flex justify-end gap-2 z-10 border-t border-border/50">
        <Button variant="outline" onClick={() => navigate("/")} className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200">
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-md font-bold transition-all duration-200">
          <Save className="mr-2 h-4 w-4" /> Salvar Configurações
        </Button>
      </div>

      {/* Rodapé Discreto */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border/50">
        © 2025 Clínica Moraes Cardoso – Sistema Veterinário
      </footer>
    </div>
  );
};

export default CompanySettingsPage;