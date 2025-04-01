
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  return (
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
  );
};

export default CTASection;
