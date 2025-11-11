import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FaArrowLeft, FaPlus, FaTimes, FaSave, FaUsers, FaTrashAlt, FaEdit } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Importar useParams
import { toast } from "sonner"; // Importar toast para mensagens
import { addMockClient, updateMockClient, mockClients } from "@/mockData/clients"; // Importar as funções para adicionar/atualizar cliente
import { Client, DynamicContact } from "@/types/client"; // Importar a interface Client

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

const applyPhoneMask = (value: string) => {
  value = value.replace(/\D/g, ""); // Remove non-digits
  if (value.length > 10) { // (XX) 9XXXX-XXXX
    value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (value.length > 6) { // (XX) XXXX-XXXX
    value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (value.length > 2) { // (XX) XXXX
    value = value.replace(/^(\d*)/, "($1) ");
  } else if (value.length > 0) { // (XX
    value = value.replace(/^(\d*)/, "($1");
  }
  return value;
};


const ClientFormPage = () => {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId?: string }>(); // Obter clientId da URL
  const isEditing = !!clientId;

  // Estados para os campos do formulário
  const [clientType, setClientType] = useState<Client['clientType']>("physical");
  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState<Client['nationality']>("brazilian");
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [identificationNumber, setIdentificationNumber] = useState(""); // CPF ou CNPJ
  const [secondaryIdentification, setSecondaryIdentification] = useState(""); // RG ou IE
  const [birthday, setBirthday] = useState("");
  const [profession, setProfession] = useState("");
  const [acceptEmail, setAcceptEmail] = useState<Client['acceptEmail']>("yes");
  const [acceptWhatsapp, setAcceptWhatsapp] = useState<Client['acceptWhatsapp']>("yes");
  const [acceptSMS, setAcceptSMS] = useState<Client['acceptSMS']>("yes");

  // Contatos fixos
  const [mainEmailContact, setMainEmailContact] = useState("");
  const [mainPhoneContact, setMainPhoneContact] = useState(""); // Novo campo para telefone principal

  // Contatos dinâmicos (para telefones adicionais)
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

  // Carregar dados do cliente se estiver em modo de edição
  useEffect(() => {
    if (isEditing && clientId) {
      const clientToEdit = mockClients.find(c => c.id === clientId);
      if (clientToEdit) {
        setClientType(clientToEdit.clientType);
        setFullName(clientToEdit.name);
        setNationality(clientToEdit.nationality);
        setGender(clientToEdit.gender);
        setIdentificationNumber(clientToEdit.identificationNumber);
        setSecondaryIdentification(clientToEdit.secondaryIdentification);
        setBirthday(clientToEdit.birthday);
        setProfession(clientToEdit.profession);
        setAcceptEmail(clientToEdit.acceptEmail);
        setAcceptWhatsapp(clientToEdit.acceptWhatsapp);
        setAcceptSMS(clientToEdit.acceptSMS);
        setMainEmailContact(clientToEdit.mainEmailContact);
        setMainPhoneContact(clientToEdit.mainPhoneContact);
        setDynamicContacts(clientToEdit.dynamicContacts || []);
        setCep(clientToEdit.address.cep);
        setStreet(clientToEdit.address.street);
        setNumber(clientToEdit.address.number);
        setComplement(clientToEdit.address.complement);
        setNeighborhood(clientToEdit.address.neighborhood);
        setCity(clientToEdit.address.city);
        setState(clientToEdit.address.state);
        setNotes(clientToEdit.notes);
      } else {
        toast.error("Cliente não encontrado para edição.");
        navigate("/clients");
      }
    }
  }, [isEditing, clientId, navigate]);

  // Resetar campos de identificação ao mudar o tipo de cliente
  useEffect(() => {
    if (!isEditing) { // Apenas reseta se não estiver editando
      setIdentificationNumber("");
      setSecondaryIdentification("");
    }
  }, [clientType, isEditing]);

  const handleIdentificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (clientType === "physical") {
      value = applyCpfMask(value);
    } else {
      value = applyCnpjMask(value);
    }
    setIdentificationNumber(value);
  };

  const handleIdentificationBlur = () => {
    const rawValue = identificationNumber.replace(/\D/g, "");
    if (clientType === "physical" && rawValue.length !== 11) {
      toast.error("CPF inválido. Por favor, verifique o número.");
    } else if (clientType === "legal" && rawValue.length !== 14) {
      toast.error("CNPJ inválido. Por favor, verifique o número.");
    }
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

  const handleMainPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = applyPhoneMask(e.target.value);
    setMainPhoneContact(value);
  };

  const handleDynamicPhoneChange = (id: string, value: string) => {
    const maskedValue = applyPhoneMask(value);
    setDynamicContacts(prev => prev.map(contact => contact.id === id ? { ...contact, value: maskedValue } : contact));
  };

  const handleAddDynamicContact = () => {
    setDynamicContacts(prev => [...prev, { id: `contact-${Date.now()}`, label: '', value: '' }]);
  };

  const handleUpdateDynamicContact = (id: string, field: keyof DynamicContact, value: string) => {
    setDynamicContacts(prev => prev.map(contact => contact.id === id ? { ...contact, [field]: value } : contact));
  };

  const handleRemoveDynamicContact = (id: string) => {
    setDynamicContacts(prev => prev.filter(contact => contact.id !== id));
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

  const handleSaveClient = () => {
    // Validação de campos obrigatórios
    if (!fullName.trim()) {
      toast.error("O campo 'Nome completo' é obrigatório.");
      return;
    }
    const rawIdentification = identificationNumber.replace(/\D/g, "");
    if (clientType === "physical" && rawIdentification.length !== 11) {
      toast.error("CPF inválido. Por favor, verifique o número.");
      return;
    }
    if (clientType === "legal" && rawIdentification.length !== 14) {
      toast.error("CNPJ inválido. Por favor, verifique o número.");
      return;
    }
    if (!mainEmailContact.trim()) {
      toast.error("O campo 'Email Principal' é obrigatório.");
      return;
    }
    if (!mainPhoneContact.replace(/\D/g, "").trim()) { // Validar telefone principal sem máscara
      toast.error("O campo 'Telefone Principal' é obrigatório.");
      return;
    }

    const clientData: Omit<Client, 'id' | 'animals'> = {
      name: fullName.trim(),
      clientType,
      nationality,
      gender: gender || '',
      identificationNumber,
      secondaryIdentification,
      birthday,
      profession,
      acceptEmail,
      acceptWhatsapp,
      acceptSMS,
      mainEmailContact,
      mainPhoneContact,
      dynamicContacts,
      address: {
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state: state || '',
      },
      notes,
    };

    if (isEditing && clientId) {
      const updated = updateMockClient({ ...clientData, id: clientId, animals: [] }); // Animals will be preserved by updateMockClient
      if (updated) {
        toast.success("Cliente atualizado com sucesso!");
        navigate(`/clients/${clientId}`);
      } else {
        toast.error("Erro ao atualizar cliente.");
      }
    } else {
      const newClient = addMockClient(clientData);
      toast.success("Cliente salvo com sucesso!");
      navigate(`/clients/${newClient.id}`); // Navegar para a página de detalhes do novo cliente
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4 sm:gap-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                {isEditing ? <FaEdit className="h-5 w-5 text-muted-foreground" /> : <FaUsers className="h-5 w-5 text-muted-foreground" />}
                {isEditing ? `Editar Responsável: ${fullName}` : "Adicionar Responsável"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {isEditing ? "Edite as informações do responsável." : "Cadastre um novo responsável e suas informações."}
              </p>
            </div>
          </div>
          <Link to={isEditing ? `/clients/${clientId}` : "/clients"}>
            <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; <Link to="/clients" className="hover:text-primary">Clientes</Link> &gt; {isEditing ? "Editar" : "Adicionar"}
        </p>
      </div>

      <div className="flex-1 p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card shadow-sm border border-border rounded-md p-2">
            <TabsTrigger value="general" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary">Geral</TabsTrigger>
            <TabsTrigger value="address" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary">Endereço</TabsTrigger>
            <TabsTrigger value="extras" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors duration-200 text-muted-foreground data-[state=active]:dark:bg-primary">Extras</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4 p-6 bg-card shadow-sm border border-border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-muted-foreground font-medium">Tipo (Pessoa física/jurídica)*</Label>
                <Select onValueChange={(value: Client['clientType']) => setClientType(value)} value={clientType}>
                  <SelectTrigger id="type" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Pessoa física</SelectItem>
                    <SelectItem value="legal">Pessoa jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-muted-foreground font-medium">Nome completo*</Label>
                <Input id="fullName" placeholder="Nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-muted-foreground font-medium">Nacionalidade*</Label>
                <Select onValueChange={(value: Client['nationality']) => setNationality(value)} value={nationality}>
                  <SelectTrigger id="nationality" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brazilian">Brasileira</SelectItem>
                    <SelectItem value="other">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-muted-foreground font-medium">Sexo</Label>
                <Select onValueChange={setGender} value={gender}>
                  <SelectTrigger id="gender" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
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
                  onBlur={handleIdentificationBlur}
                  maxLength={clientType === "physical" ? 14 : 18}
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
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
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-muted-foreground font-medium">Aniversário</Label>
                <Input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-muted-foreground font-medium">Profissão</Label>
                <Input id="profession" placeholder="Profissão" value={profession} onChange={(e) => setProfession(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acceptEmail" className="text-muted-foreground font-medium">Aceita Email?</Label>
                <Select onValueChange={(value: Client['acceptEmail']) => setAcceptEmail(value)} value={acceptEmail}>
                  <SelectTrigger id="acceptEmail" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="acceptWhatsapp" className="text-muted-foreground font-medium">Aceita WhatsApp?</Label>
                <Select onValueChange={(value: Client['acceptWhatsapp']) => setAcceptWhatsapp(value)} value={acceptWhatsapp}>
                  <SelectTrigger id="acceptWhatsapp" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Sim</SelectItem>
                    <SelectItem value="no">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="acceptSMS" className="text-muted-foreground font-medium">Aceita SMS?</Label>
                <Select onValueChange={(value: Client['acceptSMS']) => setAcceptSMS(value)} value={acceptSMS}>
                  <SelectTrigger id="acceptSMS" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
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
              <h2 className="text-xl font-semibold mb-4 text-foreground">Contatos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainEmailContact" className="text-muted-foreground font-medium">Email Principal*</Label>
                  <Input id="mainEmailContact" type="email" placeholder="email@exemplo.com" value={mainEmailContact} onChange={(e) => setMainEmailContact(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mainPhoneContact" className="text-muted-foreground font-medium">Telefone Principal*</Label>
                  <Input id="mainPhoneContact" type="tel" placeholder="(XX) XXXXX-XXXX" value={mainPhoneContact} onChange={handleMainPhoneChange} maxLength={15} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                </div>
              </div>
              <div className="space-y-4 mt-4">
                {dynamicContacts.map((contact, index) => (
                  <div key={contact.id} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`dynamic-contact-label-${contact.id}`} className="text-muted-foreground font-medium">Nome do Contato {index + 1}</Label>
                      <Input
                        id={`dynamic-contact-label-${contact.id}`}
                        placeholder="Ex: Mãe, Trabalho"
                        value={contact.label}
                        onChange={(e) => handleUpdateDynamicContact(contact.id, 'label', e.target.value)}
                        className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`dynamic-contact-value-${contact.id}`} className="text-muted-foreground font-medium">Telefone</Label>
                      <Input
                        id={`dynamic-contact-value-${contact.id}`}
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        value={contact.value}
                        onChange={(e) => handleDynamicPhoneChange(contact.id, e.target.value)}
                        maxLength={15}
                        className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDynamicContact(contact.id)} className="rounded-md hover:bg-muted hover:text-foreground transition-colors duration-200">
                      <FaTrashAlt className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddDynamicContact} className="w-full bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
                  <FaPlus className="mr-2 h-4 w-4" /> Adicionar Outro Telefone
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => navigate(isEditing ? `/clients/${clientId}` : "/clients")} className="bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
                <FaTimes className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleSaveClient} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                <FaSave className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="address" className="mt-4 p-6 bg-card shadow-sm border border-border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-muted-foreground font-medium">CEP</Label>
                <Input id="zipCode" placeholder="99999-999" value={cep} onChange={handleCepChange} onBlur={fetchAddressByCep} maxLength={9} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street" className="text-muted-foreground font-medium">Endereço</Label>
                <Input id="street" placeholder="Rua, Avenida, etc." value={street} onChange={(e) => setStreet(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number" className="text-muted-foreground font-medium">Número</Label>
                <Input id="number" placeholder="Número" value={number} onChange={(e) => setNumber(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complement" className="text-muted-foreground font-medium">Complemento</Label>
                <Input id="complement" placeholder="Apartamento, Bloco, etc." value={complement} onChange={(e) => setComplement(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood" className="text-muted-foreground font-medium">Bairro</Label>
                <Input id="neighborhood" placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-muted-foreground font-medium">Cidade</Label>
                <Input id="city" placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-muted-foreground font-medium">Estado</Label>
                <Select onValueChange={setState} value={state}>
                  <SelectTrigger id="state" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
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
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => navigate(isEditing ? `/clients/${clientId}` : "/clients")} className="bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
                <FaTimes className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleSaveClient} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                <FaSave className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="extras" className="mt-4 p-6 bg-card shadow-sm border border-border rounded-md">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-muted-foreground font-medium">Observações</Label>
              <Textarea id="notes" placeholder="Adicione observações adicionais sobre o responsável..." rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => navigate(isEditing ? `/clients/${clientId}` : "/clients")} className="bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
                <FaTimes className="mr-2 h-4 w-4" /> Cancelar
              </Button>
              <Button onClick={handleSaveClient} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
                <FaSave className="mr-2 h-4 w-4" /> Salvar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientFormPage;