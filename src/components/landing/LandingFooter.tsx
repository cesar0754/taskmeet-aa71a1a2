
import React from 'react';

const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-xl font-bold text-primary">TaskMeet</span>
            <p className="text-muted-foreground mt-2">
              Gerenciamento de tarefas e reuniões para múltiplas organizações
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h4 className="font-medium mb-3">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Recursos</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Preços</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Sobre nós</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contato</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TaskMeet. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
