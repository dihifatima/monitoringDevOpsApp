// src/components/common/navigation/TabBarButton.tsx
import { useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import { TabBarItemConfig } from './tabBarConfig';

interface TabBarButtonProps {
  item: TabBarItemConfig;
  isFocused: boolean;
  onPress: () => void;
}

export default function TabBarButton({ item, isFocused, onPress }: TabBarButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.08 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: isFocused ? 1.08 : 1,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const iconColor = isFocused ? Colors.green : Colors.black;
  const labelColor = isFocused ? Colors.green : Colors.grey;
  const iconName = isFocused && item.activeIcon ? item.activeIcon : item.icon;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
        {item.label && (
          <AppText
            variant="small"
            color={labelColor}
            style={[
              styles.label,
              { fontWeight: isFocused ? '600' : '500' },
            ]}
          >
            {item.label}
          </AppText>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
  },
});