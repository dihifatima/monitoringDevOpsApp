import AppText from '@/src/components/common/AppText';
import ScreenContainer from '@/src/components/layout/ScreenContainer';
import Colors from '@/src/constants/colors';
import { StyleSheet, View } from 'react-native';

export default function PipelinesScreen() {
  return (
    <ScreenContainer backgroundColor={Colors.white}>
      <View style={styles.content}>
        <AppText variant="h1">Pipelines </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 20 },
});