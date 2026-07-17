import { useState } from 'react';
import { authService } from '@/src/services/authService';
import { validateForgotPasswordForm } from '@/src/validations/authValidation';
import { useFormState } from './useFormState';

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const { values, setField } = useFormState({ email: '' });

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
      setApiError(error.response?.data?.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return { values, setField, errors, apiError, successMessage, loading, handleForgotPassword };
}