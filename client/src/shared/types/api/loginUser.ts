export type LoginForm = {
  Email: string;
  Password: string;
};

export type LoginResponse = {
  message: string;
  data: { userId: string; email: string; token: string };
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
  response: LoginResponse | ErrorResponse;
  status: 422 | 200;
};

export type LoginUserResponse = ResponseData | undefined;
