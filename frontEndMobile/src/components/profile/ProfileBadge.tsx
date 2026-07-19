import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Fonts from '@/src/constants/fonts';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';
interface ProfileBadgeProps {
  type: 'connected' | 'disconnected' | 'freq';
  label: string;
}

const badgeConfig = {
  connected: { bg: Colors.green, color: Colors.black },
  disconnected: { bg:Colors.GrisPerle, color: Colors.black},
  freq: { bg: Colors.progressActive, color:Colors.black },
};

export default function ProfileBadge({ type, label }: ProfileBadgeProps) {
  const config = badgeConfig[type];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <AppText style={[styles.label, { color: config.color }]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Spacing.borderRadius,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
  },
  label: {
    fontSize: Typography.small - 3,
    fontFamily: Fonts.medium,
  },
});