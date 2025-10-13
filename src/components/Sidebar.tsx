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
  LayoutDashboard, Users, Calendar, ShoppingCart, Folder, PawPrint, Palette, DollarSign, Package, Settings, LogOut, ArrowLeft
} from "lucide-react"; // Importar ícones individualmente

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Painel de Controle",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar,
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
    title: "Cadastros",
    icon: Folder,
    subItems: [
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
      { title: "Usuários", href: "/settings/user" },
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

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
        ></div>
      )}

      <aside
        className={cn(
          "w-64 bg-sidebar text-sidebar-foreground h-screen fixed left-0 top-0 overflow-y-auto border-r border-sidebar-border p-4 shadow-lg transition-transform duration-300 ease-in-out z-50 hide-scrollbar",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-start h-16 border-b border-sidebar-border mb-4 px-3">
          <h1 className="text-3xl font-extrabold text-sidebar-primary-foreground">SimplesVet</h1>
        </div>
        <nav className="space-y-1">
          <Accordion type="multiple" className="w-full">
            {navItems.map((item, index) => (
              <React.Fragment key={item.title}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      location.pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    )}
                    onClick={onCloseMobile}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ) : (
                  <AccordionItem value={`item-${index}`} className="border-b-0">
                    <AccordionTrigger className={cn(
                      "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&[data-state=open]>svg]:rotate-180",
                      "font-normal",
                      location.pathname.startsWith(item.subItems?.[0]?.href?.split('/')[1] || "") && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    )}>
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="ml-6 space-y-1">
                        {item.subItems?.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.href || "#"}
                            className={cn(
                              "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              location.pathname === subItem.href && "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                            )}
                            onClick={onCloseMobile}
                          >
                            {subItem.icon && <subItem.icon className="h-4 w-4" />}
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </React.Fragment>
            ))}
          </Accordion>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;