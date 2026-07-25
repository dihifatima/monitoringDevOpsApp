// src/services/connectorsService.ts
import API from "@/src/config/axios";
import type { ConnectorKey, ConnectorStatus } from '@/src/constants/connectorsConfig';

export type ConnectorStatusResponse = {
  status: ConnectorStatus;
  username?: string;
};

export type ConnectorsStatusMap = Partial<Record<ConnectorKey, ConnectorStatusResponse>>;

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
    const { data } = await API.get('/api/connectors/github/status');
    return {
      status: data.connected ? 'CONNECTED' : 'NOT_CONNECTED',
      username: data.username,
    };
  } catch {
    return { status: 'NOT_CONNECTED' };
  }
}

/**
 * Étape 1 du flow OAuth : demande au backend l'URL GitHub à ouvrir.
 * Le backend génère le state et le lie au client courant côté serveur (via le JWT
 * déjà injecté par l'intercepteur axios dans src/config/axios.js).
 */
export async function getGithubAuthorizationUrl(): Promise<string> {
  const { data } = await API.get('/api/connectors/github/authorize');
  return data.authorizationUrl;
}