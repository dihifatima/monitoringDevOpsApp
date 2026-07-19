import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Colors from '@/src/constants/colors';
import { tabBarItems } from './tabBarConfig';
import TabBarButton from './TabBarButton';
import TabBarCenterButton from './TabBarCenterButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_HEIGHT = 70;
const NOTCH_RADIUS = 38;

function buildCurvePath(width: number, height: number): string {
  const centerX = width / 2;

  return `
    M0,0
    H${centerX - NOTCH_RADIUS - 10}
    C${centerX - NOTCH_RADIUS + 10},0 ${centerX - NOTCH_RADIUS},${NOTCH_RADIUS} ${centerX},${NOTCH_RADIUS}
    C${centerX + NOTCH_RADIUS},${NOTCH_RADIUS} ${centerX + NOTCH_RADIUS - 10},0 ${centerX + NOTCH_RADIUS + 10},0
    H${width}
    V${height}
    H0
    Z
  `;
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <Svg width={SCREEN_WIDTH} height={BAR_HEIGHT} style={styles.svg}>
        <Path d={buildCurvePath(SCREEN_WIDTH, BAR_HEIGHT)} fill={Colors.white} />
      </Svg>

      <View style={styles.itemsRow}>
        {state.routes.map((route, index) => {
          const item = tabBarItems.find((i) => i.name === route.name);
          if (!item) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (item.isCenter) {
            return (
              <TabBarCenterButton
                key={route.key}
                item={item}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          }

          return (
            <TabBarButton
              key={route.key}
              item={item}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
  },
  svg: {
    position: 'absolute',
    bottom: 0,
  },
  itemsRow: {
    flexDirection: 'row',
    height: BAR_HEIGHT,
    alignItems: 'center',
  },
});