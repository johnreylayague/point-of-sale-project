import {
  FetchSoldByOptionsResponse,
  SoldByOptionsResponseData,
} from "../../types/api/soldByOptions";

const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function fetchSoldByOptions(
  token: string
): Promise<FetchSoldByOptionsResponse> {
  const url = `${backend_url}/v1/soldbyoptions`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const responseData: SoldByOptionsResponseData = await response.json();

  if (response.status === 200) {
    return { response: responseData, status: response.status };
  }

  if (!response.ok) {
    throw new Error("Could not fetch data.");
  }
}
