// src/components/common/AppForm.tsx
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardTypeOptions, TextInputProps } from 'react-native';
import AppInput from './AppInput';

export interface FormFieldConfig {
  key: string;
  icon?: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  editable?: boolean; // NOUVEAU : false = champ verrouillé (ex: email)
}

interface AppFormProps {
  fields: FormFieldConfig[];
  values: Record<string, string>;
  errors: Record<string, string | null | undefined>;
  onChange: (key: string, value: string) => void;
}

export default function AppForm({
  fields,
  values,
  errors,
  onChange,
}: AppFormProps) {
  return (
    <View>
      {fields.map((field) => (
        <AppInput
          key={field.key}
          icon={field.icon}
          placeholder={field.placeholder}
          value={values[field.key] ?? ''}
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