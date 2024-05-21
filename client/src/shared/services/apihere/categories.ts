import {
  fetchCategoriesFunction,
  CreateCategoriesFunction,
  CategoriesForm,
  UpdateCategoriesFunction,
  CategoriesResponseSuccess,
  DeleteCategoriesResponseSuccess,
  GetCategoriesResponseSuccess,
  DeleteCategoriesFunction,
} from "../../types/api/categories";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function fetchCategories(
  token: string,
  categoryId?: string
): Promise<fetchCategoriesFunction> {
  let url = `${backend_url}/v1/categories`;

  if (categoryId) {
    url = `${backend_url}/v1/categories/${categoryId}`;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const responseData: GetCategoriesResponseSuccess = await response.json();

  if (response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not fetch shapes data.");
  }
}

export async function createCategories(
  data: CategoriesForm,
  token: string
): Promise<CreateCategoriesFunction> {
  const url = `${backend_url}/v1/categories`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  const responseData: CategoriesResponseSuccess = await response.json();

  if (response.status === 422 || response.status === 201) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not create Categories.");
  }
}

export async function updateCategories(
  data: CategoriesForm,
  categoryId: string,
  token: string
): Promise<UpdateCategoriesFunction> {
  const url = `${backend_url}/v1/categories/${categoryId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });

  const responseData: CategoriesResponseSuccess = await response.json();

  if (
    response.status === 422 ||
    response.status === 200 ||
    response.status === 404
  ) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not update Categories.");
  }
}

export async function deleteCategories(
  categoryId: string,
  token: string
): Promise<DeleteCategoriesFunction> {
  const url = `${backend_url}/v1/categories/${categoryId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const responseData: DeleteCategoriesResponseSuccess = await response.json();

  if (
    response.status === 422 ||
    response.status === 200 ||
    response.status === 404
  ) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not delete Categories.");
  }
}
