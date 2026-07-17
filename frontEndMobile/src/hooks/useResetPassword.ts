import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '@/src/services/authService';
import { validateResetPasswordForm } from '@/src/validations/authValidation';
import { useFormState } from './useFormState';

export function useResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // 👇 AJOUT du champ "code"
  const { values, setField } = useFormState({ code: '', password: '', confirmPassword: '' });

  const handleResetPassword = async () => {
    setApiError(null);
    setErrors({});

    const { errors: formErrors, isValid } = validateResetPasswordForm(values);
    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      // 👇 CHANGÉ — on envoie values.code (tapé par l'utilisateur) au lieu du token d'URL
      await authService.resetPassword(values.code, values.password);
      router.replace('/(auth)/login');
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Le code est peut-être invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  return { values, setField, errors, apiError, loading, handleResetPassword };
}