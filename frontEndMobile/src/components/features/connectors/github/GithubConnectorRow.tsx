// src/components/connectors/GithubConnectorRow.tsx
import AppMenuListItem from '@/src/components/common/AppMenuListItem';
import ConnectorStatusBadge from '@/src/components/features/connectors/ConnectorStatusBadge';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { useConnectors } from '@/src/context/ConnectorsContext';
import { useGithubConnection } from '@/src/hooks/Oauth_github/useGithubConnection';
import { router } from 'expo-router';

const githubConfig = connectorsConfig.find((c) => c.id === 'github')!;

export default function GithubConnectorRow() {
  const { connectors } = useConnectors();
  const { connect, isConnecting } = useGithubConnection();

  const status = connectors.github?.status ?? 'NOT_CONNECTED';
  const username = connectors.github?.username;
  const isConnected = status === 'CONNECTED';

  const subtitle = isConnected && username ? `@${username}` : githubConfig.description;

  const handlePress = async () => {
    if (isConnected) {
      router.push(githubConfig.route as any);
      return;
    }

    // Pas connecté : on lance le flow OAuth. Si ça réussit, on navigue
    // directement vers l'écran des repos, sans repasser par un 2e tap.
    const success = await connect();
    if (success) {
      router.push(githubConfig.route as any);
    }
  };

  return (
    <AppMenuListItem
      title={githubConfig.title}
      subtitle={isConnecting ? 'Connexion en cours...' : subtitle}
      icon={githubConfig.icon}
      iconBgColor={githubConfig.iconBgColor}
      route={null}
      onPress={handlePress}
      rightAccessory={<ConnectorStatusBadge status={status} />}
    />
  );
}