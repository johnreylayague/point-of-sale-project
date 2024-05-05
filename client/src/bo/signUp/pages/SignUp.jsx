import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCountries, signupUser } from "../../../shared/services/api";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [error, setError] = useState("");
  const [succes, setSuccess] = useState({});
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    async function getCountries() {
      try {
        const countriesData = await fetchCountries();
        setCountries((prevCountries) => {
          return [...prevCountries, ...countriesData.data.countries.country];
        });
      } catch (error) {
        throw error;
      }
    }
    getCountries();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    setIsLoading(true);
    try {
      const signupUserData = await signupUser(data);

      setIsLoading(false);

      if (signupUserData.errors) {
        setErrorMessage((prevError) => {
          const emptyValues = {
            Email: null,
            Password: null,
            BusinessName: null,
            CountryId: null,
          };

          const errorsObject = signupUserData.errors.reduce((acc, curr) => {
            acc[curr.path] = curr.msg;
            return acc;
          }, {});

          const newData = { ...emptyValues, ...errorsObject };

          return { ...prevError, ...newData };
        });
      }

      if (signupUserData.token) {
        setErrorMessage({});

        setSuccess((prevData) => {
          return { ...prevData, ...signupUserData };
        });

        event.target.reset();
      }
    } catch (err) {
      setError(err.message || "Something wehnt wrong.");
    }
    setIsLoading(false);
  };
  return (
    <form
      onSubmit={submitHandler}
      method="post"
      style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {error && <p style={{ color: "red" }}> Error : {error}</p>}
      <fieldset>
        <input
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
        />
        <input
          type="text"
          name="Language"
          id="Language"
          hidden
          defaultValue={"atat"}
        />
        <legend>Sign Up</legend>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="Email"
          id="Email"
          autoComplete="email"
          style={{ marginBottom: "5px" }}
          defaultValue="jay@gmail.com"
        />

        {errorMessage && errorMessage.Email && (
          <p style={{ color: "red" }}>{errorMessage.Email}</p>
        )}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="Password"
          id="Password"
          autoComplete="current-password"
        />
        {errorMessage && errorMessage.Password && (
          <p style={{ color: "red" }}>{errorMessage.Password}</p>
        )}

        <label htmlFor="BusinessName">Business Name</label>
        <input type="text" name="BusinessName" id="BusinessName" />
        {errorMessage && errorMessage.BusinessName && (
          <p style={{ color: "red" }}>{errorMessage.BusinessName}</p>
        )}

        <label htmlFor="CountryId">Country</label>
        <select name="CountryId" id="CountryId" defaultValue="select">
          <option value="">Select</option>
          {countries &&
            countries.map((country, index) => (
              <option key={index} value={index}>
                {country.continentName}
              </option>
            ))}
        </select>
        {errorMessage && errorMessage.CountryId && (
          <p style={{ color: "red" }}>{errorMessage.CountryId}</p>
        )}

        <button
          name="btnLogin"
          id="btnLogin"
          type="submit"
          style={{
            display: "block",
            marginTop: "15px",
            marginBottom: "5px",
          }}
          disabled={isLoading ?? true}
        >
          {isLoading ? "Loading..." : "Signup"}
        </button>
        <Link to={"/bo/login"}>Login</Link>
      </fieldset>
    </form>
  );
}
