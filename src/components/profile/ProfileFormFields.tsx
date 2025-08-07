import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpdateProfileData } from '@/types/profile';

interface ProfileFormFieldsProps {
  register: UseFormRegister<UpdateProfileData>;
  errors: FieldErrors<UpdateProfileData>;
  isEditing: boolean;
  avatarFile: File | null;
}

export const ProfileFormFields = ({
  register,
  errors,
  isEditing,
  avatarFile
}: ProfileFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          {...register('name')}
          disabled={!isEditing}
          className={!isEditing ? 'bg-muted' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled={!isEditing}
          className={!isEditing ? 'bg-muted' : ''}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {avatarFile && isEditing && (
        <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
          Arquivo selecionado: {avatarFile.name}
        </div>
      )}
    </>
  );
};