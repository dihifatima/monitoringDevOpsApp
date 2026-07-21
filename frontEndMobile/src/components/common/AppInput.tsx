// src/components/common/AppInput.tsx
import { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  secureToggle?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function AppInput({
  label,
  error,
  secureToggle,
  secureTextEntry,
  icon,
  style,
  editable = true,
  ...rest
}: AppInputProps) {
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : null,
          !editable ? styles.inputContainerDisabled : null, // NOUVEAU
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={Colors.GrisPerle}
            style={styles.icon}
          />
        ) : null}

        <TextInput
          style={[styles.input, !editable && styles.inputDisabled, style]}
          placeholderTextColor={Colors.GrisPerle}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          editable={editable}
          {...rest}
        />

        {secureToggle && (
          <Pressable onPress={() => setHidden((prev) => !prev)}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={Colors.GrisPerle}
            />
          </Pressable>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.sm },
  label: { fontSize: Typography.small, color: Colors.black, marginBottom: Spacing.xs },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.GrisPerle,
    borderRadius: Spacing.inputRadius,
    paddingHorizontal: Spacing.md,
  },
  inputContainerError: { borderColor: Colors.error },
  inputContainerDisabled: {
    backgroundColor: '#F2F2F2', // gris clair, signale "non modifiable"
  },
  icon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm + 6,
    fontSize: Typography.small,
    color: Colors.black,
  },
  inputDisabled: {
    color: Colors.GrisPerle, // texte grisé
  },
  errorText: { fontSize: 12, color: Colors.error, marginTop: Spacing.xs },
});