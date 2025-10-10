import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importar Card components
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
    toast.success("Configurações da empresa salvas com sucesso!");
    navigate("/settings"); // Voltar para a página de configurações (se houver) ou dashboard
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Configurações da Empresa</h1>
        <Link to="/"> {/* Ajuste conforme a rota de retorno desejada */}
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 py-4 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input id="companyName" value={settings.companyName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crmv">CRMV</Label>
                <Input id="crmv" value={settings.crmv} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mapaRegistration">Registro no MAPA</Label>
                <Input id="mapaRegistration" value={settings.mapaRegistration} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={settings.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={settings.email} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Textarea id="address" value={settings.address} onChange={handleChange} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" value={settings.city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input id="zipCode" value={settings.zipCode} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outros</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL do Logo (Placeholder)</Label>
              <Input id="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="Ex: /public/logo.png" />
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

export default CompanySettingsPage;