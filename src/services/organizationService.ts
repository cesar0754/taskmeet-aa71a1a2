
import { supabase } from '../lib/supabase';
import { Organization, Member } from '../types/organization';

export async function createNewOrganization(name: string, userId: string): Promise<Organization | null> {
  try {
    console.log('Criando organização - Nome:', name);
    console.log('Criando organização - UserID:', userId);

    // 1. Criar a organização
    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert([
        { name, owner_id: userId }
      ])
      .select()
      .single();

    if (orgError) {
      console.error('Erro ao criar organização:', orgError);
      throw orgError;
    }

    console.log('Organização criada:', newOrg);

    // 2. Adicionar o usuário criador como membro administrador
    const { data: userData } = await supabase.auth.getUser();
    const userName = userData.user?.user_metadata?.name || userData.user?.email?.split('@')[0] || 'Admin';
    const userEmail = userData.user?.email || '';
    
    console.log('Dados do usuário:', { userName, userEmail });

    const { error: memberError } = await supabase
      .from('organization_members')
      .insert([
        { 
          organization_id: newOrg.id, 
          user_id: userId, 
          role: 'admin',
          name: userName,
          email: userEmail
        }
      ]);

    if (memberError) {
      console.error('Erro ao adicionar membro:', memberError);
      throw memberError;
    }

    return newOrg;
  } catch (error) {
    console.error('Erro completo ao criar organização:', error);
    throw error;
  }
}
