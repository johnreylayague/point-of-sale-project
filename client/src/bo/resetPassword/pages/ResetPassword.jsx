import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPasswordUser } from "../../../shared/services/api";
import { useForm } from "react-hook-form";
import { validateResetPassword } from "../../../shared/util/validationUtil";

export default function ResetPassword() {
  const [responseData, setResponseData] = useState("");
  const {
    setError,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      Email: "",
      ConfirmPassword: "",
      Password: "",
    },
  });

  const params = useParams();

  const onSubmit = async (data) => {
    const token = params.token;

    try {
      const { response, status } = await resetPasswordUser(data, token);
      if (status === 422) {
        response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (status === 200 || status === 401) {
        reset();
        setResponseData(response.message);
        setTimeout(() => setResponseData(""), 3000);
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
        {responseData && <p>{responseData}</p>}
        {errors.serverError && <p>{errors.serverError.message}</p>}
        <fieldset>
          <label htmlFor="password">Email :</label>
          <input
            {...register("Email", {
              ...validateResetPassword.Email,
            })}
            type="email"
            name="Email"
            id="Email"
            autoComplete="current-email"
          />
          {errors.Email && <p>{errors.Email.message}</p>}

          <label htmlFor="password">Password :</label>
          <input
            {...register("Password", {
              ...validateResetPassword.Password,
            })}
            type="password"
            name="Password"
            id="Password"
            autoComplete="current-password"
          />
          {errors.Password && <p>{errors.Password.message}</p>}

          <label htmlFor="password">Confirm Password :</label>
          <input
            {...register("ConfirmPassword", {
              ...validateResetPassword.ConfirmPassword,
              validate: (value) =>
                value === Password || "Password do not match.",
            })}
            type="password"
            name="ConfirmPassword"
            id="ConfirmPassword"
            autoComplete="current-password"
          />
          {errors.ConfirmPassword && <p>{errors.ConfirmPassword.message}</p>}

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
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          <Link to={"../login"}>Login</Link>
        </fieldset>
      </form>
    </>
  );
}
