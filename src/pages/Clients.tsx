import { useState } from "react";
import { clients as initialClients, Client } from "@/data/mockData";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, User } from "lucide-react";
import { toast } from "sonner";

export default function Clients() {
  const [clientList, setClientList] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });

  const filtered = clientList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.name || !form.email) {
      toast.error("Nome e e-mail são obrigatórios");
      return;
    }
    const newClient: Client = {
      id: String(clientList.length + 1),
      ...form,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setClientList([newClient, ...clientList]);
    setOpenNew(false);
    setForm({ name: "", email: "", phone: "", company: "" });
    toast.success("Cliente cadastrado!");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground text-sm">Cadastro e gestão de clientes</p>
          </div>
          <Dialog open={openNew} onOpenChange={setOpenNew}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Nome da empresa" />
                  </div>
                </div>
                <Button onClick={handleCreate} className="w-full bg-primary text-primary-foreground">Cadastrar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar clientes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{c.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{c.email}</p>
                    <p className="text-sm text-muted-foreground">{c.phone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{c.company}</span>
                      <span className="text-xs text-muted-foreground">Desde {c.createdAt}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
