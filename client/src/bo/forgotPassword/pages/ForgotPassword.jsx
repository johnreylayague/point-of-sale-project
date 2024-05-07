import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordUser } from "../../../shared/services/api";
import { useForm } from "react-hook-form";
import { validateForgotPassword } from "../../../shared/util/validationUtil";

export default function ForgotPassword() {
  const [responseData, setResponseData] = useState("");

  const {
    setError,
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({ defaultValues: { Email: "" } });

  const onSubmit = async (data) => {
    try {
      const { response, status } = await forgotPasswordUser(data);
      if (status == 422) {
        response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (status == 200) {
        setResponseData(response.message);
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
        {responseData && <p>{responseData}</p>}
        {errors.serverError && <p>{errors.serverError.message}</p>}

        <fieldset>
          <label htmlFor="password">Email :</label>
          <input
            {...register("Email", { ...validateForgotPassword.Email })}
            type="email"
            name="Email"
            id="Email"
            autoComplete="current-email"
          />
          {errors.Email && <p>{errors.Email.message}</p>}

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
