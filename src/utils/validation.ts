export const validationRules = {
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    errorMessage: 'Name must be between 2-50 characters and contain only letters and spaces',
  },
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
    errorMessage: 'Username must be between 3-30 characters and contain only letters, numbers, and underscores',
  },
  avatarUrl: {
    pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    errorMessage: 'Avatar URL must be a valid URL',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    errorMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  },
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.length < validationRules.name.minLength) {
    return { isValid: false, error: validationRules.name.errorMessage };
  }
  if (name.length > validationRules.name.maxLength) {
    return { isValid: false, error: validationRules.name.errorMessage };
  }
  if (!validationRules.name.pattern.test(name)) {
    return { isValid: false, error: validationRules.name.errorMessage };
  }
  return { isValid: true };
};

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username || username.length < validationRules.username.minLength) {
    return { isValid: false, error: validationRules.username.errorMessage };
  }
  if (username.length > validationRules.username.maxLength) {
    return { isValid: false, error: validationRules.username.errorMessage };
  }
  if (!validationRules.username.pattern.test(username)) {
    return { isValid: false, error: validationRules.username.errorMessage };
  }
  return { isValid: true };
};

export const validateAvatarUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url) return { isValid: true }; // Optional field
  if (!validationRules.avatarUrl.pattern.test(url)) {
    return { isValid: false, error: validationRules.avatarUrl.errorMessage };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password || password.length < validationRules.password.minLength) {
    return { isValid: false, error: validationRules.password.errorMessage };
  }
  if (!validationRules.password.pattern.test(password)) {
    return { isValid: false, error: validationRules.password.errorMessage };
  }
  return { isValid: true };
};
