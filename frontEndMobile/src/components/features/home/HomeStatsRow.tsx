import { View, StyleSheet } from 'react-native';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

type Props = {
  totalRepos: number;
  success: number;
  failure: number;
  building: number;
};

export default function HomeStatsRow({ totalRepos, success, failure, building }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: Colors.info }]}>
        <AppText variant="small" bold color={Colors.black}>
          {totalRepos}
        </AppText>
        <AppText variant="heighSmall" color={Colors.black}>
          Repos suivis
        </AppText>
      </View>
      <View style={[styles.card, { backgroundColor: Colors.green }]}>
        <AppText variant="h4" bold color={Colors.black}>
          {success}
        </AppText>
        <AppText variant="small" color={Colors.black}>
          Builds OK !
        </AppText>
      </View>
      <View style={[styles.card, { backgroundColor: Colors.buildFailed }]}>
        <AppText variant="h4" bold color={Colors.black}>
          {failure}
        </AppText>
        <AppText variant="small" color={Colors.black}>
          Builds échoués
        </AppText>
      </View>
      <View style={[styles.card, { backgroundColor: Colors.warning }]}>
        <AppText variant="h4" bold color={Colors.black}>
          {building}
        </AppText>
        <AppText variant="small" color={Colors.black}>
          En cours
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.s,
  },
  card: {
    flex: 1,
    borderRadius: Spacing.cardRadius,
    padding: Spacing.xs,
    alignItems: 'center',
  },
});