import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { MedicationData } from "@/types/medication";
import { mockCompanySettings, mockUserSettings } from "@/mockData/settings";

// Registrando a fonte Exo com pesos regular e bold usando arquivos locais
// Certifique-se de que os arquivos 'Exo-Regular.ttf' e 'Exo-Bold.ttf' estejam na pasta 'public/fonts'
Font.register({
  family: "Exo",
  fonts: [
    { src: '/fonts/Exo-Regular.ttf', fontWeight: 400, format: 'truetype' },
    { src: '/fonts/Exo-Bold.ttf', fontWeight: 700, format: 'truetype' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Exo", // Usando a fonte Exo
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
    fontFamily: "Exo", // Usando Exo para o título principal
    fontWeight: "bold",
    marginBottom: 20,
  },
  viaTextContainer: {
    textAlign: 'right',
    fontSize: 9,
    color: '#333',
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
  patientInfoControlled: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 0, // Ajustado para aproximar
  },
  patientInfoControlledTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  patientInfoControlledText: {
    fontSize: 10,
    marginBottom: 2,
    color: "#333",
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 4,
  },
  medicationItem: {
    flexDirection: "column",
    marginBottom: 15,
  },
  medicationHeaderLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  medicationNumber: {
    fontSize: 11,
    marginRight: 5,
    width: 15,
  },
  medicationNameConcentration: {
    fontSize: 11,
    fontWeight: "bold",
    flexShrink: 1,
  },
  lineSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexGrow: 1,
    height: 1,
    marginHorizontal: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 5,
    flexShrink: 0,
  },
  pharmacyBadge: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    color: "#555",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  quantityBadge: {
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#e0e0ff",
    color: "#333",
    borderWidth: 1,
    borderColor: "#aaa",
  },
  medicationInstructions: {
    fontSize: 10,
    color: "#444",
    marginLeft: 20,
    lineHeight: 1.4,
  },
  medicationObservations: {
    fontSize: 9,
    color: "#777",
    marginLeft: 20,
    marginTop: 3,
    fontStyle: "italic",
  },
  generalObservationsSection: {
    marginTop: 25,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  generalObservationsTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },
  generalObservationsText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  // Estilos para o bloco de data e assinatura do VETERINÁRIO (rodapé fixo para simples)
  vetSignatureBlock: {
    textAlign: 'center',
    width: 180,
  },
  vetSignatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 3,
    marginTop: 10,
  },
  vetSignatureLabel: {
    fontSize: 9,
    color: "#333",
  },
  vetSignatureDetails: {
    fontSize: 9,
    color: "#666",
  },
  vetSignatureDateText: {
    fontSize: 10,
    color: "#333",
  },
  // Rodapé para receitas simples (fixo na parte inferior)
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
  // Estilos para o cabeçalho de receita controlada
  controlledPrescriptionHeader: {
    marginBottom: 0,
    paddingBottom: 10,
    borderBottomWidth: 0,
    borderBottomColor: "#eee",
  },
  controlledPrescriptionTitle: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Exo",
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  controlledHeaderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  issuerVetCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    width: '48%',
  },
  issuerVetTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  issuerVetText: {
    fontSize: 10,
    marginBottom: 2,
    color: "#333",
  },
  // Estilos para o rodapé fixo de identificação (comprador/fornecedor)
  identificationCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  identificationCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    justifyContent: 'space-between',
  },
  identificationTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  identificationField: {
    fontSize: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  identificationLabel: {
    marginRight: 3,
  },
  identificationLine: {
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  identificationDateLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  identificationDatePart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 5,
  },
  identificationDateSeparator: {
    marginHorizontal: 2,
  },
  pharmacistSignatureBlock: {
    marginTop: 'auto',
    marginBottom: 5,
  },
  pharmacistSignatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 3,
    marginTop: 20,
  },
  pharmacistSignatureLabel: {
    fontSize: 9,
    color: "#333",
    textAlign: 'center',
  },
  // NOVOS ESTILOS para o bloco de Data e Assinatura do Comprador (receita controlada, in-flow)
  buyerSignatureDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Alinha os itens pelo topo
    marginTop: 30, // Espaço após observações gerais
    marginBottom: 15, // Reduzido para 'grudar' mais na linha de separação
    width: '100%',
  },
  buyerDateText: {
    fontSize: 10,
    color: "#333",
    // Removido flexDirection e alignItems, pois é apenas texto
  },
  buyerSignatureBlock: {
    textAlign: 'center',
    width: 180, // Largura fixa para a linha de assinatura
    marginTop: 0, // Garante alinhamento com o topo do texto da data
  },
  buyerSignatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 3,
    marginTop: 5, // Espaço entre o label 'Assinatura' e a linha
  },
  buyerSignatureLabel: {
    fontSize: 9,
    color: "#333",
  },
});

// Helper function to format date
const formatDateToPortuguese = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('pt-BR', options);
  return formattedDate.toUpperCase();
};

interface PrescriptionPdfContentProps {
  animalName: string;
  animalId: string;
  animalSpecies: string;
  tutorName: string;
  tutorAddress: string;
  medications: MedicationData[];
  generalObservations: string;
  showElectronicSignatureText: boolean;
  prescriptionType: 'simple' | 'controlled' | 'manipulated';
  pharmacistName?: string;
  pharmacistCpf?: string;
  pharmacistCfr?: string;
  pharmacistAddress?: string;
  pharmacistPhone?: string;
}

export const PrescriptionPdfContent = ({
  animalName, animalId, animalSpecies, tutorName, tutorAddress,
  medications, generalObservations, showElectronicSignatureText,
  prescriptionType, pharmacistName, pharmacistCpf, pharmacistCfr,
  pharmacistAddress, pharmacistPhone,
}: PrescriptionPdfContentProps) => {
  const groupedMedications = medications.reduce((acc: Record<string, MedicationData[]>, med) => {
    const useType = med.useType || "Outros";
    if (!acc[useType]) { acc[useType] = []; }
    acc[useType].push(med);
    return acc;
  }, {});

  const currentDate = new Date();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.clinicHeader}>
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

        {prescriptionType === 'controlled' ? (
          <View style={styles.controlledPrescriptionHeader}>
            <Text style={styles.controlledPrescriptionTitle}>RECEITUÁRIO DE CONTROLE ESPECIAL</Text>
            <View style={styles.controlledHeaderDetails}>
              <View style={styles.issuerVetCard}>
                <Text style={styles.issuerVetTitle}>Emitente (Veterinário)</Text>
                <Text style={styles.issuerVetText}>Nome: {mockUserSettings.signatureText}</Text>
                <Text style={styles.issuerVetText}>CRMV: {mockUserSettings.userCrmv}</Text>
                <Text style={styles.issuerVetText}>Registro MAPA: {mockUserSettings.userMapaRegistration}</Text>
              </View>
              <View style={styles.viaTextContainer}>
                <Text>1.ª VIA - FARMÁCIA</Text>
                <Text>2.ª VIA - PACIENTE</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.mainTitle}>Receita Simples</Text>
        )}

        {/* Informações do Paciente/Proprietário */}
        {prescriptionType === 'controlled' ? (
          <View style={styles.patientInfoControlled}>
            <Text style={styles.patientInfoControlledTitle}>Informações do Paciente/Proprietário</Text>
            <Text style={styles.patientInfoControlledText}>Paciente: {animalName}</Text>
            <Text style={styles.patientInfoControlledText}>Proprietário: {tutorName}</Text>
            <Text style={styles.patientInfoControlledText}>Endereço: {tutorAddress || "Não informado"}</Text>
          </View>
        ) : (
          // Informações do Animal e Tutor para receita simples
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
        )}

        {Object.keys(groupedMedications).map((useType) => (
          <View key={useType}>
            <Text style={styles.groupTitle}>{useType}</Text>
            {groupedMedications[useType].map((med, index) => (
              <View key={med.id} style={styles.medicationItem}>
                <View style={styles.medicationHeaderLine}>
                  <Text style={styles.medicationNumber}>{index + 1})</Text>
                  <Text style={styles.medicationNameConcentration}>
                    {(() => {
                      const name = (med.medicationName && med.medicationName.trim()) || '';
                      const concentration = (med.concentration && med.concentration.trim()) || '';
                      if (name.length > 0 && concentration.length > 0) { return `${name} ${concentration}`; }
                      else if (name.length > 0) { return name; }
                      else if (concentration.length > 0) { return concentration; }
                      return 'Medicamento sem nome';
                    })()}
                  </Text>
                  <View style={styles.lineSeparator}/>
                  <View style={styles.badgeContainer}>
                    {med.pharmacyType ? (<Text style={styles.pharmacyBadge}>{med.pharmacyType === "Farmácia Veterinária" ? "VET" : "HUMANA"}</Text>) : null}
                    {med.totalQuantityDisplay ? (<Text style={styles.quantityBadge}>{med.totalQuantityDisplay}</Text>) : null}
                  </View>
                </View>
                <Text style={styles.medicationInstructions}>
                  {med.generatedInstructions || 'Sem instruções de uso.'}
                </Text>
                {med.generalObservations && med.generalObservations.trim().length > 0 ? (
                  <Text style={styles.medicationObservations}>
                    Obs. Medicamento: {med.generalObservations}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ))}

        {generalObservations ? (
          <View style={styles.generalObservationsSection}>
            <Text style={styles.generalObservationsTitle}>Observações Gerais da Receita</Text>
            <Text style={styles.generalObservationsText}>{generalObservations}</Text>
          </View>
        ) : null}

        {/* NOVO BLOCO: Data e Assinatura do Comprador (para Receitas Controladas, in-flow) */}
        {prescriptionType === 'controlled' && (
          <View style={styles.buyerSignatureDateContainer}>
            <Text style={styles.buyerDateText}>
              Data: {formatDateToPortuguese(currentDate)}
            </Text>
            <View style={styles.buyerSignatureBlock}>
              <Text style={styles.buyerSignatureLabel}>Assinatura</Text>
              <View style={styles.buyerSignatureLine}/>
            </View>
          </View>
        )}

        {/* Rodapé para Receitas Simples (fixed) */}
        {prescriptionType !== 'controlled' && (
          <View style={styles.footerContainer} fixed>
            <Text style={styles.vetSignatureDateText}>
              Data: {formatDateToPortuguese(currentDate)}
            </Text>
            <View style={styles.vetSignatureBlock}>
              {showElectronicSignatureText ? (
                <Text style={styles.vetSignatureLabel}>Assinado eletronicamente por</Text>
              ) : null}
              <View style={styles.vetSignatureLine}/>
              <Text style={styles.vetSignatureLabel}>{mockUserSettings.signatureText}</Text>
              <Text style={styles.vetSignatureDetails}>CRMV {mockUserSettings.userCrmv}</Text>
              <Text style={styles.vetSignatureDetails}>Registro no MAPA {mockUserSettings.userMapaRegistration}</Text>
            </View>
          </View>
        )}

        {/* Rodapé para Receitas Controladas (fixed) */}
        {prescriptionType === 'controlled' ? (
          <View style={styles.identificationCardContainer} fixed>
            <View style={styles.identificationCard}>
              <Text style={styles.identificationTitle}>IDENTIFICAÇÃO DO COMPRADOR</Text>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>Nome completo</Text>
                <View style={styles.identificationLine}/>
              </View>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>Ident.</Text>
                <View style={[styles.identificationLine, { width: 80 }]}/>
                <Text style={styles.identificationLabel}>Org Emissor</Text>
                <View style={[styles.identificationLine, { width: 40 }]}/>
              </View>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>End. Completo</Text>
                <View style={styles.identificationLine}/>
              </View>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>Cidade</Text>
                <View style={[styles.identificationLine, { width: 100 }]}/>
                <Text style={styles.identificationLabel}>UF</Text>
                <View style={[styles.identificationLine, { width: 20 }]}/>
              </View>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>Telefone</Text>
                <View style={styles.identificationLine}/>
              </View>
            </View>

            <View style={styles.identificationCard}>
              <Text style={styles.identificationTitle}>IDENTIFICAÇÃO DO FORNECEDOR</Text>
              <View style={styles.pharmacistSignatureBlock}>
                <View style={styles.pharmacistSignatureLine}/>
                <Text style={styles.pharmacistSignatureLabel}>Assinatura do Farmacêutico</Text>
                <View style={styles.identificationDateLine}>
                  <Text style={styles.identificationLabel}>Data</Text>
                  <View style={styles.identificationDatePart}>
                    <View style={[styles.identificationLine, { width: 20 }]}/>
                    <Text style={styles.identificationDateSeparator}>/</Text>
                    <View style={[styles.identificationLine, { width: 20 }]}/>
                    <Text style={styles.identificationDateSeparator}>/</Text>
                    <View style={[styles.identificationLine, { width: 20 }]}/>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};