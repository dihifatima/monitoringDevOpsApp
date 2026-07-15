import { StyleSheet } from 'react-native';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

export const authScreenStyles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'center' },
  title: { marginBottom: Spacing.xl, textAlign: 'center' },
  apiError: { textAlign: 'center', marginTop: Spacing.xs, marginBottom: Spacing.sm },
  primaryButton: { marginTop: Spacing.md, marginBottom: Spacing.lg },
  linkText: { textAlign: 'center' },
  linkBold: { color: Colors.black, fontWeight: '600' },
});