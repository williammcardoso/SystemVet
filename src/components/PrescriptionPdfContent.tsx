import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { MedicationData } from "@/types/medication";
import { mockCompanySettings, mockUserSettings } from "@/mockData/settings"; // Importar as configurações

// Register Roboto font with regular and bold weights
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.ttf", fontWeight: 400 }, // Regular
    { src: "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc4.ttf", fontWeight: 700 }, // Bold
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Roboto", // Use Roboto as default font
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
    fontFamily: "Roboto", // Use Roboto as default font
    fontWeight: "bold",
    marginBottom: 20,
  },
  viaTextContainer: {
    textAlign: 'right',
    fontSize: 9,
    color: '#333',
    marginBottom: 10,
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
  signatureLineContainer: {
    marginTop: 30,
    marginBottom: 20,
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
    width: 180,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 3,
  },
  signatureLabel: {
    fontSize: 9,
    color: "#333",
  },
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
  vetSignatureCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
    textAlign: "center",
  },
  controlledPrescriptionHeader: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  controlledPrescriptionTitle: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Roboto", // Use Roboto as default font
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  issuerVetCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
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
          </View>
        ) : (
          <Text style={styles.mainTitle}>Receita Simples</Text>
        )}

        {prescriptionType === 'controlled' && (
          <View style={styles.viaTextContainer}>
            <Text>1.ª VIA - FARMÁCIA</Text>
            <Text>2.ª VIA - PACIENTE</Text>
          </View>
        )}

        {prescriptionType === 'controlled' && (
          <View style={styles.infoSectionContainer}>
            <View style={styles.issuerVetCard}>
              <Text style={styles.issuerVetTitle}>Emitente (Veterinário)</Text>
              <Text style={styles.issuerVetText}>Nome: {mockUserSettings.signatureText}</Text>
              <Text style={styles.issuerVetText}>CRMV: {mockUserSettings.userCrmv}</Text>
              <Text style={styles.issuerVetText}>Registro MAPA: {mockUserSettings.userMapaRegistration}</Text>
            </View>
            <View style={styles.infoCard}>
              {/* This space can be used for other info if needed, or removed */}
            </View>
          </View>
        )}

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
                  <View style={styles.lineSeparator} />
                  <View style={styles.badgeContainer}>
                    {med.pharmacyType && (<Text style={styles.pharmacyBadge}>{med.pharmacyType === "Farmácia Veterinária" ? "VET" : "HUMANA"}</Text>)}
                    {med.totalQuantityDisplay && (<Text style={styles.quantityBadge}>{med.totalQuantityDisplay}</Text>)}
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

        {generalObservations && (
          <View style={styles.generalObservationsSection}>
            <Text style={styles.generalObservationsTitle}>Observações Gerais da Receita</Text>
            <Text style={styles.generalObservationsText}>{generalObservations}</Text>
          </View>
        )}

        <View style={styles.signatureLineContainer} break>
          <Text style={styles.signatureDateText}>Data: {formatDateToPortuguese(currentDate)}</Text>
          <View style={styles.signatureBlockRight}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Assinatura</Text>
          </View>
        </View>

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
                <View style={[styles.identificationLine, { width: 80 }]} />
                <Text style={styles.identificationLabel}>Org Emissor</Text>
                <View style={[styles.identificationLine, { width: 40 }]} />
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
                <View style={[styles.identificationLine, { width: 100 }]} />
                <Text style={styles.identificationLabel}>UF</Text>
                <View style={[styles.identificationLine, { width: 20 }]} />
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