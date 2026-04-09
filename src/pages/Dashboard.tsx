import {
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Star,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
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
  AreaChart,
  Area,
} from "recharts";

const statusColors = [
  "hsl(var(--warning))",
  "hsl(var(--info))",
  "hsl(var(--success))",
];

const priorityData = [
  { name: "Baixa", value: tickets.filter((t) => t.priority === "baixa").length, color: "hsl(var(--success))" },
  { name: "Média", value: tickets.filter((t) => t.priority === "media").length, color: "hsl(var(--warning))" },
  { name: "Alta", value: tickets.filter((t) => t.priority === "alta").length, color: "hsl(25 95% 53%)" },
  { name: "Crítica", value: tickets.filter((t) => t.priority === "critica").length, color: "hsl(var(--destructive))" },
];

// Simulated weekly trend data
const weeklyTrend = [
  { day: "Seg", abertos: 3, resolvidos: 2 },
  { day: "Ter", abertos: 5, resolvidos: 4 },
  { day: "Qua", abertos: 2, resolvidos: 3 },
  { day: "Qui", abertos: 4, resolvidos: 5 },
  { day: "Sex", abertos: 6, resolvidos: 4 },
  { day: "Sáb", abertos: 1, resolvidos: 2 },
  { day: "Dom", abertos: 0, resolvidos: 1 },
];

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
    { label: "Total de Chamados", value: totalTickets, icon: Ticket, color: "bg-primary/10 text-primary", trend: "+12%", up: true },
    { label: "Abertos", value: openTickets, icon: AlertTriangle, color: "bg-warning/10 text-warning", trend: "-5%", up: false },
    { label: "Em Andamento", value: inProgressTickets, icon: Activity, color: "bg-info/10 text-info", trend: "+3%", up: true },
    { label: "Finalizados", value: closedTickets, icon: CheckCircle, color: "bg-success/10 text-success", trend: "+18%", up: true },
    { label: "Tempo Médio", value: `${avgTime}min`, icon: Clock, color: "bg-primary/10 text-primary", trend: "-8%", up: false },
  ];

  const goalsData = [
    { label: "Chamados/Mês", target: goals.monthlyTickets.target, actual: goals.monthlyTickets.actual, unit: "", icon: Target },
    { label: "Tempo Médio", target: goals.avgResolutionTime.target, actual: goals.avgResolutionTime.actual, unit: "min", icon: Clock },
    { label: "Satisfação", target: goals.satisfactionRate.target, actual: goals.satisfactionRate.actual, unit: "%", icon: Star },
    { label: "Resolução 1º Contato", target: goals.firstContactResolution.target, actual: goals.firstContactResolution.actual, unit: "%", icon: CheckCircle },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Visão geral do suporte técnico</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-success" />
            <span className="font-medium text-success">Sistema operacional</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <Card
              key={i}
              className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${s.up ? "text-success" : "text-destructive"}`}>
                    {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {s.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Weekly Trend */}
          <Card className="md:col-span-2 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Tendência Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend}>
                    <defs>
                      <linearGradient id="gradAbertos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradResolvidos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area type="monotone" dataKey="abertos" stroke="hsl(var(--warning))" fill="url(#gradAbertos)" strokeWidth={2} name="Abertos" />
                    <Area type="monotone" dataKey="resolvidos" stroke="hsl(var(--success))" fill="url(#gradResolvidos)" strokeWidth={2} name="Resolvidos" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Pie */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={statusColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-1">
                {statusData.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px]">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColors[i] }} />
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-bold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Technician Ranking */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Ranking de Técnicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="resolvidos" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Resolvidos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Distribuição por Prioridade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {priorityData.map((p) => {
                  const pct = Math.round((p.value / totalTickets) * 100);
                  return (
                    <div key={p.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                          <span className="font-medium text-foreground">{p.name}</span>
                        </div>
                        <span className="text-muted-foreground">{p.value} chamados ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: p.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals & Technicians */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Goals */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Metas x Realizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {goalsData.map((g, i) => {
                  const pct = Math.min(100, Math.round((g.actual / g.target) * 100));
                  const hit = pct >= 100;
                  const GoalIcon = g.icon;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <GoalIcon className={`w-3.5 h-3.5 ${hit ? "text-success" : "text-muted-foreground"}`} />
                          <span className="font-medium text-foreground">{g.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${hit ? "text-success" : "text-foreground"}`}>
                            {g.actual}{g.unit}
                          </span>
                          <span className="text-muted-foreground">/ {g.target}{g.unit}</span>
                        </div>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Technician Details */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Star className="w-4 h-4 text-warning" />
                Detalhes dos Técnicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {technicians.sort((a, b) => b.ticketsResolved - a.ticketsResolved).map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-[10px] font-bold shadow-sm">
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.ticketsResolved} resolvidos · {t.avgTime}min média</p>
                    </div>
                    <div className="flex items-center gap-1 bg-warning/10 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 text-warning fill-warning" />
                      <span className="text-xs font-bold text-foreground">{t.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resolution Rate Banner */}
        <Card className="border-border/50 bg-gradient-to-r from-primary/5 via-card to-success/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Taxa de Resolução Geral</p>
                  <p className="text-xs text-muted-foreground">Baseado em {totalTickets} chamados registrados</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{resolutionRate}%</p>
                <p className="text-[10px] text-muted-foreground">{closedTickets} de {totalTickets} finalizados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
