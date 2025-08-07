import { Button } from '@/components/ui/button';

interface ProfileFormActionsProps {
  isEditing: boolean;
  updating: boolean;
  uploading: boolean;
  onEdit: () => void;
  onCancel: () => void;
}

export const ProfileFormActions = ({
  isEditing,
  updating,
  uploading,
  onEdit,
  onCancel
}: ProfileFormActionsProps) => {
  return (
    <div className="flex space-x-2">
      {!isEditing ? (
        <Button
          type="button"
          onClick={() => {
            console.log('ProfileFormActions: Editar Perfil clicked');
            onEdit();
          }}
          variant="outline"
        >
          Editar Perfil
        </Button>
      ) : (
        <>
          <Button
            type="submit"
            disabled={updating || uploading}
          >
            {(updating || uploading) ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={updating || uploading}
          >
            Cancelar
          </Button>
        </>
      )}
    </div>
  );
};