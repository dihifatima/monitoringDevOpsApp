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
  branch: string | null;       // NOUVEAU
  triggeredBy: string | null;  // NOUVEAU
};

export type JenkinsBuildRef = {
  number: number;
  url: string;
  result: string | null;   // NOUVEAU
  building: boolean;       // NOUVEAU
  timestamp: number;       // NOUVEAU
  duration: number;        // NOUVEAU
};

export type JenkinsJobBuildsResponse = {
  builds: JenkinsBuildRef[];
};

export type JenkinsBuildForCommitResponse = JenkinsBuildResponse | null;

// NOUVEAU — résultats de tests (peut être absent si le job ne publie pas de rapport)
export type FailedTest = {
  className: string | null;
  name: string | null;
  errorDetails: string | null;
};

export type TestSummaryResponse = {
  totalCount: number;
  passCount: number;
  failCount: number;
  skipCount: number;
  duration: number | null;
  failedTests: FailedTest[];
};

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

// NOUVEAU — résumé des tests d'un build; retourne null si pas de rapport publié (204/404, cas normal)
export async function getTestSummary(
  repoId: number,
  buildNumber: number
): Promise<TestSummaryResponse | null> {
  try {
    const { data } = await API.get(`/api/jenkins/${repoId}/builds/${buildNumber}/tests`);
    return data ?? null;
  } catch (error: any) {
    if (error?.response?.status === 204 || error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}