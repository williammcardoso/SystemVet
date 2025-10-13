import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, LineChart, Package } from "lucide-react"; // Importações nomeadas explícitas

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Painel de Controle</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Animais por mês</CardTitle>
            <BarChart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Você não cadastrou pets nos últimos 6 meses
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:border-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos atendimentos (24h)</CardTitle>
            <Calendar className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">00:00:00</div>
            <p className="text-xs text-muted-foreground">Média espera</p>
            <div className="text-2xl font-bold">00:00:00</div>
            <p className="text-xs text-muted-foreground">Média atendimento</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas por mês</CardTitle>
            <LineChart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Gráfico de consultas (placeholder)
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:border-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque abaixo do mínimo</CardTitle>
            <Package className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No momento, sem itens prestes a terminar
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Últimos animais cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhum animal cadastrado recentemente.</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
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