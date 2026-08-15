import GithubConnectorRow from '@/src/components/features/connectors/github/GithubConnectorRow';
import SonarQubeConnectorRow from '@/src/components/features/connectors/sonarqube/SonarQubeConnectorRow';
import JenkinsConnectorRow from '@/src/components/features/connectors/jenkins/JenkinsConnectorRow';
import { connectorsConfig } from '@/src/constants/connectorsConfig';

export default function ConnectorsList() {
  return (
    <>
      {connectorsConfig.map((config) => {
        if (config.id === 'github') {
          return <GithubConnectorRow key={config.id} />;
        }
        if (config.id === 'sonarqube') {
          return <SonarQubeConnectorRow key={config.id} />;
        }
        if (config.id === 'jenkins') {
          return <JenkinsConnectorRow key={config.id} />;
        }
        return null;
      })}
    </>
  );
}