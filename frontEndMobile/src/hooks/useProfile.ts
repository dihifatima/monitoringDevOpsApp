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

export function useProfile() {
  // --- Lecture ---
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Édition ---
  const [values, setValues] = useState<ProfileFormValues>({
    fullName: '',
    jobTitle: '',
    company: '',
  });
  const [saving, setSaving] = useState(false);

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

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    values,
    saving,
    handleChange,
    handleSubmit,
  };
}