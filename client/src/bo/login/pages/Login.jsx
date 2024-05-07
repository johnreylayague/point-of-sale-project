import React, { useEffect, useState } from "react";
import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import { loginUser } from "../../../shared/services/api";
import { useForm } from "react-hook-form";
import { setTokenAndExpiration } from "../../../shared/util/tokenUtil";
import { validateLogin } from "../../../shared/util/validationUtil";

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      Email: "",
      Password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { response, status } = await loginUser(data);

      if (status === 422) {
        response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (status === 200) {
        setTokenAndExpiration(response.token);
        reset();
      }
    } catch (error) {
      setError("serverError", {
        type: "serverErrorMessage",
        message: error.message || "Someting went wrong.",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {errors.serverError && <p>{errors.serverError.message}</p>}
        <fieldset>
          <legend>Login</legend>
          <label htmlFor="email">Email</label>
          <input
            {...register("Email", { ...validateLogin.Email })}
            type="email"
            name="Email"
            id="Email"
            autoComplete="email"
            style={{ marginBottom: "5px" }}
          />
          <br />
          {errors.Email && errors.Email.message}
          <br />
          <label htmlFor="password">Password</label>
          <input
            {...register("Password", { ...validateLogin.Password })}
            type="password"
            name="Password"
            id="Password"
            autoComplete="current-password"
          />
          <br />
          {errors.Password && errors.Password.message}
          <br />
          <button
            name="btnLogin"
            id="btnLogin"
            style={{
              display: "block",
              marginTop: "15px",
              marginBottom: "5px",
            }}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
          <Link to={"../signup"}>Sign Up</Link>
          <br />
          <Link to={"../forgotpassword"}>Forgot Password</Link>
        </fieldset>
      </form>
    </>
  );
}
