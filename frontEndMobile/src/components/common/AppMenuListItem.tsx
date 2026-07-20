// src/components/common/MenuListItem.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/src/constants/colors';
import Typography from '@/src/styles/typography';

 import Spacing from '@/src/styles/spacing';

type MenuListItemProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  iconBgColor?: string;
  iconColor?: string;
};

export default function AppMenuListItem({
  title,
  subtitle,
  icon,
  route,
  iconBgColor = Colors.greyLight,
  iconColor = Colors.black,
}: MenuListItemProps) {
  return (
    <Pressable
      onPress={() => router.push(route as any)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={Colors.black} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greyLight,
    borderRadius: Spacing.borderRadius,
    padding: 16,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: Typography.body,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.small,
    color: Colors.black,
  },
});