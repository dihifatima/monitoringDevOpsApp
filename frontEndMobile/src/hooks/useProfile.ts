// src/hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  clientService,
  ProfileResponse,
  UpdateProfileRequest,
} from '@/src/services/ProfilService';

interface ProfileFormValues {
  fullName: string;
  jobTitle: string;
  company: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type NotificationFrequency = 'REALTIME' | 'DAILY_SUMMARY' | 'WEEKLY_SUMMARY';

export function useProfile() {
  // --- Lecture ---
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Édition profil ---
  const [values, setValues] = useState<ProfileFormValues>({
    fullName: '',
    jobTitle: '',
    company: '',
  });
  const [saving, setSaving] = useState(false);

  // --- Mot de passe ---
  const [passwordValues, setPasswordValues] = useState<PasswordFormValues>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof PasswordFormValues, string>>
  >({});
  const [savingPassword, setSavingPassword] = useState(false);

  // --- Notifications ---
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationFrequency, setNotificationFrequency] =
    useState<NotificationFrequency>('REALTIME');
  const [savingNotifications, setSavingNotifications] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getProfile();
      setProfile(data);
      // Synchronise le formulaire avec les données fraîches
      setValues({
        fullName: data.fullName ?? '',
        jobTitle: data.jobTitle ?? '',
        company: data.company ?? '',
      });
      setNotificationsEnabled(data.notificationEnabled ?? false);
      setNotificationFrequency(
        (data.notificationFrequency as NotificationFrequency) ?? 'REALTIME'
      );
    } catch (err) {
      setError('Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (key: keyof ProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!values.fullName.trim()) {
      setError('Le nom est requis');
      return;
    }

    setSaving(true);
    try {
      // Découpe "fullName" en firstname/lastname pour matcher l'API
      const [firstname, ...rest] = values.fullName.trim().split(' ');
      const payload: UpdateProfileRequest = {
        firstname,
        lastname: rest.join(' '),
        jobTitle: values.jobTitle || undefined,
        company: values.company || undefined,
      };

      await clientService.updateProfile(payload);
      await fetchProfile();
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (err) {
      setError('Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (key: keyof PasswordFormValues, value: string) => {
    setPasswordValues((prev) => ({ ...prev, [key]: value }));
    // On efface l'erreur du champ dès que l'utilisateur le modifie
    setPasswordErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handlePasswordSubmit = async () => {
    const nextErrors: Partial<Record<keyof PasswordFormValues, string>> = {};

    if (!passwordValues.currentPassword) {
      nextErrors.currentPassword = 'Le mot de passe actuel est requis';
    }
    if (!passwordValues.newPassword) {
      nextErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (passwordValues.newPassword.length < 8) {
      nextErrors.newPassword = 'Au moins 8 caractères';
    }
    if (passwordValues.confirmPassword !== passwordValues.newPassword) {
      nextErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSavingPassword(true);
    try {
      await clientService.updatePassword({
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
      });
      setPasswordValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Succès', 'Mot de passe mis à jour');
    } catch (err) {
      // Le mot de passe actuel est probablement incorrect (401/400 côté API)
      setPasswordErrors({ currentPassword: 'Mot de passe actuel incorrect' });
    } finally {
      setSavingPassword(false);
    }
  };

  // Sauvegarde optimiste : l'UI réagit immédiatement (utile pour un Switch),
  // clientService.updateNotifications est appelé en arrière-plan, et on
  // revient en arrière si ça échoue.
  const updateNotificationSettings = useCallback(
    async (patch: { enabled?: boolean; frequency?: NotificationFrequency }) => {
      const previousEnabled = notificationsEnabled;
      const previousFrequency = notificationFrequency;

      const nextEnabled = patch.enabled ?? notificationsEnabled;
      const nextFrequency = patch.frequency ?? notificationFrequency;

      setNotificationsEnabled(nextEnabled);
      setNotificationFrequency(nextFrequency);
      setSavingNotifications(true);

      try {
        const updated = await clientService.updateNotifications({
          notificationsEnabled: nextEnabled,
          notificationFrequency: nextFrequency,
        });
        setProfile(updated);
      } catch (err) {
        // rollback si l'API échoue
        setNotificationsEnabled(previousEnabled);
        setNotificationFrequency(previousFrequency);
        Alert.alert('Erreur', "Impossible de mettre à jour les notifications");
      } finally {
        setSavingNotifications(false);
      }
    },
    [notificationsEnabled, notificationFrequency]
  );

  const handleToggleNotifications = (value: boolean) =>
    updateNotificationSettings({ enabled: value });

  const handleFrequencyChange = (frequency: NotificationFrequency) =>
    updateNotificationSettings({ frequency });

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    values,
    saving,
    handleChange,
    handleSubmit,
    // Mot de passe
    passwordValues,
    passwordErrors,
    savingPassword,
    handlePasswordChange,
    handlePasswordSubmit,
    // Notifications
    notificationsEnabled,
    notificationFrequency,
    savingNotifications,
    handleToggleNotifications,
    handleFrequencyChange,
  };
}