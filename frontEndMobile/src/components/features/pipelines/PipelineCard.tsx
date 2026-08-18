import { View, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AppText from '@/src/components/common/AppText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import type { PipelineEntry } from '@/src/hooks/Oauth_jenkins/usePipelinesOverview';

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  SUCCESS: { bg: Colors.green, text: Colors.buildSuccess, label: 'SUCCESS' },
  FAILURE: { bg: '#f5c6c6', text: '#a13a3a', label: 'FAILURE' },
  BUILDING: { bg: '#ffe6a8', text: '#8a6200', label: 'BUILDING' },
};

type Props = {
  entry: PipelineEntry;
  onLinkPress: () => void;
};

export default function PipelineCard({ entry, onLinkPress }: Props) {
  if (!entry.jenkinsJobName) {
    return (
      <View style={styles.card}>
        <View style={styles.unlinkedRow}>
          <View>
            <View style={styles.repoRow}>
              <Ionicons name="logo-github" size={16} color={Colors.black} />
              <AppText variant="body" bold style={{ marginLeft: 6 }}>
                {entry.repoName}
              </AppText>
            </View>
            <AppText variant="small" color={Colors.grey} style={{ marginTop: 4 }}>
              Pas encore lié à un job Jenkins
            </AppText>
          </View>
          <Pressable style={styles.linkBtn} onPress={onLinkPress}>
            <AppText variant="small" color={Colors.white} bold>
              Lier
            </AppText>
          </Pressable>
        </View>
      </View>
    );
  }

  const build = entry.build;
  const statusKey = build?.building ? 'BUILDING' : build?.result ?? undefined;
  const status = statusKey ? STATUS_STYLE[statusKey] : null;

  return (
    <Pressable
      style={styles.card}
onPress={() =>
  router.push({
    pathname: '/Pipelines/[repoId]',
    params: { repoId: String(entry.repoId) },
  })
}    >
      <View style={styles.headerRow}>
        <View style={styles.repoRow}>
          <Ionicons name="logo-github" size={16} color={Colors.black} />
          <AppText variant="body" bold style={{ marginLeft: 6 }} numberOfLines={1}>
            {entry.repoName}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.grey} />
      </View>

      {entry.buildError || !build ? (
        <AppText variant="small" color={Colors.grey} style={{ marginTop: 8 }}>
          Aucun build disponible
        </AppText>
      ) : (
        <>
          <View style={styles.statusRow}>
            <AppText variant="body" bold>
              Build #{build.number}
            </AppText>
            {status && (
              <View style={[styles.pill, { backgroundColor: status.bg }]}>
                <AppText variant="small" color={status.text} bold>
                  {status.label}
                </AppText>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <AppText variant="small" color={Colors.grey}>
              {build.building ? 'en cours...' : `${Math.round(build.duration / 1000)}s`}
            </AppText>
            <AppText variant="small" color={Colors.grey}>
              {new Date(build.timestamp).toLocaleString()}
            </AppText>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  repoRow: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  metaRow: { flexDirection: 'row', gap: 14, marginTop: 6 },
  unlinkedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkBtn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
});