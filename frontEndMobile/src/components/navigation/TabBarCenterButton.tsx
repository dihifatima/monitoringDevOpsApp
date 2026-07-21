import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/colors';
import { TabBarItemConfig } from './tabBarConfig';

interface TabBarCenterButtonProps {
  item: TabBarItemConfig;
  isFocused: boolean;
  onPress: () => void;
}

export default function TabBarCenterButton({ item, isFocused, onPress }: TabBarCenterButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <Ionicons
        name={item.icon}
        size={26}
        color={isFocused ? Colors.black : Colors.green}
      />
    </Pressable>
  );
}

const CIRCLE_SIZE = 60;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: -CIRCLE_SIZE / 2.2,
    alignSelf: 'center',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});