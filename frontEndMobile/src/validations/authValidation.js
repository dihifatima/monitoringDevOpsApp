export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return "L'email est requis";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email invalide";
  }
  return null; // pas d'erreur
};

export const validatePassword = (password) => {
  if (!password || password.length === 0) {
    return "Le mot de passe est requis";
  }
  if (password.length < 6) {
    return "Le mot de passe doit contenir au moins 6 caractères";
  }
  return null;
};
export const validateName = (name, fieldName = "Le nom") => {
  if (!name || name.trim().length === 0) {
    return `${fieldName} est requis`;
  }
  if (name.trim().length < 2) {
    return `${fieldName} doit contenir au moins 2 caractères`;
  }
  return null;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  const isValid = !errors.email && !errors.password;

  return { errors, isValid };
};




export const validateRegisterForm = ({ firstname, lastname, email, password }) => {
  const errors = {
    firstname: validateName(firstname, "Le prénom"),
    lastname: validateName(lastname, "Le nom"),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  const isValid = !errors.firstname && !errors.lastname && !errors.email && !errors.password;

  return { errors, isValid };
};

export const validateForgotPasswordForm = ({ email }) => {
  const errors = { email: validateEmail(email) };
  return { errors, isValid: !errors.email };
};

export const validateResetPasswordForm = ({ password, confirmPassword }) => {
  const errors = {
    password: validatePassword(password),
    confirmPassword:
      password !== confirmPassword ? "Les mots de passe ne correspondent pas" : null,
  };
  const isValid = !errors.password && !errors.confirmPassword;
  return { errors, isValid };
};