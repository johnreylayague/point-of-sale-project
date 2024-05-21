export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
};

export const getTokenDuration = (): number => {
  const storedExpirationDate = localStorage.getItem("expiration") ?? 0;
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
};

export const getAuthToken = (): string | null | "EXPIRED" => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return "EXPIRED";
  }

  return token;
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const setTokenAndExpiration = (token: string) => {
  const loginExpiration = Number(import.meta.env.VITE_LOGIN_EXPIRES);

  localStorage.setItem("token", token);
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + loginExpiration);

  localStorage.setItem("expiration", expiration.toISOString());
};
