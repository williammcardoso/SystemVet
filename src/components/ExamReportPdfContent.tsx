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

// ADDED: normalizador de números (remove separador de milhar e troca vírgula por ponto)
const normalizeNumber = (raw: string) => {
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
  paramRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  paramIcon: {
    width: 12,
    height: 12,
    marginRight: 5,
    textAlign: 'center', // Centraliza o caractere
  },
  paramLabel: {
    width: 120,
    fontSize: 10,
  },
  paramResult: {
    width: 80,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  paramUnit: {
    width: 40,
    fontSize: 8,
    color: "#666",
    marginLeft: 2,
  },
  referenceBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginLeft: 10,
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
  referenceValues: {
    width: 100,
    fontSize: 8,
    color: "#666",
    marginLeft: 5,
    textAlign: "right",
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
  // Estilos para ícones no PDF (agora caracteres de texto)
  iconCheck: {
    color: "#28a745", // Green
  },
  iconExclamation: {
    color: "#ffc107", // Yellow/Orange
  },
  // ADDED: Estilos para o texto do resultado com base no status
  resultNormal: {
    color: "#333", // Dark gray/black
  },
  resultHigh: {
    color: "#dc3545", // Red
  },
  resultLow: {
    color: "#007bff", // Blue
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
  // ADDED: proteção para intervalos com min === max (evita divisão por zero)
  let vMin = min;
  let vMax = max;
  if (vMax === vMin) {
    const delta = Math.max(1, Math.abs(vMin) * 0.1 || 1); // intervalo mínimo artificial
    vMin = vMin - delta;
    vMax = vMax + delta;
  }

  // Define um "buffer" para a visualização da barra
  const bufferFactor = 0.2; // 20% do range total para cada lado
  const visualMin = vMin - (vMax - vMin) * bufferFactor;
  const visualMax = vMax + (vMax - vMin) * bufferFactor;
  const totalVisualRange = visualMax - visualMin;

  const clampPercent = (p: number) => Math.max(0, Math.min(100, p));

  // Calcula a posição do valor dentro do range visual (0-100%), com clamp
  const valuePosition = clampPercent(((value - visualMin) / totalVisualRange) * 100);

  // Calcula as posições dos limites min e max dentro do range visual
  const minPosition = clampPercent(((vMin - visualMin) / totalVisualRange) * 100);
  const maxPosition = clampPercent(((vMax - visualMin) / totalVisualRange) * 100);

  return (
    <View style={styles.referenceBarContainer}>
      {/* Segmento de "baixo" (antes do min) */}
      <View style={[styles.referenceBarSegment, styles.referenceBarLow, { left: 0, width: `${minPosition}%` }]} />
      {/* Segmento "normal" (entre min e max) */}
      <View style={[styles.referenceBarSegment, styles.referenceBarNormal, { left: `${minPosition}%`, width: `${maxPosition - minPosition}%` }]} />
      {/* Segmento de "alto" (depois do max) */}
      <View style={[styles.referenceBarSegment, styles.referenceBarHigh, { left: `${maxPosition}%`, width: `${100 - maxPosition}%` }]} />

      {/* Indicador do valor atual */}
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

  // UPDATED: Função para verificar o status do valor (normal, alto, baixo)
  const getValueStatus = (value: string | undefined, ref: HemogramReferenceValue | undefined): 'normal' | 'high' | 'low' | 'invalid' => {
    if (!value || !ref || ref.min === undefined || ref.max === undefined) return 'invalid';
    const numValue = normalizeNumber(value);
    if (isNaN(numValue)) return 'invalid';

    if (numValue >= ref.min && numValue <= ref.max) return 'normal';
    if (numValue > ref.max) return 'high';
    return 'low'; // numValue < ref.min
  };

  const renderHemogramParam = (
    label: string,
    value: string | undefined,
    unit: string,
    referenceKey: string,
    isRelative?: boolean,
    absoluteValue?: string | undefined,
    absoluteUnit?: string,
    absoluteReferenceKey?: string,
  ) => {
    if (!value && !absoluteValue) return null;

    const ref = getReferenceRange(referenceKey);
    const valueStatus = getValueStatus(value, ref);
    const isNormal = valueStatus === 'normal';

    let resultStyle;
    switch (valueStatus) {
      case 'normal':
        resultStyle = styles.resultNormal;
        break;
      case 'high':
        resultStyle = styles.resultHigh;
        break;
      case 'low':
        resultStyle = styles.resultLow;
        break;
      default:
        resultStyle = styles.resultNormal; // Default para normal se inválido
    }

    let displayValue = value;
    let displayUnit = unit;
    let displayReference = ref?.full;

    if (isRelative && absoluteValue !== undefined && absoluteReferenceKey) {
      const absoluteRef = getReferenceRange(absoluteReferenceKey);
      const absoluteValueStatus = getValueStatus(absoluteValue, absoluteRef);
      const isAbsoluteNormal = absoluteValueStatus === 'normal';

      let absoluteResultStyle;
      switch (absoluteValueStatus) {
        case 'normal':
          absoluteResultStyle = styles.resultNormal;
          break;
        case 'high':
          absoluteResultStyle = styles.resultHigh;
          break;
        case 'low':
          absoluteResultStyle = styles.resultLow;
          break;
        default:
          absoluteResultStyle = styles.resultNormal;
      }

      return (
        <View style={styles.paramRow}>
          <StatusIcon isNormal={isNormal && isAbsoluteNormal} />
          <Text style={styles.paramLabel}>{label}</Text>
          <Text style={[styles.paramResult, resultStyle]}>{displayValue}</Text>
          <Text style={styles.paramUnit}>%</Text>
          <Text style={[styles.paramResult, absoluteResultStyle]}>{absoluteValue}</Text>
          <Text style={styles.paramUnit}>{absoluteUnit}</Text>
          <View style={styles.referenceBarContainer}>
            {ref && ref.min !== undefined && ref.max !== undefined && value ? (
              <ReferenceBar value={normalizeNumber(value)} min={ref.min} max={ref.max} isNormal={isNormal} />
            ) : null}
          </View>
          <Text style={styles.referenceValues}>{ref?.relative}</Text>
          <View style={styles.referenceBarContainer}>
            {absoluteRef && absoluteRef.min !== undefined && absoluteRef.max !== undefined && absoluteValue ? (
              <ReferenceBar value={normalizeNumber(absoluteValue)} min={absoluteRef.min} max={absoluteRef.max} isNormal={isAbsoluteNormal} />
            ) : null}
          </View>
          <Text style={styles.referenceValues}>{absoluteRef?.absolute}</Text>
        </View>
      );
    }

    return (
      <View style={styles.paramRow}>
        <StatusIcon isNormal={isNormal} />
        <Text style={styles.paramLabel}>{label}</Text>
        <Text style={[styles.paramResult, resultStyle]}>{displayValue}</Text>
        <Text style={styles.paramUnit}>{displayUnit}</Text>
        <View style={styles.referenceBarContainer}>
          {ref && ref.min !== undefined && ref.max !== undefined && value ? (
            <ReferenceBar value={normalizeNumber(value)} min={ref.min} max={ref.max} isNormal={isNormal} />
          ) : null}
        </View>
        <Text style={styles.referenceValues}>{displayReference}</Text>
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
            {/* Série Vermelha */}
            <Text style={styles.sectionTitle}>Série Vermelha</Text>
            {renderHemogramParam("Eritrócitos totais", exam.eritrocitos, "M/mm3", "eritrocitos")}
            {renderHemogramParam("Hemoglobina", exam.hemoglobina, "g/dL", "hemoglobina")}
            {renderHemogramParam("Hematócrito", exam.hematocrito, "%", "hematocrito")}
            {renderHemogramParam("VCM", exam.vcm, "fL", "vcm")}
            {renderHemogramParam("HCM", exam.hcm, "pg", "hcm")}
            {renderHemogramParam("CHCM", exam.chcm, "g/dL", "chcm")}
            {/* RDW não está no mock, mas se estivesse, seria assim: */}
            {/* {renderHemogramParam("RDW", exam.rdw, "%", "rdw")} */}
            {exam.hemaciasNucleadas && renderHemogramParam("Hemácias nucleadas", exam.hemaciasNucleadas, "", "hemaciasNucleadas")}
            {exam.observacoesSerieVermelha && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subsectionTitle}>Observações da Série Vermelha:</Text>
                <Text style={styles.observationText}>{exam.observacoesSerieVermelha}</Text>
              </View>
            )}

            {/* Série Branca */}
            <Text style={styles.sectionTitle}>Série Branca</Text>
            {renderHemogramParam("Leucócitos totais", exam.leucocitosTotais, "M/mm3", "leucocitosTotais")}
            {renderHemogramParam("Mielócitos", exam.mielocitosRelativo, "%", "mielocitos", true, exam.mielocitosAbsoluto, "/µL", "mielocitos")}
            {renderHemogramParam("Metamielócitos", exam.metamielocitosRelativo, "%", "metamielocitos", true, exam.metamielocitosAbsoluto, "/µL", "metamielocitos")}
            {renderHemogramParam("Bastonetes", exam.bastonetesRelativo, "%", "bastonetes", true, exam.bastonetesAbsoluto, "/µL", "bastonetes")}
            {renderHemogramParam("Segmentados", exam.segmentadosRelativo, "%", "segmentados", true, exam.segmentadosAbsoluto, "/µL", "segmentados")}
            {renderHemogramParam("Eosinófilos", exam.eosinofilosRelativo, "%", "eosinofilos", true, exam.eosinofilosAbsoluto, "/µL", "eosinofilos")}
            {renderHemogramParam("Basófilos", exam.basofilosRelativo, "%", "basofilos", true, exam.basofilosAbsoluto, "/µL", "basofilos")}
            {renderHemogramParam("Linfócitos", exam.linfocitosRelativo, "%", "linfocitos", true, exam.linfocitosAbsoluto, "/µL", "linfocitos")}
            {renderHemogramParam("Monócitos", exam.monocitosRelativo, "%", "monocitos", true, exam.monocitosAbsoluto, "/µL", "monocitos")}
            {exam.observacoesSerieBranca && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.subsectionTitle}>Observações da Série Branca:</Text>
                <Text style={styles.observationText}>{exam.observacoesSerieBranca}</Text>
              </View>
            )}

            {/* Série Plaquetária */}
            <Text style={styles.sectionTitle}>Série Plaquetária</Text>
            {renderHemogramParam("Plaquetas totais", exam.contagemPlaquetaria, "M/mm3", "contagemPlaquetaria")}
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