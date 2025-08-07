import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Trash2 } from 'lucide-react';

interface AvatarUploadProps {
  profile: {
    name: string;
    email: string;
    avatar_url?: string;
  };
  previewUrl: string | null;
  isEditing: boolean;
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
}

export const AvatarUpload = ({
  profile,
  previewUrl,
  isEditing,
  uploading,
  onFileChange,
  onRemoveAvatar
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  console.log('AvatarUpload: Rendering with isEditing:', isEditing);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUploadClick = () => {
    console.log('AvatarUpload: Upload button clicked');
    fileInputRef.current?.click();
  };

  return (
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
              onClick={() => {
                console.log('AvatarUpload: Upload button clicked, isEditing:', isEditing);
                handleUploadClick();
              }}
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
                onClick={() => {
                  console.log('AvatarUpload: Remove button clicked');
                  onRemoveAvatar();
                }}
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
        onChange={onFileChange}
        className="hidden"
      />
      
      <div>
        <h3 className="text-lg font-medium">{profile.name}</h3>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>
    </div>
  );
};