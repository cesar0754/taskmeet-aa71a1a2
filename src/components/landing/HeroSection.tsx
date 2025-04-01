
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
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
  );
};

export default HeroSection;
