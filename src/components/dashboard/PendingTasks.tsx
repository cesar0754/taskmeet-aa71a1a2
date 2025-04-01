
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TaskStatus = 'pending' | 'in_progress' | 'completed';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate?: Date;
  assignee?: {
    name: string;
    avatarUrl?: string;
  };
}

interface PendingTasksProps {
  tasks: Task[];
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return 'text-warning bg-warning/10 hover:bg-warning/20';
    case 'in_progress':
      return 'text-primary bg-primary/10 hover:bg-primary/20';
    case 'completed':
      return 'text-success bg-success/10 hover:bg-success/20';
  }
};

const getStatusText = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'in_progress':
      return 'Em progresso';
    case 'completed':
      return 'Concluída';
  }
};

const PendingTasks: React.FC<PendingTasksProps> = ({ tasks }) => {
  const formatDate = (date?: Date) => {
    if (!date) return 'Sem prazo';
    
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const isOverdue = (date?: Date) => {
    if (!date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Tarefas Pendentes</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          <CheckSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Ver todas</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Nenhuma tarefa pendente
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between border rounded-md p-3">
              <div className="flex items-center gap-3">
                <div>
                  <CheckSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline" className={getStatusColor(task.status)}>
                      {getStatusText(task.status)}
                    </Badge>
                    
                    {task.dueDate && (
                      <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {task.assignee && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatarUrl} />
                    <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTasks;
