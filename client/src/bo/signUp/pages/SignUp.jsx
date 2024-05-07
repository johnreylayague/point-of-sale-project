import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCountries, signupUser } from "../../../shared/services/api";
import { useForm } from "react-hook-form";
import { validateSignUp } from "../../../shared/util/validationUtil";

export default function SignUp() {
  const [countries, setCountries] = useState([]);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      Email: "",
      Password: "",
      BusinessName: "",
      Country: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { response, status } = await signupUser(data);

      if (status === 422) {
        response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (status === 200) {
        reset();
      }
    } catch (error) {
      setError("serverError", {
        type: "serverErrorMessage",
        message: error.message || "Someting went wrong.",
      });
    }
  };

  useEffect(() => {
    async function getCountries() {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData.data.countries.country);
      } catch (error) {
        setError("serverError", {
          type: "serverErrorMessage",
          message: error.message || "Someting went wrong.",
        });
      }
    }
    getCountries();
  }, []);

  return (
    <>
      {isSubmitSuccessful && (
        <p style={{ textAlign: "center" }}>Form submitted successfully!</p>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {errors.serverError && <p>{errors.serverError.message}</p>}

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
            type="text"
            name="Timezone"
            id="Timezone"
            hidden
            defaultValue={"atat"}
            {...register("Timezone", { ...validateSignUp.Timezone })}
          />
          <input
            type="text"
            name="Language"
            id="Language"
            hidden
            defaultValue={"atat"}
            {...register("Language", { ...validateSignUp.Language })}
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
