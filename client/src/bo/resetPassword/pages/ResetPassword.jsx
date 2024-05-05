import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPasswordUser } from "../../../shared/services/api";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [error, setError] = useState("");
  const [succes, setSuccess] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      const resetPasswordData = await resetPasswordUser(data, params.token);
      if (resetPasswordData.errors) {
        setErrorMessage((prevError) => {
          const emptyValues = {
            Email: null,
            Password: null,
            ConfirmPassword: null,
          };

          const errorsObject = resetPasswordData.errors.reduce((acc, curr) => {
            acc[curr.path] = curr.msg;
            return acc;
          }, {});

          const newData = { ...emptyValues, ...errorsObject };

          return { ...prevError, ...newData };
        });
      }
      if (resetPasswordData.message) {
        setErrorMessage({});
        setSuccess(resetPasswordData.message);
        const resultMessage = setTimeout(() => setSuccess(""), 1500);
        event.target.reset();
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <>
      <form
        onSubmit={submitHandler}
        method="post"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {succes && <p style={{ color: "green" }}>{succes}</p>}
        {error && <p style={{ color: "red" }}> Error : {error}</p>}
        <fieldset>
          <label htmlFor="password">Email :</label>
          <input
            type="email"
            name="Email"
            id="Email"
            autoComplete="current-email"
          />
          {errorMessage && errorMessage.Email && (
            <p style={{ color: "red" }}>{errorMessage.Email}</p>
          )}

          <label htmlFor="password">Password :</label>
          <input
            type="password"
            name="Password"
            id="Password"
            autoComplete="current-password"
          />
          {errorMessage && errorMessage.Password && (
            <p style={{ color: "red" }}>{errorMessage.Password}</p>
          )}

          <label htmlFor="password">Confirm Password :</label>
          <input
            type="password"
            name="ConfirmPassword"
            id="ConfirmPassword"
            autoComplete="current-password"
          />
          {errorMessage && errorMessage.ConfirmPassword && (
            <p style={{ color: "red" }}>{errorMessage.ConfirmPassword}</p>
          )}

          <button
            name="btnLogin"
            id="btnLogin"
            style={{
              display: "block",
              marginTop: "15px",
              marginBottom: "5px",
            }}
            disabled={isLoading && true}
            type="submit"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>

          <Link to={"../login"}>Login</Link>
        </fieldset>
      </form>
    </>
  );
}
