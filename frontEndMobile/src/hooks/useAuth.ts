import { useRouter } from 'expo-router';
import { useState } from 'react';
import { authService } from '@/src/services/authService';
import {
  validateLoginForm,
  validateRegisterForm,
} from '@/src/validations/authValidation';
import { useFormState } from './useFormState';
import { useAuthGlobal } from '@/src/context/AuthContext'; // 👈 AJOUT

export function useAuth() {
  const router = useRouter();
  const { login } = useAuthGlobal(); // 👈 AJOUT — récupère le login du contexte
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const { values, setField } = useFormState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
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
      await login(values.email, values.password); // 👈 CHANGÉ — appelle le login du contexte
      // La redirection est déjà gérée dans AuthContext.handleLogin, donc plus besoin ici
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || 'Email ou mot de passe incorrect'
      );
    } finally {
      setLoading(false);
    }
  };

  // handleRegister reste inchangé, il n'a pas besoin du contexte
  

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
      router.replace('/(auth)/login');
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'inscription."
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
    loading,
    handleLogin,
    handleRegister,
  };
}