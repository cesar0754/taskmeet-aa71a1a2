import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Users, Edit, Trash2 } from 'lucide-react';
import { Group } from '@/types/group';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GroupCardProps {
  group: Group;
  memberCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewMembers?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  memberCount = 0,
  onEdit,
  onDelete,
  onViewMembers
}) => {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg">{group.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
            </Badge>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onViewMembers && (
              <DropdownMenuItem onClick={onViewMembers}>
                <Users className="mr-2 h-4 w-4" />
                Ver Membros
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        {group.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {group.description}
          </p>
        )}
        
        <div className="text-xs text-muted-foreground">
          Criado em {format(new Date(group.created_at), 'dd/MM/yyyy', { locale: ptBR })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;