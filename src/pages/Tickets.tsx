import { useState } from "react";
import { tickets as initialTickets, clients, technicians, Ticket } from "@/data/mockData";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Star, Eye, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const priorityLabels: Record<string, string> = { baixa: "Baixa", media: "Média", alta: "Alta", critica: "Crítica" };
const statusLabels: Record<string, string> = { aberto: "Aberto", em_andamento: "Em Andamento", finalizado: "Finalizado" };

const priorityBadge: Record<string, string> = {
  baixa: "bg-success/15 text-success border-success/30",
  media: "bg-warning/15 text-warning border-warning/30",
  alta: "bg-destructive/15 text-destructive border-destructive/30",
  critica: "bg-destructive text-destructive-foreground",
};

const statusBadge: Record<string, string> = {
  aberto: "bg-info/15 text-info border-info/30",
  em_andamento: "bg-warning/15 text-warning border-warning/30",
  finalizado: "bg-success/15 text-success border-success/30",
};

export default function Tickets() {
  const [ticketList, setTicketList] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [openNew, setOpenNew] = useState(false);
  const [ratingTicket, setRatingTicket] = useState<Ticket | null>(null);
  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);

  const [newTicket, setNewTicket] = useState({
    clientId: "",
    description: "",
    priority: "media" as Ticket["priority"],
    technician: "",
  });

  const filtered = ticketList.filter((t) => {
    const matchesSearch =
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "todos" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    todos: ticketList.length,
    aberto: ticketList.filter((t) => t.status === "aberto").length,
    em_andamento: ticketList.filter((t) => t.status === "em_andamento").length,
    finalizado: ticketList.filter((t) => t.status === "finalizado").length,
  };

  const handleCreate = () => {
    const client = clients.find((c) => c.id === newTicket.clientId);
    if (!client || !newTicket.description || !newTicket.technician) {
      toast.error("Preencha todos os campos");
      return;
    }
    const ticket: Ticket = {
      id: `T-${String(ticketList.length + 1).padStart(3, "0")}`,
      clientId: client.id,
      clientName: client.name,
      date: new Date().toISOString().split("T")[0],
      description: newTicket.description,
      priority: newTicket.priority,
      technician: newTicket.technician,
      status: "aberto",
      timeSpent: 0,
    };
    setTicketList([ticket, ...ticketList]);
    setOpenNew(false);
    setNewTicket({ clientId: "", description: "", priority: "media", technician: "" });
    toast.success("Chamado criado com sucesso!");
  };

  const handleRate = () => {
    if (!ratingTicket) return;
    setTicketList(
      ticketList.map((t) =>
        t.id === ratingTicket.id ? { ...t, rating, ratingComment } : t
      )
    );
    setRatingTicket(null);
    setRating(5);
    setRatingComment("");
    toast.success("Avaliação registrada!");
  };

  const handleChangeStatus = (ticketId: string, newStatus: Ticket["status"]) => {
    setTicketList(
      ticketList.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus } : t
      )
    );
    toast.success(`Status atualizado para ${statusLabels[newStatus]}`);
    if (detailTicket?.id === ticketId) {
      setDetailTicket({ ...detailTicket, status: newStatus });
    }
  };

  const handleResolve = (ticketId: string) => {
    handleChangeStatus(ticketId, "finalizado");
  };

  const handleReopen = (ticketId: string) => {
    handleChangeStatus(ticketId, "aberto");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chamados</h1>
            <p className="text-muted-foreground text-sm">Gerencie os chamados de suporte</p>
          </div>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Novo Chamado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Abrir Chamado</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select value={newTicket.clientId} onValueChange={(v) => setNewTicket({ ...newTicket, clientId: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descrição do Problema</Label>
                  <Textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Descreva o problema..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v as Ticket["priority"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Técnico</Label>
                    <Select value={newTicket.technician} onValueChange={(v) => setNewTicket({ ...newTicket, technician: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {technicians.map((t) => (
                          <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreate} className="w-full bg-primary text-primary-foreground">Criar Chamado</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "todos", label: "Todos", icon: Eye },
            { key: "aberto", label: "Abertos", icon: XCircle },
            { key: "em_andamento", label: "Em Andamento", icon: Clock },
            { key: "finalizado", label: "Finalizados", icon: CheckCircle },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={filterStatus === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(key)}
              className={filterStatus === key ? "bg-primary text-primary-foreground" : ""}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              {label}
              <span className="ml-1.5 text-xs opacity-70">({counts[key as keyof typeof counts]})</span>
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar chamados..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Table */}
        <Card className="shadow-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Descrição</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Prioridade</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Técnico</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Tempo</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Avaliação</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                      <td className="p-3 font-medium text-foreground">{t.clientName}</td>
                      <td className="p-3 text-muted-foreground">{t.date}</td>
                      <td className="p-3 text-foreground max-w-[200px] truncate">{t.description}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={priorityBadge[t.priority]}>{priorityLabels[t.priority]}</Badge>
                      </td>
                      <td className="p-3 text-foreground">{t.technician}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={statusBadge[t.status]}>{statusLabels[t.status]}</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{t.timeSpent > 0 ? `${t.timeSpent}min` : "—"}</td>
                      <td className="p-3">
                        {t.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                            <span className="text-sm font-medium">{t.rating}</span>
                          </div>
                        ) : t.status === "finalizado" ? (
                          <button
                            onClick={() => setRatingTicket(t)}
                            className="text-xs text-accent hover:underline"
                          >
                            Avaliar
                          </button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            title="Ver detalhes"
                            onClick={() => setDetailTicket(t)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {t.status === "aberto" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-warning"
                              title="Iniciar atendimento"
                              onClick={() => handleChangeStatus(t.id, "em_andamento")}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                          {t.status === "em_andamento" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-success"
                              title="Marcar como resolvido"
                              onClick={() => handleResolve(t.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {t.status === "finalizado" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-info"
                              title="Reabrir chamado"
                              onClick={() => handleReopen(t.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!detailTicket} onOpenChange={(o) => !o && setDetailTicket(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes do Chamado {detailTicket?.id}</DialogTitle>
            </DialogHeader>
            {detailTicket && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Cliente</p>
                    <p className="font-medium text-foreground">{detailTicket.clientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Data</p>
                    <p className="font-medium text-foreground">{detailTicket.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Técnico</p>
                    <p className="font-medium text-foreground">{detailTicket.technician}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tempo Gasto</p>
                    <p className="font-medium text-foreground">{detailTicket.timeSpent > 0 ? `${detailTicket.timeSpent} min` : "Não iniciado"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prioridade</p>
                    <Badge variant="outline" className={priorityBadge[detailTicket.priority]}>{priorityLabels[detailTicket.priority]}</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className={statusBadge[detailTicket.status]}>{statusLabels[detailTicket.status]}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Descrição</p>
                  <p className="text-foreground text-sm bg-muted/30 rounded-md p-3">{detailTicket.description}</p>
                </div>
                {detailTicket.rating && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avaliação</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`w-4 h-4 ${n <= detailTicket.rating! ? "text-warning fill-warning" : "text-muted"}`} />
                        ))}
                      </div>
                      {detailTicket.ratingComment && (
                        <span className="text-sm text-muted-foreground">— {detailTicket.ratingComment}</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  {detailTicket.status === "aberto" && (
                    <Button size="sm" className="bg-warning text-warning-foreground" onClick={() => handleChangeStatus(detailTicket.id, "em_andamento")}>
                      <ArrowRight className="w-4 h-4 mr-1" /> Iniciar Atendimento
                    </Button>
                  )}
                  {detailTicket.status === "em_andamento" && (
                    <Button size="sm" className="bg-success text-success-foreground" onClick={() => handleResolve(detailTicket.id)}>
                      <CheckCircle className="w-4 h-4 mr-1" /> Marcar como Resolvido
                    </Button>
                  )}
                  {detailTicket.status === "finalizado" && !detailTicket.rating && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleReopen(detailTicket.id)}>
                        <XCircle className="w-4 h-4 mr-1" /> Reabrir
                      </Button>
                      <Button size="sm" className="bg-accent text-accent-foreground" onClick={() => { setRatingTicket(detailTicket); setDetailTicket(null); }}>
                        <Star className="w-4 h-4 mr-1" /> Avaliar
                      </Button>
                    </>
                  )}
                  {detailTicket.status === "finalizado" && detailTicket.rating && (
                    <Button size="sm" variant="outline" onClick={() => handleReopen(detailTicket.id)}>
                      <XCircle className="w-4 h-4 mr-1" /> Reabrir
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Rating Dialog */}
        <Dialog open={!!ratingTicket} onOpenChange={(o) => !o && setRatingTicket(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Avaliar Atendimento - {ratingTicket?.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nota</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setRating(n)}>
                      <Star className={`w-7 h-7 ${n <= rating ? "text-warning fill-warning" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Comentário (opcional)</Label>
                <Textarea value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} placeholder="Seu feedback..." />
              </div>
              <Button onClick={handleRate} className="w-full bg-primary text-primary-foreground">Enviar Avaliação</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
