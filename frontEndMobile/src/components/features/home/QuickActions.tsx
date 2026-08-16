import { useState } from 'react';
import { View, Pressable, StyleSheet, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useQuickActionsPrefs } from '@/src/hooks/home/useQuickActionsPrefs';
import { QUICK_ACTIONS_CATALOG } from '@/src/constants/quickActions';

export default function QuickActions() {
  const { selectedActions, selected, toggle } = useQuickActionsPrefs();
  const [editVisible, setEditVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText variant="body" bold>
          Accès rapides
        </AppText>
        <Pressable onPress={() => setEditVisible(true)}>
          <AppText variant="small" color={Colors.info ?? Colors.black}>
            Modifier
          </AppText>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {selectedActions.map((action) => (
          <Pressable
            key={action.key}
            style={styles.action}
            onPress={() => router.push(action.path)}
          >
            <Ionicons name={action.icon as any} size={22} color={Colors.black} />
            <AppText variant="small" style={{ marginTop: 6 }} numberOfLines={1}>
              {action.label}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={editVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <AppText variant="h3" bold>
              Personnaliser les accès rapides
            </AppText>
            <AppText variant="small" color={Colors.grey} style={{ marginTop: 4, marginBottom: Spacing.md }}>
              Sélectionne les raccourcis à afficher.
            </AppText>

            <View style={styles.grid}>
              {QUICK_ACTIONS_CATALOG.map((action) => {
                const isActive = selected.includes(action.key);
                return (
                  <Pressable
                    key={action.key}
                    style={[styles.gridItem, isActive && styles.gridItemActive]}
                    onPress={() => toggle(action.key)}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={20}
                      color={isActive ? Colors.black : Colors.black}
                    />
                    <AppText
                      variant="small"
                      color={isActive ? Colors.black : Colors.black}
                      style={{ marginTop: 6, textAlign: 'center' }}
                    >
                      {action.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.doneBtn} onPress={() => setEditVisible(false)}>
              <AppText variant="body" color={Colors.black} bold>
                Terminé
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  row: { flexDirection: 'row', gap: Spacing.sm },
  action: {
    width: 90,
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.s,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  gridItem: {
    width: '30%',
    backgroundColor: Colors.greyLight,

    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    alignItems: 'center',
  },
  gridItemActive: {
    backgroundColor: Colors.green,

  },
  doneBtn: {
    backgroundColor: Colors.info,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    alignItems: 'center',
  },
});