
// Este arquivo agora apenas reexporta as funções dos módulos específicos
// para manter a compatibilidade com o código existente
export {
  createInvitation,
  getInvitationByToken,
  getInvitationsByOrganization,
  acceptInvitation,
  deleteInvitation
} from './invitation';

// Corrigindo a exportação do tipo usando 'export type'
export type { Invitation } from './invitation';
