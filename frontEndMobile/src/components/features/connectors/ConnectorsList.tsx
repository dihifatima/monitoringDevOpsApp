// src/components/connectors/ConnectorsList.tsx
import AppMenuListItem from '@/src/components/common/AppMenuListItem';
import ConnectorStatusBadge from '@/src/components/features/connectors/ConnectorStatusBadge';
import GithubConnectorRow from '@/src/components/features/connectors/github/GithubConnectorRow';
import SonarQubeConnectorRow from '@/src/components/features/connectors/sonarqube/SonarQubeConnectorRow';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { Alert } from 'react-native';

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

        // Jenkins : pas encore implémenté, comportement générique désactivé.
        return (
          <AppMenuListItem
            key={config.id}
            title={config.title}
            subtitle={config.description}
            iconImage={config.iconImage}
            iconBgColor={config.iconBgColor}
            route={null}
            onPress={() => Alert.alert('Bientôt disponible', `${config.title} n'est pas encore branché.`)}
            rightAccessory={<ConnectorStatusBadge status="NOT_CONNECTED" />}
          />
        );
      })}
    </>
  );
}