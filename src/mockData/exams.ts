import { ExamEntry } from "@/types/exam";

export let mockExams: ExamEntry[] = [
  {
    id: "exam1",
    date: "2024-07-20",
    time: "10:30",
    type: "Hemograma Completo",
    vet: "Dr. Silva",
    material: "SANGUE COM E.D.T.A.",
    equipamento: "Mindray BC-2800Vet",
    eritrocitos: "6.2",
    hemoglobina: "14.5",
    hematocrito: "43.0",
    vcm: "69.4",
    hcm: "23.4",
    chcm: "33.7",
    rdw: "12.5", // Adicionado RDW
    proteinaTotal: "7.2",
    hemaciasNucleadas: "0",
    observacoesSerieVermelha: "Discreta anisocitose.",
    leucocitosTotais: "9.5",
    mielocitosRelativo: "0",
    mielocitosAbsoluto: "0",
    metamielocitosRelativo: "0",
    metamielocitosAbsoluto: "0",
    bastonetesRelativo: "1",
    bastonetesAbsoluto: "95",
    segmentadosRelativo: "65",
    segmentadosAbsoluto: "6175",
    eosinofilosRelativo: "3",
    eosinofilosAbsoluto: "285",
    basofilosRelativo: "0",
    basofilosAbsoluto: "0",
    linfocitosRelativo: "25",
    linfocitosAbsoluto: "2375",
    monocitosRelativo: "6",
    monocitosAbsoluto: "570",
    observacoesSerieBranca: "Sem alterações significativas.",
    contagemPlaquetaria: "280.000",
    avaliacaoPlaquetaria: "Adequada.",
    nota: "Exame dentro dos padrões de normalidade para a espécie.",
    laboratory: "Laboratório Central Vet",
    laboratoryDate: "2024-07-21",
    observacoesGeraisExame: "Recomendado repetir em 6 meses.",
    liberadoPor: "WILLIAM DE MORAES CARDOSO CRMV-SP 56895",
  },
  {
    id: "exam2",
    date: "2024-07-15",
    time: "14:00",
    type: "Exame de Fezes",
    vet: "Dra. Costa",
    result: "Negativo para parasitas.",
    observacoesGeraisExame: "Animal saudável.",
    liberadoPor: "WILLIAM DE MORAES CARDOSO CRMV-SP 56895",
  },
  {
    id: "exam3",
    date: "2024-07-22",
    time: "09:00",
    type: "Hemograma Completo",
    vet: "Dr. Souza",
    material: "SANGUE COM E.D.T.A.",
    equipamento: "Mindray BC-2800Vet",
    eritrocitos: "4.0", // Baixo
    hemoglobina: "10.0", // Baixo
    hematocrito: "30.0", // Baixo
    vcm: "75.0",
    hcm: "25.0",
    chcm: "33.3",
    rdw: "15.0", // Adicionado RDW
    proteinaTotal: "6.5",
    hemaciasNucleadas: "0",
    observacoesSerieVermelha: "Anemia leve.",
    leucocitosTotais: "20.0", // Alto
    mielocitosRelativo: "0",
    mielocitosAbsoluto: "0",
    metamielocitosRelativo: "0",
    metamielocitosAbsoluto: "0",
    bastonetesRelativo: "5", // Alto
    bastonetesAbsoluto: "1000", // Alto
    segmentadosRelativo: "70",
    segmentadosAbsoluto: "14000",
    eosinofilosRelativo: "8",
    eosinofilosAbsoluto: "1600",
    basofilosRelativo: "0",
    basofilosAbsoluto: "0",
    linfocitosRelativo: "15",
    linfocitosAbsoluto: "3000",
    monocitosRelativo: "2",
    monocitosAbsoluto: "400",
    observacoesSerieBranca: "Leucocitose com desvio à esquerda.",
    contagemPlaquetaria: "100.000", // Baixo
    avaliacaoPlaquetaria: "Trombocitopenia.",
    nota: "Indicativo de processo inflamatório/infeccioso e anemia.",
    laboratory: "Laboratório Central Vet",
    laboratoryDate: "2024-07-23",
    observacoesGeraisExame: "Recomendado exames complementares para investigação da anemia e inflamação.",
    liberadoPor: "WILLIAM DE MORAES CARDOSO CRMV-SP 56895",
  },
];

export const addMockExam = (newExam: Omit<ExamEntry, 'id'>) => {
  const newId = `exam${mockExams.length + 1}`;
  mockExams.push({ ...newExam, id: newId });
};

export const updateMockExam = (updatedExam: ExamEntry) => {
  const index = mockExams.findIndex(e => e.id === updatedExam.id);
  if (index !== -1) {
    mockExams[index] = updatedExam;
    return true;
  }
  return false;
};