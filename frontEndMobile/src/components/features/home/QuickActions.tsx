import { useState } from 'react';
import { View, Pressable, StyleSheet, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import { useQuickActionsPrefs } from '@/src/hooks/home/useQuickActionsPrefs';
import { QUICK_ACTIONS_CATALOG } from '@/src/constants/quickActions';

type Props = {
  // clés d'actions qui affichent une pastille orange (ex. connexion à terminer)
  badgeKeys?: string[];
};

export default function QuickActions({ badgeKeys = [] }: Props) {
  const { selectedActions, selected, toggle } = useQuickActionsPrefs();
  const [editVisible, setEditVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText variant="body" bold>
          Accès rapides
        </AppText>
        <Pressable
          onPress={() => setEditVisible(true)}
          style={styles.editBtn}
          accessibilityRole="button"
        >
          <AppText variant="small" color={Colors.link}>
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
            onPress={() => router.navigate(action.path)}
            accessibilityRole="button"
          >
            <View style={styles.iconCircle}>
              <Ionicons name={action.icon as any} size={18} color={Colors.success} />
            </View>
            <AppText variant="small" style={styles.actionLabel} numberOfLines={2}>
              {action.label}
            </AppText>
            {badgeKeys.includes(action.key) && <View style={styles.badge} />}
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
            <AppText
              variant="small"
              color={Colors.textMuted}
              style={{ marginTop: 4, marginBottom: Spacing.md }}
            >
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
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isActive }}
                  >
                    <Ionicons name={action.icon as any} size={20} color={Colors.black} />
                    <AppText
                      variant="small"
                      color={Colors.black}
                      style={{ marginTop: 6, textAlign: 'center' }}
                    >
                      {action.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.doneBtn} onPress={() => setEditVisible(false)}>
              <AppText variant="body" color="#fff" bold>
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
    marginBottom: Spacing.xs,
  },
  editBtn: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  row: { flexDirection: 'row', gap: 8 },
  action: {
    width: 104,
    height: 88,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 16,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.okClaire,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 12, lineHeight: 14, textAlign: 'center' },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.accent,
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
  gridItemActive: { backgroundColor: Colors.green },
  doneBtn: {
    backgroundColor: Colors.success,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.md,
    alignItems: 'center',
  },
});
