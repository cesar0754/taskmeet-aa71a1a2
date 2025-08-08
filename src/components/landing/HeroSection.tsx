
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-background via-primary/5 to-accent/10 py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
          ✨ Plataforma completa para gestão organizacional
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          Transforme a gestão da sua
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> organização</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-muted-foreground leading-relaxed">
          Uma solução inteligente para <strong>condomínios, associações e empresas</strong> gerenciarem 
          tarefas, reuniões e equipes com total controle e eficiência.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Link to="/register">
            <Button size="lg" className="px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
              Experimente GRÁTIS por 30 dias
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="px-10 py-4 text-lg border-2 hover:bg-primary/5">
            Ver demonstração
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Sem cartão de crédito
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Configuração em 5 minutos
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Suporte em português
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
