import { Redirect } from 'expo-router';
import { connectorsConfig } from '@/src/constants/connectorsConfig';

const githubConfig = connectorsConfig.find((c) => c.id === 'github')!;

export default function GithubConnectedRedirect() {
  return githubConfig.route ? <Redirect href={githubConfig.route} /> : null;
}
