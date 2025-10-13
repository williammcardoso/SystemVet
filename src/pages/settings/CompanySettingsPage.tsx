import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Settings, ArrowLeft, Building, MapPin, Wrench, X, Save } from "@lucide/react"; // Importações nomeadas explícitas
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {/* Avatar ou Ícone para o título da página */}
            {/* <Avatar className="h-8 w-8">
              <AvatarImage src="/public/placeholder.svg" alt="Company Avatar" />
              <AvatarFallback>CM</AvatarFallback>
            </Avatar> */}
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <Settings className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:animate-spin-slow" /> Configurações da Empresa
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Gerencie as informações e credenciais da sua empresa.
              </p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; <Link to="/settings/company" className="hover:text-blue-500 dark:hover:text-blue-400">Configurações</Link> &gt; Empresa
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4 max-w-5xl mx-auto">
          {/* Card: Informações Gerais */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-blue-400 dark:bg-gray-800/90">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                <Building className="h-5 w-5 text-blue-500" /> Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-[#4B5563] dark:text-gray-400 font-medium">Nome da Empresa</Label>
                <Input id="companyName" value={settings.companyName} onChange={handleChange} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crmv" className="text-[#4B5563] dark:text-gray-400 font-medium">CRMV</Label>
                  <Input id="crmv" value={settings.crmv} onChange={handleChange} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#4B5563] dark:text-gray-400 font-medium">Telefone</Label>
                  <Input id="phone" value={settings.phone} onChange={handleChange} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mapaRegistration" className="text-[#4B5563] dark:text-gray-400 font-medium">Registro no MAPA</Label>
                <Input id="mapaRegistration" value={settings.mapaRegistration} onChange={handleChange} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#4B5563] dark:text-gray-400 font-medium">Email</Label>
                <Input id="email" type="email" value={settings.email} onChange={handleChange} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Endereço */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-purple-400 dark:bg-gray-800/90">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                <MapPin className="h-5 w-5 text-purple-500" /> Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#4B5563] dark:text-gray-400 font-medium">Endereço Completo</Label>
                <Textarea id="address" value={settings.address} onChange={handleChange} rows={2} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[#4B5563] dark:text-gray-400 font-medium">Cidade</Label>
                  <Input id="city" value={settings.city} onChange={handleChange} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-[#4B5563] dark:text-gray-400 font-medium">CEP</Label>
                  <Input id="zipCode" value={settings.zipCode} onChange={handleChange} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Outros */}
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.08)] transition-all duration-300 border-t-4 border-gray-400 dark:bg-gray-800/90 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
                <Wrench className="h-5 w-5 text-gray-500" /> Outros
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3 pt-0">
              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-[#4B5563] dark:text-gray-400 font-medium">URL do Logo (Placeholder)</Label>
                <Input id="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="Ex: /public/logo.png" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões Fixos */}
      <div className="sticky bottom-0 p-4 bg-white/80 backdrop-blur-sm flex justify-center gap-4 z-10 border-t border-gray-200 dark:bg-gray-950/80 dark:border-gray-800">
        <Button variant="outline" onClick={() => navigate("/")} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
          <Save className="mr-2 h-4 w-4" /> Salvar Configurações
        </Button>
      </div>

      {/* Rodapé Discreto */}
      <footer className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        © 2025 Clínica Moraes Cardoso – Sistema Veterinário
      </footer>
    </div>
  );
};

export default CompanySettingsPage;