import React, { useEffect, useState } from "react";
import {
  createCategories,
  deleteCategories,
} from "../../../shared/services/apihere/categories";
import {
  Categories as CategoriesState,
  CategoriesForm,
  CategoriesResponseError,
} from "../../../shared/types/api/categories";
import { SubmitHandler, useForm } from "react-hook-form";
import { getToken } from "../../../shared/utils/authUtil";
import { fetchColors } from "../../../shared/services/apihere/colors";
import { fetchCategories } from "../../../shared/services/apihere/categories";
import { Colors } from "../../../shared/types/api/colors";
import { Link } from "react-router-dom";

function Categories() {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] =
    useState<CategoriesResponseError | null>(null);
  const [serverErrorMessage, setServerMessage] = useState<string>("");
  const [notFoundMessage, setNotFoundMessage] = useState<string>("");
  const [colors, setColors] = useState<Colors>([]);
  const [categories, setCategories] = useState<CategoriesState[]>([]);
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoriesForm>({
    defaultValues: {
      Name: "",
      ColorId: "",
    },
  });

  useEffect(() => {
    async function getColors() {
      const token = getToken() ?? "";

      try {
        const ResponseData = await fetchColors(token);

        if (ResponseData?.status == 200) {
          setColors(ResponseData.response.data);
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

      try {
        const ResponseData = await fetchCategories(token);

        if (ResponseData?.status == 200 && "data" in ResponseData.response) {
          setCategories(ResponseData.response.data);
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
    getColors();
  }, []);

  const onSubmit: SubmitHandler<CategoriesForm> = async (data) => {
    const token = getToken() ?? "";

    try {
      const ResponseData = await createCategories(data, token);

      if (ResponseData?.status === 422 && "errors" in ResponseData.response) {
        ResponseData.response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (ResponseData?.status === 201 && "data" in ResponseData.response) {
        setSuccessMessage(ResponseData.response.message);
        setTimeout(() => setSuccessMessage(""), 3000);
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

  const onDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const categoryId =
      event.currentTarget.getAttribute("data-category-id") ?? "";
    const token = getToken() ?? "";

    const result = window.confirm("Do you want to proceed?");

    if (result) {
      setIsDelete(true);
      try {
        const ResponseData = await deleteCategories(categoryId, token);

        if (ResponseData?.status == 422 && "errors" in ResponseData.response) {
          const errorMessage = ResponseData.response;
          setErrorMessage((prevErrorMessage) => {
            return { ...prevErrorMessage, ...errorMessage };
          });
        }

        if (ResponseData?.status == 404 && "message" in ResponseData.response) {
          setNotFoundMessage(ResponseData.response.message);
          setTimeout(() => setNotFoundMessage(""), 3000);
        }

        if (ResponseData?.status == 200 && "data" in ResponseData.response) {
          const resultData = ResponseData.response.data;

          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== resultData.id)
          );

          setSuccessMessage(ResponseData.response.message);
          setTimeout(() => setSuccessMessage(""), 3000);
        }

        setIsDelete(false);
      } catch (error) {
        if (error instanceof Error) {
          setServerMessage(error.message || "Someting went wrong.");
        } else {
          setServerMessage("An error occurred. Please try again.");
        }
        setIsDelete(false);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        {notFoundMessage && <p style={{ color: "red" }}>{notFoundMessage}</p>}

        {serverErrorMessage && (
          <p style={{ color: "red" }}>{serverErrorMessage}</p>
        )}

        {errorMessage &&
          errorMessage.errors.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
              {error.msg}
            </p>
          ))}

        <h1>Categories</h1>
        {successMessage && successMessage}
        <fieldset>
          <label htmlFor="password">Name</label>
          <input
            type="text"
            {...register("Name", {
              required: "Name field is required",
              maxLength: {
                value: 50,
                message: `Name cannot exceed 50 characters`,
              },
            })}
          />
          {errors.Name && errors.Name.message}
          <br />
          <br />
          <label htmlFor="">Colors :</label>
          {colors.map((color, index) => (
            <div key={color.id}>
              <input
                {...register("ColorId", {
                  required: "Color field is required.",
                })}
                defaultChecked={index === 0}
                type="radio"
                id={color.id}
                name="ColorId"
                value={color.id}
                data-representation-id={color.RepresentationId}
              />
              <label htmlFor={color.id}>{color.Color}</label>
            </div>
          ))}
          {errors.ColorId && errors.ColorId.message}
          <br />
          <br />
          <button type="submit" name="btnSubmit" disabled={isSubmitting}>
            Save
          </button>
        </fieldset>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Items</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <Link to={category.id}>{category.Name}</Link>
              </td>
              <td>{category.ProductsCount}</td>
              <td>
                <button
                  type="button"
                  name="btnDelete"
                  disabled={isDelete}
                  data-category-id={category.id}
                  onClick={onDelete}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Categories;
