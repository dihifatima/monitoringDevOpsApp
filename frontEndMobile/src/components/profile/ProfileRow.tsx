import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';
import Fonts from '@/src/constants/fonts';

interface ProfileRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
  showChevron?: boolean;
}

export default function ProfileRow({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  rightElement,
  onPress,
  danger = false,
  showChevron = true,
}: ProfileRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      <View style={styles.content}>
        <AppText style={[styles.title, danger && { color: Colors.error }]}>
          {title}
        </AppText>
        {subtitle && (
          <AppText style={styles.subtitle}>{subtitle}</AppText>
        )}
      </View>

      <View style={styles.right}>
        {rightElement}
        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={16} color={Colors.GrisPerle} />
        )}
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
    flexShrink: 0,
  },
  content: { flex: 1 },
  title: {
    fontSize: Typography.small,
    fontFamily: Fonts.medium,
    color: Colors.black,
  },
  subtitle: {
    fontSize: Typography.small - 2,
    fontFamily: Fonts.regular,
    color: Colors.GrisPerle,
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm - 2,
    flexShrink: 0,
  },
});