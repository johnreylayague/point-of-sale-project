import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordUser } from "../../../shared/services/api";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [success, setSuccess] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    setIsLoading(true);
    try {
      const userData = await forgotPasswordUser(data);
      if (userData.errors) {
        setErrorMessage((prevError) => {
          const emptyValues = {
            Email: null,
          };

          const errorsObject = userData.errors.reduce((acc, curr) => {
            acc[curr.path] = curr.msg;
            return acc;
          }, {});

          const newData = { ...emptyValues, ...errorsObject };

          return { ...prevError, ...newData };
        });
      }

      if (userData.message) {
        setSuccess((prevMessage) => {
          return { ...prevMessage, message: userData.message };
        });
        const resultMessage = setTimeout(() => setSuccess(""), 1500);

        event.target.reset();
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <form
        onSubmit={submitHandler}
        method="post"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {success && success.message && (
          <p style={{ color: "green" }}>{success.message}</p>
        )}
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
