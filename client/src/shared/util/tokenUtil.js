// tokenUtils.js

export const setTokenAndExpiration = (token) => {
  localStorage.setItem("token", token);
  const expiration = new Date();
  expiration.setHours(
    expiration.getHours() + import.meta.env.VITE_LOGIN_EXPIRES
  );
  localStorage.setItem("expiration", expiration.toISOString());
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeTokenAndExpiration = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
};
