import {
  ImagesResponseData,
  FetchImagesResponse,
} from "../../types/api/images";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function fetchImages(
  token: string
): Promise<FetchImagesResponse> {
  const url = `${backend_url}/v1/images`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const responseData: ImagesResponseData = await response.json();

  if (response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not fetch Representations data.");
  }
}
