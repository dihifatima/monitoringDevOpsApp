import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '@/src/components/common/AppText';
import AppButton from '@/src/components/common/AppButton';
import Colors from '@/src/constants/colors';
import Spacing from '@/src/styles/spacing';
import Typography from '@/src/styles/typography';
import Fonts from '@/src/constants/fonts';

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  profilePicture: string | null;
  onEditPhoto: () => void;
  onEditProfile: () => void;
}

export default function ProfileHeader({
  fullName,
  email,
  profilePicture,
  onEditPhoto,
  onEditProfile,
}: ProfileHeaderProps) {
  const initials = fullName
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.avatarImg} />
          ) : (
            <AppText style={styles.initials}>{initials}</AppText>
          )}
        </View>
        <TouchableOpacity
          style={styles.editPhotoBtn}
          onPress={onEditPhoto}
          activeOpacity={0.8}
          accessibilityLabel="Edit profile photo"
        >
          <Ionicons name="pencil" size={12} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <AppText style={styles.name}>{fullName}</AppText>
      <AppText style={styles.email}>{email}</AppText>

      <AppButton
        label="Edit profile"
        variant="primary"
        onPress={onEditProfile}
        style={styles.editBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: Spacing.sm + 4,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.GrisPerle,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontSize: Typography.h3,
    fontFamily: Fonts.medium,
    color: Colors.black,
  },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.green,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: Typography.title,
    fontFamily: Fonts.semiBold,
    color: Colors.black,
    marginBottom: Spacing.xs - 1,
  },
  email: {
    fontSize: Typography.small - 1,
    fontFamily: Fonts.regular,
    color: Colors.GrisPerle,
    marginBottom: Spacing.md,
  },
  editBtn: {
    backgroundColor: Colors.green,
    paddingHorizontal: Spacing.xl,
    borderRadius: 22,
  },
});