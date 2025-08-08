import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Dr. Carlos Silva',
      role: 'Síndico',
      organization: 'Condomínio Jardim das Flores',
      avatar: '/placeholder.svg',
      content: 'O TaskMeet revolucionou a gestão do nosso condomínio. Conseguimos organizar todas as tarefas de manutenção e as reuniões condominiais ficaram muito mais eficientes. Recomendo para todos os síndicos.',
      rating: 5
    },
    {
      name: 'Ana Beatriz Santos',
      role: 'Presidente',
      organization: 'Associação de Moradores Vila Verde',
      avatar: '/placeholder.svg',
      content: 'Desde que adotamos o TaskMeet, nossa associação se tornou muito mais organizada. A comunicação entre os membros melhorou 200% e conseguimos executar nossos projetos no prazo.',
      rating: 5
    },
    {
      name: 'Roberto Oliveira',
      role: 'Diretor Administrativo',
      organization: 'Empresa TechSol Ltda',
      avatar: '/placeholder.svg',
      content: 'A plataforma é intuitiva e as recomendações são precisas. Conseguimos reduzir o tempo gasto em reuniões em 40% e aumentar a produtividade da equipe significativamente.',
      rating: 5
    },
    {
      name: 'Mariana Costa',
      role: 'Coordenadora',
      organization: 'ONG Esperança Viva',
      avatar: '/placeholder.svg',
      content: 'Como ONG, precisávamos de uma solução gratuita mas profissional. O TaskMeet atendeu perfeitamente nossas necessidades e nos ajudou a coordenar melhor nossos voluntários.',
      rating: 5
    },
    {
      name: 'José Carlos Mendes',
      role: 'Administrador',
      organization: 'Condomínio Residencial Bosque',
      avatar: '/placeholder.svg',
      content: 'Excelente ferramenta! A integração com o Google Calendar facilitou muito o agendamento das reuniões e o controle de tarefas deixou tudo mais transparente para os moradores.',
      rating: 5
    },
    {
      name: 'Fernanda Lima',
      role: 'Gerente de Projetos',
      organization: 'Construtora Alfa',
      avatar: '/placeholder.svg',
      content: 'O TaskMeet transformou como gerenciamos nossos projetos. A interface é clara, o sistema de permissões é robusto e o suporte é excepcional. Indispensável para qualquer empresa.',
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Depoimentos de quem confia
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja como o TaskMeet está transformando a rotina de organizações, 
            condomínios, associações e empresas em todo o Brasil.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm font-medium text-primary">{testimonial.organization}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-8 bg-muted/50 backdrop-blur rounded-full px-8 py-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">4.9</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="text-sm text-muted-foreground">
              <strong>+2.500</strong> organizações confiam no TaskMeet
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;