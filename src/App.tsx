import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/ClientsPage";
import AddClientPage from "./pages/AddClientPage";
import AddAnimalPage from "./pages/AddAnimalPage";
import SpeciesPage from "./pages/registrations/SpeciesPage"; // New import
import BreedsPage from "./pages/registrations/BreedsPage";   // New import
import CoatTypesPage from "./pages/registrations/CoatTypesPage"; // New import
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/add" element={<AddClientPage />} />
            <Route path="/animals/add" element={<AddAnimalPage />} />
            <Route path="/registrations/species" element={<SpeciesPage />} />     {/* New route */}
            <Route path="/registrations/breeds" element={<BreedsPage />} />       {/* New route */}
            <Route path="/registrations/coat-types" element={<CoatTypesPage />} /> {/* New route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;