import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Profile, UpdateProfileData } from '@/types/profile';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useAuth } from '@/context/AuthContext';
import { AvatarUpload } from './AvatarUpload';
import { ProfileFormFields } from './ProfileFormFields';
import { ProfileFormActions } from './ProfileFormActions';

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
  console.log('ProfileForm: Rendering with profile:', profile);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    console.log('ProfileForm: onSubmit called with data:', data);
    let finalData = { ...data };

    // Se há um arquivo de avatar para upload
    if (avatarFile && user) {
      console.log('ProfileForm: Uploading avatar file:', avatarFile.name);
      const uploadedUrl = await uploadAvatar(avatarFile, user.id);
      if (uploadedUrl) {
        console.log('ProfileForm: Avatar uploaded successfully:', uploadedUrl);
        finalData.avatar_url = uploadedUrl;
        
        // Deletar avatar anterior se existir
        if (profile.avatar_url && profile.avatar_url !== uploadedUrl) {
          console.log('ProfileForm: Deleting old avatar:', profile.avatar_url);
          await deleteAvatar(profile.avatar_url);
        }
      } else {
        console.log('ProfileForm: Avatar upload failed');
      }
    }

    console.log('ProfileForm: Calling onUpdate with finalData:', finalData);
    const success = await onUpdate(finalData);
    console.log('ProfileForm: onUpdate result:', success);
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
    console.log('ProfileForm: File input changed');
    const file = event.target.files?.[0];
    if (file) {
      console.log('ProfileForm: File selected:', file.name, file.type, file.size);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
        console.log('ProfileForm: Preview URL set');
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

  const handleEdit = () => {
    console.log('ProfileForm: Edit triggered');
    setIsEditing(true);
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
        <AvatarUpload
          profile={profile}
          previewUrl={previewUrl}
          isEditing={isEditing}
          uploading={uploading}
          onFileChange={handleFileChange}
          onRemoveAvatar={handleRemoveAvatar}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ProfileFormFields
            register={register}
            errors={errors}
            isEditing={isEditing}
            avatarFile={avatarFile}
          />

          <ProfileFormActions
            isEditing={isEditing}
            updating={updating}
            uploading={uploading}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
};