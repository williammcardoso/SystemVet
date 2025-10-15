import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { MedicationData } from "@/types/medication";
import { mockCompanySettings, mockUserSettings } from "@/mockData/settings"; // Importar as configurações
import { FaUser } from "react-icons/fa"; // Importação de react-icons

// Register Inter font with regular and bold weights
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCOgDWKxCtSlz05NdozHAYw.ttf", fontWeight: 400 }, // Regular
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCOgDWKxCtSlz05NdozHAYw.ttf", fontWeight: 700 }, // Bold
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Inter", // Use Inter as default font
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
    fontFamily: "Inter",
    fontWeight: "bold",
    marginBottom: 20,
  },
  // Style for the "1.ª VIA / 2.ª VIA" text, now flowing with content
  viaTextContainer: {
    textAlign: 'right',
    fontSize: 9,
    color: '#333',
    marginBottom: 10, // Space after the via text
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
    marginBottom: 5,
  },
  infoText: {
    fontSize: 10,
    marginBottom: 2,
  },
  // New style for full-width patient info for controlled prescriptions
  patientInfoControlled: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  patientInfoControlledTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
  },
  patientInfoControlledText: {
    fontSize: 10,
    marginBottom: 2,
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
  // New style for the signature line above the footer
  signatureLineContainer: {
    marginTop: 30,
    marginBottom: 20, // Space before the fixed footer
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signatureDateText: {
    fontSize: 10,
    color: "#333",
  },
  signatureBlockRight: {
    textAlign: 'center',
  },
  signatureLine: {
    width: 180, // Fixed width for the line
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 3,
  },
  signatureLabel: {
    fontSize: 9,
    color: "#333",
  },
  // Rodapé geral, agora com flex para duas colunas (para receitas simples)
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  // Estilo para o card de assinatura do veterinário no rodapé (para receitas simples)
  vetSignatureCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 5, // Espaço entre os cards
    textAlign: "center",
  },
  // Novos estilos para Receita Controlada (sem vermelho)
  controlledPrescriptionHeader: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // Borda preta/cinza
  },
  controlledPrescriptionTitle: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "#333", // Cor preta
    marginBottom: 15,
  },
  // Card do emitente (veterinário) no topo para receita controlada (sem vermelho)
  issuerVetCard: {
    borderWidth: 1,
    borderColor: "#ddd", // Borda preta/cinza
    borderRadius: 5,
    padding: 10,
    marginBottom: 20, // Espaço abaixo do card
    width: '48%', // Ocupa metade da largura para ficar ao lado do tutor
  },
  issuerVetTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333", // Cor preta
  },
  issuerVetText: {
    fontSize: 10,
    marginBottom: 2,
    color: "#333",
  },
  // Card de identificação do comprador/fornecedor (novo footer para controlada)
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
    marginTop: 10,
  },
  identificationDatePart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 5,
  },
  identificationDateSeparator: {
    marginHorizontal: 2,
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
  prescriptionType: 'simple' | 'controlled' | 'manipulated'; // Novo prop
  pharmacistName?: string; // Dados do farmacêutico
  pharmacistCpf?: string;
  pharmacistCfr?: string;
  pharmacistAddress?: string;
  pharmacistPhone?: string;
}

export const PrescriptionPdfContent = ({
  animalName,
  animalId,
  animalSpecies,
  tutorName,
  tutorAddress,
  medications,
  generalObservations,
  showElectronicSignatureText,
  prescriptionType, // Destructure new prop
  pharmacistName,
  pharmacistCpf,
  pharmacistCfr,
  pharmacistAddress,
  pharmacistPhone,
}: PrescriptionPdfContentProps) => {
  // Group medications by useType
  const groupedMedications = medications.reduce((acc: Record<string, MedicationData[]>, med) => {
    const useType = med.useType || "Outros";
    if (!acc[useType]) {
      acc[useType] = [];
    }
    acc[useType].push(med);
    return acc;
  }, {});

  const currentDate = new Date();

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        {/* Clinic Header */}
        <View style={styles.clinicHeader}>
          <View style={styles.clinicInfoLeft}>
            {/* <Image src="/public/placeholder.svg" style={{ width: 40, height: 40, marginRight: 10 }} /> */}
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
          </View>
        ) : (
          <Text style={styles.mainTitle}>Receita Simples</Text>
        )}

        {/* 1.ª VIA / 2.ª VIA for Controlled Prescriptions */}
        {prescriptionType === 'controlled' && (
          <View style={styles.viaTextContainer}>
            <Text>1.ª VIA - FARMÁCIA</Text>
            <Text>2.ª VIA - PACIENTE</Text>
          </View>
        )}

        {/* Issuer (Veterinarian) Info for Controlled Prescriptions at the top */}
        {prescriptionType === 'controlled' && (
          <View style={styles.infoSectionContainer}> {/* Using infoSectionContainer for layout */}
            <View style={styles.issuerVetCard}>
              <Text style={styles.issuerVetTitle}>Emitente (Veterinário)</Text>
              <Text style={styles.issuerVetText}>Nome: {mockUserSettings.signatureText}</Text>
              <Text style={styles.issuerVetText}>CRMV: {mockUserSettings.userCrmv}</Text>
              <Text style={styles.issuerVetText}>Registro MAPA: {mockUserSettings.userMapaRegistration}</Text>
            </View>
            {/* Empty card to maintain layout, or could be removed if not needed */}
            <View style={styles.infoCard}>
              {/* This space can be used for other info if needed, or removed */}
            </View>
          </View>
        )}

        {/* Patient/Proprietário/Endereço section (full width for controlled, or existing cards for simple) */}
        {prescriptionType === 'controlled' ? (
          <View style={styles.patientInfoControlled}>
            <Text style={styles.patientInfoControlledTitle}>Informações do Paciente/Proprietário</Text>
            <Text style={styles.patientInfoControlledText}>Paciente: {animalName}</Text>
            <Text style={styles.patientInfoControlledText}>Proprietário: {tutorName}</Text>
            <Text style={styles.patientInfoControlledText}>Endereço: {tutorAddress || "Não informado"}</Text>
          </View>
        ) : (
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

        {/* Medication List Grouped by Use Type */}
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
                      
                      if (name.length > 0 && concentration.length > 0) {
                        return `${name} ${concentration}`;
                      } else if (name.length > 0) {
                        return name;
                      } else if (concentration.length > 0) {
                        return concentration;
                      }
                      return 'Medicamento sem nome';
                    })()}
                  </Text>
                  <View style={styles.lineSeparator} />
                  <View style={styles.badgeContainer}>
                    {med.pharmacyType && (
                      <Text style={styles.pharmacyBadge}>
                        {med.pharmacyType === "Farmácia Veterinária" ? "VET" : "HUMANA"}
                      </Text>
                    )}
                    {med.totalQuantityDisplay && (
                      <Text style={styles.quantityBadge}>
                        {med.totalQuantityDisplay}
                      </Text>
                    )}
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

        {/* General Observations for the entire prescription */}
        {generalObservations && (
          <View style={styles.generalObservationsSection}>
            <Text style={styles.generalObservationsTitle}>Observações Gerais da Receita</Text>
            <Text style={styles.generalObservationsText}>{generalObservations}</Text>
          </View>
        )}

        {/* Signature Line (Vet) - Flows with content */}
        <View style={styles.signatureLineContainer} break> {/* Use break to ensure it's at the bottom of the current page or new page */}
          <Text style={styles.signatureDateText}>Data: {formatDateToPortuguese(currentDate)}</Text>
          <View style={styles.signatureBlockRight}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Assinatura</Text>
          </View>
        </View>

        {/* FIXED FOOTER - Conditional based on prescriptionType */}
        {prescriptionType === 'controlled' ? (
          <View style={styles.identificationCardContainer} fixed>
            <View style={styles.identificationCard}>
              <Text style={styles.identificationTitle}>IDENTIFICAÇÃO DO COMPRADOR</Text>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>Nome completo</Text>
                <View style={styles.identificationLine} />
              </View>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>Ident.</Text>
                <View style={[styles.identificationLine, { width: 80 }]} /> {/* Adjusted width */}
                <Text style={styles.identificationLabel}>Org Emissor</Text>
                <View style={[styles.identificationLine, { width: 40 }]} /> {/* Adjusted width */}
              </View>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>End. Completo</Text>
                <View style={styles.identificationLine} />
              </View>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>Telefone</Text>
                <View style={styles.identificationLine} />
              </View>
              <View style={styles.identificationField}>
                <Text style={styles.identificationLabel}>Cidade</Text>
                <View style={[styles.identificationLine, { width: 100 }]} /> {/* Adjusted width */}
                <Text style={styles.identificationLabel}>UF</Text>
                <View style={[styles.identificationLine, { width: 20 }]} /> {/* Adjusted width */}
              </View>
            </View>

            <View style={styles.identificationCard}>
              <Text style={styles.identificationTitle}>IDENTIFICAÇÃO DO FORNECEDOR</Text>
              <View style={{ marginTop: 20, marginBottom: 20 }}>
                <View style={styles.identificationLine} />
                <Text style={styles.identificationLabel}>Assinatura do Farmacêutico</Text>
              </View>
              <View style={styles.identificationDateLine}>
                <Text style={styles.identificationLabel}>Data</Text>
                <View style={styles.identificationDatePart}>
                  <View style={[styles.identificationLine, { width: 20 }]} />
                  <Text style={styles.identificationDateSeparator}>/</Text>
                  <View style={[styles.identificationLine, { width: 20 }]} />
                  <Text style={styles.identificationDateSeparator}>/</Text>
                  <View style={[styles.identificationLine, { width: 20 }]} />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer} fixed>
            {/* Card de Assinatura do Veterinário (para receitas simples) */}
            <View style={styles.vetSignatureCard}>
              <Text style={styles.signatureDate}>
                {formatDateToPortuguese(currentDate)}
              </Text>
              {showElectronicSignatureText && (
                <Text style={styles.signatureText}>Assinado eletronicamente por</Text>
              )}
              <Text style={styles.signatureName}>{mockUserSettings.signatureText}</Text>
              <Text style={styles.clinicDetails}>CRMV {mockUserSettings.userCrmv}</Text>
              <Text style={styles.clinicDetails}>Registro no MAPA {mockUserSettings.userMapaRegistration}</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};