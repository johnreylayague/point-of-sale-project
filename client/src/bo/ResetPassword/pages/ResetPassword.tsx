import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { validateResetPassword } from "../../../shared/utils/validationUtil";
import { ResetPasswordForm } from "../../../shared/types/api/resetPasswordUser";
import { resetPasswordUser } from "../../../shared/services/api";

function ResetPassword() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const {
    setError,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      Email: "",
      Password: "",
      ConfirmPassword: "",
    },
  });

  const params = useParams<string>();

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    const token = params.token || "";

    try {
      const ResponseData = await resetPasswordUser(data, token);

      if (ResponseData?.status === 422 && "errors" in ResponseData.response) {
        ResponseData.response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (ResponseData?.status === 200 || ResponseData?.status === 404) {
        setSuccessMessage(ResponseData.response.message);
        setTimeout(() => setSuccessMessage(""), 3000);
        reset();
      }
    } catch (error) {
      if (error instanceof Error) {
        setError("root.serverError", {
          type: "serverError",
          message: error.message || "Someting went wrong.",
        });
        return;
      }

      setError("root.serverError", {
        type: "serverError",
        message: "An error occurred. Please try again.",
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
        {successMessage && successMessage}
        {errors.root?.serverError.type == "serverError" && (
          <p>{errors.root?.serverError.message}</p>
        )}
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
              validate: (value, formValues) =>
                value === formValues.Password || "Password do not match.",
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

          <Link to={"/bo/login"}>Login</Link>
        </fieldset>
      </form>
    </>
  );
}

export default ResetPassword;
