import { useState, useRef, useEffect, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tickets, clients } from "@/data/mockData";
import { Search, Send, Phone, Mail, Circle } from "lucide-react";

interface Message {
  id: string;
  from: "me" | "client";
  text: string;
  time: string;
}

const initialConversations: Record<string, Message[]> = {
  "1": [
    { id: "m1", from: "client", text: "Olá, o sistema voltou a apresentar lentidão hoje pela manhã.", time: "09:12" },
    { id: "m2", from: "me", text: "Bom dia, Ana! Já estamos verificando o servidor. Pode me dizer qual módulo?", time: "09:15" },
    { id: "m3", from: "client", text: "É o módulo financeiro, principalmente ao gerar relatórios.", time: "09:17" },
  ],
  "2": [
    { id: "m1", from: "client", text: "Bom dia, o backup falhou novamente esta noite.", time: "08:30" },
    { id: "m2", from: "me", text: "Vou abrir um chamado crítico e acionar o time agora.", time: "08:32" },
  ],
  "3": [
    { id: "m1", from: "client", text: "Obrigada pelo atendimento de ontem, ficou perfeito!", time: "Ontem" },
  ],
  "4": [
    { id: "m1", from: "me", text: "Olá Roberto, tudo certo com a VPN?", time: "Ontem" },
    { id: "m2", from: "client", text: "Tudo funcionando, obrigado!", time: "Ontem" },
  ],
  "5": [
    { id: "m1", from: "client", text: "Quando podem agendar a atualização do antivírus?", time: "10:02" },
  ],
};

export default function Chat() {
  const [conversations, setConversations] = useState<Record<string, Message[]>>(initialConversations);
  const [activeId, setActiveId] = useState<string>(clients[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeClient = clients.find((c) => c.id === activeId)!;
  const activeMessages = conversations[activeId] || [];

  const clientTickets = useMemo(
    () => tickets.filter((t) => t.clientId === activeId),
    [activeId]
  );

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeMessages.length, activeId]);

  const sendMessage = () => {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const msg: Message = { id: `m-${Date.now()}`, from: "me", text: draft.trim(), time: now };
    setConversations((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), msg],
    }));
    setDraft("");
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chat</h1>
          <p className="text-muted-foreground text-sm">
            Converse com os clientes que abriram chamados
          </p>
        </div>

        <Card className="shadow-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-[calc(100vh-220px)] min-h-[480px]">
            {/* Sidebar list */}
            <div className="border-r border-border flex flex-col bg-muted/20">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contato..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredClients.map((c) => {
                  const msgs = conversations[c.id] || [];
                  const last = msgs[msgs.length - 1];
                  const ticketCount = tickets.filter((t) => t.clientId === c.id).length;
                  const isActive = c.id === activeId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveId(c.id)}
                      className={`w-full text-left px-3 py-3 border-b border-border/50 transition-colors flex gap-3 items-start ${
                        isActive ? "bg-accent/10" : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm text-foreground truncate">{c.name}</p>
                          {last && (
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">{last.time}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {last?.text || "Nenhuma mensagem"}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                            {ticketCount} chamado{ticketCount !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation panel */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {activeClient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <Circle className="w-3 h-3 text-success fill-success absolute bottom-0 right-0 border-2 border-card rounded-full" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{activeClient.name}</p>
                    <p className="text-xs text-muted-foreground">{activeClient.company} · Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={activeClient.phone}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title={activeClient.email}>
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Related tickets */}
              {clientTickets.length > 0 && (
                <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center gap-2 overflow-x-auto">
                  <span className="text-xs text-muted-foreground flex-shrink-0">Chamados:</span>
                  {clientTickets.slice(0, 5).map((t) => (
                    <Badge key={t.id} variant="outline" className="text-[10px] flex-shrink-0">
                      {t.id} · {t.status}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
                {activeMessages.map((m) => (
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
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
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
                {activeMessages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    Inicie a conversa com {activeClient.name}.
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-border p-3 bg-card flex items-center gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
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
                  disabled={!draft.trim()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
