// src/components/home/OnboardingChecklist.tsx
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';

export type ChecklistStep = {
  id: string;
  title: string;
  why: string; // une phrase : pourquoi cette étape
  done: boolean;
  optional?: boolean;
  actionLabel: string;
  onPress: () => void;
};

export default function OnboardingChecklist({ steps }: { steps: ChecklistStep[] }) {
  const doneCount = steps.filter((s) => s.done).length;
  const firstTodo = steps.findIndex((s) => !s.done);
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <AppText variant="body" bold>
          Démarrer en {steps.length} étapes
        </AppText>
        <AppText variant="small" bold color={Colors.success}>
          {doneCount}/{steps.length}
        </AppText>
      </View>

      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${pct}%` as `${number}%` }]} />
      </View>

      {steps.map((step, i) => {
        const locked = !step.done && i > firstTodo;
        return (
          <View key={step.id} style={[styles.step, locked && styles.locked]}>
            <View style={[styles.num, step.done && styles.numDone]}>
              {step.done ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <AppText variant="small" bold color={Colors.textMuted}>
                  {i + 1}
                </AppText>
              )}
            </View>

            <View style={styles.text}>
              <AppText
                variant="small"
                bold
                color={step.done ? Colors.textMuted : Colors.black}
                style={[styles.stepTitle, step.done && styles.strike]}
              >
                {step.title}
                {step.optional ? ' (optionnel)' : ''}
              </AppText>
              <AppText variant="small" color={Colors.textMuted} style={styles.why}>
                {step.why}
              </AppText>
            </View>

            {!step.done && !locked && (
              <Pressable
                onPress={step.onPress}
                style={[styles.btn, step.optional && styles.btnGhost]}
                accessibilityRole="button"
              >
                <AppText variant="small" bold color={step.optional ? Colors.success : '#fff'}>
                  {step.actionLabel}
                </AppText>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 16,
    padding: 16,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.greyLight,
    marginTop: 12,
    marginBottom: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: Colors.success, borderRadius: 4 },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.greyLight,
  },
  locked: { opacity: 0.45 },
  num: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  text: { flex: 1 },
  stepTitle: { fontSize: 14 },
  strike: { textDecorationLine: 'line-through' },
  why: { fontSize: 12, marginTop: 2 },
  btn: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: { backgroundColor: Colors.okClaire },
});