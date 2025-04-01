
import React from 'react';
import { CheckSquare, Calendar, Users, Layers } from 'lucide-react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  bgClass: string;
  iconClass: string;
}> = ({ icon, title, description, bgClass, iconClass }) => (
  <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
    <div className={`h-12 w-12 rounded-full ${bgClass} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">
      {description}
    </p>
  </div>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <CheckSquare className="h-6 w-6 text-primary" />,
      title: "Gestão de Tarefas",
      description: "Crie, atribua e acompanhe tarefas com diferentes status e prioridades.",
      bgClass: "bg-primary/10",
      iconClass: "text-primary"
    },
    {
      icon: <Calendar className="h-6 w-6 text-secondary" />,
      title: "Reuniões",
      description: "Agende reuniões com integração ao Google Calendar e compartilhamento via WhatsApp.",
      bgClass: "bg-secondary/10",
      iconClass: "text-secondary"
    },
    {
      icon: <Users className="h-6 w-6 text-accent" />,
      title: "Gestão de Membros",
      description: "Controle de permissões para diferentes níveis de acesso dos membros da equipe.",
      bgClass: "bg-accent/10",
      iconClass: "text-accent"
    },
    {
      icon: <Layers className="h-6 w-6 text-warning" />,
      title: "Grupos de Trabalho",
      description: "Organize sua equipe em grupos funcionais para melhor gerenciamento e colaboração.",
      bgClass: "bg-warning/10",
      iconClass: "text-warning"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
