import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Colors } from "../../../shared/types/api/colors";
import { Images } from "../../../shared/types/api/images";
import {
  ProductForm,
  Product,
  ProductsResponseError,
} from "../../../shared/types/api/products";
import { Representations } from "../../../shared/types/api/representations";
import { Shapes } from "../../../shared/types/api/shapes";
import { useForm, SubmitHandler } from "react-hook-form";
import { createProduct } from "../../../shared/services/apihere/products";
import { fetchCategories } from "../../../shared/services/apihere/categories";
import { fetchColors } from "../../../shared/services/apihere/colors";
import { fetchImages } from "../../../shared/services/apihere/images";
import { fetchProduct } from "../../../shared/services/apihere/products";
import { fetchRepresentations } from "../../../shared/services/apihere/representations";
import { fetchShapes } from "../../../shared/services/apihere/shape";
import { fetchSoldByOptions } from "../../../shared/services/apihere/soldByOptions";
import { getToken } from "../../../shared/utils/authUtil";
import { soldByOptions } from "../../../shared/types/api/soldByOptions";
import { Category } from "../../../shared/types/api/categories";
import { Link } from "react-router-dom";

function NewItem() {
  const [soldByOptions, setSoldByOptions] = useState<soldByOptions[]>([]);
  const [shapes, setShapes] = useState<Shapes[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [colors, setColors] = useState<Colors[]>([]);
  const [representations, setRepresentations] = useState<Representations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [images, setImages] = useState<Images[]>([]);

  const [errorMessage, setErrorMessage] =
    useState<ProductsResponseError | null>(null);
  const [serverErrorMessage, setServerMessage] = useState<string>("");
  const [notFoundMessage, setNotFoundMessage] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");

  const {
    setError,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    defaultValues: {
      Name: "",
      Description: "",
      SKU: "",
      BarCode: "",
      TrackStock: false,
      InStock: "",
      LowStock: "",
      Price: "0.00",
      Cost: "0.00",
      SoldByOptionId: "",
      CategoryId: "",
      ShapeId: "",
      ColorId: "",
      Image: "",
      RepresentationId: "",
    },
  });
  const {
    onChange: PriceOnChange,
    onBlur: PriceOnBlur,
    name: PriceName,
    ref: PriceRef,
  } = register("Price", {
    setValueAs: () => watch("Price"),
    validate: (value) => (value === "0.00" ? "Price field is required" : true),
    required: "Price field is required",
  });

  const {
    onChange: CostOnChange,
    onBlur: CostOnBlur,
    name: CostName,
    ref: CostRef,
  } = register("Cost", {
    setValueAs: () => watch("Cost"),
  });

  const {
    onChange: BarcodeOnChange,
    onBlur: BarcodeOnBlur,
    name: BarcodeName,
    ref: BarcodeRef,
  } = register("BarCode");

  const {
    onChange: InStockOnChange,
    onBlur: InStockOnBlur,
    name: InStockName,
    ref: InStockRef,
  } = register("InStock");

  const {
    onChange: LowStockOnChange,
    onBlur: LowStockOnBlur,
    name: LowStockName,
    ref: LowStockRef,
  } = register("LowStock");

  const isTrackStock = watch("TrackStock");

  useEffect(() => {
    async function fetchDatas() {
      const token = getToken() ?? "";
      const itemId = "";
      try {
        const responseData = await fetchProduct(itemId, token);

        if (responseData?.status == 200 && "data" in responseData.response) {
          setProducts(responseData.response.data);
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
        const responseData = await fetchSoldByOptions(token);

        if (responseData?.status == 200) {
          setSoldByOptions(responseData.response.data);
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
        const responseData = await fetchShapes(token);

        if (responseData?.status == 200) {
          setShapes(responseData.response.data);
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
        const responseData = await fetchColors(token);

        if (responseData?.status == 200) {
          setColors(responseData.response.data);
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
        const responseData = await fetchRepresentations(token);

        if (responseData?.status == 200) {
          setRepresentations(responseData.response.data);
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
        const responseData = await fetchImages(token);

        if (responseData?.status == 200) {
          setImages(responseData.response.data);
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
        const responseData = await fetchCategories(token);

        if (responseData?.status == 200) {
          setCategories(responseData.response.data);
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
    fetchDatas();
  }, [setError]);

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    const token = getToken() ?? "";

    try {
      const ResponseData = await createProduct(data, token);

      if (ResponseData?.status === 422 && "errors" in ResponseData.response) {
        ResponseData.response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (ResponseData?.status === 201 && "data" in ResponseData.response) {
        const newProducts = ResponseData.response.data;

        setProducts((prevProducts) => {
          return [...prevProducts, newProducts];
        });

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      method="post"
      style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <h1>Items</h1>

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
      {successMessage && <p>{successMessage}</p>}
      {errors.root?.serverError.type == "serverError" && (
        <p>{errors.root?.serverError.message}</p>
      )}
      <fieldset>
        <label htmlFor="Name">Name :</label>
        <br />
        <input
          {...register("Name", { required: "Name field is required." })}
          type="text"
        />
        {errors.Name && <p style={{ color: "red" }}>{errors.Name.message}</p>}
        <br /> <br />
        <select {...register("CategoryId")}>
          <option value="">No Category</option>
          {categories.map((category) => {
            return (
              <option key={category.id} value={category.id}>
                {category.Name}
              </option>
            );
          })}
        </select>
        <br /> <br />
        Sold by
        <br />
        {soldByOptions.map((soldByOption) => {
          return (
            <div key={soldByOption.id} style={{ display: "inline-block" }}>
              <input
                {...register("SoldByOptionId")}
                type="radio"
                name="SoldByOptionId"
                id={soldByOption.id}
                value={soldByOption.id}
                defaultChecked={soldByOption.Default}
              />
              <label htmlFor={soldByOption.id}>{soldByOption.Name}</label>
            </div>
          );
        })}
        {errors.SoldByOptionId && (
          <p style={{ color: "red" }}>{errors.SoldByOptionId.message}</p>
        )}
        <br /> <br />
        <label htmlFor="Description">Description :</label>
        <input {...register("Description")} id="Description" type="text" />
        <br /> <br />
        <label htmlFor="SKU">SKU :</label>
        <br />
        <input
          type="text"
          {...register("SKU", {
            required: "SKU field is required.",
            pattern: {
              value: /^[a-zA-Z0-9]*$/,
              message: "Only letters and numbers are allowed",
            },
          })}
        />
        {inputError}
        {errors.SKU && <p style={{ color: "red" }}>{errors.SKU.message}</p>}
        <br /> <br />
        <label htmlFor="BarCode">BarCode :</label>
        <br />
        <NumericFormat
          onChange={BarcodeOnChange}
          onBlur={BarcodeOnBlur}
          name={BarcodeName}
          getInputRef={BarcodeRef}
          displayType={"input"}
          allowLeadingZeros
          value={getValues("BarCode")}
        />
        {errors.BarCode && (
          <p style={{ color: "red" }}>{errors.BarCode.message}</p>
        )}
        <br /> <br />
        <label htmlFor="TrackStock">TrackStock :</label>
        <input
          type="checkbox"
          {...register("TrackStock", {
            onChange: (e) => {
              if (e.target.checked) {
                setValue("InStock", 0);
                setValue("LowStock", "");
              } else {
                setValue("InStock", "");
                setValue("LowStock", "");
              }
            },
          })}
        />
        {errors.TrackStock && (
          <p style={{ color: "red" }}>{errors.TrackStock.message}</p>
        )}
        {isTrackStock && (
          <>
            <br /> <br />
            <label htmlFor="InStock">InStock :</label>
            <NumericFormat
              onChange={InStockOnChange}
              onBlur={InStockOnBlur}
              name={InStockName}
              getInputRef={InStockRef}
              displayType={"input"}
              value={getValues("InStock")}
            />
            {errors.InStock && (
              <p style={{ color: "red" }}>{errors.InStock.message}</p>
            )}
            <br /> <br />
            <label htmlFor="LowStock">LowStock :</label>
            <NumericFormat
              onChange={LowStockOnChange}
              onBlur={LowStockOnBlur}
              name={LowStockName}
              getInputRef={LowStockRef}
              displayType={"input"}
              value={getValues("LowStock")}
            />
            {errors.LowStock && (
              <p style={{ color: "red" }}>{errors.LowStock.message}</p>
            )}
          </>
        )}
        <br /> <br />
        <label htmlFor="Price">Price :</label>
        <br />
        <NumericFormat
          onChange={PriceOnChange}
          onBlur={PriceOnBlur}
          name={PriceName}
          getInputRef={PriceRef}
          displayType={"input"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          prefix={"₱"}
          value={getValues("Price")}
          onValueChange={({ value: price }) => {
            setValue("Price", price);
          }}
        />
        {errors.Price && <p style={{ color: "red" }}>{errors.Price.message}</p>}
        <br /> <br />
        {/* START COST */}
        <label htmlFor="Cost">Cost :</label>
        <br />
        <NumericFormat
          onChange={CostOnChange}
          onBlur={CostOnBlur}
          name={CostName}
          getInputRef={CostRef}
          displayType={"input"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          prefix={"₱"}
          value={getValues("Cost")}
          onValueChange={({ value: cost }) => {
            setValue("Cost", cost);
          }}
        />
        {errors.Cost && <p style={{ color: "red" }}>{errors.Cost.message}</p>}
        {/* END COST */}
        <br /> <br />
        {/* START REPRESENTATION */}
        <label htmlFor="">Representation :</label>
        {representations.map((representation) => {
          return (
            <div key={representation.id}>
              <input
                type="radio"
                id={representation.id}
                value={representation.id}
                defaultChecked={representation.Default}
                {...register("RepresentationId", {
                  required: "RepresentationId field is required.",
                })}
              />
              <label htmlFor={representation.id}>{representation.Name}</label>
            </div>
          );
        })}
        {errors.RepresentationId && (
          <p style={{ color: "red" }}>{errors.RepresentationId.message}</p>
        )}
        {/* END OF REPRESENTATION */}
        <br />
        {colors.map((color) => {
          return (
            <div
              key={color.id}
              style={{
                display:
                  watch("RepresentationId") === color.RepresentationId
                    ? "block"
                    : "none",
              }}
            >
              <input
                defaultChecked={color.Default}
                type="radio"
                id={color.id}
                value={color.id}
                data-representation-id={color.RepresentationId}
                {...register("ColorId")}
              />
              <label htmlFor={color.id}>{color.Color}</label>
            </div>
          );
        })}
        {errors.ColorId && (
          <p style={{ color: "red" }}>{errors.ColorId.message}</p>
        )}
        <br />
        {shapes.map((shape) => {
          return (
            <div
              key={shape.id}
              style={{
                display:
                  watch("RepresentationId") === shape.RepresentationId
                    ? "block"
                    : "none",
              }}
            >
              <input
                defaultChecked={shape.Default}
                type="radio"
                id={shape.id}
                value={shape.id}
                {...register("ShapeId", {
                  required: "ShapeId is requiresd.",
                })}
              />

              <label htmlFor={shape.id}>{shape.Shape}</label>
            </div>
          );
        })}
        {errors.ShapeId && (
          <p style={{ color: "red" }}>{errors.ShapeId.message}</p>
        )}
        <br />
        {images.map((image) => {
          return (
            <div
              key={image.id}
              style={{
                display:
                  watch("RepresentationId") === image.RepresentationId
                    ? "block"
                    : "none",
                height: "100px",
                width: "100px",
                backgroundColor: "red",
              }}
            ></div>
          );
        })}
        {errors.Image && <p style={{ color: "red" }}>{errors.Image.message}</p>}
        <br />
        <br />
        <button
          type="submit"
          name="btnSubmit"
          id="btnSubmit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submiting..." : "Submit"}
        </button>
        <Link to={"../"} relative="path" style={{ marginLeft: "70px" }}>
          Back
        </Link>
      </fieldset>
    </form>
  );
}

export default NewItem;
