import React, { useEffect, useState } from "react";
import { Product } from "../../../shared/types/api/products";
import { getToken } from "../../../shared/utils/authUtil";
import {
  deleteMultipleProducts,
  fetchProduct,
} from "../../../shared/services/apihere/products";
import { fetchCategories } from "../../../shared/services/apihere/categories";
import { Link } from "react-router-dom";
import { Category } from "../../../shared/types/api/categories";
import TableRow from "../components/TableRow";

type ProductState = {
  products: Product[];
  totalProducts: number;
  totalCheckedTrue: number;
  isChecked: boolean;
};

type actionState = {
  isDelete: boolean;
  isFetching: boolean;
};

const Items: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductState>({
    products: [],
    totalProducts: 0,
    totalCheckedTrue: 0,
    isChecked: false,
  });
  const [errorMessage, setErrorMessage] = useState<string[] | string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [actionState, setActionState] = useState<actionState>({
    isDelete: false,
    isFetching: false,
  });

  useEffect(() => {
    const token = getToken() ?? "";
    const itemId = "";

    async function fetchDatas() {
      setActionState((prevActionState) => ({
        isDelete: prevActionState.isDelete,
        isFetching: true,
      }));
      try {
        const responseData = await fetchProduct(itemId, token);

        if (responseData?.status == 200 && "data" in responseData.response) {
          const products = responseData.response.data;
          const total = responseData.response.total;

          const modifiedProducts = products.map((product) => ({
            ...product,
            isChecked: false,
          }));

          const totalCheckedTrue = modifiedProducts.filter(
            (product) => product.isChecked
          ).length;

          setProducts({
            products: modifiedProducts,
            totalProducts: total,
            totalCheckedTrue,
            isChecked: false,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message || "Someting went wrong.");
          return;
        }
        setErrorMessage("An error occurred. Please try again.");
      }

      try {
        const responseData = await fetchCategories(token);

        if (responseData?.status == 200) {
          setCategories(responseData.response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message || "Someting went wrong.");
          return;
        }
        setErrorMessage("An error occurred. Please try again.");
      }
      setActionState((prevActionState) => ({
        isDelete: prevActionState.isDelete,
        isFetching: false,
      }));
    }
    fetchDatas();
  }, []);

  const error = (errorMsg: string[] | string) => {
    setErrorMessage(errorMsg);
  };

  const productsSet = (product: Product) => {
    setProducts((prevProducts) => {
      const modifiedProducts = prevProducts.products.map((prevProduct) =>
        prevProduct.id === product.id ? product : prevProduct
      );

      const totalProducts = modifiedProducts.length;

      const totalCheckedTrue = modifiedProducts.filter(
        (countProduct) => countProduct.isChecked
      ).length;

      const isChecked = totalCheckedTrue === totalProducts ? true : false;

      return {
        products: modifiedProducts,
        totalProducts,
        totalCheckedTrue,
        isChecked,
      };
    });
  };

  const handleOnChangeCheckAll = () => {
    setProducts((prevProducts) => {
      const modifiedProducts = prevProducts.products.map((product) => ({
        ...product,
        isChecked: !prevProducts.isChecked,
      }));

      const totalProducts = modifiedProducts.length;

      const totalCheckedTrue = modifiedProducts.filter(
        (product) => product.isChecked
      ).length;

      const isChecked = !prevProducts.isChecked;

      return {
        products: modifiedProducts,
        totalProducts,
        totalCheckedTrue,
        isChecked,
      };
    });
  };

  const handleDelete = async () => {
    const token = getToken() ?? "";
    const result = window.confirm("Do you want to proceed?");

    if (result) {
      const id = products.products
        .filter((product) => product.isChecked)
        .map((product) => ({ id: product.id, Name: product.Name }));

      const data = { deleteProducts: id };

      setActionState((prevActionState) => ({
        isDelete: true,
        isFetching: prevActionState.isFetching,
      }));

      try {
        const ResponseData = await deleteMultipleProducts(token, data);

        if (ResponseData?.status == 422 && "errors" in ResponseData.response) {
          const updatedData = ResponseData.response.errors.reduce(
            (object, error) => {
              object[error.path] = error.msg;
              return object;
            },
            {} as {
              [path: string]: string;
            }
          );

          setErrorMessage(Object.values(updatedData));
          setTimeout(() => setErrorMessage(""), 3000);
        }

        if (ResponseData?.status == 200 && "data" in ResponseData.response) {
          const responseDataProducts = ResponseData.response.data;
          const responseMessage = ResponseData.response.message;

          if (Array.isArray(responseDataProducts)) {
            const deltedProductId = responseDataProducts.reduce(
              (acc, product) => {
                acc.push(product.id);
                return acc;
              },
              [] as string[]
            );

            setProducts((prevProducts) => {
              const modifiedProducts = prevProducts.products.filter(
                (product) => !deltedProductId.includes(product.id)
              );

              const totalProducts = modifiedProducts.length;

              const totalCheckedTrue = modifiedProducts.filter(
                (countProduct) => countProduct.isChecked
              ).length;

              return {
                products: modifiedProducts,
                totalProducts,
                totalCheckedTrue,
                isChecked: false,
              };
            });

            setSuccessMessage(responseMessage);
            setTimeout(() => setSuccessMessage(""), 3000);
          }
        }

        setActionState((prevActionState) => ({
          isDelete: false,
          isFetching: prevActionState.isFetching,
        }));
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message || "Someting went wrong.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
        setActionState((prevActionState) => ({
          isDelete: false,
          isFetching: prevActionState.isFetching,
        }));
      }
    }
  };
  return (
    <>
      <div style={{ maxWidth: "740px", margin: "11px auto 0", width: "100%" }}>
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

        <Link to={"new"} relative="path" style={{ marginRight: "25px" }}>
          New
        </Link>

        {!!products.totalCheckedTrue && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={actionState.isDelete}
          >
            {actionState.isDelete ? "Deleting..." : "Delete"}
          </button>
        )}

        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={products.isChecked}
                  onChange={handleOnChangeCheckAll}
                />
              </th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Cost</th>
              <th>In Stock</th>
            </tr>
          </thead>
          <tbody>
            {actionState.isFetching && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  loading...
                </td>
              </tr>
            )}
            {!actionState.isFetching && products.totalProducts == 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  no record found.
                </td>
              </tr>
            )}
            {products.totalProducts != 0 &&
              products.products.map((product) => {
                return (
                  <TableRow
                    key={product.id}
                    Product={product}
                    Categories={categories}
                    errorMsg={error}
                    productsSet={productsSet}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Items;
