const maxLength = 50;
const minLength = 5;

export const validateSignUp = {
  Currency: {
    required: true,
  },
  Timezone: {
    required: true,
  },
  Language: {
    required: true,
  },
  Email: {
    required: "Email field is required.",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please provide a valid email address.",
    },
    maxLength: {
      value: maxLength,
      message: `Email cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Email cannot be less than ${minLength} characters`,
    },
  },
  Password: {
    required: `Password field is required.`,
    maxLength: {
      value: maxLength,
      message: `Password cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Password cannot be less than ${minLength} characters`,
    },
  },
  BusinessName: {
    required: `Business Name field is required.`,
    maxLength: {
      value: maxLength,
      message: `Business Name cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Business Name cannot be less than ${minLength} characters`,
    },
  },
  CountryId: {
    required: "Country field is required.",
  },
};

export const validateResetPassword = {
  Email: {
    required: "Email field is required.",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please provide a valid email address.",
    },
    maxLength: {
      value: maxLength,
      message: `Password cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Password cannot be less than ${minLength} characters`,
    },
  },
  Password: {
    required: `Password field is required.`,
    maxLength: {
      value: maxLength,
      message: `Password cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Password cannot be less than ${minLength} characters`,
    },
  },
  ConfirmPassword: {
    required: `Password field is required.`,
    maxLength: {
      value: maxLength,
      message: `Password cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Password cannot be less than ${minLength} characters`,
    },
  },
};

export const validateForgotPassword = {
  Email: {
    required: "Email field is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please provide a valid email address.",
    },
    maxLength: {
      value: maxLength,
      message: `Password cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Password cannot be less than ${minLength} characters`,
    },
  },
};

export const validateLogin = {
  Email: {
    required: "Email field is required.",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Please provide a valid email address.",
    },
    maxLength: {
      value: maxLength,
      message: `Email cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Email cannot be less than ${minLength} characters`,
    },
  },
  Password: {
    required: `Password field is required.`,
    maxLength: {
      value: maxLength,
      message: `Password cannot exceed ${maxLength} characters`,
    },
    minLength: {
      value: minLength,
      message: `Password cannot be less than ${minLength} characters`,
    },
  },
};
