export async function loginUser(data) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/v1/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(responseData));
  }

  return responseData;
}

export async function fetchCountries(data) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/v1/countries`;

  const response = await fetch(url);

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Something went wrong.");
  }

  return responseData;
}

export async function signupUser(data) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/v1/auth/signup`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (response.status === 422 || response.status === 201) {
    return responseData;
  }

  if (!response.ok) {
    throw new Error("Could not sign up.");
  }
}

export async function forgotPasswordUser(data) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/v1/auth/forgotPassword`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (response.status === 422 || response.status === 200) {
    return responseData;
  }

  if (!response.ok) {
    throw new Error("Could not sign up.");
  }
}

export async function resetPasswordUser(data, token) {
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

  const responseData = await response.json();

  if (response.status === 422 || response.status === 200) {
    return responseData;
  }

  if (!response.ok) {
    throw new Error("Could not sign up.");
  }
}
