import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-background">
      <div className="text-center p-8 bg-card rounded-lg shadow-xl max-w-2xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-primary">Bem-vindo ao SimplesVet</h1>
        <p className="text-xl text-foreground mb-8">
          Sua solução completa para gerenciamento veterinário.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Ir para o Painel de Controle
          </Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;