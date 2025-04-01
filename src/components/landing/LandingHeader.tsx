
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingHeader: React.FC = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">TaskMeet</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
