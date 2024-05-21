import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { validateForgotPassword } from "../../../shared/utils/validationUtil";
import { ForgotPasswordForm } from "../../../shared/types/api/forgotPasswordUser";
import { forgotPasswordUser } from "../../../shared/services/api";

function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const {
    setError,
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ForgotPasswordForm>({ defaultValues: { Email: "" } });

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    try {
      const ResponseData = await forgotPasswordUser(data);

      if (ResponseData?.status === 422 && "errors" in ResponseData.response) {
        ResponseData.response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (ResponseData?.status === 200 && "message" in ResponseData.response) {
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
          <p>{errors.root.message}</p>
        )}

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

          <Link to={"/bo/login"}>Login</Link>
        </fieldset>
      </form>
    </>
  );
}

export default ForgotPassword;
