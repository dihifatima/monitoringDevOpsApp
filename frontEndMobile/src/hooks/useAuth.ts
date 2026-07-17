import { useRouter } from 'expo-router';
import { useState } from 'react';
import { authService } from '@/src/services/authService';
import {
  validateLoginForm,
  validateRegisterForm,
} from '@/src/validations/authValidation';
import { useFormState } from './useFormState';
import { useAuthGlobal } from '@/src/context/AuthContext';

export function useAuth() {
  const router = useRouter();
  const { login } = useAuthGlobal();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 👈 AJOUT (utilisé par activateAccount)
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const { values, setField } = useFormState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    code: '', // 👈 AJOUT — pour le champ code d'activation
  });

  const handleLogin = async () => {
    setApiError(null);
    setErrors({});

    const { errors: formErrors, isValid } = validateLoginForm(values);
    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      await login(values.email, values.password);
      // La redirection est déjà gérée dans AuthContext.handleLogin
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || 'Email ou mot de passe incorrect'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setApiError(null);
    setErrors({});

    const { errors: formErrors, isValid } = validateRegisterForm(values);
    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.register(values);
      router.replace('/(auth)/activateAccount'); // 👈 CHANGÉ — direction activation après inscription
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription."
      );
    } finally {
      setLoading(false);
    }
  };

  // 👇 AJOUT — logique d'activation de compte, regroupée ici
  const handleActivateAccount = async () => {
    setApiError(null);
    setSuccessMessage(null);
    setErrors({});

    if (!values.code || values.code.trim().length === 0) {
      setErrors({ code: 'Le code est requis' });
      return;
    }

    setLoading(true);
    try {
      await authService.activateAccount(values.code);
      setSuccessMessage('Compte activé avec succès !');
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || 'Code invalide ou expiré. Réessayez.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    setField,
    errors,
    apiError,
    successMessage, // 👈 AJOUT
    loading,
    handleLogin,
    handleRegister,
    handleActivateAccount, // 👈 AJOUT
  };
}