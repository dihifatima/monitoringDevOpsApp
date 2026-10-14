// src/components/features/github/RepoFilterBar.tsx
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Skeleton from '@/src/components/features/home/Skeleton';
import type { StatusFilter } from '@/src/hooks/Oauth_github/useRepoFilters';

type Props = {
  summary: string;
  query: string;
  onQueryChange: (q: string) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  counts: { all: number; tracked: number; untracked: number };
  languageLabel: string;
  languageActive: boolean;
  onOpenLanguage: () => void;
  sortActive: boolean;
  onOpenSort: () => void;
  showReset: boolean;
  onReset: () => void;
  loading?: boolean; // chargement : la barre reste visible, désactivée, sans chiffres
};

const SEGMENTS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'tracked', label: 'Suivis' },
  { key: 'untracked', label: 'Non suivis' },
];

export default function RepoFilterBar(p: Props) {
  return (
    <View style={styles.wrap}>
      {p.loading ? (
        <Skeleton style={styles.summarySk} />
      ) : (
        <AppText variant="small" color={Colors.textMuted} style={styles.summary}>
          {p.summary}
        </AppText>
      )}

      <View>
        <TextInput
          value={p.query}
          onChangeText={p.onQueryChange}
          placeholder="Rechercher un dépôt…"
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Rechercher un dépôt"
          editable={!p.loading}
        />
        {p.query.length > 0 && (
          <Pressable
            onPress={() => p.onQueryChange('')}
            style={styles.clear}
            accessibilityRole="button"
            accessibilityLabel="Effacer la recherche"
          >
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.seg}>
        {SEGMENTS.map((s) => {
          const on = p.status === s.key;
          return (
            <Pressable
              key={s.key}
              onPress={() => p.onStatusChange(s.key)}
              disabled={p.loading}
              style={[styles.segBtn, on && styles.segOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <AppText
                variant="small"
                bold={on}
                color={on ? Colors.black : Colors.textMuted}
                style={styles.segText}
              >
                {p.loading ? s.label : `${s.label} ${p.counts[s.key]}`}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chips}>
        <Chip label={p.languageLabel} active={p.languageActive} onPress={p.onOpenLanguage} disabled={p.loading} />
        <Chip label="Trier" active={p.sortActive} onPress={p.onOpenSort} disabled={p.loading} />
        {p.showReset && (
          <Pressable onPress={p.onReset} style={styles.reset} accessibilityRole="button">
            <AppText variant="small" color={Colors.link}>
              Réinitialiser
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function Chip({
  label, active, onPress, disabled,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, active && styles.chipOn, disabled && { opacity: 0.5 }]}
      accessibilityRole="button"
    >
      <AppText variant="small" bold={active} color={active ? Colors.success : Colors.black} style={styles.chipText}>
        {label}
      </AppText>
      <Ionicons name="chevron-down" size={14} color={active ? Colors.success : Colors.black} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingBottom: 10, backgroundColor: Colors.whiteLight },
  summary: { fontSize: 13, marginBottom: 10 },
  summarySk: { height: 14, width: 150, borderRadius: 7, marginBottom: 10 },
  searchIcon: { position: 'absolute', left: 12, top: 12, zIndex: 1 },
  input: {
    height: 44,
    backgroundColor: Colors.grey,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 44,
    fontSize: 14,
    color: Colors.black,
  },
  clear: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seg: {
    flexDirection: 'row',
    backgroundColor: Colors.greyLight,
    borderRadius: 12,
    padding: 3,
    marginTop: 10,
  },
  segBtn: { flex: 1, minHeight: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: Colors.green, elevation: 1 },
  segText: { fontSize: 12.5 },
  chips: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  chip: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.grey,
  },
  chipOn: { backgroundColor: Colors.okClaire, borderColor: Colors.success },
  chipText: { fontSize: 13 },
  reset: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 6 },
});