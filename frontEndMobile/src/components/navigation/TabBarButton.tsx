import { Pressable, View, StyleSheet } from 'react-native';
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
  const color = isFocused ? Colors.green : Colors.GrisPerle;
  const iconName = isFocused && item.activeIcon ? item.activeIcon : item.icon;

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={styles.content}>
        <Ionicons name={iconName} size={24} color={color} />
        {item.label && (
          <AppText variant="small" color={color} style={styles.label}>
            {item.label}
          </AppText>
        )}
      </View>
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
    gap: 2,
  },
  label: {
    fontSize: 11,
  },
});