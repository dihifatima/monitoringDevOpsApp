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

export type TrackedRepoResponse = {
  id: number;
  externalRepoId: number;
  name: string;
  fullName: string;
  url: string;
  sonarProjectKey: string | null;

  trackedAt: string;
};

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