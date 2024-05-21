import {
  FetchShapesResponse,
  ShapesResponseData,
} from "../../types/api/shapes";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function fetchShapes(
  token: string
): Promise<FetchShapesResponse> {
  const url = `${backend_url}/v1/shapes`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const responseData: ShapesResponseData = await response.json();

  if (response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not fetch shapes data.");
  }
}
