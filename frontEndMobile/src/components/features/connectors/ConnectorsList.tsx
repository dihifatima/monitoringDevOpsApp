// src/components/connectors/ConnectorsList.tsx
import AppMenuListItem from '@/src/components/common/AppMenuListItem';
import ConnectorStatusBadge from '@/src/components/features/connectors/ConnectorStatusBadge';
import GithubConnectorRow from '@/src/components/features/connectors/GithubConnectorRow';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { Alert } from 'react-native';

export default function ConnectorsList() {
  return (
    <>
      {connectorsConfig.map((config) => {
        if (config.id === 'github') {
          // GitHub a sa propre logique de connexion (OAuth), donc son propre composant.
          return <GithubConnectorRow key={config.id} />;
        }

        // SonarCloud / Jenkins : pas encore implémentés, comportement générique désactivé.
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