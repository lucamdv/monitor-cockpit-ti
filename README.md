# 🚀 Cockpit-TI — Painel Corporativo de Gestão de TI

**Cockpit-TI** é uma aplicação web desenvolvida para centralizar informações operacionais e analíticas da área de TI, integrando dados de ferramentas como **JIRA** e **GLPI**, além de possibilitar visualização de indicadores, produtividade e status das equipes.

Acesse já: http://172.16.0.10:83/cockpit-ti/
---

## 📌 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Build de Produção](#-build-de-produção)
- [Deploy no Apache](#-deploy-no-apache)
- [Configuração do Vite](#-configuração-do-vite)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 💡 Visão Geral

O **Cockpit-TI** foi criado para otimizar a operação da área de tecnologia, fornecendo uma visão integrada de desempenho, tarefas e indicadores técnicos.

- 📊 Dashboards com métricas e produtividade.
- 🧩 Integrações com **JIRA** e **GLPI**.
- 💬 Interface moderna, responsiva e padronizada.
- ⚙️ Deploy simples via Apache, com build Vite otimizado.

---

## 🧠 Tecnologias

| Camada | Tecnologias |
|---------|--------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **UI/UX** | Tailwind CSS + shadcn/ui + Lucide Icons |
| **State/Query** | React Query |
| **Backend/Infra** | Supabase (integrações e autenticação) |
| **Empacotamento** | Vite + SWC |
| **Servidor Web** | Apache HTTP Server |

---

## 📂 Estrutura do Projeto

```
📦 cockpit-ti
├── 📁 public/                  # Arquivos públicos (favicon, robots, etc.)
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizáveis (UI e customizados)
│   ├── 📁 data/                # Dados estáticos / mocks (funcionários, etc.)
│   ├── 📁 hooks/               # Hooks customizados
│   ├── 📁 integrations/        # Integrações (ex: Supabase)
│   ├── 📁 lib/                 # Utilitários e helpers
│   ├── 📁 pages/               # Páginas do sistema (Index, JiraBoards, etc.)
│   ├── 📄 App.tsx              # Componente principal (Router e Providers)
│   ├── 📄 main.tsx             # Ponto de entrada React
│   └── 🎨 index.css / App.css  # Estilos globais
├── 📁 supabase/                # Funções e configuração da integração
├── ⚙️ vite.config.ts           # Configuração do build e servidor
├── ⚙️ package.json             # Dependências e scripts
├── 🧩 tsconfig.json            # Tipagem TypeScript
└── 📝 README.md                # Este arquivo
```

---

## 🧰 Como Rodar Localmente

> Pré-requisitos:
> - Node.js ≥ 18
> - npm ou bun
> - Git

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seuusuario/cockpit-ti.git
   cd cockpit-ti
   ```

2. **Instale as dependências**
   ```bash
   npm ci
   ```

3. **Rode o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse: [http://localhost:8080](http://localhost:8080)

---

## 🏗️ Build de Produção

Gere os arquivos otimizados para deploy:

```bash
npm run build
```

Os arquivos de saída ficam em:
```
dist/
├── index.html
└── assets/
```

Para testar localmente:
```bash
npm i -g serve
serve -s dist -l 5000
```
Acesse [http://localhost:5000](http://localhost:5000)

---

## 🌐 Deploy no Apache

1. **Copie o conteúdo de `dist/` para o diretório do Apache:**
   ```
   \\172.16.0.10\htdocs\cockpit-ti
   ```

2. **Garanta que `index.html` seja o gerado no build.**

3. **Crie o arquivo `.htaccess` dentro da pasta `cockpit-ti`:**
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} -f [OR]
   RewriteCond %{REQUEST_FILENAME} -d
   RewriteRule ^ - [L]
   RewriteRule ^ /cockpit-ti/index.html [L]
   ```

4. **Limpe o cache do navegador (Ctrl + F5).**
5. **Acesse:** [http://172.16.0.10/cockpit-ti/](http://172.16.0.10/cockpit-ti/)

---

## ⚙️ Configuração do Vite

O arquivo `vite.config.ts` deve conter:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: "/cockpit-ti/",
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

---

## 🤝 Contribuindo

1. Faça um **fork** do projeto.
2. Crie uma **branch** para sua feature:
   ```bash
   git checkout -b feature/minha-feature
   ```
3. Faça o commit das suas alterações:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
   ```
4. Envie para o seu fork:
   ```bash
   git push origin feature/minha-feature
   ```
5. Crie um **Pull Request** para o repositório principal.

---


> Desenvolvido por [Estagiários KK / Luca Monteiro e Carlos Leal] — *KarneKeijo 2025*
