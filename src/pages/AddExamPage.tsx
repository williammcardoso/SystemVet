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
  hemacias: { dog: "5.5 - 8.5 (milhões/mm3)", cat: "6.5 - 10.0 (milhões/mm3)" },
  volumeGlobular: { dog: "37 - 55 %", cat: "30 - 45 %" },
  hemoglobina: { dog: "12.0 - 18.0 g/dL", cat: "9.0 - 15.0 g/dL" },
  vgm: { dog: "60.0 - 77.0 fL", cat: "39.0 - 55.0 fL" },
  chgm: { dog: "31 - 35 %", cat: "30 - 36 %" },
  plaquetas: { dog: "166.000 - 575.000 (mil/mm3)", cat: "150.000 - 600.000 (mil/mm3)" },
  proteinasTotais: { dog: "6.0 - 8.0 g/dL", cat: "5.7 - 8.9 g/dL" },
  hemaciasNucleadas: { dog: "0", cat: "0" }, // Geralmente 0 para animais saudáveis

  leucocitos: { dog: "6.0 - 17.0 (mil/mm3)", cat: "5.5 - 19.5 (mil/mm3)" },
  mielocitos: { dog: "0 - 0%", cat: "0 - 0%" },
  metamielocitos: { dog: "0 - 0%", cat: "0 - 0%" },
  bastoes: { dog: "0 - 3% / 0 - 300 mil/mm3", cat: "0 - 3% / 0 - 300 mil/mm3" },
  segmentados: { dog: "60 - 77% / 3.000 - 11.500 mil/mm3", cat: "35 - 75% / 2.500 - 12.500 mil/mm3" },
  linfocitos: { dog: "12 - 30% / 1.000 - 4.800 mil/mm3", cat: "20 - 55% / 1.500 - 7.000 mil/mm3" },
  monocitos: { dog: "3 - 10% / 150 - 1.350 mil/mm3", cat: "1 - 4% / 50 - 500 mil/mm3" },
  eosinofilos: { dog: "2 - 10% / 100 - 1.250 mil/mm3", cat: "2 - 12% / 100 - 1.500 mil/mm3" },
  basofilos: { dog: "/ raros", cat: "/ raros" },
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
  const [examResult, setExamResult] = useState<string>(""); // Para exames não-hemograma
  const [examVet, setExamVet] = useState<string | undefined>(undefined);

  // Campos específicos para Hemograma
  const [hemacias, setHemacias] = useState<string>("");
  const [volumeGlobular, setVolumeGlobular] = useState<string>("");
  const [hemoglobina, setHemoglobina] = useState<string>("");
  const [vgm, setVGM] = useState<string>("");
  const [chgm, setCHGM] = useState<string>("");
  const [plaquetas, setPlaquetas] = useState<string>("");
  const [proteinasTotais, setProteinasTotais] = useState<string>(""); // Novo campo
  const [hemaciasNucleadas, setHemaciasNucleadas] = useState<string>("");

  const [leucocitos, setLeucocitos] = useState<string>("");
  const [mielocitos, setMielocitos] = useState<string>(""); // Novo campo
  const [metamielocitos, setMetamielocitos] = useState<string>(""); // Novo campo
  const [bastoes, setBastoes] = useState<string>("");
  const [segmentados, setSegmentados] = useState<string>("");
  const [linfocitos, setLinfocitos] = useState<string>("");
  const [monocitos, setMonocitos] = useState<string>("");
  const [eosinofilos, setEosinofilos] = useState<string>("");
  const [basofilos, setBasofilos] = useState<string>("");

  // Campos adicionais do exame
  const [examObservations, setExamObservations] = useState<string>("");
  const [laboratory, setLaboratory] = useState<string>(""); // Novo campo
  const [laboratoryDate, setLaboratoryDate] = useState<string>(""); // Novo campo
  const [referenceTables, setReferenceTables] = useState<string>("");
  const [conclusions, setConclusions] = useState<string>("");

  const getReference = (param: string) => {
    if (!animalSpecies || !hemogramReferences[param]) return "N/A";
    return hemogramReferences[param][animalSpecies];
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
      time: currentTime, // Adicionado campo de hora
      examType,
      examVet,
      examResult: examType !== "Hemograma Completo" ? examResult : undefined,
      hemacias: examType === "Hemograma Completo" ? hemacias : undefined,
      volumeGlobular: examType === "Hemograma Completo" ? volumeGlobular : undefined,
      hemoglobina: examType === "Hemograma Completo" ? hemoglobina : undefined,
      vgm: examType === "Hemograma Completo" ? vgm : undefined,
      chgm: examType === "Hemograma Completo" ? chgm : undefined,
      plaquetas: examType === "Hemograma Completo" ? plaquetas : undefined,
      proteinasTotais: examType === "Hemograma Completo" ? proteinasTotais : undefined, // Novo campo
      hemaciasNucleadas: examType === "Hemograma Completo" ? hemaciasNucleadas : undefined,
      leucocitos: examType === "Hemograma Completo" ? leucocitos : undefined,
      mielocitos: examType === "Hemograma Completo" ? mielocitos : undefined, // Novo campo
      metamielocitos: examType === "Hemograma Completo" ? metamielocitos : undefined, // Novo campo
      bastoes: examType === "Hemograma Completo" ? bastoes : undefined,
      segmentados: examType === "Hemograma Completo" ? segmentados : undefined,
      linfocitos: examType === "Hemograma Completo" ? linfocitos : undefined,
      monocitos: examType === "Hemograma Completo" ? monocitos : undefined,
      eosinofilos: examType === "Hemograma Completo" ? eosinofilos : undefined,
      basofilos: examType === "Hemograma Completo" ? basofilos : undefined,
      examObservations,
      laboratory, // Novo campo
      laboratoryDate, // Novo campo
      referenceTables,
      conclusions,
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
                <h3 className="text-lg font-semibold mt-4 mb-2 flex items-center gap-2">
                  <FaFlask className="h-5 w-5 text-primary" /> Eritrograma
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="hemacias" className="w-32 text-right text-muted-foreground font-medium">Hemácias</Label>
                    <Input id="hemacias" type="number" placeholder="" value={hemacias} onChange={(e) => setHemacias(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">(milhões/mm3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('hemacias')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="volumeGlobular" className="w-32 text-right text-muted-foreground font-medium">Volume globular</Label>
                    <Input id="volumeGlobular" type="number" placeholder="" value={volumeGlobular} onChange={(e) => setVolumeGlobular(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('volumeGlobular')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="hemoglobina" className="w-32 text-right text-muted-foreground font-medium">Hemoglobina</Label>
                    <Input id="hemoglobina" type="number" placeholder="" value={hemoglobina} onChange={(e) => setHemoglobina(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">g/dL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('hemoglobina')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="vgm" className="w-32 text-right text-muted-foreground font-medium">VGM</Label>
                    <Input id="vgm" type="number" placeholder="" value={vgm} onChange={(e) => setVGM(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">fL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('vgm')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="chgm" className="w-32 text-right text-muted-foreground font-medium">CHGM</Label>
                    <Input id="chgm" type="number" placeholder="" value={chgm} onChange={(e) => setCHGM(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('chgm')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="plaquetas" className="w-32 text-right text-muted-foreground font-medium">Plaquetas</Label>
                    <Input id="plaquetas" type="number" placeholder="" value={plaquetas} onChange={(e) => setPlaquetas(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">(mil/mm3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('plaquetas')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="proteinasTotais" className="w-32 text-right text-muted-foreground font-medium">Proteínas totais</Label>
                    <Input id="proteinasTotais" type="number" placeholder="" value={proteinasTotais} onChange={(e) => setProteinasTotais(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">g/dL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('proteinasTotais')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="hemaciasNucleadas" className="w-32 text-right text-muted-foreground font-medium">Hemácias nucleadas</Label>
                    <Input id="hemaciasNucleadas" type="number" placeholder="" value={hemaciasNucleadas} onChange={(e) => setHemaciasNucleadas(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground"></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('hemaciasNucleadas')}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2">
                  <FaFlask className="h-5 w-5 text-primary" /> Leucograma
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="leucocitos" className="w-32 text-right text-muted-foreground font-medium">Leucócitos</Label>
                    <Input id="leucocitos" type="number" placeholder="" value={leucocitos} onChange={(e) => setLeucocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">(mil/mm3)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('leucocitos')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="mielocitos" className="w-32 text-right text-muted-foreground font-medium">Mielócitos</Label>
                    <Input id="mielocitos" type="number" placeholder="" value={mielocitos} onChange={(e) => setMielocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('mielocitos')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="metamielocitos" className="w-32 text-right text-muted-foreground font-medium">Metamielócitos</Label>
                    <Input id="metamielocitos" type="number" placeholder="" value={metamielocitos} onChange={(e) => setMetamielocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('metamielocitos')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="bastoes" className="w-32 text-right text-muted-foreground font-medium">Bastões</Label>
                    <Input id="bastoes" type="number" placeholder="" value={bastoes} onChange={(e) => setBastoes(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('bastoes')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="segmentados" className="w-32 text-right text-muted-foreground font-medium">Segmentados</Label>
                    <Input id="segmentados" type="number" placeholder="" value={segmentados} onChange={(e) => setSegmentados(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('segmentados')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="linfocitos" className="w-32 text-right text-muted-foreground font-medium">Linfócitos</Label>
                    <Input id="linfocitos" type="number" placeholder="" value={linfocitos} onChange={(e) => setLinfocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('linfocitos')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="monocitos" className="w-32 text-right text-muted-foreground font-medium">Monócitos</Label>
                    <Input id="monocitos" type="number" placeholder="" value={monocitos} onChange={(e) => setMonocitos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('monocitos')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="eosinofilos" className="w-32 text-right text-muted-foreground font-medium">Eosinófilos</Label>
                    <Input id="eosinofilos" type="number" placeholder="" value={eosinofilos} onChange={(e) => setEosinofilos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('eosinofilos')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="basofilos" className="w-32 text-right text-muted-foreground font-medium">Basófilos</Label>
                    <Input id="basofilos" type="number" placeholder="" value={basofilos} onChange={(e) => setBasofilos(e.target.value)} className="flex-1 bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="w-24 text-right text-muted-foreground font-medium">Referência:</Label>
                    <span className="flex-1 text-sm text-foreground">{getReference('basofilos')}</span>
                  </div>
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
              <Label htmlFor="examObservations">Observações</Label>
              <Textarea
                id="examObservations"
                placeholder="Observações gerais do exame"
                value={examObservations}
                onChange={(e) => setExamObservations(e.target.value)}
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
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
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