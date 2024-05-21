import {
  ColorsResponseData,
  FetchColorsResponse,
} from "../../types/api/colors";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function fetchColors(token: string): Promise<FetchColorsResponse> {
  const url = `${backend_url}/v1/colors`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const responseData: ColorsResponseData = await response.json();

  if (response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not fetch shapes data.");
  }
}
