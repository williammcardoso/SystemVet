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
  clinicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  clinicInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clinicDetails: {
    fontSize: 9,
    color: "#666",
  },
  clinicAddressPhone: {
    textAlign: "right",
    fontSize: 9,
    color: "#666",
  },
  mainTitle: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Exo",
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoSectionContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 10,
    marginBottom: 2,
  },
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
  // --- Novos estilos para o layout de colunas ---
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  headerCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  headerCellIcon: {
    width: 12,
    marginRight: 5,
  },
  headerCellLabel: {
    width: 100,
    textAlign: "left",
  },
  headerCellResult: {
    width: 130, // Ajustado para acomodar valor e unidade
    textAlign: "right",
  },
  headerCellReference: {
    width: 120, // Ajustado para acomodar faixa de referência
    textAlign: "right",
  },
  headerCellIndicator: {
    flex: 1,
    textAlign: "center",
  },
  paramRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    height: 25, // Altura fixa para parâmetros de linha única
  },
  leukocyteParamRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    height: 40, // Altura maior para parâmetros de leucócitos (2 linhas)
  },
  paramIcon: {
    width: 12,
    height: 12,
    marginRight: 5,
    textAlign: 'center',
  },
  paramLabel: {
    width: 100,
    fontSize: 10,
    color: "#333",
  },
  paramResultContainer: {
    width: 130, // Largura para a coluna de resultado
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  paramResultText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  paramUnitText: {
    fontSize: 8,
    color: "#666",
    textAlign: "right",
  },
  referenceRangeContainer: {
    width: 120, // Largura para a coluna de valor de referência
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  referenceRangeText: {
    fontSize: 8,
    color: "#666",
    textAlign: "right",
  },
  indicatorColumn: {
    flex: 1, // Ocupa o restante do espaço
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  // --- Fim dos novos estilos ---
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
  iconCheck: {
    color: "#28a745", // Green
  },
  iconExclamation: {
    color: "#ffc107", // Yellow/Orange
  },
  resultNormal: {
    color: "#000000", // Preto explícito para valores normais
  },
  resultHigh: {
    color: "#dc3545", // Red
  },
  resultLow: {
    color: "#007bff", // Blue
  },
  referenceBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    position: "relative",
    overflow: "hidden",
  },
  referenceBarSegment: {
    position: "absolute",
    height: "100%",
    borderRadius: 4,
  },
  referenceBarLow: {
    backgroundColor: "#ffcccc", // Light red
  },
  referenceBarNormal: {
    backgroundColor: "#ccffcc", // Light green
  },
  referenceBarHigh: {
    backgroundColor: "#ffcccc", // Light red
  },
  referenceBarIndicator: {
    position: "absolute",
    width: 2,
    height: "100%",
    backgroundColor: "#333",
    zIndex: 1,
  },
});

// Componente para renderizar o ícone de status (agora usa caracteres de texto)
const StatusIcon = ({ isNormal }: { isNormal: boolean }) => (
  <Text style={[styles.paramIcon, isNormal ? styles.iconCheck : styles.iconExclamation]}>
    {isNormal ? "✓" : "⚠"}
  </Text>
);

// Componente para a barra de referência
interface ReferenceBarProps {
  value: number;
  min: number;
  max: number;
  isNormal: boolean;
}

const ReferenceBar = ({ value, min, max, isNormal }: ReferenceBarProps) => {
  let vMin = min;
  let vMax = max;
  if (vMax === vMin) {
    const delta = Math.max(1, Math.abs(vMin) * 0.1 || 1);
    vMin = vMin - delta;
    vMax = vMax + delta;
  }

  const bufferFactor = 0.2;
  const visualMin = vMin - (vMax - vMin) * bufferFactor;
  const visualMax = vMax + (vMax - vMin) * bufferFactor;
  const totalVisualRange = visualMax - visualMin;

  const clampPercent = (p: number) => Math.max(0, Math.min(100, p));

  const valuePosition = clampPercent(((value - visualMin) / totalVisualRange) * 100);
  const minPosition = clampPercent(((vMin - visualMin) / totalVisualRange) * 100);
  const maxPosition = clampPercent(((vMax - visualMin) / totalVisualRange) * 100);

  return (
    <View style={styles.referenceBarContainer}>
      <View style={[styles.referenceBarSegment, styles.referenceBarLow, { left: 0, width: `${minPosition}%` }]} />
      <View style={[styles.referenceBarSegment, styles.referenceBarNormal, { left: `${minPosition}%`, width: `${maxPosition - minPosition}%` }]} />
      <View style={[styles.referenceBarSegment, styles.referenceBarHigh, { left: `${maxPosition}%`, width: `${100 - maxPosition}%` }]} />

      <View style={[styles.referenceBarIndicator, { left: `${valuePosition}%`, backgroundColor: isNormal ? '#28a745' : '#dc3545' }]} />
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

  // Renderiza um parâmetro de hemograma de valor único (Eritrócitos, RDW, Plaquetas)
  const renderHemogramParam = (
    label: string,
    value: string | undefined,
    unit: string,
    referenceKey: string,
  ) => {
    if (!value) return null;

    const ref = getReferenceRange(referenceKey);
    const valueStatus = getValueStatus(value, ref);
    const isNormal = valueStatus === 'normal';

    let resultStyle;
    switch (valueStatus) {
      case 'normal': resultStyle = styles.resultNormal; break;
      case 'high': resultStyle = styles.resultHigh; break;
      case 'low': resultStyle = styles.resultLow; break;
      default: resultStyle = styles.resultNormal;
    }

    return (
      <View style={styles.paramRow}>
        <StatusIcon isNormal={isNormal} />
        <Text style={styles.paramLabel}>{label}</Text>
        <View style={styles.paramResultContainer}>
          <Text style={[styles.paramResultText, resultStyle]}>{value}</Text>
          <Text style={styles.paramUnitText}>{unit}</Text>
        </View>
        <View style={styles.referenceRangeContainer}>
          <Text style={styles.referenceRangeText}>{ref?.full}</Text>
        </View>
        <View style={styles.indicatorColumn}>
          {ref && ref.min !== undefined && ref.max !== undefined && !isNaN(normalizeNumber(value)) ? (
            <ReferenceBar value={normalizeNumber(value)} min={ref.min} max={ref.max} isNormal={isNormal} />
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

    const isRelNormal = relValueStatus === 'normal';
    const isAbsNormal = absValueStatus === 'normal';
    const isOverallNormal = isRelNormal && isAbsNormal;

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

    // Para o indicador, usaremos o valor absoluto e sua referência
    const indicatorValue = normalizeNumber(absoluteValue);
    const indicatorMin = absRef?.min;
    const indicatorMax = absRef?.max;
    const isIndicatorNormal = absValueStatus === 'normal';

    return (
      <View style={styles.leukocyteParamRow}>
        <StatusIcon isNormal={isOverallNormal} />
        <Text style={styles.paramLabel}>{label}</Text>
        <View style={styles.paramResultContainer}>
          <Text style={[styles.paramResultText, relResultStyle]}>{relativeValue}%</Text>
          <Text style={[styles.paramResultText, absResultStyle]}>{absoluteValue}/µL</Text>
        </View>
        <View style={styles.referenceRangeContainer}>
          <Text style={styles.referenceRangeText}>{relRef?.relative}</Text>
          <Text style={styles.referenceRangeText}>{absRef?.absolute}</Text>
        </View>
        <View style={styles.indicatorColumn}>
          {indicatorValue !== undefined && indicatorMin !== undefined && indicatorMax !== undefined && !isNaN(indicatorValue) ? (
            <ReferenceBar value={indicatorValue} min={indicatorMin} max={indicatorMax} isNormal={isIndicatorNormal} />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header da Clínica */}
        <View style={styles.clinicHeader} fixed>
          <View style={styles.clinicInfoLeft}>
            <View>
              <Text style={styles.clinicName}>{mockCompanySettings.companyName}</Text>
              <Text style={styles.clinicDetails}>CRMV {mockCompanySettings.crmv}</Text>
              <Text style={styles.clinicDetails}>Registro no MAPA {mockCompanySettings.mapaRegistration}</Text>
            </View>
          </View>
          <View style={styles.clinicAddressPhone}>
            <Text>{mockCompanySettings.address}</Text>
            <Text>{mockCompanySettings.city} - CEP: {mockCompanySettings.zipCode}</Text>
            <Text>Telefone: {mockCompanySettings.phone}</Text>
          </View>
        </View>

        <Text style={styles.mainTitle}>LAUDO DE EXAME</Text>

        {/* Informações do Animal e Tutor */}
        <View style={styles.infoSectionContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Animal</Text>
            <Text style={styles.infoText}>ID: {animalId}</Text>
            <Text style={styles.infoText}>Nome: {animalName}</Text>
            <Text style={styles.infoText}>Espécie: {animalSpecies}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Tutor</Text>
            <Text style={styles.infoText}>Nome: {tutorName}</Text>
            <Text style={styles.infoText}>Endereço: {tutorAddress || "Não informado"}</Text>
          </View>
        </View>

        {/* Informações Gerais do Exame */}
        <View style={styles.infoSectionContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Detalhes do Exame</Text>
            <Text style={styles.infoText}>Tipo: {exam.type}</Text>
            <Text style={styles.infoText}>Data: {formatDateToPortuguese(new Date(exam.date))}</Text>
            <Text style={styles.infoText}>Veterinário Solicitante: {exam.vet}</Text>
            {exam.material && <Text style={styles.infoText}>Material: {exam.material}</Text>}
            {exam.equipamento && <Text style={styles.infoText}>Equipamento: {exam.equipamento}</Text>}
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Laboratório</Text>
            {exam.laboratory && <Text style={styles.infoText}>Nome: {exam.laboratory}</Text>}
            {exam.laboratoryDate && <Text style={styles.infoText}>Data do Resultado: {formatDateToPortuguese(new Date(exam.laboratoryDate))}</Text>}
            {exam.liberadoPor && <Text style={styles.infoText}>Liberado por: {exam.liberadoPor}</Text>}
          </View>
        </View>

        {exam.type === "Hemograma Completo" ? (
          <>
            {/* Tabela de Cabeçalho para os parâmetros */}
            <View style={styles.tableHeader}>
              <Text style={styles.headerCellIcon}></Text>
              <Text style={[styles.headerCell, styles.headerCellLabel]}>Nome</Text>
              <Text style={[styles.headerCell, styles.headerCellResult]}>Resultado</Text>
              <Text style={[styles.headerCell, styles.headerCellReference]}>Valor de Referência</Text>
              <Text style={[styles.headerCell, styles.headerCellIndicator]}>Indicador (+)</Text>
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