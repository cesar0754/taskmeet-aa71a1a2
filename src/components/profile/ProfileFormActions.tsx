import { Button } from '@/components/ui/button';

interface ProfileFormActionsProps {
  isEditing: boolean;
  updating: boolean;
  uploading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit?: () => void;
}

export const ProfileFormActions = ({
  isEditing,
  updating,
  uploading,
  onEdit,
  onCancel,
  onSubmit
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
            type="button"
            onClick={onSubmit}
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