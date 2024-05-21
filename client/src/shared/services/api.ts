import {
  FetchCountriesResponse,
  CountriesResponse,
} from "../types/api/fetchFountries";
import {
  SignUpFormInputs,
  SignupUserResponse,
  SignUpResponse,
} from "../types/api/signupUser";
import {
  ForgotPasswordUserResponse,
  ForgotPasswordForm,
  ForgotPasswordResponse,
} from "../types/api/forgotPasswordUser";
import {
  LoginUserResponse,
  LoginForm,
  LoginResponse,
} from "../types/api/loginUser";
import {
  ResetPasswordUserResponse,
  ResetPasswordForm,
  ResetPasswordResponse,
  ResetPasswordToken,
} from "../types/api/resetPasswordUser";
import { ProductForm } from "../types/api/products";

export async function loginUser(data: LoginForm): Promise<LoginUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/v1/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData: LoginResponse = await response.json();

  if (response.status === 422 || response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not login.");
  }
}

export async function fetchCountries(): Promise<FetchCountriesResponse> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/v1/countries`;

  const response = await fetch(url);

  const responseData: CountriesResponse = await response.json();

  if (response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Something went wrong.");
  }
}

export async function signupUser(
  data: SignUpFormInputs
): Promise<SignupUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/v1/auth/signup`;

  const response: Response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData: SignUpResponse = await response.json();

  if (response.status === 422 || response.status === 201) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not sign up.");
  }
}

export async function forgotPasswordUser(
  data: ForgotPasswordForm
): Promise<ForgotPasswordUserResponse> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/v1/auth/forgotPassword`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData: ForgotPasswordResponse = await response.json();

  if (response.status === 422 || response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not sign up.");
  }
}

export async function resetPasswordUser(
  data: ResetPasswordForm,
  token: ResetPasswordToken
): Promise<ResetPasswordUserResponse> {
  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }/v1/auth/resetPassword/${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData: ResetPasswordResponse = await response.json();

  if (
    response.status === 422 ||
    response.status === 404 ||
    response.status === 200
  ) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not sign up.");
  }
}

export async function createProduct(data: ProductForm, token: string) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/products`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  const responseData: ResetPasswordResponse = await response.json();

  // if (
  //   response.status === 422 ||
  //   response.status === 404 ||
  //   response.status === 200
  // ) {
  //   return { response: responseData, status: response.status };
  // }

  if (!response.ok) {
    throw new Error("Could not create product");
  }
}
