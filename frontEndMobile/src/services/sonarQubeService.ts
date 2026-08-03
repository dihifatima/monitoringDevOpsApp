// src/services/sonarQubeMeasuresService.ts
import API from '@/src/config/axios';

export type SonarMeasure = {
  metric: string;
  value: string;
  bestValue: boolean;
};

export type SonarQubeMeasuresResponse = {
  component: {
    key: string;
    name: string;
    description: string | null;
    qualifier: string;
    measures: SonarMeasure[];
  };
};

export async function getSonarMeasures(repoId: number): Promise<SonarQubeMeasuresResponse> {
  const { data } = await API.get('/api/sonarqube/measures', { params: { repoId } });
  return data;
}

export type CommitMeasureEntry = {
  metric: string;
  value: string;
};

export type CommitMeasures = {
  revision: string;
  date: string;
  projectVersion: string;
  measures: CommitMeasureEntry[];
};

export async function getCommitMeasures(repoId: number): Promise<CommitMeasures[]> {
  const { data } = await API.get('/api/sonarqube/commit-measures', { params: { repoId } });
  return data;
}