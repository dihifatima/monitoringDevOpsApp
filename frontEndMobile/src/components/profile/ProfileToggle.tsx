import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';
import Fonts from '@/src/constants/fonts';

interface ProfileToggleProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  value: boolean;
  onToggle: () => void;
}

export default function ProfileToggle({
  icon, iconBg, iconColor, title, value, onToggle,
}: ProfileToggleProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.content}>
        <AppText style={styles.title}>{title}</AppText>
      </View>
      <View style={[styles.toggle, !value && styles.toggleOff]}>
        <View style={styles.dot} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm + 4,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.white,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Spacing.borderRadius - 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  title: {
    fontSize: Typography.small,
    fontFamily: Fonts.medium,
    color: Colors.black,
  },
  toggle: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.green,
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  toggleOff: {
    backgroundColor: Colors.GrisPerle,
    alignItems: 'flex-start',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
});