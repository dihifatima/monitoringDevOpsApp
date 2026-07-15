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
  ...rest
}: AppInputProps) {
  // Gère l'état d'affichage du mot de passe (masqué ou visible)
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={styles.wrapper}>
      {/* Affiche le label au-dessus si fourni */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Conteneur de l'input (icône + champ + œil) */}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : null, // Applique la bordure rouge s'il y a une erreur
        ]}
      >
        {/* Icône de gauche si fournie */}
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={Colors.GrisPerle}
            style={styles.icon}
          />
        ) : null}

        {/* Le champ de saisie de texte réel */}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.GrisPerle}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          {...rest}
        />

        {/* Icône d'œil interactif pour masquer/révéler le mot de passe */}
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

      {/* Message d'erreur en rouge sous le champ */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: Typography.small,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.GrisPerle,
    borderRadius: Spacing.inputRadius,
    paddingHorizontal: Spacing.md,
  },
  // CORRIGÉ : On change la couleur de la bordure et non celle du texte d'une View
  inputContainerError: {
    borderColor: Colors.error, 
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm + 6,
    fontSize: Typography.small,
    color: Colors.black,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});