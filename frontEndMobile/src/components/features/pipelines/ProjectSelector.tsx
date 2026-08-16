import { useState } from 'react';
import { View, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import type { PipelineEntry } from '@/src/hooks/Oauth_jenkins/usePipelinesOverview';

type Props = {
  entries: PipelineEntry[];
  selected: PipelineEntry | null;
  onSelect: (repoId: number) => void;
};

export default function ProjectSelector({ entries, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  if (!selected) return null;

  const isLinked = !!selected.jenkinsJobName;

  return (
    <View style={{ marginBottom: Spacing.md }}>
      <AppText variant="small" color={Colors.grey} style={styles.label}>
        Projet
      </AppText>

      <Pressable style={styles.selector} onPress={() => setOpen(true)}>
        <View style={styles.selectorLeft}>
          <View style={[styles.badge, !isLinked && styles.badgeUnlinked]} />
          <View>
            <View style={styles.nameRow}>
              <Ionicons name="logo-github" size={16} color={Colors.black} />
              <AppText variant="body" bold style={{ marginLeft: 6 }}>
                {selected.repoName}
              </AppText>
            </View>
            <AppText variant="small" color={Colors.grey}>
              {isLinked ? 'Lié à Jenkins' : 'Pas encore lié'}
            </AppText>
          </View>
        </View>
        <Ionicons name="chevron-down" size={18} color={Colors.grey} />
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <AppText variant="h3" bold style={{ marginBottom: Spacing.md }}>
              Choisir un projet
            </AppText>
            <FlatList
              data={entries}
              keyExtractor={(item) => String(item.repoId)}
              renderItem={({ item }) => {
                const itemLinked = !!item.jenkinsJobName;
                const isActive = item.repoId === selected.repoId;
                return (
                  <Pressable
                    style={[styles.item, isActive && styles.itemActive]}
                    onPress={() => {
                      onSelect(item.repoId);
                      setOpen(false);
                    }}
                  >
                    <View style={styles.itemLeft}>
                      {isActive && (
                        <Ionicons name="checkmark" size={16} color={Colors.black} style={{ marginRight: 8 }} />
                      )}
                      <AppText variant="body" bold={isActive}>
                        {item.repoName}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.badgePill,
                        itemLinked ? styles.badgePillLinked : styles.badgePillUnlinked,
                      ]}
                    >
                      <AppText
                        variant="small"
                        color={itemLinked ? '#3d6b1f' : '#5f645c'}
                        bold
                      >
                        {itemLinked ? 'LIÉ' : 'NON LIÉ'}
                      </AppText>
                    </View>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  selector: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3d6b1f',
    marginRight: 10,
  },
  badgeUnlinked: { backgroundColor: '#5f645c' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    maxHeight: '70%',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemActive: {
    backgroundColor: Colors.greyLight,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgePillLinked: { backgroundColor: '#a9e06c' },
  badgePillUnlinked: { backgroundColor: '#d9dbd6' },
});