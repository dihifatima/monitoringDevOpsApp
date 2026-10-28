import React from 'react';
import { View, KeyboardTypeOptions, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from './AppInput';

export interface FormFieldConfig {
  key: string;
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  editable?: boolean;
}

interface AppFormProps {
  fields: FormFieldConfig[];
  // `object` accepte les interfaces (PasswordFormValues...) et les valeurs en plus (email)
  values: object;
  errors: Record<string, string | null | undefined>;
  // syntaxe méthode : accepte un handler dont `key` est plus restreint
  onChange(key: string, value: string): void;
}

export default function AppForm({ fields, values, errors, onChange }: AppFormProps) {
  const vals = values as Record<string, string | undefined>;
  return (
    <View>
      {fields.map((field) => (
        <AppInput
          key={field.key}
          icon={field.icon}
          placeholder={field.placeholder}
          value={vals[field.key] ?? ''}
          onChangeText={(text) => onChange(field.key, text)}
          secureTextEntry={field.secureTextEntry}
          secureToggle={field.secureTextEntry}
          keyboardType={field.keyboardType}
          autoCapitalize={field.autoCapitalize}
          error={errors[field.key] ?? undefined}
          editable={field.editable ?? true}
        />
      ))}
    </View>
  );
}