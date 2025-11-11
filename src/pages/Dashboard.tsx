import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChartBar, FaCalendarAlt, FaChartLine, FaBox } from "react-icons/fa"; // Importar ícones de react-icons
import { cn } from "@/lib/utils";

const Dashboard = () => {
  return (
    <div className="p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Painel de Controle</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Animais por mês</CardTitle>
            <FaChartBar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Você não cadastrou pets nos últimos 6 meses
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimos atendimentos (24h)</CardTitle>
            <FaCalendarAlt className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">00:00:00</div>
            <p className="text-xs text-muted-foreground">Média espera</p>
            <div className="text-2xl font-bold">00:00:00</div>
            <p className="text-xs text-muted-foreground">Média atendimento</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas por mês</CardTitle>
            <FaChartLine className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Gráfico de consultas (placeholder)
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque abaixo do mínimo</CardTitle>
            <FaBox className="h-5 w-5 text-destructive" />
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
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Últimos animais cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhum animal cadastrado recentemente.</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
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