import { useForm, SubmitHandler } from "react-hook-form";
import {
  Categories,
  CategoriesForm,
  CategoriesParam,
} from "../../../shared/types/api/categories";
import { useEffect, useState } from "react";
import { getToken } from "../../../shared/utils/authUtil";
import { fetchColors } from "../../../shared/services/apihere/colors";
import { Colors } from "../../../shared/types/api/colors";
import { Link, useParams } from "react-router-dom";
import {
  fetchCategories,
  updateCategories,
} from "../../../shared/services/apihere/categories";

function EditCategories() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [notFoundMessage, setNotFoundMessage] = useState<string>("");
  const [colors, setColors] = useState<Colors>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const category = useParams<CategoriesParam>();

  const {
    setError,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoriesForm>({
    defaultValues: {
      Name: "",
      ColorId: "",
      RecordStatusType_ReferenceId: "661c2dfac3fd5b4827b4fdf7",
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

      const categoryId = category.categoryId ?? "";

      try {
        const ResponseData = await fetchCategories(token, categoryId);

        if (ResponseData?.status == 200) {
          setValue("Name", ResponseData.response.data[0].Name);
          setValue("ColorId", ResponseData.response.data[0].ColorId);
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
    const categoryId = category.categoryId ?? "";

    try {
      const ResponseData = await updateCategories(data, categoryId, token);

      if (ResponseData?.status === 422 && "errors" in ResponseData.response) {
        ResponseData.response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (ResponseData?.status === 404 && "message" in ResponseData.response) {
        setNotFoundMessage(ResponseData.response.message);
        setTimeout(() => setNotFoundMessage(""), 3000);
      }

      if (ResponseData?.status === 200 && "data" in ResponseData.response) {
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

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="PUT"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <h1>EditCategories</h1>
        {notFoundMessage && <p style={{ color: "red" }}>{notFoundMessage}</p>}
        {successMessage && successMessage}
        <fieldset>
          <input
            {...register("RecordStatusType_ReferenceId")}
            hidden
            type="text"
          />
          <label htmlFor="Name">Name :</label>
          <input
            {...register("Name", { required: "Name field is required" })}
            type="text"
            id="Name"
          />
          {errors.Name && errors.Name.message}
          <br />
          <br />

          <label htmlFor="">Colors :</label>
          {colors.map((color) => (
            <div key={color.id}>
              <input
                {...register("ColorId", {
                  required: "ColorId field is required.",
                })}
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
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <Link to={"/pos/categories"} style={{ marginLeft: "15px" }}>
            Back
          </Link>
        </fieldset>
      </form>
    </>
  );
}

export default EditCategories;
