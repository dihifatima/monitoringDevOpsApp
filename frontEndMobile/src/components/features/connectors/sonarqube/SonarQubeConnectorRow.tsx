// src/components/features/connectors/SonarQubeConnectorRow.tsx
import AppMenuListItem from '@/src/components/common/AppMenuListItem';
import ConnectorStatusBadge from '@/src/components/features/connectors/ConnectorStatusBadge';
import SonarQubeConnectModal from '@/src/components/features/connectors/sonarqube/Sonarqubeconnectmodal';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { useConnectors } from '@/src/context/ConnectorsContext';
import { useSonarQubeConnection } from '@/src/hooks/Oauth_sonarqube/useSonarQubeConnection';
import { useState } from 'react';
import { Alert } from 'react-native';

const sonarQubeConfig = connectorsConfig.find((c) => c.id === 'sonarqube')!;

export default function SonarQubeConnectorRow() {
  const { connectors } = useConnectors();
  const { disconnect, isDisconnecting } = useSonarQubeConnection();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const status = connectors.sonarqube?.status ?? 'NOT_CONNECTED';
  const isConnected = status === 'CONNECTED';

  // ↓ C'EST ICI que se trouve la logique du bouton "Se déconnecter" :
  // pas un bouton séparé dans le JSX, mais une confirmation déclenchée
  // par le tap sur la ligne elle-même, quand déjà connecté.
  const handlePress = () => {
    if (isConnected) {
      Alert.alert(
        'SonarQube connecté',
        'Veux-tu déconnecter ton compte SonarQube ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se déconnecter', style: 'destructive', onPress: () => disconnect() },
        ]
      );
      return;
    }
    setIsModalVisible(true);
  };

  return (
    <>
      <AppMenuListItem
        title={sonarQubeConfig.title}
        subtitle={isDisconnecting ? 'Déconnexion...' : sonarQubeConfig.description}
        iconImage={sonarQubeConfig.iconImage}
        iconBgColor={sonarQubeConfig.iconBgColor}
        route={null}
        onPress={handlePress}
        rightAccessory={<ConnectorStatusBadge status={status} />}
      />

      <SonarQubeConnectModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}