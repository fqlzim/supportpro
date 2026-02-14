import {
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Star,
  Target,
} from "lucide-react";
import { tickets, technicians, goals } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/AppLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const priorityColors: Record<string, string> = {
  baixa: "hsl(142 71% 45%)",
  media: "hsl(38 92% 50%)",
  alta: "hsl(25 95% 53%)",
  critica: "hsl(0 72% 51%)",
};

const statusColors = ["hsl(185 70% 45%)", "hsl(38 92% 50%)", "hsl(142 71% 45%)"];

export default function Dashboard() {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "aberto").length;
  const inProgressTickets = tickets.filter((t) => t.status === "em_andamento").length;
  const closedTickets = tickets.filter((t) => t.status === "finalizado").length;
  const finishedTickets = tickets.filter((t) => t.status === "finalizado");
  const avgTime =
    finishedTickets.length > 0
      ? Math.round(finishedTickets.reduce((acc, t) => acc + t.timeSpent, 0) / finishedTickets.length)
      : 0;
  const resolutionRate = Math.round((closedTickets / totalTickets) * 100);

  const statusData = [
    { name: "Abertos", value: openTickets },
    { name: "Em Andamento", value: inProgressTickets },
    { name: "Finalizados", value: closedTickets },
  ];

  const techData = technicians
    .sort((a, b) => b.ticketsResolved - a.ticketsResolved)
    .map((t) => ({ name: t.name.split(" ")[0], resolvidos: t.ticketsResolved, avaliacao: t.rating }));

  const stats = [
    { label: "Total de Chamados", value: totalTickets, icon: Ticket, color: "text-accent" },
    { label: "Abertos", value: openTickets, icon: AlertTriangle, color: "text-warning" },
    { label: "Finalizados", value: closedTickets, icon: CheckCircle, color: "text-success" },
    { label: "Tempo Médio (min)", value: avgTime, icon: Clock, color: "text-info" },
    { label: "Taxa de Resolução", value: `${resolutionRate}%`, icon: TrendingUp, color: "text-accent" },
  ];

  const goalsData = [
    { label: "Chamados/Mês", target: goals.monthlyTickets.target, actual: goals.monthlyTickets.actual, unit: "" },
    { label: "Tempo Médio", target: goals.avgResolutionTime.target, actual: goals.avgResolutionTime.actual, unit: "min" },
    { label: "Satisfação", target: goals.satisfactionRate.target, actual: goals.satisfactionRate.actual, unit: "%" },
    { label: "Resolução 1º Contato", target: goals.firstContactResolution.target, actual: goals.firstContactResolution.actual, unit: "%" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral do suporte técnico</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <Card key={i} className="shadow-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Pie */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Chamados por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={statusColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Technician Ranking */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Ranking de Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="resolvidos" fill="hsl(185 70% 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" /> Metas x Realizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {goalsData.map((g, i) => {
                const pct = Math.min(100, Math.round((g.actual / g.target) * 100));
                const hit = pct >= 100;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{g.label}</span>
                      <span className={hit ? "text-success font-semibold" : "text-muted-foreground"}>
                        {g.actual}{g.unit} / {g.target}{g.unit}
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Technician Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" /> Detalhes dos Técnicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {technicians.sort((a, b) => b.ticketsResolved - a.ticketsResolved).map((t, i) => (
                <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.ticketsResolved} resolvidos · Média {t.avgTime}min</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                    <span className="text-sm font-semibold text-foreground">{t.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
