import { useState, useRef, useEffect, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { tickets as initialTickets, clients, technicians, Ticket } from "@/data/mockData";
import { Search, Send, Paperclip, X, FileIcon, ImageIcon, Plus, Circle } from "lucide-react";
import { toast } from "sonner";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // data URL for preview
}

interface Message {
  id: string;
  ticketId: string;
  from: "me" | "client";
  text: string;
  time: string;
  attachments?: Attachment[];
}

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

const statusLabels: Record<string, string> = {
  aberto: "Aberto",
  em_andamento: "Em Andamento",
  finalizado: "Finalizado",
};

const initialMessages: Message[] = [
  { id: "m1", ticketId: "T-001", from: "client", text: "O sistema voltou a apresentar lentidão hoje pela manhã.", time: "09:12" },
  { id: "m2", ticketId: "T-001", from: "me", text: "Bom dia, Ana! Já estamos verificando. Pode me dizer qual módulo?", time: "09:15" },
  { id: "m3", ticketId: "T-001", from: "client", text: "É o módulo financeiro, ao gerar relatórios.", time: "09:17" },
  { id: "m4", ticketId: "T-002", from: "client", text: "O erro de conexão voltou agora pouco.", time: "08:30" },
  { id: "m5", ticketId: "T-002", from: "me", text: "Vou acionar o time agora, é crítico.", time: "08:32" },
  { id: "m6", ticketId: "T-005", from: "client", text: "Quando podem agendar a manutenção da impressora?", time: "10:02" },
];

export default function Chat() {
  const [ticketList, setTicketList] = useState<Ticket[]>(initialTickets);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeTicketId, setActiveTicketId] = useState<string>(initialTickets[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [openNewTicket, setOpenNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    clientId: "",
    description: "",
    priority: "media" as Ticket["priority"],
    technician: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTicket = ticketList.find((t) => t.id === activeTicketId);
  const activeClient = activeTicket
    ? clients.find((c) => c.id === activeTicket.clientId)
    : null;

  const ticketMessages = useMemo(
    () => messages.filter((m) => m.ticketId === activeTicketId),
    [messages, activeTicketId]
  );

  const filteredTickets = ticketList.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.clientName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [ticketMessages.length, activeTicketId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} excede 10MB`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPendingAttachments((prev) => [
          ...prev,
          {
            id: `att-${Date.now()}-${Math.random()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: ev.target?.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const sendMessage = () => {
    if (!draft.trim() && pendingAttachments.length === 0) return;
    if (!activeTicket) return;

    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const msg: Message = {
      id: `m-${Date.now()}`,
      ticketId: activeTicket.id,
      from: "me",
      text: draft.trim(),
      time: now,
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
    };
    setMessages((prev) => [...prev, msg]);
    setDraft("");
    setPendingAttachments([]);
  };

  const handleCreateTicket = () => {
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
    setActiveTicketId(ticket.id);
    setOpenNewTicket(false);
    setNewTicket({ clientId: "", description: "", priority: "media", technician: "" });
    toast.success(`Chamado ${ticket.id} criado!`);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chat</h1>
            <p className="text-muted-foreground text-sm">
              Conversas vinculadas a cada chamado de suporte
            </p>
          </div>
          <Dialog open={openNewTicket} onOpenChange={setOpenNewTicket}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Novo Chamado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Chamado Manualmente</DialogTitle>
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
                  <Label>Descrição</Label>
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
                <Button onClick={handleCreateTicket} className="w-full bg-primary text-primary-foreground">
                  Criar e abrir conversa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[500px]">
            {/* Tickets list */}
            <div className="border-r border-border flex flex-col bg-muted/20">
              <div className="p-3 border-b border-border space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar chamado, cliente..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground px-1">
                  {filteredTickets.length} chamado{filteredTickets.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredTickets.map((t) => {
                  const msgs = messages.filter((m) => m.ticketId === t.id);
                  const last = msgs[msgs.length - 1];
                  const isActive = t.id === activeTicketId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTicketId(t.id)}
                      className={`w-full text-left px-3 py-3 border-b border-border/50 transition-colors flex gap-3 items-start ${
                        isActive ? "bg-accent/10 border-l-2 border-l-accent" : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {t.clientName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm text-foreground truncate">{t.clientName}</p>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {last?.time || t.date.slice(5)}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground">{t.id}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {last?.text || t.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${statusBadge[t.status]}`}>
                            {statusLabels[t.status]}
                          </Badge>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${priorityBadge[t.priority]}`}>
                            {t.priority}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {filteredTickets.length === 0 && (
                  <p className="p-6 text-sm text-muted-foreground text-center">Nenhum chamado encontrado</p>
                )}
              </div>
            </div>

            {/* Conversation panel */}
            {activeTicket && activeClient ? (
              <div className="flex flex-col">
                {/* Header with ticket context */}
                <div className="px-4 py-3 border-b border-border bg-card">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {activeClient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <Circle className="w-3 h-3 text-success fill-success absolute bottom-0 right-0 border-2 border-card rounded-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{activeClient.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{activeClient.company} · {activeClient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className={statusBadge[activeTicket.status]}>
                        {statusLabels[activeTicket.status]}
                      </Badge>
                      <Badge variant="outline" className={priorityBadge[activeTicket.priority]}>
                        {activeTicket.priority}
                      </Badge>
                    </div>
                  </div>
                  {/* Ticket context */}
                  <div className="mt-3 p-3 rounded-md bg-muted/40 border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono font-semibold text-foreground">{activeTicket.id}</span>
                      <span className="text-[11px] text-muted-foreground">
                        Aberto em {activeTicket.date} · Técnico: {activeTicket.technician}
                      </span>
                    </div>
                    <p className="text-xs text-foreground">{activeTicket.description}</p>
                  </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
                  {ticketMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                          m.from === "me"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card text-foreground border border-border rounded-bl-sm"
                        }`}
                      >
                        {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className={`space-y-2 ${m.text ? "mt-2" : ""}`}>
                            {m.attachments.map((att) => {
                              const isImage = att.type.startsWith("image/");
                              return isImage ? (
                                <a
                                  key={att.id}
                                  href={att.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block"
                                >
                                  <img
                                    src={att.url}
                                    alt={att.name}
                                    className="rounded-lg max-w-full max-h-64 object-cover"
                                  />
                                </a>
                              ) : (
                                <a
                                  key={att.id}
                                  href={att.url}
                                  download={att.name}
                                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                                    m.from === "me"
                                      ? "bg-primary-foreground/15 hover:bg-primary-foreground/25"
                                      : "bg-muted hover:bg-muted/70"
                                  }`}
                                >
                                  <FileIcon className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate flex-1">{att.name}</span>
                                  <span className="opacity-70">{formatSize(att.size)}</span>
                                </a>
                              );
                            })}
                          </div>
                        )}
                        <p
                          className={`text-[10px] mt-1 ${
                            m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {m.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  {ticketMessages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      Nenhuma mensagem ainda neste chamado.
                    </div>
                  )}
                </div>

                {/* Pending attachments */}
                {pendingAttachments.length > 0 && (
                  <div className="border-t border-border bg-muted/20 p-2 flex gap-2 flex-wrap">
                    {pendingAttachments.map((att) => {
                      const isImage = att.type.startsWith("image/");
                      return (
                        <div
                          key={att.id}
                          className="relative flex items-center gap-2 bg-card border border-border rounded-md px-2 py-1.5 text-xs"
                        >
                          {isImage ? (
                            <img src={att.url} alt={att.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <FileIcon className="w-4 h-4 text-muted-foreground" />
                          )}
                          <div className="max-w-[140px]">
                            <p className="truncate font-medium">{att.name}</p>
                            <p className="text-muted-foreground text-[10px]">{formatSize(att.size)}</p>
                          </div>
                          <button
                            onClick={() => removeAttachment(att.id)}
                            className="ml-1 text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Composer */}
                <div className="border-t border-border p-3 bg-card flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => fileInputRef.current?.click()}
                    title="Anexar arquivo"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder={`Mensagem para o chamado ${activeTicket.id}...`}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!draft.trim() && pendingAttachments.length === 0}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground">
                Selecione um chamado para iniciar a conversa
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
