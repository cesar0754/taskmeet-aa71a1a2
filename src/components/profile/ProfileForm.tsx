import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile, UpdateProfileData } from '@/types/profile';
import { Upload, Trash2 } from 'lucide-react';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useAuth } from '@/context/AuthContext';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  avatar_url: z.string().optional()
});

interface ProfileFormProps {
  profile: Profile;
  onUpdate: (data: UpdateProfileData) => Promise<boolean>;
  updating: boolean;
}

export const ProfileForm = ({ profile, onUpdate, updating }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { uploadAvatar, deleteAvatar, uploading } = useAvatarUpload();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      avatar_url: profile.avatar_url || ''
    }
  });

  const onSubmit = async (data: UpdateProfileData) => {
    let finalData = { ...data };

    // Se há um arquivo de avatar para upload
    if (avatarFile && user) {
      const uploadedUrl = await uploadAvatar(avatarFile, user.id);
      if (uploadedUrl) {
        finalData.avatar_url = uploadedUrl;
        
        // Deletar avatar anterior se existir
        if (profile.avatar_url && profile.avatar_url !== uploadedUrl) {
          await deleteAvatar(profile.avatar_url);
        }
      }
    }

    const success = await onUpdate(finalData);
    if (success) {
      setIsEditing(false);
      setAvatarFile(null);
      setPreviewUrl(null);
    }
  };

  const handleCancel = () => {
    reset({
      name: profile.name,
      email: profile.email,
      avatar_url: profile.avatar_url || ''
    });
    setIsEditing(false);
    setAvatarFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = async () => {
    if (profile.avatar_url) {
      await deleteAvatar(profile.avatar_url);
      setValue('avatar_url', '');
      const success = await onUpdate({ avatar_url: '' });
      if (success) {
        setPreviewUrl(null);
        setAvatarFile(null);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Perfil do Usuário</CardTitle>
        <CardDescription>
          Gerencie suas informações pessoais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={previewUrl || profile.avatar_url} 
                alt={profile.name} 
              />
              <AvatarFallback className="text-lg">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                
                {(profile.avatar_url || previewUrl) && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0 rounded-full"
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div>
            <h3 className="text-lg font-medium">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex space-x-2">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
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
                  onClick={handleCancel}
                  disabled={updating || uploading}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};