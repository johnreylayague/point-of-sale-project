export type SignUpFormInputs = {
  Email: string;
  Password: string;
  BusinessName: string;
  Country: string;
  Timezone: string;
  Language: string;
  Currency: string;
  CountryId: string;
};

export type SignUpResponse = {
  message: string;
  data: { userId: string; email: string; token: string };
};

type ErrorResponse = {
  message: string;
  errors: {
    type: string;
    value: string;
    msg: string;
    path: "Email" | "Password" | "BusinessName" | "CountryId";
    location: string;
  }[];
};

export type ResponseData = {
  response: SignUpResponse | ErrorResponse;
  status: 422 | 201;
};

export type SignupUserResponse = ResponseData | undefined;
