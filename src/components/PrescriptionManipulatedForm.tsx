"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaPlus, FaFlask, FaPills, FaVial, FaFileMedical, FaInfoCircle } from "react-icons/fa";
import {
  ManipulatedFormulaComponent,
  ManipulatedVehicleExcipient,
  ManipulatedPosology,
  ManipulatedPosologyAutomatic,
  ManipulatedPosologyFreeText,
  ManipulatedProductDetails,
  ManipulatedPrescriptionData,
} from "@/types/medication";
import ManipulatedFormulaComponentForm from "./ManipulatedFormulaComponentForm";
import { toast } from "sonner";

interface PrescriptionManipulatedFormProps {
  initialData?: ManipulatedPrescriptionData;
  onSave: (data: ManipulatedPrescriptionData) => void;
}

const mockVehicleTypes = ["Bastão", "Cápsula", "Comprimido", "Creme", "Drágea", "Gel", "Gotas", "Líquido", "Pó", "Dose", "Outro"];
const mockVehicleUnits = ["%", "Grama (g)", "Micrograma (mcg)", "Miligrama (mg)", "Mililitro (mL)", "UFC", "UFC/g", "UFC/kg", "Unidade"];

const mockPosologyMeasures = ["Comprimido", "Cápsula", "Líquido (ml)", "Gotas", "Aplicação", "Spray", "Pomada", "Outro"];
const mockPosologyFrequencies = ["1", "2", "3", "4", "6", "8", "12", "24"]; // Valores numéricos
const mockPosologyFrequencyUnits = ["Hora(s)", "Dia(s)"];
const mockPosologyDurations = ["1", "3", "5", "7", "10", "14", "21", "30"]; // Valores numéricos
const mockPosologyDurationUnits = ["Dia(s)", "Mês(es)"];

// Removidos: mockProductTypes, mockProductQuantities, mockProductPharmacies
const mockProductRoutes = ["Oral", "Tópica", "Injetável", "Oftálmica", "Auricular", "Outra"];


const PrescriptionManipulatedForm: React.FC<PrescriptionManipulatedFormProps> = ({
  initialData,
  onSave,
}) => {
  const [formulaComponents, setFormulaComponents] = useState<ManipulatedFormulaComponent[]>(
    initialData?.formulaComponents || [{ id: `comp-${Date.now()}`, name: "", dosageQuantity: "", dosageUnit: "" }]
  );
  const [vehicleExcipient, setVehicleExcipient] = useState<ManipulatedVehicleExcipient>(
    initialData?.vehicleExcipient || { type: "", quantity: "", unit: "" }
  );
  const [customVehicleType, setCustomVehicleType] = useState<string>(initialData?.vehicleExcipient?.type === "Outro" ? initialData.vehicleExcipient.type : "");
  const [posologyType, setPosologyType] = useState<'automatic' | 'freeText'>(
    initialData?.posology.type || 'automatic'
  );
  const [posologyAutomatic, setPosologyAutomatic] = useState<ManipulatedPosologyAutomatic>(
    (initialData?.posology.type === 'automatic' ? initialData.posology.data : {
      dosage: "", measure: "", frequencyValue: "", frequencyUnit: "", durationValue: "", durationUnit: "", finalDescription: ""
    })
  );
  const [posologyFreeText, setPosologyFreeText] = useState<ManipulatedPosologyFreeText>(
    (initialData?.posology.type === 'freeText' ? initialData.posology.data : { finalDescription: "" })
  );
  const [productDetails, setProductDetails] = useState<ManipulatedProductDetails>(
    initialData?.productDetails || { productType: "", quantity: "", pharmacy: "", route: "" }
  );
  const [generalObservations, setGeneralObservations] = useState<string>(initialData?.generalObservations || "");

  // Sincronizar customVehicleType quando vehicleExcipient.type muda
  useEffect(() => {
    if (vehicleExcipient.type !== "Outro") {
      setCustomVehicleType("");
    } else if (initialData?.vehicleExcipient?.type === "Outro") {
      setCustomVehicleType(initialData.vehicleExcipient.type);
    }
  }, [vehicleExcipient.type, initialData]);


  // Auto-generate final description for automatic posology
  useEffect(() => {
    const { dosage, measure, frequencyValue, frequencyUnit, durationValue, durationUnit } = posologyAutomatic;
    let description = "";

    const doseText = dosage.trim();
    const measureText = measure.trim().toLowerCase();
    const freqVal = frequencyValue.trim();
    const freqUnit = frequencyUnit.trim().toLowerCase();
    const durVal = durationValue.trim();
    const durUnit = durationUnit.trim().toLowerCase();

    if (doseText && measureText && freqVal && freqUnit && durVal && durUnit) {
      description = `Dar ${doseText} ${measureText}(s) a cada ${freqVal} ${freqUnit}, durante ${durVal} ${durUnit}.`;
    } else if (doseText && measureText && freqVal && freqUnit) {
      description = `Dar ${doseText} ${measureText}(s) a cada ${freqVal} ${freqUnit}.`;
    } else if (doseText && measureText) {
      description = `Dar ${doseText} ${measureText}(s).`;
    } else if (doseText) {
      description = `Dar ${doseText}.`;
    }
    setPosologyAutomatic(prev => ({ ...prev, finalDescription: description }));
  }, [posologyAutomatic.dosage, posologyAutomatic.measure, posologyAutomatic.frequencyValue, posologyAutomatic.frequencyUnit, posologyAutomatic.durationValue, posologyAutomatic.durationUnit]);


  const handleAddComponent = () => {
    setFormulaComponents((prev) => [
      ...prev,
      { id: `comp-${Date.now()}`, name: "", dosageQuantity: "", dosageUnit: "" },
    ]);
  };

  const handleUpdateComponent = (id: string, updatedComponent: Partial<ManipulatedFormulaComponent>) => {
    setFormulaComponents((prev) =>
      prev.map((comp) => (comp.id === id ? { ...comp, ...updatedComponent } : comp))
    );
  };

  const handleDeleteComponent = (id: string) => {
    setFormulaComponents((prev) => prev.filter((comp) => comp.id !== id));
  };

  const handleSave = () => {
    // Basic validation
    if (formulaComponents.some(comp => !comp.name.trim() || !comp.dosageQuantity.trim() || !comp.dosageUnit.trim())) {
      toast.error("Por favor, preencha todos os campos obrigatórios dos componentes da fórmula.");
      return;
    }
    
    const finalVehicleType = vehicleExcipient.type === "Outro" ? customVehicleType.trim() : vehicleExcipient.type.trim();
    if (!finalVehicleType || !vehicleExcipient.quantity.trim() || !vehicleExcipient.unit.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios do veículo/excipiente.");
      return;
    }

    if (posologyType === 'automatic' && (!posologyAutomatic.dosage.trim() || !posologyAutomatic.measure.trim() || !posologyAutomatic.frequencyValue.trim() || !posologyAutomatic.frequencyUnit.trim() || !posologyAutomatic.durationValue.trim() || !posologyAutomatic.durationUnit.trim())) {
      toast.error("Por favor, preencha todos os campos obrigatórios da posologia automática.");
      return;
    }
    if (posologyType === 'freeText' && !posologyFreeText.finalDescription.trim()) {
      toast.error("Por favor, preencha a descrição final da posologia em texto livre.");
      return;
    }
    // Validação para o campo 'Via' que é o único restante em productDetails
    if (!productDetails.route.trim()) {
      toast.error("Por favor, preencha o campo 'Via' dos detalhes do produto.");
      return;
    }

    const dataToSave: ManipulatedPrescriptionData = {
      formulaComponents,
      vehicleExcipient: {
        type: finalVehicleType,
        quantity: vehicleExcipient.quantity,
        unit: vehicleExcipient.unit,
      },
      posology: posologyType === 'automatic' ? { type: 'automatic', data: posologyAutomatic } : { type: 'freeText', data: posologyFreeText },
      productDetails: {
        productType: "Manipulado", // Definido como fixo, pois é uma receita manipulada
        quantity: "1 unidade", // Definido como fixo, pois não há campo para isso
        pharmacy: "Farmácia de Manipulação", // Definido como fixo
        route: productDetails.route,
      },
      generalObservations,
    };
    onSave(dataToSave);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Composição da Fórmula */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaFlask className="h-5 w-5 text-blue-500" /> Composição da Fórmula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formulaComponents.map((comp, index) => (
              <ManipulatedFormulaComponentForm
                key={comp.id}
                component={comp}
                index={index}
                onUpdate={handleUpdateComponent}
                onDelete={handleDeleteComponent}
              />
            ))}
            <Button onClick={handleAddComponent} variant="outline" className="w-full rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
              <FaPlus className="mr-2 h-4 w-4" /> Adicionar Componente
            </Button>
          </CardContent>
        </Card>

        {/* Veículo / Excipiente */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaVial className="h-5 w-5 text-purple-500" /> Veículo / Excipiente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Tipo*</Label>
              <Select onValueChange={(value) => setVehicleExcipient(prev => ({ ...prev, type: value }))} value={vehicleExcipient.type}>
                <SelectTrigger id="vehicle-type" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                  <SelectValue placeholder="Ex: Comprimido" />
                </SelectTrigger>
                <SelectContent>
                  {mockVehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {vehicleExcipient.type === "Outro" && (
                <Input
                  placeholder="Digite o tipo personalizado"
                  value={customVehicleType}
                  onChange={(e) => setCustomVehicleType(e.target.value)}
                  className="mt-2 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-quantity">Quantidade / q.s.p*</Label>
              <Input
                id="vehicle-quantity"
                placeholder="Ex: 30"
                value={vehicleExcipient.quantity}
                onChange={(e) => setVehicleExcipient(prev => ({ ...prev, quantity: e.target.value }))}
                className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-unit">Unidade*</Label>
              <Select onValueChange={(value) => setVehicleExcipient(prev => ({ ...prev, unit: value }))} value={vehicleExcipient.unit}>
                <SelectTrigger id="vehicle-unit" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                  <SelectValue placeholder="Ex: Unidade" />
                </SelectTrigger>
                <SelectContent>
                  {mockVehicleUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posologia */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaPills className="h-5 w-5 text-green-500" /> Posologia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={posologyType} onValueChange={(value) => setPosologyType(value as 'automatic' | 'freeText')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
                <TabsTrigger value="automatic" className="rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">Automática</TabsTrigger>
                <TabsTrigger value="freeText" className="rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 text-gray-700 dark:text-gray-300 data-[state=active]:dark:bg-blue-600">Texto Livre</TabsTrigger>
              </TabsList>
              <TabsContent value="automatic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="posology-dosage">Dosagem*</Label>
                    <Input
                      id="posology-dosage"
                      placeholder="Ex: 1"
                      value={posologyAutomatic.dosage}
                      onChange={(e) => setPosologyAutomatic(prev => ({ ...prev, dosage: e.target.value }))}
                      className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="posology-measure">Medida*</Label>
                    <Select onValueChange={(value) => setPosologyAutomatic(prev => ({ ...prev, measure: value }))} value={posologyAutomatic.measure}>
                      <SelectTrigger id="posology-measure" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                        <SelectValue placeholder="Ex: Comprimido" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPosologyMeasures.map((measure) => (
                          <SelectItem key={measure} value={measure}>
                            {measure}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="posology-frequency-value">Frequência*</Label>
                    <div className="flex gap-2">
                      <Select onValueChange={(value) => setPosologyAutomatic(prev => ({ ...prev, frequencyValue: value }))} value={posologyAutomatic.frequencyValue}>
                        <SelectTrigger id="posology-frequency-value" className="w-1/2 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                          <SelectValue placeholder="Ex: 1" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPosologyFrequencies.map((freq) => (
                            <SelectItem key={freq} value={freq}>
                              {freq}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select onValueChange={(value) => setPosologyAutomatic(prev => ({ ...prev, frequencyUnit: value }))} value={posologyAutomatic.frequencyUnit}>
                        <SelectTrigger id="posology-frequency-unit" className="w-1/2 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                          <SelectValue placeholder="Ex: Dia" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPosologyFrequencyUnits.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="posology-duration-value">Duração*</Label>
                    <div className="flex gap-2">
                      <Select onValueChange={(value) => setPosologyAutomatic(prev => ({ ...prev, durationValue: value }))} value={posologyAutomatic.durationValue}>
                        <SelectTrigger id="posology-duration-value" className="w-1/2 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                          <SelectValue placeholder="Ex: 5" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPosologyDurations.map((duration) => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select onValueChange={(value) => setPosologyAutomatic(prev => ({ ...prev, durationUnit: value }))} value={posologyAutomatic.durationUnit}>
                        <SelectTrigger id="posology-duration-unit" className="w-1/2 bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                          <SelectValue placeholder="Ex: Dia" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPosologyDurationUnits.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-sm mt-4 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-200">
                  <p className="font-semibold mb-1">Descrição Final:</p>
                  <p>{posologyAutomatic.finalDescription || "Preencha os campos para gerar a descrição."}</p>
                </div>
              </TabsContent>
              <TabsContent value="freeText" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="posology-free-text">Descrição Final*</Label>
                  <Textarea
                    id="posology-free-text"
                    placeholder="Digite a posologia em texto livre..."
                    rows={5}
                    value={posologyFreeText.finalDescription}
                    onChange={(e) => setPosologyFreeText(prev => ({ ...prev, finalDescription: e.target.value }))}
                    className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Detalhes do Produto (apenas 'Via' agora) */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaFileMedical className="h-5 w-5 text-orange-500" /> Detalhes do Produto
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-route">Via*</Label>
              <Select onValueChange={(value) => setProductDetails(prev => ({ ...prev, route: value }))} value={productDetails.route}>
                <SelectTrigger id="product-route" className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200">
                  <SelectValue placeholder="Selecione a via" />
                </SelectTrigger>
                <SelectContent>
                  {mockProductRoutes.map((route) => (
                    <SelectItem key={route} value={route}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Campos removidos: Tipo de Produto, Quantidade, Farmácia */}
          </CardContent>
        </Card>

        {/* Observações Gerais da Receita Manipulada */}
        <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#374151] dark:text-gray-100">
              <FaInfoCircle className="h-5 w-5 text-gray-500" /> Observações Gerais da Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="manipulated-general-observations"
              placeholder="Adicione observações gerais para a receita manipulada..."
              rows={5}
              value={generalObservations}
              onChange={(e) => setGeneralObservations(e.target.value)}
              className="bg-white rounded-lg border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 placeholder-[#9CA3AF] dark:placeholder-gray-500 transition-all duration-200"
            />
          </CardContent>
        </Card>
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 rounded-md font-semibold transition-all duration-200 shadow-md hover:shadow-lg">
            <FaSave className="h-4 w-4 mr-2" /> Salvar Dados da Receita
          </Button>
        </div>
      </div>

      {/* Prévia da Fórmula (Sidebar) */}
      <div className="lg:col-span-1">
        <Card className="sticky top-20 bg-white/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#374151] dark:text-gray-100">Prévia da Fórmula</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Composição:</h4>
              {formulaComponents.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {formulaComponents.map((comp, index) => (
                    <li key={comp.id}>
                      {comp.name} {comp.dosageQuantity} {comp.dosageUnit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum componente adicionado.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Veículo / Excipiente:</h4>
              {vehicleExcipient.type ? (
                <p>{(vehicleExcipient.type === "Outro" && customVehicleType) ? customVehicleType : vehicleExcipient.type} {vehicleExcipient.quantity} {vehicleExcipient.unit}</p>
              ) : (
                <p>Nenhum veículo/excipiente.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Posologia:</h4>
              {posologyType === 'automatic' ? (
                <p>{posologyAutomatic.finalDescription || "Preencha a posologia automática."}</p>
              ) : (
                <p>{posologyFreeText.finalDescription || "Preencha a posologia em texto livre."}</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Via:</h4>
              {productDetails.route ? (
                <p>{productDetails.route}</p>
              ) : (
                <p>Nenhuma via selecionada.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionManipulatedForm;