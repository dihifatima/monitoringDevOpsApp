import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';
import Fonts from '@/src/constants/fonts';

interface ProfileMetaRowProps {
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}

export default function ProfileMetaRow({
  label,
  value,
  valueColor = Colors.GrisPerle,
  isLast = false,
}: ProfileMetaRowProps) {
  return (
    <View style={[styles.row, isLast && styles.lastRow]}>
      <AppText style={styles.label}>{label}</AppText>
      <AppText style={[styles.value, { color: valueColor }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 3,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.white,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: Typography.small - 1,
    fontFamily: Fonts.regular,
    color: Colors.GrisPerle,
  },
  value: {
    fontSize: Typography.small - 1,
    fontFamily: Fonts.medium,
  },
});