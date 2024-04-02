export async function fetchUser() {
  const usersApiEndpoint =
    "https://65704f8309586eff66411a2b.mockapi.io/api/users";

  const response = await fetch(usersApiEndpoint);

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch User.");
  }

  return responseData;
}

export async function addUser(userData) {
  const usersApiEndpoint =
    "https://65704f8309586eff66411a2b.mockapi.io/api/users";

  const response = await fetch(usersApiEndpoint, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to add user data.");
  }

  return responseData;
}

export async function updateUser(userData) {
  const usersApiEndpoint =
    "https://65704f8309586eff66411a2b.mockapi.io/api/users/" + userData.id;

  const response = await fetch(usersApiEndpoint, {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to update user data.");
  }

  return responseData;
}

export async function deleteUser(userId) {
  const usersApiEndpoint =
    "https://65704f8309586eff66411a2b.mockapi.io/api/users/" + userId;

  const response = await fetch(usersApiEndpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to delete user data.");
  }

  return responseData;
}
