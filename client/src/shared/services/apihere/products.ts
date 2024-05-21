import {
  ProductForm,
  CreateProductResponseSuccess,
  CreateProductFunction,
  GetProductResponseSuccess,
  FetchProductFunction,
  DeleteProductResponseSuccess,
  DeleteProductFunction,
  UpdateProductFunction,
  UpdateProductResponseSuccess,
  UpdateProductCategoryFunction,
  UpdateProductCategoryResponseSuccess,
  DeleteGroupProductFunction,
  DeleteGroupProductResponseSuccess,
} from "../../types/api/products";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function createProduct(
  data: ProductForm,
  token: string
): Promise<CreateProductFunction> {
  const url = `${backend_url}/v1/products`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  const responseData: CreateProductResponseSuccess = await response.json();

  if (response.status === 422 || response.status === 201) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not sign up.");
  }
}

export async function updateProduct(
  data: ProductForm,
  productId: string,
  token: string
): Promise<UpdateProductFunction> {
  const url = `${backend_url}/v1/products/${productId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  const responseData: UpdateProductResponseSuccess = await response.json();

  if (
    response.status === 422 ||
    response.status === 200 ||
    response.status === 404
  ) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not update products.");
  }
}

export async function updateProductCategory(
  token: string,
  productId: string,
  categoryId: string
): Promise<UpdateProductCategoryFunction> {
  const url = `${backend_url}/v1/products/${productId}/category/${categoryId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const responseData: UpdateProductCategoryResponseSuccess =
    await response.json();

  if (
    response.status === 200 ||
    response.status === 404 ||
    response.status === 422
  ) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not update products CategoryId.");
  }
}

export async function fetchProduct(
  productId: string,
  token: string
): Promise<FetchProductFunction> {
  let url = `${backend_url}/v1/products`;

  if (productId) {
    url = `${backend_url}/v1/products/${productId}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const responseData: GetProductResponseSuccess = await response.json();

  if (response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not fetch Product.");
  }
}

export async function deleteProducts(
  token: string,
  productId: string
): Promise<DeleteProductFunction> {
  let url = `${backend_url}/v1/products/${productId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const responseData: DeleteProductResponseSuccess = await response.json();

  if (
    response.status === 200 ||
    response.status === 422 ||
    response.status === 404
  ) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not delete Products.");
  }
}

export async function deleteMultipleProducts(
  token: string,
  data: {
    deleteProducts: { id: string; Name: string }[];
  }
): Promise<DeleteGroupProductFunction> {
  const url = `${backend_url}/v1/products/deleteMultiple`;
  console.log(data);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  const responseData: DeleteGroupProductResponseSuccess = await response.json();

  if (response.status === 200 || response.status === 422) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not delete Products.");
  }
}
