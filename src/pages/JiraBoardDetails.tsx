import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
      statusCategory: {
        key: string;
      };
    };
    issuetype: {
      name: string;
      iconUrl: string;
    };
  };
  self: string;
}

const JiraBoardDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [jiraDomain, setJiraDomain] = useState<string>("");

  useEffect(() => {
    const func = funcionariosData.find((f) => f.id === id);
    if (func) {
      setFuncionario(func);
      // Load first filter by default
      const firstFilterType = Object.keys(func.filters)[0];
      setActiveFilter(firstFilterType);
      fetchIssues(func.filters[firstFilterType as keyof typeof func.filters]);
    }
  }, [id]);

  const fetchIssues = async (filterId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        "bright-task",
        { body: { filterId } }
      );

      if (functionError) throw functionError;

      if (data.issues && data.issues.length > 0) {
        const domain = data.issues[0].self
          .split("/rest/")[0]
          .replace("https://", "");
        setJiraDomain(domain);
      }

      setIssues(data.issues || []);
    } catch (err: any) {
      console.error("Error fetching issues:", err);
      setError(err.message || "Não foi possível carregar os chamados");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (filterType: string, filterId: string) => {
    setActiveFilter(filterType);
    fetchIssues(filterId);
  };

  const getStatusBadgeVariant = (statusKey: string) => {
    switch (statusKey) {
      case "done":
        return "default";
      case "indeterminate":
        return "secondary";
      case "new":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatFilterName = (filterType: string) => {
    const names: { [key: string]: string } = {
      ativos: "Ativos",
      impedidos: "Impedidos",
      para_iniciar: "Para Iniciar",
      concluidos: "Concluídos",
    };
    return names[filterType] || filterType;
  };

  if (!funcionario) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle>Colaborador não encontrado</CardTitle>
            <CardDescription>
              O colaborador solicitado não existe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/jira-boards">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar aos Colaboradores
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Chamados de {funcionario.nome}
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Link
          to="/jira-boards"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar aos Colaboradores
        </Link>

        <p className="text-muted-foreground mb-6">
          Selecione um filtro para ver os chamados:
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 pb-4 border-b border-border">
          {Object.entries(funcionario.filters).map(([filterType, filterId]) => (
            <Button
              key={filterType}
              variant={activeFilter === filterType ? "default" : "outline"}
              onClick={() => handleFilterClick(filterType, filterId)}
              className="font-medium"
            >
              {formatFilterName(filterType)}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Issues List */}
        {!loading && !error && (
          <div className="space-y-4">
            {issues.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Nenhum chamado encontrado para este filtro.
                  </p>
                </CardContent>
              </Card>
            ) : (
              issues.map((issue, index) => (
                <a
                  key={issue.key}
                  href={`https://${jiraDomain}/browse/${issue.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card
                    className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={issue.fields.issuetype.iconUrl}
                            alt={issue.fields.issuetype.name}
                            title={issue.fields.issuetype.name}
                            className="h-5 w-5"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-medium text-foreground mb-1 truncate">
                            {issue.fields.summary}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {issue.key}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge
                            variant={getStatusBadgeVariant(
                              issue.fields.status.statusCategory.key
                            )}
                            className="uppercase font-bold text-xs"
                          >
                            {issue.fields.status.name}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default JiraBoardDetails;
