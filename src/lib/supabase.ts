
// Use integrated supabase client
import { supabase } from '@/integrations/supabase/client';

// Re-export for compatibility
export { supabase };

// Definindo um tipo que seja compatível com o tipo User do Supabase
export type UserAttributes = {
  id: string;
  email?: string; // Tornando opcional para compatibilidade
  user_metadata?: {
    name?: string;
    avatar_url?: string; // Adicionando avatar_url
  };
};

export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return { data, error };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
