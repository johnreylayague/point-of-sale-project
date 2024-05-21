export type ResetPasswordForm = {
  Email: string;
  Password: string;
  ConfirmPassword: string;
};

export type ResetPasswordToken = string;

export type ResetPasswordResponse = {
  message: string;
};

type ErrorResponse = {
  message: string;
  errors: {
    type: string;
    value: string;
    msg: string;
    path: "Email" | "Password";
    location: string;
  }[];
};

export type ResponseData = {
  response: ResetPasswordResponse | ErrorResponse;
  status: 422 | 200 | 404;
};

export type ResetPasswordUserResponse = ResponseData | undefined;
