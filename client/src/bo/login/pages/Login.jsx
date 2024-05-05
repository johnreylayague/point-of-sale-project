import React, { useEffect, useState } from "react";
import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import { loginUser } from "../../../shared/services/api";

const errorValue = {
  errors: { Email: null, Password: null },
};

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(errorValue);

  const data = useActionData();
  const navigation = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    setIsLoading(true);
    try {
      const resulData = await loginUser(data);

      // login expires
      const LOGIN_EXPIRES = import.meta.env.VITE_LOGIN_EXPIRES;

      localStorage.setItem("token", resulData.token);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + LOGIN_EXPIRES);
      localStorage.setItem("expiration", expiration.toISOString());

      errorValue.errors.Email = null;
      errorValue.errors.Password = null;

      navigation("/");
    } catch (err) {
      setErrorMessage((prevErrorMessage) => {
        Object.keys(errorValue.errors).map((key) => {
          errorValue.errors[key] = null;
          JSON.parse(err.message)
            .errors.filter((error) => error.path == key)
            .map((msg) => (errorValue.errors[key] = msg.msg));
        });
        return { ...prevErrorMessage, errors: errorValue.errors };
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <form
        onSubmit={submitHandler}
        method="post"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <fieldset>
          <legend>Login</legend>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="Email"
            id="Email"
            autoComplete="email"
            style={{ marginBottom: "5px" }}
            defaultValue={"1@gmail.com"}
          />
          {errorValue.errors.Email && (
            <p style={{ color: "red" }}>{errorValue.errors.Email}</p>
          )}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="Password"
            id="Password"
            autoComplete="current-password"
            defaultValue={"123"}
          />
          {errorValue.errors.Password && (
            <p style={{ color: "red" }}>{errorValue.errors.Password}</p>
          )}
          <button
            name="btnLogin"
            id="btnLogin"
            style={{
              display: "block",
              marginTop: "15px",
              marginBottom: "5px",
            }}
            disabled={isLoading ?? true}
            type="submit"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>

          <Link to={"../signup"}>Sign Up</Link>
          <br />
          <Link to={"../forgotpassword"}>Forgot Password</Link>
        </fieldset>
      </form>
    </>
  );
}
