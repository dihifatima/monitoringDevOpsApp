// src/components/features/github/OptionSheet.tsx
// Bottom sheet générique : choix unique (tri) ou multiple (langages).
import { useEffect, useState } from 'react';
import { Modal, View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

export type SheetOption = { key: string; label: string; count?: number };

type Props = {
  visible: boolean;
  title: string;
  subtitle?: string;
  options: SheetOption[];
  mode: 'single' | 'multi';
  selected: string[];
  onApply: (next: string[]) => void;
  onClose: () => void;
  ctaLabel?: (tmp: string[]) => string; // multi uniquement : « Afficher N dépôts »
};

export default function OptionSheet({
  visible, title, subtitle, options, mode, selected, onApply, onClose, ctaLabel,
}: Props) {
  const [tmp, setTmp] = useState<string[]>(selected);

  useEffect(() => {
    if (visible) setTmp(selected);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const press = (key: string) => {
    if (mode === 'single') {
      onApply([key]);
      return;
    }
    setTmp((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.head}>
            <AppText variant="h3" bold>
              {title}
            </AppText>
            {mode === 'multi' && (
              <Pressable onPress={() => setTmp([])} style={styles.clear} accessibilityRole="button">
                <AppText variant="small" color={Colors.link}>
                  Effacer
                </AppText>
              </Pressable>
            )}
          </View>
          {subtitle ? (
            <AppText variant="small" color={Colors.textMuted} style={{ marginBottom: 8 }}>
              {subtitle}
            </AppText>
          ) : null}

          <ScrollView style={styles.list}>
            {options.map((o) => {
              const active = mode === 'single' ? selected.includes(o.key) : tmp.includes(o.key);
              const icon =
                mode === 'single'
                  ? active ? 'radio-button-on' : 'radio-button-off'
                  : active ? 'checkbox' : 'square-outline';
              return (
                <Pressable
                  key={o.key}
                  onPress={() => press(o.key)}
                  style={styles.opt}
                  accessibilityRole={mode === 'single' ? 'radio' : 'checkbox'}
                  accessibilityState={{ checked: active }}
                >
                  <Ionicons
                    name={icon as any}
                    size={22}
                    color={active ? Colors.success : Colors.grey}
                  />
                  <AppText variant="body" style={{ flex: 1 }}>
                    {o.label}
                  </AppText>
                  {o.count !== undefined && (
                    <AppText variant="small" color={Colors.textMuted}>
                      {o.count}
                    </AppText>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {mode === 'multi' && (
            <Pressable style={styles.cta} onPress={() => onApply(tmp)} accessibilityRole="button">
              <AppText variant="body" bold color="#fff">
                {ctaLabel ? ctaLabel(tmp) : 'Appliquer'}
              </AppText>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clear: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 6 },
  list: { maxHeight: 360 },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.greyLight,
  },
  cta: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
});