
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { OrganizationProvider } from "@/context/OrganizationContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateOrganizationPage from "./pages/CreateOrganizationPage";
import Dashboard from "./pages/Dashboard";
import MembersPage from "./pages/MembersPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import NotFound from "./pages/NotFound";

// Criando a instância de QueryClient fora da função de componente
const queryClient = new QueryClient();

// Componente para agrupar rotas protegidas que precisam do OrganizationProvider
const ProtectedRoutes = () => {
  return (
    <OrganizationProvider>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </OrganizationProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/create-organization" element={<CreateOrganizationPage />} />
              <Route path="/accept-invite" element={<AcceptInvitePage />} />
              
              {/* Rotas protegidas dentro do OrganizationProvider */}
              <Route path="/*" element={<ProtectedRoutes />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
