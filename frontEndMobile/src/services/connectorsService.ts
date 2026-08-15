import API from "@/src/config/axios";
import type { ConnectorKey, ConnectorStatus } from '@/src/constants/connectorsConfig';

export type ConnectorStatusResponse = {
  status: ConnectorStatus;
  username?: string;
};

// SonarQube
export type SonarQubeConnectRequest = {
 sonarQubeUrl: string,
 token: string
};

export type LinkSonarProjectRequest = {
  sonarProjectKey: string
}
// Jenkins 

export type JenkinsConnectRequest ={
  jenkinsUrl: string,
  username: string,
  apiToken : string
}

export type LinkJenkinsJobRequest = {
  repoId: number;
  jenkinsJobName: string;
};


export type ConnectorsStatusMap = Partial<Record<ConnectorKey, ConnectorStatusResponse>>;

export async function getConnectorsStatus(): Promise<ConnectorsStatusMap> {
  const github = await getGithubStatus();
  const sonarqube = await getSonarQubeStatus();
  const jenkins = await getJenkinsStatus();
  return {
    github,
    sonarqube,
    jenkins
  };
}

// github******************************************

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

export async function getGithubAuthorizationUrl(): Promise<string> {
  const { data } = await API.get('/api/connectors/github/authorize');
  return data.authorizationUrl;
}

//sonarQube **************************************

async function getSonarQubeStatus(): Promise<ConnectorStatusResponse>{
    try {
    const { data } = await API.get('/api/connectors/sonarqube/status');
    return {
      status: data.connected ? 'CONNECTED' : 'NOT_CONNECTED',
    };
  } catch {
    return { status: 'NOT_CONNECTED' };
  }
}

export async function connectSonarQube(request: SonarQubeConnectRequest): Promise<void> {
  await API.post('/api/connectors/sonarqube/connect',null, { params: request });
}

export async function linkProjectKey(request:LinkSonarProjectRequest, repoId: number): Promise<void>{
  await API.patch(`/api/connectors/sonarqube/repos/${repoId}/sonar-project-key`, request )

} 

export async function disconnectSonarQube(): Promise<void>{
  await API.delete('/api/connectors/sonarqube/disconnect');

}

// jenkins **************************************************
async function getJenkinsStatus(): Promise<ConnectorStatusResponse>{
    try {
    const { data } = await API.get('/api/connectors/jenkins/status');
    return {
      status: data.connected ? 'CONNECTED' : 'NOT_CONNECTED',
    };
  } catch {
    return { status: 'NOT_CONNECTED' };
  }
}

export async function connectJenkins(request: JenkinsConnectRequest): Promise<void> {
  await API.post('/api/connectors/jenkins/connect',null, { params: request });
}

export async function disconnectJenkins(): Promise<void>{
  await API.delete('/api/connectors/jenkins/disconnect');

}

export async function linkJenkinsJob(request: LinkJenkinsJobRequest): Promise<void> {
  await API.post('/api/connectors/jenkins/link', request);
}
