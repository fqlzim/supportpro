export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  description: string;
  priority: "baixa" | "media" | "alta" | "critica";
  technician: string;
  status: "aberto" | "em_andamento" | "finalizado";
  timeSpent: number; // minutes
  rating?: number;
  ratingComment?: string;
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  ticketsResolved: number;
  avgTime: number;
  rating: number;
}

export const clients: Client[] = [
  { id: "1", name: "Ana Silva", email: "ana@empresa.com", phone: "(11) 99999-1234", company: "TechCorp", createdAt: "2025-01-15" },
  { id: "2", name: "Carlos Oliveira", email: "carlos@startup.io", phone: "(21) 98888-5678", company: "StartupIO", createdAt: "2025-02-01" },
  { id: "3", name: "Marina Santos", email: "marina@global.com", phone: "(31) 97777-9012", company: "GlobalTech", createdAt: "2025-02-10" },
  { id: "4", name: "Roberto Lima", email: "roberto@data.com", phone: "(41) 96666-3456", company: "DataSoft", createdAt: "2025-03-01" },
  { id: "5", name: "Juliana Costa", email: "juliana@net.com", phone: "(51) 95555-7890", company: "NetSolutions", createdAt: "2025-03-15" },
];

export const technicians: Technician[] = [
  { id: "1", name: "Pedro Mendes", avatar: "PM", ticketsResolved: 45, avgTime: 35, rating: 4.8 },
  { id: "2", name: "Lucas Ferreira", avatar: "LF", ticketsResolved: 38, avgTime: 42, rating: 4.5 },
  { id: "3", name: "Fernanda Rocha", avatar: "FR", ticketsResolved: 52, avgTime: 28, rating: 4.9 },
  { id: "4", name: "Thiago Almeida", avatar: "TA", ticketsResolved: 30, avgTime: 50, rating: 4.2 },
];

export const tickets: Ticket[] = [
  { id: "T-001", clientId: "1", clientName: "Ana Silva", date: "2026-02-10", description: "Sistema não carrega após atualização", priority: "alta", technician: "Pedro Mendes", status: "aberto", timeSpent: 0 },
  { id: "T-002", clientId: "2", clientName: "Carlos Oliveira", date: "2026-02-09", description: "Erro de conexão com banco de dados", priority: "critica", technician: "Fernanda Rocha", status: "em_andamento", timeSpent: 45 },
  { id: "T-003", clientId: "3", clientName: "Marina Santos", date: "2026-02-08", description: "Lentidão no módulo de relatórios", priority: "media", technician: "Lucas Ferreira", status: "finalizado", timeSpent: 120, rating: 5, ratingComment: "Excelente atendimento!" },
  { id: "T-004", clientId: "4", clientName: "Roberto Lima", date: "2026-02-07", description: "Tela de login não responde", priority: "alta", technician: "Pedro Mendes", status: "finalizado", timeSpent: 60, rating: 4, ratingComment: "Resolvido rápido" },
  { id: "T-005", clientId: "5", clientName: "Juliana Costa", date: "2026-02-06", description: "Impressora não conecta na rede", priority: "baixa", technician: "Thiago Almeida", status: "aberto", timeSpent: 0 },
  { id: "T-006", clientId: "1", clientName: "Ana Silva", date: "2026-02-05", description: "E-mail corporativo fora do ar", priority: "critica", technician: "Fernanda Rocha", status: "finalizado", timeSpent: 30, rating: 5 },
  { id: "T-007", clientId: "2", clientName: "Carlos Oliveira", date: "2026-02-04", description: "Backup não executou corretamente", priority: "alta", technician: "Lucas Ferreira", status: "em_andamento", timeSpent: 90 },
  { id: "T-008", clientId: "3", clientName: "Marina Santos", date: "2026-02-03", description: "Software de CRM travando", priority: "media", technician: "Pedro Mendes", status: "finalizado", timeSpent: 75, rating: 4 },
  { id: "T-009", clientId: "4", clientName: "Roberto Lima", date: "2026-02-02", description: "Configurar VPN para home office", priority: "baixa", technician: "Thiago Almeida", status: "finalizado", timeSpent: 40, rating: 3 },
  { id: "T-010", clientId: "5", clientName: "Juliana Costa", date: "2026-02-01", description: "Atualização de antivírus em 50 máquinas", priority: "media", technician: "Fernanda Rocha", status: "em_andamento", timeSpent: 200 },
];

export const goals = {
  monthlyTickets: { target: 60, actual: 45 },
  avgResolutionTime: { target: 40, actual: 52 },
  satisfactionRate: { target: 95, actual: 88 },
  firstContactResolution: { target: 80, actual: 72 },
};
