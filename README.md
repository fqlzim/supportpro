# 🛠️ SupportPro — Sistema de Gestão de Suporte Técnico

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

Sistema web completo para gestão de suporte técnico, com dashboard analítico, controle de chamados, cadastro de clientes e avaliação de atendimento.

## 📸 Screenshots

| Dashboard | Chamados | Clientes |
|-----------|----------|----------|
| KPIs, gráficos de status e ranking de técnicos | Abertura, filtro e avaliação de chamados | Cadastro e visualização de clientes |

## ✨ Funcionalidades

- **Autenticação** — Tela de login com interface corporativa
- **Dashboard analítico** com:
  - Total de chamados, abertos e finalizados
  - Tempo médio de atendimento e taxa de resolução
  - Ranking de técnicos por chamados resolvidos
  - Metas × Realizado com barras de progresso
  - Gráfico de distribuição de status (PieChart)
- **Gestão de Chamados** — Abertura com prioridade, técnico responsável, status e tempo gasto
- **Avaliação do Cliente** — Sistema de estrelas para chamados finalizados
- **Cadastro de Clientes** — Cards com informações de contato e empresa
- **Landing Page** — Página institucional com apresentação do produto

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** — Build tool ultrarrápido
- **Tailwind CSS** — Estilização utilitária
- **shadcn/ui** — Componentes acessíveis (Radix UI)
- **Recharts** — Gráficos interativos
- **React Router DOM** — Navegação SPA
- **Lucide React** — Ícones modernos

## 📦 Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/supportpro.git

# 2. Acesse a pasta do projeto
cd supportpro

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:8080`.

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── AppLayout.tsx        # Layout com sidebar de navegação
│   ├── NavLink.tsx          # Componente de link de navegação
│   └── ui/                  # Componentes shadcn/ui
├── data/
│   └── mockData.ts          # Dados mock (clientes, chamados, técnicos)
├── pages/
│   ├── Landing.tsx          # Landing page institucional
│   ├── Login.tsx            # Tela de login
│   ├── Dashboard.tsx        # Dashboard com KPIs e gráficos
│   ├── Tickets.tsx          # Gestão de chamados
│   ├── Clients.tsx          # Cadastro de clientes
│   └── NotFound.tsx         # Página 404
├── hooks/                   # Custom hooks
├── lib/                     # Utilitários
├── App.tsx                  # Rotas da aplicação
├── index.css                # Design tokens e tema
└── main.tsx                 # Ponto de entrada
```

## 🎨 Design

Interface corporativa com paleta em **azul marinho e ciano**, tipografia moderna e componentes responsivos. O design system utiliza tokens semânticos via CSS custom properties para consistência visual.

## 📄 Licença

Este projeto é de uso pessoal/portfólio. Sinta-se livre para usar como referência.

---

Desenvolvido com ❤️ usando [Lovable](https://lovable.dev)
