import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingCart,
  Folder,
  Package,
  DollarSign,
  Settings,
  LogOut,
  PawPrint,
  Palette,
  Search,
  Stethoscope,
  ClipboardList,
  FileText,
} from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "PRINCIPAL",
    icon: Folder,
    subItems: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Busca Rápida",
        href: "/quick-search",
        icon: Search,
      },
    ],
  },
  {
    title: "CADASTROS",
    icon: Folder,
    subItems: [
      {
        title: "Tutores",
        href: "/clients",
        icon: Users,
      },
      {
        title: "Pacientes",
        href: "/patients",
        icon: PawPrint,
      },
      { title: "Espécies", href: "/registrations/species", icon: PawPrint },
      { title: "Raças", href: "/registrations/breeds", icon: PawPrint },
      { title: "Pelagens", href: "/registrations/coat-types", icon: Palette },
      { title: "Patologias", href: "/registrations/pathologies" },
      { title: "Tipos de atendimento", href: "/registrations/appointment-types" },
      { title: "Vacinas", href: "/registrations/vaccines" },
      { title: "Exames", href: "/registrations/exams" },
      { title: "Atributos de exames", href: "/registrations/exam-attributes" },
      { title: "Referências de exames", href: "/registrations/exam-references" },
      { title: "Modelo de receita", href: "/registrations/recipe-model" },
      { title: "Origem dos clientes", href: "/registrations/client-origins" },
      { title: "Modelo de documento", href: "/registrations/document-model" },
    ],
  },
  {
    title: "ATENDIMENTO",
    icon: Stethoscope,
    subItems: [
      { title: "Consultas", href: "/appointments/consultations", icon: Calendar },
      { title: "Agendamentos", href: "/appointments/schedule", icon: Calendar },
      { title: "Anamnese", href: "/appointments/anamnesis", icon: ClipboardList },
      { title: "Prescrições", href: "/appointments/prescriptions", icon: FileText },
    ],
  },
  {
    title: "Vendas",
    icon: ShoppingCart,
    subItems: [
      { title: "Ponto de venda", href: "/sales/pos" },
      { title: "Minhas vendas", href: "/sales/my-sales" },
      { title: "Movimentos de caixa", href: "/sales/cash-movements" },
      { title: "Consulta vendas", href: "/sales/consult-sales" },
      { title: "Pacotes vendidos", href: "/sales/sold-packages" },
      { title: "Recebimentos", href: "/sales/receipts" },
      { title: "Lista de preços", href: "/sales/price-list" },
      { title: "Ranking de clientes", href: "/sales/client-ranking" },
      { title: "Saldo dos clientes", href: "/sales/client-balance" },
      { title: "Formas de recebimento", href: "/sales/payment-methods" },
      { title: "Modelo de orçamento", href: "/sales/budget-model" },
      { title: "Modelo de demonstrativo", href: "/sales/statement-model" },
      { title: "Configuração", href: "/sales/configuration" },
    ],
  },
  {
    title: "Estoque e serviços",
    icon: Package,
    subItems: [
      { title: "Produtos e Serviços", href: "/stock/products-services" },
      { title: "Compras", href: "/stock/purchases" },
      { title: "Outras saídas de estoque", href: "/stock/other-exits" },
      { title: "Análise de estoque", href: "/stock/stock-analysis" },
      { title: "Inventário", href: "/stock/inventory" },
      { title: "Pedido de compra", href: "/stock/purchase-order" },
      { title: "Grupos de Produtos", href: "/stock/product-groups" },
      { title: "Marcas", href: "/stock/brands" },
      { title: "Produtos recomendados", href: "/stock/recommended-products" },
    ],
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    subItems: [
      { title: "Lançamentos", href: "/financial/transactions" },
      { title: "Conciliação de cartões", href: "/financial/card-reconciliation" },
      { title: "Contas a pagar", href: "/financial/accounts-payable" },
      { title: "Demonstrativo", href: "/financial/statement" },
      { title: "Fluxo de caixa", href: "/financial/cash-flow" },
      { title: "Contas e cartões", href: "/financial/accounts-cards" },
      { title: "Categorias", href: "/financial/categories" },
      { title: "Fornecedores", href: "/financial/suppliers" },
      { title: "Formas de pagamento", href: "/financial/payment-methods" },
    ],
  },
  {
    title: "Configuração",
    icon: Settings,
    subItems: [
      { title: "Empresa", href: "/settings/company" },
      { title: "Usuários", href: "/settings/users" },
      { title: "Acesso externo", href: "/settings/external-access" },
      { title: "Perfil de Acesso", href: "/settings/access-profile" },
    ],
  },
  {
    title: "Sair",
    href: "/logout",
    icon: LogOut,
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground h-screen fixed left-0 top-0 overflow-y-auto border-r border-sidebar-border p-4 shadow-lg">
      <div className="flex items-center justify-between h-16 border-b border-sidebar-border mb-4 px-3">
        <h1 className="text-2xl font-extrabold text-sidebar-primary-foreground">SystemVet</h1>
        {/* Adicionar um botão de fechar ou minimizar se necessário */}
        {/* <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent">
          <X className="h-4 w-4" />
        </Button> */}
      </div>
      <nav className="space-y-1">
        <Accordion type="multiple" className="w-full">
          {navItems.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="mb-4">
              {group.subItems ? (
                <>
                  <h3 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2 mt-4 mb-1">
                    {group.title}
                  </h3>
                  {group.subItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href || "#"}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        location.pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                      )}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.title}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  to={group.href || "#"}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    location.pathname === group.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  )}
                >
                  {group.icon && <group.icon className="h-4 w-4" />}
                  {group.title}
                </Link>
              )}
            </div>
          ))}
        </Accordion>
      </nav>
      <div className="absolute bottom-4 left-0 w-full text-center text-xs text-muted-foreground">
        Sistema: Veterinário v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;