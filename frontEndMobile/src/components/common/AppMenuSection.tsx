import { View, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import Colors from '@/src/constants/colors';
type MenuSectionProps = {
  children: ReactNode;
};

export default function MenuSection({  children }: MenuSectionProps) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  }
});