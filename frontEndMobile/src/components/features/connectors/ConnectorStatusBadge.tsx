// src/components/connectors/ConnectorStatusBadge.tsx
import { View, Text, StyleSheet } from 'react-native';
import type { ConnectorStatus } from '@/src/constants/connectorsConfig';

type ConnectorStatusBadgeProps = {
  status: ConnectorStatus;
};

export default function ConnectorStatusBadge({ status }: ConnectorStatusBadgeProps) {
  const isConnected = status === 'CONNECTED';

  return (
    <View style={[styles.badge, isConnected ? styles.connected : styles.notConnected]}>
      <Text style={styles.label}>{isConnected ? 'Connected' : 'Not connected'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  connected: {
    backgroundColor: '#8ED17A',
  },
  notConnected: {
    backgroundColor: '#9A9A9A',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});