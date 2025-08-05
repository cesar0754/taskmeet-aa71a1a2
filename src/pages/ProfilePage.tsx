import { useProfile } from '@/hooks/useProfile';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfilePage = () => {
  const { profile, loading, updating, updateProfile } = useProfile();

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-6">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Não foi possível carregar o perfil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-center">
        <ProfileForm
          profile={profile}
          onUpdate={updateProfile}
          updating={updating}
        />
      </div>
    </div>
  );
};