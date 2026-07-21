// src/components/common/AppMenuListItem.tsx
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import type { ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/src/constants/colors';
import Typography from '@/src/styles/typography';

import Spacing from '@/src/styles/spacing';

type MenuListItemProps = {
  title: string;
  subtitle: string;
  // L'un ou l'autre : icon pour un glyphe Ionicons (ex: menu "Plus"), iconImage pour un
  // logo de marque qui n'existe pas dans Ionicons (ex: SonarCloud, Jenkins).
  icon?: keyof typeof Ionicons.glyphMap;
  iconImage?: ImageSourcePropType;
  route: string | null;
  iconBgColor?: string;
  iconColor?: string;
  // Nouveau : remplace le chevron par défaut par n'importe quel élément (ex: ConnectorStatusBadge).
  // Si non fourni, le comportement existant (chevron seul) est inchangé.
  rightAccessory?: ReactNode;
  // Nouveau : appelé au tap. Si non fourni, retombe sur router.push(route) comme avant.
  // Utile pour les connecteurs où le tap doit parfois lancer un flow de connexion plutôt
  // que juste naviguer, ou ne rien faire si route est null (connecteur pas encore implémenté).
  onPress?: () => void;
};

export default function AppMenuListItem({
  title,
  subtitle,
  icon,
  iconImage,
  route,
  iconBgColor = Colors.greyLight,
  iconColor = Colors.black,
  rightAccessory,
  onPress,
}: MenuListItemProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onPress && !route}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        {iconImage ? (
          <Image source={iconImage} style={styles.iconImage} resizeMode="contain" />
        ) : icon ? (
          <Ionicons name={icon} size={20} color={iconColor} />
        ) : null}
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {rightAccessory ?? <Ionicons name="chevron-forward" size={20} color={Colors.black} />}
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
  iconImage: {
    width: 22,
    height: 22,
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