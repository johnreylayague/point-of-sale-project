import {
  RepresentationsResponseData,
  FetchRepresentationsResponse,
} from "../../types/api/representations";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function fetchRepresentations(
  token: string
): Promise<FetchRepresentationsResponse> {
  const url = `${backend_url}/v1/representations`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const responseData: RepresentationsResponseData = await response.json();

  if (response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not fetch Representations data.");
  }
}
