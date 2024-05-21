import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProductForm } from "../../../shared/types/api/products";
import { Category } from "../../../shared/types/api/categories";
import { getToken } from "../../../shared/utils/authUtil";
import {
  deleteProducts,
  fetchProduct,
  updateProduct,
} from "../../../shared/services/apihere/products";
import { fetchSoldByOptions } from "../../../shared/services/apihere/soldByOptions";
import { soldByOptions } from "../../../shared/types/api/soldByOptions";
import { fetchShapes } from "../../../shared/services/apihere/shape";
import { Shapes } from "../../../shared/types/api/shapes";
import { fetchColors } from "../../../shared/services/apihere/colors";
import { Colors } from "../../../shared/types/api/colors";
import { fetchRepresentations } from "../../../shared/services/apihere/representations";
import { Representations } from "../../../shared/types/api/representations";
import { fetchImages } from "../../../shared/services/apihere/images";
import { Images } from "../../../shared/types/api/images";
import { fetchCategories } from "../../../shared/services/apihere/categories";
import { NumericFormat } from "react-number-format";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditItems: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [soldByOptions, setSoldByOptions] = useState<soldByOptions[]>([]);
  const [shapes, setShapes] = useState<Shapes[]>([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [representations, setRepresentations] = useState<Representations[]>([]);
  const [images, setImages] = useState<Images[]>([]);

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string[] | string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const shapeIdRef = useRef<HTMLInputElement | null>(null);
  const colorIdRef = useRef<HTMLInputElement | null>(null);

  const params = useParams<{ itemId: string | undefined }>();

  const navigate = useNavigate();
  const {
    setError,
    register,
    handleSubmit,
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

  useEffect(() => {
    async function fetchDatas() {
      const itemId = params.itemId ?? "";
      const token = getToken() ?? "";

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

      try {
        const responseData = await fetchProduct(itemId, token);

        if (responseData?.status == 200 && "data" in responseData.response) {
          const selectedProduct = responseData.response.data.find(
            (product) => product.id === itemId
          );

          setValue("Name", selectedProduct?.Name || "");
          setValue("Description", selectedProduct?.Description || "");
          setValue("SKU", selectedProduct?.SKU || "");
          setValue("BarCode", selectedProduct?.BarCode || "");
          setValue("TrackStock", selectedProduct?.TrackStock || false);
          setValue("InStock", selectedProduct?.InStock || "");
          setValue("LowStock", selectedProduct?.LowStock || "");
          setValue("Price", selectedProduct?.Price.$numberDecimal || "0.00");
          setValue("Cost", selectedProduct?.Cost.$numberDecimal || "0.00");
          setValue("SoldByOptionId", selectedProduct?.SoldByOptionId || "");
          setValue("CategoryId", selectedProduct?.CategoryId || "");
          setValue("ShapeId", selectedProduct?.ShapeId || "");
          setValue("ColorId", selectedProduct?.ColorId || "");
          setValue("Image", selectedProduct?.Image || "");
          setValue("RepresentationId", selectedProduct?.RepresentationId || "");
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

  const { ...registerName } = register("Name", {
    required: "Name is requiresd.",
  });

  const { ...registerCategoryId } = register("CategoryId");

  const { ...registerSoldByOptionId } = register("SoldByOptionId", {
    required: "Sold By is requiresd.",
  });

  const { ...registerDescription } = register("Description");

  const { ...registerSKU } = register("SKU");

  const { ref: registerBarcodeRef, ...registerBarCode } = register("BarCode");

  const { ...registerTrackStock } = register("TrackStock", {
    onChange: (e) => {
      if (e.target.checked) {
        setValue("InStock", 0);
        setValue("LowStock", "");
      } else {
        setValue("InStock", "");
        setValue("LowStock", "");
      }
    },
  });

  const { ref: registerInStockRef, ...registerInStock } = register("InStock");

  const { ref: registerLowStockRef, ...registerLowStock } =
    register("LowStock");

  const { ref: registerPriceRef, ...registerPrice } = register("Price", {
    setValueAs: () => watch("Price"),
    validate: (value) => (value === "0.00" ? "Price field is required" : true),
    required: "Price field is required",
  });

  const { ref: registerCostRef, ...registerCost } = register("Cost", {
    setValueAs: () => watch("Cost"),
  });

  const { ...registerRepresentationId } = register("RepresentationId", {
    required: "RepresentationId field is required.",
  });

  const { ref: registerShapeIdRef, ...registerShapeId } = register("ShapeId", {
    required: "Shape is requiresd.",
  });

  const { ref: registerColorIdRef, ...registerColorId } = register("ColorId", {
    required: "Color is requiresd.",
  });

  const shapeRepresentationIdRef = shapeIdRef.current?.getAttribute(
    "data-representation-id"
  );

  const colorRepresentationIdRef = colorIdRef.current?.getAttribute(
    "data-representation-id"
  );

  const isTrackStock = watch("TrackStock");

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    const token = getToken() ?? "";
    const productId = params.itemId ?? "";

    try {
      const ResponseData = await updateProduct(data, productId, token);

      if (ResponseData?.status === 422 && "errors" in ResponseData.response) {
        ResponseData.response.errors.map((error) => {
          setError(error.path, {
            type: "fieldErrorMessage",
            message: error.msg,
          });
        });
      }

      if (ResponseData?.status == 404 && "message" in ResponseData.response) {
        setErrorMessage(ResponseData.response.message);
        setTimeout(() => setErrorMessage(""), 3000);
      }

      if (ResponseData?.status === 200 && "data" in ResponseData.response) {
        setSuccessMessage(ResponseData.response.message);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Someting went wrong.");
        return;
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    const token = getToken() || "";
    const productId = params.itemId || "";
    const result = window.confirm("Do you want to proceed?");

    if (result) {
      setIsDelete(true);
      try {
        const ResponseData = await deleteProducts(token, productId);
        if (ResponseData?.status == 422 && "errors" in ResponseData.response) {
          const updatedData = ResponseData.response.errors.reduce(
            (object, error) => {
              object[error.path] = error.msg;
              return object;
            },
            {} as {
              id: string;
              [path: string]: string;
            }
          );
          setErrorMessage(Object.values(updatedData));
          setTimeout(() => setErrorMessage(""), 3000);
        }
        if (ResponseData?.status == 404 && "message" in ResponseData.response) {
          setErrorMessage(ResponseData.response.message);
          setTimeout(() => setErrorMessage(""), 3000);
        }
        if (ResponseData?.status == 200 && "data" in ResponseData.response) {
          navigate("/pos/items");
        }
        setIsDelete(false);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message || "Someting went wrong.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
        setIsDelete(false);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="PUT"
        style={{ width: "150px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <h1>Edit Items</h1>
        {typeof errorMessage === "object" && (
          <ul style={{ color: "red" }}>
            {errorMessage.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        {typeof errorMessage === "string" && (
          <p style={{ color: "red" }}>{errorMessage}</p>
        )}

        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        <fieldset>
          <label htmlFor="Name">Name</label>
          <input type="text" {...registerName} />
          {errors.Name && <p style={{ color: "red" }}>{errors.Name.message}</p>}
          <br />
          <br />
          <select {...registerCategoryId}>
            <option value="">No Category</option>
            {categories.map((category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.Name}
                </option>
              );
            })}
          </select>
          {errors.CategoryId && (
            <p style={{ color: "red" }}>{errors.CategoryId.message}</p>
          )}
          <br />
          <br />
          {soldByOptions.map((soldByOption) => {
            return (
              <div key={soldByOption.id} style={{ display: "inline-block" }}>
                <input
                  type="radio"
                  id={soldByOption.id}
                  value={soldByOption.id}
                  {...registerSoldByOptionId}
                />
                <label htmlFor={soldByOption.id}>{soldByOption.Name}</label>
              </div>
            );
          })}
          {errors.SoldByOptionId && (
            <p style={{ color: "red" }}>{errors.SoldByOptionId.message}</p>
          )}
          <br />
          <br />
          <label htmlFor="Description">Description :</label>
          <input type="text" {...registerDescription} />
          <br /> <br />
          <label htmlFor="SKU">SKU :</label>
          <br />
          <input type="text" {...registerSKU} />
          {errors.SKU && <p style={{ color: "red" }}>{errors.SKU.message}</p>}
          <br />
          <br />
          <label htmlFor="BarCode">BarCode :</label>
          <br />
          <NumericFormat
            displayType={"input"}
            allowLeadingZeros
            value={getValues("BarCode")}
            {...registerBarCode}
            getInputRef={registerBarcodeRef}
          />
          {errors.BarCode && (
            <p style={{ color: "red" }}>{errors.BarCode.message}</p>
          )}
          <br /> <br />
          <label htmlFor="TrackStock">TrackStock :</label>
          <input type="checkbox" {...registerTrackStock} />
          {errors.TrackStock && (
            <p style={{ color: "red" }}>{errors.TrackStock.message}</p>
          )}
          {isTrackStock && (
            <>
              <br /> <br />
              <label htmlFor="InStock">InStock :</label>
              <NumericFormat
                displayType={"input"}
                value={getValues("InStock")}
                {...registerInStock}
                getInputRef={registerInStockRef}
              />
              {errors.InStock && (
                <p style={{ color: "red" }}>{errors.InStock.message}</p>
              )}
              <br /> <br />
              <label htmlFor="LowStock">LowStock :</label>
              <NumericFormat
                displayType={"input"}
                value={getValues("LowStock")}
                {...registerLowStock}
                getInputRef={registerLowStockRef}
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
            {...registerPrice}
            getInputRef={registerPriceRef}
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
          {errors.Price && (
            <p style={{ color: "red" }}>{errors.Price.message}</p>
          )}
          <br /> <br />
          {/* START COST */}
          <label htmlFor="Cost">Cost :</label>
          <br />
          <NumericFormat
            {...registerCost}
            getInputRef={registerCostRef}
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
                  {...registerRepresentationId}
                />
                <label htmlFor={representation.id}>{representation.Name}</label>
              </div>
            );
          })}
          <br />
          {errors.RepresentationId && (
            <p style={{ color: "red" }}>{errors.RepresentationId.message}</p>
          )}
          {/* END REPRESENTATION */}
          {/* START COLORS AND SHAPE */}
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
                  type="radio"
                  id={color.id}
                  value={color.id}
                  data-representation-id={color.RepresentationId}
                  ref={(e) => {
                    registerColorIdRef(e);
                    colorIdRef.current = e;
                  }}
                  {...registerColorId}
                />
                <label htmlFor={color.id}>{color.Color}</label>
              </div>
            );
          })}
          {errors.ColorId &&
            colorRepresentationIdRef === watch("RepresentationId") && (
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
                  type="radio"
                  id={shape.id}
                  value={shape.id}
                  data-representation-id={shape.RepresentationId}
                  ref={(e) => {
                    registerShapeIdRef(e);
                    shapeIdRef.current = e;
                  }}
                  {...registerShapeId}
                />

                <label htmlFor={shape.id}>{shape.Shape}</label>
              </div>
            );
          })}
          {errors.ShapeId &&
            shapeRepresentationIdRef === watch("RepresentationId") && (
              <p style={{ color: "red" }}>{errors.ShapeId.message}</p>
            )}
          {/* END COLORS AND SHAPE */}
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
          {errors.Image && (
            <p style={{ color: "red" }}>{errors.Image.message}</p>
          )}
          <br />
          <br />
          <button
            type="submit"
            name="btnSubmit"
            id="btnSubmit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            name="btnDelete"
            style={{ marginTop: "15px", display: "block" }}
            onClick={handleDelete}
            disabled={isDelete}
          >
            {isDelete ? "Deleting" : "Delete"}
          </button>
          <Link
            to="../.."
            relative="path"
            style={{ marginTop: "15px", display: "block" }}
          >
            Back
          </Link>
        </fieldset>
      </form>
    </>
  );
};

export default EditItems;
