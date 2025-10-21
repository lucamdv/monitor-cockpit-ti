import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Tag, ArrowRight, Shield, Zap, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <img src="\cockpit-ti\public\favicon.ico"></img>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">KarneKeijo</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in-up">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              Plataforma Corporativa
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Gestão Inteligente de
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Equipes e Processos</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Central de gestão de colaboradores JIRA e chamados GLPI em uma única plataforma moderna e eficiente.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in">
          <Card className="border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <Zap className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Integrado</div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">Real-time</div>
              <div className="text-sm text-muted-foreground">Sincronização</div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center">
              <Shield className="h-10 w-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground mb-1">Seguro</div>
              <div className="text-sm text-muted-foreground">Corporativo</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              Funcionalidades Principais
            </h3>
            <p className="text-muted-foreground text-lg">
              Selecione a ferramenta que deseja acessar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 animate-scale-in">
            {/* JIRA Card */}
            <Link to="/jira-boards" className="block">
              <Card className="group border-border bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden">
                <CardHeader className="relative">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-primary group-hover:scale-110 transition-all duration-300">
                    <LayoutDashboard className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    Colaboradores JIRA
                  </CardTitle>
                  <CardDescription className="text-base">
                    Visualize e gerencie as ações e filtros dos colaboradores no JIRA em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Dashboards personalizados
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Filtros avançados
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Métricas de produtividade
                    </li>
                  </ul>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                  >
                    Acessar Quadros
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* GLPI Card */}
            <Card className="group border-border bg-card hover:shadow-xl hover:border-accent/50 transition-all duration-300 cursor-pointer overflow-hidden">
              <CardHeader className="relative">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-gradient-accent group-hover:scale-110 transition-all duration-300">
                  <Tag className="h-6 w-6 text-accent group-hover:text-white transition-colors" />
                </div>
                <CardTitle className="text-2xl group-hover:text-accent transition-colors">
                  Chamados GLPI
                </CardTitle>
                <CardDescription className="text-base">
                  Acesse e gerencie todos os chamados registrados no GLPI de forma centralizada
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Gestão de tickets
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Acompanhamento de SLA
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Relatórios detalhados
                  </li>
                </ul>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:bg-accent/10 group-hover:text-accent transition-colors"
                >
                  Acessar Chamados
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 KarneKeijo. Todos os direitos reservados.</p>
            <p>Sistema de Gestão Corporativa v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
