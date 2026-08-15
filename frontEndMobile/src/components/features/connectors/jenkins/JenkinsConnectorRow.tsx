// src/components/features/connectors/jenkins/JenkinsConnectorRow.tsx
import { useState } from 'react';
import { Alert } from 'react-native';
import AppMenuListItem from '@/src/components/common/AppMenuListItem';
import ConnectorStatusBadge from '@/src/components/features/connectors/ConnectorStatusBadge';
import JenkinsConnectModal from '@/src/components/features/connectors/jenkins/JenkinsConnectModal';
import { connectorsConfig } from '@/src/constants/connectorsConfig';
import { useConnectors } from '@/src/context/ConnectorsContext';
import { useJenkinsConnection } from '@/src/hooks/Oauth_jenkins/useJenkinsConnection';

const jenkinsConfig = connectorsConfig.find((c) => c.id === 'jenkins')!;

export default function JenkinsConnectorRow() {
  const { connectors } = useConnectors();
  const { disconnect, isDisconnecting } = useJenkinsConnection();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const status = connectors.jenkins?.status ?? 'NOT_CONNECTED';
  const isConnected = status === 'CONNECTED';

  const handlePress = () => {
    if (isConnected) {
      Alert.alert(
        'Jenkins connecté',
        'Veux-tu déconnecter ton compte Jenkins ?',
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
        title={jenkinsConfig.title}
        subtitle={isDisconnecting ? 'Déconnexion...' : jenkinsConfig.description}
        iconImage={jenkinsConfig.iconImage}
        iconBgColor={jenkinsConfig.iconBgColor}
        route={null}
        onPress={handlePress}
        rightAccessory={<ConnectorStatusBadge status={status} />}
      />

      <JenkinsConnectModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}