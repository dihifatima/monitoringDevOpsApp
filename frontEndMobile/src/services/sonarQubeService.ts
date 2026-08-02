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