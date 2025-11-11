import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTimes, FaSave, FaCalendarAlt } from "react-icons/fa"; // Importar ícones de react-icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast"; // Importar funções de toast
import { Card, CardContent } from "@/components/ui/card"; // Importar Card para envolver o formulário

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

const AddExamPage = () => {
  const { clientId, animalId } = useParams<{ clientId: string; animalId: string }>();
  const navigate = useNavigate();

  // Estado do formulário
  const [examDate, setExamDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [examType, setExamType] = useState<string | undefined>(undefined);
  const [examResult, setExamResult] = useState<string>("");
  const [examVet, setExamVet] = useState<string | undefined>(undefined);

  // Campos específicos para Hemograma
  const [hemacias, setHemacias] = useState<string>("");
  const [volumeGlobular, setVolumeGlobular] = useState<string>("");
  const [hemoglobina, setHemoglobina] = useState<string>("");
  const [vgm, setVGM] = useState<string>("");
  const [chgm, setCHGM] = useState<string>("");
  const [plaquetas, setPlaquetas] = useState<string>("");
  const [formasTotais, setFormasTotais] = useState<string>("");
  const [hemaciasNucleadas, setHemaciasNucleadas] = useState<string>("");

  const [leucocitos, setLeucocitos] = useState<string>("");
  const [bastoes, setBastoes] = useState<string>("");
  const [segmentados, setSegmentados] = useState<string>("");
  const [linfocitos, setLinfocitos] = useState<string>("");
  const [monocitos, setMonocitos] = useState<string>("");
  const [eosinofilos, setEosinofilos] = useState<string>("");
  const [basofilos, setBasofilos] = useState<string>("");

  // Campos adicionais do exame
  const [examObservations, setExamObservations] = useState<string>("");
  const [operator, setOperator] = useState<string>("");
  const [referenceDate, setReferenceDate] = useState<string>("");
  const [referenceTables, setReferenceTables] = useState<string>("");
  const [conclusions, setConclusions] = useState<string>("");

  const handleSaveExam = () => {
    if (!examDate || !examType || !examVet) {
      showError("Por favor, preencha a data, tipo de exame e veterinário.");
      return;
    }

    // Aqui você faria a lógica para salvar o exame (enviar para uma API, etc.)
    // Por enquanto, apenas exibiremos um toast de sucesso.
    console.log("Salvando exame para Cliente:", clientId, "Animal:", animalId);
    console.log("Detalhes do exame:", {
      examDate,
      examType,
      examVet,
      examResult: examType !== "Hemograma Completo" ? examResult : undefined,
      hemacias: examType === "Hemograma Completo" ? hemacias : undefined,
      volumeGlobular: examType === "Hemograma Completo" ? volumeGlobular : undefined,
      hemoglobina: examType === "Hemograma Completo" ? hemoglobina : undefined,
      vgm: examType === "Hemograma Completo" ? vgm : undefined,
      chgm: examType === "Hemograma Completo" ? chgm : undefined,
      plaquetas: examType === "Hemograma Completo" ? plaquetas : undefined,
      formasTotais: examType === "Hemograma Completo" ? formasTotais : undefined,
      hemaciasNucleadas: examType === "Hemograma Completo" ? hemaciasNucleadas : undefined,
      leucocitos: examType === "Hemograma Completo" ? leucocitos : undefined,
      bastoes: examType === "Hemograma Completo" ? bastoes : undefined,
      segmentados: examType === "Hemograma Completo" ? segmentados : undefined,
      linfocitos: examType === "Hemograma Completo" ? linfocitos : undefined,
      monocitos: examType === "Hemograma Completo" ? monocitos : undefined,
      eosinofilos: examType === "Hemograma Completo" ? eosinofilos : undefined,
      basofilos: examType === "Hemograma Completo" ? basofilos : undefined,
      examObservations,
      operator,
      referenceDate,
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
                <FaCalendarAlt className="h-5 w-5 text-muted-foreground" /> Adicionar Exame
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
                <Label htmlFor="examDate">Data</Label>
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
                <Label htmlFor="examVet">Veterinário</Label>
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
                <h3 className="text-lg font-semibold mt-4 mb-2">Eritrograma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hemacias">Hemácias (m/mm3)</Label>
                    <Input id="hemacias" type="number" placeholder="Ex: 5.5" value={hemacias} onChange={(e) => setHemacias(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volumeGlobular">Volume globular (%)</Label>
                    <Input id="volumeGlobular" type="number" placeholder="Ex: 37" value={volumeGlobular} onChange={(e) => setVolumeGlobular(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hemoglobina">Hemoglobina (g/dL)</Label>
                    <Input id="hemoglobina" type="number" placeholder="Ex: 12.0" value={hemoglobina} onChange={(e) => setHemoglobina(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vgm">VGM (fL)</Label>
                    <Input id="vgm" type="number" placeholder="Ex: 60.0" value={vgm} onChange={(e) => setVGM(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chgm">CHGM (%)</Label>
                    <Input id="chgm" type="number" placeholder="Ex: 31" value={chgm} onChange={(e) => setCHGM(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plaquetas">Plaquetas (m/mm3)</Label>
                    <Input id="plaquetas" type="number" placeholder="Ex: 300" value={plaquetas} onChange={(e) => setPlaquetas(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formasTotais">Formas totais (m/mm3)</Label>
                    <Input id="formasTotais" type="number" placeholder="Ex: 6.0" value={formasTotais} onChange={(e) => setFormasTotais(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hemaciasNucleadas">Hemácias nucleadas (g/dL)</Label>
                    <Input id="hemaciasNucleadas" type="number" placeholder="Ex: 0" value={hemaciasNucleadas} onChange={(e) => setHemaciasNucleadas(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold mt-4 mb-2">Leucograma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leucocitos">Leucócitos (m/mm3)</Label>
                    <Input id="leucocitos" type="number" placeholder="Ex: 6.0" value={leucocitos} onChange={(e) => setLeucocitos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bastoes">Bastões (%)</Label>
                    <Input id="bastoes" type="number" placeholder="Ex: 0" value={bastoes} onChange={(e) => setBastoes(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segmentados">Segmentados (%)</Label>
                    <Input id="segmentados" type="number" placeholder="Ex: 60" value={segmentados} onChange={(e) => setSegmentados(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linfocitos">Linfócitos (%)</Label>
                    <Input id="linfocitos" type="number" placeholder="Ex: 30" value={linfocitos} onChange={(e) => setLinfocitos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monocitos">Monócitos (%)</Label>
                    <Input id="monocitos" type="number" placeholder="Ex: 3" value={monocitos} onChange={(e) => setMonocitos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eosinofilos">Eosinófilos (%)</Label>
                    <Input id="eosinofilos" type="number" placeholder="Ex: 2" value={eosinofilos} onChange={(e) => setEosinofilos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basofilos">Basófilos (%)</Label>
                    <Input id="basofilos" type="number" placeholder="Ex: 1" value={basofilos} onChange={(e) => setBasofilos(e.target.value)} className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200" />
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
                <Label htmlFor="operator">Operador</Label>
                <Input
                  id="operator"
                  placeholder="Nome do operador"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="bg-input rounded-md border-border focus:ring-2 focus:ring-ring placeholder-muted-foreground transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referenceDate">Data de Referência</Label>
                <Input
                  id="referenceDate"
                  type="date"
                  value={referenceDate}
                  onChange={(e) => setReferenceDate(e.target.value)}
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
                onChange={(e) => setConclusiones(e.target.value)}
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