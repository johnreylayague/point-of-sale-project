export type ForgotPasswordForm = {
  Email: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

type ErrorResponse = {
  message: string;
  errors: {
    type: string;
    value: string;
    msg: string;
    path: "Email";
    location: string;
  }[];
};

export type ResponseData = {
  response: ForgotPasswordResponse | ErrorResponse;
  status: 422 | 200;
};

export type ForgotPasswordUserResponse = ResponseData | undefined;
