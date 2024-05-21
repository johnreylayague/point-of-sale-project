import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../../shared/services/api";
import { LoginForm } from "../../../shared/types/api/loginUser";
import { validateLogin } from "../../../shared/utils/validationUtil";
import {
  setTokenAndExpiration,
  getTokenDuration,
} from "../../../shared/utils/authUtil";

function Login() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      Email: "jayroa227@gmail.com",
      Password: "12345",
    },
  });
  const navigate = useNavigate();
  const location = useLocation();
  const tokenDuration = getTokenDuration();

  useEffect(() => {
    if (tokenDuration > 0) {
      navigate("/pos/sales");

      return;
    }
  }, [navigate]);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const ResponseData = await loginUser(data);

      if (ResponseData?.status === 422 && "errors" in ResponseData.response) {
        ResponseData.response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
        return;
      }

      if (ResponseData?.status === 200 && "data" in ResponseData.response) {
        setTokenAndExpiration(ResponseData.response.data.token);
        setSuccessMessage("Successfully Logged In");
        setTimeout(() => setSuccessMessage(""), 3000);
        reset();

        // if (window.history.state && window.history.state.idx > 0) {
        //   navigate(-2);
        //   return;
        // }
        navigate("/pos");
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
      {tokenDuration < 0 && (
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
            <Link to={"/bo/signup"}>Sign Up</Link>
            <br />
            <Link to={"/bo/forgotpassword"}>Forgot Password</Link>
          </fieldset>
        </form>
      )}
    </>
  );
}

export default Login;
