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

export default function ProjectHeaderSelector({ entries, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  if (!selected) return null;

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <AppText variant="h2" bold numberOfLines={1} style={{ maxWidth: 220 }}>
          {selected.repoName}
        </AppText>
        <Ionicons name="chevron-down" size={16} color={Colors.grey} style={{ marginLeft: 4 }} />
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <AppText variant="h4" bold style={{ marginBottom: Spacing.s }}>
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
                        <Ionicons name="checkmark" size={20} color={Colors.success} style={{ marginRight: 8 }} />
                      )}
                      <AppText variant="small"   bold={isActive}>
                        {item.repoName}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.badgePill,
                        itemLinked ? styles.badgePillLinked : styles.badgePillUnlinked,
                      ]}
                    >
                      <AppText variant="small" color={itemLinked ? '#2e8b3d' : '#6b7280'} bold>
                        {itemLinked ? 'Liée' : 'Non liée'}
                      </AppText>
                    </View>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
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
  itemActive: { backgroundColor: Colors.greyLight, borderRadius: 10, borderBottomWidth: 0 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  badgePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  badgePillLinked: { backgroundColor: '#dff3e1' },
  badgePillUnlinked: { backgroundColor: '#eceef1' },
});