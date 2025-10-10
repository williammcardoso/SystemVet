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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Distribute content and footer
  },
  headerSection: {
    marginBottom: 20,
  },
  clinicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  clinicInfoLeft: {
    flexDirection: "column",
    width: "60%",
  },
  clinicInfoRight: {
    flexDirection: "column",
    width: "40%",
    textAlign: "right",
    fontSize: 10,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  clinicDetails: {
    fontSize: 10,
    marginBottom: 2,
  },
  prescriptionTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  patientInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  patientInfoBox: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
  },
  patientInfoTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  patientInfoText: {
    fontSize: 10,
    marginBottom: 2,
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
  medicationGroupTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  medicationItemText: { // Novo estilo para o item de medicamento simplificado
    fontSize: 12,
    marginBottom: 5,
  },
  medicationName: { // Mantido para consistência, mas o estilo será aplicado diretamente no medicationItemText
    fontWeight: "bold",
  },
  observationsSection: {
    marginTop: 20,
  },
  observationsText: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#555",
  },
  vetSignature: {
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 2,
  },
});

interface ClinicInfo {
  name: string;
  crmv: string;
  mapaRegistro: string;
  address: string;
  cep: string;
  phone: string;
}

interface ClientDetails {
  id: string;
  name: string;
  address: string;
}

interface AnimalDetails {
  id: string;
  name: string;
  species: string;
}

interface VetInfo {
  name: string;
  crmv: string;
  mapaRegistro: string;
}

interface PrescriptionPdfDocumentProps {
  clinicInfo: ClinicInfo;
  clientDetails?: ClientDetails;
  animalDetails?: AnimalDetails;
  medications: MedicationData[];
  generalObservations: string;
  vetInfo: VetInfo;
}

const PrescriptionPdfDocument: React.FC<PrescriptionPdfDocumentProps> = ({
  clinicInfo,
  clientDetails,
  animalDetails,
  medications,
  generalObservations,
  vetInfo,
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

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  // Adicionando console.log para depuração
  console.log("Medications received in PDF document:", medications);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View> {/* Main content wrapper */}
          <View style={styles.headerSection}>
            <View style={styles.clinicHeader}>
              <View style={styles.clinicInfoLeft}>
                <Text style={styles.clinicName}>{clinicInfo.name}</Text>
                <Text style={styles.clinicDetails}>CRMV {clinicInfo.crmv}</Text>
                <Text style={styles.clinicDetails}>Registro no MAPA {clinicInfo.mapaRegistro}</Text>
              </View>
              <View style={styles.clinicInfoRight}>
                <Text>{clientDetails?.address || clinicInfo.address}</Text> {/* Use client address if available, else clinic */}
                <Text>{clinicInfo.cep}</Text>
                <Text>Telefone: {clinicInfo.phone}</Text>
              </View>
            </View>

            <Text style={styles.prescriptionTitle}>Receita Simples</Text>

            <View style={styles.patientInfoContainer}>
              <View style={styles.patientInfoBox}>
                <Text style={styles.patientInfoTitle}>Animal</Text>
                <Text style={styles.patientInfoText}>ID: {animalDetails?.id || "Não informado"}</Text>
                <Text style={styles.patientInfoText}>Nome: {animalDetails?.name || "Não informado"}</Text>
                <Text style={styles.patientInfoText}>Espécie: {animalDetails?.species || "Não informado"}</Text>
              </View>
              <View style={styles.patientInfoBox}>
                <Text style={styles.patientInfoTitle}>Tutor</Text>
                <Text style={styles.patientInfoText}>Nome: {clientDetails?.name || "Não informado"}</Text>
                <Text style={styles.patientInfoText}>Endereço: {clientDetails?.address || "Não informado"}</Text>
              </View>
            </View>
          </View>

          {Object.keys(groupedMedications).length > 0 ? (
            Object.keys(groupedMedications).map((useType) => (
              <View key={useType}>
                <Text style={styles.medicationGroupTitle}>{useType}</Text>
                {groupedMedications[useType].map((med, index) => {
                  const medicationNameContent = (med.medicationName || "Medicamento sem nome").trim();
                  console.log(`Rendering medication ${index + 1}: ${medicationNameContent}`);
                  return (
                    <Text key={med.id} style={styles.medicationItemText}>
                      {(index + 1).toString()}) {medicationNameContent}
                    </Text>
                  );
                })}
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#888' }}>
              Nenhum medicamento adicionado à receita.
            </Text>
          )}

          {generalObservations && (
            <View style={styles.observationsSection}>
              <Text style={styles.sectionTitle}>Observações Gerais</Text>
              <Text style={styles.observationsText}>{generalObservations}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed> {/* Footer section */}
          <Text>{currentDate}</Text>
          <Text>Assinado eletronicamente por</Text>
          <Text style={styles.vetSignature}>{vetInfo.name}</Text>
          <Text>CRMV {vetInfo.crmv}</Text>
          <Text>Registro no MAPA {vetInfo.mapaRegistro}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PrescriptionPdfDocument;