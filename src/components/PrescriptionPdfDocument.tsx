"use client";

import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import { MedicationData } from "./PrescriptionMedicationForm";

// Register a font if needed (e.g., for custom fonts or if default is not working)
// Font.register({ family: "Roboto", src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica", // Default font
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  clientInfo: {
    fontSize: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 4,
  },
  medicationItem: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  medicationNumber: {
    fontSize: 12,
    marginRight: 5,
    width: 15, // Fixed width for numbering
  },
  medicationDetails: {
    flexGrow: 1,
    fontSize: 12,
  },
  medicationName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  medicationInstructions: {
    fontSize: 10,
    color: "#555",
  },
  pharmacyTypeBadge: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    color: "#333",
    marginLeft: 10,
    marginRight: 10,
    alignSelf: "center",
  },
  totalQuantityBadge: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    color: "#333",
    alignSelf: "center",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    flexGrow: 1,
    height: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  observationsSection: {
    marginTop: 20,
  },
  observationsText: {
    fontSize: 12,
    lineHeight: 1.5,
  },
});

interface PrescriptionPdfDocumentProps {
  clientName: string;
  medications: MedicationData[];
  generalObservations: string;
}

const PrescriptionPdfDocument: React.FC<PrescriptionPdfDocumentProps> = ({
  clientName,
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
  }, {} as Record<string, MedicationData[]>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Receita Médica</Text>
        <Text style={styles.clientInfo}>
          Paciente: <Text style={{ fontWeight: "bold" }}>{clientName || "Não informado"}</Text>
        </Text>

        {Object.keys(groupedMedications).map((useType) => (
          <View key={useType}>
            <Text style={styles.sectionTitle}>{useType}</Text>
            {groupedMedications[useType].map((med, index) => (
              <View key={med.id} style={styles.medicationItem}>
                <Text style={styles.medicationNumber}>{index + 1})</Text>
                <View style={styles.medicationDetails}>
                  <View style={styles.flexRowCenter}>
                    <Text style={styles.medicationName}>
                      {med.medicationName} {med.concentration && med.concentration}
                    </Text>
                    <View style={styles.line} />
                    {med.pharmacyType && (
                      <Text style={styles.pharmacyTypeBadge}>
                        {med.pharmacyType === "Farmácia Veterinária" ? "VET" : "HUMANA"}
                      </Text>
                    )}
                    {med.totalQuantityDisplay && (
                      <Text style={styles.totalQuantityBadge}>
                        {med.totalQuantityDisplay}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.medicationInstructions}>
                    {med.generatedInstructions}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        {generalObservations && (
          <View style={styles.observationsSection}>
            <Text style={styles.sectionTitle}>Observações Gerais</Text>
            <Text style={styles.observationsText}>{generalObservations}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default PrescriptionPdfDocument;