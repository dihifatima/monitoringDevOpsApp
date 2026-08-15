// src/services/jenkinsService.ts
import API from '@/src/config/axios';

export type JenkinsChangeItem = {
  commitId: string;
  msg: string;
};

export type JenkinsChangeSet = {
  items: JenkinsChangeItem[];
};

export type JenkinsBuildResponse = {
  number: number;
  result: string | null;
  timestamp: number;
  duration: number;
  building: boolean;
  changeSets: JenkinsChangeSet[];
};

export type JenkinsBuildRef = {
  number: number;
  url: string;
};

export type JenkinsJobBuildsResponse = {
  builds: JenkinsBuildRef[];
};
export type JenkinsBuildForCommitResponse = JenkinsBuildResponse | null;




export async function getLastBuild(repoId: number): Promise<JenkinsBuildResponse> {
  const { data } = await API.get(`/api/jenkins/${repoId}/last-build`);
  return data;
}

export async function getBuildList(repoId: number): Promise<JenkinsJobBuildsResponse> {
  const { data } = await API.get(`/api/jenkins/${repoId}/builds`);
  return data;
}

export async function getBuildDetail(
  repoId: number,
  buildNumber: number
): Promise<JenkinsBuildResponse> {
  const { data } = await API.get(`/api/jenkins/${repoId}/builds/${buildNumber}`);
  return data;
}


export async function getBuildForCommit(
  repoId: number,
  sha: string
): Promise<JenkinsBuildForCommitResponse> {
  try {
    const { data } = await API.get(`/api/jenkins/${repoId}/commit/${sha}/build`);
    return data;
  } catch (error: any) {
    if (error?.response?.status === 204 || error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

