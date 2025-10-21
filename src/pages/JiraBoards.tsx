import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ArrowUpDown, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import funcionariosData from "@/data/funcionarios.json";
import { supabase } from "@/integrations/supabase/client";

interface Funcionario {
  id: string;
  nome: string;
  filters: {
    ativos: string;
    impedidos: string;
    para_iniciar: string;
    concluidos: string;
  };
}

interface FuncionarioCounts {
  ativos: number;
  impedidos: number;
  para_iniciar: number;
  concluidos: number;
}

const JiraBoards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [counts, setCounts] = useState<Record<string, FuncionarioCounts>>({});

  const funcionarios: Funcionario[] = funcionariosData;

  useEffect(() => {
    const fetchAllCounts = async () => {
      // Fetch counts for each employee in parallel
      const promises = funcionarios.map(async (funcionario) => {
        const funcionarioCounts = {
          ativos: 0,
          impedidos: 0,
          para_iniciar: 0,
          concluidos: 0
        };

        try {
          // Fetch all filters in parallel for this employee
          const [ativosRes, impedidosRes, paraIniciarRes, concluidosRes] = await Promise.all([
            supabase.functions.invoke('bright-task', {
              body: { filterId: funcionario.filters.ativos }
            }),
            supabase.functions.invoke('bright-task', {
              body: { filterId: funcionario.filters.impedidos }
            }),
            supabase.functions.invoke('bright-task', {
              body: { filterId: funcionario.filters.para_iniciar }
            }),
            supabase.functions.invoke('bright-task', {
              body: { filterId: funcionario.filters.concluidos }
            })
          ]);

          funcionarioCounts.ativos = ativosRes.data?.issues?.length || 0;
          funcionarioCounts.impedidos = impedidosRes.data?.issues?.length || 0;
          funcionarioCounts.para_iniciar = paraIniciarRes.data?.issues?.length || 0;
          funcionarioCounts.concluidos = concluidosRes.data?.issues?.length || 0;
        } catch (error) {
          console.error(`Error fetching counts for ${funcionario.nome}:`, error);
        }

        // Update state immediately for this employee
        setCounts(prev => ({
          ...prev,
          [funcionario.id]: funcionarioCounts
        }));

        return { id: funcionario.id, counts: funcionarioCounts };
      });

      // Wait for all to complete
      await Promise.all(promises);
    };

    fetchAllCounts();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = funcionarios.filter((func) =>
      func.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const comparison = a.nome.localeCompare(b.nome);
      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [searchTerm, sortAsc, funcionarios]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Colaboradores JIRA</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Menu Principal
        </Link>

        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Digite o nome do colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSortAsc(!sortAsc)}
            className="w-full md:w-auto"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Ordenar {sortAsc ? "Z-A" : "A-Z"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSorted.map((funcionario, index) => (
            <Link key={funcionario.id} to={`/jira-boards/${funcionario.id}`}>
              <Card
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in border-border cursor-pointer hover:border-primary/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{funcionario.nome}</CardTitle>
                  <CardDescription className="text-xs">ID: {funcionario.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ativos</span>
                    <Badge variant="default" className="bg-primary">
                      {counts[funcionario.id]?.ativos ?? '...'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Impedidos</span>
                    <Badge variant="destructive">
                      {counts[funcionario.id]?.impedidos ?? '...'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Para Iniciar</span>
                    <Badge variant="secondary">
                      {counts[funcionario.id]?.para_iniciar ?? '...'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Concluídos</span>
                    <Badge variant="outline" className="border-green-500 text-green-600 dark:text-green-400">
                      {counts[funcionario.id]?.concluidos ?? '...'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum colaborador encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default JiraBoards;
