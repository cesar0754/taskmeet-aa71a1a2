import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize a experiência do TaskMeet de acordo com suas preferências.
          </p>
        </div>

        <div className="space-y-6">
          {/* Aparência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Escolha entre tema claro ou escuro para uma melhor experiência visual.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Sun className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label htmlFor="theme-toggle" className="text-base font-medium">
                      Tema escuro
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ative para usar o tema escuro da interface
                    </p>
                  </div>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium">
                    Notificações por email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações importantes por email
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-notifications" className="text-base font-medium">
                    Notificações de tarefas
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Seja notificado sobre novas tarefas e prazos
                  </p>
                </div>
                <Switch id="task-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="meeting-notifications" className="text-base font-medium">
                    Notificações de reuniões
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes sobre reuniões agendadas
                  </p>
                </div>
                <Switch id="meeting-notifications" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle>Privacidade</CardTitle>
              <CardDescription>
                Controle suas configurações de privacidade e dados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics" className="text-base font-medium">
                    Analytics de uso
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ajude-nos a melhorar o produto compartilhando dados de uso anônimos
                  </p>
                </div>
                <Switch id="analytics" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;