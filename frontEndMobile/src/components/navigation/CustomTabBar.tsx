import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, LayoutChangeEvent, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { tabBarItems } from './tabBarConfig';
import TabBarButton from './TabBarButton';
import Colors from '@/src/constants/colors';
import { useSetTabBarHeight } from '@/src/context/TabBarHeightContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export const BAR_HEIGHT = 70;
const BORDER_RADIUS = 30;
const MARGIN_H = 15;
export const MARGIN_BOTTOM = 10;
const BUMP_RADIUS = 10;
const BUMP_HEIGHT = 2;

function buildBarPath(width: number, height: number, radius: number, bumpX: number): string {
  const r = radius;

  return `
    M0,${r}
    Q0,0 ${r},0
    L${bumpX - BUMP_RADIUS - 6},0
    C${bumpX - BUMP_RADIUS + 2},0 ${bumpX - BUMP_RADIUS + 3},${-BUMP_HEIGHT} ${bumpX},${-BUMP_HEIGHT}
    C${bumpX + BUMP_RADIUS - 3},${-BUMP_HEIGHT} ${bumpX + BUMP_RADIUS - 2},0 ${bumpX + BUMP_RADIUS + 6},0
    L${width - r},0
    Q${width},0 ${width},${r}
    L${width},${height - r}
    Q${width},${height} ${width - r},${height}
    L${r},${height}
    Q0,${height} 0,${height - r}
    Z
  `;
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const [barWidth, setBarWidth] = useState(0);
  const [bumpX, setBumpX] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;
  const setTabBarHeight = useSetTabBarHeight();
  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom + MARGIN_BOTTOM;
  const itemCount = state.routes.length;
  const itemWidth = barWidth / itemCount;

useEffect(() => {
  setTabBarHeight(BAR_HEIGHT + BUMP_HEIGHT + bottomOffset);
}, [setTabBarHeight, bottomOffset]);

  useEffect(() => {
    if (barWidth === 0) return;

    const targetX = state.index * itemWidth + itemWidth / 2;

    const listenerId = animValue.addListener(({ value }) => {
      setBumpX(value);
    });

    Animated.spring(animValue, {
      toValue: targetX,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();

    return () => animValue.removeListener(listenerId);
  }, [state.index, barWidth, itemWidth]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setBarWidth(width);
    const initialX = state.index * (width / itemCount) + width / itemCount / 2;
    setBumpX(initialX);
    animValue.setValue(initialX);
  };

  return (
<View style={[styles.wrapper, { bottom: bottomOffset }]}>      <View style={styles.shadowWrapper}>
        <View style={styles.svgContainer} onLayout={handleLayout}>
          {barWidth > 0 && (
            <Svg
              width={barWidth}
              height={BAR_HEIGHT + BUMP_HEIGHT}
              style={styles.svg}
            >
              <Path
                d={buildBarPath(barWidth, BAR_HEIGHT, BORDER_RADIUS, bumpX)}
                fill={Colors.success}
              />
            </Svg>
          )}

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: MARGIN_H,
    right: MARGIN_H,
  },
  shadowWrapper: {
    borderRadius: BORDER_RADIUS,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  svgContainer: {
    width: '100%',
    height: BAR_HEIGHT + BUMP_HEIGHT,
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  itemsRow: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    height: BAR_HEIGHT,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});