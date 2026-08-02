import { View, Text, StyleSheet } from 'react-native';
import type { ConnectorStatus } from '@/src/constants/connectorsConfig';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
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
    backgroundColor:   Colors.green,
  },
  notConnected: {
    backgroundColor: Colors.grey,
  },
  label: {
    fontSize: Spacing.s ,
    fontWeight: '700',
    color: Colors.black,
  },
});