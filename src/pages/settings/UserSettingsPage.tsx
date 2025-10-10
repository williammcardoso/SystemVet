import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importar Card components
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
    toast.success("Configurações do usuário salvas com sucesso!");
    navigate("/settings"); // Voltar para a página de configurações (se houver) ou dashboard
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Configurações do Usuário</h1>
        <Link to="/"> {/* Ajuste conforme a rota de retorno desejada */}
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 py-4 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nome Completo</Label>
              <Input id="userName" value={settings.userName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input id="userEmail" type="email" value={settings.userEmail} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userCrmv">CRMV</Label>
                <Input id="userCrmv" value={settings.userCrmv} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userMapaRegistration">Registro no MAPA</Label>
                <Input id="userMapaRegistration" value={settings.userMapaRegistration} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signatureText">Texto da Assinatura (para relatórios)</Label>
              <Textarea id="signatureText" value={settings.signatureText} onChange={handleChange} rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Alterar Senha</Label>
              <Input id="password" type="password" placeholder="Deixe em branco para não alterar" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => navigate("/")}> {/* Ajuste conforme a rota de retorno desejada */}
          <X className="mr-2 h-4 w-4" /> Cancelar
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default UserSettingsPage;