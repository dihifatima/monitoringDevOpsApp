import { Pressable, Image, View, StyleSheet } from 'react-native';
import Images from '@/src/constants/images';
import Colors from '@/src/constants/colors';

type SonarStatusIconProps = {
  isSonarConnected: boolean;
  isRepoLinked: boolean;
  onPress: () => void;
};

export default function SonarStatusIcon({
  isSonarConnected,
  isRepoLinked,
  onPress,
}: SonarStatusIconProps) {
  const badgeColor = !isSonarConnected
    ? Colors.grey
    : isRepoLinked
    ? Colors.green
    : Colors.warning;

  return (
    <Pressable onPress={onPress} hitSlop={12} style={styles.wrapper}>
      <Image source={Images.sonarQubeLogo} style={styles.logo} resizeMode="contain" />
      <View style={[styles.badge, { backgroundColor: badgeColor }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
  },
  badge: {
    position: 'absolute',
    bottom: -8,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.grey,
  },
});