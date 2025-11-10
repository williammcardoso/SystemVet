import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FaArrowLeft, FaPlus, FaTimes, FaSave, FaUsers, FaTrashAlt } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner"; // Importar toast para mensagens

// Helper functions for masks
const applyCpfMask = (value: string) => {
  value = value.replace(/\D/g, ""); // Remove non-digits
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
};

const applyCnpjMask = (value: string) => {
  value = value.replace(/\D/g, ""); // Remove non-digits
  value = value.replace(/^(\d{2})(\d)/, "$1.$2");
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
  value = value.replace(/(\d{4})(\d)/, "$1-$2");
  return value;
};

const applyRgMask = (value: string) => {
  value = value.replace(/\D/g, ""); // Remove non-digits
  value = value.replace(/(\d{2})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1})$/, "$1-$2");
  return value;
};

interface DynamicContact {
  id: string;
  type: 'phone' | 'email';
  value: string;
}

const AddClientPage = () => {
  // Estados para os campos do formulário
  const [clientType, setClientType] = useState("physical");
  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("brazilian");
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [identificationNumber, setIdentificationNumber] = useState(""); // CPF ou CNPJ
  const [secondaryIdentification, setSecondaryIdentification] = useState(""); // RG ou IE
  const [birthday, setBirthday] = useState("");
  const [profession, setProfession] = useState("");
  const [acceptEmail, setAcceptEmail] = useState("yes");
  const [acceptWhatsapp, setAcceptWhatsapp] = useState("yes");
  const [acceptSMS, setAcceptSMS] = useState("yes");

  // Contato de email fixo
  const [mainEmailContact, setMainEmailContact] = useState("");
  // Contatos dinâmicos (para telefones, por exemplo)
  const [dynamicContacts, setDynamicContacts] = useState<DynamicContact[]>([]);

  // Endereço com busca de CEP
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<string | undefined>(undefined);

  // Extras
  const [notes, setNotes] = useState("");

  // Resetar campos de identificação ao mudar o tipo de cliente
  useEffect(() => {
    setIdentificationNumber("");
    setSecondaryIdentification("");
  }, [clientType]);

  const handleIdentificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (clientType === "physical") {
      value = applyCpfMask(value);
    } else {
      value = applyCnpjMask(value);
    }
    setIdentificationNumber(value);
  };

  const handleSecondaryIdentificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (clientType === "physical") {
      value = applyRgMask(value);
    }
    // Para IE, não aplicamos máscara complexa por enquanto, apenas removemos não-dígitos
    else {
      value = value.replace(/\D/g, "");
    }
    setSecondaryIdentification(value);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    setCep(value);
  };

  const fetchAddressByCep = async () => {
    if (cep.length === 9) { // Check for masked length
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        const data = await response.json();
        if (data.erro) {
          toast.error("CEP não encontrado.");
          setStreet("");
          setNeighborhood("");
          setCity("");
          setState(undefined);
        } else {
          setStreet(data.logradouro);
          setNeighborhood(data.bairro);
          setCity(data.localidade);
          setState(data.uf);
          toast.success("Endereço preenchido automaticamente!");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast.error("Erro ao buscar CEP. Tente novamente.");
        setStreet("");
        setNeighborhood("");
        setCity("");
        setState(undefined);
      }
    }
  };

  const handleAddDynamicContact = () => {
    setDynamicContacts(prev => [...prev, { id: `contact-${Date.now()}`, type: 'phone', value: '' }]);
  };

  const handleUpdateDynamicContact = (id: string, value: string) => {
    setDynamicContacts(prev => prev.map(contact => contact.id === id ? { ...contact, value } : contact));
  };

  const handleRemoveDynamicContact = (id: string) => {
    setDynamicContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const handleSaveClient = () => {
    // Validação básica para CPF/CNPJ
    if (clientType === "physical" && identificationNumber.replace(/\D/g, "").length !== 11) {
      toast.error("CPF inválido. Por favor, verifique o número.");
      return;
    }
    if (clientType === "legal" && identificationNumber.replace(/\D/g, "").length !== 14) {
      toast.error("CNPJ inválido. Por favor, verifique o número.");
      return;
    }

    // Aqui você implementaria a lógica para salvar o cliente
    // Por enquanto, apenas exibiremos um toast de sucesso
    toast.success("Cliente salvo com sucesso!");
    // Navegar de volta para a lista de clientes ou para a página de detalhes do cliente
    // navigate("/clients");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-[#1E293B] dark:text-gray-100 group">
                <FaUsers className="h-5 w-5 text-gray-500 dark:text-gray-400" /> Adicionar Responsável
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1 mb-4">
                Cadastre um novo responsável e suas informações.
              </p>
            </div>
          </div>
          <Link to="/clients">
            <Button variant="outline" className="rounded-md border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Clientes
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Painel &gt; <Link to="/clients" className="hover:text-blue-500 dark:hover:text-blue-400">Clientes</Link> &gt; Adicionar
        </p>
      </div>

      <div className="flex-1 p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-2">
            <TabsTrigger value="general" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">Geral</TabsTrigger>
            <TabsTrigger value="address" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">Endereço</TabsTrigger>
            <TabsTrigger value="extras" className="rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">Extras</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4 p-6 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo (Pessoa física/jurídica)*</Label>
                <Select defaultValue="physical" onValueChange={setClientType} value={clientType}>
                  <SelectTrigger id="type" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
                <Input id="fullName" placeholder="Nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidade*</Label>
                <Select defaultValue="brazilian" onValueChange={setNationality} value={nationality}>
                  <SelectTrigger id="nationality" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
                <Select onValueChange={setGender} value={gender}>
                  <SelectTrigger id="gender" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
                <Label htmlFor="identificationNumber">{clientType === "physical" ? "CPF" : "CNPJ"}</Label>
                <Input
                  id="identificationNumber"
                  placeholder={clientType === "physical" ? "999.999.999-99" : "99.999.999/9999-99"}
                  value={identificationNumber}
                  onChange={handleIdentificationChange}
                  maxLength={clientType === "physical" ? 14 : 18}
                  className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryIdentification">{clientType === "physical" ? "RG" : "Inscrição Estadual"}</Label>
                <Input
                  id="secondaryIdentification"
                  placeholder={clientType === "physical" ? "99.999.999-X" : "Inscrição Estadual"}
                  value={secondaryIdentification}
                  onChange={handleSecondaryIdentificationChange}
                  maxLength={clientType === "physical" ? 12 : undefined} // RG usually 12 chars with mask, IE varies
                  className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Aniversário</Label>
                <Input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession">Profissão</Label>
                <Input id="profession" placeholder="Profissão" value={profession} onChange={(e) => setProfession(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acceptEmail">Aceita Email?</Label>
                <Select defaultValue="yes" onValueChange={setAcceptEmail} value={acceptEmail}>
                  <SelectTrigger id="acceptEmail" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
                <Select defaultValue="yes" onValueChange={setAcceptWhatsapp} value={acceptWhatsapp}>
                  <SelectTrigger id="acceptWhatsapp" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
                <Select defaultValue="yes" onValueChange={setAcceptSMS} value={acceptSMS}>
                  <SelectTrigger id="acceptSMS" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
                <div className="space-y-2">
                  <Label htmlFor="mainEmailContact">Email Principal*</Label>
                  <Input id="mainEmailContact" type="email" placeholder="email@exemplo.com" value={mainEmailContact} onChange={(e) => setMainEmailContact(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
                </div>
                {dynamicContacts.map((contact, index) => (
                  <div key={contact.id} className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`dynamic-contact-${contact.id}`}>Telefone {index + 1}</Label>
                      <Input
                        id={`dynamic-contact-${contact.id}`}
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        value={contact.value}
                        onChange={(e) => handleUpdateDynamicContact(contact.id, e.target.value)}
                        className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDynamicContact(contact.id)} className="rounded-md hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors duration-200">
                      <FaTrashAlt className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddDynamicContact} className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                  <FaPlus className="mr-2 h-4 w-4" /> Adicionar Telefone
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { /* handle cancel logic */ }} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                <FaTimes className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleSaveClient} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                <FaSave className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="address" className="mt-4 p-6 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input id="zipCode" placeholder="99999-999" value={cep} onChange={handleCepChange} onBlur={fetchAddressByCep} maxLength={9} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Endereço</Label>
                <Input id="street" placeholder="Rua, Avenida, etc." value={street} onChange={(e) => setStreet(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input id="number" placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input id="complement" placeholder="Apartamento, Bloco, etc." value={complement} onChange={(e) => setComplement(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Select onValueChange={setState} value={state}>
                  <SelectTrigger id="state" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
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
              <Button variant="outline" onClick={() => { /* handle cancel logic */ }} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                <FaTimes className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleSaveClient} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                <FaSave className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="extras" className="mt-4 p-6 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea id="notes" placeholder="Adicione observações adicionais sobre o responsável..." rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { /* handle cancel logic */ }} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                <FaTimes className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleSaveClient} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                <FaSave className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AddClientPage;