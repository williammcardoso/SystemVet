import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { MedicationData } from "@/types/medication";

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
  signatureFooter: {
    marginTop: 30, // Adiciona margem superior para separar do conteúdo
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
});

// Helper function to format date
const formatDateToPortuguese = (date) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('pt-BR', options);
  return formattedDate.toUpperCase();
};

/**
 * @typedef {object} PrescriptionPdfContentProps
 * @property {string} animalName
 * @property {string} animalId
 * @property {string} animalSpecies
 * @property {string} tutorName
 * @property {string} tutorAddress
 * @property {MedicationData[]} medications
 * @property {string} generalObservations
 */

/**
 * Exporta uma função que retorna o JSX do PDF, não um React.FC
 * @param {PrescriptionPdfContentProps} props
 */
export const PrescriptionPdfContent = ({
  animalName,
  animalId,
  animalSpecies,
  tutorName,
  tutorAddress,
  medications,
  generalObservations,
}) => {
  // Group medications by useType
  const groupedMedications = medications.reduce((acc, med) => {
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
                    <Text style={styles.clinicName}>Clínica Moraes Cardoso</Text>
                    <Text style={styles.clinicDetails}>CRMV 56895 SP</Text>
                    <Text style={styles.clinicDetails}>Registro no MAPA MV0052750203</Text>
                  </View>
                </View>
                <View style={styles.clinicAddressPhone}>
                  <Text>Rua Campos Salles, 175, Centro</Text>
                  <Text>Itapira - CEP: 13970-170</Text>
                  <Text>Telefone: (19) 99363-1981</Text>
                </View>
              </View>

              <Text style={styles.mainTitle}>Receita Simples</Text>

              {/* Animal and Tutor Info */}
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
                              const name = med.medicationName?.trim() || '';
                              const concentration = med.concentration?.trim() || '';
                              
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

              {/* FOOTER - Assinatura condicional na última página */}
              {pageNumber === totalPages && (
                <View style={styles.signatureFooter}>
                  <Text style={styles.signatureDate}>
                    {formatDateToPortuguese(currentDate)}
                  </Text>
                  <Text style={styles.signatureText}>Assinado eletronicamente por</Text>
                  <Text style={styles.signatureName}>Dr. William Cardoso</Text>
                  <Text style={styles.clinicDetails}>CRMV 56895/SP</Text>
                  <Text style={styles.clinicDetails}>Registro no MAPA MV0052750203</Text>
                </View>
              )}
            </>
          );
        }}
      </Page>
    </Document>
  );
};