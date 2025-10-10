import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Settings, User, Briefcase, Lock } from "lucide-react"; // Importar novos ícones
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex flex-col min-h-screen">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-b from-[#eaf2ff] to-[#ffffff] dark:from-gray-900 dark:to-background p-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-primary">
            <Settings className="h-7 w-7" /> Configurações do Usuário
          </h1>
          <Link to="/">
            <Button variant="outline" className="rounded-md hover:bg-secondary/80 transition-colors duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; Configurações &gt; Usuário
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4 max-w-5xl mx-auto">
          {/* Card: Informações Pessoais */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-blue-500" /> Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Nome Completo</Label>
                  <Input id="userName" value={settings.userName} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email</Label>
                  <Input id="userEmail" type="email" value={settings.userEmail} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Informações Profissionais */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-blue-500" /> Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userCrmv">CRMV</Label>
                  <Input id="userCrmv" value={settings.userCrmv} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userMapaRegistration">Registro no MAPA</Label>
                  <Input id="userMapaRegistration" value={settings.userMapaRegistration} onChange={handleChange} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signatureText">Texto da Assinatura (para relatórios)</Label>
                <Textarea id="signatureText" value={settings.signatureText} onChange={handleChange} rows={2} className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Segurança (ocupa 2 colunas em telas grandes) */}
          <Card className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-400 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5 text-blue-500" /> Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-y-3">
              <div className="space-y-2">
                <Label htmlFor="password">Alterar Senha</Label>
                <Input id="password" type="password" placeholder="Deixe em branco para não alterar" className="transition-all duration-200 hover:border-primary focus-visible:ring-primary" />
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

export default UserSettingsPage;