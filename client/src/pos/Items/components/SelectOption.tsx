import React, { useState } from "react";
import { Category } from "../../../shared/models/api/categories";
import { updateProductCategory } from "../../../shared/services/apihere/products";
import { getToken } from "../../../shared/utils/authUtil";

type SelectProps = {
  errorMsg: (msg: string[] | string) => void;
  Categories: Category[];
  CategoryId: string | null;
  ProductId: string;
};

const SelectOption: React.FC<SelectProps> = ({
  Categories,
  CategoryId,
  ProductId,
  errorMsg,
}) => {
  const [categoryId, setCategoryId] = useState<string>(CategoryId || "");
  const [isUpdate, setIsUpdate] = useState(false);

  const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex;
    const productId =
      event.target.options[selectedIndex].getAttribute("data-product-id") || "";
    const categoryId = event.target.value;

    setIsUpdate(true);
    try {
      const token = getToken() ?? "";

      const ResponseData = await updateProductCategory(
        token,
        productId,
        categoryId
      );

      if (ResponseData?.status === 422 && "errors" in ResponseData.response) {
        const updatedData = ResponseData.response.errors.reduce(
          (object, error) => {
            object[error.path] = error.msg;
            return object;
          },
          {} as {
            categoryId: string;
            productId: string;
            [path: string]: string;
          }
        );

        errorMsg(Object.values(updatedData));
      }

      if (ResponseData?.status == 200 && "data" in ResponseData.response) {
        setCategoryId(ResponseData.response.data.CategoryId || "");
      }
      setIsUpdate(false);
    } catch (error) {
      if (error instanceof Error) {
        errorMsg(error.message || "Someting went wrong.");
        return;
      }
      errorMsg("An error occurred. Please try again.");
      setIsUpdate(false);
    }
  };

  return (
    <>
      <select
        name="CategoryId"
        value={categoryId}
        onChange={handleSelect}
        disabled={isUpdate}
      >
        <option value={""} data-product-id={ProductId}>
          No Category
        </option>
        {Categories.map((category) => {
          return (
            <option
              key={category.id}
              value={category.id}
              data-product-id={ProductId}
            >
              {category.Name}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default SelectOption;
