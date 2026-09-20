import { useRouter } from 'expo-router';
import { useState } from 'react';
import { authService } from '@/src/services/authService';
import {
  validateLoginForm,
  validateRegisterForm,
  validateForgotPasswordForm,
  validateResetPasswordForm,
} from '@/src/validations/authValidation';
import { useFormState } from '@/src/hooks/useFormState';
import { useAuthGlobal } from '@/src/context/AuthContext';

function formatLockedMessage(retryAfterSeconds: number): string {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  if (minutes <= 1) {
    return 'Compte verrouillé suite à plusieurs tentatives échouées. Réessayez dans moins d’une minute.';
  }
  return `Compte verrouillé suite à plusieurs tentatives échouées. Réessayez dans ${minutes} minutes.`;
}

// Centralise l'extraction du message d'erreur backend : gère businessErrorCode 302
// (compte verrouillé, avec retryAfterSeconds), les erreurs de validation @Valid
// (tableau validationErrors), puis error / businessErrorDescription, avec fallback.
function getApiErrorMessage(error: any, fallback: string): string {
  const data = error.response?.data;
  if (!data) return fallback;

  if (data.businessErrorCode === 302 && data.retryAfterSeconds != null) {
    return formatLockedMessage(data.retryAfterSeconds);
  }
  if (Array.isArray(data.validationErrors) && data.validationErrors.length > 0) {
    return data.validationErrors[0];
  }
  return data.error || data.businessErrorDescription || fallback;
}

export function useAuth() {
  const router = useRouter();
  const { login } = useAuthGlobal();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const { values, setField } = useFormState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    code: '',
    confirmPassword: ''
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
    } catch (error: any) {
      setApiError(getApiErrorMessage(error, 'Email ou mot de passe incorrect'));
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
      router.replace('/(auth)/activateAccount');
    } catch (error: any) {
      setApiError(getApiErrorMessage(error, "Une erreur est survenue lors de l'inscription."));
    } finally {
      setLoading(false);
    }
  };

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
      setApiError(getApiErrorMessage(error, 'Code invalide ou expiré. Réessayez.'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setApiError(null);
    setSuccessMessage(null);
    setErrors({});

    const { errors: formErrors, isValid } = validateForgotPasswordForm(values);
    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(values.email);
      setSuccessMessage("Un email de réinitialisation a été envoyé si ce compte existe.");
    } catch (error: any) {
      setApiError(getApiErrorMessage(error, "Une erreur est survenue. Réessayez."));
    } finally {
      setLoading(false);
    }
  };

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
      await authService.resetPassword(values.code, values.password);
      router.replace('/(auth)/login');
    } catch (error: any) {
      setApiError(getApiErrorMessage(error, "Le code est peut-être invalide ou expiré."));
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    setField,
    errors,
    apiError,
    successMessage,
    loading,
    handleLogin,
    handleRegister,
    handleActivateAccount,
    handleForgotPassword,
    handleResetPassword,
  };
}