
import React from 'react';
import { CheckCheck } from 'lucide-react';

interface BenefitItemProps {
  title: string;
  description: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ title, description }) => (
  <div className="flex items-start gap-4">
    <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-1">
      <CheckCheck className="h-5 w-5 text-success" />
    </div>
    <div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  </div>
);

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: "Multi-organizações",
      description: "Gerencie várias organizações com isolamento de dados e segurança entre elas."
    },
    {
      title: "Controle de Permissões",
      description: "Sistema robusto de permissões para controlar o acesso a recursos e funcionalidades."
    },
    {
      title: "Integrações Úteis",
      description: "Conecte-se com Google Calendar, WhatsApp e outros serviços essenciais."
    },
    {
      title: "Fácil de Usar",
      description: "Interface intuitiva e amigável, projetada para maximizar a produtividade."
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Por que escolher nossa plataforma?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitItem key={index} title={benefit.title} description={benefit.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
