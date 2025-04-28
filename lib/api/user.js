import { apiRequest } from "../apiFetch";

// Fungsi khusus untuk registrasi
export async function registerUser(payload) {
  return apiRequest({
    endpoint: "/public/register",
    method: "POST",
    payload,
  });
}

export async function loginUser(payload) {
  return apiRequest({
    endpoint: "/public/login",
    method: "POST",
    payload,
  });
}

export async function getUserById(id) {
  return apiRequest({
    endpoint: `/public/users/${id}`,
    method: "GET",
    credentials: "include",
  });
}

export async function getMe() {
  return apiRequest({
    endpoint: "/public/me",
    method: "GET",
    credentials: "include",
  });
}

export async function updateUser(id, payload) {
  // payload can be FormData for avatar upload or JSON for other fields
  return apiRequest({
    endpoint: `/public/users/${id}`,
    method: "PUT",
    payload,
    credentials: "include",
    isMultipart: payload instanceof FormData,
  });
}

export async function deleteUser(id) {
  return apiRequest({
    endpoint: `/public/users/${id}`,
    method: "DELETE",
    credentials: "include",
  });
}
