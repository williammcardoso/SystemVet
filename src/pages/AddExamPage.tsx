import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaSave, FaCalendarAlt, FaFlask } from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast"; // Importar funções de toast
import { Card, CardContent } from "@/components/ui/card"; // Importar Card para envolver o formulário
import { mockClients } from "@/mockData/clients"; // Importar mockClients para obter a espécie do animal

// Mock data para tipos de exame e veterinários (duplicado por enquanto, idealmente viria de um contexto ou API)
const mockExamTypes = [
  { id: "1", name: "Hemograma Completo" },
  { id: "2", name: "Exame de Fezes" },
  { id: "3", name: "Urinálise" },
  { id: "4", name: "Raio-X" },
];

const mockVets = [
  { id: "1", name: "Dr. Silva" },
  { id: "2", name: "Dra. Costa" },
  { id: "3", "name": "Dr. Souza" },
];

// Interface para os valores de referência do hemograma
interface HemogramReference {
  dog: string;
  cat: string;
}

// Dados de referência para Hemograma (cão e gato)
const hemogramReferences: Record<string, HemogramReference> = {
  eritrocitos: { dog: "5.5 - 8.5", cat: "6.5 - 10.0" }, // milhões/mm3
  hemoglobina: { dog: "12.0 - 18.0", cat: "9.0 - 15.0" }, // g/dL
  hematocrito: { dog: "37 - 55", cat: "30 - 45" }, // %
  vcm: { dog: "60.0 - 77.0", cat: "39.0 - 55.0" }, // fL
  hcm: { dog: "19.5 - 24.5", cat: "13.0 - 17.0" }, // pg
  chcm: { dog: "31 - 35", cat: "30 - 36" }, // %
  proteinaTotal: { dog: "6.0 - 8.0", cat: "5.7 - 8.9" }, // g/dL
  hemaciasNucleadas: { dog: "0", cat: "0" }, // Geralmente 0 para animais saudáveis

  leucocitos: { dog: "6.0 - 17.0", cat: "5.5 - 19.5" }, // mil/mm3
  mielocitos: { dog: "0", cat: "0" }, // %
  metamielocitos: { dog: "0", cat: "0" }, // %
  bastonetes: { dog: "0 - 3", cat: "0 - 3" }, // %
  segmentados: { dog: "60 - 77", cat: "35 - 75" }, // %
  eosinofilos: { dog: "2 - 10", cat: "2 - 12" }, // %
  basofilos: { dog: "/ raros", cat: "/ raros" }, // %
  linfocitos: { dog: "12 - 30", cat: "20 - 55" }, // %
  monocitos: { dog: "3 - 10", cat: "1 - 4" }, // %

  contagemPlaquetaria: { dog: "166.000 - 575.000", cat: "150.000 - 600.000" }, // mil/mm3
};

const AddExamPage = () => {
  const { clientId, animalId } = useParams<{ clientId: string; animalId: string }>();
  const navigate = useNavigate();

  const currentClient = mockClients.find(c => c.id === clientId);
  const currentAnimal = currentClient?.animals.find(a => a.id === animalId);
  const animalSpecies = currentAnimal?.species === "Canino" ? "dog" : currentAnimal?.species === "Felino" ? "cat" : undefined;

  // Estado do formulário
  const [examDate, setExamDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [examType, setExamType] = useState<string | undefined>(undefined);
  const [examVet, setExamVet] = useState<string | undefined>(undefined);

  // Novos campos gerais do exame
  const [material, setMaterial] = useState<string>("SANGUE COM E.D.T.A.");
  const [equipamento, setEquipamento] = useState<string>("");

  // Campos específicos para Eritrograma
  const [eritrocitos, setEritrocitos] = useState<string>("");
  const [hemoglobina, setHemoglobina] = useState<string>("");
  const [hematocrito, setHematocrito] = useState<string>("");
  const [vcm, setVcm] = useState<string>("");
  const [hcm, setHcm] = useState<string>(""); // Novo campo
  const [chcm, setChcm] = useState<string>("");
  const [proteinaTotal, setProteinaTotal] = useState<string>(""); // Renomeado
  const [hemaciasNucleadas, setHemaciasNucleadas] = useState<string>("");
  const [observacoesSerieVermelha, setObservacoesSerieVermelha] = useState<string>(""); // Novo campo

  // Campos específicos para Leucograma
  const [leucocitos, setLeucocitos] = useState<string>("");
  const [mielocitos, setMielocitos] = useState<string>("");
  const [metamielocitos, setMetamielocitos] = useState<string>("");
  const [bastonetes, setBastonetes] = useState<string>(""); // Renomeado
  const [segmentados, setSegmentados] = useState<string>("");
  const [eosinofilos, setEosinofilos] = useState<string>("");
  const [basofilos, setBasofilos] = useState<string>("");
  const [linfocitos, setLinfocitos] = useState<string>("");
  const [monocitos, setMonocitos] = useState<string>("");
  const [observacoesSerieBranca, setObservacoesSerieBranca] = useState<string>(""); // Novo campo

  // Campos específicos para Plaquetas
  const [contagemPlaquetaria, setContagemPlaquetaria] = useState<string>(""); // Renomeado
  const [avaliacaoPlaquetaria, setAvaliacaoPlaquetaria] = useState<string>(""); // Novo campo

  // Campos adicionais do exame
  const [nota, setNota] = useState<string>(""); // Novo campo
  const [laboratory, setLaboratory] = useState<string>("");
  const [laboratoryDate, setLaboratoryDate] = useState<string>("");
  const [observacoesGeraisExame, setObservacoesGeraisExame] = useState<string>(""); // Renomeado
  const [referenceTables, setReferenceTables] = useState<string>("");
  const [conclusions, setConclusions] = useState<string>("");
  const [liberadoPor, setLiberadoPor] = useState<string>("WILLIAM DE MORAES CARDOSO CRMV-SP 56895"); // Novo campo com valor padrão

  const getReference = (param: string, unit?: string) => {
    if (!animalSpecies || !hemogramReferences[param]) return "N/A";
    const refValue = hemogramReferences[param][animalSpecies];
    return unit ? `${refValue} ${unit}` : refValue;
  };

  const handleSaveExam = () => {
    if (!examDate || !examType || !examVet) {
      showError("Por favor, preencha a data, tipo de exame e veterinário.");
      return;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Aqui você faria a lógica para salvar o exame (enviar para uma API, etc.)
    // Por enquanto, apenas exibiremos um toast de sucesso.
    console.log("Salvando exame para Cliente:", clientId, "Animal:", animalId);
    console.log("Detalhes do exame:", {
      examDate,
      time: currentTime,
      examType,
      examVet,
      material,
      equipamento,
      eritrocitos: examType === "Hemograma Completo" ? eritrocitos : undefined,
      hemoglobina: examType === "Hemograma Completo" ? hemoglobina : undefined,
      hematocrito: examType === "Hemograma Completo" ? hematocrito : undefined,
      vcm: examType === "Hemograma Completo" ? vcm : undefined,
      hcm: examType === "Hemograma Completo" ? hcm : undefined,
      chcm: examType === "Hemograma Completo" ? chcm : undefined,
      proteinaTotal: examType === "Hemograma Completo" ? proteinaTotal : undefined,
      hemaciasNucleadas: examType === "Hemograma Completo" ? hemaciasNucleadas : undefined,
      observacoesSerieVermelha: examType === "Hemograma Completo" ? observacoesSerieVermelha : undefined,
      leucocitos: examType === "Hemograma Completo" ? leucocitos : undefined,
      mielocitos: examType === "Hemograma Completo" ? mielocitos : undefined,
      metamielocitos: examType === "Hemograma Completo" ? metamielocitos : undefined,
      bastonetes: examType === "Hemograma Completo" ? bastonetes : undefined,
      segmentados: examType === "Hemograma Completo" ? segmentados : undefined,
      eosinofilos: examType === "Hemograma Completo" ? eosinofilos : undefined,
      basofilos: examType === "Hemograma Completo" ? basofilos : undefined,
      linfocitos: examType === "Hemograma Completo" ? linfocitos : undefined,
      monocitos: examType === "Hemograma Completo" ? monocitos : undefined,
      observacoesSerieBranca: examType === "Hemograma Completo" ? observacoesSerieBranca : undefined,
      contagemPlaquetaria: examType === "Hemograma Completo" ? contagemPlaquetaria : undefined,
      avaliacaoPlaquetaria: examType === "Hemograma Completo" ? avaliacaoPlaquetaria : undefined,
      nota,
      laboratory,
      laboratoryDate,
      observacoesGeraisExame,
      referenceTables,
      conclusions,
      liberadoPor,
    });

    showSuccess("Exame salvo com sucesso!");
    navigate(`/clients/${clientId}/animals/${animalId}/record`); // Voltar para o prontuário
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header da Página com Gradiente e Breadcrumb */}
      <div className="bg-gradient-to-r from-background via-card to-background p-6 pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4 sm:gap-2">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-foreground group">
                <FaFlask className="h-5 w-5 text-muted-foreground" /> Adicionar Exame
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Registre um novo exame para o animal.
              </p>
            </div>
          </div>
          <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
            <Button variant="outline" className="rounded-md border-border text-foreground hover:bg-muted hover:text-foreground transition-colors duration-200">
              <FaArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuário
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Painel &gt; Clientes &gt; Animal &gt; Prontuário &gt; Adicionar Exame
        </p>
      </div>

      <div className="flex-1 p-6">
        <Card className="shadow-sm border border-border rounded-md">
          <CardContent className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Data do Exame</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examType">Tipo de Exame</Label>
                <Select onValueChange={setExamType} value={examType}>
                  <SelectTrigger id="examType" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                    <SelectValue placeholder="Selecione o tipo de exame" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockExamTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examVet">Veterinário Solicitante</Label>
                <Select onValueChange={setExamVet} value={examVet}>
                  <SelectTrigger id="examVet" className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200">
                    <SelectValue placeholder="Selecione o veterinário" />
                  </SelectTrigger>
                    <SelectContent>
                    {mockVets.map((vet) => (
                      <SelectItem key={vet.id} value={vet.name}>
                        {vet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {examType === "Hemograma Completo" ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input id="material" value={material} onChange={(e) => setMaterial(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipamento">Equipamento</Label>
                    <Input id="equipamento" value={equipamento} onChange={(e) => setEquipamento(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* Eritrograma Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaFlask className="h-5 w-5 text-primary" /> Eritrograma
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="eritrocitos" className="w-32 text-right text-muted-foreground font-medium">Eritrócitos</Label>
                        <Input id="eritrocitos" type="number" placeholder="" value={eritrocitos} onChange={(e) => setEritrocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">(milhões/mm3)</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('eritrocitos')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="hemoglobina" className="w-32 text-right text-muted-foreground font-medium">Hemoglobina</Label>
                        <Input id="hemoglobina" type="number" placeholder="" value={hemoglobina} onChange={(e) => setHemoglobina(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">g/dL</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('hemoglobina')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="hematocrito" className="w-32 text-right text-muted-foreground font-medium">Hematócrito</Label>
                        <Input id="hematocrito" type="number" placeholder="" value={hematocrito} onChange={(e) => setHematocrito(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('hematocrito')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="vcm" className="w-32 text-right text-muted-foreground font-medium">V.C.M.</Label>
                        <Input id="vcm" type="number" placeholder="" value={vcm} onChange={(e) => setVcm(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">fL</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('vcm')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="hcm" className="w-32 text-right text-muted-foreground font-medium">H.C.M.</Label>
                        <Input id="hcm" type="number" placeholder="" value={hcm} onChange={(e) => setHcm(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">pg</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('hcm')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="chcm" className="w-32 text-right text-muted-foreground font-medium">C.H.C.M.</Label>
                        <Input id="chcm" type="number" placeholder="" value={chcm} onChange={(e) => setChcm(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('chcm')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="proteinaTotal" className="w-32 text-right text-muted-foreground font-medium">Proteína total</Label>
                        <Input id="proteinaTotal" type="number" placeholder="" value={proteinaTotal} onChange={(e) => setProteinaTotal(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">g/dL</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('proteinaTotal')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="hemaciasNucleadas" className="w-32 text-right text-muted-foreground font-medium">Hemácias nucleadas</Label>
                        <Input id="hemaciasNucleadas" type="number" placeholder="" value={hemaciasNucleadas} onChange={(e) => setHemaciasNucleadas(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground"></span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('hemaciasNucleadas')}</span>
                      </div>

                      <div className="space-y-2 col-span-full">
                        <Label htmlFor="observacoesSerieVermelha" className="text-muted-foreground font-medium">Observações série vermelha</Label>
                        <Textarea id="observacoesSerieVermelha" placeholder="Observações sobre a série vermelha" value={observacoesSerieVermelha} onChange={(e) => setObservacoesSerieVermelha(e.target.value)} rows={2} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                      </div>
                    </div>
                  </div>

                  {/* Leucograma Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaFlask className="h-5 w-5 text-primary" /> Leucograma
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="leucocitos" className="w-32 text-right text-muted-foreground font-medium">Leucócitos</Label>
                        <Input id="leucocitos" type="number" placeholder="" value={leucocitos} onChange={(e) => setLeucocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">(mil/mm3)</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('leucocitos')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="mielocitos" className="w-32 text-right text-muted-foreground font-medium">Mielócitos</Label>
                        <Input id="mielocitos" type="number" placeholder="" value={mielocitos} onChange={(e) => setMielocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('mielocitos')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="metamielocitos" className="w-32 text-right text-muted-foreground font-medium">Metamielócitos</Label>
                        <Input id="metamielocitos" type="number" placeholder="" value={metamielocitos} onChange={(e) => setMetamielocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('metamielocitos')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="bastonetes" className="w-32 text-right text-muted-foreground font-medium">Bastonetes</Label>
                        <Input id="bastonetes" type="number" placeholder="" value={bastonetes} onChange={(e) => setBastonetes(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('bastonetes')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="segmentados" className="w-32 text-right text-muted-foreground font-medium">Segmentados</Label>
                        <Input id="segmentados" type="number" placeholder="" value={segmentados} onChange={(e) => setSegmentados(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('segmentados')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="eosinofilos" className="w-32 text-right text-muted-foreground font-medium">Eosinófilos</Label>
                        <Input id="eosinofilos" type="number" placeholder="" value={eosinofilos} onChange={(e) => setEosinofilos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('eosinofilos')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="basofilos" className="w-32 text-right text-muted-foreground font-medium">Basófilos</Label>
                        <Input id="basofilos" type="number" placeholder="" value={basofilos} onChange={(e) => setBasofilos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('basofilos')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="linfocitos" className="w-32 text-right text-muted-foreground font-medium">Linfócitos</Label>
                        <Input id="linfocitos" type="number" placeholder="" value={linfocitos} onChange={(e) => setLinfocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('linfocitos')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor="monocitos" className="w-32 text-right text-muted-foreground font-medium">Monócitos</Label>
                        <Input id="monocitos" type="number" placeholder="" value={monocitos} onChange={(e) => setMonocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                        <span className="text-sm text-muted-foreground">%</span>
                        <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                        <span className="flex-1 text-sm text-foreground">{getReference('monocitos')}</span>
                      </div>

                      <div className="space-y-2 col-span-full">
                        <Label htmlFor="observacoesSerieBranca" className="text-muted-foreground font-medium">Observações série branca</Label>
                        <Textarea id="observacoesSerieBranca" placeholder="Observações sobre a série branca" value={observacoesSerieBranca} onChange={(e) => setObservacoesSerieBranca(e.target.value)} rows={2} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plaquetas Section */}
                <h3 className="text-lg font-semibold mt-6 mb-4 flex items-center gap-2">
                  <FaFlask className="h-5 w-5 text-primary" /> Plaquetas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="contagemPlaquetaria" className="w-32 text-right text-muted-foreground font-medium">Contagem plaquetária</Label>
                    <Input id="contagemPlaquetaria" type="number" placeholder="" value={contagemPlaquetaria} onChange={(e) => setContagemPlaquetaria(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">(mil/mm3)</span>
                    <Label className="w-24 text-right text-muted-foreground font-medium">Ref:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('contagemPlaquetaria')}</span>
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor="avaliacaoPlaquetaria" className="text-muted-foreground font-medium">Avaliação plaquetária</Label>
                    <Textarea id="avaliacaoPlaquetaria" placeholder="Avaliação qualitativa das plaquetas" value={avaliacaoPlaquetaria} onChange={(e) => setAvaliacaoPlaquetaria(e.target.value)} rows={2} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                </div>

                {/* Campo Nota */}
                <div className="space-y-2 col-span-full mt-6">
                  <Label htmlFor="nota" className="text-muted-foreground font-medium">Nota</Label>
                  <Textarea
                    id="nota"
                    placeholder="Adicione observações sobre as alterações do exame"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    rows={3}
                    className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2 col-span-full">
                <Label htmlFor="examResult">Resultado</Label>
                <Input
                  id="examResult"
                  placeholder="Resultado do exame"
                  value={""} // Removido o estado examResult para não-hemograma, pois o foco é no hemograma
                  onChange={(e) => {}} // Não faz nada, pois não é editável aqui
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                  disabled // Desabilitado para focar no hemograma
                />
              </div>
            )}

            <div className="space-y-2 col-span-full mt-4">
              <Label htmlFor="observacoesGeraisExame">Observações</Label>
              <Textarea
                id="observacoesGeraisExame"
                placeholder="Observações gerais do exame"
                value={observacoesGeraisExame}
                onChange={(e) => setObservacoesGeraisExame(e.target.value)}
                rows={3}
                className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="laboratory">Laboratório</Label>
                <Input
                  id="laboratory"
                  placeholder="Nome do laboratório"
                  value={laboratory}
                  onChange={(e) => setLaboratory(e.target.value)}
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laboratoryDate">Data do Resultado</Label>
                <Input
                  id="laboratoryDate"
                  type="date"
                  value={laboratoryDate}
                  onChange={(e) => setLaboratoryDate(e.target.value)}
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                />
              </div>
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="referenceTables">Tabelas de referência</Label>
              <Textarea
                id="referenceTables"
                placeholder="Tabelas de referência"
                value={referenceTables}
                onChange={(e) => setReferenceTables(e.target.value)}
                rows={3}
                className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="conclusions">Conclusões</Label>
              <Textarea
                id="conclusions"
                placeholder="Conclusões do exame"
                value={conclusions}
                onChange={(e) => setConclusions(e.target.value)}
                rows={5}
                className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
              />
            </div>
            <div className="space-y-2 col-span-full">
              <Label htmlFor="liberadoPor">Liberado por</Label>
              <Input
                id="liberadoPor"
                value={liberadoPor}
                onChange={(e) => setLiberadoPor(e.target.value)}
                className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Link to={`/clients/${clientId}/animals/${animalId}/record`}>
            <Button variant="outline" className="w-full sm:w-auto bg-card border border-border text-foreground hover:bg-muted rounded-md transition-all duration-200 shadow-sm hover:shadow-md">
              <FaTimes className="mr-2 h-4 w-4" /> Cancelar
            </Button>
          </Link>
          <Button onClick={handleSaveExam} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
            <FaSave className="mr-2 h-4 w-4" /> Salvar Exame
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddExamPage;