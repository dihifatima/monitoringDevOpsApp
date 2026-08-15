// src/services/githubReposService.ts
import API from '@/src/config/axios';

export type RepoSummary = {
  externalId: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  isFork: boolean;
  isArchived: boolean;
  updatedAt: string;
};

export interface TrackedRepoResponse {
  id: number;
  externalRepoId: number;
  sonarProjectKey: string | null;
  jenkinsJobName: string | null;
  name: string;
  language: string | null;
  pushed_at: string | null;
  default_branch: string | null;
  fullName: string;
  url: string;
  trackedAt: string;

  // Champs liés au dernier commit (peuvent être null si pas de commit)
  lastCommitSha: string | null;
  lastCommitMessage: string | null;
  lastCommitAuthorLogin: string | null;
  lastCommitAuthorName: string | null;
  lastCommitAuthorAvatarUrl: string | null;
  lastCommitDate: string | null;
}

export type TrackRepoRequest = {
  externalRepoId: number;
  name: string;
  fullName: string;
  url: string;
};

export type CommitSummary = {
  sha: string;
  message: string;
  authorName: string;
  authorLogin: string;
  authorAvatarUrl: string;
  date: string;
  url: string;
};

// ⬇️ NOUVEAU : types pour l'écran "Détail du commit"
export type CommitFile = {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
};

export type CommitDetailResponse = {
  sha: string;
  message: string;
  authorName: string;
  authorLogin: string;
  authorAvatarUrl: string;
  date: string;
  url: string;
  totalAdditions: number | null;
  totalDeletions: number | null;
  totalChanges: number | null;
  files: CommitFile[];
};

export async function getGithubRepos(): Promise<RepoSummary[]> {
  const { data } = await API.get('/api/connectors/github/repos');
  return data;
}

export async function getTrackedGithubRepos(): Promise<TrackedRepoResponse[]> {
  const { data } = await API.get('/api/connectors/github/repos/tracked');
  return data;
}

export async function trackGithubRepo(request: TrackRepoRequest): Promise<TrackedRepoResponse[]> {
  const { data } = await API.post('/api/connectors/github/repos/track', request);
  return data;
}

export async function getRepoCommits(owner: string, repo: string): Promise<CommitSummary[]> {
  const { data } = await API.get(`/api/connectors/github/repos/${owner}/${repo}/commits`);
  return data;
}

// ⬇️ NOUVEAU : appel de l'endpoint détail commit
export async function getCommitDetail(
  owner: string,
  repo: string,
  sha: string
): Promise<CommitDetailResponse> {
  const { data } = await API.get(`/api/connectors/github/repos/${owner}/${repo}/commits/${sha}`);
  return data;
}