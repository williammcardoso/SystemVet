import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaSave, FaCalendarAlt, FaFlask } from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast"; // Importar funções de toast
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Importar Card para envolver o formulário
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
interface HemogramReferenceValue {
  relative?: string;
  absolute?: string;
  full?: string; // For non-leukocyte fields
}

interface HemogramReference {
  dog: HemogramReferenceValue;
  cat: HemogramReferenceValue;
}

// Dados de referência para Hemograma (cão e gato)
const hemogramReferences: Record<string, HemogramReference> = {
  eritrocitos: { dog: { full: "5.5 - 8.5 milhões/mm3" }, cat: { full: "6.5 - 10.0 milhões/mm3" } },
  hemoglobina: { dog: { full: "12.0 - 18.0 g/dL" }, cat: { full: "9.0 - 15.0 g/dL" } },
  hematocrito: { dog: { full: "37 - 55 %" }, cat: { full: "30 - 45 %" } },
  vcm: { dog: { full: "60.0 - 77.0 fL" }, cat: { full: "39.0 - 55.0 fL" } },
  hcm: { dog: { full: "19.5 - 24.5 pg" }, cat: { full: "13.0 - 17.0 pg" } },
  chcm: { dog: { full: "31 - 35 %" }, cat: { full: "30 - 36 %" } },
  proteinaTotal: { dog: { full: "6.0 - 8.0 g/dL" }, cat: { full: "5.7 - 8.9 g/dL" } },
  hemaciasNucleadas: { dog: { full: "0" }, cat: { full: "0" } },

  leucocitosTotais: { dog: { full: "6.0 - 17.0 mil/µL" }, cat: { full: "5.5 - 19.5 mil/µL" } },
  mielocitos: {
    dog: { relative: "0 %", absolute: "0 /µL" },
    cat: { relative: "0 %", absolute: "0 /µL" }
  },
  metamielocitos: {
    dog: { relative: "0 %", absolute: "0 /µL" },
    cat: { relative: "0 %", absolute: "0 /µL" }
  },
  bastonetes: {
    dog: { relative: "0 - 3 %", absolute: "0 - 300 /µL" },
    cat: { relative: "0 - 3 %", absolute: "0 - 300 /µL" }
  },
  segmentados: {
    dog: { relative: "60 - 77 %", absolute: "3.000 - 11.500 /µL" },
    cat: { relative: "35 - 75 %", absolute: "2.500 - 12.500 /µL" }
  },
  eosinofilos: {
    dog: { relative: "2 - 10 %", absolute: "100 - 1.250 /µL" },
    cat: { relative: "2 - 12 %", absolute: "100 - 1.500 /µL" }
  },
  basofilos: {
    dog: { relative: "/ raros", absolute: "/ raros" },
    cat: { relative: "/ raros", absolute: "/ raros" }
  },
  linfocitos: {
    dog: { relative: "12 - 30 %", absolute: "1.000 - 4.800 /µL" },
    cat: { relative: "20 - 55 %", absolute: "1.500 - 7.000 /µL" }
  },
  monocitos: {
    dog: { relative: "3 - 10 %", absolute: "150 - 1.350 /µL" },
    cat: { relative: "1 - 4 %", absolute: "50 - 500 /µL" }
  },
  contagemPlaquetaria: { dog: { full: "166.000 - 575.000 /µL" }, cat: { full: "150.000 - 600.000 /µL" } },
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
  const [hcm, setHcm] = useState<string>("");
  const [chcm, setChcm] = useState<string>("");
  const [proteinaTotal, setProteinaTotal] = useState<string>("");
  const [hemaciasNucleadas, setHemaciasNucleadas] = useState<string>("");
  const [observacoesSerieVermelha, setObservacoesSerieVermelha] = useState<string>("");

  // Campos específicos para Leucograma
  const [leucocitosTotais, setLeucocitosTotais] = useState<string>(""); // Renomeado
  const [mielocitosRelativo, setMielocitosRelativo] = useState<string>("");
  const [mielocitosAbsoluto, setMielocitosAbsoluto] = useState<string>("");
  const [metamielocitosRelativo, setMetamielocitosRelativo] = useState<string>("");
  const [metamielocitosAbsoluto, setMetamielocitosAbsoluto] = useState<string>("");
  const [bastonetesRelativo, setBastonetesRelativo] = useState<string>("");
  const [bastonetesAbsoluto, setBastonetesAbsoluto] = useState<string>("");
  const [segmentadosRelativo, setSegmentadosRelativo] = useState<string>("");
  const [segmentadosAbsoluto, setSegmentadosAbsoluto] = useState<string>("");
  const [eosinofilosRelativo, setEosinofilosRelativo] = useState<string>("");
  const [eosinofilosAbsoluto, setEosinofilosAbsoluto] = useState<string>("");
  const [basofilosRelativo, setBasofilosRelativo] = useState<string>("");
  const [basofilosAbsoluto, setBasofilosAbsoluto] = useState<string>("");
  const [linfocitosRelativo, setLinfocitosRelativo] = useState<string>("");
  const [linfocitosAbsoluto, setLinfocitosAbsoluto] = useState<string>("");
  const [monocitosRelativo, setMonocitosRelativo] = useState<string>("");
  const [monocitosAbsoluto, setMonocitosAbsoluto] = useState<string>("");
  const [observacoesSerieBranca, setObservacoesSerieBranca] = useState<string>("");

  // Campos específicos para Plaquetas
  const [contagemPlaquetaria, setContagemPlaquetaria] = useState<string>("");
  const [avaliacaoPlaquetaria, setAvaliacaoPlaquetaria] = useState<string>("");

  // Campos adicionais do exame
  const [nota, setNota] = useState<string>("");
  const [laboratory, setLaboratory] = useState<string>("");
  const [laboratoryDate, setLaboratoryDate] = useState<string>("");
  const [observacoesGeraisExame, setObservacoesGeraisExame] = useState<string>("");
  const [liberadoPor, setLiberadoPor] = useState<string>("WILLIAM DE MORAES CARDOSO CRMV-SP 56895");

  const getReference = (param: string, type?: 'relative' | 'absolute' | 'full') => {
    if (!animalSpecies || !hemogramReferences[param]) return "N/A";

    const refData = hemogramReferences[param][animalSpecies];

    if (type === 'full' && refData.full) {
      return refData.full;
    } else if (type === 'relative' && refData.relative) {
      return refData.relative;
    } else if (type === 'absolute' && refData.absolute) {
      return refData.absolute;
    }
    return "N/A";
  };

  const handleSaveExam = () => {
    if (!examDate || !examType || !examVet) {
      showError("Por favor, preencha a data, tipo de exame e veterinário.");
      return;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

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
      leucocitosTotais: examType === "Hemograma Completo" ? leucocitosTotais : undefined,
      mielocitosRelativo: examType === "Hemograma Completo" ? mielocitosRelativo : undefined,
      mielocitosAbsoluto: examType === "Hemograma Completo" ? mielocitosAbsoluto : undefined,
      metamielocitosRelativo: examType === "Hemograma Completo" ? metamielocitosRelativo : undefined,
      metamielocitosAbsoluto: examType === "Hemograma Completo" ? metamielocitosAbsoluto : undefined,
      bastonetesRelativo: examType === "Hemograma Completo" ? bastonetesRelativo : undefined,
      bastonetesAbsoluto: examType === "Hemograma Completo" ? bastonetesAbsoluto : undefined,
      segmentadosRelativo: examType === "Hemograma Completo" ? segmentadosRelativo : undefined,
      segmentadosAbsoluto: examType === "Hemograma Completo" ? segmentadosAbsoluto : undefined,
      eosinofilosRelativo: examType === "Hemograma Completo" ? eosinofilosRelativo : undefined,
      eosinofilosAbsoluto: examType === "Hemograma Completo" ? eosinofilosAbsoluto : undefined,
      basofilosRelativo: examType === "Hemograma Completo" ? basofilosRelativo : undefined,
      basofilosAbsoluto: examType === "Hemograma Completo" ? basofilosAbsoluto : undefined,
      linfocitosRelativo: examType === "Hemograma Completo" ? linfocitosRelativo : undefined,
      linfocitosAbsoluto: examType === "Hemograma Completo" ? linfocitosAbsoluto : undefined,
      monocitosRelativo: examType === "Hemograma Completo" ? monocitosRelativo : undefined,
      monocitosAbsoluto: examType === "Hemograma Completo" ? monocitosAbsoluto : undefined,
      observacoesSerieBranca: examType === "Hemograma Completo" ? observacoesSerieBranca : undefined,
      contagemPlaquetaria: examType === "Hemograma Completo" ? contagemPlaquetaria : undefined,
      avaliacaoPlaquetaria: examType === "Hemograma Completo" ? avaliacaoPlaquetaria : undefined,
      nota,
      laboratory,
      laboratoryDate,
      observacoesGeraisExame,
      liberadoPor,
    });

    showSuccess("Exame salvo com sucesso!");
    navigate(`/clients/${clientId}/animals/${animalId}/record`); // Voltar para o prontuário
  };

  // Componente auxiliar para renderizar uma linha de campo com referência
  const ExamFieldWithReference = ({
    id,
    label,
    value,
    onChange,
    referenceKey,
    unit,
    placeholder = "",
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    referenceKey: string;
    unit: string;
    placeholder?: string;
  }) => (
    <div className="flex items-center gap-2">
      <Label htmlFor={id} className="w-[120px] text-left text-muted-foreground font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-[100px] bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
      />
      <span className="text-sm text-muted-foreground w-[80px] text-left">{unit}</span>
      <Label className="w-16 text-right text-muted-foreground font-medium">Ref:</Label>
      <span className="flex-1 text-sm text-foreground">{getReference(referenceKey, 'full')}</span>
    </div>
  );

  // Componente auxiliar para campos de leucócitos (relativo e absoluto)
  const LeukocyteFieldWithReference = ({
    idPrefix,
    label,
    relativeValue,
    onRelativeChange,
    absoluteValue,
    onAbsoluteChange,
    referenceKey,
  }: {
    idPrefix: string;
    label: string;
    relativeValue: string;
    onRelativeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    absoluteValue: string;
    onAbsoluteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    referenceKey: string;
  }) => (
    <div className="grid grid-cols-[120px_100px_30px_100px_30px_1fr] items-center gap-2">
      <Label className="text-left text-muted-foreground font-medium">{label}</Label>
      <Input id={`${idPrefix}-relative`} type="text" value={relativeValue} onChange={onRelativeChange} className="w-[100px] bg-input" />
      <span className="text-sm text-muted-foreground">%</span>
      <Input id={`${idPrefix}-absolute`} type="text" value={absoluteValue} onChange={onAbsoluteChange} className="w-[100px] bg-input" />
      <span className="text-sm text-muted-foreground">/µL</span>
      <Label className="w-16 text-right text-muted-foreground font-medium">Ref:</Label>
      <span className="flex-1 text-sm text-foreground">
        {getReference(referenceKey, 'relative')} / {getReference(referenceKey, 'absolute')}
      </span>
    </div>
  );


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
                  <Card className="bg-muted/50 shadow-sm border border-border rounded-md p-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <FaFlask className="h-5 w-5 text-primary" /> Eritrograma
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 pt-0">
                      <ExamFieldWithReference id="eritrocitos" label="Eritrócitos" value={eritrocitos} onChange={(e) => setEritrocitos(e.target.value)} referenceKey="eritrocitos" unit="milhões/mm3" />
                      <ExamFieldWithReference id="hemoglobina" label="Hemoglobina" value={hemoglobina} onChange={(e) => setHemoglobina(e.target.value)} referenceKey="hemoglobina" unit="g/dL" />
                      <ExamFieldWithReference id="hematocrito" label="Hematócrito" value={hematocrito} onChange={(e) => setHematocrito(e.target.value)} referenceKey="hematocrito" unit="%" />
                      <ExamFieldWithReference id="vcm" label="V.C.M." value={vcm} onChange={(e) => setVcm(e.target.value)} referenceKey="vcm" unit="fL" />
                      <ExamFieldWithReference id="hcm" label="H.C.M." value={hcm} onChange={(e) => setHcm(e.target.value)} referenceKey="hcm" unit="pg" />
                      <ExamFieldWithReference id="chcm" label="C.H.C.M." value={chcm} onChange={(e) => setChcm(e.target.value)} referenceKey="chcm" unit="%" />
                      <ExamFieldWithReference id="proteinaTotal" label="Proteína total" value={proteinaTotal} onChange={(e) => setProteinaTotal(e.target.value)} referenceKey="proteinaTotal" unit="g/dL" />
                      <ExamFieldWithReference id="hemaciasNucleadas" label="Hemácias nucleadas" value={hemaciasNucleadas} onChange={(e) => setHemaciasNucleadas(e.target.value)} referenceKey="hemaciasNucleadas" unit="" />

                      <div className="space-y-2 col-span-full">
                        <Label htmlFor="observacoesSerieVermelha" className="text-muted-foreground font-medium">Observações série vermelha</Label>
                        <Textarea id="observacoesSerieVermelha" placeholder="Observações sobre a série vermelha" value={observacoesSerieVermelha} onChange={(e) => setObservacoesSerieVermelha(e.target.value)} rows={2} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Leucograma Section */}
                  <Card className="bg-muted/50 shadow-sm border border-border rounded-md p-4">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                        <FaFlask className="h-5 w-5 text-primary" /> Leucograma
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 pt-0">
                      <ExamFieldWithReference id="leucocitosTotais" label="Leucócitos totais" value={leucocitosTotais} onChange={(e) => setLeucocitosTotais(e.target.value)} referenceKey="leucocitosTotais" unit="mil/µL" />
                      
                      <LeukocyteFieldWithReference idPrefix="mielocitos" label="Mielócitos" relativeValue={mielocitosRelativo} onRelativeChange={(e) => setMielocitosRelativo(e.target.value)} absoluteValue={mielocitosAbsoluto} onAbsoluteChange={(e) => setMielocitosAbsoluto(e.target.value)} referenceKey="mielocitos" />
                      <LeukocyteFieldWithReference idPrefix="metamielocitos" label="Metamielócitos" relativeValue={metamielocitosRelativo} onRelativeChange={(e) => setMetamielocitosRelativo(e.target.value)} absoluteValue={metamielocitosAbsoluto} onAbsoluteChange={(e) => setMetamielocitosAbsoluto(e.target.value)} referenceKey="metamielocitos" />
                      <LeukocyteFieldWithReference idPrefix="bastonetes" label="Bastonetes" relativeValue={bastonetesRelativo} onRelativeChange={(e) => setBastonetesRelativo(e.target.value)} absoluteValue={bastonetesAbsoluto} onAbsoluteChange={(e) => setBastonetesAbsoluto(e.target.value)} referenceKey="bastonetes" />
                      <LeukocyteFieldWithReference idPrefix="segmentados" label="Segmentados" relativeValue={segmentadosRelativo} onRelativeChange={(e) => setSegmentadosRelativo(e.target.value)} absoluteValue={segmentadosAbsoluto} onAbsoluteChange={(e) => setSegmentadosAbsoluto(e.target.value)} referenceKey="segmentados" />
                      <LeukocyteFieldWithReference idPrefix="eosinofilos" label="Eosinófilos" relativeValue={eosinofilosRelativo} onRelativeChange={(e) => setEosinofilosRelativo(e.target.value)} absoluteValue={eosinofilosAbsoluto} onAbsoluteChange={(e) => setEosinofilosAbsoluto(e.target.value)} referenceKey="eosinofilos" />
                      <LeukocyteFieldWithReference idPrefix="basofilos" label="Basófilos" relativeValue={basofilosRelativo} onRelativeChange={(e) => setBasofilosRelativo(e.target.value)} absoluteValue={basofilosAbsoluto} onAbsoluteChange={(e) => setBasofilosAbsoluto(e.target.value)} referenceKey="basofilos" />
                      <LeukocyteFieldWithReference idPrefix="linfocitos" label="Linfócitos" relativeValue={linfocitosRelativo} onRelativeChange={(e) => setLinfocitosRelativo(e.target.value)} absoluteValue={linfocitosAbsoluto} onAbsoluteChange={(e) => setLinfocitosAbsoluto(e.target.value)} referenceKey="linfocitos" />
                      <LeukocyteFieldWithReference idPrefix="monocitos" label="Monócitos" relativeValue={monocitosRelativo} onRelativeChange={(e) => setMonocitosRelativo(e.target.value)} absoluteValue={monocitosAbsoluto} onAbsoluteChange={(e) => setMonocitosAbsoluto(e.target.value)} referenceKey="monocitos" />

                      <div className="space-y-2 col-span-full">
                        <Label htmlFor="observacoesSerieBranca" className="text-muted-foreground font-medium">Observações série branca</Label>
                        <Textarea id="observacoesSerieBranca" placeholder="Observações sobre a série branca" value={observacoesSerieBranca} onChange={(e) => setObservacoesSerieBranca(e.target.value)} rows={2} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Plaquetas Section */}
                <Card className="bg-muted/50 shadow-sm border border-border rounded-md p-4 mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <FaFlask className="h-5 w-5 text-primary" /> Plaquetas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
                    <ExamFieldWithReference id="contagemPlaquetaria" label="Contagem plaquetária" value={contagemPlaquetaria} onChange={(e) => setContagemPlaquetaria(e.target.value)} referenceKey="contagemPlaquetaria" unit="/µL" />
                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="avaliacaoPlaquetaria" className="text-muted-foreground font-medium">Avaliação plaquetária</Label>
                      <Textarea id="avaliacaoPlaquetaria" placeholder="Avaliação qualitativa das plaquetas" value={avaliacaoPlaquetaria} onChange={(e) => setAvaliacaoPlaquetaria(e.target.value)} rows={2} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    </div>
                  </CardContent>
                </Card>

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
                  value={examResult}
                  onChange={(e) => setExamResult(e.target.value)}
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
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
            {/* Campos 'referenceTables' e 'conclusions' removidos */}
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