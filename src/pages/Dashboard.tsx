import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Calendar, Package, Heart, DollarSign, Users, Pencil, Syringe, Clock } from "lucide-react"; // Adicionado novos ícones

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao SystemVet - Gestão Veterinária</p>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" /> Última atualização: agora
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
            <Heart className="h-5 w-5 text-red-500" /> {/* Ícone de coração vermelho */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-green-600">+3 desde ontem</p>
            <p className="text-xs text-muted-foreground">8 consultas, 4 retornos</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
            <Calendar className="h-5 w-5 text-primary" /> {/* Ícone de calendário azul */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Próxima às 14:00</p>
            <p className="text-xs text-muted-foreground">3 confirmadas, 5 pendentes</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" /> {/* Ícone de dólar verde */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 18.750</div>
            <p className="text-xs text-green-600">+15% vs mês anterior</p>
            <p className="text-xs text-muted-foreground">Meta: R$ 20.000</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <Users className="h-5 w-5 text-primary" /> {/* Ícone de usuários azul */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-green-600">+12 este mês</p>
            <p className="text-xs text-muted-foreground">Total de pets cadastrados</p>
          </CardContent>
        </Card>

        {/* Novos cartões para Exames Pendentes e Vacinas Vencendo */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exames Pendentes</CardTitle>
            <Pencil className="h-5 w-5 text-primary" /> {/* Ícone de lápis azul */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-red-600">2 urgentes</p>
            <p className="text-xs text-muted-foreground">Aguardando resultados</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacinas Vencendo</CardTitle>
            <Syringe className="h-5 w-5 text-destructive" /> {/* Ícone de seringa vermelha */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-red-600">Próximos 7 dias</p>
            <p className="text-xs text-muted-foreground">Notificar tutores</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader>
            <CardTitle>Últimos animais cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhum animal cadastrado recentemente.</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
          <CardHeader>
            <CardTitle>Últimos acessos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhum acesso recente.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;