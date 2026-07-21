// src/services/connectorsService.ts
import API from "@/src/config/axios";
import type { ConnectorKey, ConnectorStatus } from '@/src/constants/connectorsConfig';

export type ConnectorStatusResponse = {
  status: ConnectorStatus;
  username?: string;
};

export type ConnectorsStatusMap = Partial<Record<ConnectorKey, ConnectorStatusResponse>>;

/**
 * IMPORTANT : ce endpoint n'existe pas encore côté backend (seul GitHub a
 * /api/connectors/github/authorize et /callback pour l'instant). Il faudra ajouter,
 * par exemple, un GET /api/connectors/status qui renvoie quelque chose comme :
 * { "github": { "status": "CONNECTED", "username": "dihifatima" },
 *   "sonarcloud": { "status": "NOT_CONNECTED" },
 *   "jenkins": { "status": "NOT_CONNECTED" } }
 *
 * En attendant, cette fonction ne fait la vraie requête que pour GitHub (le seul
 * connecteur déjà branché) et renvoie NOT_CONNECTED en dur pour les deux autres,
 * pour ne pas casser l'écran.
 */
export async function getConnectorsStatus(): Promise<ConnectorsStatusMap> {
  const github = await getGithubStatus();

  return {
    github,
    sonarcloud: { status: 'NOT_CONNECTED' },
    jenkins: { status: 'NOT_CONNECTED' },
  };
}

async function getGithubStatus(): Promise<ConnectorStatusResponse> {
  try {
    // TODO backend : exposer un GET /api/connectors/github/status qui renvoie
    // { connected: boolean, username?: string } en se basant sur ExternalConnectionRepo.
    const { data } = await API.get('/api/connectors/github/status');
    return {
      status: data.connected ? 'CONNECTED' : 'NOT_CONNECTED',
      username: data.username,
    };
  } catch {
    return { status: 'NOT_CONNECTED' };
  }
}