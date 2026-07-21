// src/components/profile/AvatarPicker.tsx
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';

interface AvatarPickerProps {
  imageUri?: string | null;
  onPress: () => void;
}

export default function AvatarPicker({ imageUri, onPress }: AvatarPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="person" size={40} color={Colors.GrisPerle} />
          </View>
        )}
      </View>

      <Pressable onPress={onPress}>
        <AppText variant="small" color={Colors.accent} bold>
          Modifier la photo
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginBottom: Spacing.lg },
  avatarWrapper: { marginBottom: Spacing.sm },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  placeholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});