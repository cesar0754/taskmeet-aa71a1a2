import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
    try {
      setUploading(true);

      // Verificar se o arquivo é uma imagem
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erro',
          description: 'Por favor, selecione apenas arquivos de imagem',
          variant: 'destructive'
        });
        return null;
      }

      // Verificar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Erro',
          description: 'O arquivo deve ter no máximo 5MB',
          variant: 'destructive'
        });
        return null;
      }

      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Obter URL público do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      toast({
        title: 'Sucesso',
        description: 'Avatar enviado com sucesso'
      });

      return publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload do avatar',
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async (avatarUrl: string): Promise<boolean> => {
    try {
      // Extrair caminho do arquivo da URL
      const urlParts = avatarUrl.split('/');
      const fileName = urlParts.slice(-2).join('/'); // userId/filename.ext

      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar avatar:', error);
      return false;
    }
  };

  return {
    uploadAvatar,
    deleteAvatar,
    uploading
  };
};