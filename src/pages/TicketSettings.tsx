import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Settings, Tag, AlertTriangle, Activity, Clock, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface PriorityLevel {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface StatusConfig {
  id: string;
  name: string;
  color: string;
  isFinal: boolean;
}

interface SLARule {
  id: string;
  priorityId: string;
  responseTime: number; // minutes
  resolutionTime: number; // minutes
}

const defaultColors = [
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
  "hsl(var(--info))",
  "hsl(var(--accent))",
  "hsl(var(--primary))",
];

const colorOptions = [
  { label: "Verde", value: "bg-success/15 text-success border-success/30", preview: "bg-success" },
  { label: "Amarelo", value: "bg-warning/15 text-warning border-warning/30", preview: "bg-warning" },
  { label: "Vermelho", value: "bg-destructive/15 text-destructive border-destructive/30", preview: "bg-destructive" },
  { label: "Azul", value: "bg-info/15 text-info border-info/30", preview: "bg-info" },
  { label: "Roxo", value: "bg-accent/15 text-accent border-accent/30", preview: "bg-accent" },
  { label: "Primário", value: "bg-primary/15 text-primary border-primary/30", preview: "bg-primary" },
];

export default function TicketSettings() {
  // Categories
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Suporte Técnico", color: colorOptions[3].value },
    { id: "2", name: "Financeiro", color: colorOptions[0].value },
    { id: "3", name: "Infraestrutura", color: colorOptions[4].value },
    { id: "4", name: "Desenvolvimento", color: colorOptions[5].value },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(colorOptions[0].value);

  // Priorities
  const [priorities, setPriorities] = useState<PriorityLevel[]>([
    { id: "1", name: "Baixa", color: colorOptions[0].value, order: 1 },
    { id: "2", name: "Média", color: colorOptions[1].value, order: 2 },
    { id: "3", name: "Alta", color: colorOptions[2].value, order: 3 },
    { id: "4", name: "Crítica", color: colorOptions[2].value, order: 4 },
  ]);
  const [newPriorityName, setNewPriorityName] = useState("");
  const [newPriorityColor, setNewPriorityColor] = useState(colorOptions[0].value);

  // Statuses
  const [statuses, setStatuses] = useState<StatusConfig[]>([
    { id: "1", name: "Aberto", color: colorOptions[3].value, isFinal: false },
    { id: "2", name: "Em Andamento", color: colorOptions[1].value, isFinal: false },
    { id: "3", name: "Aguardando Cliente", color: colorOptions[4].value, isFinal: false },
    { id: "4", name: "Finalizado", color: colorOptions[0].value, isFinal: true },
    { id: "5", name: "Cancelado", color: colorOptions[2].value, isFinal: true },
  ]);
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusColor, setNewStatusColor] = useState(colorOptions[0].value);
  const [newStatusIsFinal, setNewStatusIsFinal] = useState(false);

  // SLA
  const [slaRules, setSlaRules] = useState<SLARule[]>([
    { id: "1", priorityId: "1", responseTime: 240, resolutionTime: 1440 },
    { id: "2", priorityId: "2", responseTime: 120, resolutionTime: 480 },
    { id: "3", priorityId: "3", responseTime: 60, resolutionTime: 240 },
    { id: "4", priorityId: "4", responseTime: 15, resolutionTime: 60 },
  ]);

  // Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const genId = () => String(Date.now());

  // Category handlers
  const addCategory = () => {
    if (!newCategoryName.trim()) { toast.error("Informe o nome da categoria"); return; }
    setCategories([...categories, { id: genId(), name: newCategoryName.trim(), color: newCategoryColor }]);
    setNewCategoryName("");
    toast.success("Categoria adicionada!");
  };
  const removeCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    toast.success("Categoria removida!");
  };

  // Priority handlers
  const addPriority = () => {
    if (!newPriorityName.trim()) { toast.error("Informe o nome da prioridade"); return; }
    setPriorities([...priorities, { id: genId(), name: newPriorityName.trim(), color: newPriorityColor, order: priorities.length + 1 }]);
    setNewPriorityName("");
    toast.success("Prioridade adicionada!");
  };
  const removePriority = (id: string) => {
    setPriorities(priorities.filter((p) => p.id !== id));
    setSlaRules(slaRules.filter((s) => s.priorityId !== id));
    toast.success("Prioridade removida!");
  };

  // Status handlers
  const addStatus = () => {
    if (!newStatusName.trim()) { toast.error("Informe o nome do status"); return; }
    setStatuses([...statuses, { id: genId(), name: newStatusName.trim(), color: newStatusColor, isFinal: newStatusIsFinal }]);
    setNewStatusName("");
    setNewStatusIsFinal(false);
    toast.success("Status adicionado!");
  };
  const removeStatus = (id: string) => {
    setStatuses(statuses.filter((s) => s.id !== id));
    toast.success("Status removido!");
  };

  // SLA handlers
  const updateSLA = (priorityId: string, field: "responseTime" | "resolutionTime", value: number) => {
    setSlaRules(
      slaRules.map((s) =>
        s.priorityId === priorityId ? { ...s, [field]: value } : s
      )
    );
  };

  const addSLAForPriority = (priorityId: string) => {
    if (slaRules.find((s) => s.priorityId === priorityId)) return;
    setSlaRules([...slaRules, { id: genId(), priorityId, responseTime: 60, resolutionTime: 240 }]);
  };

  // Inline edit
  const startEdit = (id: string, name: string) => { setEditingId(id); setEditingName(name); };
  const cancelEdit = () => { setEditingId(null); setEditingName(""); };

  const saveEditCategory = (id: string) => {
    setCategories(categories.map((c) => c.id === id ? { ...c, name: editingName } : c));
    cancelEdit();
    toast.success("Categoria atualizada!");
  };
  const saveEditPriority = (id: string) => {
    setPriorities(priorities.map((p) => p.id === id ? { ...p, name: editingName } : p));
    cancelEdit();
    toast.success("Prioridade atualizada!");
  };
  const saveEditStatus = (id: string) => {
    setStatuses(statuses.map((s) => s.id === id ? { ...s, name: editingName } : s));
    cancelEdit();
    toast.success("Status atualizado!");
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6" /> Configurações de Chamados
          </h1>
          <p className="text-muted-foreground text-sm">Configure categorias, prioridades, status e SLA do sistema</p>
        </div>

        <Tabs defaultValue="categorias" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="categorias" className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> Categorias
            </TabsTrigger>
            <TabsTrigger value="prioridades" className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Prioridades
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Status
            </TabsTrigger>
            <TabsTrigger value="sla" className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> SLA
            </TabsTrigger>
          </TabsList>

          {/* CATEGORIAS */}
          <TabsContent value="categorias">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorias de Chamados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Nome da Categoria</Label>
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Ex: Suporte Técnico"
                      onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cor</Label>
                    <div className="flex gap-1">
                      {colorOptions.map((c) => (
                        <button
                          key={c.label}
                          className={`w-7 h-7 rounded-md ${c.preview} ${newCategoryColor === c.value ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
                          onClick={() => setNewCategoryColor(c.value)}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={addCategory} size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="h-8" autoFocus />
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-success" onClick={() => saveEditCategory(cat.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={cancelEdit}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={cat.color}>{cat.name}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(cat.id, cat.name)}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => removeCategory(cat.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PRIORIDADES */}
          <TabsContent value="prioridades">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Níveis de Prioridade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Nome da Prioridade</Label>
                    <Input
                      value={newPriorityName}
                      onChange={(e) => setNewPriorityName(e.target.value)}
                      placeholder="Ex: Urgente"
                      onKeyDown={(e) => e.key === "Enter" && addPriority()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cor</Label>
                    <div className="flex gap-1">
                      {colorOptions.map((c) => (
                        <button
                          key={c.label}
                          className={`w-7 h-7 rounded-md ${c.preview} ${newPriorityColor === c.value ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
                          onClick={() => setNewPriorityColor(c.value)}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={addPriority} size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {priorities.map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="h-8" autoFocus />
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-success" onClick={() => saveEditPriority(p.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={cancelEdit}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground font-mono w-6">#{idx + 1}</span>
                            <Badge variant="outline" className={p.color}>{p.name}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(p.id, p.name)}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => removePriority(p.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STATUS */}
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Personalizados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 items-end flex-wrap">
                  <div className="flex-1 min-w-[180px] space-y-1">
                    <Label className="text-xs">Nome do Status</Label>
                    <Input
                      value={newStatusName}
                      onChange={(e) => setNewStatusName(e.target.value)}
                      placeholder="Ex: Aguardando Aprovação"
                      onKeyDown={(e) => e.key === "Enter" && addStatus()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cor</Label>
                    <div className="flex gap-1">
                      {colorOptions.map((c) => (
                        <button
                          key={c.label}
                          className={`w-7 h-7 rounded-md ${c.preview} ${newStatusColor === c.value ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}
                          onClick={() => setNewStatusColor(c.value)}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tipo</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={!newStatusIsFinal ? "default" : "outline"}
                        onClick={() => setNewStatusIsFinal(false)}
                        className="text-xs h-8"
                      >
                        Em progresso
                      </Button>
                      <Button
                        size="sm"
                        variant={newStatusIsFinal ? "default" : "outline"}
                        onClick={() => setNewStatusIsFinal(true)}
                        className="text-xs h-8"
                      >
                        Final
                      </Button>
                    </div>
                  </div>
                  <Button onClick={addStatus} size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {statuses.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                      {editingId === s.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="h-8" autoFocus />
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-success" onClick={() => saveEditStatus(s.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={cancelEdit}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={s.color}>{s.name}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {s.isFinal ? "Status final" : "Em progresso"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => startEdit(s.id, s.name)}>
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => removeStatus(s.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SLA */}
          <TabsContent value="sla">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regras de SLA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Defina o tempo máximo de resposta e resolução para cada nível de prioridade.
                </p>
                <div className="space-y-3">
                  {priorities.map((p) => {
                    const sla = slaRules.find((s) => s.priorityId === p.id);
                    return (
                      <div key={p.id} className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={p.color}>{p.name}</Badge>
                          {!sla && (
                            <Button size="sm" variant="outline" onClick={() => addSLAForPriority(p.id)}>
                              <Plus className="w-3 h-3 mr-1" /> Definir SLA
                            </Button>
                          )}
                        </div>
                        {sla && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Tempo de Resposta (min)</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={sla.responseTime}
                                  onChange={(e) => updateSLA(p.id, "responseTime", parseInt(e.target.value) || 0)}
                                  className="h-8 w-24"
                                  min={1}
                                />
                                <span className="text-xs text-muted-foreground">{formatTime(sla.responseTime)}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Tempo de Resolução (min)</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={sla.resolutionTime}
                                  onChange={(e) => updateSLA(p.id, "resolutionTime", parseInt(e.target.value) || 0)}
                                  className="h-8 w-24"
                                  min={1}
                                />
                                <span className="text-xs text-muted-foreground">{formatTime(sla.resolutionTime)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button
                  className="w-full"
                  onClick={() => toast.success("Regras de SLA salvas com sucesso!")}
                >
                  Salvar Configurações de SLA
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
