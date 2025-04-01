
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckSquare, Calendar, Users, Layers, CheckCheck } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">OrbitTaskFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Gerencie tarefas e reuniões para múltiplas organizações
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-muted-foreground">
            Uma solução completa para administradores gerenciarem suas equipes, 
            tarefas e reuniões com controle de permissões e integrações úteis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="px-8">Começar Agora</Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              Conhecer recursos
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Gestão de Tarefas</h3>
              <p className="text-muted-foreground">
                Crie, atribua e acompanhe tarefas com diferentes status e prioridades.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Reuniões</h3>
              <p className="text-muted-foreground">
                Agende reuniões com integração ao Google Calendar e compartilhamento via WhatsApp.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-medium mb-2">Gestão de Membros</h3>
              <p className="text-muted-foreground">
                Controle de permissões para diferentes níveis de acesso dos membros da equipe.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-xl font-medium mb-2">Grupos de Trabalho</h3>
              <p className="text-muted-foreground">
                Organize sua equipe em grupos funcionais para melhor gerenciamento e colaboração.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher nossa plataforma?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Multi-organizações</h3>
                <p className="text-muted-foreground">
                  Gerencie várias organizações com isolamento de dados e segurança entre elas.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Controle de Permissões</h3>
                <p className="text-muted-foreground">
                  Sistema robusto de permissões para controlar o acesso a recursos e funcionalidades.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Integrações Úteis</h3>
                <p className="text-muted-foreground">
                  Conecte-se com Google Calendar, WhatsApp e outros serviços essenciais.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Fácil de Usar</h3>
                <p className="text-muted-foreground">
                  Interface intuitiva e amigável, projetada para maximizar a produtividade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-muted-foreground">
            Crie sua conta hoje mesmo e comece a gerenciar suas organizações de forma eficiente.
          </p>
          <Link to="/register">
            <Button size="lg" className="px-8">Criar conta gratuita</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold text-primary">OrbitTaskFlow</span>
              <p className="text-muted-foreground mt-2">
                Gerenciamento de tarefas e reuniões para múltiplas organizações
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <h4 className="font-medium mb-3">Produto</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Recursos</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Preços</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Empresa</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Sobre nós</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary">Contato</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} OrbitTaskFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
