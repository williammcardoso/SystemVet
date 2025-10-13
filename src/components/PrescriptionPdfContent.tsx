import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { MedicationData } from "@/types/medication";
import { mockCompanySettings, mockUserSettings } from "@/mockData/settings"; // Importar as configurações
import { FaUser } from "react-icons/fa"; // Importação de react-icons

// Register a font if needed (e.g., for custom fonts or if default is not working)
// Font.register({ family: "Roboto", src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica", // Default font
    fontSize: 10,
    color: "#333",
  },
  mainContentContainer: {
    // This view will contain all content that flows across pages
    // It will automatically break into new pages if content is too long
    marginBottom: 140, // Aumenta a margem inferior para dar mais espaço ao rodapé da assinatura
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
    marginBottom: 5,
  },
  infoText: {
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
  // Rodapé geral, agora com flex para duas colunas
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
  // Estilo para o card de assinatura do veterinário no rodapé
  vetSignatureCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 5, // Espaço entre os cards
    textAlign: "center",
  },
  signatureDate: {
    fontSize: 10,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    marginBottom: 2,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  // Novos estilos para Receita Controlada
  controlledPrescriptionHeader: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f00", // Borda vermelha para destacar
  },
  controlledPrescriptionTitle: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "#f00",
    marginBottom: 15,
  },
  // Card do emitente (veterinário) no topo para receita controlada
  issuerVetCard: {
    borderWidth: 1,
    borderColor: "#f00",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20, // Espaço abaixo do card
    width: '48%', // Ocupa metade da largura para ficar ao lado do tutor
  },
  issuerVetTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f00",
  },
  issuerVetText: {
    fontSize: 10,
    marginBottom: 2,
    color: "#333",
  },
  // Card do farmacêutico no rodapé para receita controlada
  pharmacistSignatureCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f00",
    borderRadius: 5,
    padding: 10,
    marginLeft: 5, // Espaço entre os cards
    textAlign: "center",
  },
  pharmacistSignatureTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f00",
  },
  pharmacistSignatureText: {
    fontSize: 10,
    marginBottom: 2,
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
        render={({ pageNumber, totalPages }) => {
          return (
            <>
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
                  <Text style={styles.controlledPrescriptionTitle}>RECEITA DE CONTROLE ESPECIAL</Text>
                </View>
              ) : (
                <Text style={styles.mainTitle}>Receita Simples</Text>
              )}

              {/* Issuer (Veterinarian) Info for Controlled Prescriptions at the top */}
              {prescriptionType === 'controlled' && (
                <View style={styles.infoSectionContainer}> {/* Usar infoSectionContainer para layout de duas colunas */}
                  <View style={styles.issuerVetCard}>
                    <Text style={styles.issuerVetTitle}>Emitente (Veterinário)</Text>
                    <Text style={styles.issuerVetText}>Nome: {mockUserSettings.signatureText}</Text>
                    <Text style={styles.issuerVetText}>CRMV: {mockUserSettings.userCrmv}</Text>
                    <Text style={styles.issuerVetText}>Registro MAPA: {mockUserSettings.userMapaRegistration}</Text>
                  </View>
                  {/* Animal and Tutor Info - Mantido aqui para preencher a segunda coluna do topo */}
                  <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Animal</Text>
                    <Text style={styles.infoText}>ID: {animalId}</Text>
                    <Text style={styles.infoText}>Nome: {animalName}</Text>
                    <Text style={styles.infoText}>Espécie: {animalSpecies}</Text>
                  </View>
                </View>
              )}

              {/* Animal and Tutor Info (for simple prescriptions, or as a separate card for controlled) */}
              {prescriptionType !== 'controlled' && (
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
              {/* Para receita controlada, o tutor é o "comprador" e já está no card do animal acima */}
              {prescriptionType === 'controlled' && (
                <View style={styles.infoSectionContainer}>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Tutor (Comprador)</Text>
                    <Text style={styles.infoText}>Nome: {tutorName}</Text>
                    <Text style={styles.infoText}>Endereço: {tutorAddress || "Não informado"}</Text>
                  </View>
                  <View style={styles.infoCard}>
                    {/* Espaço vazio ou informações adicionais se necessário */}
                  </View>
                </View>
              )}


              {/* Main Content that flows across pages */}
              <View style={styles.mainContentContainer}>
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
              </View>

              {/* FOOTER - Assinatura e dados do farmacêutico */}
              {pageNumber === totalPages && (
                <View style={styles.footerContainer}>
                  {/* Card de Assinatura do Veterinário */}
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

                  {/* Card de Dados do Farmacêutico (apenas para receita controlada) */}
                  {prescriptionType === 'controlled' && (
                    <View style={styles.pharmacistSignatureCard}>
                      <Text style={styles.pharmacistSignatureTitle}>Farmacêutico</Text>
                      <Text style={styles.pharmacistSignatureText}>Nome: {pharmacistName || "Não informado"}</Text>
                      <Text style={styles.pharmacistSignatureText}>CPF: {pharmacistCpf || "Não informado"}</Text>
                      <Text style={styles.pharmacistSignatureText}>CRF: {pharmacistCfr || "Não informado"}</Text>
                      <Text style={styles.pharmacistSignatureText}>Endereço: {pharmacistAddress || "Não informado"}</Text>
                      <Text style={styles.pharmacistSignatureText}>Telefone: {pharmacistPhone || "Não informado"}</Text>
                    </View>
                  )}
                </View>
              )}
            </>
          );
        }}
      />
    </Document>
  );
};