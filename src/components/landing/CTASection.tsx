
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          Pronto para transformar sua organização?
        </h2>
        <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
          Junte-se a mais de <strong>2.500 organizações</strong> que já descobriram 
          como ser mais eficiente, organizada e produtiva com o TaskMeet.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Link to="/register">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all bg-white text-primary hover:bg-white/90"
            >
              Começar GRÁTIS agora mesmo
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            className="px-12 py-4 text-lg border-2 border-white/30 text-white hover:bg-white/10"
          >
            Falar com especialista
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm opacity-80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            30 dias grátis garantidos
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Sem compromisso
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            Suporte completo em português
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
