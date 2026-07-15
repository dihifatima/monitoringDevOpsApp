import { useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '@/src/services/authService'; //
import { validateLoginForm, validateRegisterForm } from '@/src/validations/authValidation'; //[cite: 13]

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // --- ÉTATS COMMUNS & D'INSCRIPTION ---
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- LOGIQUE DE CONNEXION (LOGIN) ---
  const handleLogin = async () => {
    setApiError(null);
    setErrors({});

    const { errors: formErrors, isValid } = validateLoginForm({ email, password }); //[cite: 13]

    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password); //[cite: 14]
      router.replace('/(tabs)/home'); // Redirection après connexion réussie
    } catch (error: any) {
      const message = error.response?.data?.message || "Email ou mot de passe incorrect";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE D'INSCRIPTION (REGISTER) ---
  const handleRegister = async () => {
    setApiError(null);
    setErrors({});

    const { errors: formErrors, isValid } = validateRegisterForm({
      firstname,
      lastname,
      email,
      password,
    });

    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      await authService.register({ firstname, lastname, email, password }); //[cite: 14]
      router.replace('/(auth)/login'); // Redirection vers le login après inscription
    } catch (error: any) {
      const message = error.response?.data?.message || "Une erreur est survenue lors de l'inscription.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    // États des champs
    firstname,
    setFirstname,
    lastname,
    setLastname,
    email,
    setEmail,
    password,
    setPassword,
    
    // États partagés
    errors,
    apiError,
    loading,
    
    // Fonctions d'action
    handleLogin,
    handleRegister,
  };
}