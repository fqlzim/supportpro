import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Headphones, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    toast.success("Login realizado com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Headphones className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">SupportPro</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo de volta</h1>
          <p className="text-muted-foreground mb-8">Acesse sua conta para gerenciar o suporte.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Entrar
            </Button>
          </form>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-8">
            <Headphones className="w-10 h-10 text-accent-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Gerencie seu suporte com eficiência
          </h2>
          <p className="text-primary-foreground/70">
            Dashboard completo, controle de chamados e métricas de performance em um só lugar.
          </p>
        </div>
      </div>
    </div>
  );
}
