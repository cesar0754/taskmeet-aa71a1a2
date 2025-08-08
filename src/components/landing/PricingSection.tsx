import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star } from 'lucide-react';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para pequenas organizações começarem',
      features: [
        'Até 10 membros',
        'Gerenciamento básico de tarefas',
        'Reuniões ilimitadas',
        'Suporte por email',
        'Armazenamento de 1GB'
      ],
      buttonText: 'Começar grátis',
      variant: 'outline' as const,
      popular: false
    },
    {
      name: 'Profissional',
      price: 'R$ 49',
      period: '/mês',
      description: 'Para organizações que precisam de recursos avançados',
      features: [
        'Membros ilimitados',
        'Gerenciamento avançado de tarefas',
        'Grupos e permissões personalizadas',
        'Relatórios e analytics',
        'Integrações (Google Calendar, WhatsApp)',
        'Suporte prioritário 24/7',
        'Armazenamento de 100GB',
        'Backup automático',
        'API personalizada'
      ],
      buttonText: 'Iniciar teste grátis',
      variant: 'default' as const,
      popular: true
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            💎 Planos transparentes
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Escolha o plano ideal para sua organização
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comece gratuitamente e evolua conforme sua organização cresce. 
            Sem taxas ocultas, sem pegadinhas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : 'border-border'} transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-xl text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <Link to="/register" className="block">
                    <Button 
                      variant={plan.variant} 
                      size="lg" 
                      className="w-full py-3 text-base font-semibold"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Todas as organizações começam com 30 dias grátis do plano Profissional
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>✅ Sem compromisso</span>
            <span>✅ Cancele a qualquer momento</span>
            <span>✅ Migração gratuita de dados</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;