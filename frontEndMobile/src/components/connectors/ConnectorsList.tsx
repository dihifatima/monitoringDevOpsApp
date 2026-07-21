// src/components/connectors/ConnectorsList.tsx
import { Alert } from 'react-native';
import { router } from 'expo-router';
import AppMenuListItem from '@/src/components/common/AppMenuListItem';
import ConnectorStatusBadge from '@/src/components/connectors/ConnectorStatusBadge';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { useConnectors } from '@/src/hooks/useConnectors';

export default function ConnectorsList() {
  const { connectors } = useConnectors();

  return (
    <>
      {connectorsConfig.map((config) => {
        const status = connectors[config.id]?.status ?? 'NOT_CONNECTED';
        const username = connectors[config.id]?.username;
        const isConnected = status === 'CONNECTED';

        // Quand connecté : on montre "@username" si le backend l'a renvoyé, sinon on retombe
        // sur la description statique. Quand pas connecté : toujours la description statique.
        const subtitle = isConnected && username ? `@${username}` : config.description;

        const handlePress = () => {
          if (!config.route) {
            // Connecteur pas encore implémenté côté backend/app (SonarCloud, Jenkins pour l'instant).
            Alert.alert('Bientôt disponible', `${config.title} n'est pas encore branché.`);
            return;
          }
          // Que le connecteur soit connecté ou non, on navigue vers le même écran :
          // c'est cet écran qui décide quoi afficher (lancer le flow OAuth, ou montrer le détail).
          router.push(config.route as any);
        };

        return (
          <AppMenuListItem
            key={config.id}
            title={config.title}
            subtitle={subtitle}
            icon={config.icon}
            iconImage={config.iconImage}
            iconBgColor={config.iconBgColor}
            route={config.route}
            onPress={handlePress}
            rightAccessory={<ConnectorStatusBadge status={status} />}
          />
        );
      })}
    </>
  );
}