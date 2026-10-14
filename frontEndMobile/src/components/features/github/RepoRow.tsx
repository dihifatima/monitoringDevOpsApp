// src/components/features/github/RepoRow.tsx
import { View, Pressable, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import type { RepoSummary } from '@/src/services/githubReposService';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Python: '#3572A5',
  Go: '#00ADD8',
  PHP: '#4F5D95',
  'C#': '#178600',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

// Icône « voir le détail » : 'chevron-forward' (flèche) ou 'eye-outline' (œil)
const DETAIL_ICON = 'chevron-forward';

type Props = {
  repo: RepoSummary;
  isTracked: boolean;
  busy: boolean;
  showOwner: boolean; // vrai pour un repo d'une organisation / d'un autre propriétaire
  onToggle: () => void;
  onOpen?: () => void; // ouvre le détail ; sans lui, pas de flèche
};

export default function RepoRow({ repo, isTracked, busy, showOwner, onToggle, onOpen }: Props) {
  const desc = repo.description?.trim();

  return (
    <Pressable
      onPress={onOpen}
      disabled={!onOpen}
      style={({ pressed }) => [
        styles.card,
        isTracked && styles.cardOn,
        pressed && !!onOpen && styles.pressed,
      ]}
      accessibilityRole={onOpen ? 'button' : undefined}
      accessibilityLabel={onOpen ? `Voir le détail de ${repo.name}` : undefined}
    >
      <View style={styles.info}>
        <AppText variant="body" bold>
          {showOwner ? repo.fullName : repo.name}
        </AppText>

        <View style={styles.meta}>
          {repo.language ? (
            <>
              <View
                style={[styles.dot, { backgroundColor: LANG_COLORS[repo.language] ?? Colors.grey }]}
              />
              <AppText variant="small" color={Colors.textMuted} style={styles.metaText}>
                {repo.language}
              </AppText>
              {desc ? (
                <AppText variant="small" color={Colors.textMuted} style={styles.metaText}>
                  ·
                </AppText>
              ) : null}
            </>
          ) : null}
          {desc ? (
            <AppText
              variant="small"
              color={Colors.textMuted}
              style={[styles.metaText, styles.metaShrink]}
              numberOfLines={1}
            >
              {desc}
            </AppText>
          ) : !repo.language ? (
            <AppText variant="small" color={Colors.textMuted} style={styles.metaText}>
              Pas de description
            </AppText>
          ) : null}
        </View>
      </View>

      <View style={[styles.switchBox, busy && { opacity: 0.5 }]}>
        <Switch
          value={isTracked}
          disabled={busy}
          onValueChange={onToggle}
          trackColor={{ false: Colors.grey, true: Colors.success }}
          thumbColor="#fff"
          accessibilityLabel={`Suivre ${repo.name}`}
        />
      </View>

      {onOpen ? (
        <Ionicons name={DETAIL_ICON as any} size={DETAIL_ICON === 'eye-outline' ? 22 : 18} color={Colors.textMuted} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    backgroundColor: Colors.okClaire,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 16,
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 10,
    marginBottom: 10,
  },
  cardOn: { borderColor: '#c3d1a8' },
  pressed: { opacity: 0.85 },
  info: { flex: 1, minWidth: 0 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  metaText: { fontSize: 12 },
  metaShrink: { flexShrink: 1 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  switchBox: { minWidth: 51, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});