
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { PublicRoute, ProtectedRoute } from "@/components/auth/RouteGuards";

// Pages
import AuthCallbackPage from "./pages/AuthCallbackPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import CreateOrganizationPage from "./pages/CreateOrganizationPage";
import Dashboard from "./pages/Dashboard";
import MembersPage from "./pages/MembersPage";
import GroupsPage from "./pages/GroupsPage";
import TasksPage from "./pages/TasksPage";
import MeetingsPage from "./pages/MeetingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import NotFound from "./pages/NotFound";
import SelectOrganizationPage from "./pages/SelectOrganizationPage";
import InvalidInvitePage from "./pages/InvalidInvitePage";

// Criando a instância de QueryClient fora da função de componente
const queryClient = new QueryClient();

// Componente para agrupar rotas protegidas que precisam do OrganizationProvider
const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/meetings" element={<MeetingsPage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/select-organization" element={<SelectOrganizationPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Landing page - sempre acessível, mas redireciona logados para dashboard */}
              <Route path="/" element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } />
              
              {/* Páginas de autenticação - redirecionam logados para dashboard */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route path="/verify-email" element={
                <PublicRoute>
                  <VerifyEmailPage />
                </PublicRoute>
              } />
              
              {/* Páginas que funcionam sem autenticação */}
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/accept-invite" element={<AcceptInvitePage />} />
              <Route path="/invite/invalid" element={<InvalidInvitePage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              
              {/* Rota de criação de organização - protegida */}
              <Route path="/create-organization" element={
                <ProtectedRoute>
                  <OrganizationProvider>
                    <CreateOrganizationPage />
                  </OrganizationProvider>
                </ProtectedRoute>
              } />
              
              {/* Rotas protegidas dentro do OrganizationProvider */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <OrganizationProvider>
                    <ProtectedRoutes />
                  </OrganizationProvider>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
