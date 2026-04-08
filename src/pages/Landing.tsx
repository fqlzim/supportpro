import { useNavigate } from "react-router-dom";
import { Headphones, ArrowRight, Shield, Clock, BarChart3, Users, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import featureGestao from "@/assets/feature-gestao.jpg";
import featureTempo from "@/assets/feature-tempo.jpg";
import featureMetricas from "@/assets/feature-metricas.jpg";
import featureRanking from "@/assets/feature-ranking.jpg";
import featureAvaliacao from "@/assets/feature-avaliacao.jpg";
import featurePriorizacao from "@/assets/feature-priorizacao.jpg";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Shield, title: "Gestão Completa", desc: "Controle total dos chamados de suporte técnico da sua empresa.", img: featureGestao },
    { icon: Clock, title: "Tempo Real", desc: "Acompanhe o status e tempo de cada atendimento em tempo real.", img: featureTempo },
    { icon: BarChart3, title: "Métricas Avançadas", desc: "Dashboard com indicadores de performance e metas.", img: featureMetricas },
    { icon: Users, title: "Ranking de Técnicos", desc: "Avalie e compare a produtividade da sua equipe.", img: featureRanking },
    { icon: CheckCircle, title: "Avaliação do Cliente", desc: "Colete feedback e melhore continuamente o atendimento.", img: featureAvaliacao },
    { icon: Star, title: "Priorização Inteligente", desc: "Classifique chamados por prioridade e urgência.", img: featurePriorizacao },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="gradient-hero min-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Headphones className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground tracking-tight">SupportPro</span>
          </div>
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
          >
            Entrar
          </Button>
        </header>

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-primary-foreground/80">Sistema de Gestão de Suporte</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
              Suporte técnico
              <br />
              <span className="text-accent">sob controle total</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto">
              Gerencie chamados, acompanhe métricas de desempenho e eleve a qualidade do atendimento da sua equipe.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base font-semibold"
              >
                Começar agora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* Features */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Tudo que você precisa</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Uma plataforma completa para gerenciar todo o ciclo de atendimento ao cliente.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card shadow-card hover:shadow-elevated transition-shadow group overflow-hidden"
              >
                <img src={f.img} alt={f.title} loading="lazy" width={768} height={512} className="w-full h-40 object-cover" />
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-8 text-center text-sm text-muted-foreground">
        © 2026 SupportPro. Todos os direitos reservados.
      </footer>
    </div>
  );
}
