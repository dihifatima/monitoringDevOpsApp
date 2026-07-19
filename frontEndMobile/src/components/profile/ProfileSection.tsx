import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';
import Fonts from '@/src/constants/fonts';

interface ProfileSectionProps {
  label: string;
  children: React.ReactNode;
}

export default function ProfileSection({ label, children }: ProfileSectionProps) {
  return (
    <View style={styles.section}>
      {label.length > 0 && (
        <AppText style={styles.label}>{label}</AppText>
      )}
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm + 4,
  },
  label: {
    fontSize: Typography.small - 3,
    fontFamily: Fonts.semiBold,
    color: Colors.GrisPerle,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.xs + 2,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.cardRadius - 4,
    overflow: 'hidden',
  },
});