import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { validateSignUp } from "../../../shared/utils/validationUtil";
import { fetchCountries, signupUser } from "../../../shared/services/api";
import { CountriesState } from "../../../shared/types/api/fetchFountries";
import { SignUpFormInputs } from "../../../shared/types/api/signupUser";

function SignUp() {
  const [countries, setCountries] = useState<CountriesState>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SignUpFormInputs>({
    defaultValues: {
      Email: "",
      Password: "",
      BusinessName: "",
      Country: "",
    },
  });

  useEffect(() => {
    async function getCountries() {
      try {
        const ResponseData = await fetchCountries();

        if (ResponseData?.status === 200) {
          setCountries(ResponseData.response.data.countries.country);
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
    }
    getCountries();
  }, [setError]);

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      const responseData = await signupUser(data);

      if (responseData?.status === 422 && "errors" in responseData.response) {
        responseData.response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (responseData?.status === 201 && "data" in responseData.response) {
        setSuccessMessage(responseData.response.message);
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
      {isSubmitSuccessful && successMessage && (
        <p style={{ textAlign: "center" }}>{successMessage}</p>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {errors.root?.serverError.type == "serverError" && (
          <p>{errors.root?.serverError.message}</p>
        )}

        <fieldset>
          <input
            {...register("Currency", { ...validateSignUp.Currency })}
            type="text"
            name="Currency"
            id="Currency"
            hidden
            defaultValue={"atat"}
          />
          <input
            {...register("Timezone", { ...validateSignUp.Timezone })}
            type="text"
            name="Timezone"
            id="Timezone"
            hidden
            defaultValue={"atat"}
          />
          <input
            {...register("Language", { ...validateSignUp.Language })}
            type="text"
            name="Language"
            id="Language"
            hidden
            defaultValue={"atat"}
          />
          <legend>Sign Up</legend>
          <label htmlFor="email">Email</label>
          <input
            {...register("Email", { ...validateSignUp.Email })}
            type="email"
            name="Email"
            id="Email"
            autoComplete="email"
            style={{ marginBottom: "5px" }}
          />
          {errors.Email && <p>{errors.Email.message}</p>}
          <br />
          <label htmlFor="password">Password</label>
          <input
            {...register("Password", { ...validateSignUp.Password })}
            type="password"
            name="Password"
            id="Password"
            autoComplete="current-password"
          />
          {errors.Password && <p>{errors.Password.message}</p>}
          <br />
          <label htmlFor="BusinessName">Business Name</label>
          <input
            {...register("BusinessName", { ...validateSignUp.BusinessName })}
            type="text"
            name="BusinessName"
            id="BusinessName"
          />
          {errors.BusinessName && <p>{errors.BusinessName.message}</p>}

          <br />
          <label htmlFor="CountryId">Country</label>
          <select
            {...register("CountryId", { ...validateSignUp.CountryId })}
            onChange={(e) => setValue("CountryId", e.target.value)}
            name="CountryId"
            id="CountryId"
          >
            <option value="">Select</option>
            {countries &&
              countries.map((country, index) => (
                <option key={index} value={country.population}>
                  {country.continentName}
                </option>
              ))}
          </select>
          {errors.CountryId && <p>{errors.CountryId.message}</p>}

          <button
            name="btnLogin"
            id="btnLogin"
            type="submit"
            style={{
              display: "block",
              marginTop: "15px",
              marginBottom: "5px",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Signup"}
          </button>
          <Link to={"/bo/login"}>Login</Link>
        </fieldset>
      </form>
    </>
  );
}

export default SignUp;
