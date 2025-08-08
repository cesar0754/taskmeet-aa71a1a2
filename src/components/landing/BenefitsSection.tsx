
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
      title: "Economia de Tempo de até 70%",
      description: "Automatize processos repetitivos e reduza drasticamente o tempo gasto em tarefas administrativas."
    },
    {
      title: "Redução de 90% nos Conflitos",
      description: "Comunicação clara e transparente elimina mal-entendidos e melhora o relacionamento entre membros."
    },
    {
      title: "Aumento de 200% na Produtividade",
      description: "Organize melhor as atividades e veja sua organização alcançar resultados extraordinários."
    },
    {
      title: "Compliance e Transparência Total",
      description: "Mantenha registros detalhados, atas automáticas e relatórios que garantem total transparência."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Resultados que impressionam
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Não é só uma ferramenta, é uma transformação completa na forma como sua organização funciona.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <BenefitItem key={index} title={benefit.title} description={benefit.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
