import { useRouteError, Link } from "react-router-dom";

type ErrorProps = {
  status: 404 | 500;
  data: { message: string };
};

export default function Error() {
  const error = useRouteError() as ErrorProps;
  console.log(error);

  let title = "An error occured!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page.";
  }
  return (
    <>
      <h1>{title}</h1>
      <p style={{ color: "red", fontSize: "19px", fontWeight: "bold" }}>
        {message}
      </p>
      <Link to="/bo/login">Go Back to Login</Link>
    </>
  );
}