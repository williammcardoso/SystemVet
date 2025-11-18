import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { mockCompanySettings } from "@/mockData/settings";
import { ExamEntry, HemogramReference, HemogramReferenceValue, ExamReportData } from "@/types/exam";

// Registrando a fonte Exo com pesos regular, bold, italic e bold-italic
Font.register({
  family: "Exo",
  fonts: [
    { src: '/fonts/Exo-Regular.ttf', fontWeight: 400, format: 'truetype' },
    { src: '/fonts/Exo-Bold.ttf', fontWeight: 700, format: 'truetype' },
    { src: '/fonts/Exo-Italic.ttf', fontStyle: 'italic', fontWeight: 400, format: 'truetype' },
    { src: '/fonts/Exo-BoldItalic.ttf', fontStyle: 'italic', fontWeight: 700, format: 'truetype' },
  ],
});

// Helper function to format date
const formatDateToPortuguese = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('pt-BR', options);
  return formattedDate.toUpperCase();
};

// Normalizador de números (remove separador de milhar e troca vírgula por ponto)
const normalizeNumber = (raw: string | undefined) => {
  if (!raw) return NaN;
  return parseFloat(raw.replace(/\./g, '').replace(',', '.'));
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Exo",
    fontSize: 10,
    color: "#333",
  },
  // REMOVED: clinicHeader, clinicInfoLeft, clinicName, clinicDetails, clinicAddressPhone
  mainTitle: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Exo",
    fontWeight: "bold",
    marginBottom: 20,
  },
  // REMOVED: infoSectionContainer, infoCard, infoTitle, infoText
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 4,
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  // --- Layout de colunas para o corpo do laudo ---
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
    backgroundColor: "#f5f5f5",
  },
  headerCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    paddingLeft: 5,
  },
  headerCellName: {
    width: 120, // NOME DO PARÂMETRO
  },
  headerCellResult: {
    width: 100, // RESULTADO
    textAlign: "right",
  },
  headerCellReference: {
    width: 120, // REFERÊNCIA
    textAlign: "right",
  },
  headerCellIndicator: {
    width: 130, // INDICADOR (120px para barra + 10px padding)
    textAlign: "center",
  },
  paramRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    minHeight: 18, // Altura mínima para cada linha
  },
  paramName: {
    width: 120,
    fontSize: 9,
    color: "#333",
    paddingLeft: 5,
  },
  paramResultContainer: {
    width: 100,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  paramResultText: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "right",
  },
  paramUnitText: {
    fontSize: 7,
    color: "#666",
    textAlign: "right",
  },
  paramReferenceContainer: {
    width: 120,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  paramReferenceText: {
    fontSize: 7,
    color: "#666",
    textAlign: "right",
  },
  indicatorColumn: {
    width: 130, // Largura para o indicador
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // --- Estilos para o Indicador (Barra) ---
  indicatorBarBackground: {
    width: 120, // Largura fixa da barra
    height: 8,
    backgroundColor: '#e0e0e0', // Fundo cinza claro
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  indicatorBarNormalRange: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#ccffcc', // Faixa verde para o intervalo normal
    borderRadius: 2,
  },
  indicatorMarker: {
    position: 'absolute',
    fontSize: 12, // Tamanho do ponto "●"
    top: -2, // Ajuste vertical para centralizar o ponto
    width: 8, // Largura do ponto para centralização
    textAlign: 'center',
  },
  // --- Cores para Resultados e Marcadores ---
  resultNormal: {
    color: "#000000", // Preto
  },
  resultHigh: {
    color: "#dc3545", // Vermelho
  },
  resultLow: {
    color: "#007bff", // Azul
  },
  observationText: {
    fontSize: 10,
    lineHeight: 1.4,
    marginBottom: 5,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  signatureBlock: {
    textAlign: 'center',
    width: 180,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 3,
    marginTop: 10,
  },
  signatureLabel: {
    fontSize: 9,
    color: "#333",
  },
  signatureDetails: {
    fontSize: 9,
    color: "#666",
  },
  dateText: {
    fontSize: 10,
    color: "#333",
  },
});

// Componente para o Indicador (Barra com faixa verde e marcador de ponto)
interface IndicatorBarProps {
  value: string | undefined;
  minRef: number;
  maxRef: number;
  valueStatus: 'normal' | 'high' | 'low' | 'invalid';
}

const IndicatorBar: React.FC<IndicatorBarProps> = ({ value, minRef, maxRef, valueStatus }) => {
  const BAR_WIDTH = 120;
  const BAR_HEIGHT = 8;

  const numValue = normalizeNumber(value);

  // Determine marker color based on valueStatus
  let markerColor = styles.resultNormal.color;
  if (valueStatus === 'high') markerColor = styles.resultHigh.color;
  if (valueStatus === 'low') markerColor = styles.resultLow.color;

  // --- Cálculo das posições para a faixa verde e o marcador ---
  let visualMin = minRef;
  let visualMax = maxRef;

  // Ajuste para casos onde minRef === maxRef para evitar divisão por zero e ter uma visualização mínima
  if (visualMax === visualMin) {
    const delta = Math.max(1, Math.abs(visualMin) * 0.1 || 1);
    visualMin = visualMin - delta;
    visualMax = visualMax + delta;
  }

  // Expandir o range visual para acomodar valores fora da referência
  const rangeBuffer = (visualMax - visualMin) * 0.2; // 20% de buffer em cada lado
  const effectiveVisualMin = visualMin - rangeBuffer;
  const effectiveVisualMax = visualMax + rangeBuffer;
  const totalEffectiveRange = effectiveVisualMax - effectiveVisualMin;

  let greenBarLeft = 0;
  let greenBarWidth = 0;
  let markerPosition = 0;

  if (totalEffectiveRange > 0) {
    greenBarLeft = ((visualMin - effectiveVisualMin) / totalEffectiveRange) * BAR_WIDTH;
    greenBarWidth = ((visualMax - visualMin) / totalEffectiveRange) * BAR_WIDTH;
    markerPosition = ((numValue - effectiveVisualMin) / totalEffectiveRange) * BAR_WIDTH;
  } else { // Fallback para ranges inválidos ou zero, centraliza tudo
    greenBarLeft = BAR_WIDTH / 2 - 5; // Pequeno segmento central
    greenBarWidth = 10;
    markerPosition = BAR_WIDTH / 2;
  }

  // Clampar posições para garantir que estejam dentro dos limites da barra
  greenBarLeft = Math.max(0, Math.min(BAR_WIDTH - greenBarWidth, greenBarLeft));
  greenBarWidth = Math.max(0, greenBarWidth);
  markerPosition = Math.max(0, Math.min(BAR_WIDTH, markerPosition));

  return (
    <View style={styles.indicatorBarBackground}>
      {greenBarWidth > 0 && (
        <View style={[styles.indicatorBarNormalRange, { left: greenBarLeft, width: greenBarWidth }]} />
      )}
      {!isNaN(numValue) && (
        <Text style={[styles.indicatorMarker, { left: markerPosition - (styles.indicatorMarker.fontSize as number / 2) }]}>●</Text>
      )}
    </View>
  );
};


export const ExamReportPdfContent = ({
  animalName, animalId, animalSpecies, tutorName, tutorAddress, exam, hemogramReferences,
}: ExamReportData) => {
  const currentDate = new Date();
  const speciesKey = animalSpecies === "Canino" ? "dog" : animalSpecies === "Felino" ? "cat" : undefined;

  const getReferenceRange = (param: string): HemogramReferenceValue | undefined => {
    if (!speciesKey || !hemogramReferences[param]) return undefined;
    return hemogramReferences[param][speciesKey];
  };

  const getValueStatus = (value: string | undefined, ref: HemogramReferenceValue | undefined): 'normal' | 'high' | 'low' | 'invalid' => {
    if (!value || !ref || ref.min === undefined || ref.max === undefined) return 'invalid';
    const numValue = normalizeNumber(value);
    if (isNaN(numValue)) return 'invalid';

    if (numValue >= ref.min && numValue <= ref.max) return 'normal';
    if (numValue > ref.max) return 'high';
    return 'low';
  };

  // Renderiza um parâmetro de hemograma de valor único
  const renderHemogramParam = (
    label: string,
    value: string | undefined,
    unit: string,
    referenceKey: string,
  ) => {
    if (!value) return null;

    const ref = getReferenceRange(referenceKey);
    const valueStatus = getValueStatus(value, ref);

    let resultStyle;
    switch (valueStatus) {
      case 'normal': resultStyle = styles.resultNormal; break;
      case 'high': resultStyle = styles.resultHigh; break;
      case 'low': resultStyle = styles.resultLow; break;
      default: resultStyle = styles.resultNormal;
    }

    return (
      <View style={styles.paramRow}>
        <Text style={styles.paramName}>{label}</Text>
        <View style={styles.paramResultContainer}>
          <Text style={[styles.paramResultText, resultStyle]}>{value}</Text>
          <Text style={styles.paramUnitText}>{unit}</Text>
        </View>
        <View style={styles.paramReferenceContainer}>
          <Text style={styles.paramReferenceText}>{ref?.full || 'N/A'}</Text>
        </View>
        <View style={styles.indicatorColumn}>
          {ref && ref.min !== undefined && ref.max !== undefined && !isNaN(normalizeNumber(value)) ? (
            <IndicatorBar value={value} minRef={ref.min} maxRef={ref.max} valueStatus={valueStatus} />
          ) : null}
        </View>
      </View>
    );
  };

  // Renderiza um parâmetro de leucograma com valores relativo e absoluto
  const renderLeukocyteParam = (
    label: string,
    relativeValue: string | undefined,
    absoluteValue: string | undefined,
    relativeReferenceKey: string,
    absoluteReferenceKey: string,
  ) => {
    if (!relativeValue && !absoluteValue) return null;

    const relRef = getReferenceRange(relativeReferenceKey);
    const absRef = getReferenceRange(absoluteReferenceKey);

    const relValueStatus = getValueStatus(relativeValue, relRef);
    const absValueStatus = getValueStatus(absoluteValue, absRef);

    let relResultStyle;
    switch (relValueStatus) {
      case 'normal': relResultStyle = styles.resultNormal; break;
      case 'high': relResultStyle = styles.resultHigh; break;
      case 'low': relResultStyle = styles.resultLow; break;
      default: relResultStyle = styles.resultNormal;
    }

    let absResultStyle;
    switch (absValueStatus) {
      case 'normal': absResultStyle = styles.resultNormal; break;
      case 'high': absResultStyle = styles.resultHigh; break;
      case 'low': absResultStyle = styles.resultLow; break;
      default: absResultStyle = styles.resultNormal;
    }

    // O indicador usará o valor absoluto para posicionamento e cor
    const indicatorValue = absoluteValue;
    const indicatorMin = absRef?.min;
    const indicatorMax = absRef?.max;
    const indicatorValueStatus = absValueStatus;

    return (
      <View style={styles.paramRow}>
        <Text style={styles.paramName}>{label}</Text>
        <View style={styles.paramResultContainer}>
          <Text style={[styles.paramResultText, relResultStyle]}>{relativeValue}%</Text>
          <Text style={[styles.paramResultText, absResultStyle]}>{absoluteValue}/µL</Text>
        </View>
        <View style={styles.paramReferenceContainer}>
          <Text style={styles.paramReferenceText}>{relRef?.relative || 'N/A'}</Text>
          <Text style={styles.paramReferenceText}>{absRef?.absolute || 'N/A'}</Text>
        </View>
        <View style={styles.indicatorColumn}>
          {indicatorMin !== undefined && indicatorMax !== undefined && !isNaN(normalizeNumber(indicatorValue)) ? (
            <IndicatorBar value={indicatorValue} minRef={indicatorMin} maxRef={indicatorMax} valueStatus={indicatorValueStatus} />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* REMOVED: Header da Clínica */}
        {/* REMOVED: mainTitle */}
        {/* REMOVED: Informações do Animal e Tutor */}
        {/* REMOVED: Informações Gerais do Exame */}

        {exam.type === "Hemograma Completo" ? (
          <>
            {/* Tabela de Cabeçalho para os parâmetros */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.headerCellName]}>NOME DO PARÂMETRO</Text>
              <Text style={[styles.headerCell, styles.headerCellResult]}>RESULTADO</Text>
              <Text style={[styles.headerCell, styles.headerCellReference]}>REFERÊNCIA</Text>
              <Text style={[styles.headerCell, styles.headerCellIndicator]}>INDICADOR</Text>
            </View>

            {/* Série Vermelha */}
            <Text style={styles.sectionTitle}>ERITROGRAMA</Text>
            {renderHemogramParam("Eritrócitos", exam.eritrocitos, "M/mm3", "eritrocitos")}
            {renderHemogramParam("Hemoglobina", exam.hemoglobina, "g/dL", "hemoglobina")}
            {renderHemogramParam("Hematócrito", exam.hematocrito, "%", "hematocrito")}
            {renderHemogramParam("VCM", exam.vcm, "fL", "vcm")}
            {renderHemogramParam("HCM", exam.hcm, "pg", "hcm")}
            {renderHemogramParam("CHCM", exam.chcm, "g/dL", "chcm")}
            {renderHemogramParam("RDW", exam.rdw, "%", "rdw")}
            {exam.proteinaTotal && renderHemogramParam("Proteína total", exam.proteinaTotal, "g/dL", "proteinaTotal")}
            {exam.hemaciasNucleadas && renderHemogramParam("Hemácias nucleadas", exam.hemaciasNucleadas, "", "hemaciasNucleadas")}
            {exam.observacoesSerieVermelha && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subsectionTitle}>Observações da Série Vermelha:</Text>
                <Text style={styles.observationText}>{exam.observacoesSerieVermelha}</Text>
              </View>
            )}

            {/* Série Branca */}
            <Text style={styles.sectionTitle}>LEUCOGRAMA</Text>
            {renderHemogramParam("Leucócitos totais", exam.leucocitosTotais, "mil/µL", "leucocitosTotais")}
            {exam.mielocitosRelativo && renderLeukocyteParam("Mielócitos", exam.mielocitosRelativo, exam.mielocitosAbsoluto, "mielocitos", "mielocitos")}
            {exam.metamielocitosRelativo && renderLeukocyteParam("Metamielócitos", exam.metamielocitosRelativo, exam.metamielocitosAbsoluto, "metamielocitos", "metamielocitos")}
            {exam.bastonetesRelativo && renderLeukocyteParam("Bastonetes", exam.bastonetesRelativo, exam.bastonetesAbsoluto, "bastonetes", "bastonetes")}
            {exam.segmentadosRelativo && renderLeukocyteParam("Segmentados", exam.segmentadosRelativo, exam.segmentadosAbsoluto, "segmentados", "segmentados")}
            {exam.eosinofilosRelativo && renderLeukocyteParam("Eosinófilos", exam.eosinofilosRelativo, exam.eosinofilosAbsoluto, "eosinofilos", "eosinofilos")}
            {exam.basofilosRelativo && renderLeukocyteParam("Basófilos", exam.basofilosRelativo, exam.basofilosAbsoluto, "basofilos", "basofilos")}
            {exam.linfocitosRelativo && renderLeukocyteParam("Linfócitos", exam.linfocitosRelativo, exam.linfocitosAbsoluto, "linfocitos", "linfocitos")}
            {exam.monocitosRelativo && renderLeukocyteParam("Monócitos", exam.monocitosRelativo, exam.monocitosAbsoluto, "monocitos", "monocitos")}
            {exam.observacoesSerieBranca && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subsectionTitle}>Observações da Série Branca:</Text>
                <Text style={styles.observationText}>{exam.observacoesSerieBranca}</Text>
              </View>
            )}

            {/* Série Plaquetária */}
            <Text style={styles.sectionTitle}>PLAQUETOGRAMA</Text>
            {renderHemogramParam("Plaquetas totais", exam.contagemPlaquetaria, "/µL", "contagemPlaquetaria")}
            {exam.avaliacaoPlaquetaria && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subsectionTitle}>Avaliação Plaquetária:</Text>
                <Text style={styles.observationText}>{exam.avaliacaoPlaquetaria}</Text>
              </View>
            )}

            {/* Nota */}
            {exam.nota && (
              <View style={{ marginTop: 15 }}>
                <Text style={styles.subsectionTitle}>Nota:</Text>
                <Text style={styles.observationText}>{exam.nota}</Text>
              </View>
            )}
          </>
        ) : (
          // Resultado para exames não-hemograma
          exam.result && (
            <View style={{ marginTop: 15 }}>
              <Text style={styles.sectionTitle}>Resultado</Text>
              <Text style={styles.observationText}>{exam.result}</Text>
            </View>
          )
        )}

        {/* Observações Gerais do Exame */}
        {exam.observacoesGeraisExame && (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.sectionTitle}>Observações Gerais do Exame</Text>
            <Text style={styles.observationText}>{exam.observacoesGeraisExame}</Text>
          </View>
        )}

        {/* Rodapé */}
        <View style={styles.footerContainer} fixed>
          <Text style={styles.dateText}>
            Data de Emissão: {formatDateToPortuguese(currentDate)}
          </Text>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}/>
            <Text style={styles.signatureLabel}>Assinatura do Veterinário</Text>
            <Text style={styles.signatureDetails}>{exam.vet}</Text>
            {/* Adicionar CRMV e MAPA do veterinário se disponível */}
          </View>
        </View>
      </Page>
    </Document>
  );
};