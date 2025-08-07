import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import { Profile, UpdateProfileData } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      console.log('useProfile: No user found');
      return;
    }
    
    try {
      console.log('useProfile: Loading profile for user:', user.id);
      setLoading(true);
      const profileData = await profileService.getProfile(user.id);
      
      if (!profileData) {
        // Se não existe perfil, criar um com dados do usuário
        const newProfile = await profileService.createProfile(user.id, {
          name: user.user_metadata?.name || '',
          email: user.email || ''
        });
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar perfil',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user || !profile) {
      console.log('useProfile: updateProfile called but no user or profile:', { user: !!user, profile: !!profile });
      return false;
    }

    try {
      console.log('useProfile: Starting profile update with data:', data);
      setUpdating(true);
      const updatedProfile = await profileService.updateProfile(user.id, data);
      
      if (updatedProfile) {
        console.log('useProfile: Profile updated successfully:', updatedProfile);
        setProfile(updatedProfile);
        toast({
          title: 'Sucesso',
          description: 'Perfil atualizado com sucesso'
        });
        return true;
      } else {
        console.log('useProfile: Profile update returned null');
        return false;
      }
    } catch (error) {
      console.error('useProfile: Error updating profile:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar perfil',
        variant: 'destructive'
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    profile,
    loading,
    updating,
    updateProfile,
    refreshProfile: loadProfile
  };
};