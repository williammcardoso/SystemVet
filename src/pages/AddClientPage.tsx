import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // Importar Textarea
import * as LucideIcons from "lucide-react"; // Padronizando importação de ícones
import { Link } from "react-router-dom";

const AddClientPage = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Adicionar responsável</h1>
        <Link to="/clients">
          <Button variant="outline">
            <LucideIcons.ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo (Pessoa física/jurídica)*</Label>
              <Select defaultValue="physical">
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Pessoa física</SelectItem>
                  <SelectItem value="legal">Pessoa jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo*</Label>
              <Input id="fullName" placeholder="Nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nacionalidade*</Label>
              <Select defaultValue="brazilian">
                <SelectTrigger id="nationality">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brazilian">Brasileira</SelectItem>
                  <SelectItem value="other">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Sexo</Label>
              <Select>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="CPF" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input id="rg" placeholder="RG" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Aniversário</Label>
              <Input id="birthday" placeholder="dd/mm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="howDidYouKnow">Como nos conheceu?</Label>
              <Select>
                <SelectTrigger id="howDidYouKnow">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internet">Internet</SelectItem>
                  <SelectItem value="friend">Indicação de amigo</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profissão</Label>
              <Select>
                <SelectTrigger id="profession">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vet">Veterinário</SelectItem>
                  <SelectItem value="student">Estudante</SelectItem>
                  <SelectItem value="other">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acceptEmail">Aceita Email?</Label>
              <Select defaultValue="yes">
                <SelectTrigger id="acceptEmail">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Sim</SelectItem>
                  <SelectItem value="no">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acceptWhatsapp">Aceita WhatsApp?</Label>
              <Select defaultValue="yes">
                <SelectTrigger id="acceptWhatsapp">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Sim</SelectItem>
                  <SelectItem value="no">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acceptSMS">Aceita SMS?</Label>
              <Select defaultValue="yes">
                <SelectTrigger id="acceptSMS">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Sim</SelectItem>
                  <SelectItem value="no">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acceptCampaign">Aceita Campanha SMS?</Label>
              <Select defaultValue="yes">
                <SelectTrigger id="acceptCampaign">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Sim</SelectItem>
                  <SelectItem value="no">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Contatos</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Select defaultValue="cell">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cell">Celular</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="residential">Telefone residencial</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Número/Email" className="flex-1" /> {/* Changed placeholder */}
                <Input placeholder="Observações" className="flex-1" />
                <Button variant="outline" size="icon">
                  <LucideIcons.Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <LucideIcons.X className="h-4 w-4" />
                </Button>
              </div>
              {/* More contact fields can be added dynamically */}
            </div>
            <Button variant="outline" className="mt-4">
              <LucideIcons.Plus className="mr-2 h-4 w-4" /> Adicionar
            </Button>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">
              <LucideIcons.X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button>
              <LucideIcons.Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="address" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" placeholder="CEP" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Endereço</Label>
              <Input id="street" placeholder="Rua, Avenida, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" placeholder="Número" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input id="complement" placeholder="Apartamento, Bloco, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" placeholder="Bairro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" placeholder="Cidade" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">Acre</SelectItem>
                  <SelectItem value="AL">Alagoas</SelectItem>
                  <SelectItem value="AP">Amapá</SelectItem>
                  <SelectItem value="AM">Amazonas</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                  <SelectItem value="DF">Distrito Federal</SelectItem>
                  <SelectItem value="ES">Espírito Santo</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="MA">Maranhão</SelectItem>
                  <SelectItem value="MT">Mato Grosso</SelectItem>
                  <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="PA">Pará</SelectItem>
                  <SelectItem value="PB">Paraíba</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="PI">Piauí</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="RO">Rondônia</SelectItem>
                  <SelectItem value="RR">Roraima</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="SE">Sergipe</SelectItem>
                  <SelectItem value="TO">Tocantins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">
              <LucideIcons.X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button>
              <LucideIcons.Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="extras" className="mt-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" placeholder="Adicione observações adicionais sobre o responsável..." rows={5} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">
              <LucideIcons.X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button>
              <LucideIcons.Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddClientPage;