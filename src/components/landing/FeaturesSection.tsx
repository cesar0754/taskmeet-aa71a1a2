import React from 'react';
import { Users, Calendar, CheckSquare, Settings, Shield, Zap, Building2, MessageSquare, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  bgClass?: string;
  iconClass?: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  bgClass = "bg-gradient-to-br from-primary/10 to-accent/10", 
  iconClass = "text-primary",
  badge
}) => (
  <div className="group p-8 rounded-2xl border bg-card/50 backdrop-blur hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
    {badge && (
      <Badge variant="secondary" className="absolute top-4 right-4 text-xs">
        {badge}
      </Badge>
    )}
    <div className={`h-16 w-16 rounded-2xl ${bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon className={`h-8 w-8 ${iconClass}`} />
    </div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Building2,
      title: "Perfeito para Condomínios",
      description: "Gerencie manutenções, assembleias e comunicações entre moradores. Controle total sobre orçamentos e prestadores.",
      bgClass: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
      iconClass: "text-blue-600",
      badge: "Popular"
    },
    {
      icon: Users,
      title: "Associações & ONGs",
      description: "Coordene voluntários, projetos sociais e eventos. Organize reuniões e mantenha todos informados facilmente.",
      bgClass: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
      iconClass: "text-green-600"
    },
    {
      icon: BarChart3,
      title: "Empresas & Negócios",
      description: "Aumente a produtividade com gestão inteligente de projetos, equipes e recursos. Relatórios completos inclusos.",
      bgClass: "bg-gradient-to-br from-purple-500/10 to-violet-500/10",
      iconClass: "text-purple-600"
    },
    {
      icon: CheckSquare,
      title: "Gestão Inteligente de Tarefas",
      description: "Crie, delegue e monitore tarefas com status automáticos. Notificações em tempo real e controle de prazos.",
      bgClass: "bg-gradient-to-br from-orange-500/10 to-red-500/10",
      iconClass: "text-orange-600"
    },
    {
      icon: Calendar,
      title: "Reuniões Mais Eficientes",
      description: "Agende reuniões, envie convites automáticos e sincronize com Google Calendar. Atas digitais incluídas.",
      bgClass: "bg-gradient-to-br from-teal-500/10 to-cyan-500/10",
      iconClass: "text-teal-600"
    },
    {
      icon: Shield,
      title: "Segurança & Privacidade",
      description: "Dados criptografados, backup automático e controle rigoroso de permissões. Sua organização sempre protegida.",
      bgClass: "bg-gradient-to-br from-red-500/10 to-pink-500/10",
      iconClass: "text-red-600"
    },
    {
      icon: MessageSquare,
      title: "Comunicação Integrada",
      description: "WhatsApp, email e notificações push. Mantenha todos conectados com comunicação automática e personalizada.",
      bgClass: "bg-gradient-to-br from-indigo-500/10 to-blue-500/10",
      iconClass: "text-indigo-600"
    },
    {
      icon: Zap,
      title: "Automações Inteligentes",
      description: "Workflows automáticos, lembretes inteligentes e relatórios gerados automaticamente. Menos trabalho manual.",
      bgClass: "bg-gradient-to-br from-yellow-500/10 to-orange-500/10",
      iconClass: "text-yellow-600",
      badge: "IA"
    },
    {
      icon: Settings,
      title: "Multi-organizações",
      description: "Gerencie quantas organizações precisar em uma conta. Dados isolados e configurações independentes.",
      bgClass: "bg-gradient-to-br from-gray-500/10 to-slate-500/10",
      iconClass: "text-gray-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            🚀 Recursos poderosos
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tudo que sua organização precisa
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Seja um condomínio com 20 apartamentos ou uma empresa com 200 funcionários, 
            o TaskMeet se adapta perfeitamente às suas necessidades.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;